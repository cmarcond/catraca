# /catraca.reverse — Reverse engineering: existing project → seed (product + Gates A–D)

An auxiliary entry point to the flow. Instead of starting from a prompt, it
starts from **finished code** and reconstructs the *seed* that, given to
`/catraca.init`, would regenerate this project via TDD + Clean Architecture.
Precondition: `.catraca/` installed + the **path to a target project**. Output:
the seed ready to paste into `/catraca.init` — optionally a pre-filled
`questions.md` (Gates A–D answered) to shorten the init.

> **Scope rule.** Catraca looks at a project on the **product + craft** axis —
> observable features, stack, rigor. It does **not** cover *scale / sharding /
> system design at scale* (that is a different concern). If the project is a
> design exercise with a trivial implementation, the seed comes out lean — and
> that's fine.

## Step 0 — Mode and target

- Receive the **target project path**. Guided mode (default) or auto.
- Re-read `.catraca/manifesto.md` and `method.md`: the same quality gates that
  govern implementation are the lens through which you read the existing code.

## Step 1 — Map the surface (what the project does and how it was built)

Read, in this order: the API surface (routes, controllers, handlers); the domain
models and use cases; the **test suite** (the best source of expected behavior);
the stack manifest (`package.json`/`go.mod`/`requirements.txt`, imports); the
folder structure (layers, adapters); the git history (`git log`) for the commit
policy and red-first signals (a test commit landing before its production
commit).

## Step 2 — Reverse product spec (business voice)

Distill the **product idea** (2–4 sentences: what problem it solves, for whom)
and the **candidate features** as an observable capability ("answer a poll"),
NEVER as an endpoint or class. Run the **leakage checklist** from
`specs/README.md`: if a feature turned into a route/library/signature, rewrite
it in product language.

## Step 3 — Reverse into Gates A–D (read from the actual code)

For each gate, infer the answer from the evidence, citing the file that supports
it; mark weak inferences as `[assumed YYYY-MM-DD]`. Record them in
`./questions.md`:

- **A** objective/users (from the README + the API surface);
- **B** stack server/client/DB (from the manifest and imports), dev local vs
  containerized (is there a `Dockerfile`/compose?), Clean Architecture 5 layers
  or 3 (count the layers in the folder structure — but the imports are the real
  signal), which libraries are **behind an adapter** (look for bcrypt/jwt/orm
  wrappers in `infra`);
- **C** TDD strict or pragmatic (does the suite cover each behavior? is there
  red-first in the `git log`?), applicable skills (`skills/index.yaml`), commits
  (the convention in the log);
- **D** evaluation mode and ratchet.

## Step 4 — Sample WHEN/THEN specs (from the tests)

For 1–2 features, draft the **acceptance criteria** in WHEN/THEN extracted from
the existing tests — including error cases — without citing a class, path, or
library, as a sample of what `/catraca.plan` would generate. Run the leakage
checklist and, if subagents are supported, the **clean-context adversarial
review** (Claude Code Task tool) that tries to refute the spec.

## Step 5 — Emit the seed

Assemble a **`SEED FOR /catraca.init`** block = the product idea + candidate
features (Step 2) + Gates A–D answered with evidence (Step 3) + the sample specs
(Step 4). This block is the **extracted prompt**. In auto mode, also write
`questions.md` so init can proceed straight through.

## Step 6 — Round-trip validation (recommended)

Run the seed through `/catraca.init` → `/catraca.plan` and **compare** the
generated `specs/NNN-*.md` with the behavior of the real tests from Step 1. Each
divergence is a **gap in the seed** (a feature or criterion the product did not
capture) — address it and re-emit.
