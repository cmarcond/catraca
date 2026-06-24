# NNN — Feature Name

> Intent spec. No classes, paths, libraries, or signatures (see `README.md`).

## Intent

<!-- Developer/product voice, 2-5 sentences: what this feature enables and why.
     E.g.: "I need visitors to create an account with a name, email, and
     password, and duplicate accounts to be rejected." -->

## Acceptance criteria

<!-- Observable behavior in EARS, one criterion per line (see README.md).
     Event-driven is the everyday case; add While / If-then / Where / ubiquitous
     as needed. Keep each at the behavior level: "shall <observable response>". -->

- When <trigger>, the system shall <response>.
- If <unwanted condition>, then the system shall <response>.


## Out of scope

<!-- What this feature does NOT cover (goes to another feature or never). -->

-

## Applicable skills

<!-- Ids from .catraca/skills/index.yaml. Reference only — don't copy content.
     Justify non-obvious inclusions and exclusions of mandatory skills. -->

- `testing/tdd-minimal-step`
- …

## Dependencies

<!-- Features that must exist first (roadmap numbers). -->

-

## Leakage checklist

- [ ] No classes/files/libraries/signatures in the text above.
- [ ] All criteria are testable as behavior.
- [ ] Referenced skills exist in the index.
