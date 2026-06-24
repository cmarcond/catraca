---
name: error-observability
title: Error Observability
description: Logs the complete error at the boundary via a decorator/middleware, sends it to a destination behind an adapter, and keeps the client payload clean. Use when a 500 can occur.
category: architecture
dependencies:
  - architecture/controller-error-boundary
  - architecture/dependency-inversion-adapters
---

# Error Observability at the Boundary

The error boundary (`controller-error-boundary`) protects the client: a generic
response, with no internal details. This skill protects **whoever operates**:
the complete error (type, message, stack, request context) is logged to an
observability destination — otherwise the generic 500 becomes a black box and
the production failure stays invisible.

Principles:

- **Log once, at the boundary** — not spread across the layers.
- **Decoupled from the response** — a decorator/middleware wraps the boundary;
  the business controller knows nothing about logging.
- **Substitutable destination** — stdout, file, database, service — behind a
  protocol + adapter, like any library.
- **Structured and correlatable** — queryable fields (not one concatenated
  string) plus a request/correlation id, so the generic 500 traces back to its
  request.
- **Error severity** — so production log filters never hide the failure.

## When To Use

- The project has a boundary that translates an unexpected exception into a
  generic response (any application with `controller-error-boundary`).
- The project goes to production or to any environment where someone will need
  to diagnose failures without a debugger.

## When Not To Use

- Throwaway spikes.
- **Business** logging (audit, event trail): it is a domain requirement, with
  its own spec — do not confuse it with error observability.
- Full metrics/distributed tracing: legitimate evolutions, but outside this
  skill's minimal scope (which is: no 500 without a structured, correlatable
  log). A single request/correlation id is in scope; a full tracing backend is
  not.

## Order Of Operations

1. Declare the **error logging protocol** (e.g., `LogErrorRepository` or
   equivalent) in the layer that consumes it.
2. Implement the logging as a **boundary decorator/middleware**: it wraps the
   controller/handler; on an unexpected error response, it logs the complete
   error and forwards the response intact. The business controller does not
   change.
3. Ensure the split: the **payload** carries only the generic error; the **log**
   carries everything (stack, context). Never the other way around.
4. Make the entry **structured and correlatable**: log structured fields (not a
   concatenated message), at an error severity, including a request/correlation
   id and the request context — never sensitive data.
5. Implement the **destination adapter** in infra (structured stdout is an
   honest default; database/service when there is a requirement).
6. Compose the decorator at the composition point (`main`), applied to every
   boundary — not case by case.
7. Test with a **spy of the protocol**: unexpected error ⇒ logger called with
   the complete error and the response stays generic; happy path ⇒ nothing
   logged.

## Test Checklist

- [ ] There is a test: dependency throws an unexpected error ⇒ the logging
      protocol is called with the complete error (stack included).
- [ ] There is a test: happy path ⇒ no error logged.
- [ ] The error response payload does not contain stack/details (reinforcing
      the `controller-error-boundary` checklist).
- [ ] Logging happens at a single point (decorator/middleware), not inside the
      business controllers.
- [ ] The log destination is behind a protocol + adapter, with its own test.
- [ ] The logged entry is structured (distinct fields) and carries a
      request/correlation id that ties it to the originating request.
- [ ] The error is logged at an error severity level (not info/debug).
- [ ] No sensitive data (password, token, credential, PII) appears in the log.

## Anti-Patterns

- `catch {}` that discards the error: the 500 comes out correct and nobody ever
  knows what happened.
- Prints/`console.log` scattered across the layers instead of a single point at
  the boundary.
- Stack or internal message in the response payload (the symmetric opposite).
- Logging inside the business controller, coupling the rule to observability.
- Logging sensitive request data along with the error.
- Logging the failure as a flat concatenated string with no fields — unqueryable
  when it matters most.
- No request/correlation id, so the generic 500 the client saw cannot be tied to
  any log entry.
- Logging at info/debug, so production filters hide the very failure that needs
  to be seen.
- Logging and **swallowing**: logging the error and returning success — the log
  does not replace propagation.
