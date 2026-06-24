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

## Step 2 — Score the feature (independently)

The implementer must not grade its own work — that is **self-preference bias**,
the most-cited weakness of self-evaluation. The score of record is produced by an
**independent evaluator** that never saw the implementation conversation.

**Who scores.** A clean-context evaluator — in Claude Code, the Task tool; better
still, a separate model. It receives **only**:

- the feature spec and the declared skills (their SKILL.md files);
- the code and the project's `architecture.md`;
- the verification commands (suite, coverage, `git log`, import inspection);
- the scoring formula in `evaluation/README.md`.

It does **not** receive the build conversation, the agent's reasoning, or a
pre-filled rubric.

**What it does** — fill `evaluation/NNN-slug.md` from `RUBRIC-TEMPLATE.md`, from
scratch:

1. **Per declared skill**: walk the **Test Checklist** and **Anti-Patterns**;
   compute `max(0, met/applicable − 0.25 × anti-patterns)` (`evaluation/README.md`).
   Concrete evidence per line; no evidence ⇒ unmet; each anti-pattern ⇒ a
   recorded "violation".
2. **Transversal dimensions** — each a compliant/total ratio: `test_first`,
   `layer_discipline`, `coverage` = min(1, measured/target), `commit_discipline`.
3. **Directed mutation testing** — line coverage does not prove assertion. For
   each critical criterion, mutate the corresponding link in production and run
   the suite: if no test breaks (even at 100% coverage), the criterion is covered
   but not asserted — a finding that lowers the relevant skill score. Revert each
   mutation. (Examples: remove the error log but keep the 500; invert an
   authorization rule; flip a range's boundary comparison; return success without
   persisting.)
4. Apply the **evaluation mode** from `method.md` (G9): strict zeros a dimension
   on an unjustified violation; pedagogical penalizes and explains; pragmatic
   does not penalize a justified one. In pedagogical mode a violation already
   noted as a lesson in an earlier feature is a **recurrence** and is penalized
   more.
5. Give the **verdict**: `adherent` / `partial` / `non-adherent`.

**Disagreement.** The implementer may keep a quick self-score, but the
independent score is authoritative. If they differ by more than `buffer` on any
dimension, re-check the evidence together; the independent score stands unless
the implementer points to concrete evidence the evaluator missed. Record the
evaluator identity and the resolution in the rubric's **Evaluator** section.

**Fallback (no subagent / single agent).** Run the evaluation in a **second,
fresh invocation** with the context cleared — that preserves independence. If even
that is impossible, the implementer may fill the rubric but must mark the
evaluator **`self (not independent)`** — a recorded limitation, never hidden; the
mutation pass and the evidence-per-line rule remain mandatory.

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
