# 003 — Cast a vote

> Intent spec. No classes, paths, libraries, or signatures (see `README.md`).
> **Spec only — not yet implemented** (this example is mid-flight).

## Intent

A voter needs to cast a vote for one option of an existing poll. The vote is
recorded against the chosen option. A vote for a poll that does not exist, or for
an option that is not part of the poll, is rejected.

## Acceptance criteria

- **WHEN** a vote names an existing poll and a valid option **THEN** the vote is
  recorded against that option.
- **WHEN** a vote names a poll that does not exist **THEN** it is rejected as not
  found.
- **WHEN** a vote names an option that is not part of the poll **THEN** it is
  rejected as a bad request.
- **WHEN** recording the vote fails unexpectedly **THEN** the caller gets a
  generic failure.

## Out of scope

- One-vote-per-person enforcement (no accounts in this version).
- Showing or computing results.

## Applicable skills

- `testing/tdd-minimal-step`
- `testing/test-doubles`
- `testing/test-setup-factories`
- `testing/integration-tests`
- `architecture/dependency-inversion-adapters`
- `architecture/controller-error-boundary`
- `foundational/input-validation`
- `domain-conventions/layered-typing`
- `domain-conventions/project-structure`
- `workflows/git-conventions`

## Dependencies

- 001 (a poll must exist before it can be voted on)

## Leakage checklist

- [x] No classes/files/libraries/signatures in the text above.
- [x] All criteria are testable as behavior.
- [x] Referenced skills exist in the index.
