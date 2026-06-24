---
name: single-responsibility
title: Single Responsibility
description: Refactors in steps under a green suite, with the new structure entering before the old one leaves. Use when a unit has grown more than one responsibility.
category: refactor
dependencies:
  - testing/tdd-minimal-step
  - architecture/dependency-inversion-adapters
  - workflows/git-conventions
---

# Single Responsibility

Restructures existing code without breaking behavior: the new structure enters
before the old one leaves, and the suite stays green between steps. This is the
**parallel change** (expand–migrate–contract) pattern:

- **Expand** — add the new path beside the old.
- **Migrate** — move consumers one by one.
- **Contract** — remove the old path only once it has zero consumers.

The order matters: each phase keeps the suite green and leaves the system
shippable mid-refactor.

**External contract** = what existing consumers observe (signatures they call,
values they read). Moving a method between layers may change the internal shape
without changing that contract. If a consumer must adjust its expectation, the
contract changed and this is no longer a refactor.

**Architecture precondition.** The steps assume dependency inversion: consumers
depend on an abstraction, not the concrete. That is what lets you swap the
structure behind it without touching the consumer. Without that separation,
adding the new path alongside the old may not be viable and the refactor needs
another plan.

## When To Use

- A consumer uses only part of the return → extract a dedicated operation for
  that need (e.g., separate "check existence" from "load complete").
- A method/operation/repository accumulates unrelated responsibilities.
- A query loads the entire entity but only a few fields are used →
  consider a projection or a specific accessor (see constraint below).
- Renaming a symbol that crosses layers (abstraction, implementation, test
  stubs).

> A large library update "letting the tests point out what broke" is dependency
> migration, not refactoring by responsibility — out of scope for this skill.

## When Not To Use

- First test of a new behavior → use `tdd-minimal-step`. Refactor assumes
  behavior already covered.
- There is no prior coverage of the touched points → write the tests first;
  without a safety net, it is not a safe refactor.
- Splitting "for the future" without a concrete consumer asking for it → adds
  structure that nobody uses; wait for the real usage.

## Order Of Operations

1. Confirm that the affected behaviors have green tests. If not, cover them
   before touching.
2. Identify the concrete responsibility/usage that motivates the change (who
   consumes what).
3. Add the new structure alongside the old one: new abstraction, method,
   operation, or query.
4. Migrate the consumers one by one to the new path; update mocks/stubs
   together with each migration.
5. Run the suite at each step — do not accumulate steps without green.
6. When no consumer uses the old path — verify by searching every call site, not
   by assumption — remove it (the contract phase).
7. Rename: apply a mechanical and verifiable sweep (automated refactor
   or reviewed search/replace) with the suite guaranteeing the mechanics. Keep
   the sweep separate from any behavior change — see `git-conventions`
   for commit granularity.

### Extract method vs. extract dedicated accessor

Decide by **scope and axis of change**.

- **Extract method** — within a unit: only logic/composition moves, in the same
  layer, and the piece stays an implementation detail of the same owner.
- **Extract dedicated operation/repository** (the "extract class" move) — when a
  distinct responsibility (its own data and operations) wants to live apart, or
  when the data is obtained differently (a distinct read query/contract), so the
  consumer depends only on what it needs.

Signal that it is extract-class, not extract-method: a subset of fields and the
methods touching them always travel together, or one consumer has a different
reason to change than the rest.

### Optimization via projection

Project only the fields used **when the data source supports field selection on
the server**. If the source does not support projection (e.g., an API that
always returns the entire object), filtering/mapping in the application is the
only option available and is not an anti-pattern. In any case, remember to
widen the projection when new fields start being used.

## Test Checklist

- [ ] Suite was green before the first step.
- [ ] Suite stayed green after each intermediate step, not only at the end.
- [ ] External contract remains the same — no behavior test needed to change its
      expectation because of the refactor.
- [ ] Mocks and factories were updated in the same step as the change that
      affects them.
- [ ] Each old path was removed only after a call-site search confirmed zero
      remaining consumers.
- [ ] The three phases were distinct: the new path was added (expand), consumers
      migrated one by one, and the old path removed (contract) — no phase
      collapsed into a single all-at-once change.
- [ ] New structure (operation/repository/projection) is covered by the
      consumer that uses it.
- [ ] Rename stayed separate from new logic.

## Anti-Patterns

- Big-bang: swapping everything at once and only running the suite at the end.
- Removing the old path before migrating all consumers.
- Mixing rename + new feature in the same step/commit (hides the cause of a
  break).
- Splitting for aesthetics, without a consumer that uses only part of the
  return.
- Extracting a method to a new owner when only logic moved (no separate
  responsibility or read contract) — churn without a single-responsibility gain.
- Optimizing a query by assumption instead of real usage; or projecting fields
  and forgetting to widen the projection when new fields start being used.
- Refactoring with the suite red "that I'll fix later".
