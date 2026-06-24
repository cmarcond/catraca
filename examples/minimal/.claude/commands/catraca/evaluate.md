# /catraca.evaluate — Adherence Rubric + Ratchet

Evaluates **one implemented feature**. Preconditions: the feature's tasks are
complete, suite green. Outputs: `evaluation/NNN-slug.md` + updated
`ratchet.json`.

> **The ratchet has three modes** (set at Gate D, stored in `ratchet.json`):
> `warn` records the regression and continues; `block` halts and reports;
> `repair` attaches repair tasks and re-evaluates once. The `buffer` (default
> 0.05) is a tolerance band: a score between `best − buffer` and `best` is not a
> regression. See Step 3.

## Step 1 — Collect evidence (before scoring)

Run and capture a summarized output:

1. the full test suite;
2. the coverage report;
3. `git log --oneline` of the feature's commits;
4. an import inspection of the new units, per layer (against the table in
   `architecture.md`).

## Step 2 — Fill the rubric

Create `evaluation/NNN-slug.md` from `evaluation/RUBRIC-TEMPLATE.md`:

1. **Per skill declared in the spec**: open the SKILL.md, walk the **Test
   Checklist** (score = met/applicable) and the **Anti-Patterns** (present ⇒
   penalize and record a "violation"). Concrete evidence on every line — no
   evidence, 0.
2. **Transversal dimensions**: `test_first` (red order in the tasks + history),
   `layer_discipline` (imports), `coverage` (report vs the profile's target),
   `commit_discipline` (format + one-per-task).
3. Apply the **evaluation mode** from `method.md` (G9): strict zeros a dimension
   with an unjustified violation; pedagogical penalizes and explains; pragmatic
   does not penalize a justified violation. In pedagogical mode, compare with
   the prior rubrics: a violation already noted as a lesson in an earlier
   feature is a **recurrence** and is penalized more.
4. Give the **verdict**: `adherent` / `partial` / `non-adherent`.

## Step 2b — Independent audit of the rubric

Before the ratchet, delegate the audit to a **clean-context subagent** (in
Claude Code, the Task tool), handing it: the spec, the declared skills, the
filled rubric with its evidence, and the verification commands (suite, coverage,
`git log`, import inspection). Its instruction is to **knock scores down**, on
two fronts:

1. **Re-execution**: re-run each piece of evidence and look for a score without
   proof, an undetected violation, or an ignored anti-pattern.
2. **Directed mutation testing** — line coverage does not prove assertion;
   mutation is the test of the test. For each critical criterion in the spec,
   mutate the corresponding link in production and run the suite: if no test
   breaks (even at 100% coverage), the criterion is covered without being
   asserted — a finding. Revert the mutation after each proof. Examples of a
   mutation per criterion: remove the error log while keeping the 500; invert an
   authorization rule; flip the boundary comparison of a range; return success
   without persisting.

It **does not rewrite the rubric** — it only reports findings; you accept it
(adjust the score) or refute it with a justification, and record the result on
the rubric's "Audit" line (including mutations applied × survivors).
*Claude-Code specific; without subagent support: run both fronts yourself in a
separate pass before the ratchet, and record the audit as "self".*

## Step 3 — Ratchet

Follow `evaluation/README.md`:

1. compare each score with `ratchet.json`;
2. higher → update it (the ratchet moves up); lower than `best − buffer` →
   regression:
   - `mode: warn` ⇒ an alert recorded in the rubric;
   - `mode: block` ⇒ HALT, report to the user before any other feature;
   - `mode: repair` ⇒ append repair tasks (R1, R2…) to `tasks/NNN-*.md`, one per
     degraded dimension (red = evidence of the regression; green = the fix;
     refactor under green), run them through the normal cycle in `implement.md`,
     and **re-evaluate once**. Recovered ⇒ continue; still below ⇒ HALT (the
     user decides: consciously lower the floor or direct a new repair). Repair
     adherence, never revert behavior; historical dimensions (`test_first`,
     `commit_discipline` of already-written code) cannot be repaired — because
     git history is immutable — so record the debt instead.
3. update `last_check_at` and the feature's verdict.

## Step 4 — Closure

- Update `roadmap.md` (the "evaluated" checkbox).
- Summarize for the user: verdict, scores, violations, and (pedagogical mode)
  the learning notes.
- Next action: the next feature in the roadmap, or the end of the roadmap.
