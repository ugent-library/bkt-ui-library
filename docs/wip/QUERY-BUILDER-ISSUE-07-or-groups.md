---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][07] Advanced search: OR rule groups"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

A row holds several values of its own field, and rows join with and. What that misses is an
alternative across two different fields — "in this journal or from this publisher, and published
since 2015". Expert search expresses it today, so shipping without it takes something from the people
who wrote those four shapes.

A row becomes a group where it stands, under a legend reading "…where any of these conditions is
true". The word conditions is load-bearing: without it, a group and a row's own "is any of" read
identically. The interaction in full: `docs/wip/QUERY-BUILDER-OR-GROUPS.md` in bkt-ui-library.

## What

- [ ] A group sits anywhere a row can, so nothing moves when one becomes the other
- [ ] One level deep: an alternative is always a single condition
- [ ] Removing alternatives down to one turns the group back into a plain row
- [ ] A group and a plain row are told apart when read aloud, not only when seen
- [ ] The control that ends a group reads "Split into 'and' rows", because the click turns "either
      of these" into "both of these" and usually empties the set
- [ ] The reverse is offered where it is needed: a query matching nothing, with two rows on one
      field, offers to make those rows a group. Nothing is prevented and nothing is auto-dropped
- [ ] Back undoes it, because the address carries the query

> **Screenshot:** a group of two alternatives, `?state=builder-or-group`

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-or-group) at
`?state=builder-or-group`.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: the grouping is announced,
      not only drawn, and each control names which alternative it belongs to
- [ ] `make build` passes

## Dependencies

Blocked by 02, and by the address decision in the epic, which has to carry a choice between
alternatives.