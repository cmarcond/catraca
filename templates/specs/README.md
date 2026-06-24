# Specs — How to Write Them (and the Intent/Solution Barrier)

One spec per feature, named `NNN-slug.md` (sequential numbering from the
roadmap). Use `FEATURE-TEMPLATE.md` as the base.

## The golden rule

**A spec is intent; a skill is the solution.** The spec describes what the
system does in behavior language. The *how to build it with quality* is already
written in the skills — the spec only references them by id.

Forbidden in specs:

- names of classes, files, paths, functions, or signatures;
- names of libraries or technologies (those live in `architecture.md`);
- copying the content of a skill into the spec.

Allowed and expected:

- observable behavior in WHEN/THEN format;
- domain vocabulary (account, poll, answer…);
- status codes and response formats *of the external contract* (e.g. "returns
  403"), since those are behavior, not internal structure.

## Acceptance criteria syntax — WHEN/THEN (default) or EARS (optional)

`WHEN … THEN …` is the default and is enough for most projects. For sharper,
less ambiguous criteria you may opt into **EARS** (Easy Approach to Requirements
Syntax — Mavin/Rolls-Royce, 2009), selected per project at Gate C (see
`method.md`). EARS has five small patterns; each still describes behavior in
domain language — the leakage rules below apply unchanged.

| Pattern | Shape | Example (domain language) |
|---|---|---|
| **Ubiquitous** (always true) | The system shall `<response>`. | The system shall keep a poll's options in the order they were submitted. |
| **Event-driven** (`When`) | When `<trigger>`, the system shall `<response>`. | When an organizer submits a poll with a question and at least two options, the system shall store it and return its identifier. |
| **State-driven** (`While`) | While `<state>`, the system shall `<response>`. | While a poll is open, the system shall accept votes for it. |
| **Unwanted** (`If/then`) | If `<unwanted condition>`, then the system shall `<response>`. | If a poll is submitted without a question, then the system shall reject it as a bad request naming the missing field. |
| **Optional** (`Where`) | Where `<feature>`, the system shall `<response>`. | Where anonymous voting is enabled, the system shall accept a vote without an account. |

Patterns combine for complex behavior: *"While a poll is open, when a voter
selects an option, the system shall record the vote against that option."*

**Each criterion maps to one behavior test:** the `When`/`While`/`If`/`Where`
clause is the test's arrange + act; the `shall <response>` is the assertion.
Unwanted (`If/then`) criteria are your error cases. This is the same intent as
WHEN/THEN, just with named triggers and conditions — pick one dialect per spec
and stay consistent.

## Leakage checklist (before closing the spec)

- [ ] No sentence in this spec mentions a class, file, library, or signature.
- [ ] Each criterion is verifiable by a behavior test.
- [ ] Anything that is a technical decision was moved to `architecture.md`.
- [ ] The referenced skills exist in `skills/index.yaml`.

## Adversarial checklist (clean-context review, before G12)

The reviewer receives only `product.md`, `architecture.md`, and the spec — and
tries to **refute** it:

- [ ] **Boundary semantics**: do the statuses distinguish unauthenticated from
      unauthorized (typically 401 vs 403)? If they don't, is that a deliberate
      decision or a habit?
- [ ] **Testability**: is each WHEN/THEN criterion verifiable by a behavior
      test, with no interpretation?
- [ ] **Role consistency**: do the permissions match the roles in `product.md`?
      Is there a role mentioned without a rule, or a rule without a role?
- [ ] **Negative cases**: do invalid input, absence, and internal failure each
      have their own criterion?
- [ ] **Solution leakage**: is any term a technology/structure disguised as
      behavior?
- [ ] **Contradictions**: does any criterion conflict with another spec or with
      the out-of-scope section?

A finding is not an order: the author accepts it or refutes it with a
justification — but in writing, in the spec.

## Where do the technical criteria come from?

The spec's acceptance criteria are behavioral. The *technical* criteria (how to
test, how to structure) are derived by the agent, at implementation time, from
the **Test Checklist** sections of the referenced skills.
