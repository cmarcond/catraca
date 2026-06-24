# Worked Example — Polls API (completed roadmap + repair cycle)

A **real, runnable** project that takes the Polls API to a **finished roadmap**
and demonstrates the parts the mid-flight `examples/minimal/` doesn't: features
002 and 003 implemented, and a genuine **ratchet repair cycle**.

> **Illustrative stack** (Gate B): TypeScript + Vitest. Same method as
> `examples/minimal/`; this one is complete instead of mid-flight.

## Completed roadmap

| Feature | State |
|---|---|
| **000 — Quality pipeline** | ✅ implemented + evaluated |
| **001 — Create a poll** | ✅ implemented + evaluated |
| **002 — List open polls** | ✅ implemented + evaluated |
| **003 — Cast a vote** | ✅ implemented + evaluated — **regressed → repaired** |

49 tests, 100% coverage; all commits hook-verified, no `--no-verify`.

## The ratchet repair cycle (feature 003)

This is the example's reason to exist — it shows why the rubric and ratchet
matter **beyond** the mechanical gates:

1. Feature 003 was committed with a **data → infra dependency-rule violation**
   (`DbCastVote` imported the concrete `PollMemoryRepository` from `infra`). It
   **type-checked, linted clean, and passed all tests at 100%** — so it cleared
   the pre-commit hook. The mechanical gates did not catch it.
2. `/catraca.evaluate`'s **import inspection** caught it → `layer_discipline`
   regressed below the floor. Ratchet mode `repair`.
3. Repair task **R1** introduced a data-layer protocol and injected it; the
   concrete infra class is now referenced only in `main/factories`. Re-inspection:
   0 violations. `layer_discipline` recovered to 1.00.

Trace it in: `.catraca/evaluation/003-cast-a-vote.md`,
`.catraca/tasks/003-cast-a-vote.md`, `.catraca/ratchet.json`, and the git history
(`feat(vote): …` with the violation → `refactor(vote): … (R1)`).

## Run it

```bash
cd examples/complete
npm install
npm run typecheck && npm run lint && npm run test:coverage   # 49 tests, 100%
```

Activate the gates: `git config core.hooksPath .githooks`.

## Layers

`src/{domain → data → presentation → validation → infra → main}` — Clean
Architecture with `Protocol`-style interfaces and constructor injection.
