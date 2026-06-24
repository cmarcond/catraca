# Plan 04 — Formalize the scoring model

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. Evaluation lives in
`templates/evaluation/` (`README.md`, `RUBRIC-TEMPLATE.md`), driven by
`commands/evaluate.md`. Scoring today: per-skill scores (0–1 from each skill's
Test Checklist / Anti-Patterns) feed four transversal dimensions (`test_first`,
`layer_discipline`, `coverage`, `commit_discipline`); the **verdict**
(adherent/partial/non-adherent) derives from the dimensions vs the ratchet
threshold (default 0.9). `ratchet.json` stores best scores; `buffer` (0.05) is
the regression tolerance. Read `templates/evaluation/README.md` and
`commands/evaluate.md` first.

## Goal

Make the scoring **reproducible**: replace today's judgment-call dimension scores
with an explicit, documented computation so two evaluators (or two runs) land on
the same numbers.

## Why it matters / what it solves

The refactor clarified the *structure* (skills → dimensions → verdict) but the
dimension numbers are still subjective. That undermines the ratchet (a
"regression" depends on comparable numbers) and the "evidence over opinion"
ethos. A defined formula + worked example removes the wobble.

## Scope / what's involved

1. In `templates/evaluation/README.md`, define each dimension's computation
   explicitly. Suggested (refine via research): a dimension = the mean of its
   feeding per-skill scores, where each per-skill score = (Test Checklist items
   met) / (items applicable), with each present Anti-Pattern subtracting a fixed
   amount; a justified violation is handled per the evaluation mode. State how
   "applicable" is decided and how partial credit works.
2. Specify rounding and how the verdict thresholds apply (≥ threshold for all →
   adherent; one below → partial; majority below → non-adherent).
3. Add a small **worked scoring example** (one skill, one dimension, end to end)
   to the README so the formula is unambiguous.
4. Optionally add the per-dimension formula as a comment in `RUBRIC-TEMPLATE.md`.

## Out of scope

- Changing the dimensions themselves or the ratchet mechanics (warn/block/repair).

## Research

Survey how comparable rubrics/LLM-as-judge systems make scoring reproducible
before finalizing the formula (queries: "reproducible rubric scoring formula",
"LLM evaluation rubric inter-rater reliability", "weighted criteria scoring
software quality gate"). Choose the simplest scheme that removes ambiguity.

## Acceptance / verification

- The README defines, for every dimension, an exact computation a reader can
  apply by hand.
- The worked example's numbers follow the formula.
- Re-scoring `examples/minimal`'s feature 001 by the new formula reproduces the
  rubric's numbers (or the rubric is updated to match — note which).

## Commit

Branch `improve/04-scoring-model`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
