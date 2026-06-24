# The Catraca Manifesto — Constitutional Principles

> These principles hold for **every** project that uses Catraca. They are not
> asked about, do not depend on the user's prompt, and are not negotiated per
> feature. What the User Feedback Gates calibrate is the **rigor of
> application** (the profile in `method.md`) — never the validity of the
> principles. The full operational rules live in `.catraca/skills/`.
>
> The method is **agnostic of language and platform**: the platform is chosen
> at Gate B, and the tools that materialize the quality gates are proposed in
> feature 000, suited to the chosen context.

## Principles

1. **Every behavior is born from a failing test.** Red → Green → Refactor, by
   behavior, not by file. Minimal implementation; a hardcoded value lives only
   until the test that generalizes it.
2. **Dependencies point inward.** The domain knows nothing about the database,
   HTTP, or frameworks. Protocols (interfaces) are declared in the layer that
   needs them; implementations arrive through constructor injection.
3. **Every third-party library enters through an adapter.** Cryptography,
   tokens, database drivers, validators: no library import outside the
   infrastructure layer.
4. **Errors are a boundary concern — and no error dies in silence.**
   Controllers catch exceptions and map them to responses; the domain does not
   speak HTTP. The response to the client is generic, but the full error is
   logged for observability: clean payload, complete log.
5. **Validation is composition.** Each rule is a small object; a composite
   aggregates them; a factory assembles everything in the composition layer.
6. **Refactoring is walking with the safety net up.** The suite stays green at
   every step; the new structure enters before the old one leaves.
7. **One responsibility per unit.** Small classes, use cases, and tests, with
   names that say what they do.
8. **Coverage is a gate, not a trophy.** A drop in coverage is a blocker, not a
   warning.
9. **Small commits tell the story.** Conventional commits, imperative mood, one
   commit per task — validated by a hook, not by discipline.
10. **Specs are intent; skills are the solution.** The spec says what the system
    does (EARS behavior criteria); how to do it with quality is already written
    in the skills. Don't mix the two.
11. **Automatic gates, not discipline.** Every verifiable convention becomes a
    hook that rejects commit/push (feature 000 — the quality pipeline), before
    any product feature.

## Glossary

A few recurring terms, defined once:

- **Quality pipeline** (feature 000): the set of automatic gates — type-check,
  lint, commit-message format, staged-only tests, coverage — installed as git
  hooks that reject a commit/push when violated.
- **Gate proof**: evidence that a gate actually works — you deliberately
  trigger a violation and confirm the hook rejects it. A gate without a proof
  does not count as installed.
- **Ratchet**: a one-way regression check. `ratchet.json` stores the best score
  per feature/dimension; a later run below `best − buffer` is flagged.
- **Safety net**: the green test suite that lets you refactor without fear.
- **Leakage**: accidental mixing of intent (the *what*) with implementation
  (the *how*) — e.g. a class, path, library, or signature appearing in a spec.
- **Canonical profile**: the method's default rigor settings (strict TDD,
  5 layers, 100% coverage, conventional commits) used in auto mode.

## The 13 skills

| Category | Skill | Rule in one line |
|---|---|---|
| testing | `tdd-minimal-step` | Red-green-refactor cycle by behavior, minimal implementation |
| testing | `test-doubles` | Spies/stubs/mocks isolate the unit; stub for success, mock for failure |
| testing | `test-setup-factories` | A SUT factory returns `{sut, ...stubs}`; standardized boilerplate |
| testing | `integration-tests` | Repositories against an in-memory database, no mocks |
| architecture | `dependency-inversion-adapters` | Protocols where they're used, adapters where they're implemented |
| architecture | `controller-error-boundary` | Exceptions become responses at the boundary |
| architecture | `error-observability` | No 500 without a log; clean payload, complete log |
| foundational | `input-validation` | Rules as objects, composite + factory |
| refactor | `single-responsibility` | Incremental refactor under green |
| domain-conventions | `layered-typing` | Input/output types per use case |
| domain-conventions | `project-structure` | Layers first; composition at the outer boundary |
| workflows | `git-conventions` | Conventional commits, one per task |
| workflows | `quality-pipeline` | Automatic quality gates as a precondition |

Each skill carries: when to use it, when not to, preconditions, order of
operations, a **Test Checklist** (the source of the technical acceptance
criteria), and **Anti-Patterns** (what fails the rubric).
