# Evaluation — 000 Quality Pipeline

> Filled in by `/catraca.evaluate`. Each line requires verifiable evidence.

Spec: — (feature 000 has no spec) · Date: 2026-06-24 · Evaluation mode: pedagogical

## Per declared skill

| Skill | Score (0–1) | Evidence | Violation | Justified? |
|---|---|---|---|---|
| `workflows/quality-pipeline` | 1.00 | all gates installed and proven to reject; coverage gate 100%; `pytest --no-cov` probe so setup commits clear the hook | — | — |
| `workflows/git-conventions` | 1.00 | `commit-msg` hook enforces conventional commits; `git log` is conventional | — | — |
| `domain-conventions/project-structure` | 1.00 | tree by layer (`src/polls/{domain,data,presentation,validation,infra,main}`) | — | — |

## Transversal dimensions

| Dimension | Score (0–1) | Evidence (counts) |
|---|---|---|
| `test_first` | n/a | feature 000 is chores; the "red" equivalent is the gate proofs below |
| `layer_discipline` | 1.00 | skeleton matches `architecture.md` |
| `coverage` | 1.00 | coverage gate at 100%, enforced from the first product commit |
| `commit_discipline` | 1.00 | conventional, one chore per tool; every setup commit passed the real hook with no `--no-verify` |

## Execution evidence

```
# Bootstrap proof — setup commit passes the REAL hook with zero tests:
  ruff → ok ; mypy → ok ; pytest --no-cov → "no tests collected" (exit 5, allowed)
  (committed WITHOUT --no-verify)

# Gate proofs (each reverted):
  - commit-msg rejects a non-conventional message   (exit 1)
  - pre-commit rejects a ruff violation (F401/I001)  (exit 1)
  - a failing test makes the suite red               (exit 1)
```

Files touched: `pyproject.toml`, `.githooks/commit-msg`, `.githooks/pre-commit`,
`.gitignore`

## Evaluator

- **Identity**: `self (not independent)` — hand-built demonstration example.
- **Directed mutations**: n/a (no product behavior yet).
- **Disagreement vs implementer self-score**: none.
- **Findings**: the framework's Python bootstrap note (exit 5) was wrong with
  `--cov-fail-under` in `addopts`; fixed here (the `pytest --no-cov` probe) and
  fed back to the `quality-pipeline` skill.

## Verdict

**adherent** — the pipeline is installed, every gate is proven to reject, and the
setup itself respected the gates (no bypass).

## Ratchet

- [x] `ratchet.json` updated (baseline)
- [x] Regressions? none (first evaluation)

## Pedagogical notes

- The exit-5 vs exit-1 subtlety is the kind of stack-specific detail feature 000
  exists to surface and pin down before any product code.
