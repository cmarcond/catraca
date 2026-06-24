# Glossary

Recurring Catraca terms, defined once. The manifesto and commands link here
rather than restating these.

- **Quality pipeline** (feature 000): the set of automatic gates — type-check,
  lint, commit-message format, staged-only tests, coverage — installed as git
  hooks that reject a commit/push when violated. Always the first feature.
- **Gate proof**: evidence that a gate actually works — you deliberately trigger
  a violation and confirm the hook rejects it. A gate without a proof does not
  count as installed.
- **Ratchet**: a one-way regression check. `ratchet.json` stores the best score
  per feature/dimension; a later run below `best − buffer` is flagged. Modes:
  `warn` / `block` / `repair`.
- **Buffer**: the ratchet's tolerance band (default `0.05`); a score between
  `best − buffer` and `best` is not a regression.
- **Safety net**: the green test suite that lets you refactor without fear.
- **Leakage**: accidental mixing of intent (the *what*) with implementation (the
  *how*) — e.g. a class, path, library, or signature appearing in a spec.
- **Canonical profile**: the method's default rigor settings (strict TDD, 5
  layers, 100% coverage, conventional commits) used in auto mode.
- **EARS** (Easy Approach to Requirements Syntax): the acceptance-criteria
  dialect — `When`/`While`/`If-then`/`Where`/ubiquitous + "the system shall …".
  See `specs/README.md`.
- **Intent vs solution**: specs state *intent* (observable behavior); skills hold
  the *solution* (how to build it with quality). Don't mix the two.
- **Test double**: a stand-in for a collaborator in a test — spy, stub, mock, or
  fake. See `skills/testing/test-doubles`.
- **Hard gate**: a non-negotiable checkpoint, enforced not trusted — e.g.
  test-first (production code without a prior failing test is deleted and redone).
- **Recurrence**: a violation already noted as a lesson in an earlier feature's
  rubric; in pedagogical mode it is penalized more the second time.
- **Gates (A–E)**: the User Feedback Gates where user decisions are taken; their
  sub-questions are numbered G1–G12. Mapping in `commands/init.md`.
- **Transversal dimensions**: the four cross-cutting evaluation scores —
  `test_first`, `layer_discipline`, `coverage`, `commit_discipline`. See
  `evaluation/README.md`.
- **Adapter / Protocol**: a *protocol* is an interface declared in the layer that
  needs it; an *adapter* implements it in `infra`, isolating a third-party
  library. See `skills/architecture/dependency-inversion-adapters`.
