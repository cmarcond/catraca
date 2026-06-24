---
name: dependency-inversion-adapters
title: Dependency Inversion & Adapters
description: Declares protocols in the consuming layer, injects via the constructor, isolates libraries behind adapters, and composes at a single point. Use when a unit needs an external capability.
category: architecture
dependencies: []
---

# Dependency Inversion, Protocols, and Adapters

A business-rule component depends on protocols it declares itself, receives the
implementations by injection, and is assembled at one composition point. The
rule never imports or instantiates concrete infrastructure.

Principles:

- **Protocol owned by the consumer** — phrased in the rule's vocabulary
  ("encrypt", "find by id"), so swapping the concrete leaves the protocol in
  place.
- **Inject via the constructor** — not a service locator or global. The
  signature declares what the unit needs, enforced at construction, impossible
  to satisfy with a hidden global.
- **Adapter as anti-corruption layer** — it translates a third-party library's
  vocabulary *and* its failures into the protocol's contract, so the library's
  types, exceptions, and quirks never leak inward.

> **Illustrative** naming (adapt to your stack): layers
> `data`/`presentation`/`infra`/`main`, `makeX()` factories in the composition.
> In another stack, translate to the equivalent (e.g., a bootstrap module or DI
> container).

## When To Use

- A use case or controller needs I/O or an external collaborator: database,
  cryptography, token, HTTP, queue, clock.
- A third-party library (hash, token, validator, driver) is about to enter the
  business flow.
- You need to compose a use case with its I/O dependencies at the entry point
  (assembling a controller/use case for a route, middleware, or resolver).
- *(when applicable)* The same behavior needs to be exposed by more than one
  transport.

## When Not To Use

- Pure test code (test doubles and the SUT are consumers of the protocol; they
  do not define a new boundary).
- A pure utility function, with no side effect and not crossing a layer
  boundary.
- A trivial dependency, value object, or immutable configuration that can be
  passed directly as an argument with no real substitution benefit.

## Order Of Operations

1. Identify the layer boundary: what the rule needs, not how it is done (e.g.,
   "encrypt", not the library's name). Layer boundary = transition between the
   business rule and a substitutable detail (I/O, library, transport).
2. Declare the protocol in the layer that **consumes** the dependency. Group
   cohesive methods that tend to be used by the same collaborator; one protocol
   per **responsibility**, not necessarily one per method.
3. Have the component receive that protocol via injection; avoid instantiating
   the substitutable dependency inside it.
4. Implement the concrete in the outer layer. If it is a third-party library,
   create an Adapter that implements the internal protocol and isolates the
   library import. The adapter also maps the library's exceptions/return shapes
   onto the protocol's contract — inward code never sees a library-specific
   error type.
5. Concentrate the chain's instantiation in a single composition point; the
   entry point consumes only that composer.
6. *(when applicable)* For a new transport, write a transport→component adapter
   and reuse the existing component instead of duplicating the rule.
7. In the test, the test double implements the same protocol — without touching
   the real implementation.

## Test Checklist

- [ ] The component can be built with test doubles of all protocols, without a
      real network/database.
- [ ] There is a test verifying that the component calls each dependency with
      the correct values.
- [ ] The component propagates/handles an error thrown by the dependency.
- [ ] The instantiation of concretes that cross a layer boundary happens only
      at the composition point.
- [ ] No third-party library import appears inside the business rule (it stays
      restricted to adapters/infra).
- [ ] The component declares its dependencies in the constructor signature; it
      never reaches for them through a service locator, global, or singleton
      registry.
- [ ] The protocol is named in the consumer's vocabulary (the capability, not
      the library), so swapping the concrete leaves the protocol unchanged.
- [ ] *(when there is an external-library adapter)* The adapter has its own
      test that isolates/mocks only the library.
- [ ] *(when there is an external-library adapter)* A test proves the adapter
      maps a library failure onto the protocol's contract, so no
      library-specific error type escapes inward.
- [ ] *(when there are multiple transports)* The rule is exercised once; the
      transport adapter is tested in isolation.

## Anti-Patterns

- Instantiating a concrete substitutable dependency inside the business
  component.
- Reaching for a dependency through a service locator, global, or container
  pulled in at call time: it hides what the unit needs and defeats the
  constructor as the contract.
- Importing the third-party library directly into the business rule instead of
  behind an adapter.
- An adapter that re-exports the library's own error/return type instead of
  translating it: the leak crosses the boundary even though the import does not.
- A protocol named after the library or its method ("BcryptHasher.hashSync")
  instead of the capability: the abstraction is the concrete in disguise.
- Fat interface: a protocol with many unrelated methods. The opposite signal
  (fragmentation): a swarm of single-method protocols, all used together by the
  same collaborator — in that case, group them.
- A composition point that does more than construct (validation, rule, business
  branching).
- Duplicating business rule per transport (copying a controller's logic into a
  resolver).
- A transport adapter with business-rule branching: it only translates
  request→input and result→response.
