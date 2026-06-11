---
name: git-conventions
title: Convenções de commit e fluxo de git
description: Commits pontuais em conventional commits (type + descrição), com cada commit deixando a árvore num estado verificável (build/testes verdes, sem teste órfão de sua produção).
category: workflows
dependencies: []
---

# Convenções de commit e fluxo de git

Padronize cada commit como um fato pequeno e auto-contido. A mensagem segue
conventional commits com `type: descrição`; o conteúdo é recortado para que
**o estado após cada commit** passe na verificação do projeto (build e/ou
testes), sem deixar um teste órfão da produção que ele exercita.

Este padrão pressupõe que existe um passo de verificação por commit
(compilação em stacks tipadas, ou suíte de testes/build em linguagens
dinâmicas). O critério é "estado verde após o commit", não "compila".

## When To Use

- Vai registrar progresso em commits frequentes e pequenos, cada um com
  mensagem conventional.
- Acabou de implementar um comportamento novo cujo par produção+teste mudou
  junto e quer comitá-lo de forma que cada commit deixe a árvore num estado
  verde.
- Está iniciando um repositório e quer tornar o padrão de mensagem inquebrável
  via hook.

## When Not To Use

- A decisão é sobre **granularidade do conteúdo** do commit (o que entra em
  cada passo) — este padrão só governa a mensagem e a ordem dos commits, não o
  recorte do trabalho.
- O trabalho é um refactor puro sem novo teste: aí cai um commit único
  (`refactor:`), não o par produção/teste.

## Order Of Operations

1. Instale um linter de mensagem no hook **`commit-msg`**, para que mensagens
   fora do formato sejam rejeitadas na origem (a instalação acontece na
   feature 000 — ver `quality-pipeline`).
2. Use `type: descrição` em minúsculo e imperativo, sem escopo/body/footer
   obrigatórios. O vocabulário de `type` é o da config do linter; mantenha
   consistência com ela. Conjunto típico: `feat`, `fix`, `test`, `refactor`,
   `chore`, `docs`.
3. Um commit por passo; cada commit deve deixar a árvore num estado verde
   isoladamente.
4. Para um comportamento novo, comite o par produção+teste de modo que nenhum
   commit deixe um teste sem a produção que ele exercita (teste órfão). A
   invariante é "nenhum teste órfão por commit"; a ordem dos commits do par é
   um meio de garanti-la, não um critério de avaliação.

## Test Checklist

- [ ] A mensagem é `type: descrição` em minúsculo e imperativo.
- [ ] O `type` pertence ao vocabulário da config do linter.
- [ ] O hook `commit-msg` está ativo e rejeita formatos inválidos.
- [ ] Cada commit deixa a árvore num estado verde (build/testes), sem teste
      órfão de sua produção.
- [ ] Cada commit cobre um único passo/tarefa, não vários comportamentos
      misturados.
- [ ] Refactors entram como commit único com o `type` adequado, não como par
      produção/teste.

## Anti-Patterns

- Deixar um commit em que um teste referencia produção ausente da árvore
  (teste órfão), quebrando o estado verde daquele ponto.
- Mensagens com escopo, body, footer ou texto não-imperativo quando o padrão
  do projeto é só `type: descrição`.
- Usar `type` fora do vocabulário acordado no linter.
- Depender de disciplina manual em vez de um hook — o formato precisa ser
  inquebrável, não combinado.
- Agrupar vários comportamentos num só commit, perdendo o estado verde por
  passo.
