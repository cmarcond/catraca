# 001 — Create a poll

> Intent spec. No classes, paths, libraries, or signatures (see `README.md`).

## Intent

An organizer needs to create a poll by giving a question and a list of answer
options. A poll with a missing question, or with fewer than two options, must be
rejected with a clear reason. A created poll comes back with an identifier so it
can be referenced later.

## Acceptance criteria

- **WHEN** a poll is created with a non-empty question and at least two options
  **THEN** the poll is stored and returned with an identifier, the question, and
  the options.
- **WHEN** a poll is submitted without a question **THEN** it is rejected as a
  bad request naming the missing field.
- **WHEN** a poll is submitted with fewer than two options **THEN** it is
  rejected as a bad request explaining the minimum.
- **WHEN** storing the poll fails unexpectedly **THEN** the caller gets a generic
  failure (no internal detail leaks).

## Out of scope

- Listing polls (feature 002) and voting (feature 003).
- Editing, closing, or deleting a poll.
- Duplicate-question detection.

## Applicable skills

<!-- Ids from .catraca/skills/index.yaml. Reference only. -->

- `testing/tdd-minimal-step`
- `testing/test-doubles`
- `testing/test-setup-factories`
- `testing/integration-tests`
- `architecture/dependency-inversion-adapters`
- `architecture/controller-error-boundary`
- `architecture/error-observability`
- `foundational/input-validation`
- `domain-conventions/layered-typing`
- `domain-conventions/project-structure`
- `refactor/single-responsibility`
- `workflows/git-conventions`

## Dependencies

- 000 (quality pipeline)

## Leakage checklist

- [x] No classes/files/libraries/signatures in the text above.
- [x] All criteria are testable as behavior.
- [x] Referenced skills exist in the index.
