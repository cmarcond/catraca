---
name: integration-tests
title: "Integration Tests"
description: "Tests routes against the mounted app and repositories against an ephemeral database, with per-test cleanup. Use when verifying real wiring across a boundary."
category: testing
dependencies:
  - testing/test-setup-factories
---

# Integration Tests

Prove that the external boundary really works: the request enters and exits through the
mounted application, and the repository writes to and reads from a real ephemeral database. What
is under test uses no test double — the boundary (transport and store) is exercised
as in production.

## When To Use

- A new route/endpoint/resolver has been exposed and you need to guarantee the
  status/body contract.
- A repository that touches the database was created or changed (insert, load,
  update, delete).
- An end-to-end flow depends on authentication and needs to cover access
  granted and denied.
- You want confidence that dependency injection and the app composition
  are correct, not just the internal logic.

## When Not To Use

- Isolable unit logic (use cases, composed validators) that can
  be tested with test doubles — use a unit test.
- Pure input validation without a boundary effect.
- A business rule already covered in a unit. **Promotion criterion:**
  integration covers the composition and the boundary effect **once per flow**; the
  business rule stays at the unit level. If a case only varies the input/output
  of an already-tested rule, keep it at the unit level.

## Order Of Operations

1. **Bring up the ephemeral database.** Use an in-memory variant when the database has
   a reliable one; otherwise, bring up a disposable ephemeral container. In the
   suite setup, connect/start; in the teardown, disconnect and ensure
   disposal.
2. **Ensure isolation.** Before each test, clean the data of the flow under
   test. Never depend on state left by another test; if the suite uses
   shared seeds, recreate them per test instead of assuming execution
   order.
3. **For a repository (round-trip):** instantiate the real repository, exercise
   the operation, and read back to assert the persisted effect —
   preferably through the path the system would use (the repository's own
   read method). Reading directly from the store is acceptable as a persistence
   verification, but it couples the test to the schema; use it only when there is no
   readable read and flag the fragility.
4. **For a route/endpoint:** mount the real app and fire the request via a
   test transport client (the real request, not the isolated handler).
   Use the shared setup factories to create entities and
   credentials.
5. **Cover the authenticated boundary's pair of cases:** success with a valid
   credential (generate the credential via a helper, persisting the user) and **access
   denied**. Assert the rejection status **defined by the spec/contract**
   (typically 401 for a missing/invalid credential, 403 for lack of
   permission) — do not hardcode a number out of habit.
6. **Assert status AND body** when the body is part of the contract. Assert
   on the transport response, not on framework internals.

## Test Checklist

- [ ] Ephemeral database started in the suite setup, closed/disposed in the
      teardown.
- [ ] Data cleaned before each test (isolation ensured, with no dependency
      on order).
- [ ] Repository tested with a round-trip: writes and reads back through the system's
      path.
- [ ] Route tested against the mounted app, not against an isolated handler.
- [ ] Success case present.
- [ ] Access-denied case present for authenticated routes, with the contract's
      status.
- [ ] Assertions on status; body asserted when it is part of the contract.
- [ ] No external state remains after the suite.

## Anti-Patterns

- **Mocking the database driver.** It defeats the purpose; prefer a real ephemeral database
  over doubling the driver.
- **Coupling the test to the transport framework.** Test through the real
  request to reduce the re-testing when switching libraries.
- **Reusing state between tests.** Without per-test cleanup, the execution order
  becomes a hidden dependency.
- **Asserting only the return of the repository method** without verifying what was actually
  persisted.
- **Forgetting the negative path** of authentication — the success/denied pair is what
  covers the authenticated boundary's contract.
- **Replicating a business rule** already covered in a unit inside an integration
  test.
