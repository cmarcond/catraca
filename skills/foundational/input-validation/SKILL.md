---
name: input-validation
title: Input Validation
description: Models each input rule as an object, aggregates them with a composite built by a factory, and has the boundary only call validate. Use when validating shape at an entry boundary.
category: foundational
dependencies:
  - architecture/dependency-inversion-adapters
---

# Input Validation

**Shape** validation of the input (required fields, format, comparison between
fields), not business rules. Each rule is an object that exposes
`validate(input)` and returns **an error** or an **empty value** (depending on
the language: `null`, `None`, absent `Optional`) meaning no error.
An **aggregator** walks the list of rules; the entry boundary receives that
aggregator via injection and only does `error = validation.validate(input)`.

## When To Use

- An **entry boundary** (route, CLI command, queue message, batch item)
  has required fields, a fixed format (e.g., e-mail), or comparison between
  fields (e.g., password vs. confirmation).
- The intent/spec explicitly defines the input fields and their format
  constraints.
- You want to test each rule in isolation and assemble different sets per
  boundary without duplicating logic.

## When Not To Use

- The rule is a **domain** rule (sufficient balance, uniqueness against
  existing data) → it belongs in the use case, not here.
- The validation depends on a **replaceable external capability** (database,
  API) → first define an abstraction protocol (see
  `dependency-inversion-adapters`). Pure, local rules (e.g., format regex) do
  **not** require an abstraction.
- The check is only a static type check already guaranteed by the compiler.

## Order Of Operations

1. Define the **validation contract**: `validate(input)` returns an error or an
   empty value. Decide whether the contract is synchronous; if some rule needs
   I/O, standardize an asynchronous return for all of them.
2. Implement one rule per file (required-field, format, comparison). Each one
   receives via the constructor only what it needs (field name, abstract
   dependency).
3. When the rule depends on a **replaceable external capability**, declare a
   protocol in the validation layer and inject the adapter. A pure local rule
   does not need this.
4. Implement the **aggregator** that walks the list of rules.
5. Define the **aggregation policy according to the spec's intent**: stop at the
   **first error** or **collect all errors** (preferable in
   forms/APIs that report the whole set). The order of the list in the factory
   is the order of evaluation.
6. Create a **factory** that assembles the list of rules for that boundary and
   returns the configured aggregator.
7. Inject the aggregator into the boundary; it only calls `validate` and
   converts the error into a boundary response (see `controller-error-boundary`).
8. Keep everything in a **dedicated validation layer** that **does not depend on
   the UI nor on the domain** (e.g., a `validation/` folder parallel to the
   other layers).

## Test Checklist

- [ ] Each rule has a unit test: error case and success case in isolation.
- [ ] Comparison between fields tested with equal and different values.
- [ ] Aggregator respects the chosen policy: if first-error, proof of
      ordering; if all-errors, proof of complete collection.
- [ ] Aggregator returns success (empty value) when all rules pass.
- [ ] Factory tested/guarantees that the list contains the expected rules in the
      right order.
- [ ] Boundary test uses a stub rule and verifies that `validate` was called
      with the correct input and that the error propagates to the response.
- [ ] Rule with an external dependency uses a stub of the protocol, without
      touching real infrastructure.

## Anti-Patterns

- Scattering `if (!field) return badRequest(...)` inside the boundary instead of
  delegating to the aggregator.
- Mixing aggregation policies without the spec's intent defining which to use
  (first-error vs all-errors is a trade-off, not a defect — choose
  explicitly).
- A validation rule importing from the UI or the domain, creating a cross
  dependency between layers.
- Putting a business rule inside a validation rule for convenience.
- Instantiating rules directly in the boundary instead of building them through
  a factory.
- Validation that depends on a replaceable external capability embedded without
  a protocol, coupling to a concrete lib.
