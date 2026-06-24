---
name: test-doubles
title: "Test Doubles"
description: "Isolates the unit with spies, stubs, and failure mocks, and a fixed clock for dates. Use when a unit test depends on collaborators or on time."
category: testing
dependencies:
  - testing/test-setup-factories
---

# Test Doubles: Spies, Stubs And Failure Mocks

Replace each external collaborator of the unit with a controlled test double, so
the test asserts the unit's behavior, not the real dependency's. The technique is
language-independent.

Pick the lightest double that proves the case. The names map to what you verify:

- **Stub** — returns a canned answer; you assert on the unit's output (state verification).
- **Spy** — a stub that also records how it was called; you assert the interaction.
- **Fake** — a working shortcut implementation that keeps coherent state across calls.
- **Mock** — pre-programmed with expectations about the calls.

Two rules of thumb:

- Prefer state verification (stub/fake) over interaction verification (spy/mock).
- Double **only at the unit's real boundaries**, never its internal helpers — so
  the test does not calcify around how the unit happens to be wired today.

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
- When you need the dependency's real behavior (e.g., the logic of an in-memory
  repository), prefer a **fake/in-memory** over a stub: the fake keeps coherent
  state across calls; the stub only returns hardcoded values per call.

## Order Of Operations

1. List the unit's real dependencies by their **contract (interface)**,
   not by the concrete implementation.
2. Build each test double returning the **happy path by default** (valid stub),
   assembled via the shared SUT factory — see `test-setup-factories`. The stub's
   default must **differ from the asserted value** (e.g., returned id ≠ input id),
   so the assertion can't pass by coincidence.
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
   covering every point that generates a date. Where the platform allows, inject
   the clock (or pass time in) instead of freezing global system time: an injected
   clock is local to the unit and cannot leak into sibling tests. Pin any ambient
   nondeterministic source the unit reads (random, uuid, environment) the same way
   — never let it vary per run.

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
- [ ] Doubles stand in for real boundary collaborators only; no internal
      helper/private of the unit was mocked.
- [ ] Each assertion verifies the unit's own observable output or its
      interaction contract, not a re-statement of the stub's canned value.
- [ ] The double's failure/return matches the real contract's shape (a value the
      real dependency could actually produce), so a passing test could not pass
      against the real collaborator for the wrong reason.
- [ ] If the unit needed many test doubles, reassess the decomposition: too many
      collaborators to isolate signals coupling or excess responsibility.

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
- **Over-mocking**: replacing collaborators the real thing could have provided
  cheaply (a pure helper, a value object) — every mock is a coupling to internal
  structure that turns a harmless refactor into a red suite.
- Asserting only on the spy/mock interaction and never on the unit's actual
  result, so the test passes while the unit returns the wrong thing.
- Using a stub when the case needs coherent multi-call state (write-then-read):
  the stub's per-call canned answer silently diverges from real behavior — use a
  fake.
