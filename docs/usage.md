# Catraca — Usage Guide

## 1. Install

```bash
python3 catraca/install.py /path/to/project
```

Creates `.catraca/` (templates, commands, 13 skills) and, by default, the slash
command shortcuts in `.claude/commands/catraca/`. Re-running is safe: an
identical file is skipped; a divergent one is preserved (the new version lands
as `*.new`; with `--force`, a `*.bak` backup is made and the file is
overwritten).

The installer stamps `.catraca/VERSION`; on re-run it reports `current ->
available` so an upgrade is visible. Use `--dry-run` to see exactly what would
change (created/skipped/conflicted) without writing anything.

**Upgrading in place:** re-run with `--update`. It refreshes the
framework-managed files (commands, skills, manifesto, glossary, CLAUDE, the
`*-TEMPLATE`/`README` scaffolds) — keeping the old copy as `.bak` — and never
touches or deletes your filled artifacts (`product.md`, `architecture.md`,
`method.md`, `questions.md`, `roadmap.md`, `ratchet.json`, and your
`specs/`/`tasks/`/`evaluation/` content). Combine with `--dry-run` to preview.

## 2. Start a project

Open the agent (Claude Code) in the project folder and paste the initial
prompt — **just the product idea**. The stack is decided at Gate B; TDD / Clean
Architecture / SOLID are constitutional (`manifesto.md`) and don't need to be
requested. Example:

> I want to build a REST API for polls. Follow `.catraca/CLAUDE.md` and run
> `/catraca.init` in guided mode.

For auto mode, add:

> Use auto mode: assume the method's defaults and record the assumptions.

## 3. The flow

```
initial prompt
   └─ /catraca.init      questions (gates A–D) or defaults → product.md,
                           architecture.md, method.md, questions.md
   └─ /catraca.plan      roadmap.md (starts with feature 000 — the quality
                           pipeline) + specs/NNN-*.md (gate E per feature)
   └─ /catraca.implement feature 000 first: mechanical gates (type-check,
                           lint, commit-msg, pre-commit staged-only, coverage),
                           each proven by a deliberate rejection; then, per
                           product feature: red/green/refactor tasks + code +
                           commits
   └─ /catraca.evaluate  rubric with evidence + ratchet.json
   └─ (repeat implement/evaluate per feature until the roadmap is done)

/catraca.status          at any time: where we are, the next action, and
                           reconciliation of reviewed decisions
```

## 4. The questions the agent will ask (guided mode)

- **Gate A**: the real objective, the users, what the user can do once it's
  ready.
- **Gate B**: platform and language (server-side; client-side if any;
  database); development environment (local with ephemeral infrastructure —
  the default — or containerized from the start); strict Clean Architecture
  (5 layers) or light (3); which dependencies to isolate behind adapters. The
  quality tools are not asked about here — feature 000 proposes them according
  to the chosen platform.
- **Gate C**: TDD rigor (strict/pragmatic); mandatory and optional skills;
  small commits required or recommended.
- **Gate D**: evaluation mode — strict, pedagogical, or pragmatic; ratchet on
  regression — warn (`warn`), block (`block`), or trigger automatic repair
  (`repair` — R tasks in the feature's list + one re-evaluation; if it doesn't
  recover, it hands back to the user).
- **Gate E** (per feature): confirmation of the roadmap and the acceptance
  criteria.

Always one gate at a time; answers go to `.catraca/questions.md`.

> **Gate naming.** The phases are named **Gate A–E**; their individual
> sub-questions are numbered **G1–G12**. `questions.md` carries the mapping of
> which sub-question writes which artifact.

## 5. Auto mode

No questions. The agent adopts the canonical profile — strict TDD, 5 layers,
every library behind an adapter, 100% blocking coverage, conventional commits
one per task, pedagogical evaluation, ratchet on warn — and records each
assumption as `[assumed YYYY-MM-DD]` in `questions.md`. It pauses only on HALT:
an unresolvable ambiguity, 3+ consecutive failures of the same test, a ratchet
regression in block mode, or an unforeseen dependency.

**Later review:** edit the "Review" column in `questions.md` and run
`/catraca.status` — the agent propagates the change to the affected artifacts.

## 6. How the method enters the workflow

The 13 skills (in `.catraca/skills/`) are the canonical solution. They are
separate files, copied in by the installer, and referenced by id — never
inlined into the templates.

In Claude Code they are **also** installed (flattened) into `.claude/skills/`, so
the agent **auto-discovers** the relevant skill by its `description` and loads it
on demand. The id-reference path below is the fallback for other agents (and a
backstop if a skill isn't auto-loaded):

- in the **spec**, each feature declares the applicable skills (reference only);
- in the **implementation**, the agent derives the technical criteria from the
  skills' *Test Checklists* and follows their *Order of Operations*;
- in the **evaluation**, each declared skill becomes a rubric line, scored by
  its own Test Checklist and discounted by its *Anti-Patterns*.

## 7. How to know whether the implementation followed the method

1. **Per-feature rubric** (`.catraca/evaluation/NNN-*.md`): a 0–1 score per
   skill and per the dimensions `test_first`, `layer_discipline`, `coverage`,
   `commit_discipline` — each line with evidence (command + output, test,
   commit). Verdict: adherent / partial / non-adherent.
2. **Ratchet** (`.catraca/ratchet.json`): keeps the best score per
   feature/dimension; re-runs below `best − 0.05` produce a warning (`warn`) or
   stop the work (`block`).

## 8. Known limitations (MVP)

- The commands are Markdown playbooks and rely on the agent's discipline —
  **except for the quality gates**: feature 000 installs hooks that
  mechanically reject commit/push (type-check, lint, commit message, staged
  tests, coverage), independent of the agent.
- The evaluation is **independent by default**: a clean-context evaluator (the
  Task tool, or a separate model) scores the feature from the spec + code +
  verification commands, never the build conversation — avoiding self-preference
  bias. If no independent evaluator is available, the rubric is filled in a fresh
  invocation, or marked `self (not independent)` as a recorded limitation.
- Native integration only with Claude Code; other agents use the same Markdown
  manually.
