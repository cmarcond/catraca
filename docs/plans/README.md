# Improvement Plans

Each file is a **self-contained plan** for one improvement to Catraca — runnable
solo from a clean context (orientation, goal, scope, research step, acceptance
criteria, commit instructions). They were executed in a deliberate order:
framework/method first, tooling next, examples last (examples are downstream
artifacts that should reflect a settled framework).

## Active backlog

**Empty — all plans are done.** Completed plans live in `done/` (keeping their
number). Add a new `NN-*.md` here to queue more work.

## Done (`done/`)

- **Bootstrap-seam fix** — the test runner passes with no tests during
  feature-000 setup, so no commit bypasses the pipeline (no `--no-verify`).
- **01 — EARS acceptance criteria** — shipped as the single default dialect.
- **02 — Formalize the scoring model** — reproducible, countable formulas.
- **03 — Independent evaluator** — a clean-context evaluator grades by default.
- **04 — Installable Agent Skills** — skills also installed to `.claude/skills/`
  for auto-discovery.
- **05 — `install.py` niceties** — `--dry-run`, version stamp, clearer conflicts.
- **06 — Standalone glossary** — terms in `glossary.md`, linked at point of use.
- **07 — Python example** — `examples/minimal-python/` proves agnosticism (also
  surfaced the pytest `--no-cov` bootstrap fix).
- **08 — Completed example + repair cycle** — `examples/complete/` exercises the
  ratchet repair end-to-end (a real layer-discipline regression → R1 → recovery).
- **09 — Regenerate the worked example** — `examples/minimal/` rebuilt from the
  final framework. *Re-runnable*: run it again if the framework changes.
- Earlier one-offs: type-only coverage note, installer self-test, strengthen the
  13 skills.

## How to run one solo

1. Open a fresh agent in `/Users/cesar/Projects/catraca`.
2. Point it at the chosen plan file.
3. Let it follow the plan, including the research step, and commit per the plan's
   instructions.

> Note: the older plan files contain a `Co-Authored-By` line in their commit
> instructions. Do **not** add it — this repo's commits omit AI co-author
> trailers.
