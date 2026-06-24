# Evaluation — 001 Create a poll

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.

Spec: `../specs/001-create-poll.md` · Date: 2026-06-23 · Evaluation mode: pedagogical

## Per declared skill

| Skill | Score (0–1) | Evidence (command/output/test/commit) | Violation | Justified? |
|---|---|---|---|---|
| `testing/tdd-minimal-step` | 1.0 | `git log` shows test/feat commits per behavior (T1–T9); red driven before green. | — | — |
| `testing/test-doubles` | 1.0 | Stubs for success and a mock that throws for the 500 path (`create-poll-controller.spec.ts`). | — | — |
| `testing/test-setup-factories` | 1.0 | `makeSut()` factories return `{ sut, ...stubs }` in each unit spec. | — | — |
| `testing/integration-tests` | 1.0 | `poll-memory-repository.spec.ts` and `create-poll-controller-factory.spec.ts` use the real in-memory store, no mocks. | — | — |
| `architecture/dependency-inversion-adapters` | 1.0 | `DbCreatePoll` and `CreatePollController` take collaborators via constructor; composition in `main/factories`. | — | — |
| `architecture/controller-error-boundary` | 1.0 | Controller wraps the body in try/catch → generic `serverError()` (T5). | — | — |
| `architecture/error-observability` | 0.8 | Boundary returns a generic 500 with no leak, but the logging adapter is deferred (no destination wired yet). | logging adapter not present | yes (see `method.md` G7) |
| `foundational/input-validation` | 1.0 | Each rule a `Validation` object; `ValidationComposite` returns the first error; composite built by a factory. | — | — |
| `domain-conventions/layered-typing` | 1.0 | `CreatePoll.Params`/`Result` and `AddPollRepository.Params`/`Result` namespaced; infra imports no domain model. | — | — |
| `domain-conventions/project-structure` | 1.0 | Files grouped by layer; tests mirrored under `tests/`. | — | — |

## Transversal dimensions

| Dimension | Score (0–1) | Evidence |
|---|---|---|
| `test_first` | 1.0 | One behavior per task, red before green; `git log --oneline` shows the TDD sequence. |
| `layer_discipline` | 1.0 | `grep` confirms: domain imports only domain; no third-party/`node:` import outside `infra` (`node:crypto` only in `poll-memory-repository.ts`). |
| `coverage` | 1.0 | `vitest run --coverage`: All files 100% (statements/branches/functions/lines). |
| `commit_discipline` | 1.0 | Conventional commits, ~one per behavior; all feature-001 commits passed the real hooks (no `--no-verify`). |

## Execution evidence

```
$ npm run typecheck      # tsc --noEmit → exit 0 (clean)
$ npm run lint           # eslint . --max-warnings=0 → exit 0 (zero warnings)
$ npm run test:coverage
 Test Files  7 passed (7)
      Tests  19 passed (19)
 All files          |     100 |      100 |     100 |     100 |
```

Files touched: `src/{domain,data,presentation,validation,infra,main}/**`,
`tests/**`
Commits: `df1495c`, `c23610a`, `4608502`, `1fef63c`, `23b346c`, `4f05396`,
`84da16a`, `7d71e8c`, `615256c`, `2fd98bb`

## Audit

Clean context (subagent): self · Directed mutations: 3 applied, 0 survivors —
(1) `ValidationComposite` iterated in reverse → the first-error test failed;
(2) `DbCreatePoll` dropped `options` (sent `[]`) → the "calls repository with the
question and options" test failed; (3) the controller's `catch` returned 400
instead of 500 → the error-boundary test failed. Each mutation was run via
`vitest run <spec>`, confirmed to fail, and reverted with `git checkout`; the
full suite is 19/19 green afterward. · Findings: none (no surviving mutant;
coverage is asserted, not just executed).

## Verdict

**adherent** — all transversal dimensions at 1.0; the only sub-1.0 skill is
`error-observability`, justified by the deferred logging adapter recorded at
Gate G7.

## Ratchet

- [x] `ratchet.json` updated (higher scores recorded)
- [x] Regressions? none (first product feature; baseline)

## Pedagogical notes

- The mutation pass is the test of the test: 100% line coverage only became
  trustworthy once each critical link survived no mutation.
- `error-observability` is intentionally partial here — the boundary discipline
  (generic 500, no leak) is in place; the logging destination arrives with a
  later feature. Recording the gap is the method working, not failing.
