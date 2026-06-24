---
name: test-setup-factories
title: "Test Setup Factories"
description: "Centralizes test arrangement in SUT and data factories. Use when test setup repeats across cases of the same unit."
category: testing
dependencies: []
---

# Test Setup Factories

**Invariant principle:** centralize the test arrangement (arrange) in
factories, so that a change in the component's constructor or in the shape of a
model touches **one** point, not every spec.

There are two complementary factories:

1. A **factory for the component under test** that assembles the test doubles,
   instantiates the component, and returns the component **together with** the
   test doubles a test may need to configure or inspect.
2. **Data factories** that produce reusable test objects/inputs instead of
   duplicated literals.

> In stacks without constructor injection or without types, keep the principle (a
> helper that returns the subject + its collaborators) and adapt the shape.

Why route construction through a factory:

- **It decouples every test from the constructor and the model's shape.** When a
  constructor gains a dependency or a model gains a field, the factory absorbs the
  change in one place — specs that didn't care about that field never break.
- **Defaults are safe and valid; each test overrides only the field it asserts
  on.** The test then reads as "the default except for X", and irrelevant
  structure stays out of sight.

## When To Use

- The component has **two or more** injected dependencies (or you already foresee
  that it will).
- The same test data or test double repeats across **two or more** specs.
- The same dependency is doubled in distinct layers/modules.

## When Not To Use

- A pure/isolated function without dependencies and without repeated setup.
- A single spec consumes the data and no other needs it.
- When the factory would hide the exact detail the test needs to assert
  (a specific boundary case) — there, prefer an explicit override or a local literal.

## Order Of Operations

1. **Create a SUT-construction factory** that instantiates the test doubles, assembles the
   component, and returns the component **with** its test doubles. Each test extracts only
   what it uses.
2. **Keep parity with the real constructor**: the order and set of test doubles
   must reflect the real dependencies. When adding a dependency,
   update **only** the factory.
3. **Extract repeated data** into named, importable data factories.
   Replace the duplicated literals with the calls.
4. **Expose variation via override**, not via duplication: the data factory
   must accept parameters/overrides (e.g., a partial object merged over the
   default) so that a boundary test changes only the relevant field without recreating
   the whole object.
5. **Promote recurring test doubles to a shared module** only when more than one
   consumer truly reuses them. Replace the local copies with imports, and **sweep
   every spec** that used the local version so the migration isn't left half-done.
6. **Make the factories evolve with the models**: when the domain changes,
   adjust the factory, not every assert.

## Test Checklist

The checklist verifies the **principle**, not specific names. Do not fail a
suite for using a different nomenclature.

- [ ] Every test with dependencies obtains the component via the construction
      factory.
- [ ] The factory returns the component and each test double that some test needs to
      configure/inspect.
- [ ] No duplicated data literal between specs — it became a data factory.
- [ ] Adding a dependency to the constructor required a change only in the construction
      factory.
- [ ] Boundary cases use a factory override/parameter, without rebuilding the
      whole object.
- [ ] Data factory defaults are valid on their own, and each test overrides only
      the field(s) it asserts on — the rest is left implicit.
- [ ] Adding a model field required changing the data factory only, not every
      spec that constructs the model.
- [ ] A shared test double was only promoted to a common module when there is real
      reuse, with no remaining local copies.
- [ ] Each test still keeps visible the specific arrangement it depends on.

## Anti-Patterns

- **Too-generic setup**: a factory so rich that it hides a test's specific
  arrangement — the reader does not see why it passes.
- **Bloated central mock**: fake data with many fields couples tests to
  attributes they do not even use.
- **Masked boundary**: a factory that always returns the happy case; when the boundary
  matters, vary it **explicitly** via an override in the test.
- **Factory misaligned with the constructor**: it does not reflect the real
  dependencies, giving false confidence.
- **Premature promotion to a shared module**: extracting a test double to a file
  common across layers creates coupling between them; only share under
  real reuse.
- **Partial migration**: extracting to a shared module without removing the local
  copies.
- **Mutable shared default**: one factory-built object reused across tests, then
  mutated by one — the change bleeds into later tests, creating order-dependent
  flakiness. Return a fresh instance per call.
- **Override-everything call site**: so many overrides that the factory adds
  nothing over a literal — a sign the default is wrong here or a dedicated variant
  is needed.

## Suggested Conventions (Optional)

Useful for readability, not mandatory:

- The component under test is called `sut`; the factory, `makeSut()`, returns
  `{ sut, ...test doubles }`.
- Consistent prefixes: `mock*`/`fake*` for data and test doubles; `make*` for
  construction. The value is in **consistency**, not in the choice of prefix.
- Shared test doubles live in the test tree, mirroring the production structure
  (see `project-structure`).
