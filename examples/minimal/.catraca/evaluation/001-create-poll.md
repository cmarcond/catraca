# Evaluation — 001 Create a poll

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.

Spec: `../specs/001-create-poll.md` · Date: 2026-06-23 · Evaluation mode: pedagogical

## Per declared skill

| Skill | Score (0–1) | Evidence | Violation | Justified? |
|---|---|---|---|---|
| `testing/tdd-minimal-step` | 1.0 | `git log` shows feat commits per behavior; red driven before green. | — | — |
| `testing/test-doubles` | 1.0 | Stubs for success, a mock that throws for the 500 path. | — | — |
| `testing/test-setup-factories` | 1.0 | `makeSut()` factories return `{ sut, ...stubs }` per spec. | — | — |
| `testing/integration-tests` | 1.0 | Repository and factory specs use the real in-memory store, no mocks. | — | — |
| `architecture/dependency-inversion-adapters` | 1.0 | Constructor injection throughout; composition in `main/factories`. | — | — |
| `architecture/controller-error-boundary` | 1.0 | try/catch → generic `serverError()`; validation 400 is a typed result, not the 500 path. | — | — |
| `architecture/error-observability` | 0.8 | Generic 500 with no leak, but the logging adapter is deferred. | logging adapter not present | yes (method.md G7) |
| `foundational/input-validation` | 1.0 | Each rule a `Validation` object; composite returns the first error (fail-fast); built by a factory. | — | — |
| `domain-conventions/layered-typing` | 1.0 | `CreatePoll`/`AddPollRepository` namespaced `Params`/`Result`; infra imports no domain model. | — | — |
| `domain-conventions/project-structure` | 1.0 | Files grouped by layer; tests mirror the tree. | — | — |

## Transversal dimensions

| Dimension | Score (0–1) | Evidence |
|---|---|---|
| `test_first` | 1.0 | One behavior per task, red before green; `git log` shows the sequence. |
| `layer_discipline` | 1.0 | domain imports only domain; no third-party/`node:` import outside `infra` (`node:crypto` only in the memory repo). |
| `coverage` | 1.0 | `vitest run --coverage`: All files 100% (statements/branches/functions/lines). |
| `commit_discipline` | 1.0 | Conventional commits; all feature-001 commits passed the real hooks (no `--no-verify`). |

## Execution evidence

```
$ npm run typecheck      # tsc --noEmit → exit 0 (clean)
$ npm run lint           # eslint . --max-warnings=0 → exit 0 (zero warnings)
$ npm run test:coverage
 Test Files  7 passed (7)
      Tests  20 passed (20)
 All files          |     100 |      100 |     100 |     100 |
```

Commits: `ddeadf5`, `e6db56e`, `eecf9b6`, `d89257b`, `f009ea8`

## Audit

Clean context (subagent): self · Directed mutations: 3 applied, 0 survivors —
(1) `ValidationComposite` iterated in reverse → first-error test failed;
(2) `DbCreatePoll` dropped `options` → the "calls repository with question and
options" test failed; (3) the controller's `catch` returned 400 instead of 500 →
the error-boundary test failed. Each was run via `vitest run <spec>`, confirmed
to fail, and reverted; the full suite is 20/20 green afterward. · Findings: none.

## Verdict

**adherent** — all transversal dimensions 1.0; the only sub-1.0 skill is
`error-observability`, justified by the deferred logging adapter (Gate G7).

## Ratchet

- [x] `ratchet.json` updated (baseline)
- [x] Regressions? none (first product feature)

## Pedagogical notes

- The mutation pass is the test of the test: 100% line coverage became
  trustworthy only once each critical link died to a mutation.
- `error-observability` is intentionally partial here — the boundary discipline
  (generic 500, no leak) is in place; the logging destination arrives with a
  later feature. Recording the gap is the method working.
