# Evaluation — 001 Create a poll

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.

Spec: `../specs/001-create-poll.md` · Date: 2026-06-24 · Evaluation mode: pedagogical

## Per declared skill

<!-- score = max(0, met/applicable − 0.25 × anti-patterns), 2 decimals. -->

| Skill | Score (0–1) | Evidence (command/output/test/commit) | Violation | Justified? |
|---|---|---|---|---|
| `testing/tdd-minimal-step` | 1.00 | red driven before green per behavior; `git log` shows the sequence | — | — |
| `testing/test-doubles` | 1.00 | stubs for success, a mock that throws for the 500 path | — | — |
| `testing/test-setup-factories` | 1.00 | `makeSut()` returns `{ sut, ...stubs }` in each unit spec | — | — |
| `testing/integration-tests` | 1.00 | repository + factory specs use the real in-memory store, no mocks | — | — |
| `architecture/dependency-inversion-adapters` | 1.00 | constructor injection throughout; composition in `main/factories` | — | — |
| `architecture/controller-error-boundary` | 1.00 | try/catch → generic `serverError()`; validation 400 is a typed result | — | — |
| `architecture/error-observability` | 0.80 | 5 applicable items (3 N/A: no logging destination wired), 4 met, 0 anti-patterns → 4/5 | logging adapter deferred | yes (method.md G7) |
| `foundational/input-validation` | 1.00 | each rule a `Validation` object; composite returns the first error (fail-fast) | — | — |
| `domain-conventions/layered-typing` | 1.00 | namespaced `Params`/`Result`; infra imports no domain model | — | — |
| `domain-conventions/project-structure` | 1.00 | files grouped by layer; tests mirror the tree | — | — |

## Transversal dimensions

<!-- each = compliant / total, 2 decimals. -->

| Dimension | Score (0–1) | Evidence (counts) |
|---|---|---|
| `test_first` | 1.00 | 5 behaviors, each red seen before green → 5/5 |
| `layer_discipline` | 1.00 | 13 new units inspected, 0 illegal imports → 13/13 |
| `coverage` | 1.00 | runner reports 100%, target 100% → min(1, 100/100) |
| `commit_discipline` | 1.00 | 5 feature commits, all conventional + one-per-task → 5/5 |

## Execution evidence

```
$ npm run typecheck      # tsc --noEmit → exit 0 (clean)
$ npm run lint           # eslint . --max-warnings=0 → exit 0 (zero warnings)
$ npm run test:coverage
 Test Files  7 passed (7)
      Tests  20 passed (20)
 All files          |     100 |      100 |     100 |     100 |
```

Files touched: `src/{domain,data,presentation,validation,infra,main}/**`, `tests/**`
Commits: `ddeadf5`, `e6db56e`, `eecf9b6`, `d89257b`, `f009ea8`

## Evaluator

- **Identity**: `self (not independent)` — this is a hand-built demonstration
  example; a real run uses an independent clean-context evaluator (see
  `commands/evaluate.md`, Step 2).
- **Directed mutations**: 3 applied, 0 survivors — (1) `ValidationComposite`
  iterated in reverse → first-error test failed; (2) `DbCreatePoll` dropped
  `options` → "calls repository with question and options" test failed; (3) the
  controller's `catch` returned 400 instead of 500 → error-boundary test failed.
  Each run via `vitest run <spec>`, confirmed to fail, reverted; suite 20/20 green.
- **Disagreement vs implementer self-score**: none (single self-evaluation).
- **Findings**: none.

## Verdict

**adherent** — all four dimensions = 1.00 (≥ 0.9); the only sub-1.0 skill is
`error-observability` (0.80), justified by the deferred logging adapter (G7).

## Ratchet

- [x] `ratchet.json` updated (baseline)
- [x] Regressions? none (first product feature)

## Pedagogical notes

- The mutation pass is the test of the test: 100% line coverage became
  trustworthy only once each critical link died to a mutation.
- `error-observability` is intentionally partial — boundary discipline (generic
  500, no leak) is in place; the logging destination arrives with a later
  feature. Recording the gap is the method working.
