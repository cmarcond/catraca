---
name: tdd-minimal-step
description: Dirija cada comportamento por um ciclo red-green-refactor, com implementação mínima sob suíte verde, repetindo por comportamento e não por arquivo.
category: testing
dependencies: []
---

# Ciclo TDD por comportamento

Cada comportamento nasce de um teste que falha pelo motivo certo, passa com a
implementação mínima e é seguido de refactor sob verde. O ciclo se repete por
comportamento, não por arquivo.

As decisões não óbvias: garantir que o red falhe pela asserção do comportamento
(e não por setup), nunca deixar um valor fixo sem o teste que o generaliza, e
fechar o passo por comportamento em vez de "terminar o arquivo".

## When To Use

- Vai implementar um comportamento observável novo com critério de aceitação
  verificável.
- O próximo passo de implementação cabe num único teste isolado.

Aplica-se a qualquer unidade que expõe comportamento observável; caso de uso,
controller e adapter são apenas exemplos da mesma forma.

## When Not To Use

- Mudança puramente de organização de arquivos (mover, renomear, reagrupar).
- Refactor sem alteração de comportamento (use a suíte existente como rede,
  sem novo teste).
- O comportamento alvo não tem critério observável; defina o critério antes de
  começar.

## Preconditions

- Feedback rápido: o subconjunto de testes relevante deve voltar em poucos
  segundos. Se a suíte completa é lenta, rode só o subconjunto do
  comportamento atual.
- Determinismo: o teste do passo não pode depender de I/O real, relógio, rede
  ou ordem. Substitua essas dependências por dublês antes de entrar no ciclo;
  isole o que é lento ou não determinístico em suítes separadas que rodam fora
  do micro-passo.
- Se não dá para obter feedback rápido e determinístico no passo, resolva isso
  primeiro: o ciclo perde sentido sem ele.

## Order Of Operations

1. Escolha um único comportamento, não um arquivo inteiro.
2. Escreva o teste desse comportamento antes da produção.
3. Rode a suíte e confirme a falha esperada (red), pela asserção do
   comportamento e não por setup ou import.
4. Implemente o mínimo que faz passar; valor fixo só é legítimo quando já
   existe (ou virá no próximo passo) um teste que força a generalização.
5. Rode a suíte até verde (green).
6. Refatore produção e teste mantendo verde; não introduza comportamento novo
   aqui.
7. Só então avance para o próximo comportamento e repita.

## Ramos de guarda: o compilador aponta o próximo red

Ramo de guarda é o código que barra um caso ruim antes do trabalho de verdade
(ex.: `if (payload === null) return null`). Ele costuma nascer torto: o
compilador exige tratar o caso ("pode ser null"), a guarda é escrita para
calar o erro de tipo, e o teste vem depois — sem nunca ter falhado.

A regra: **quando o compilador exigir tratar um caso, pare — esse é o próximo
comportamento.** Escreva primeiro o teste do caso ("token inválido devolve
null"), veja-o falhar, e só então escreva a guarda. O erro de tipo não é um
obstáculo a calar; é o compilador entregando o red de graça.

Vale o mesmo para qualquer ramo defensivo de origem mecânica: lint exigindo
default em switch, campo opcional forçando fallback. Ramo sem red próprio é
comportamento sem prova — e é exatamente onde sabotagens (inverter ou remover
a guarda) passam despercebidas pela suíte.

## Granularidade e saída do fake-it

- "Um comportamento" é a menor regra observável. Se o passo natural exige mais
  de uma asserção para descrever a mesma regra, mantenha-as no mesmo teste; se
  as asserções descrevem regras distintas, quebre em testes/passos separados.
- O fake-it (valor fixo) é ponte, não destino: pare de retornar valor fixo
  assim que um segundo caso o contradiz. Se um único caso já basta para o
  comportamento real, não use fake-it.

## Test Checklist

- [ ] O teste falhou antes de existir a implementação, pela asserção do
      comportamento.
- [ ] Um comportamento por teste; o nome descreve o comportamento, não o
      método.
- [ ] A implementação mínima é coberta por uma asserção que a força a
      generalizar.
- [ ] Após refactor, a suíte continua verde sem alterar as asserções.
- [ ] Nenhum valor fixo deliberado sobrou sem o teste que o generaliza.
- [ ] Todo ramo de guarda (caso exigido por compilador/lint) tem red próprio
      que foi visto falhar antes da guarda existir.

## Anti-Patterns

- Escrever toda a produção e só depois os testes (test-after disfarçado).
- Escrever uma guarda para calar o compilador/lint e testá-la depois — o ramo
  nasceu sem red; o teste só confirma o que já existe.
- Pular o red ou aceitar um red por erro de setup/import como se fosse o
  esperado.
- Empilhar comportamentos distintos num teste só, perdendo a granularidade do
  passo.
- Misturar refactor com novo comportamento no mesmo passo verde.
- Fechar o ciclo com valor fixo e não adicionar o teste que o obriga a
  generalizar.
- Dirigir o ciclo por arquivo ("terminar o spec") em vez de por comportamento.
