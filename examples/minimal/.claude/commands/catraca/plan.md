# /catraca.plan — Roadmap e Specs por Feature

Pré-condições: `product.md`, `architecture.md`, `method.md` preenchidos (senão,
rode `/catraca.init`). Saídas: `roadmap.md` + uma spec `specs/NNN-slug.md`
por feature.

## Passo 1 — Roadmap

1. **Toda roadmap começa pela feature 000 — esteira de qualidade.** Ela não
   vem de `product.md`; vem do método (skill `workflows/quality-pipeline`):
   gates mecânicos de type-check, lint, commit-msg, pre-commit staged-only e
   cobertura, instalados e provados antes de qualquer feature de produto. Ela
   não tem spec WHEN/THEN; suas tasks vêm de `tasks/TASKS-000-TEMPLATE.md`,
   adaptadas à stack de `architecture.md`.
2. Parta das features candidatas de `product.md`. Se houver feature de
   **deploy**, é nela que nascem Dockerfile/compose/imagem (com tasks e
   rubrica próprias) — a containerização do ambiente de dev só entra na
   esteira se G2b = containerizado.
3. Ordene por dependência de domínio (o que precisa existir antes — ex.:
   responder enquete pressupõe enquete criada, que pressupõe usuário logado).
4. Numere `001, 002, …` e preencha a tabela de `roadmap.md` com a coluna
   "Depende de" e as notas de ordenação (001 depende de 000).

**Gate E/G11 (guiado):** apresente o roadmap e peça confirmação da lista e da
ordem. Registre em `questions.md`. **Automático:** registre o roadmap como
`[assumed]` e siga.

## Passo 2 — Uma spec por feature

Para cada feature de produto do roadmap (001+; a 000 não tem spec), crie
`specs/NNN-slug.md` a partir de `specs/FEATURE-TEMPLATE.md`:

1. **Intenção** em voz de desenvolvedor, 2–5 frases.
2. **Acceptance criteria** WHEN/THEN — comportamento observável, incluindo
   casos de erro (entrada inválida, duplicidade, não autorizado…).
3. **Fora de escopo** explícito.
4. **Skills aplicáveis**: consulte `skills/index.yaml`; selecione por gatilho
   (seção "When To Use" de cada SKILL.md). Toda feature normalmente leva as de
   testing + as da(s) camada(s) tocada(s). Exclusão de skill obrigatória do
   `method.md` exige justificativa na spec.
5. **Dependências**: números das features anteriores necessárias.
6. **Rode o checklist de leakage** do template — se a spec menciona classe,
   path ou lib, reescreva antes de fechar.
7. **Revisão adversarial (antes do G12).** Delegue a revisão da spec a um
   **subagente de contexto limpo** (no Claude Code, a ferramenta Task),
   entregando apenas: `product.md`, `architecture.md`, a spec e o checklist
   adversarial de `specs/README.md`. A instrução dele é **refutar**, não
   melhorar — ele não herda esta conversa e não sabe a intenção do autor, só
   o que está escrito. Resolva cada achado (acate, ou refute com justificativa
   registrada na spec) antes de apresentar o G12. *Sem suporte a subagentes:
   faça você mesmo a revisão numa passada separada, aplicando o checklist
   item a item.*

**Gate E/G12 (guiado):** para cada spec, após a revisão adversarial, apresente
os acceptance criteria (e os achados relevantes da revisão) e peça
confirmação. **Automático:** marque `[assumed]` em `questions.md`.

## Passo 3 — Encerramento

- Atualize os checkboxes "spec" no `roadmap.md`.
- Anuncie: próxima fase `/catraca.implement`, começando pela feature 001.
