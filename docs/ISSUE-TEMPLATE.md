---
name: Implement design
about: Port a Booktower prototype into Raven
title: "[area][nn] "
---

<!--
Use docs/SPEC-WRITING.md and the biblio-issue-writer skill.
Two types. A feature builds a page or region from a prototype and is numbered under
its epic. An improvement moves a region Raven already has onto a Booktower contract
and carries no number.
User-facing issue: at most 275 prose words. Backend issue: 175.
The prototype governs visible UI. Delete empty sections.
-->

## Why

<!-- Feature, 3–5 sentences: current limitation, who needs the change, why it matters.
     Improvement, 2–3 sentences: what Raven does locally, that Booktower now ships it,
     whether the design may still change. -->

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
- [ ] `make build` passes

## Out of scope

<!-- Delete when the What list already marks every exclusion. -->

## Dependencies

<!-- Issue links only. Use a bare draft number until the issue exists. Delete if empty. -->

## Open questions

<!-- Only questions that change visible behavior or product scope. Give concrete options. -->
