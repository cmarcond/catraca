# Evaluation — 002 List open polls

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.

Spec: `../specs/002-list-open-polls.md` · Date: 2026-06-24 · Evaluation mode: pedagogical

## Per declared skill

| Skill | Score (0–1) | Evidence | Violation | Justified? |
|---|---|---|---|---|
| `testing/tdd-minimal-step` | 1.00 | red before green per behavior; `git log` | — | — |
| `testing/test-doubles` | 1.00 | stub repository for success, a throwing mock for the 500 path | — | — |
| `testing/test-setup-factories` | 1.00 | `makeSut()` returns sut + stub | — | — |
| `testing/integration-tests` | 1.00 | factory-built controller + real in-memory store returns the stored polls | — | — |
| `architecture/dependency-inversion-adapters` | 1.00 | `DbListPolls` takes the repository via the constructor | — | — |
| `architecture/controller-error-boundary` | 1.00 | empty list is a normal 200; only unexpected throws → 500 | — | — |
| `domain-conventions/layered-typing` | 1.00 | `ListPolls.Result` namespaced; infra imports no domain model | — | — |
| `domain-conventions/project-structure` | 1.00 | files grouped by layer; tests mirror the tree | — | — |

## Transversal dimensions

| Dimension | Score (0–1) | Evidence (counts) |
|---|---|---|
| `test_first` | 1.00 | each behavior red before green |
| `layer_discipline` | 1.00 | units inspected, 0 illegal imports |
| `coverage` | 1.00 | 100% (part of the 49-test suite) |
| `commit_discipline` | 1.00 | conventional commits, hook-verified |

## Execution evidence

```
$ npm run test:coverage   # 49 passed, All files 100%
```

Commits: `4b978d2`, `cb95268`

## Evaluator

- **Identity**: `self (not independent)` — hand-built demonstration example.
- **Directed mutations**: 1 applied, 0 survivors — `DbListPolls` returning `[]`
  instead of the repository's result → the "returns all polls" test failed;
  reverted.
- **Disagreement vs implementer self-score**: none.
- **Findings**: none.

## Verdict

**adherent** — all dimensions 1.00.

## Ratchet

- [x] `ratchet.json` updated (baseline for 002)
- [x] Regressions? none

## Pedagogical notes

- "Empty list, not an error" is a typed business outcome (200 with `[]`), not an
  exception — keeping the 500 path for the truly unexpected.
