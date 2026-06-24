# Questions — User Feedback Gates

> A living record of the project's decisions. In guided mode, the agent asks and
> records the answers. In auto mode, it records the default with the
> `[assumed YYYY-MM-DD]` mark. To review a decision later: edit the "Answer"
> column, note the review, and run `/catraca.status` for the agent to reconcile
> the affected artifacts. (Which gate writes which file: see the mapping table
> in `commands/init.md`.)

## Gate A — Product (in init)

| # | Question | Answer | Review |
|---|---|---|---|
| G1 | What is the project's real objective? Who uses it? What can the user do once it's ready? | | |

## Gate B — Platform and technique (before the architecture spec)

| # | Question | Answer | Review |
|---|---|---|---|
| G2 | Platform and language: server-side (language, runtime, framework)? client-side (if any)? database? | | |
| G2b | Development environment: local with ephemeral infrastructure in tests (default), or containerized from the start (devcontainer + compose)? | | |
| G3 | Strict Clean Architecture (5 layers) or light (3 layers)? | | |
| G4 | Which external dependencies should be isolated behind adapters? | | |

> G2b: if the chosen stack requires a local service with no reliable ephemeral
> variant (e.g. a database with no in-memory option), the agent should recommend
> containerized, with a justification. If the roadmap gains a deploy feature,
> containerization is born there, as its own feature — it does not retroactively
> apply to the pipeline.

> The quality and test tools (linter, type-check, hooks, runner, coverage) are
> not asked about here: feature 000 proposes the ones suited to the chosen
> platform and asks for confirmation.

## Gate C — Method (before the final method.md)

| # | Question | Answer | Review |
|---|---|---|---|
| G5 | TDD rigor: strict or pragmatic? | | |
| G6 | Which method skills (from `.catraca/skills/`) are mandatory? | | |
| G7 | Which skills are optional/not applicable (and why)? | | |
| G8 | Small commits with conventional commits: required or recommended? | | |

## Gate D — Evaluation (before the first implement)

| # | Question | Answer | Review |
|---|---|---|---|
| G9 | Evaluation strict, pedagogical, or pragmatic? | | |
| G10 | On a score regression, does the ratchet warn (`warn`), block (`block`), or trigger automatic repair (`repair`)? | | |

## Gate E — Per feature (during plan; recurring)

| Feature | G11: roadmap confirmed? | G12: acceptance criteria confirmed? |
|---|---|---|
| | | |

## Canonical profile defaults (used in auto mode)

Strict TDD · strict Clean Architecture (5 layers) · every library via an adapter
· local environment with ephemeral infrastructure in tests · 100% blocking
coverage · conventional commits required (one per task) · pedagogical evaluation
· ratchet on `repair` · 13 mandatory skills unless an obvious inapplicability is
recorded.
