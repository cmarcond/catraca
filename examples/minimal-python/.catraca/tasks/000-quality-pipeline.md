# Tasks — 000 Quality Pipeline

> Mandatory feature, precedes any product feature (skill
> `workflows/quality-pipeline`). Each tool enters as a **chore**; the "red"
> equivalent is a gate proof. The test step probes with `pytest --no-cov` so the
> setup commits clear the real hook with zero tests — **no `--no-verify`**.

Active skills: `workflows/quality-pipeline`, `workflows/git-conventions`,
`domain-conventions/project-structure`

## Tasks

### T0.0 — Map requirements → propose tools for this platform

- [x] requirement → tool table filled in below
- [x] proposal confirmed (Python stack, see `architecture.md`)

| Requirement | Tool (for this stack) |
|---|---|
| Type-checking | `mypy --strict` |
| Zero-warnings lint | `ruff check .` |
| Commit-message hook | `.githooks/commit-msg` (conventional-commit regex) |
| Pre-commit (lint + types + tests) | `.githooks/pre-commit` |
| Scoped test runner | `pytest`; `--no-cov` probe so setup commits pass with no tests |
| Coverage as a gate | `pytest-cov`, `--cov-fail-under=100` |

### T0.0b — Containerized environment *(skipped: G2b = local)*

Not applicable — the store is in-memory, recreated per test.

### T0.1 — Project skeleton + pytest/coverage gate

- [x] `src/polls/` package by layer; `pyproject.toml` with pytest + coverage
      (`--cov=polls --cov-fail-under=100`)
- [x] commit `chore(pipeline): configure pytest and coverage gate (fail-under 100)` (`3c6df53`)

### T0.2 — Lint with zero warnings

- [x] `ruff` configured; zero warnings is the criterion
- [x] **gate proof**: a `ruff` violation (unused import / unsorted) is rejected (T0.6)
- [x] commit `chore(pipeline): configure ruff lint (zero warnings)` (`5d16978`)

### T0.3 — Strict type-checking

- [x] `mypy --strict src tests` clean
- [x] commit `chore(pipeline): configure mypy strict type-checking` (`907b569`)

### T0.4 — Hooks (commit-msg + pre-commit)

- [x] `.githooks/commit-msg` (conventional commits) + `.githooks/pre-commit`
      (ruff + mypy + tests), `core.hooksPath` set before the first commit
- [x] commit `chore(pipeline): add commit-msg and pre-commit git hooks` (`edc142c`)

### T0.5 — Bootstrap probe: setup commits pass the real hook with no tests

- [x] the pre-commit probes `pytest --no-cov` (exit 5 = no tests collected →
      allowed) before the coverage-enforcing pass; the first five setup commits
      (e.g. `6991dd0`) committed cleanly with zero tests, **no `--no-verify`**

### T0.6 — End-to-end verification of the pipeline

- [x] gate proofs captured (see `evaluation/000-quality-pipeline.md`): bad commit
      message rejected; ruff violation rejected; a failing test makes the suite
      red. Breakages reverted.

### T-final — Feature evaluation

- [x] rubric filled in `../evaluation/000-quality-pipeline.md`
- [x] `ratchet.json` updated
