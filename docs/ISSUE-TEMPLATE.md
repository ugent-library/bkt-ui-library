---
name: Implement design
about: Port a Booktower prototype into Raven
title: "[area][nn] "
---

<!--
Use docs/SPEC-WRITING.md and the biblio-issue-writer skill.
User-facing issue: at most 275 prose words. Backend issue: 175.
The prototype governs visible UI. Delete empty sections.
-->

## Why

<!-- In 3–5 sentences: current limitation, named persona need, and why it matters. -->

## What

<!-- Regions as checkboxes. Add only behavior the prototype cannot show. -->

- [ ] Region
  - behavior
- `out of scope` Deferred region — destination

**Prototype:** [page](https://bkt-ui.vercel.app/<template-path>)

<!-- Add the pattern page only when it carries a separate contract. -->

The prototype governs visible UI and markup. Raven's
`docs/public-site-semantics.md` governs machine-facing output. Prototype URLs are
placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Out of scope

<!-- Delete when the What list already marks every exclusion. -->

## Dependencies

<!-- Issue links only. Use a bare draft number until the issue exists. Delete if empty. -->

## Open questions

<!-- Only questions that change visible behavior or product scope. Give concrete options. -->
