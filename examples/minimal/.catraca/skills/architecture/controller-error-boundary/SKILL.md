---
name: controller-error-boundary
title: Controller Error Boundary
description: Lets an unexpected exception propagate to the boundary and become a generic error, while a business absence becomes a result in the data layer. Use when building a controller or a use case that can fail.
category: architecture
dependencies:
  - architecture/dependency-inversion-adapters
  - testing/test-doubles
---

# Error Boundary: Propagate in the Domain, Translate at the Boundary

There is a single role where an unexpected exception becomes a response to the
client: the **entry boundary** — the place that translates an exception into a
response. In the explicit-controller style this is an outer try/catch in the
controller; in frameworks with error middleware, an exception filter, or a
central handler, that same role is fulfilled by the framework's boundary. The
principle does not require a physical location; it requires that **one**
boundary be responsible and that nothing below it suppress the error.
Everything below propagates; the data layer converts to a result only when the
failure has business meaning.

## When To Use

- Defining how the boundary responds to an **unexpected dependency exception**
  (use case, repository, external adapter) — not input validation, not a domain
  error with its own status.
- Distinguishing a **technical failure** (unexpected exception → 500) from an
  **expected absence** (nonexistent record, a credential whose invalidity is a
  business case → empty/fallback).
- Ensuring a stable contract when any internal dependency throws.
- Deciding where NOT to suppress an exception when reviewing an internal layer.

## When Not To Use

- Request input validation: it is an explicit rule, returns 400 — use
  `input-validation`, not the technical-error boundary.
- A domain error that deserves its own status (403, 404, 409): it should be a
  **typed return** decided in the application/boundary layer before becoming an
  exception, not caught in the generic 500 catch. The status decision happens
  in the explicit mapping of the typed result, not in the catch.
- Logging the error: keep it out of the business catch (observability
  decorator/middleware) — the point is not to couple logging to response
  translation.

## Order Of Operations

1. In the internal layers (use case, repository), do not **suppress** or
   convert a technical error into silent success. Let the dependency's
   exception flow through to the boundary.
2. Determine whether the failure has business semantics. If so, it is the data
   layer's responsibility (step 3); if not, it propagates to the boundary
   (step 4).
3. In the data layer, convert the **semantic absence** into a result:
   dependency returns empty → alternative query or empty; decoding that fails
   on expected invalid data (not due to a bug) → catch it locally and return
   empty. Every conversion needs a named business requirement covered by a
   test.
4. At the boundary, translate any unmapped exception into a **generic error
   (500)** to the client. The response body carries no internal details: the
   complete error (stack, driver message) goes only to observability, outside
   the payload.
5. The boundary is the last ring. No internal layer may swallow the exception
   that should reach it.

### Internal try/catch is allowed when it does NOT suppress

The prohibition applies to try/catch that **swallows** the exception or turns
it into a false success. The following are legitimate and do not violate the
boundary:

- `try/finally` for resource release and cleanup, without catching the
  exception.
- Catching to **translate into a typed domain error** and **re-throw** (the
  error keeps rising, it only changes type).
- Retry / circuit-breaker around an unstable dependency, as long as the final
  error still propagates when the policy is exhausted.

## Test Checklist

- [ ] Internal layer: a test that, when the dependency throws, the exception
      propagates without becoming a success.
- [ ] Boundary: a test that, when a dependency throws an unexpected exception,
      the response is the generic error (500) and the body does **not** expose
      internal details.
- [ ] Data layer with fallback: for each empty/alternative-query fallback, a
      test that **names the business requirement** that motivates it (linking
      to the intent/acceptance criterion) — exercising the absence path.
- [ ] Data layer with fallback: test the happy path too, proving the fallback
      only triggers on absence.
- [ ] Technical failure inside a method with fallback: an unexpected error
      still propagates and is not masked by the empty return. Distinguish in
      the test the expected absence (valid data, no record) from the technical
      error (corrupted data/bug).

## Anti-Patterns

- An internal try/catch that **swallows** the error "to be safe": it masks the
  origin and prevents the 500 at the boundary. (Different from try/finally or
  typed rethrow, which are valid.)
- More than one boundary translating a technical exception into a response:
  fragments the handling and produces inconsistent contracts.
- An empty fallback without a named and tested requirement: hides real
  infrastructure bugs under "expected absence".
- Leaking a raw infrastructure exception into the response: the boundary
  returns a generic error to the client; details go only to the logs.
- Catching a domain error with its own status (403/404) in the generic 500
  catch: it should be a typed result mapped explicitly.
