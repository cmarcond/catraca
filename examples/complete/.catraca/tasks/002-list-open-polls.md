# Tasks — 002 List open polls

> Generated from `specs/002-list-open-polls.md`. One task per behavior,
> red→green→refactor. Every commit passed the real hooks (no `--no-verify`).

Spec: `../specs/002-list-open-polls.md` · Active skills: `tdd-minimal-step`,
`test-doubles`, `test-setup-factories`, `integration-tests`,
`dependency-inversion-adapters`, `controller-error-boundary`, `layered-typing`,
`project-structure` · Layers: domain, data, presentation, infra, main

## Tasks

### T1 — DbListPolls returns the repository's polls

Criterion: list returns all polls · Layer: data

- [x] **red** — stub `ListPollsRepository` returns polls; assert `list` returns them
- [x] **green** — `DbListPolls` delegates to the injected repository
- [x] commit `feat(poll): list polls use case with injected repository` (`4b978d2`)

### T2 — Controller returns the list (200), empty when none, 500 on throw

Criteria: polls listed; empty list (not error); generic failure · Layer: presentation

- [x] **red** — stub returns polls ⇒ 200 + list; stub returns [] ⇒ 200 + []; stub throws ⇒ 500
- [x] **green** — controller calls `ListPolls`, returns `ok(list)`; try/catch → `serverError()`
- [x] **integration** — repo `list()` + factory-built controller return the stored polls
- [x] commit `feat(poll): list polls controller, repository list, and factory` (`cb95268`)

### T-final — Feature evaluation

- [x] coverage 100%; rubric in `../evaluation/002-list-open-polls.md`; `ratchet.json` updated
