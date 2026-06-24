# 003 — Cast a vote

> Intent spec. No classes, paths, libraries, or signatures (see `README.md`).
> **Spec only — not yet implemented** (this example is mid-flight).

## Intent

A voter needs to cast a vote for one option of an existing poll. The vote is
recorded against the chosen option. A vote for a poll that does not exist, or for
an option that is not part of the poll, is rejected.

## Acceptance criteria

<!-- EARS (see README.md). -->

- When a vote names an existing poll and a valid option, the system shall record
  the vote against that option.
- If a vote names a poll that does not exist, then the system shall reject it as
  not found.
- If a vote names an option that is not part of the poll, then the system shall
  reject it as a bad request.
- If recording the vote fails unexpectedly, then the system shall return a
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
