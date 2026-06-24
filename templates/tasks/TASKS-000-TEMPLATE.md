# Tasks — 000 Quality Pipeline

> A mandatory feature that precedes any product feature (skill
> `workflows/quality-pipeline`: "automatic gates, not discipline"). It does not
> come from `product.md` — it comes from the method. It does not follow a
> red/green/refactor cycle: each tool enters as a separate **chore**, and the
> equivalent of "red" is to **provoke a violation and watch the gate reject it**.
> Adapt the tools to the stack in `architecture.md`; the gates below are the
> invariant.

Active skills: `workflows/quality-pipeline`, `workflows/git-conventions`,
`domain-conventions/project-structure`

## Tasks

### T0.0 — Map requirements → propose tools for this platform

The **requirements** are fixed (the "Requirements" table of the
`quality-pipeline` skill): type-checking (if the language has it), zero-warnings
lint, commit-message validation, pre-commit over the staged files, scoped tests,
coverage as a gate. The **tools** that implement them depend on the platform in
`architecture.md`.

- [ ] requirement → proposed-tool table filled in below
- [ ] **guided mode**: proposal presented to the user and confirmed;
      **auto mode**: recorded as `[assumed]` in `questions.md`

| Requirement | Proposed tool (for this stack) |
|---|---|
| Type-checking | |
| Zero-warnings lint | |
| Commit-message hook | |
| Pre-commit staged-only (lint+tests) | |
| Scoped test runner | |
| Coverage as a gate | |

### T0.0b — Containerized environment *(only if G2b = containerized)*

- [ ] devcontainer/Dockerfile + compose with the stack's services
- [ ] the suite and hooks run **inside** the container (the host's pre-commit
      delegates to the container)
- [ ] **gate proof**: the container comes up from scratch and the suite runs in
      it; the hooks reject from inside the container
- [ ] commit `chore: ...`

(If G2b = local, skip this task: test infrastructure is ephemeral — an in-memory
database or a throwaway container only during the suite — and nothing is
installed as a service on the machine.)

### T0.1 — Project skeleton + type-checking as the first gate

- [ ] directory structure by layer (per `architecture.md`)
- [ ] compiler/type-checker in strict mode; the verification command runs and
      rejects on a provoked type error (gate proof)
- [ ] commit `chore: ...`

### T0.2 — Lint with zero warnings

- [ ] linter configured (the stack's standard); zero warnings is the criterion
- [ ] **gate proof**: a provoked style violation is rejected
- [ ] commit `chore: ...`

### T0.3 — Commit-message hook

- [ ] a `commit-msg` hook validates conventional commits (`type: description`)
- [ ] **gate proof**: a commit with an invalid message is rejected
- [ ] commit `chore: ...`

### T0.4 — Pre-commit running lint + tests over the staged files

- [ ] a `pre-commit` hook runs lint and tests related **only to the staged
      files** (fast enough that nobody wants `--no-verify`)
- [ ] **gate proof**: a staged file with broken lint ⇒ commit rejected
- [ ] commit `chore: ...`

### T0.5 — Test runner with scopes + coverage gate

- [ ] runner configured with scripts per scope (unit, integration, ci)
- [ ] the test script **passes with no tests yet** (e.g. Vitest
      `--passWithNoTests`), so these setup commits clear the `pre-commit` hook
      without `--no-verify` — type-check and lint still gate them
- [ ] coverage measured with the profile's target (`method.md`); a drop rejects
- [ ] **gate proof**: a provoked failing test ⇒ suite rejected
- [ ] commit `chore: ...`

### T0.6 — End-to-end verification of the pipeline

- [ ] the full sequence proven: invalid message rejected; broken lint rejected
      at pre-commit; a red test rejects the suite; everything fixed ⇒ commit
      passes
- [ ] the proofs recorded (command outputs) for the rubric
- [ ] commit `chore: ...` (if an adjustment is left over)

### T-final — Feature evaluation

- [ ] rubric filled in `../evaluation/000-quality-pipeline.md`
      (the `quality-pipeline` Test Checklist: a gate rejects by convention;
      `--no-verify` unnecessary; pre-commit only on the staged files; coverage
      baseline recorded)
- [ ] `ratchet.json` updated
