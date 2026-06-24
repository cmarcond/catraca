---
name: quality-pipeline
title: Quality Pipeline
description: Installs automatic gates that reject commit/push; the requirements are fixed and the tools are chosen per stack in feature 000. Use when setting up or extending the quality pipeline.
category: workflows
dependencies:
  - testing/tdd-minimal-step
---

# Quality Pipeline and Continuous Gates

A convention that depends on remembering is fragile; the gain comes from
turning the convention into a gate that rejects automatically. This skill
describes the **invariant principle** (language-independent); the
**materialization** — which tools implement each gate — is decided in feature
000, for the stack chosen in `architecture.md`.

## When To Use

- Starting a project **and no gate yet exists** that rejects a commit/push
  (lint, type-check, coverage). If one already exists, adjust the gate, do not
  reintroduce the pipeline.
- Closing a feature or refactor: confirm that coverage did not regress against
  the baseline before the push.
- Updating dependencies when there is a **major update** or toolchain change
  that may break behavior.

## When Not To Use

- An isolated behavior change that does not touch the toolchain, scripts,
  configs, or versions — in this case **only** the coverage step at closure
  applies, not the setup nor the update flow.
- Throwaway spikes outside the delivery flow. Heuristic: apply the gates when
  the code will be maintained for more than one session or shared; skip them
  when the artifact will be thrown away after the investigation.

## Invariant Principle

1. **Automatic gates, not discipline.** Every verifiable convention (format,
   types, style, coverage) must have a hook that **rejects** the commit/push,
   not merely warns.
2. **Pre-commit only over what changed.** The hook validates the staged set,
   not the entire repository — otherwise it gets slow and the team resorts to
   `--no-verify`.
3. **Coverage as a gate with an explicit baseline.** Record the percentage per
   scope (e.g., unit, integration) of the last green commit as the baseline.
   The push is rejected if any scope falls below the baseline (or the profile's
   target in `method.md`). Update the baseline only when it goes up on its own
   initiative.
4. **Updates in verified batches.** Update dependencies in small,
   atomically-reversible batches (one batch = one related functional area),
   running the suite before and after each batch, so that a break is
   bisectable.
5. **Breakpoint investigation** when you need to inspect runtime state, with
   correct source mapping — instead of instrumenting with prints.

## Requirements (What the Pipeline Must Cover)

Translate each requirement into a tool **of the chosen stack** (feature 000
proposes the tools and the user confirms):

| Requirement | Gate |
|---|---|
| Type checking (if the language has it) | rejects at commit |
| Style/lint with zero warnings | rejects at commit |
| Commit message format | `commit-msg` hook rejects |
| Lint + related tests for the staged set | `pre-commit` hook |
| Tests per scope (unit, integration, ci) | separate scripts |
| Coverage vs baseline/target | rejects at push/closure |

## Order Of Operations

### Setup

Initial setup (one chore per tool, separate commits — see feature 000):

1. Type checker in the strictest mode available; it is the first gate.
2. Linter with zero warnings at commit.
3. `commit-msg` hook validating the project's message convention.
4. `pre-commit` hook running lint and tests **only over the staged files**.
5. Test runner with separate scripts per scope (unit, integration, ci) and
   coverage measured.

**Bootstrapping (avoid the chicken-and-egg).** The setup commits land *before*
any test exists, yet the `pre-commit` hook runs the test suite — and most
runners exit non-zero when they find zero tests. Do **not** reach for
`--no-verify` (it bypasses type-check and lint too). Instead, configure the test
script to **pass when there are no tests yet** (e.g. Vitest `--passWithNoTests`,
pytest's "no tests" tolerated via config, Go's `./...` which is already empty-safe).
Then the setup commits pass the real hook — type-check and lint still gate them —
and tests begin gating the moment the first test appears. No commit ever bypasses
the pipeline.

### Closure

Feature/refactor closure:

1. Suite green locally before any push.
2. Compare coverage per scope against the baseline/target; a drop rejects.
3. Cover real behavior; a trivial test just to bump the number does not count
   as protection.

### Update

Dependency updates:

1. Own branch; suite green beforehand, to fix the baseline.
2. Update in batches by area; run the suite after each batch; fix or revert the
   batch before the next one.
3. Major version: read the changelog and migrate in a progressive refactor.
4. Freeze a version only with a recorded justification where the team sees it
   (e.g., a comment in the dependency manifest or an ADR).

## Test Checklist

- [ ] There is a gate that rejects the commit/push for every verifiable
      convention of the project.
- [ ] `--no-verify` is not needed in the normal flow — if the temptation
      appears, the hook is slow or validating too many files.
- [ ] Pre-commit runs against the stage area, not against the whole repository.
- [ ] Coverage compared against the baseline/target, per scope; a drop rejects.
- [ ] Each update batch validated by the suite on its own and reversible by
      itself.
- [ ] (If applicable) breakpoint stops at the correct line, with no prints left
      in the code.

## Anti-Patterns

- A verifiable convention left as a verbal agreement or warning instead of a
  gate.
- A slow pre-commit hook that processes the entire codebase, pushing the team
  toward `--no-verify`.
- Chasing the coverage number with trivial tests; coverage is a gate against
  regression, not a numeric goal.
- Updating many dependencies in a single batch: it mixes causes of breakage and
  prevents bisection.
- Updating dependencies without a reliable suite as a safety net.
- Outdated source mapping leaving the breakpoint on the wrong line.
