# Method — Perfil do Método neste Projeto

> Gerado por `/catraca.init` a partir dos Gates C e D (ou defaults). Os
> princípios são constitucionais (`manifesto.md`) e não se negociam; este
> arquivo fixa **o rigor com que se aplicam aqui**. Regras operacionais:
> `.catraca/skills/`.

## Perfil de rigor

| Dimensão | Valor neste projeto | Default canônico | Origem |
|---|---|---|---|
| TDD | | estrito (red→green→refactor por comportamento) | |
| Clean Architecture | | estrita (5 camadas) | |
| Cobertura | | 100% como gate bloqueante | |
| Commits | | conventional commits, um por task, exigidos | |
| Avaliação | | pedagógica | |
| Ratchet | | repair (opções: warn / block / repair) | |

## Skills neste projeto

> Consulte `.catraca/skills/index.yaml` para a lista completa. Marque cada
> uma como obrigatória, opcional ou não aplicável (com justificativa).

| Skill | Status | Justificativa (se não obrigatória) |
|---|---|---|
| `testing/tdd-minimal-step` | obrigatória | |
| `testing/test-doubles` | obrigatória | |
| `testing/test-setup-factories` | obrigatória | |
| `testing/integration-tests` | obrigatória | |
| `architecture/dependency-inversion-adapters` | obrigatória | |
| `architecture/controller-error-boundary` | obrigatória | |
| `architecture/error-observability` | obrigatória | |
| `foundational/input-validation` | obrigatória | |
| `refactor/single-responsibility` | obrigatória | |
| `domain-conventions/layered-typing` | obrigatória | |
| `domain-conventions/project-structure` | obrigatória | |
| `workflows/git-conventions` | obrigatória | |
| `workflows/quality-pipeline` | obrigatória | |

## Gates operacionalizados

Antes de marcar qualquer task como feita, o agente verifica:

- [ ] **G-Test-First**: o teste do comportamento falhou antes da implementação,
      pela asserção (não por setup/import).
- [ ] **G-Camadas**: nenhum import viola a tabela de `architecture.md`.
- [ ] **G-Adapter**: nenhuma lib de terceiros importada fora de `infra`/`main`.
- [ ] **G-Cobertura**: cobertura não caiu (alvo do perfil acima).
- [ ] **G-Commit**: commit no formato `type(scope): descrição imperativa`
      cobrindo só esta task (se commits exigidos).

Violações são permitidas apenas com justificativa registrada na rubrica da
feature (`evaluation/NNN-*.md`, coluna "violação justificada") — e contam
contra o score conforme o modo de avaliação.

**Enforcement mecânico:** estes gates não dependem da disciplina do agente. A
**feature 000 (esteira de qualidade)** — obrigatória antes de qualquer feature
de produto — instala hooks que os reprovam automaticamente a cada commit:
type-check estrito, lint zero-warnings, validação de mensagem de commit,
pre-commit com lint+testes sobre o staged e gate de cobertura (skill
`workflows/quality-pipeline`: "gates automáticos, não disciplina"). O agente
verifica; o hook reprova.
