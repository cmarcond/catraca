# 002 — List open polls

> Intent spec. No classes, paths, libraries, or signatures (see `README.md`).
> **Spec only — not yet implemented** (this example is mid-flight).

## Intent

A voter needs to see the polls available to vote on. Listing returns each poll's
question and options so the voter can choose. When there are no polls, listing
returns an empty result rather than an error.

## Acceptance criteria

- **WHEN** polls exist **THEN** listing returns all of them, each with its
  identifier, question, and options.
- **WHEN** no polls exist **THEN** listing returns an empty list (not an error).
- **WHEN** reading the polls fails unexpectedly **THEN** the caller gets a
  generic failure.

## Out of scope

- Pagination, filtering, or sorting.
- Showing vote tallies (that arrives with feature 003).

## Applicable skills

- `testing/tdd-minimal-step`
- `testing/test-doubles`
- `testing/test-setup-factories`
- `testing/integration-tests`
- `architecture/dependency-inversion-adapters`
- `architecture/controller-error-boundary`
- `domain-conventions/layered-typing`
- `domain-conventions/project-structure`
- `workflows/git-conventions`

## Dependencies

- 001 (a poll must exist before it can be listed)

## Leakage checklist

- [x] No classes/files/libraries/signatures in the text above.
- [x] All criteria are testable as behavior.
- [x] Referenced skills exist in the index.
