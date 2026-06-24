# Plan 12 — Regenerate the worked example (RUN LAST)

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. `examples/minimal/` is a real
worked example (TypeScript + Vitest) that was produced by **dogfooding** the
method: install into a clean dir, then run `/catraca.init → plan → implement →
evaluate` on a tiny "Polls API". It is mid-flight (feature 000 + feature 001
done; 002/003 specs only). Read `README.md`, `docs/usage.md`,
`examples/minimal/README.md`, and the existing `examples/minimal/.catraca/` to see
the target shape. The installer is `python3 install.py <dir>`.

## Goal

**Delete the existing worked example(s) and regenerate them from scratch against
the final, improved framework**, so the shipped example reflects every
improvement (bootstrap fix, scoring model, independent evaluator, strengthened
skills, etc.) and contains no stale artifacts.

## Why this runs last

The example is downstream of the framework: every other plan can change the
skills, templates, commands, scoring, or installer. Rather than hand-patch the
example after each change (error-prone and inconsistent), regenerate it once, at
the end, from the final state. **Do not run this until the other improvement
plans you intend to ship are merged.**

## Scope / what's involved

1. `rm -rf examples/minimal` (and `examples/minimal-python` / `examples/complete`
   if those plans were done). Start clean.
2. For each example: `python3 install.py <scratch-dir>` using the current repo,
   then dogfood the full flow with REAL artifacts:
   - init (author Gate A–D answers for the Polls API + the chosen stack),
   - plan (roadmap + specs),
   - implement feature 000 (quality pipeline — using the **bootstrap-seam fix**:
     test runner passes with no tests; NO `--no-verify` anywhere) and feature 001
     test-first across the Clean Architecture layers,
   - evaluate with the (possibly formalized) scoring model and the
     (possibly independent) evaluator, running real directed-mutation audits.
3. Copy the result into `examples/` minus `node_modules`, `.git`, and `coverage`
   (keep a `.gitignore` for those). Verify it runs green from a fresh install
   (typecheck, lint, tests, coverage at target).
4. Rewrite each example's `README.md` (state: what's implemented vs spec-only,
   the illustrative-stack banner, how to run, how to activate the hooks).
5. Reconcile docs: ensure `README.md` / `docs/usage.md` references to the example
   still match, and that no doc claims `--no-verify` is needed.

## Out of scope

- Changing the framework itself (that's the other plans). If regenerating
  surfaces a framework bug, fix it in a separate commit and note it.

## Research

Re-check the current stack toolchain versions/flags at regeneration time
(queries: "vitest latest coverage flags", "eslint flat config latest",
"typescript strict latest"). Use current versions so the example doesn't ship
stale config.

## Acceptance / verification

- Each shipped example runs green from a clean `npm install` (or venv): typecheck,
  lint, tests, coverage at target.
- No `--no-verify` anywhere; the bootstrap commits pass the real hooks.
- All `.catraca/` artifacts carry real evidence consistent with the code, and the
  rubric/ratchet numbers follow the (final) scoring model.
- No Portuguese; all cross-references resolve.

## Commit

Branch `improve/12-regenerate-example`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
