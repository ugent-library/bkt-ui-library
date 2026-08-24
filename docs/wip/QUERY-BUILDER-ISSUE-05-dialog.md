---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][05] Advanced search: the dialog over the results"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of epic 00. -->

## Why

Most observed power-search sessions began with results already on screen: 990 of
1,601 sessions in six months. A separate Advanced page hides that list while the query
changes. The builder opens over the results and keeps the query in one durable address.

Ans Rapport (faculty communications officer) can refine an existing list. Quinn Query
(external analyst) can bookmark and share a batch query.

## What

- [ ] The builder is a dialog over the results at one address
- [ ] An empty query opens over the unfiltered list
- [ ] Reload restores every editable condition and reopens the dialog
- [ ] Back returns to the previous URL state
- [ ] The open dialog renders server-side
- [ ] Existing filters on the list enter as editable conditions
- [ ] A sidebar filter held by a condition points back to that condition
- `out of scope` Results, facets and sorting

**Prototype:** [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [condition-held facet](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=facet-set-in-builder)

> **Screenshot:** the builder open over the results (`templates/biblio-public/public-works.html?state=builder-full-query`)
> **Screenshot:** the sidebar reporting a filter held by a condition
> (`templates/biblio-public/public-works.html?state=facet-set-in-builder`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Focus enters on open and returns to the opener on close
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by issue 02 and issue 03.
