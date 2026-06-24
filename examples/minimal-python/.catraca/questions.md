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
| G1 | What is the project's real objective? Who uses it? What can the user do once it's ready? | A backend for running polls. Organizers create polls; voters list open polls and cast a vote. See `product.md`. | |

## Gate B — Platform and technique (before the architecture spec)

| # | Question | Answer | Review |
|---|---|---|---|
| G2 | Platform and language: server-side (language, runtime, framework)? client-side (if any)? database? | Server-side: Python 3.11. No web framework — controllers are plain and exercised directly. No client-side. Database: in-memory store (no external DB). | |
| G2b | Development environment: local with ephemeral infrastructure in tests (default), or containerized from the start (devcontainer + compose)? | Local with ephemeral infrastructure: the store is in-memory, recreated per test. No service installed on the machine. | |
| G3 | Strict Clean Architecture (5 layers) or light (3 layers)? | Strict (5 layers): domain, data, presentation, validation, infra + main composition. | |
| G4 | Which external dependencies should be isolated behind adapters? | None third-party in this slice; the in-memory store sits behind a `data` protocol (`AddPollRepository`). Error-log destination is structured stdout behind a logging protocol (default). | |

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
| G5 | TDD rigor: strict or pragmatic? | Strict (red→green→refactor per behavior). | |
| G6 | Which method skills (from `.catraca/skills/`) are mandatory? | All 13, except where Gate G7 records an inapplicability. | |
| G7 | Which skills are optional/not applicable (and why)? | `architecture/error-observability` — applicable but only minimally exercised in this slice (no 500-producing infra yet); kept mandatory, noted. All others mandatory. | |
| G8 | Small commits with conventional commits: required or recommended? | Required, one per task, validated by the commit-msg hook. | |

## Gate D — Evaluation (before the first implement)

| # | Question | Answer | Review |
|---|---|---|---|
| G9 | Evaluation strict, pedagogical, or pragmatic? | Pedagogical. | |
| G10 | On a score regression, does the ratchet warn (`warn`), block (`block`), or trigger automatic repair (`repair`)? | repair | |

## Gate E — Per feature (during plan; recurring)

| Feature | G11: roadmap confirmed? | G12: acceptance criteria confirmed? |
|---|---|---|
| 000 quality pipeline | yes | n/a (no spec) |
| 001 create a poll | yes | yes |
| 002 list open polls | yes | yes (spec only; not yet implemented) |
| 003 cast a vote | yes | yes (spec only; not yet implemented) |

## Canonical profile defaults (used in auto mode)

Strict TDD · strict Clean Architecture (5 layers) · every library via an
adapter · local environment with ephemeral infrastructure in tests · 100%
blocking coverage · conventional commits required (one per task) · pedagogical
evaluation · ratchet on `repair` · 13 mandatory skills unless an obvious
inapplicability is recorded.
