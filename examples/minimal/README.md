# Worked Example — Polls API (mid-flight)

A **real, runnable** project produced by dogfooding Catraca: install into an
empty folder, then drive the method (`init → plan → implement → evaluate`) on a
tiny "Polls API". It shows the artifacts *in use* — real code, real tests, real
coverage, real evaluation evidence — and reflects the current framework (EARS
specs, countable scoring, independent-by-default evaluation, agent-skills
install).

> **Illustrative stack.** TypeScript + Vitest, chosen at **Gate B** (see
> `.catraca/architecture.md`). The method is **stack-agnostic** — see
> `examples/minimal-python/` for the same feature in Python.

## It is mid-flight on purpose

| Feature | State |
|---|---|
| **000 — Quality pipeline** | ✅ implemented + evaluated (real git hooks, 100% coverage gate, no `--no-verify`) |
| **001 — Create a poll** | ✅ implemented + evaluated end-to-end (red→green→refactor, 20 tests) |
| 002 — List open polls | 📝 spec only (EARS) |
| 003 — Cast a vote | 📝 spec only (EARS) |

Features 002 and 003 are specs only — what a project looks like partway through.

## What to read

- `.catraca/glossary.md` — the recurring terms in one place.
- `.catraca/questions.md` — the Gate A–D answers that seeded everything.
- `.catraca/{product,architecture,method}.md` — the init outputs.
- `.catraca/specs/001-create-poll.md` — the intent spec in **EARS** (behavior,
  no code).
- `.catraca/tasks/001-create-poll.md` — the red/green/refactor breakdown.
- `.catraca/evaluation/001-create-poll.md` — the rubric with **countable**
  evidence (formula in `evaluation/README.md`), a 3-mutation audit, and the
  **Evaluator** section.
- `src/` — the Clean Architecture layers (`domain → data → presentation →
  validation → infra → main`).

## Run it

```bash
cd examples/minimal
npm install
npm run typecheck     # tsc --noEmit (strict)
npm run lint          # eslint, zero warnings
npm run test:coverage # 20 tests, 100% coverage
```

Activate the quality gates in your own clone:

```bash
git config core.hooksPath .githooks
```

Then try a non-conventional commit message or stage a lint error and watch the
hook reject it — the "gate proof" the method requires.

## Notes

- **No `--no-verify` anywhere.** The pipeline's test script passes with no tests
  during setup (`vitest --passWithNoTests`), so the bootstrap commits clear the
  real hook; see `.catraca/evaluation/000-quality-pipeline.md`.
- **Skills as Agent Skills.** The installer also placed the 13 skills in
  `.claude/skills/` so Claude Code auto-discovers them; the canonical,
  index-referenced copy lives in `.catraca/skills/`.
- **Evaluation independence.** This committed example is hand-built, so its
  rubric is marked `self (not independent)`; a real run uses an independent
  clean-context evaluator (see `.catraca/commands/evaluate.md`).
