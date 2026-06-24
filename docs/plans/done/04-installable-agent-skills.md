# Plan 04 — Ship skills as installable Agent Skills

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. The method's operational
rules are 13 skills under `skills/<category>/<name>/SKILL.md`, indexed by
`skills/index.yaml`. Each `SKILL.md` already has YAML frontmatter with `name`, a
third-person `description` (what + when), `title`, `category`, and `dependencies`.
Today they are **referenced** (the agent is told to read the relevant SKILL.md
during implementation), not auto-discovered. Read `skills/index.yaml`, one
`SKILL.md`, `commands/implement.md`, and `docs/usage.md`.

## Goal

Make the 13 skills usable as **real Claude Code / Claude Agent Skills** —
auto-discovered by their `description` and loaded on demand — not just Markdown
the playbook tells the agent to open.

## Why it matters / what it solves

The frontmatter already follows Anthropic's SKILL.md format. Making them genuine
Agent Skills means the host agent pulls the right skill by relevance during
implementation (progressive disclosure), instead of relying on the command to
enumerate them. Better ergonomics and fewer "forgot to read the skill" misses.

## Scope / what's involved

1. Research the exact current Agent Skills packaging/placement (directory
   conventions, required frontmatter fields, how discovery works) and confirm our
   frontmatter is compliant; fix any gaps (e.g. field limits, naming).
2. Decide placement so the installed project exposes them as skills the host
   recognizes (e.g. install into the agent's skills directory in addition to
   `.catraca/skills/`, or document the path), without breaking the existing
   `index.yaml`-based references for non-Claude agents.
3. Update `install.py` to place/symlink the skills appropriately (guarded by a
   flag like `--skills-as-agent-skills`, default sensible), keeping idempotency.
4. Update `docs/usage.md` and `commands/implement.md` to mention that skills can
   load automatically by description, with the manual-reference path as fallback.

## Out of scope

- Rewriting skill content (that's done — see done/11-strengthen-skills-content.md). This is packaging/distribution only.

## Research

This REQUIRES up-to-date docs — search before implementing (queries: "Claude Code
Agent Skills SKILL.md directory install location", "Claude Agent Skills discovery
description frontmatter 2026", "agent skills personal vs project skills path").
Use the official Anthropic/Claude docs; cite them in the commit body.

## Acceptance / verification

- A freshly installed target exposes the 13 skills as discoverable Agent Skills
  (verify per the official mechanism), while `index.yaml` references still work.
- `install.py` remains idempotent; its self-test (done/02-installer-self-test.md) still passes.

## Commit

Branch `improve/08-installable-skills`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
