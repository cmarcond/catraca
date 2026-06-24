---
name: layered-typing
title: Layered Typing
description: Has boundary types born in the layer that publishes them and keeps infra from importing domain models. Use when defining a use case's input/output types.
category: domain-conventions
dependencies:
  - architecture/dependency-inversion-adapters
---

# Layered Typing

## Principle (invariant)

A **boundary type** is the input/output contract one layer exposes to another.

- **Born where published** — the dependency direction points toward the domain.
- **Each layer owns its contract** — the use case owns its input/output; the
  data layer owns what its infrastructure consumes.
- **Infra depends on protocols, not models** — it imports domain
  **protocols/contracts**, never concrete domain **data models**.

This holds in any language; the materialization varies (see the example at the
end).

The persistence/transport shape (row, API payload, serialization DTO) is **not**
a boundary type to share inward — it belongs to the adapter that owns it.

- The adapter **maps** it to the domain contract at the edge (the usual
  `toDomain` / `toPersistence`), so the schema or wire format can change without
  touching the use case.
- A repository exposes the domain-shaped contract, never the raw row type.

### Boundary type vs internal type

Apply the skill only to types that cross a layer (domain↔data/infra) or to
types shared by more than one layer. A type used at a single internal point is
not a boundary — do not force the convention onto it.

## When To Use

- A type is about to cross a layer boundary (domain↔data/infra).
- There is a symptom of a circular import, or an adapter/repository is about to
  import domain models.
- The return of a write/check operation is richer than what the caller
  consumes.

## When Not To Use

- Pure runtime code with no boundary type decision.
- An internal type used at a single point, without crossing a layer.

## Order Of Operations

1. Identify the boundary: who publishes the contract and who consumes it.
2. Confirm the direction: the infra implements domain protocols; it does **not**
   import domain data models. If an adapter needs an input/output type, declare
   it in the protocol of the data layer.
3. If the adapter has a persistence/transport shape of its own (a row or wire
   DTO), keep it private to the adapter and map it to the domain contract at the
   edge — do not return it upward and do not let it become the protocol's type.
4. Ask what the caller uses from the return (see "Deciding to reduce to a
   boolean").
5. Update mocks, stubs, and tests in the same step: a change to the contract or
   to a mirrored type breaks them all together.

## Deciding to reduce to a boolean (mandatory step)

Before declaring a return as a boolean (success/existence):

- Reduce **only** when the caller's contract is stable and no current or
  foreseen consumer uses the returned object.
- Do **not** reduce if there is a consumer (current or plausible in the short
  term) of the identifier/entity — keeping the rich result avoids a second
  query. When in doubt, keep the object.

## Deciding to mirror vs merge types

- **Mirror** (keep separate types, even if identical) when they belong to
  layers that must evolve independently.
- **Merge** when they belong to the same layer/contract and the equality is not
  a coincidence — that is accidental duplication.

## Test Checklist

- [ ] No infrastructure file imports domain **data models** (importing domain
      protocols is allowed).
- [ ] An adapter's persistence/transport shape (row, wire DTO) does not appear
      in any protocol signature or in the use case — it is mapped at the edge and
      the repository returns the domain-shaped contract.
- [ ] Each use case exposes its input/output contract in the layer that
      publishes it, used by the implementation and by the stubs.
- [ ] Write/check returns were reduced only after the "Deciding to reduce to a
      boolean" step.
- [ ] Mirrored types between layers are in sync, and the mirroring passed the
      mirror-vs-merge test.
- [ ] Type checking (when the language has it) passes and no circular import was
      reintroduced.

## Anti-Patterns

- Importing domain data models inside adapters/repositories to "reuse" a type —
  inverts the direction of the dependency.
- A central file of shared models that every layer imports, creating coupling
  and cycles.
- Returning the raw persistence/transport shape (the row or wire DTO) upward, so
  the use case becomes coupled to the storage schema or wire format — the mapping
  step is missing.
- Returning the entire persisted object when the caller demonstrably only needs
  to know whether it succeeded (or reducing too early, requiring a second
  query).
- Treating types mirrored across similar use cases as duplication to be merged
  without applying the mirror-vs-merge test.

## Materialization example (illustrative)

In languages with type namespaces/modules: for each use case, a same-named
namespace with `Params` and `Result`, referenced by the implementation and by
the stubs. In languages without that: types named by convention
(`AddXParams`/`AddXResult`) co-located with the contract; in dynamic languages,
document the contract in the protocol itself.
