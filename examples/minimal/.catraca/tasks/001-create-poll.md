# Tasks — 001 Create a poll

> Generated from `specs/001-create-poll.md`. One task per behavior; each task
> with an explicit red/green/refactor cycle. State = checkboxes.

Spec: `../specs/001-create-poll.md` · Active skills: `tdd-minimal-step`,
`test-doubles`, `test-setup-factories`, `integration-tests`,
`dependency-inversion-adapters`, `controller-error-boundary`, `input-validation`,
`layered-typing`, `project-structure` · Layers touched: domain, data,
presentation, validation, infra, main

## Tasks

### T1 — DbCreatePoll calls the repository with the question and options

Criterion covered: poll is stored · Layer: data

- [x] **red** — `db-create-poll.spec.ts`: spy on `AddPollRepository.add`, assert called with `{ question, options }`
- [x] **green** — `DbCreatePoll` delegates to the injected repository
- [x] **refactor** — n/a
- [x] gates verified · commit `feat(poll): DbCreatePoll calls repository and returns created poll` (`c23610a`)

### T2 — DbCreatePoll returns the created poll

Criterion covered: poll returned with id/question/options · Layer: data

- [x] **red** — stub repository returns a poll; assert `create` returns it
- [x] **green** — return the repository's result
- [x] **refactor** — n/a
- [x] gates verified · commit (same as T1: `c23610a`)

### T3 — Controller returns 400 when validation fails

Criterion covered: missing question / too few options rejected · Layer: presentation

- [x] **red** — `create-poll-controller.spec.ts`: validation stub returns an error; assert 400 + error body
- [x] **green** — controller calls `Validation.validate`; on error returns `badRequest`
- [x] **refactor** — n/a
- [x] gates verified · commit `feat(poll): CreatePollController validates, returns 200, and 500 on throw` (`1fef63c`)

### T4 — Controller returns 200 with the created poll on success

Criterion covered: poll stored and returned · Layer: presentation

- [x] **red** — `CreatePoll` stub returns a poll; assert 200 + poll body
- [x] **green** — controller calls `CreatePoll.create`, returns `ok(poll)`
- [x] **refactor** — n/a
- [x] gates verified · commit (same as T3: `1fef63c`)

### T5 — Controller returns 500 when the use case throws

Criterion covered: generic failure, no leak · Layer: presentation (`controller-error-boundary`)

- [x] **red** — `CreatePoll` mock throws; assert 500 generic response
- [x] **green** — wrap the body in try/catch, return `serverError()`
- [x] **refactor** — n/a
- [x] gates verified · commit (same as T3: `1fef63c`)

### T6 — ValidationComposite returns the first validator's error

Criterion covered: bad request explains the first violation · Layer: validation (`input-validation`)

- [x] **red** — `validation-composite.spec.ts`: two stubbed validators; assert the first error is returned
- [x] **green** — composite iterates and returns the first non-null error
- [x] **refactor** — n/a
- [x] gates verified · commit `feat(poll): ValidationComposite returns the first validator error` (`4f05396`)

### T7 — RequiredFieldValidation and MinOptionsValidation each report their error

Criterion covered: missing field / fewer than two options · Layer: validation

- [x] **red** — per-validator specs assert the right error on violation (incl. null/array-shape branches)
- [x] **green** — each rule implemented as a small `Validation` object
- [x] **refactor** — added the null-input branch tests in `test(poll): cover null-input branch in field validators` (`7d71e8c`)
- [x] gates verified · commit `feat(poll): add required-field and min-options field validators` (`23b346c`)

### T8 — PollMemoryRepository stores and returns a poll with an id

Criterion covered: poll persisted with identifier · Layer: infra (`integration-tests`)

- [x] **red** — `poll-memory-repository.spec.ts`: add a poll, assert returned poll has an id and is retrievable
- [x] **green** — in-memory store, `crypto.randomUUID()` for the id
- [x] **refactor** — n/a
- [x] gates verified · commit `feat(poll): in-memory AddPollRepository generates id and persists` (`84da16a`)

### T9 — Factory-built controller + real in-memory repo returns 200 and persists

Criterion covered: full slice wired · Layer: main (`project-structure`, composition)

- [x] **red** — `create-poll-controller-factory.spec.ts`: real repo, assert 200 and the poll is stored
- [x] **green** — composition root wires controller + DbCreatePoll + repo + validation composite
- [x] **refactor** — dropped unused barrel files (`refactor(poll): drop unused barrel files for direct imports`, `615256c`)
- [x] gates verified · commit `feat(poll): wire create-poll controller factory with real in-memory repo` (`2fd98bb`)

### T-final — Feature evaluation

- [x] coverage checked (100%, the profile's target)
- [x] rubric filled in `../evaluation/001-create-poll.md` with evidence
- [x] `ratchet.json` updated
