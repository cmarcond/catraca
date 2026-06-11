---
name: controller-error-boundary
description: Concentrar tratamento de exceção na borda de entrada — domínio e repositórios propagam, a borda traduz a exceção inesperada em erro genérico (500), e ausência com semântica de negócio vira fallback/vazio na camada de dados.
category: architecture
dependencies:
  - architecture/dependency-inversion-adapters
  - testing/test-doubles
---

# Boundary de erros: propagar no domínio, traduzir na borda

Há um único papel onde uma exceção inesperada vira resposta ao cliente: a
**borda de entrada** — o lugar que traduz exceção em resposta. No estilo
controller-explícito isso é um try/catch externo no controller; em frameworks
com middleware de erro, exception filter ou handler central, esse mesmo papel
é cumprido pela borda do framework. O princípio não exige um local físico,
exige que exista **uma** borda responsável e que nada abaixo dela suprima o
erro. Tudo abaixo propaga; a camada de dados converte em resultado apenas
quando a falha tem significado de negócio.

## When To Use

- Definir como a borda responde a uma **exceção inesperada de dependência**
  (caso de uso, repositório, adapter externo) — não validação de entrada, não
  erro de domínio com status próprio.
- Distinguir **falha técnica** (exceção inesperada → 500) de **ausência
  esperada** (registro inexistente, credencial cuja invalidez é um caso de
  negócio → vazio/fallback).
- Garantir contrato estável quando qualquer dependência interna lança.
- Decidir onde NÃO suprimir uma exceção ao revisar uma camada interna.

## When Not To Use

- Validação de entrada do request: é regra explícita, retorna 400 — use
  `input-validation`, não a borda de erro técnico.
- Erro de domínio que merece status próprio (403, 404, 409): deve ser
  **retorno tipado** decidido na camada de aplicação/borda antes de virar
  exceção, não capturado no catch genérico de 500. A decisão de status
  acontece no mapeamento explícito do resultado tipado, não no catch.
- Logging do erro: mantenha-o fora do catch de negócio
  (decorator/middleware de observabilidade) — o ponto é não acoplar logging à
  tradução de resposta.

## Order Of Operations

1. Nas camadas internas (caso de uso, repositório), não **suprima** nem
   converta erro técnico em sucesso silencioso. Deixe a exceção da dependência
   atravessar até a borda.
2. Identifique se a falha tem semântica de negócio. Se sim, é responsabilidade
   da camada de dados (passo 3); se não, propaga até a borda (passo 4).
3. Na camada de dados, converta a **ausência semântica** em resultado:
   dependência retorna vazio → consulta alternativa ou vazio; decodificação
   que falha por dado inválido esperado (não por bug) → capture localmente e
   devolva vazio. Toda conversão precisa de um requisito de negócio nomeado e
   coberto por teste.
4. Na borda, traduza qualquer exceção não mapeada em **erro genérico (500)**
   ao cliente. O corpo da resposta não carrega detalhes internos: o erro
   completo (stack, mensagem do driver) vai apenas para observabilidade, fora
   do payload.
5. A borda é o último anel. Nenhuma camada interna pode engolir a exceção que
   deveria chegar até ela.

### try/catch interno é permitido quando NÃO suprime

A proibição vale para try/catch que **engole** a exceção ou a transforma em
sucesso falso. São legítimos e não violam o boundary:

- `try/finally` para liberação de recurso e cleanup, sem capturar a exceção.
- Capturar para **traduzir em erro tipado de domínio** e **re-lançar** (o erro
  continua subindo, só muda de tipo).
- Retry / circuit-breaker em torno de uma dependência instável, desde que o
  erro final ainda propague quando a política esgota.

## Test Checklist

- [ ] Camada interna: teste que, quando a dependência lança, a exceção propaga
      sem virar sucesso.
- [ ] Borda: teste que, quando uma dependência lança exceção inesperada, a
      resposta é o erro genérico (500) e o corpo **não** expõe detalhes
      internos.
- [ ] Camada de dados com fallback: para cada fallback vazio/consulta-
      alternativa, um teste que **nomeia o requisito de negócio** que o motiva
      (ligando à intenção/critério de aceitação) — exercitando o caminho de
      ausência.
- [ ] Camada de dados com fallback: teste também o caminho feliz, provando que
      o fallback só dispara na ausência.
- [ ] Falha técnica dentro de um método com fallback: erro inesperado ainda
      propaga e não é mascarado pelo retorno vazio. Distinga no teste a
      ausência esperada (dado válido, sem registro) do erro técnico (dado
      corrompido/bug).

## Anti-Patterns

- try/catch interno que **engole** o erro "por segurança": mascara a origem e
  impede o 500 na borda. (Diferente de try/finally ou rethrow tipado, que são
  válidos.)
- Mais de uma borda traduzindo exceção técnica em resposta: fragmenta o
  tratamento e produz contratos inconsistentes.
- Fallback vazio sem requisito nomeado e testado: esconde bugs reais de
  infraestrutura sob "ausência esperada".
- Vazar exceção de infraestrutura crua na resposta: a borda retorna erro
  genérico ao cliente; detalhes vão só para os logs.
- Capturar erro de domínio com status próprio (403/404) no catch genérico de
  500: ele deveria ser resultado tipado mapeado explicitamente.
