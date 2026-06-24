# Catraca

An installable, spec-driven framework that applies a rigorous engineering
method (TDD + Clean Architecture + SOLID + Design Patterns) to new projects,
guiding a coding agent from the initial prompt to an adherence evaluation.

> "Catraca" is Portuguese for *turnstile*. The name evokes the framework's core
> metaphor: a **ratchet** — a one-way mechanism that only lets quality move
> forward, never backward.

It is not an engine: it is a layer of Markdown/YAML files installed into
`.catraca/` in the target project. The host agent (Claude Code first) executes;
the framework guides — specs, questions, skills, TDD tasks, and evaluation.

## Installation

```bash
python3 catraca/install.py /path/to/target-project
```

The installer:

- creates `.catraca/` with templates, commands, and the library of 13 skills;
- is **idempotent**: an existing identical file is skipped; an existing but
  different file is preserved (the new version lands as `*.new`); with
  `--force`, the existing file is backed up as `*.bak` before being overwritten;
- with `--claude` (default), also installs the commands into
  `.claude/commands/catraca/` for use as slash commands in Claude Code;
- finishes with a report of created/skipped/conflicting files.

Options: `--force`, `--no-claude`, `--skills-source DIR` (default: `skills/` at
the root of this repository).

The installer has its own test suite (stdlib only):

```bash
python3 -m unittest discover -s tests
```

## Usage

After installing, open the agent in the target project and paste the initial
prompt — **just the product idea**, no stack or technique:

> I want to build a REST API for polls. Follow `.catraca/CLAUDE.md` and run
> `/catraca.init` in guided mode.

The stack is decided in its own phase (Gate B). TDD, Clean Architecture, SOLID,
and Design Patterns don't need to be requested: they are **constitutional**
(`.catraca/manifesto.md`) — they hold for any project that uses the framework;
the gates only calibrate the rigor.

The agent enters the flow:

| Phase | Command | Output |
|---|---|---|
| Elicitation (questions or defaults) | `/catraca.init` | `questions.md`, `product.md`, `architecture.md`, `method.md` |
| Planning | `/catraca.plan` | `roadmap.md`, `specs/NNN-*.md` |
| TDD implementation | `/catraca.implement` | code + tests, `tasks/NNN-*.md` |
| Evaluation | `/catraca.evaluate` | `evaluation/NNN-*.md`, `ratchet.json` |
| Status | `/catraca.status` | next action |
| Reverse engineering | `/catraca.reverse` | *seed* (product + Gates A–D) from an existing project |

**Guided mode**: the agent stops at the User Feedback Gates (objective, stack,
TDD rigor, strict or light Clean Architecture, mandatory skills, commits,
evaluation, ratchet) and records the answers in `questions.md`.

**Auto mode**: say "auto mode" in the initial prompt; the agent adopts the
defaults of the method's canonical profile (strict TDD, 5 layers, 100%
coverage, conventional commits) and records each assumption as `[assumed]` in
`questions.md`, reviewable later.

Full documentation: [docs/usage.md](docs/usage.md).

## Structure

```
catraca/
├── MANIFESTO.md        # the method on one page
├── install.py          # idempotent installer (stdlib only)
├── templates/          # becomes the contents of .catraca/ in the target project
├── commands/           # init, plan, implement, evaluate, status, reverse
├── docs/usage.md       # usage guide
└── examples/minimal/   # a real mid-flight demonstration project
```

The framework carries its **own library** of skills (`catraca/skills/`):
13 operational rules, agnostic of language and platform, distilled from the
method and cleaned of any reference to their origin. The installer copies them
into `.catraca/skills/` in the target project, so the installed project is
self-contained. The project's platform is chosen at Gate B; the quality tools
(linter, type-check, hooks, runner, coverage) are proposed in feature 000
according to the chosen platform.

## Design principles

- **Intent/solution barrier**: specs speak of behavior (EARS criteria), never of
  classes or paths; the solution lives in the skills.
- **Automatic gates, not discipline**: every roadmap starts with feature 000
  (the quality pipeline), which installs hooks that reject commit/push — just as
  in the first lessons of a course, the environment with active gates precedes
  the first feature.
- **Test-first as a hard gate**: production code without a failing test before
  it is deleted and redone.
- **State in Markdown**: checkboxes and versioned files; no database, no hidden
  state.
- **Evaluation with evidence**: every rubric line requires a command + its
  output; `ratchet.json` records the best scores and flags regressions.
- **No course code**: the framework carries distilled rules (skills), never any
  code from the original teaching project.
