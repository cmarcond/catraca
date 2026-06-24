# Evaluation — 001 Create a poll

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.

Spec: `../specs/001-create-poll.md` · Date: 2026-06-24 · Evaluation mode: pedagogical

## Per declared skill

<!-- score = max(0, met/applicable − 0.25 × anti-patterns), 2 decimals. -->

| Skill | Score (0–1) | Evidence | Violation | Justified? |
|---|---|---|---|---|
| `testing/tdd-minimal-step` | 1.00 | red before green per behavior; `git log` shows the sequence | — | — |
| `testing/test-doubles` | 1.00 | stub classes for success, a double that raises for the 500 path | — | — |
| `testing/test-setup-factories` | 1.00 | `make_sut()` returns sut + stubs in each unit test | — | — |
| `testing/integration-tests` | 1.00 | repo + factory tests use the real in-memory store, no doubles | — | — |
| `architecture/dependency-inversion-adapters` | 1.00 | constructor injection; `Protocol`s; composition in `main/factories` | — | — |
| `architecture/controller-error-boundary` | 1.00 | try/except → generic `server_error()`; 400 is a typed result | — | — |
| `architecture/error-observability` | 0.80 | 5 applicable items (3 N/A: no logging destination), 4 met → 4/5 | logging adapter deferred | yes (method.md G7) |
| `foundational/input-validation` | 1.00 | each rule a `Validation`; composite returns the first error (fail-fast) | — | — |
| `domain-conventions/layered-typing` | 1.00 | params/result types per use case; infra imports no domain model | — | — |
| `domain-conventions/project-structure` | 1.00 | files grouped by layer; tests mirror the tree | — | — |

## Transversal dimensions

| Dimension | Score (0–1) | Evidence (counts) |
|---|---|---|
| `test_first` | 1.00 | each behavior red before green; `git log` shows it |
| `layer_discipline` | 1.00 | modules inspected, 0 illegal cross-layer imports |
| `coverage` | 1.00 | `pytest --cov`: 130 stmts, 0 miss, 100% (fail-under 100 passed) |
| `commit_discipline` | 1.00 | conventional commits, ~one per behavior, all hook-verified |

## Execution evidence

```
$ ruff check .            # All checks passed!  (exit 0)
$ mypy --strict src tests # Success: no issues found in 54 source files
$ pytest
 TOTAL  130  0  10  0  100%
 Required test coverage of 100% reached. Total coverage: 100.00%
 20 passed
```

Files touched: `src/polls/{domain,data,presentation,validation,infra,main}/**`, `tests/**`
Commits: `c2ab686`, `f3335e6`, `3a98380`, `a5ccb7b`, `558ce88`, `5b6af30`, `8c87052`, `1d95097`

## Evaluator

- **Identity**: `self (not independent)` — hand-built demonstration example; a
  real run uses an independent clean-context evaluator (`commands/evaluate.md`).
- **Directed mutations**: 3 applied, 0 survivors — (1) `ValidationComposite`
  iterated in `reversed()` → first-error test failed; (2) `DbCreatePoll` dropped
  `options` → repository-call test failed; (3) the controller's `except` returned
  400 instead of 500 → error-boundary test failed. Each run via
  `pytest <test> --no-cov`, confirmed to fail, reverted; suite 20/20 green.
- **Disagreement vs implementer self-score**: none.
- **Findings**: none.

## Verdict

**adherent** — all four dimensions = 1.00; the only sub-1.0 skill is
`error-observability` (0.80), justified by the deferred logging adapter (G7).

## Ratchet

- [x] `ratchet.json` updated (baseline)
- [x] Regressions? none (first product feature)

## Pedagogical notes

- This is the same feature as the TypeScript example, proving the method is
  stack-agnostic: the skills, gates, and rubric apply unchanged; only the tools
  differ (pytest/ruff/mypy vs Vitest/ESLint/tsc).
- Python bootstrap caveat: with `--cov-fail-under` in `addopts`, an empty `pytest`
  exits 1 (coverage failure), not 5 — so the pre-commit probes `pytest --no-cov`
  first. Fed back to the `quality-pipeline` skill.
