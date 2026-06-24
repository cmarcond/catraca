# Tasks — 000 Quality Pipeline

> A mandatory feature that precedes any product feature (skill
> `workflows/quality-pipeline`: "automatic gates, not discipline"). It does not
> come from `product.md` — it comes from the method. It does not follow a
> red/green/refactor cycle: each tool enters as a separate **chore**, and the
> equivalent of "red" is to **provoke a violation and watch the gate reject it**.

Active skills: `workflows/quality-pipeline`, `workflows/git-conventions`,
`domain-conventions/project-structure`

## Tasks

### T0.0 — Map requirements → propose tools for this platform

- [x] requirement → proposed-tool table filled in below
- [x] guided mode: proposal confirmed (TypeScript stack, see `architecture.md`)

| Requirement | Proposed tool (for this stack) |
|---|---|
| Type-checking | `tsc --noEmit` (strict) |
| Zero-warnings lint | ESLint flat config + `typescript-eslint`, `--max-warnings=0` |
| Commit-message hook | `.githooks/commit-msg` (conventional-commit regex) |
| Pre-commit staged-only (lint+tests) | `.githooks/pre-commit` (typecheck + lint + test) |
| Scoped test runner | Vitest (`vitest run`) |
| Coverage as a gate | `@vitest/coverage-v8`, 100% threshold in `vitest.config.ts` |

### T0.0b — Containerized environment *(skipped: G2b = local)*

Not applicable — the store is in-memory and recreated per test; nothing is
installed as a service. (See `questions.md` G2b.)

### T0.1 — Project skeleton + type-checking as the first gate

- [x] directory structure by layer (per `architecture.md`)
- [x] `tsc --noEmit` strict; type error is rejected (proven during T0.6)
- [x] commit `chore(pipeline): add strict TypeScript config` (`47191d9`)

### T0.2 — Lint with zero warnings

- [x] ESLint flat config; zero warnings is the criterion
- [x] **gate proof**: a staged file with an unused var is rejected (see T0.6)
- [x] commit `chore(pipeline): add ESLint flat config with zero warnings` (`33d6d92`)

### T0.3 — Commit-message hook

- [x] `.githooks/commit-msg` validates conventional commits
- [x] **gate proof**: `git commit -m "bad message"` rejected (see T0.6)
- [x] commit `chore(pipeline): add commit-msg and pre-commit git hooks` (`26a2b01`)

### T0.4 — Pre-commit running lint + tests over the staged files

- [x] `.githooks/pre-commit` runs typecheck + lint + tests; rejects on failure
- [x] **gate proof**: broken lint ⇒ commit rejected (see T0.6)
- [x] commit (same as T0.3: `26a2b01`)

### T0.5 — Test runner with scopes + coverage gate

- [x] Vitest configured; coverage threshold 100% (lines/functions/branches/statements)
- [x] **gate proof**: a deliberately failing test ⇒ suite red (see T0.6)
- [x] commit `chore(pipeline): add Vitest config with 100% coverage gate` (`ee4653d`)

### T0.6 — End-to-end verification of the pipeline

- [x] full sequence proven (the three gate proofs captured in `evaluation/000-quality-pipeline.md`):
  - invalid commit message rejected by `commit-msg`;
  - staged lint error rejected by `pre-commit`;
  - a red test rejects the suite.
- [x] proofs recorded for the rubric

> **Bootstrap note (honest record):** the six `chore(pipeline)` setup commits
> used `--no-verify`, because the `pre-commit` hook runs `npm test` and Vitest
> exits non-zero when **no test files exist yet**. This is the standard
> pipeline-bootstrap exception: the gate cannot pass before there is anything to
> test. Every commit from `df1495c` onward (all of feature 001) went through the
> real hooks with no bypass.

### T-final — Feature evaluation

- [x] rubric filled in `../evaluation/000-quality-pipeline.md`
- [x] `ratchet.json` updated
