# /catraca.init — Elicit or Assume; Generate Product, Architecture, and Method

The agent's playbook for the initialization phase. Precondition: `.catraca/`
installed. Outputs: `questions.md`, `product.md`, `architecture.md`, `method.md`
filled in.

## Gates A–E and what each writes

The phases are named **Gate A–E**; their individual sub-questions are numbered
**G1–G12**. This is the canonical mapping (referenced by `/catraca.status` when
reconciling reviews):

| Gate | Sub-questions | Writes |
|---|---|---|
| A — Product | G1 | `product.md` |
| B — Platform & architecture | G2, G2b, G3, G4 | `architecture.md` |
| C — Method rigor | G5–G8 | `method.md` |
| D — Evaluation | G9, G10 | `method.md` (eval mode), `ratchet.json` (`mode`) |
| E — Per feature | G11 (roadmap), G12 (specs) | `roadmap.md`, `specs/` (in `/catraca.plan`) |

## Step 0 — Detect the mode

- If the user asked for "auto mode" (or equivalent) in the prompt: **auto
  mode**. Otherwise: **guided mode**.
- Re-read `.catraca/CLAUDE.md`, `manifesto.md` (constitutional principles —
  they already hold; do not ask the user whether they "want TDD") and
  `method.md`.

## Step 1 — Gates A–D

**Guided mode.** Walk the gates in `questions.md` in order A → B → C → D, **one
gate at a time** (never all questions at once). For each gate:

1. Present the gate's questions with suggestions derived from the initial prompt
   (whatever the user already set in the prompt becomes a proposal to confirm,
   not an open question), justified by what the project needs.
2. Record each answer in the table in `questions.md`.
3. Only advance to the next gate once the current one is complete.

**Auto mode.** Fill all answers with the canonical-profile defaults (footer of
`questions.md`), marking each one `[assumed YYYY-MM-DD]`. Whatever the initial
prompt set explicitly (e.g. the stack) is not an assumption — record it as
coming from the prompt.

## Step 2 — Product spec

Fill `product.md` from the prompt + G1. Rules:

- product language, zero technical decisions; success is what the user becomes
  able to do;
- numbered candidate features, named as a capability ("login"), not as an
  endpoint;
- "out of scope" is never empty — state at least the obvious things left out.

**Pause (guided):** show `product.md` and ask for confirmation before
continuing.

## Step 3 — Architecture spec

Fill `architecture.md` from Gate B (G2, G2b, G3, G4):

- layer profile (strict = the full table from the template; light = 3 layers,
  document the merge);
- boundaries/adapters table: one row per external dependency from G4 — the
  protocol (and which layer it lives in) + the adapter;
- per-layer test conventions.

**Pause (guided):** confirm before continuing.

## Step 4 — Method

Fill `method.md` from G5–G10:

- the rigor-profile table with an "Origin" column (user answer / `[assumed]` /
  prompt);
- the skills table: every exclusion or downgrade to "optional" requires a
  justification;
- the operationalized gates are not editable — only the coverage target and the
  commit requirement vary with the profile.

## Step 5 — Closure

- Confirm the 4 files are consistent with each other (is the stack cited in the
  method? do the architecture's layers match G3?).
- Announce the next phase: `/catraca.plan`.
- In auto mode: proceed straight to plan without stopping.
