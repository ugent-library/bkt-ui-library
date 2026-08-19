---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][05] Advanced search: the page and the dialog over the results"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

There are two ways to arrive, and each wants a different shape. Someone following a bookmark or a
shared link has no list to preserve, so they get Advanced search as a page. Someone refining a list
already on screen must not lose it, so they get the same builder as a dialog over it.

Either way the builder is part of the address, and arriving from a filtered list every active filter
is already a condition row: the query is one thing, in one place.

Wim Webb (researcher with a site of his own) hands links to colleagues who then change one criterion.
The link has to open something they can edit, not a page they have to rebuild.

## What

- [ ] Both renderings come from one source, so neither can drift from the other
- [ ] The dialog is part of the address: reload keeps it open, Back closes it, a pasted link opens
      the page
- [ ] A shared link gives back the query it came from, editable, and not an approximation of it
- [ ] Arriving from a filtered list, each active filter is an editable condition row
- [ ] A filter a condition holds reports that in the sidebar, with a way to edit the condition
- `out of scope` The result list, its filters and its sorting

> **Screenshot:** the dialog over the results (`public-works.html?advanced=1`)
> **Screenshot:** arrival from a filtered list, `?state=advanced-prefilled`
> **Screenshot:** the sidebar reporting a filter held by a condition, `?state=advanced-condition`

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [page](https://bkt-ui.vercel.app/templates/biblio-public/public-search-advanced.html), the
[dialog](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?advanced=1) and the
[pattern page](https://bkt-ui.vercel.app/patterns/query-builder.html).

## Acceptance criteria

- [ ] Matches the prototype at both source-of-truth paths, from one shared source
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: focus enters the dialog on
      open and returns to what opened it on close
- [ ] `make build` passes

## Dependencies

Blocked by 02 and 03.
