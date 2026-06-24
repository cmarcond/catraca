# Plan 06 — Second-stack example (Python)

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture that claims to be **agnostic
of language and platform** (the stack is chosen at Gate B; feature 000 proposes
the tools). Today `examples/minimal/` is the only worked example, in
TypeScript + Vitest. The framework is installed via `python3 install.py <dir>`,
which produces a clean `.catraca/`. Read `README.md`, `docs/usage.md`,
`examples/minimal/README.md`, and skim `examples/minimal/.catraca/` to see what a
finished example looks like.

> **Dependency:** this plan creates a NEW example; it does not edit
> `examples/minimal/`. If run before plan 12, coordinate so plan 12 regenerates
> both examples from the final framework.

## Goal

Add a second worked example in **Python** (same tiny "Polls API", feature 000 +
feature 001 "create a poll"), produced by dogfooding the method — proving the
agnosticism claim and flushing out any stack-specific assumptions baked into the
skills/templates.

## Why it matters / what it solves

A framework that says "any language" but ships one language is unproven. A Python
twin (pytest + ruff + mypy + pre-commit hooks) demonstrates portability and is
the best test that the skills/templates aren't secretly TS-shaped.

## Scope / what's involved

1. `python3 install.py examples/minimal-python` into a clean dir, then dogfood:
   init (Gate B = Python) → plan → implement feature 000 (ruff, mypy/pyright,
   commit-msg + pre-commit hooks via `core.hooksPath`, pytest + coverage gate) →
   implement feature 001 test-first across Clean Architecture layers → evaluate.
   Apply the **bootstrap-seam fix**: pytest should not fail on "no tests yet"
   during setup (configure so the empty run passes), so no `--no-verify`.
2. Mirror the TS example's structure (domain/data/presentation/validation/infra/
   main) idiomatically in Python (e.g. `Protocol` classes for boundaries,
   constructor injection, in-memory repository).
3. Fill all `.catraca/` artifacts with real evidence; everything must run green
   (pytest + coverage + ruff + type-check) from a clean checkout.
4. Add a README; keep `node_modules`-equivalent (`.venv`, `__pycache__`,
   `.pytest_cache`, coverage) gitignored.
5. Record any place the skills/templates assumed TS and had to be generalized —
   feed those back as small framework fixes (separate commit).

## Out of scope

- Implementing features 002/003 in Python (feature 001 is enough to prove it).

## Research

Confirm the current idiomatic Python quality toolchain before building (queries:
"python pre-commit hooks core.hooksPath without framework", "pytest coverage gate
100% fail-under config", "ruff mypy strict 2026 setup", "python Protocol clean
architecture dependency injection"). Use the leanest modern setup.

## Acceptance / verification

- From a clean checkout: create venv, install deps, and `pytest` (green),
  coverage at target, `ruff` clean, type-check clean.
- The hooks reject a bad commit message and a lint error (gate proofs recorded).
- The `.catraca/` evaluation cites real command output.

## Commit

Branch `improve/06-python-example`. Group the example in one commit; any
framework generalizations in a second commit. End messages with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
