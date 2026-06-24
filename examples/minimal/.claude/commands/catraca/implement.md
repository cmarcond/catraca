# /catraca.implement — Skill-Guided TDD Cycle

Implements **one feature at a time**, in roadmap order. Preconditions: the
feature's spec exists and is confirmed (except feature 000, which has no spec).
Outputs: `tasks/NNN-slug.md` + code + tests + commits.

> **Task numbering.** Feature 000 uses `T0.x` chore tasks (no red/green/refactor
> — see Step 0). Product features use `T1, T2, … T-final` red/green/refactor
> tasks. Details in `tasks/README.md`.

## Step 0 — Feature 000: the quality pipeline (first run)

If the roadmap's feature 000 is not yet implemented, it comes **before any
product feature** — the environment with active gates precedes the first
feature:

1. Create `tasks/000-quality-pipeline.md` from `tasks/TASKS-000-TEMPLATE.md`.
   Start with T0.0: the **requirements** are fixed (skill `quality-pipeline`);
   propose the **tools** appropriate to the platform in `architecture.md` and
   confirm with the user (guided mode) or record `[assumed]` (auto).
2. Execute the tasks in order: **one chore commit per tool** (skill
   `quality-pipeline`, Order of Operations). There is no red/green/refactor
   cycle here — the equivalent of "red" is to **deliberately trigger a violation
   and watch the gate reject it** (an invalid commit message rejected, broken
   lint blocking the pre-commit, a red test failing the suite). A gate without a
   rejection proof does not count as installed.
3. Capture the output of the proofs — these are the evidence for feature 000's
   rubric.
4. Evaluate feature 000 (`/catraca.evaluate`) before opening feature 001. From
   here on, every code change passes through the gates automatically.

## Step 1 — Load context

1. Re-read: `method.md` (profile + gates), `architecture.md` (layers,
   boundaries), the feature's spec, and **each SKILL.md** it references. Also
   read the **pedagogical notes and violations from prior rubrics**
   (`evaluation/*.md`): a lesson recorded there must not recur here — if the
   same violation reappears, this feature's rubric will treat it as a
   **recurrence**, with a larger penalty.
2. Derive the technical criteria from the skills' **Test Checklists** — they are
   your technical "definition of done", on top of the spec's acceptance
   criteria.

## Step 2 — Generate tasks

Create `tasks/NNN-slug.md` from `tasks/TASKS-TEMPLATE.md`:

- one task per behavior (the smallest observable rule), mapped to the WHEN/THEN
  it covers;
- order by layer: domain/data → presentation/validation → infra → main;
- each task is born with its red/green/refactor sub-items;
- last task: the feature's evaluation.

## Step 3 — Execute each task (the cycle)

For each task, in this order, without skipping:

1. **RED** — write the behavior's test. Run the suite. **Confirm it fails on the
   behavior's assertion** (not on an import/setup). Record in the red sub-item
   which assertion failed. *Hard gate: if you wrote production code before this
   step, delete it and start over from the test.*
2. **GREEN** — implement the minimum that makes it pass. A hardcoded value is a
   bridge: only acceptable if the task itself (or the next one) has the test
   that generalizes it. Run the suite until green.
3. **REFACTOR** — improve production and test under green. Do not introduce new
   behavior here. If there is nothing to refactor, mark "n/a".
4. **Gates** — verify the gates in `method.md` (layers, adapter, coverage).
5. **Commit** — if commits are required: one commit, `type(scope): imperative
   description`, with only this task's files. Record the hash in the task.
6. Check the boxes and move to the next task.

Per-layer patterns (consult the skills, do not invent):

- unit tests with `makeSut()` and doubles (`test-setup-factories`,
  `test-doubles`);
- controllers with error mapping at the boundary (`controller-error-boundary`);
- composite validation assembled by a factory (`input-validation`);
- repositories against an in-memory database (`integration-tests`);
- `Params`/`Result` types per use case (`layered-typing`).

## HALT

Stop and ask the user if: an ambiguity is unresolvable by the spec/skills; the
same test failed 3+ times with no new cause; you need a dependency outside
`architecture.md`. Otherwise, **do not stop in the middle of the feature** — not
even in guided mode is the middle of a feature a pause point.

## Closing the feature

- All of the feature's checkboxes checked, suite green, coverage at target.
- Update `roadmap.md` (the "implemented" checkbox).
- Proceed to `/catraca.evaluate` for the feature — the feature is not "done"
  without an evaluation.
