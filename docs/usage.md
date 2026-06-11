# Catraca — Guia de Uso

## 1. Instalar

```bash
python3 catraca/install.py /caminho/do/projeto
```

Cria `.catraca/` (templates, comandos, 13 skills) e, por default, os atalhos
de slash command em `.claude/commands/catraca/`. Re-rodar é seguro: idêntico
é pulado; divergente é preservado (nova versão em `*.new`; com `--force`,
backup `*.bak` e sobrescrita).

## 2. Começar um projeto

Abra o agente (Claude Code) na pasta do projeto e cole o prompt inicial —
**só a ideia do produto**. Stack se decide no Gate B; TDD/Clean
Architecture/SOLID são constitucionais (`manifesto.md`) e não precisam ser
pedidos. Exemplo:

> Quero criar uma API REST de enquetes. Siga `.catraca/CLAUDE.md` e rode
> `/catraca.init` em modo guiado.

Para modo automático, acrescente:

> Use modo automático: assuma os defaults do método e registre as suposições.

## 3. O fluxo

```
prompt inicial
   └─ /catraca.init      perguntas (gates A–D) ou defaults → product.md,
                           architecture.md, method.md, questions.md
   └─ /catraca.plan      roadmap.md (começa pela feature 000 — esteira de
                           qualidade) + specs/NNN-*.md (gate E por feature)
   └─ /catraca.implement feature 000 primeiro: gates mecânicos (type-check,
                           lint, commit-msg, pre-commit staged-only, cobertura),
                           cada um provado por reprovação; depois, por feature
                           de produto: tasks red/green/refactor + código +
                           commits
   └─ /catraca.evaluate  rubrica com evidências + ratchet.json
   └─ (repete implement/evaluate por feature até o fim do roadmap)

/catraca.status          a qualquer momento: onde estamos, próxima ação,
                           reconciliação de decisões revisadas
```

## 4. As perguntas que o agente fará (modo guiado)

- **Gate A**: objetivo real, usuários, o que o usuário consegue fazer quando
  estiver pronto.
- **Gate B**: plataforma e linguagem (server-side; client-side se houver;
  banco); ambiente de desenvolvimento (local com infraestrutura efêmera —
  default — ou containerizado desde o início); Clean Architecture estrita
  (5 camadas) ou leve (3); que dependências isolar atrás de adapters. As
  ferramentas de qualidade não são perguntadas aqui — a feature 000 as propõe
  conforme a plataforma escolhida.
- **Gate C**: rigor do TDD (estrito/pragmático); skills obrigatórias e
  opcionais; commits pequenos exigidos ou recomendados.
- **Gate D**: avaliação rígida, pedagógica ou pragmática; ratchet em regressão
  alerta (`warn`), bloqueia (`block`) ou aciona reparo automático (`repair` —
  tasks R na lista da feature + uma reavaliação; sem recuperar, devolve ao
  usuário).
- **Gate E** (por feature): confirmação do roadmap e dos acceptance criteria.

Sempre um gate por vez; respostas ficam em `.catraca/questions.md`.

## 5. Modo automático

Sem perguntas. O agente assume o perfil canônico — TDD estrito, 5 camadas,
toda lib via adapter, cobertura 100% bloqueante, conventional commits um por
task, avaliação pedagógica, ratchet em alerta — e grava cada suposição como
`[assumed AAAA-MM-DD]` em `questions.md`. Pausa apenas em HALT: ambiguidade
irresolúvel, 3+ falhas consecutivas no mesmo teste, regressão de ratchet em
modo bloqueio, dependência não prevista.

**Revisão posterior:** edite a coluna "Revisão" em `questions.md` e rode
`/catraca.status` — o agente propaga a mudança aos artefatos afetados.

## 6. Como o método entra no workflow

As 13 skills (em `.catraca/skills/`) são a solução canônica:

- na **spec**, cada feature declara as skills aplicáveis (só referência);
- na **implementação**, o agente deriva os critérios técnicos dos *Test
  Checklists* das skills e segue sua *Order of Operations*;
- na **avaliação**, cada skill declarada vira uma linha da rubrica, pontuada
  pelo próprio Test Checklist e descontada pelos *Anti-Patterns*.

## 7. Como saber se a implementação seguiu o método

1. **Rubrica por feature** (`.catraca/evaluation/NNN-*.md`): score 0–1 por
   skill e pelas dimensões `test_first`, `layer_discipline`, `coverage`,
   `commit_discipline` — cada linha com evidência (comando + saída, teste,
   commit). Verdict: aderente / parcial / não aderente.
2. **Ratchet** (`.catraca/ratchet.json`): guarda o melhor score por
   feature/dimensão; re-execuções abaixo de `melhor − 0.05` geram alerta
   (`warn`) ou param o trabalho (`block`).

## 8. Limitações conhecidas (MVP)

- Os comandos são roteiros em Markdown e dependem da disciplina do agente —
  **exceto os gates de qualidade**: a feature 000 instala hooks que reprovam
  mecanicamente commit/push (type-check, lint, mensagem de commit, testes do
  staged, cobertura), independente do agente.
- A avaliação é feita pelo mesmo agente que implementou (mitigada pela
  exigência de evidência; avaliador independente é evolução natural).
- Integração nativa apenas com Claude Code; outros agentes usam os mesmos
  Markdown manualmente.
