---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][05] Advanced search: the dialog over the results"
---

<!-- Refile source for raven #228. -->

## Why

Most observed power-search sessions began with results already on screen: 990 of
1,601 sessions in six months. A separate Advanced page hides that list while the
query changes. The builder opens over the results and keeps the query in one durable
address, so Ans Rapport (faculty communications officer) can refine an existing list
and share it.

## What

- [ ] The builder is a dialog over the results at one address
- [ ] An empty query opens over the unfiltered list
- [ ] Reload restores every editable condition and reopens the dialog
- [ ] Back returns to the previous URL state
- [ ] The open dialog renders server-side
- [ ] Existing filters on the list enter as editable conditions
- [ ] The filter chips are the only place the page shows builder conditions
- `out of scope` The sidebar pointing back to a condition-held filter — future design
- `out of scope` The search box's free text — it stays in the search box, never a
  condition
- `out of scope` Results, facets and sorting

**Prototype:** [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)

> **Screenshot:** the builder open over the results (`screenshots/00-builder-over-results.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Focus enters on open and returns to the opener on close
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by #225, #226 and the address decision in #223.
