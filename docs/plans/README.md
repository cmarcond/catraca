# Improvement Plans

Each file here is a **self-contained plan** for one improvement to Catraca. Any
one can be handed to a fresh agent context and executed end to end: it carries
its own orientation, goal, scope, research step, acceptance criteria, and commit
instructions. They are independent — do them in any order — **except plan 12,
which must run last** (it regenerates the worked example from the final
framework).

> Already done (not a plan here): the **bootstrap-seam fix** — the test runner
> now passes with no tests during feature-000 setup, so no commit bypasses the
> pipeline. See commit `fix(pipeline): close the bootstrap seam without
> --no-verify`.

| # | Plan | Effort | Solves |
|---|---|---|---|
| 01 | [Document type-only 0/0 coverage](01-type-only-coverage-note.md) | small | Confusion when a 100% gate shows 0/0 type files |
| 02 | [Installer self-test](02-installer-self-test.md) | small–medium | `install.py` has no safety net |
| 03 | [EARS acceptance criteria option](03-ears-acceptance-criteria.md) | medium | Ambiguity in WHEN/THEN specs |
| 04 | [Formalize the scoring model](04-formalize-scoring-model.md) | medium | Dimension scores are judgment calls |
| 05 | [Independent evaluator](05-independent-evaluator.md) | medium | The implementing agent grades itself |
| 06 | [Second-stack example (Python)](06-second-stack-example-python.md) | medium–large | Agnosticism is claimed but only TS is shown |
| 07 | [Completed example with a repair cycle](07-completed-example-repair-cycle.md) | medium | Ratchet `repair` is never exercised end-to-end |
| 08 | [Ship skills as installable Agent Skills](08-installable-agent-skills.md) | medium | Skills are referenced, not auto-discovered |
| 09 | [`install.py` niceties](09-installer-niceties.md) | small | No dry-run / version / smart update |
| 10 | [Standalone glossary](10-standalone-glossary.md) | small | Terms buried inside MANIFESTO |
| 11 | [Strengthen the 13 skills' content](11-strengthen-skills-content.md) | large | Skills were translated, not improved |
| 12 | [Regenerate the worked example](12-regenerate-worked-example.md) | medium | **Run last** — the shipped example must reflect the final framework |

## How to run one solo

1. Open a fresh agent in `/Users/cesar/Projects/catraca`.
2. Point it at the chosen plan file.
3. Let it follow the plan, including the research step, and commit per the plan's
   instructions.

Every plan ends commit messages with
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` and
branches off `master` first.
