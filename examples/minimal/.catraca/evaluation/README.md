# Evaluation — How to Evaluate Adherence to the Method

One rubric per feature, `NNN-slug.md` (same number as the spec), filled in by
`/catraca.evaluate` at the end of the implementation. Use `RUBRIC-TEMPLATE.md`.

## Principles

- **Evidence or it didn't happen.** Each rubric line requires verifiable
  evidence: a command run + its relevant output, or a reference to a
  test/file/commit. Self-report with no evidence scores 0.
- **Evaluation mode** (from `method.md`, Gate D/G9):
  - *strict*: any unjustified violation zeros the dimension;
  - *pedagogical* (default): a violation reduces the score and the rubric
    explains what the method would ask for and why;
  - *pragmatic*: a violation justified in its own column does not penalize.

## How scoring works (skills → dimensions → verdict)

The model has three levels:

1. **Per-skill score (0–1)** — for each skill declared in the spec, derived from
   the skill's **Test Checklist** and **Anti-Patterns**: items met / items
   applicable; a present anti-pattern discounts.
2. **Transversal dimensions (0–1)** — four cross-cutting scores, always
   measured, each fed by the relevant skill scores and the direct evidence:

   | Dimension | What it measures | How to verify | Fed by |
   |---|---|---|---|
   | `test_first` | Tests preceded production | commit history / order of the red tasks checked | `tdd-minimal-step` |
   | `layer_discipline` | Imports respect `architecture.md` | per-layer import inspection | `dependency-inversion-adapters`, `layered-typing`, `project-structure` |
   | `coverage` | Coverage vs the profile's target | test-runner report | `quality-pipeline` |
   | `commit_discipline` | One commit per task, conventional format | `git log` | `git-conventions` |

3. **Verdict** — derived from the transversal dimensions against the ratchet's
   threshold (the floor recorded in `ratchet.json`; in the absence of a prior
   floor, the canonical default is **0.9**):
   - `adherent` — all dimensions ≥ threshold;
   - `partial` — at least one dimension below threshold;
   - `non-adherent` — the majority of dimensions below threshold.

   The per-skill scores justify the dimension scores; the dimensions decide the
   verdict.

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
