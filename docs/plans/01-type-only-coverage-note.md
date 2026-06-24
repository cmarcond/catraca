# Plan 01 — Document type-only 0/0 coverage

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — an
installable, spec-driven framework (Markdown/YAML, no runtime engine) for
TDD + Clean Architecture, prompt → evidence-based evaluation. Layout:
`MANIFESTO.md`, `install.py`, `templates/` (→ `.catraca/`), `commands/` (phase
playbooks), `skills/` (13 skills), `examples/minimal/` (real TS+Vitest example).
Read `MANIFESTO.md` and `skills/workflows/quality-pipeline/SKILL.md` first.

## Goal

Document that pure type-only files (interfaces/type aliases) report **0/0** in v8
(and similar) coverage tools, that this does **not** lower the aggregate, and
that no per-file `exclude` is needed — so a 100% coverage gate isn't mistaken for
broken.

## Why it matters / what it solves

The worked example hit this: `domain/models`, `domain/usecases`, and
`presentation/protocols` show 0/0 because they compile to no executable code. A
newcomer chasing a green 100% gate can waste time "fixing" phantom gaps or add
needless excludes. One sentence in the right place prevents the detour.

## Scope / what's involved

1. Add a short note to `skills/workflows/quality-pipeline/SKILL.md` (near the
   coverage requirement) and/or `skills/testing/integration-tests/SKILL.md`:
   type-only files report 0/0; the aggregate stays accurate; do not add excludes
   to "fix" them.
2. Optionally cross-reference it from `templates/architecture.md`'s test
   conventions.

## Out of scope

- Changing coverage thresholds or tooling.

## Research

Confirm current behavior across runners before writing (queries: "v8 coverage
type-only file 0%", "vitest coverage interface files 0/0", "istanbul exclude
type-only typescript", "coverage report empty file no executable code"). Note any
runner where the advice differs.

## Acceptance / verification

- The note exists, is accurate, and matches what `examples/minimal`'s coverage
  table actually shows.
- No thresholds or excludes were changed.

## Commit

Branch `improve/01-type-only-coverage`. One commit. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
