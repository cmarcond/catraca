# Instructions for the Agent

This project uses **Catraca**, a spec-driven framework. ("Catraca" is
Portuguese for *turnstile*; the ratchet — a one-way regression check — is its
core metaphor.) The name is just a brand: the product, domain, roles, and
design come exclusively from the user and the artifacts in this directory.

## Reading order

1. `manifesto.md` — constitutional principles: TDD, Clean Architecture, SOLID.
   They hold in any project that uses the framework; they don't depend on the
   prompt and are not asked of the user.
2. `method.md` — the rigor with which the principles apply **in this** project
   (filled in during init).
3. `commands/` — the playbook for each phase: `init` → `plan` → `implement` →
   `evaluate`; `status` at any time. Follow the current phase's playbook; if you
   don't know which it is, run `status`. Don't improvise phases.
4. `skills/` — the method's operational rules. During implementation, derive the
   technical criteria from the **Test Checklists** of the skills declared in the
   spec.

## Operating rules

- **User decisions happen at the gates.** In guided mode, ask at the points
  defined by the commands, one block at a time, and record the answers in
  `questions.md`. In auto mode, use the defaults in `method.md` and record each
  assumption as `[assumed]`. Outside the gates, don't invent product decisions.
- **Pipeline before features.** Feature 000 installs hooks that reject
  commit/push (type-check, lint, commit message, staged tests, coverage) before
  any product feature. A gate without a rejection proof does not count as
  installed.
- **Test-first.** No production code without a test that failed first on the
  behavior's assertion. If you wrote production before the test, delete it and
  start over from the test.
- **Specs are intent.** `specs/` describes behavior (EARS criteria), never
  classes, paths, libraries, or signatures. The "how" lives in the skills.
- **Dependencies point inward.** Respect the boundaries in `architecture.md`;
  third-party libraries only through an adapter.
- **State is Markdown.** Progress lives in the checkboxes in `tasks/` and the
  files in `evaluation/`. Don't create parallel state.
- **Evidence before "done".** A feature only closes with a filled rubric in
  `evaluation/` and an updated `ratchet.json`.

## HALT — stop and ask the user when

- an ambiguity cannot be resolved by the specs or the skills;
- the same test fails 3+ times in a row with no new cause;
- the ratchet flags a regression and the mode is `block` — or it is `repair`
  and a repair cycle has not recovered the floor;
- the implementation calls for a dependency not foreseen in `architecture.md`.

Outside these cases, don't stop in the middle of a feature for "significant
progress".

## Map of `.catraca/`

| File/folder | Role |
|---|---|
| `manifesto.md` | Constitutional principles (invariable) |
| `method.md` | Rigor profile + this project's gates |
| `questions.md` | Questions, answers, and `[assumed]` assumptions |
| `product.md` | What the product is (intent, no technique) |
| `architecture.md` | Stack, layers, boundaries, adapters |
| `roadmap.md` | Ordered features (000 = quality pipeline) |
| `skills/` | The method's operational rules |
| `specs/NNN-*.md` | One intent spec per feature |
| `tasks/NNN-*.md` | Red/green/refactor tasks per feature |
| `evaluation/NNN-*.md` | Rubric + evidence per feature |
| `ratchet.json` | Best scores; flags regression |
| `commands/` | The phase playbooks |
