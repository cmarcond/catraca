# Evaluation — How to Evaluate Adherence to the Method

One rubric per feature, `NNN-slug.md` (same number as the spec), filled in by
`/catraca.evaluate` at the end of the implementation. Use `RUBRIC-TEMPLATE.md`.

## Principles

- **Evidence or it didn't happen.** Each rubric line requires verifiable
  evidence: a command run + its relevant output, or a reference to a
  test/file/commit. Self-report with no evidence scores 0.
- **Independent by default.** The score of record comes from a clean-context
  evaluator that never saw the implementation conversation — the implementer does
  not grade its own work (self-preference bias). Protocol and fallback:
  `commands/evaluate.md`, Step 2.
- **Evaluation mode** (from `method.md`, Gate D/G9):
  - *strict*: any unjustified violation zeros the dimension;
  - *pedagogical* (default): a violation reduces the score and the rubric
    explains what the method would ask for and why;
  - *pragmatic*: a violation justified in its own column does not penalize.

## How scoring works (skills → dimensions → verdict)

Three levels, all computed from **counts** so two evaluators (or two runs) reach
the same numbers. Round every score to **two decimals** (half up). The unit is a
**binary, evidence-backed check** — a check with no evidence counts as unmet.

### 1. Per-skill score (0–1)

For each skill declared in the spec, from its **Test Checklist** and
**Anti-Patterns**:

- `applicable` = checklist items whose precondition holds for this feature (mark
  the rest **N/A** — they leave the denominator). If every item is N/A, the skill
  is N/A and is omitted.
- `met` = applicable items satisfied with evidence.
- `raw = met / applicable`.
- `penalty = 0.25 × (anti-patterns observed)`.
- **`score = max(0, raw − penalty)`**.

A *justified* anti-pattern (justification recorded) is handled by the evaluation
mode: **pragmatic** drops the penalty; **pedagogical** keeps it and records the
lesson; **strict** zeros the dimension it belongs to (see step 3).

### 2. Transversal dimensions (0–1)

Four cross-cutting scores, each a direct **compliant ÷ total** ratio — measured,
not averaged from the skills. The "reinforced by" skills explain a low score;
they do not compute it.

| Dimension | Score = | Reinforced by |
|---|---|---|
| `test_first` | behaviors whose red was seen to fail before green ÷ total behaviors | `tdd-minimal-step` |
| `layer_discipline` | new units with no illegal import ÷ units inspected | `dependency-inversion-adapters`, `layered-typing`, `project-structure` |
| `coverage` | min(1, measured coverage ÷ profile target) | `quality-pipeline` |
| `commit_discipline` | commits that are conventional **and** scoped to one task ÷ total commits | `git-conventions` |

Sources: `test_first` from the tasks' checked red items + git order;
`layer_discipline` from per-layer import inspection; `coverage` from the runner
report; `commit_discipline` from `git log`.

### 3. Verdict

Let `threshold` = the dimension's recorded ratchet floor, or the canonical
default **0.9** if none. After applying the evaluation mode (strict zeros a
dimension with an unjustified violation):

- **adherent** — every dimension ≥ threshold;
- **partial** — one or more dimensions below threshold, but fewer than half;
- **non-adherent** — half or more of the dimensions below threshold.

The per-skill scores justify and explain; the four dimensions decide the verdict.

### Worked example (feature "create a poll")

- **coverage** — runner reports 100%, target 100% → min(1, 100/100) = **1.00**.
- **test_first** — 5 behaviors, each with a red seen before green → 5/5 = **1.00**.
- **layer_discipline** — 13 new units inspected, 0 illegal imports → 13/13 = **1.00**.
- **commit_discipline** — 5 feature commits, all conventional and one-per-task →
  5/5 = **1.00**.
- **per-skill `error-observability`** — 5 applicable items (3 N/A: no logging
  destination wired yet), 4 met, 0 anti-patterns → 4/5 − 0 = **0.80**.

Every dimension ≥ 0.9 → **verdict: adherent**; the 0.80 on a deferred skill is
recorded as the one gap. (These are the numbers in `examples/minimal`'s feature
001 rubric.)

## Ratchet

`ratchet.json` keeps the best score ever reached, per feature and dimension:

```json
{
  "buffer": 0.05,
  "mode": "warn",
  "features": {
    "001-registration": {
      "verdict": "adherent",
      "scores": {"test_first": 1.0, "layer_discipline": 1.0, "coverage": 1.0,
                  "commit_discipline": 0.9, "skills": {"testing/tdd-minimal-step": 1.0}}
    }
  }
}
```

After each evaluation:

1. A score **higher** than the recorded one → update the ratchet (it moves up).
2. A score **lower** than `recorded − buffer` → regression. The `mode` decides:
   - **`warn`**: record the alert in the rubric and continue.
   - **`block`**: HALT — stop and report to the user before continuing with any
     other feature.
   - **`repair`**: trigger the repair cycle (below).
3. Update `last_check_at` (ISO 8601).

## Repair cycle (`mode: repair`)

1. **Append repair tasks** to the feature's `tasks/NNN-*.md` (a "Regression
   repair — ratchet" section, numbered R1, R2…), one per degraded dimension.
   Each task's **red** is the evidence of the regression (a coverage report
   below the floor, an import that violates a layer, a failing Test Checklist
   item); the **green** is the fix; **refactor** under green as always.
2. **Repair adherence, not behavior**: the repair covers what was left untested,
   fixes boundaries, extracts responsibilities — it never reverts legitimate
   product evolution.
3. **Historical dimensions cannot be repaired**: `test_first` and
   `commit_discipline` of already-written code are past facts (git history is
   immutable). Record the debt in the rubric and apply the rigor from there on;
   don't fake the score.
4. **One cycle only**: run the R tasks, re-evaluate once. Recovered the floor →
   the ratchet is up to date. Still below → **HALT**: report to the user, who
   decides between accepting the new level (consciously lowering the floor,
   recording it in `questions.md`) or directing another repair.
