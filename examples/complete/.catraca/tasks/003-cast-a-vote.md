# Tasks — 003 Cast a vote

> Generated from `specs/003-cast-a-vote.md`. One task per behavior,
> red→green→refactor. Includes a **ratchet repair** task (R1) — see the section
> at the end and `../evaluation/003-cast-a-vote.md`.

Spec: `../specs/003-cast-a-vote.md` · Active skills: `tdd-minimal-step`,
`test-doubles`, `test-setup-factories`, `integration-tests`,
`dependency-inversion-adapters`, `controller-error-boundary`, `input-validation`,
`layered-typing`, `project-structure` · Layers: domain, data, presentation,
validation, infra, main

## Tasks

### T1 — Record a vote for an existing poll and valid option

Criterion: vote recorded against the option · Layer: data + presentation

- [x] **red** — load-poll stub returns a poll; assert the vote is saved against the option and 200 returned
- [x] **green** — `DbCastVote` loads the poll, validates the option, saves the vote
- [x] **refactor** — n/a

### T2 — Poll not found → 404; option not part of poll → 400; unexpected → 500

Criteria: not found / invalid option / generic failure · Layer: presentation (`controller-error-boundary`)

- [x] **red** — missing poll ⇒ 404; option not in poll ⇒ 400; use case throws ⇒ 500
- [x] **green** — typed results mapped at the controller (`notFound` / `badRequest`); try/catch → `serverError()`
- [x] commit `feat(vote): cast a vote with poll/option validation` (`403bf0f`)

> ⚠️ This commit also introduced a **layer-discipline violation**: `DbCastVote`
> (data) imported the concrete `PollMemoryRepository` from `infra` directly. It
> type-checked, linted clean, and passed all tests at 100%, so it cleared the
> pre-commit hook — but it breaks the dependency rule. Caught at evaluation.

## Regression repair — ratchet (mode: repair)

### R1 — Remove the data→infra import; depend on a protocol

Degraded dimension: `layer_discipline` (feature 003)

- [x] **red** — evidence of the regression: import inspection shows
      `src/data/usecases/db-cast-vote.ts` importing from `infra/` (see evaluation)
- [x] **green** — introduce `data/protocols/load-poll-by-id-repository.ts`; inject
      it into `DbCastVote` via the constructor; the concrete infra class is now
      referenced only in `main/factories`
- [x] **refactor** — under green; suite still 100%
- [x] re-run import inspection → 0 violations; commit
      `refactor(vote): inject load-poll protocol, remove data->infra import (R1)` (`a799c6d`)

### T-final — Feature evaluation (re-evaluated once after R1)

- [x] coverage 100%; rubric in `../evaluation/003-cast-a-vote.md`; `ratchet.json` updated (recovered)
