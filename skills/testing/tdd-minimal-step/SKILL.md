---
name: tdd-minimal-step
title: "TDD Minimal Step"
description: "Drives each behavior through a red-green-refactor cycle with a minimal implementation under a green suite. Use when implementing a new observable behavior."
category: testing
dependencies: []
---

# TDD Cycle Per Behavior

Each behavior is born from a test that fails for the right reason, passes with the
minimal implementation, and is followed by refactor under green. The cycle repeats per
behavior, not per file.

The non-obvious decisions: ensure the red fails on the behavior's assertion
(and not on setup), never leave a hardcoded value without the test that generalizes it, and
close the step per behavior instead of "finishing the file".

## When To Use

- You are going to implement a new observable behavior with a verifiable
  acceptance criterion.
- The next implementation step fits in a single isolated test.

It applies to any unit that exposes observable behavior; use case,
controller, and adapter are just examples of the same shape.

## When Not To Use

- A purely file-organization change (move, rename, regroup).
- Refactor without behavior change (use the existing suite as a safety net,
  with no new test).
- The target behavior has no observable criterion; define the criterion before
  starting.

## Preconditions

- Fast feedback: the relevant subset of tests must come back in a few
  seconds. If the full suite is slow, run only the subset of the
  current behavior.
- Determinism: the step's test cannot depend on real I/O, clock, network,
  or order. Replace those dependencies with test doubles before entering the cycle;
  isolate what is slow or non-deterministic into separate suites that run outside
  the micro-step.
- If you cannot get fast and deterministic feedback in the step, solve that
  first: the cycle is meaningless without it.

## Order Of Operations

1. Choose a single behavior, not a whole file.
2. Write the test for that behavior before the production code.
3. Run the suite and confirm the expected failure (red), on the behavior's
   assertion and not on setup or import.
4. Implement the minimum that makes it pass; a hardcoded value is only legitimate when there already
   exists (or will come in the next step) a test that forces generalization.
5. Run the suite to green (green).
6. Refactor production and test keeping green; do not introduce new behavior
   here.
7. Only then move on to the next behavior and repeat.

## Guard Branches: The Compiler Points To The Next Red

A guard branch is the code that blocks a bad case before the real work
(e.g., `if (payload === null) return null`). It usually is born crooked: the
compiler requires handling the case ("it can be null"), the guard is written to
silence the type error, and the test comes afterward — without ever having failed.

The rule: **when the compiler requires handling a case, stop — that is the next
behavior.** Write the test for the case first ("invalid token returns
null"), watch it fail, and only then write the guard. The type error is not an
obstacle to silence; it is the compiler delivering the red for free.

The same holds for any defensive branch of mechanical origin: lint requiring a
default in a switch, an optional field forcing a fallback. A branch without its own red is
behavior without proof — and it is exactly where sabotage (inverting or removing
the guard) goes unnoticed by the suite.

## Granularity And Exiting Fake-It

- "One behavior" is the smallest observable rule. If the natural step requires more
  than one assertion to describe the same rule, keep them in the same test; if
  the assertions describe distinct rules, break them into separate tests/steps.
- Fake-it (hardcoded value) is a bridge, not a destination: stop returning a hardcoded value
  as soon as a second case contradicts it. If a single case already suffices for the real
  behavior, do not use fake-it.

## Test Checklist

- [ ] The test failed before the implementation existed, on the behavior's
      assertion.
- [ ] One behavior per test; the name describes the behavior, not the
      method.
- [ ] The minimal implementation is covered by an assertion that forces it to
      generalize.
- [ ] After refactor, the suite stays green without changing the assertions.
- [ ] No deliberate hardcoded value was left without the test that generalizes it.
- [ ] Every guard branch (a case required by compiler/lint) has its own red
      that was seen failing before the guard existed.

## Anti-Patterns

- Writing all the production code and only afterward the tests (disguised test-after).
- Writing a guard to silence the compiler/lint and testing it afterward — the branch
  was born without a red; the test only confirms what already exists.
- Skipping the red or accepting a red from a setup/import error as if it were the
  expected one.
- Stacking distinct behaviors in a single test, losing the granularity of the
  step.
- Mixing refactor with new behavior in the same green step.
- Closing the cycle with a hardcoded value and not adding the test that forces it to
  generalize.
- Driving the cycle per file ("finishing the spec") instead of per behavior.
