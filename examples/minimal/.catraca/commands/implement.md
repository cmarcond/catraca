# /catraca.implement — Ciclo TDD Guiado por Skills

Implementa **uma feature por vez**, na ordem do roadmap. Pré-condições: spec da
feature existe e confirmada (exceto a 000, que não tem spec). Saídas:
`tasks/NNN-slug.md` + código + testes + commits.

## Passo 0 — Feature 000: esteira de qualidade (primeira execução)

Se a feature 000 do roadmap ainda não está implementada, ela vem **antes de
qualquer feature de produto** — o ambiente com gates ativos precede a primeira
feature:

1. Crie `tasks/000-esteira-de-qualidade.md` a partir de
   `tasks/TASKS-000-TEMPLATE.md`. Comece pela T0.0: as **necessidades** são
   fixas (skill `quality-pipeline`); proponha as **ferramentas** adequadas à
   plataforma de `architecture.md` e confirme com o usuário (modo guiado) ou
   registre `[assumed]` (automático).
2. Execute as tasks na ordem: **um chore commit por ferramenta** (skill
   `quality-pipeline`, Order of Operations). Aqui não há ciclo
   red/green/refactor — o equivalente do "red" é **provocar uma violação e
   ver o gate reprovar** (mensagem de commit inválida rejeitada, lint quebrado
   bloqueando o pre-commit, teste vermelho reprovando a suite). Gate sem prova
   de reprovação não conta como instalado.
3. Capture as saídas das provas — são as evidências da rubrica da 000.
4. Avalie a 000 (`/catraca.evaluate`) antes de abrir a feature 001. A partir
   daqui, toda modificação de código passa pelos gates automaticamente.

## Passo 1 — Carregar contexto

1. Releia: `method.md` (perfil + gates), `architecture.md` (camadas,
   fronteiras), a spec da feature e **cada SKILL.md** referenciado nela.
   Leia também as **notas pedagógicas e violações das rubricas anteriores**
   (`evaluation/*.md`): lição registrada lá não pode se repetir aqui — se a
   mesma violação reaparecer, a rubrica desta feature a tratará como
   reincidência, com desconto maior.
2. Derive os critérios técnicos dos **Test Checklists** das skills — eles são
   o seu "definition of done" técnico, somado aos acceptance criteria da spec.

## Passo 2 — Gerar tasks

Crie `tasks/NNN-slug.md` a partir de `tasks/TASKS-TEMPLATE.md`:

- uma task por comportamento (menor regra observável), mapeada ao WHEN/THEN
  que cobre;
- ordem por camada: domain/data → presentation/validation → infra → main;
- cada task já nasce com os sub-itens red/green/refactor;
- última task: avaliação da feature.

## Passo 3 — Executar cada task (o ciclo)

Para cada task, nesta ordem, sem pular:

1. **RED** — escreva o teste do comportamento. Rode a suite. **Confirme que
   falha pela asserção do comportamento** (não por import/setup). Registre no
   sub-item red qual asserção falhou. *Hard gate: se você escreveu código de
   produção antes deste passo, apague-o e recomece pelo teste.*
2. **GREEN** — implemente o mínimo que faz passar. Valor fixo é ponte: só é
   aceitável se a própria task (ou a próxima) tem o teste que o generaliza.
   Rode a suite até verde.
3. **REFACTOR** — melhore produção e teste sob verde. Não introduza
   comportamento novo aqui. Se nada a refatorar, marque "n/a".
4. **Gates** — verifique os gates de `method.md` (camadas, adapter, cobertura).
5. **Commit** — se commits exigidos: um commit, `type(scope): descrição
   imperativa`, só com os arquivos desta task. Registre o hash na task.
6. Marque os checkboxes e siga para a próxima task.

Padrões por camada (consulte as skills, não invente):

- unitários com `makeSut()` e doubles (`test-setup-factories`, `test-doubles`);
- controllers com mapeamento de erro na borda (`controller-error-boundary`);
- validação composta montada por factory (`input-validation`);
- repositórios contra banco em memória (`integration-tests`);
- tipos `Params`/`Result` por use case (`layered-typing`).

## HALT

Pare e pergunte ao usuário se: ambiguidade irresolúvel pela spec/skills; mesmo
teste falhou 3+ vezes sem causa nova; precisa de dependência fora de
`architecture.md`. Fora isso, **não pare no meio da feature** — nem em modo
guiado o meio da feature é ponto de pausa.

## Encerramento da feature

- Todos os checkboxes da feature marcados, suite verde, cobertura no alvo.
- Atualize `roadmap.md` (checkbox "implementada").
- Siga para `/catraca.evaluate` da feature — a feature não está "pronta" sem
  avaliação.
