# Tasks — 000 Quality Pipeline

> A mandatory feature that precedes any product feature (skill
> `workflows/quality-pipeline`: "automatic gates, not discipline"). It comes from
> the method, not `product.md`. No red/green/refactor cycle: each tool enters as
> a **chore**, and the "red" equivalent is a gate proof (provoke a violation,
> watch it get rejected). The test script passes with no tests during setup
> (`vitest run --passWithNoTests`), so every setup commit clears the real hook —
> **no `--no-verify` anywhere**.

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
| Scoped test runner | Vitest (`vitest run`); `--passWithNoTests` so setup commits pass |
| Coverage as a gate | `@vitest/coverage-v8`, 100% threshold in `vitest.config.ts` |

### T0.0b — Containerized environment *(skipped: G2b = local)*

Not applicable — the store is in-memory and recreated per test.

### T0.1 — Project skeleton + type-checking as the first gate

- [x] `tsc --noEmit` strict; the first source file ships with the gate so `tsc`
      has inputs (no "No inputs were found")
- [x] commit `chore(pipeline): add strict TypeScript type-check gate` (`f0adf9f`)

### T0.2 — Lint with zero warnings

- [x] ESLint flat config; zero warnings is the criterion (namespaces allowed for
      layered `Params`/`Result` types)
- [x] **gate proof**: a staged `any` is rejected (see T0.6)
- [x] commit `chore(pipeline): add ESLint zero-warning gate` (`a888d46`)

### T0.3/T0.4 — Test runner, coverage gate, and hooks

- [x] Vitest with `--passWithNoTests`; coverage threshold 100%
- [x] `.githooks/commit-msg` (conventional commits) + `.githooks/pre-commit`
      (typecheck + lint + test), activated with `core.hooksPath` before the first
      commit
- [x] commits `chore(pipeline): add Vitest runner with coverage gate` (`b79822f`),
      `chore(pipeline): add git hooks for commit-msg and pre-commit` (`a807c2f`)

### T0.5 — Bootstrap proof: setup commits pass the real hook with no tests

- [x] the scaffold commit (`420320c`) ran the real pre-commit with zero tests:
      typecheck + lint + `vitest run --passWithNoTests` ("No test files found,
      exiting with code 0") → committed **without `--no-verify`**

### T0.6 — End-to-end verification of the pipeline

- [x] gate proofs captured (see `evaluation/000-quality-pipeline.md`): invalid
      commit message rejected; staged lint error (`any`) rejected; a red test
      makes the suite fail. Breakages reverted.

### T-final — Feature evaluation

- [x] rubric filled in `../evaluation/000-quality-pipeline.md`
- [x] `ratchet.json` updated
