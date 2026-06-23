# /catraca.status — Where We Are and the Next Action

Reconstructs the project's state **from the files only** (not from conversation
memory) and announces the next action. It also reconciles decision reviews.

## Step 1 — Read the state

| Check | Source |
|---|---|
| Init done? | `questions.md` (gates A–D answered?), `product.md`/`architecture.md`/`method.md` filled in? |
| Plan done? | does `roadmap.md` have features? do specs exist for all of them? |
| Feature in progress? | the first `tasks/NNN-*.md` with an open checkbox |
| Pending evaluations? | features with "implemented" checked and "evaluated" open in the roadmap |
| Regressions? | alerts recorded in the rubrics + `ratchet.json` |

## Step 2 — Reconcile reviews

If any row of `questions.md` has the "Review" column filled in and not yet
applied (gate → file mapping is the table in `init.md`):

1. identify the affected artifacts (G2–G4 ⇒ `architecture.md`; G5–G8 ⇒
   `method.md`; G9–G10 ⇒ `evaluation/` + `ratchet.json` `mode`);
2. propose the edits to the user (guided mode) or apply and record them (auto);
3. mark the review as applied in the table itself.

## Step 3 — Report

Answer in a few lines:

- the current phase (init / plan / implement feature NNN / evaluate feature NNN
  / roadmap complete);
- pending items and alerts (open rubrics, ratchet regressions, `[assumed]`
  assumptions not yet reviewed — list them for the user to validate);
- the **next concrete action** (which command, which feature).
