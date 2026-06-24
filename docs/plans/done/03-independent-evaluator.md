# Plan 03 — Independent evaluator

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. `/catraca.evaluate`
(`commands/evaluate.md`) scores an implemented feature into a rubric
(`evaluation/NNN-*.md`) and updates `ratchet.json`. Step 2b already delegates an
**audit** to a clean-context subagent (in Claude Code, the Task tool) that tries
to knock scores down via re-execution + directed mutation testing; without
subagents it falls back to a "self" audit. `README.md`/`docs/usage.md` flag
"the evaluation is done by the same agent that implemented" as a known
limitation. Read `commands/evaluate.md` and `templates/evaluation/README.md`
first.

## Goal

Strengthen evaluation independence so the implementer doesn't effectively grade
its own work — make the independent audit the default path, with a clear,
specified protocol and a real fallback.

## Why it matters / what it solves

Self-evaluation is the framework's most-cited weakness. The audit subagent
mitigates it but is described as a secondary step. Promoting genuine
independence (separate context / separate model, no access to the implementation
conversation) makes the verdict and the ratchet trustworthy.

## Scope / what's involved

1. Reframe `commands/evaluate.md` so the independent audit is the **primary**
   evaluation path, not an add-on: the evaluator receives only the spec, declared
   skills, the code, and the verification commands — never the implementation
   conversation.
2. Specify the protocol precisely: inputs handed over, what the evaluator runs
   (suite, coverage, import inspection, directed mutations), how disagreements
   between the implementer's self-score and the auditor's score are resolved and
   recorded.
3. Define a non-Claude-Code fallback that still preserves independence (e.g. a
   second invocation with a fresh context, or a documented manual checklist),
   and update the "known limitations" wording in `README.md`/`docs/usage.md`
   accordingly.
4. Update `templates/evaluation/RUBRIC-TEMPLATE.md`'s "Audit" section to capture
   evaluator identity (independent vs self) and the resolution of any
   disagreement.

## Out of scope

- Building infrastructure to spawn a literally different model; design for it but
  keep the Markdown-playbook nature.

## Research

Look at current practice for independent/critic evaluation of agent output
(queries: "LLM as judge independent evaluator separate context", "self-evaluation
bias LLM critic model", "agent grading own work mitigation 2026"). Fold in the
strongest, lowest-cost technique.

## Acceptance / verification

- `commands/evaluate.md` makes independence the default with a specified protocol
  and a real fallback.
- The rubric template records evaluator identity and disagreement resolution.
- The "known limitations" notes are updated to reflect the new default.

## Commit

Branch `improve/05-independent-evaluator`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
