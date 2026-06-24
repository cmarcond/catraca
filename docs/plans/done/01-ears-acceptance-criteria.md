# Plan 01 — EARS acceptance criteria

> **Outcome (done):** implemented as the **single default** dialect, not an
> opt-in toggle. EARS is now the canonical acceptance-criteria syntax across the
> specs templates, commands, and the manifesto/CLAUDE emblem; the per-project
> toggle (G5b / method row) was dropped. Verified safe for the 13 skills (they
> are dialect-agnostic — zero `WHEN/THEN` references in `skills/`). The body
> below describes the originally-planned opt-in approach, kept for the record.

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. Feature specs live in
`templates/specs/` (`FEATURE-TEMPLATE.md`, `README.md`) and describe **behavior**
in `WHEN … THEN …` form, never implementation. Specs are confirmed at Gate E
(G12). Read `templates/specs/README.md`, `templates/specs/FEATURE-TEMPLATE.md`,
and `commands/plan.md` first.

## Goal

Offer **EARS** (Easy Approach to Requirements Syntax) as an optional, sharper
dialect for acceptance criteria alongside the current WHEN/THEN, selectable per
project.

## Why it matters / what it solves

WHEN/THEN is good but loose; ambiguous criteria slip through. EARS adds a small
set of precise templates (ubiquitous, event-driven, state-driven, optional,
unwanted-behavior) that make each criterion unambiguous and directly testable —
which is exactly what Catraca's adversarial spec review and rubric want. Offering
it as an option keeps the low-friction default while letting rigor-minded
projects opt in.

## Why it solves it well

EARS is widely used in modern spec-driven AI tooling (e.g. Kiro), so it's
familiar and battle-tested, and it maps cleanly onto behavior tests.

## Scope / what's involved

1. Add an "EARS (optional)" section to `templates/specs/README.md` explaining the
   five EARS patterns with one example each, and how each maps to a behavior test.
2. Add an EARS variant block (commented) to `templates/specs/FEATURE-TEMPLATE.md`
   so authors can choose WHEN/THEN or EARS.
3. Add a Gate-C/method toggle: a line in `templates/method.md` and
   `templates/questions.md` (a new sub-question or a note on G5) for "acceptance
   syntax: WHEN/THEN (default) or EARS".
4. Mention the option in `commands/plan.md` step 2.

## Out of scope

- Forcing EARS; rewriting existing specs. WHEN/THEN stays the default.

## Research

Pull the authoritative EARS definition and current usage before writing
(queries: "EARS requirements syntax Mavin templates", "EARS ubiquitous
event-driven state-driven unwanted optional", "Kiro EARS acceptance criteria
spec-driven 2026"). Cite the source in the README section.

## Acceptance / verification

- `templates/specs/README.md` documents all five EARS patterns with examples.
- The template offers both dialects; the method/questions expose the toggle.
- Leakage rules (no classes/paths/libs) still apply to EARS criteria — verify the
  examples obey them.

## Commit

Branch `improve/03-ears-criteria`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
