# 001 — Create a poll

> Intent spec. No classes, paths, libraries, or signatures (see `README.md`).

## Intent

An organizer needs to create a poll by giving a question and a list of answer
options. A poll with a missing question, or with fewer than two options, must be
rejected with a clear reason. A created poll comes back with an identifier so it
can be referenced later.

## Acceptance criteria

<!-- EARS (see README.md). -->

- When an organizer submits a poll with a non-empty question and at least two
  options, the system shall store it and return it with an identifier, the
  question, and the options.
- If a poll is submitted without a question, then the system shall reject it as a
  bad request naming the missing field.
- If a poll is submitted with fewer than two options, then the system shall
  reject it as a bad request explaining the minimum.
- If storing the poll fails unexpectedly, then the system shall return a generic
  failure with no internal detail.

## Out of scope

- Listing polls (feature 002) and voting (feature 003).
- Editing, closing, or deleting a poll.
- Duplicate-question detection.

## Applicable skills

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
