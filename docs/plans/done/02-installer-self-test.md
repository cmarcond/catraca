# Plan 02 — Installer self-test

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — an
installable, spec-driven framework for TDD + Clean Architecture. The installer is
`install.py` (stdlib only): it copies `templates/` → `<target>/.catraca/`,
`commands/` → `.catraca/commands/`, and `skills/` → `.catraca/skills/`, and
(unless `--no-claude`) the commands into `.claude/commands/catraca/`. It is
idempotent: identical files are skipped; divergent ones are preserved (new copy
as `*.new`); with `--force` the existing file is backed up `*.bak` and
overwritten. Read `install.py` and `README.md` first.

## Goal

Give `install.py` an automated test suite — the framework preaches test-first, so
its own tool should have a safety net.

## Why it matters / what it solves

`install.py` is the one piece of executable code in the repo and currently has
zero tests. A regression (e.g. a broken idempotency or `--force` path) would ship
silently. Tests also document the installer's contract.

## Scope / what's involved

1. Add `tests/test_install.py` (stdlib `unittest` or `pytest` — pick the lighter
   option; if pytest, add minimal dev tooling instructions, don't bloat the
   repo). Use `tempfile.TemporaryDirectory` targets.
2. Cover the contract:
   - fresh install creates the expected tree (spot-check key files + counts);
   - re-running on an identical tree skips everything (no `.new`, no `.bak`);
   - a divergent existing file → new version written as `*.new`, original intact;
   - `--force` on a divergent file → original moved to `*.bak`, new content in place;
   - `--no-claude` omits `.claude/commands/catraca/`;
   - `--skills-source` missing → warning + empty skills (non-fatal).
3. Add a one-line "run the installer tests" note to `README.md` or `docs/usage.md`.

## Out of scope

- Refactoring `install.py` behavior (only add tests; fix a bug only if a test
  reveals one, and call it out).

## Research

Check current Python testing conventions for CLI/file-tree tools (queries:
"pytest tmp_path file tree assertions", "python unittest TemporaryDirectory CLI
test", "testing idempotent installer python"). Keep dependencies minimal.

## Acceptance / verification

- `python3 -m pytest tests/` (or `python3 -m unittest`) passes locally.
- Tests fail if you deliberately break an `install.py` branch (verify once, then
  revert the break).

## Commit

Branch `improve/02-installer-self-test`. Commit the tests (and any doc note)
together. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
