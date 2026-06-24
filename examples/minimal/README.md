# Worked Example — Polls API (mid-flight)

A **real, runnable** project produced by dogfooding Catraca: it was created by
running `install.py` into an empty folder and then driving the method
(`init → plan → implement → evaluate`) on a tiny "Polls API". Unlike a blank
install, this shows what the artifacts look like *in use*, with real code, real
tests, real coverage, and real evaluation evidence.

> **Illustrative stack.** TypeScript + Vitest was chosen at **Gate B** for this
> example (see `.catraca/architecture.md`). The method itself is
> **stack-agnostic** — Gate B could just as well pick Python, Go, or anything
> else; feature 000 would then propose that stack's tools.

## It is mid-flight on purpose

| Feature | State |
|---|---|
| **000 — Quality pipeline** | ✅ implemented + evaluated (real git hooks, 100% coverage gate) |
| **001 — Create a poll** | ✅ implemented + evaluated end-to-end (real red→green→refactor, 19 tests) |
| 002 — List open polls | 📝 spec only |
| 003 — Cast a vote | 📝 spec only |

Features 002 and 003 are written as specs (`.catraca/specs/`) but not yet
implemented — that is what a project looks like partway through the roadmap.

## What to read

- `.catraca/questions.md` — the Gate A–D answers that seeded everything.
- `.catraca/{product,architecture,method}.md` — the init outputs.
- `.catraca/roadmap.md` — the feature order.
- `.catraca/specs/001-create-poll.md` — the intent spec (behavior, no code).
- `.catraca/tasks/001-create-poll.md` — the red/green/refactor breakdown, with
  the real commit hashes.
- `.catraca/evaluation/001-create-poll.md` — the rubric with real evidence
  (coverage, import discipline, a 3-mutation audit).
- `src/` — the Clean Architecture layers (`domain → data → presentation →
  validation → infra → main`).

## Run it

```bash
cd examples/minimal
npm install
npm run typecheck     # tsc --noEmit (strict)
npm run lint          # eslint, zero warnings
npm run test:coverage # 19 tests, 100% coverage
```

To activate the quality gates (commit-msg + pre-commit hooks) in your own clone:

```bash
git config core.hooksPath .githooks
```

Then try a non-conventional commit message or stage a lint error and watch the
hook reject it — that is the "gate proof" the method requires.

## Note on the bootstrap commits

The git history this example was built from shows the six `chore(pipeline)`
setup commits using `--no-verify`. That is the one honest exception: the
`pre-commit` hook runs the test suite, which fails when *no test files exist
yet*, so the pipeline cannot pass its own gate before there is anything to test.
Every commit from the first product test onward passed the real hooks with no
bypass. This is recorded in `.catraca/evaluation/000-quality-pipeline.md`.
