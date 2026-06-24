# Worked Example — Polls API in Python (mid-flight)

The **same** tiny "Polls API" as `examples/minimal/` (TypeScript), built in
**Python 3.11** by dogfooding Catraca. Its purpose is to **prove the method is
stack-agnostic**: identical specs, skills, gates, and rubric — only the tools
differ (pytest/ruff/mypy instead of Vitest/ESLint/tsc).

> **Illustrative stack** chosen at Gate B (see `.catraca/architecture.md`):
> Python 3.11, no web framework, in-memory store; `mypy --strict`, `ruff`,
> `pytest` + `pytest-cov` (fail-under 100), git hooks via `core.hooksPath`.

## Mid-flight on purpose

| Feature | State |
|---|---|
| **000 — Quality pipeline** | ✅ implemented + evaluated (real hooks, 100% gate, no `--no-verify`) |
| **001 — Create a poll** | ✅ implemented + evaluated (red→green→refactor, 20 tests) |
| 002 — List open polls | 📝 spec only (EARS) |
| 003 — Cast a vote | 📝 spec only (EARS) |

## Run it

```bash
cd examples/minimal-python
python3 -m venv .venv && .venv/bin/pip install -e ".[dev]"
.venv/bin/ruff check .
.venv/bin/mypy --strict src tests
.venv/bin/pytest          # 20 passed, 100% coverage (fail-under 100)
```

Activate the gates: `git config core.hooksPath .githooks`.

## The Python bootstrap caveat (feature 000)

`pytest` returns exit 5 for "no tests collected" — but with `--cov-fail-under`
in `addopts`, an empty run becomes **exit 1** (a coverage failure), not 5. So the
`pre-commit` hook probes with **`pytest --no-cov`** (which does yield exit 5,
treated as success) before the coverage-enforcing pass. That keeps the bootstrap
commits passing the real hook with zero tests — **no `--no-verify`**. See
`.catraca/evaluation/000-quality-pipeline.md`.

## Layers

`src/polls/{domain → data → presentation → validation → infra → main}`, with
`Protocol` classes for the boundaries and constructor injection — the Clean
Architecture dependency rule, in Python.
