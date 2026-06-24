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

### T1 — DbCreatePoll delegates to the repository (question + options) and returns the poll

Criteria: poll stored; poll returned · Layer: data

- [x] **red** — spy/stub `AddPollRepository`; assert called with `{question, options}` and that the created poll is returned
- [x] **green** — `DbCreatePoll` delegates to the injected repository
- [x] **refactor** — n/a
- [x] commit `feat(create-poll): DbCreatePoll delegates to AddPollRepository` (`ddeadf5`)

### T2 — Controller maps validation → 400, success → 200, unexpected → 500

Criteria: invalid input rejected; poll created; generic failure · Layer: presentation (`controller-error-boundary`)

- [x] **red** — validation stub returns error ⇒ 400; CreatePoll stub returns poll ⇒ 200; CreatePoll mock throws ⇒ 500
- [x] **green** — controller validates, calls `CreatePoll`, wraps the body in try/catch → `serverError()`
- [x] **refactor** — n/a
- [x] commit `feat(create-poll): controller maps validation, success, and errors to HTTP` (`e6db56e`)

### T3 — Fail-fast validators + composite (first error)

Criteria: missing question / fewer than two options · Layer: validation (`input-validation`)

- [x] **red** — `ValidationComposite` returns the first validator's error; `RequiredFieldValidation` / `MinOptionsValidation` each report their error (incl. null-input branch)
- [x] **green** — each rule a `Validation` object; composite returns the first non-null error (fail-fast)
- [x] **refactor** — n/a
- [x] commit `feat(create-poll): add fail-fast validators and validation composite` (`eecf9b6`)

### T4 — In-memory repository persists and assigns an id

Criteria: poll persisted with identifier · Layer: infra (`integration-tests`)

- [x] **red** — add a poll; assert the returned poll has an id and is stored
- [x] **green** — in-memory store, `crypto.randomUUID()` for the id
- [x] **refactor** — n/a
- [x] commit `feat(create-poll): in-memory poll repository persists and assigns ids` (`d89257b`)

### T5 — Composition root wires the controller with the real repository

Criteria: full slice wired · Layer: main (`project-structure`, composition)

- [x] **red** — factory-built controller + real in-memory repo returns 200 and persists
- [x] **green** — composition root wires controller + DbCreatePoll + repo + validation composite
- [x] **refactor** — n/a
- [x] commit `feat(create-poll): wire composition root for the create-poll controller` (`f009ea8`)

### T-final — Feature evaluation

- [x] coverage checked (100%, the profile's target)
- [x] rubric filled in `../evaluation/001-create-poll.md` with evidence
- [x] `ratchet.json` updated
