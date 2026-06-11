---
name: test-doubles
description: Isolar a unidade sob teste com dublês — spy verifica interação, stub fornece happy path por padrão, mock cobre falha/ausência, e um relógio fixo torna asserções de data determinísticas.
category: testing
dependencies:
  - testing/test-setup-factories
---

# Test Doubles: spies, stubs e mocks de falha

Substitua cada colaborador externo da unidade por um dublê controlado para que
o teste asserte comportamento da unidade, não da dependência real. A técnica é
independente de linguagem.

## When To Use

- A unidade depende de colaborador externo (repositório, adapter de
  criptografia, gerador de token, validador, outro caso de uso) e você precisa
  provar **integração**: o método foi chamado com os valores corretos.
- Você precisa cobrir o **contrato de erro**: a unidade propaga ou trata a
  falha/ausência vinda da dependência.
- O fluxo gera ou compara datas e a asserção exige um relógio estável — este
  gatilho vale mesmo sem colaborador externo, pois é sobre determinismo
  temporal.

## When Not To Use

- Teste de rota real, banco real ou ponta a ponta → use `integration-tests`,
  não dublês.
- Função pura sem dependências → teste entrada→saída direto.
- Não crie dublê para uma dependência que a unidade nem usa só para "ter
  cobertura".
- Quando você precisa exercitar o comportamento real da dependência (ex.:
  lógica de um repositório em memória), prefira um **fake/in-memory** a um
  stub: o fake mantém estado coerente entre chamadas; o stub apenas responde
  valores fixos por chamada.

## Order Of Operations

1. Liste as dependências reais da unidade pelo seu **contrato (interface)**,
   não pela implementação concreta.
2. Construa cada dublê retornando o **happy path por padrão** (stub válido),
   montado via factory de SUT compartilhada — ver `test-setup-factories`. O
   default do stub deve **diferir do valor assertado** (ex.: id retornado ≠ id
   de entrada), para que a asserção não passe por coincidência.
3. Escreva o teste de **integração com spy**: capture os argumentos recebidos
   e asserte que a dependência foi chamada com os valores corretos.
4. Escreva o teste de **retorno de sucesso**: usa o SUT puro, sem sobrescrever
   nenhum dublê.
5. Para cada dependência, escreva o teste de **falha**: sobrescreva
   pontualmente o dublê para falhar e asserte o contrato de erro. Defina o que
   o contrato verifica — apenas que a falha **propaga**, ou também o
   **tipo/identidade** do erro.
6. Cubra os caminhos de **ausência** (dependência retorna "vazio") onde o
   contrato distingue ausência de erro.
7. Se o fluxo envolve datas, fixe o relógio antes do bloco e restaure depois,
   cobrindo todos os pontos que geram data.

## Test Checklist

- [ ] Caso de sucesso roda só com os defaults da factory (nenhum mock
      pontual).
- [ ] Existe um teste "chama X com os valores corretos" por dependência
      relevante.
- [ ] Existe um teste "propaga erro" por dependência que pode falhar, com a
      **falha fiel à assinatura** (operação assíncrona falha pelo canal
      assíncrono; síncrona, lançando).
- [ ] Casos de ausência são distintos dos casos de exceção.
- [ ] Datas usam relógio fixo; nenhum ponto de geração de data ficou fora do
      congelamento.
- [ ] Spy assertou interação **e** há um teste separado assertando o retorno
      (spy não cobre resultado).
- [ ] Estado capturado e dublês sobrescritos são **resetados entre casos**
      (não só datas) — sem vazamento entre testes.
- [ ] Se a unidade precisou de muitos dublês para ser testada, reavalie a
      decomposição: excesso de colaboradores a isolar sinaliza acoplamento ou
      responsabilidade demais na unidade.

## Anti-Patterns

- Mockar tudo no caso de sucesso: torna o arranjo ruidoso e esconde o happy
  path. Sobrescreva só nos negativos.
- Asserção contra um default mágico do stub igual ao valor esperado — escolha
  defaults distintos do assertado.
- Acoplar o teste à assinatura interna da implementação concreta em vez do
  contrato; quebra a cada refactor inócuo.
- Mock de falha com assinatura errada (sucesso onde deveria falhar) — o teste
  passa por engano.
- Esquecer de restaurar o relógio/dublê entre testes, gerando falhas
  intermitentes ou vazamento de estado.
