# Tasks — 001 Create a poll

> Generated from `specs/001-create-poll.md`. One task per behavior, red→green→
> refactor. State = checkboxes. Every commit passed the real hooks (no
> `--no-verify`).

Spec: `../specs/001-create-poll.md` · Active skills: `tdd-minimal-step`,
`test-doubles`, `test-setup-factories`, `integration-tests`,
`dependency-inversion-adapters`, `controller-error-boundary`, `input-validation`,
`layered-typing`, `project-structure` · Layers: domain, data, presentation,
validation, infra, main

## Tasks

### T1 — DbCreatePoll forwards question and options to the repository

Criterion: poll stored · Layer: data

- [x] **red** — spy `AddPollRepository`; assert called with question + options
- [x] **green** — `DbCreatePoll` delegates to the injected repository
- [x] commit `feat(create-poll): DbCreatePoll forwards question and options to repository` (`c2ab686`)

### T2 — DbCreatePoll returns the poll built by the repository

Criterion: poll returned · Layer: data

- [x] **red/characterization** — stub returns a poll; assert `create` returns it
- [x] **green** — returns the repository's result (already minimal from T1)
- [x] commit `test(create-poll): DbCreatePoll returns the poll built by the repository` (`f3335e6`)

### T3 — Controller returns 400 / 200 / 500 at the boundary

Criteria: invalid input → 400; success → 200; unexpected → 500 · Layer: presentation (`controller-error-boundary`)

- [x] **red** — validation stub error ⇒ 400; CreatePoll stub ⇒ 200; CreatePoll raises ⇒ 500
- [x] **green** — controller validates, calls `CreatePoll`, wraps in try/except → `server_error()`
- [x] note — the 100% branch gate forces the three responses into one commit
- [x] commit `feat(create-poll): controller returns 400/200/500 at the request boundary` (`3a98380`)

### T4 — RequiredFieldValidation rejects missing/empty fields

Layer: validation (`input-validation`)

- [x] red → green; commit `feat(create-poll): RequiredFieldValidation rejects missing or empty fields` (`a5ccb7b`)

### T5 — MinOptionsValidation enforces the minimum option count

Layer: validation

- [x] red → green; commit `feat(create-poll): MinOptionsValidation enforces the minimum option count` (`558ce88`)

### T6 — ValidationComposite returns the first error (fail-fast)

Layer: validation

- [x] red → green; commit `feat(create-poll): ValidationComposite returns the first error (fail-fast)` (`5b6af30`)

### T7 — In-memory repository stores polls with a uuid id

Layer: infra (`integration-tests`)

- [x] red → green; commit `feat(create-poll): in-memory AddPollRepository stores polls with a uuid id` (`8c87052`)

### T8 — Factory wires controller + use case + real in-memory repo

Layer: main (`project-structure`, composition)

- [x] red → green (integration: returns 200 and persists); commit `feat(create-poll): factory wires controller, use case and in-memory repo` (`1d95097`)

### T-final — Feature evaluation

- [x] coverage checked (100%, the profile's target)
- [x] rubric filled in `../evaluation/001-create-poll.md` with evidence
- [x] `ratchet.json` updated
