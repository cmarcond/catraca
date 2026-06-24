# Plan 11 — Strengthen the 13 skills' content

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. The method's core is its 13
skills under `skills/<category>/<name>/SKILL.md` (indexed by
`skills/index.yaml`). Each skill has frontmatter (`name`, `title`,
`description`, `category`, `dependencies`) and a body with English headings:
`When To Use`, `When Not To Use`, optional `Preconditions`, `Order Of
Operations`, `Test Checklist`, `Anti-Patterns` (some have extra sections). They
were recently **translated to English and normalized, but their guidance was NOT
changed** — content improvement was deliberately deferred to this plan. Read
`MANIFESTO.md`, `skills/index.yaml`, and all 13 `SKILL.md` files first.

The 13 skills: `testing/{tdd-minimal-step, test-doubles, test-setup-factories,
integration-tests}`, `architecture/{dependency-inversion-adapters,
controller-error-boundary, error-observability}`, `foundational/input-validation`,
`refactor/single-responsibility`, `domain-conventions/{layered-typing,
project-structure}`, `workflows/{git-conventions, quality-pipeline}`.

## Goal

Genuinely improve the **content** of the 13 skills — sharper guidance, stronger
Test Checklists and Anti-Patterns, better/clearer examples, and alignment with
current best practice — without diluting the method's opinionated spirit.

## Why it matters / what it solves

The skills are where Catraca's "quality solution" actually lives; the rubric
scores against their Test Checklists and Anti-Patterns. Translation kept them
faithful but left known rough spots (e.g. `layered-typing` is dense;
`error-observability` is light; some checklists are thinner than others). Better
skills directly raise the ceiling of every project that uses the framework.

## Why it solves it well

Each skill improvement is research-backed and immediately measurable through the
rubric, and the worked example (regenerated in plan 12) will exercise the
improved skills end to end.

## Scope / what's involved

Work **skill by skill** (one commit per skill, so each is reviewable):

1. For each skill, research the current state of the art for its topic (see
   Research), then strengthen:
   - **When To Use / When Not To Use**: tighten the boundaries; add missed cases.
   - **Order Of Operations**: make steps concrete and checkable.
   - **Test Checklist**: ensure every line is a binary, evidence-backed check (it
     feeds the rubric) — add missing checks, remove vague ones.
   - **Anti-Patterns**: cover the real failure modes a reviewer should catch.
   - **Examples**: keep them illustrative and language-agnostic (or clearly
     marked); fix anything stack-specific.
2. Preserve the frontmatter contract (`name`/`category`/`dependencies`); keep
   `description` third-person (what + when); keep headings English and the
   section set consistent.
3. Keep changes in the method's spirit (test-first, dependencies inward, gates
   not discipline) — sharpen, don't rewrite the philosophy.
4. If a change alters what the rubric expects, note it for plan 04/07.

## Out of scope

- Adding or removing skills, or changing the category structure.
- Re-translating (they're already English).

## Research

This is the heart of the plan — research **per skill** before editing. Example
queries: "TDD red-green-refactor best practices 2026", "test doubles stub vs mock
vs spy guidance", "Clean Architecture dependency rule adapters 2026", "controller
error boundary HTTP mapping best practice", "structured logging error
observability PII redaction", "input validation composite pattern", "single
responsibility refactoring under tests", "conventional commits spec latest",
"pre-commit quality gates". Cite key sources in each skill's commit body.

## Acceptance / verification

- Every skill keeps its frontmatter contract and consistent English structure.
- Test Checklists are binary and evidence-backed; Anti-Patterns map to real
  review findings.
- `skills/index.yaml` descriptions still match each skill.
- No Portuguese reintroduced; `examples/minimal` references still resolve (the
  example itself is regenerated in plan 12).

## Commit

Branch `improve/11-strengthen-skills`. **One commit per skill** (13 commits),
message like `refactor(skill): strengthen <name> guidance and checklist`. End
each with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
