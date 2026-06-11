# Instruções para o Agente

Este projeto usa o **Catraca**, um framework spec-driven. O nome é apenas
marca: produto, domínio, papéis e desenho vêm exclusivamente do usuário e dos
artefatos deste diretório.

## Ordem de leitura

1. `manifesto.md` — princípios constitucionais: TDD, Clean Architecture,
   SOLID. Valem em qualquer projeto que use o framework; não dependem do
   prompt e não se perguntam ao usuário.
2. `method.md` — o rigor com que os princípios se aplicam **neste** projeto
   (preenchido no init).
3. `commands/` — o roteiro de cada fase: `init` → `plan` → `implement` →
   `evaluate`; `status` a qualquer momento. Siga o roteiro da fase atual; se
   não souber qual é, rode `status`. Não improvise fases.
4. `skills/` — as regras operacionais do método. Na implementação, derive os
   critérios técnicos dos **Test Checklists** das skills declaradas na spec.

## Regras de operação

- **Decisões do usuário acontecem nos gates.** Em modo guiado, pergunte nos
  pontos definidos pelos comandos, um bloco por vez, e grave as respostas em
  `questions.md`. Em modo automático, use os defaults do `method.md` e grave
  cada suposição como `[assumed]`. Fora dos gates, não invente decisões de
  produto.
- **Esteira antes de features.** A feature 000 instala hooks que reprovam
  commit/push (type-check, lint, mensagem de commit, testes do staged,
  cobertura) antes de qualquer feature de produto. Gate sem prova de
  reprovação não conta como instalado.
- **Test-first.** Nenhum código de produção sem um teste que falhou antes
  pela asserção do comportamento. Se escreveu produção antes do teste, apague
  e recomece pelo teste.
- **Specs são intenção.** `specs/` descreve comportamento (WHEN/THEN), nunca
  classes, paths, libs ou assinaturas. O "como" mora nas skills.
- **Dependências apontam para dentro.** Respeite as fronteiras de
  `architecture.md`; lib de terceiros só via adapter.
- **Estado é Markdown.** Progresso vive nos checkboxes de `tasks/` e nos
  arquivos de `evaluation/`. Não crie estado paralelo.
- **Evidência antes de "pronto".** Feature só fecha com rubrica preenchida em
  `evaluation/` e `ratchet.json` atualizado.

## HALT — pare e pergunte ao usuário quando

- uma ambiguidade não puder ser resolvida pelas specs nem pelas skills;
- o mesmo teste falhar 3+ vezes consecutivas sem causa nova;
- o ratchet acusar regressão e o modo for `block` — ou for `repair` e um
  ciclo de reparo não tiver recuperado o piso;
- a implementação pedir uma dependência não prevista em `architecture.md`.

Fora desses casos, não pare no meio de uma feature por "progresso
significativo".

## Mapa de `.catraca/`

| Arquivo/pasta | Papel |
|---|---|
| `manifesto.md` | Princípios constitucionais (invariáveis) |
| `method.md` | Perfil de rigor + gates deste projeto |
| `questions.md` | Perguntas, respostas e suposições `[assumed]` |
| `product.md` | O que o produto é (intenção, sem técnica) |
| `architecture.md` | Stack, camadas, fronteiras, adapters |
| `roadmap.md` | Features ordenadas (000 = esteira de qualidade) |
| `skills/` | Regras operacionais do método |
| `specs/NNN-*.md` | Uma spec de intenção por feature |
| `tasks/NNN-*.md` | Tasks red/green/refactor por feature |
| `evaluation/NNN-*.md` | Rubrica + evidências por feature |
| `ratchet.json` | Melhores scores; acusa regressão |
| `commands/` | Roteiros das fases |
