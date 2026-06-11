---
name: integration-tests
title: Testes de integração de rotas e persistência
description: Valida a borda externa de verdade — rotas via cliente HTTP de teste contra o app montado e repositórios contra um banco efêmero — cobrindo round-trip, caminho de sucesso e rejeição de auth, com limpeza por teste.
category: testing
dependencies:
  - testing/test-setup-factories
---

# Integration Tests

Prove que a borda externa funciona de verdade: a requisição entra e sai pela
aplicação montada, e o repositório escreve e lê de um banco real efêmero. O
que está sob teste não usa dublê — a borda (transporte e store) é exercitada
como em produção.

## When To Use

- Uma nova rota/endpoint/resolver foi exposto e você precisa garantir o
  contrato de status/corpo.
- Um repositório que toca o banco foi criado ou alterado (insert, load,
  update, delete).
- Um fluxo ponta a ponta depende de autenticação e precisa cobrir acesso
  concedido e negado.
- Você quer confiança de que injeção de dependências e composição do app
  estão corretas, não apenas a lógica interna.

## When Not To Use

- Lógica de unidade isolável (casos de uso, validadores compostos) que pode
  ser testada com dublês — use teste unitário.
- Validação pura de entrada sem efeito de borda.
- Regra de negócio já coberta em unidade. **Critério de promoção:**
  integração cobre a composição e o efeito de borda **uma vez por fluxo**; a
  regra de negócio fica no nível de unidade. Se um caso só varia entrada/saída
  de regra já testada, mantenha-o em unidade.

## Order Of Operations

1. **Suba o banco efêmero.** Use uma variante in-memory quando o banco tiver
   uma confiável; caso contrário, suba um container efêmero descartável. No
   setup da suíte, conecte/inicie; no teardown, desconecte e garanta o
   descarte.
2. **Garanta isolamento.** Antes de cada teste, limpe os dados do fluxo sob
   teste. Nunca dependa de estado deixado por outro teste; se a suíte usa
   seeds compartilhados, recrie-os por teste em vez de assumir ordem de
   execução.
3. **Para repositório (round-trip):** instancie o repositório real, exercite
   a operação e leia de volta para afirmar o efeito persistido —
   preferencialmente pela via que o sistema usaria (o método de leitura do
   próprio repositório). Ler direto do store é aceitável como verificação de
   persistência, mas acopla o teste ao esquema; use apenas quando não houver
   leitura legível e marque a fragilidade.
4. **Para rota/endpoint:** monte o app real e dispare a requisição via um
   cliente de transporte de teste (a requisição real, não o handler isolado).
   Use as factories de setup compartilhadas para criar entidades e
   credenciais.
5. **Cubra o par de casos da borda autenticada:** sucesso com credencial
   válida (gere a credencial via helper, persistindo o usuário) e **acesso
   negado**. Afirme o status de rejeição **definido pela spec/contrato**
   (tipicamente 401 para credencial ausente/inválida, 403 para falta de
   permissão) — não fixe um número por hábito.
6. **Afirme status E corpo** quando o corpo for parte do contrato. Asserte
   sobre a resposta do transporte, não sobre internals do framework.

## Test Checklist

- [ ] Banco efêmero iniciado no setup da suíte, fechado/descartado no
      teardown.
- [ ] Dados limpos antes de cada teste (isolamento garantido, sem dependência
      de ordem).
- [ ] Repositório testado com round-trip: escreve e lê de volta pela via do
      sistema.
- [ ] Rota testada contra o app montado, não contra handler isolado.
- [ ] Caso de sucesso presente.
- [ ] Caso de acesso negado presente para rotas autenticadas, com status do
      contrato.
- [ ] Asserções sobre status; corpo afirmado quando faz parte do contrato.
- [ ] Nenhum estado externo permanece após a suíte.

## Anti-Patterns

- **Mock do driver do banco.** Derrota o propósito; prefira banco real efêmero
  a dublar o driver.
- **Acoplar o teste ao framework de transporte.** Teste pela requisição real
  para reduzir o reteste ao trocar de biblioteca.
- **Reusar estado entre testes.** Sem limpeza por teste, a ordem de execução
  vira dependência oculta.
- **Afirmar só o retorno do método do repositório** sem verificar o que foi de
  fato persistido.
- **Esquecer o caminho negativo** de autenticação — o par sucesso/negado é o
  que cobre o contrato da borda autenticada.
- **Replicar regra de negócio** já coberta em unidade dentro de um teste de
  integração.
