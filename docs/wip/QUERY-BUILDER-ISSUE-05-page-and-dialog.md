---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][05] Advanced search: the page, and the dialog over the results"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

> **TBD — the rendering rule under What is a proposal, not a decision.** Confirm it before this
> issue is filed.

## Why

Advanced search in current Biblio is a page you travel to. It carries your query and arrives
pre-filled, so nothing is lost. The list is simply no longer in front of you while you work on the
query that produced it. Most people are working on such a list when they start: 990 of the 1,601
sessions that used the power tier in six months already had one on screen, and typing a simple
search first is the commonest way they got it (`docs/wip/QUERY-BUILDER-EVIDENCE.md` in
bkt-ui-library).

So the builder renders in two shapes: a page, and a dialog over the result list for anyone already
looking at one.

Ans Rapport (faculty communications officer) is in that majority. She starts from a list and adds
organization and year without losing it, because the count is what she came for. Quinn Query
(analyst outside the application) arrives the other way, with a batch of identifiers and no list to
keep, and needs an address she can bookmark and hand on.

## What

- [ ] Both shapes come from one source, so neither can drift from the other
- [ ] The rendering follows the query rather than how the request was made: an address without a
      query returns the page, an address with one returns the result list with the builder open over it
- [ ] The address holds the whole query, so reload reopens the builder on it and a copied link gives
      it back editable rather than approximated
- [ ] Back goes to the previous address, so someone who opened the builder returns to the list they
      opened it from
- [ ] The builder stays usable when JavaScript does not run
- [ ] Arriving from a filtered list, each active filter is an editable condition row
- [ ] A filter a condition holds reports that in the sidebar, with a way to edit the condition
- `out of scope` The result list, its filters and its sorting

> **Screenshot:** the page (`templates/biblio-public/public-search-advanced.html`)
> **Screenshot:** the dialog over the results (`templates/biblio-public/public-works.html?advanced=1`)
> **Screenshot:** the sidebar reporting a filter held by a condition
> (`templates/biblio-public/public-works.html?state=advanced-condition`)

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [page](https://bkt-ui.vercel.app/templates/biblio-public/public-search-advanced.html), the
[dialog](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?advanced=1) and the
[pattern page](https://bkt-ui.vercel.app/patterns/query-builder.html).

## Acceptance criteria

- [ ] Matches the prototype at both source-of-truth paths
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: focus enters the dialog on
      open and returns to what opened it on close
- [ ] `make build` passes

## Dependencies

Blocked by 02 and 03, and by the epic's address decision.
