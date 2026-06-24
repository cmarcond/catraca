---
name: git-conventions
title: Git Conventions
description: Validates conventional commits with a hook and keeps each commit leaving the tree green, with no orphan test. Use when committing a task's work.
category: workflows
dependencies: []
---

# Commit Conventions and Git Flow

Standardize every commit as a small, self-contained fact. The message follows
conventional commits with `type: description`; the content is scoped so that
**the state after each commit** passes the project's verification (build and/or
tests), without leaving a test orphaned from the production it exercises.

This convention assumes there is a per-commit verification step (compilation in
typed stacks, or the test suite/build in dynamic languages). The criterion is
"green state after the commit", not "it compiles".

## When To Use

- About to record progress in frequent, small commits, each with a conventional
  message.
- Just implemented a new behavior whose production+test pair changed together
  and you want to commit it so that each commit leaves the tree in a green
  state.
- Starting a repository and want to make the message format unbreakable via a
  hook.

## When Not To Use

- The decision is about the **content granularity** of the commit (what goes
  into each step) — this convention only governs the message and the order of
  commits, not how the work is sliced.
- The work is a pure refactor with no new test: then it becomes a single commit
  (`refactor:`), not the production/test pair.

## Order Of Operations

1. Install a message linter in the **`commit-msg`** hook, so that messages
   outside the format are rejected at the source (the installation happens in
   feature 000 — see `quality-pipeline`).
2. Use `type: description` in lowercase and imperative, with no mandatory
   scope/body/footer. The `type` vocabulary is the one in the linter config;
   stay consistent with it. Typical set: `feat`, `fix`, `test`, `refactor`,
   `chore`, `docs`.
3. One commit per step; each commit must leave the tree in a green state on its
   own.
4. For a new behavior, commit the production+test pair so that no commit leaves
   a test without the production it exercises (orphan test). The invariant is
   "no orphan test per commit"; the order of the pair's commits is a means to
   guarantee it, not an evaluation criterion.

## Test Checklist

- [ ] The message is `type: description` in lowercase and imperative.
- [ ] The `type` belongs to the linter config's vocabulary.
- [ ] The `commit-msg` hook is active and rejects invalid formats.
- [ ] Each commit leaves the tree in a green state (build/tests), with no test
      orphaned from its production.
- [ ] Each commit covers a single step/task, not several behaviors mixed
      together.
- [ ] Refactors go in as a single commit with the appropriate `type`, not as a
      production/test pair.

## Anti-Patterns

- Leaving a commit where a test references production absent from the tree
  (orphan test), breaking the green state at that point.
- Messages with scope, body, footer, or non-imperative text when the project's
  standard is only `type: description`.
- Using a `type` outside the vocabulary agreed in the linter.
- Relying on manual discipline instead of a hook — the format must be
  unbreakable, not agreed upon.
- Grouping several behaviors into a single commit, losing the green state per
  step.
