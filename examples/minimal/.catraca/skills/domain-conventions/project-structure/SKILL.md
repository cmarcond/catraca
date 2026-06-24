---
name: project-structure
title: Project Structure
description: Groups files by domain unit within each architectural boundary, mirrors the tree in tests, and treats reorganization as a pure refactor. Use when placing or moving files.
category: domain-conventions
dependencies: []
---

# Folder Structure by Layer and Entity

Organize artifacts first by the project's architectural boundary and then by
the domain unit each file serves. Keep test code, mocks, and helpers out of the
production scope. Treat any file movement as a pure refactor, without mixing in
behavior changes.

## When To Use

- Creating the files of a new entity and deciding where each artifact (use
  case, protocol, repository, controller) should live.
- The root of a layer has ~5+ heterogeneous files in a flat directory, with no
  subdivision.
- Files of distinct entities coexist in the same flat directory.
- Test mocks, spies, or factories live inside the production directory.

## When Not To Use

- The actual change is a behavior change; in that case implement the feature
  first and defer the reorganization to a separate commit.
- The gain is purely aesthetic and the import churn costs more than the clarity
  obtained.
- The tree already reflects the boundary → unit mapping and is stable; moving
  it again only hinders git archaeology.

## Definitions

- **Architectural boundary**: the highest-level division the project already
  adopts (layers, modules, bounded contexts). It is the outer axis.
- **Domain unit** ("entity"): the business concept that aggregates the related
  artifacts. It is the inner axis.
- **A different axis**: if the project organizes by vertical feature/module
  instead of by layer, keep that axis as the outer one and the domain unit as
  the inner one — do not force the layer→entity arrangement where it does not
  exist.

## Order Of Operations

1. Ensure the suite is 100% green before touching any path. With no green
   starting suite (or no suite), there is no safety net: add minimal coverage
   of the affected paths before moving, or do the reorganization in small,
   manually reviewable steps.
2. Define the axis: outer level = the architectural boundary already adopted by
   the project; inner level = the domain unit.
3. Create the test tree mirroring the production structure exactly; move mocks,
   spies, and helpers there.
4. Move the files by domain unit; group related protocols into subfolders by
   responsibility when the folder grows.
5. If the stack has a build/compilation step or a runner with multiple roots,
   adjust the configuration: separate the production and test roots, exclude the
   test tree from the build, and simplify coverage collection. In stacks
   without this step, skip it.
6. Fix imports in bulk; if the language uses import aggregation files
   (barrels/`index`), create them only when 3+ consumers import the same set of
   symbols.
7. Run the suite again: it must stay green without altering any assertion.
8. Make the commit containing only movement and import adjustments, with a
   message that states the rationale.

## Test Checklist

- [ ] Suite green immediately before the movement.
- [ ] Suite green immediately after, without changing assertions or logic — and
      the diff contains only renames/moves + import adjustments.
- [ ] No mock, spy, helper, or spec file inside the production tree.
- [ ] (If there is a separate build) the build excludes the test tree and
      coverage points only at production.

## Anti-Patterns

- Mixing reorganization with a new feature in the same commit, making
  `git blame` unusable.
- Keeping everything at the root of the layer until it becomes an
  impossible-to-navigate list.
- Leaving test artifacts in the production directory "because it's closer".
- Creating barrels and deep subfolders ahead of time, with no duplication or
  volume to justify them.
- Changing an assertion to "make the test pass" during the migration — a sign
  that a disguised behavior change crept in.
