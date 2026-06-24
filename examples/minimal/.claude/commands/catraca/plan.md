# /catraca.plan — Roadmap and Per-Feature Specs

Preconditions: `product.md`, `architecture.md`, `method.md` filled in
(otherwise, run `/catraca.init`). Outputs: `roadmap.md` + one spec
`specs/NNN-slug.md` per feature.

## Step 1 — Roadmap

1. **Every roadmap starts with feature 000 — the quality pipeline.** It does
   not come from `product.md`; it comes from the method (skill
   `workflows/quality-pipeline`): mechanical gates for type-check, lint,
   commit-msg, pre-commit staged-only, and coverage, installed and proven
   before any product feature. It has no behavior spec; its tasks come from
   `tasks/TASKS-000-TEMPLATE.md`, adapted to the stack in `architecture.md`.
2. Start from the candidate features in `product.md`. If there is a **deploy**
   feature, that is where the Dockerfile/compose/image are born (with their own
   tasks and rubric) — containerizing the *dev* environment only enters the
   pipeline if G2b = containerized.
3. Order by domain dependency (what must exist first — e.g. answering a poll
   presupposes a created poll, which presupposes a logged-in user).
4. Number them `001, 002, …` and fill the table in `roadmap.md` with a "Depends
   on" column and the ordering notes (001 depends on 000).

**Gate E/G11 (guided):** present the roadmap and ask for confirmation of the
list and the order. Record it in `questions.md`. **Auto:** record the roadmap as
`[assumed]` and continue.

## Step 2 — One spec per feature

For each product feature in the roadmap (001+; feature 000 has no spec), create
`specs/NNN-slug.md` from `specs/FEATURE-TEMPLATE.md`:

1. **Intent** in a developer's voice, 2–5 sentences.
2. **Acceptance criteria** in **EARS** — observable behavior, including error
   cases as unwanted-behavior criteria (`If <invalid/duplicate/unauthorized>,
   then the system shall …`). See `specs/README.md` for the patterns.
3. **Out of scope**, explicit.
4. **Applicable skills**: consult `skills/index.yaml`; select by trigger (the
   "When To Use" section of each SKILL.md). A feature normally pulls in the
   testing skills + the ones for the layer(s) it touches. Excluding a skill that
   `method.md` marks as mandatory requires a justification in the spec.
5. **Dependencies**: the numbers of the prior features required.
6. **Run the leakage checklist** from the template — if the spec mentions a
   class, path, or library, rewrite it before closing. (Leakage and other terms:
   `../glossary.md`.)
7. **Adversarial review (before G12).** Delegate the spec's review to a
   **clean-context subagent** (in Claude Code, the Task tool), handing it only:
   `product.md`, `architecture.md`, the spec, and the adversarial checklist from
   `specs/README.md`. Its instruction is to **refute**, not to improve — it does
   not inherit this conversation and does not know the author's intent, only
   what is written. Resolve each finding (accept it, or refute it with a
   justification recorded in the spec) before presenting G12. *Claude-Code
   specific; without subagent support: do the review yourself in a separate
   pass, applying the checklist item by item.*

**Gate E/G12 (guided):** for each spec, after the adversarial review, present
the acceptance criteria (and the relevant review findings) and ask for
confirmation. **Auto:** mark `[assumed]` in `questions.md`.

## Step 3 — Closure

- Update the "spec" checkboxes in `roadmap.md`.
- Announce: next phase `/catraca.implement`, starting with feature 001.
