# Worked Example — Polls API (mid-flight)

A **real, runnable** project produced by dogfooding Catraca: install into an
empty folder, then drive the method (`init → plan → implement → evaluate`) on a
tiny "Polls API". Unlike a blank install, this shows the artifacts *in use*, with
real code, real tests, real coverage, and real evaluation evidence.

> **Illustrative stack.** TypeScript + Vitest was chosen at **Gate B** (see
> `.catraca/architecture.md`). The method itself is **stack-agnostic** — Gate B
> could pick Python, Go, etc.; feature 000 would then propose that stack's tools.

## It is mid-flight on purpose

| Feature | State |
|---|---|
| **000 — Quality pipeline** | ✅ implemented + evaluated (real git hooks, 100% coverage gate) |
| **001 — Create a poll** | ✅ implemented + evaluated end-to-end (red→green→refactor, 20 tests) |
| 002 — List open polls | 📝 spec only |
| 003 — Cast a vote | 📝 spec only |

Features 002 and 003 are specs (`.catraca/specs/`) but not implemented — what a
project looks like partway through the roadmap.

## What to read

- `.catraca/questions.md` — the Gate A–D answers that seeded everything.
- `.catraca/{product,architecture,method}.md` — the init outputs.
- `.catraca/roadmap.md` — the feature order.
- `.catraca/specs/001-create-poll.md` — the intent spec (behavior, no code).
- `.catraca/tasks/001-create-poll.md` — the red/green/refactor breakdown with
  real commit hashes.
- `.catraca/evaluation/001-create-poll.md` — the rubric with real evidence
  (coverage, import discipline, a 3-mutation audit with 0 survivors).
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

To activate the quality gates (commit-msg + pre-commit hooks) in your own clone:

```bash
git config core.hooksPath .githooks
```

Then try a non-conventional commit message or stage a lint error and watch the
hook reject it — the "gate proof" the method requires.

## On the quality pipeline's bootstrap

Feature 000 installs a `pre-commit` hook that runs the test suite — but the
setup commits land before any test exists. Rather than bypass the gate with
`--no-verify`, the test script passes with no tests yet
(`vitest run --passWithNoTests`): the setup commits clear the **real** hook
(type-check and lint still gate them), and tests begin gating at the first test.
**No commit in this example used `--no-verify`** — see
`.catraca/evaluation/000-quality-pipeline.md`.
