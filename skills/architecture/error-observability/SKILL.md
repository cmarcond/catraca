---
name: error-observability
title: Observabilidade de erros na borda
description: Todo erro inesperado que vira resposta genérica (500) é registrado com contexto completo fora do payload; o registro é desacoplado da tradução de resposta (decorator/middleware) e o destino do log fica atrás de protocolo/adapter.
category: architecture
dependencies:
  - architecture/controller-error-boundary
  - architecture/dependency-inversion-adapters
---

# Observabilidade de erros na borda

A borda de erro (`controller-error-boundary`) protege o cliente: resposta
genérica, sem detalhes internos. Esta skill protege **quem opera**: o erro
completo (tipo, mensagem, stack, contexto da requisição) é registrado num
destino de observabilidade — senão o 500 genérico vira caixa-preta e a falha
de produção fica invisível.

Princípios: o registro acontece **uma vez, na borda** (não espalhado pelas
camadas); é **desacoplado da tradução de resposta** (um decorator ou
middleware embrulha a borda — o controller de negócio não conhece logging); e
o **destino é detalhe substituível** (stdout estruturado, arquivo, banco,
serviço — atrás de protocolo + adapter, como qualquer lib).

## When To Use

- O projeto tem uma borda que traduz exceção inesperada em resposta genérica
  (toda aplicação com `controller-error-boundary`).
- O projeto vai a produção ou a qualquer ambiente onde alguém precisará
  diagnosticar falhas sem debugger.

## When Not To Use

- Spikes descartáveis.
- Logging de **negócio** (auditoria, trilha de eventos): é requisito de
  domínio, com spec própria — não confunda com observabilidade de erro.
- Métricas/tracing completos: evoluções legítimas, mas fora do escopo mínimo
  desta skill (que é: nenhum 500 sem registro).

## Order Of Operations

1. Declare o **protocolo de registro de erro** (ex.: `LogErrorRepository` ou
   equivalente) na camada que o consome.
2. Implemente o registro como **decorator/middleware da borda**: embrulha o
   controller/handler; em resposta de erro inesperado, registra o erro
   completo e repassa a resposta intacta. O controller de negócio não muda.
3. Garanta a divisão: **payload** carrega só o erro genérico; **registro**
   carrega tudo (stack, contexto). Nunca o contrário.
4. Implemente o **adapter do destino** na infra (stdout estruturado é um
   default honesto; banco/serviço quando houver requisito).
5. Componha o decorator no ponto de composição (`main`), aplicado a toda
   borda — não caso a caso.
6. Teste com **spy do protocolo**: erro inesperado ⇒ registrador chamado com
   o erro completo e resposta segue genérica; caminho feliz ⇒ nada registrado.

## Test Checklist

- [ ] Existe um teste: dependência lança erro inesperado ⇒ o protocolo de
      registro é chamado com o erro completo (stack incluído).
- [ ] Existe um teste: caminho feliz ⇒ nenhum registro de erro.
- [ ] O payload da resposta de erro não contém stack/detalhes (reforço do
      checklist da `controller-error-boundary`).
- [ ] O registro acontece num ponto único (decorator/middleware), não dentro
      dos controllers de negócio.
- [ ] O destino do log está atrás de protocolo + adapter, com teste próprio.
- [ ] Nenhum dado sensível (senha, token, credencial) aparece no registro.

## Anti-Patterns

- `catch {}` que descarta o erro: o 500 sai correto e ninguém nunca sabe o
  que houve.
- Prints/`console.log` espalhados pelas camadas em vez de um ponto único na
  borda.
- Stack ou mensagem interna no payload da resposta (o oposto simétrico).
- Logging dentro do controller de negócio, acoplando regra à observabilidade.
- Registrar dados sensíveis da requisição junto com o erro.
- Logar e **engolir**: registrar o erro e devolver sucesso — o registro não
  substitui a propagação.
