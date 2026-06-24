# Plan 07 — Completed example with a repair cycle

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. The **ratchet**
(`ratchet.json`, `commands/evaluate.md`, `templates/evaluation/README.md`) stores
the best score per feature/dimension and reacts to regressions per `mode`:
`warn`, `block`, or `repair`. In `repair` mode, the evaluator appends repair
tasks (R1, R2…) to the feature's `tasks/` file, runs them, and re-evaluates once.
The current `examples/minimal/` is **mid-flight**: feature 000 + feature 001
implemented; 002/003 are specs only. Read `templates/evaluation/README.md`,
`commands/evaluate.md`, and `examples/minimal/.catraca/`.

> **Dependency:** coordinate with plan 12. This either extends the regenerated
> example or is a separate `examples/complete/`. Decide and state which.

## Goal

Add a worked example that exercises the parts nothing currently demonstrates:
a **finished roadmap** (features 002 "list" and 003 "vote" implemented) **and a
real ratchet `repair` cycle** triggered by a deliberate regression.

## Why it matters / what it solves

The ratchet and its `repair` machinery are central to Catraca's "quality only
moves forward" thesis, yet no example shows them firing. A completed example with
an intentional regression → detected by the ratchet → repair tasks → recovery
proves the mechanism and teaches it.

## Scope / what's involved

1. Either continue `examples/minimal` to a finished roadmap, or create
   `examples/complete` (recommended, so `minimal` stays a clean mid-flight
   teaching artifact). State the choice in the README.
2. Implement features 002 and 003 test-first across the layers (real code, real
   tests, real evaluations, ratchet updated each time).
3. Stage a **deliberate, realistic regression** (e.g. feature 003 drops a
   validation that feature 001 had, lowering a dimension below `best − buffer`),
   let `/catraca.evaluate` detect it in `repair` mode, append R-tasks, fix, and
   re-evaluate — capturing the whole cycle in the rubric and `ratchet.json`
   history.
4. README walks through the ratchet/repair story with the real evidence.

## Out of scope

- New framework features; this exercises existing mechanics only.

## Research

Check whether the repair-cycle rules in `evaluation/README.md` are fully
specified for a real run; if gaps appear while doing it, note them (a follow-up
to plan 04/05). No external research strictly required, but skim current thinking
on "ratchet / quality gates that only move forward" to frame the README.

## Acceptance / verification

- All features run green; coverage at target across the roadmap.
- The regression is genuinely detected by the ratchet logic (not narrated), the
  repair tasks exist, and re-evaluation shows recovery — all backed by real
  command output and `ratchet.json` diffs.

## Commit

Branch `improve/07-complete-example`. End messages with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
