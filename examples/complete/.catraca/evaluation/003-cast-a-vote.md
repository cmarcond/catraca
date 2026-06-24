# Evaluation — 003 Cast a vote

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.
> **This feature demonstrates a ratchet repair cycle** (mode: `repair`).

Spec: `../specs/003-cast-a-vote.md` · Date: 2026-06-24 · Evaluation mode: pedagogical

## First evaluation — regression detected

At first evaluation, the import inspection from `architecture.md` found a
**data → infra dependency-rule violation** that the mechanical gates missed (it
type-checked, linted clean, and passed all tests at 100%, so it cleared the
pre-commit hook at commit `403bf0f`):

```
$ grep -rn "infra/" src --include="*.ts" | grep -v "src/infra/\|src/main/"
src/data/usecases/db-cast-vote.ts:3:import { PollMemoryRepository } from '../../infra/db/memory/poll-memory-repository.js';
```

`layer_discipline` dropped below `best − buffer` (1.00 → ~0.83: one of ~6 data
units violating). Ratchet mode is `repair`, so task **R1** was appended (see
`tasks/003-cast-a-vote.md`).

## Repair (R1) and re-evaluation

R1 introduced `data/protocols/load-poll-by-id-repository.ts`, injected it into
`DbCastVote`, and left the concrete infra class referenced only in
`main/factories`. Re-running the inspection on the repaired tree (`a799c6d`):

```
$ grep -rn "infra/" src --include="*.ts" | grep -v "src/infra/\|src/main/"
(no matches — 0 violations)
```

`layer_discipline` recovered to **1.00**. Behavior unchanged; suite still 49
passed at 100%. The scores below are the **post-repair** state.

## Per declared skill

| Skill | Score (0–1) | Evidence | Violation | Justified? |
|---|---|---|---|---|
| `testing/tdd-minimal-step` | 1.00 | red before green per behavior | — | — |
| `testing/test-doubles` | 1.00 | load-poll stub; throwing mock for the 500 path | — | — |
| `testing/test-setup-factories` | 1.00 | `makeSut()` returns sut + stubs | — | — |
| `testing/integration-tests` | 1.00 | factory + real store records the vote | — | — |
| `architecture/dependency-inversion-adapters` | 1.00 | **after R1**: `DbCastVote` depends on a protocol, injected; infra only in `main` | data→infra import (pre-R1) | repaired |
| `architecture/controller-error-boundary` | 1.00 | not-found → 404, invalid option → 400 (typed results); unexpected → 500 | — | — |
| `foundational/input-validation` | 1.00 | option-belongs-to-poll checked; bad option → 400 | — | — |
| `domain-conventions/layered-typing` | 1.00 | namespaced types; infra imports no domain model | — | — |
| `domain-conventions/project-structure` | 1.00 | files grouped by layer; tests mirror the tree | — | — |

## Transversal dimensions

| Dimension | Score (0–1) | Evidence (counts) |
|---|---|---|
| `test_first` | 1.00 | each behavior red before green |
| `layer_discipline` | 1.00 | **post-repair**: 0 illegal imports (was violated pre-R1) |
| `coverage` | 1.00 | 100% (49-test suite) |
| `commit_discipline` | 1.00 | conventional commits incl. the R1 `refactor` |

## Execution evidence

```
$ npm run typecheck   # exit 0   $ npm run lint   # exit 0
$ npm run test:coverage   # 49 passed, All files 100%
```

Commits: `403bf0f` (feature, with the violation), `a799c6d` (R1 repair)

## Evaluator

- **Identity**: `self (not independent)` — hand-built demonstration example.
- **Directed mutations**: 1 applied, 0 survivors — the controller returning `ok`
  instead of `notFound` for a missing poll → the 404 test failed; reverted.
- **Disagreement vs implementer self-score**: none.
- **Findings**: the layer violation above (caught, repaired).

## Verdict

**adherent** (after repair) — all dimensions 1.00. The repair cycle recovered the
floor in one pass.

## Ratchet

- [x] `ratchet.json` updated — `layer_discipline` recovered to 1.00
- [x] Regressions? `layer_discipline` regressed (data→infra import) → repaired
      via R1 → recovered. Repair adherence, not behavior (the vote logic was
      never reverted).

## Pedagogical notes

- This is the point of the rubric and the ratchet: a dependency-rule violation
  can pass every **mechanical** gate (types, lint, tests, coverage) yet still be
  wrong. The evaluation's import inspection is the net that catches it, and
  `repair` mode turns the catch into a fix instead of a shrug.
- Mechanical enforcement could be tightened later (an ESLint import-boundary
  rule), which would move this from a rubric catch to a commit-time gate.
