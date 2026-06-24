# Plan 05 — `install.py` niceties

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca`. `install.py`
(stdlib only) copies `templates/`/`commands/`/`skills/` into `<target>/.catraca/`
(and `.claude/commands/catraca/` unless `--no-claude`); it is idempotent
(skip identical, `*.new` on divergence, `--force` → `*.bak` + overwrite) and
prints a created/skipped/conflicted report. Read `install.py` and `README.md`.

> **Dependency:** the installer self-test (done/02-installer-self-test.md) exists — extend it to cover the new flags.

## Goal

Add quality-of-life flags that make installing and **upgrading** an existing
`.catraca/` safer and clearer: `--dry-run`, a version stamp, and a smarter
update path.

## Why it matters / what it solves

Today upgrading a project's `.catraca/` to a newer framework version produces a
scatter of `*.new` files the user must reconcile by hand, with no record of which
framework version is installed. Small additions make upgrades predictable.

## Scope / what's involved

1. `--dry-run`: report exactly what would be created/skipped/conflicted/backed-up
   without writing anything.
2. Version stamp: write a `.catraca/VERSION` (or a field in a small
   `.catraca/.catraca.json`) recording the framework version/commit at install
   time; on re-run, surface "installed X → available Y".
3. Smarter update: at minimum, group and summarize `*.new` conflicts clearly
   (and optionally a `--update` that, combined with the version stamp, only
   touches files that changed between versions). Keep it stdlib-only and
   idempotent.
4. Update `README.md`/`docs/usage.md` to document the new flags.

## Out of scope

- A full migration engine; three-way merges. Keep it simple and predictable.

## Research

Look at how comparable scaffolders handle updates/versioning before designing
(queries: "scaffolding tool update existing files strategy", "cookiecutter /
copier project update versioning", "idempotent installer dry-run pattern").
Borrow the simplest approach that fits a stdlib-only tool.

## Acceptance / verification

- `--dry-run` writes nothing and its report matches a real run's outcome.
- A fresh install writes the version stamp; a re-run reports current vs available.
- Idempotency and existing flags still hold; installer tests pass.

## Commit

Branch `improve/09-installer-niceties`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
