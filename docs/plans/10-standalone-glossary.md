# Plan 10 — Standalone glossary

## Orientation (you may be starting from a clean context)

You are in the **Catraca** repo at `/Users/cesar/Projects/catraca` — a
spec-driven framework for TDD + Clean Architecture. A glossary of recurring terms
(quality pipeline, gate proof, ratchet, safety net, leakage, canonical profile)
currently lives as a section inside `MANIFESTO.md` and is mirrored in
`templates/manifesto.md` (which becomes `.catraca/manifesto.md`). Read both
manifesto files and skim `commands/` and `templates/` for where these terms are
used.

## Goal

Extract the glossary into a standalone `templates/glossary.md` (installed as
`.catraca/glossary.md`) and link to it from the commands and key docs, so a
reader can resolve a term at the point of use in one click.

## Why it matters / what it solves

Terms like "gate proof" and "leakage" appear across commands and templates, but
their definitions are buried in the manifesto. A dedicated, linked glossary makes
the vocabulary discoverable exactly where it's used.

## Scope / what's involved

1. Create `templates/glossary.md` with the current glossary entries (plus any
   other recurring terms worth defining: WHEN/THEN, intent vs solution, test
   double, hard gate, recurrence).
2. Replace the inline glossary in `templates/manifesto.md` (and top-level
   `MANIFESTO.md`) with a one-line pointer to the glossary, OR keep a short
   version and link to the full file — decide and keep both manifestos in sync.
3. Add the glossary to `install.py`'s template set (it's under `templates/`, so it
   installs automatically — verify it lands in `.catraca/`) and to the
   `.catraca/` map in `templates/CLAUDE.md`.
4. Link to it from the commands where the terms first appear (e.g. `plan.md`
   "leakage", `evaluate.md` "ratchet/gate proof").

## Out of scope

- Renaming any term; this is extraction + linking only.

## Research

Light: skim conventions for glossaries in developer docs (query: "developer docs
glossary linking best practice"). Not critical — keep it simple.

## Acceptance / verification

- `python3 install.py <tmp>` produces `.catraca/glossary.md`.
- Both manifestos stay consistent and point to the glossary.
- Term references in commands link to it; no definition is duplicated out of sync.

## Commit

Branch `improve/10-glossary`. End the message with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```
