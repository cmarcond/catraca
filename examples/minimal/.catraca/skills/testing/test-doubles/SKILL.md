---
name: test-doubles
title: "Test Doubles"
description: "Isolates the unit with spies, stubs, and failure mocks, and a fixed clock for dates. Use when a unit test depends on collaborators or on time."
category: testing
dependencies:
  - testing/test-setup-factories
---

# Test Doubles: Spies, Stubs And Failure Mocks

Replace each external collaborator of the unit with a controlled test double so that
the test asserts the unit's behavior, not the real dependency's. The technique is
language-independent.

## When To Use

- The unit depends on an external collaborator (repository, cryptography
  adapter, token generator, validator, another use case) and you need to
  prove **integration**: the method was called with the correct values.
- You need to cover the **error contract**: the unit propagates or handles the
  failure/absence coming from the dependency.
- The flow generates or compares dates and the assertion requires a stable
  clock — this trigger holds even without an external collaborator, since it is about
  temporal determinism.

## When Not To Use

- A real route test, real database, or end-to-end → use `integration-tests`,
  not test doubles.
- A pure function without dependencies → test input→output directly.
- Do not create a test double for a dependency the unit does not even use just to "have
  coverage".
- When you need to exercise the dependency's real behavior (e.g.:
  the logic of an in-memory repository), prefer a **fake/in-memory** over a
  stub: the fake keeps coherent state across calls; the stub only responds with
  hardcoded values per call.

## Order Of Operations

1. List the unit's real dependencies by their **contract (interface)**,
   not by the concrete implementation.
2. Build each test double returning the **happy path by default** (valid stub),
   assembled via the shared SUT factory — see `test-setup-factories`. The
   stub's default must **differ from the asserted value** (e.g., the returned id ≠ the input
   id), so that the assertion does not pass by coincidence.
3. Write the **integration test with a spy**: capture the received arguments
   and assert that the dependency was called with the correct values.
4. Write the **success-return test**: it uses the plain SUT, without overriding
   any test double.
5. For each dependency, write the **failure test**: override
   the test double pointedly to fail and assert the error contract. Define what
   the contract verifies — only that the failure **propagates**, or also the
   **type/identity** of the error.
6. Cover the **absence** paths (the dependency returns "empty") where the
   contract distinguishes absence from error.
7. If the flow involves dates, fix the clock before the block and restore it after,
   covering every point that generates a date.

## Test Checklist

- [ ] The success case runs only with the factory defaults (no pointed
      mock).
- [ ] There is a "calls X with the correct values" test per relevant
      dependency.
- [ ] There is a "propagates error" test per dependency that can fail, with the
      **failure faithful to the signature** (an asynchronous operation fails through the
      asynchronous channel; a synchronous one, by throwing).
- [ ] Absence cases are distinct from exception cases.
- [ ] Dates use a fixed clock; no date-generation point was left out of the
      freeze.
- [ ] The spy asserted interaction **and** there is a separate test asserting the
      return (a spy does not cover the result).
- [ ] Captured state and overridden test doubles are **reset between cases**
      (not just dates) — no leakage between tests.
- [ ] If the unit needed many test doubles to be tested, reassess the
      decomposition: an excess of collaborators to isolate signals coupling or too much
      responsibility in the unit.

## Anti-Patterns

- Mocking everything in the success case: it makes the arrangement noisy and hides the happy
  path. Override only in the negative cases.
- Asserting against a magic stub default equal to the expected value — choose
  defaults distinct from the asserted one.
- Coupling the test to the internal signature of the concrete implementation instead of the
  contract; it breaks on every harmless refactor.
- A failure mock with the wrong signature (success where it should fail) — the test
  passes by mistake.
- Forgetting to restore the clock/test double between tests, generating intermittent
  failures or state leakage.
