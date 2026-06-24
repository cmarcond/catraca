# Improvement Plans

Each file here is a **self-contained plan** for one improvement to Catraca. Any
one can be handed to a fresh agent context and executed end to end: it carries
its own orientation, goal, scope, research step, acceptance criteria, and commit
instructions.

The numbers are now in **recommended execution order**: framework/method changes
first, tooling next, and example/demonstration work last (examples are
downstream artifacts — they should reflect a settled framework). Within that, do
them in any order **except plan 09, which runs last** (it regenerates the worked
example from the final framework).

## Active backlog (in execution order)

A completed plan moves to `done/` keeping its number, so a gap in the active
numbering just means that plan is done (e.g. 01 — EARS — and 02 — scoring model —
are done).

**Framework & method** — all done (see `done/`).

**Tooling & packaging**
| # | Plan | Effort | Depends on |
|---|---|---|---|
| 04 | [Ship skills as installable Agent Skills](04-installable-agent-skills.md) | medium | — |
| 05 | [`install.py` niceties](05-installer-niceties.md) | small | — |

**Examples (downstream — run after the framework is settled)**
| # | Plan | Effort | Depends on |
|---|---|---|---|
| 07 | [Second-stack example (Python)](07-second-stack-example-python.md) | medium–large | 02–03 + EARS (reflects final method) |
| 08 | [Completed example with a repair cycle](08-completed-example-repair-cycle.md) | medium | 02, 03 (scoring + evaluator) |
| 09 | [Regenerate the worked example](09-regenerate-worked-example.md) | medium | **everything — run last** |

## Done

- **Bootstrap-seam fix** — test runner passes with no tests during feature-000
  setup, so no commit bypasses the pipeline (`fix(pipeline): close the bootstrap
  seam without --no-verify`).
- [`done/01-ears-acceptance-criteria.md`](done/01-ears-acceptance-criteria.md) — EARS shipped as the **single default** dialect (not opt-in)
- [`done/02-formalize-scoring-model.md`](done/02-formalize-scoring-model.md) — scoring is now countable formulas (reproducible)
- [`done/03-independent-evaluator.md`](done/03-independent-evaluator.md) — a clean-context evaluator grades by default (no self-grading)
- [`done/06-standalone-glossary.md`](done/06-standalone-glossary.md) — terms extracted to `glossary.md`, linked at point of use
- [`done/01-type-only-coverage-note.md`](done/01-type-only-coverage-note.md)
- [`done/02-installer-self-test.md`](done/02-installer-self-test.md)
- [`done/11-strengthen-skills-content.md`](done/11-strengthen-skills-content.md)
- **Plan 09 (regenerate example) has already run once** against the current
  framework — but it is **re-runnable**, so it stays in the backlog: run it again
  after any of plans 01–08 land, to keep the example reflecting the final state.

## How to run one solo

1. Open a fresh agent in `/Users/cesar/Projects/catraca`.
2. Point it at the chosen plan file.
3. Let it follow the plan, including the research step, and commit per the plan's
   instructions.

Every plan ends commit messages with
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` and
branches off `master` first.
