---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][05] Advanced search: the dialog over the results"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

Advanced search in current Biblio is a page you travel to. It carries your query and arrives
pre-filled, so nothing is lost. The list is simply no longer in front of you while you work on the
query that produced it. Most people are working on such a list when they start: 990 of the 1,601
sessions that used the power tier in six months already had one on screen, and typing a simple
search first is the commonest way they got it (`docs/wip/QUERY-BUILDER-EVIDENCE.md` in
bkt-ui-library).

So the builder is a dialog over the result list, at one address. Someone arriving with no query
still lands in it, over the unfiltered list, which becomes the answer to their first condition.

Ans Rapport (faculty communications officer) is in that majority. She starts from a list and adds
organization and year without losing it, because the count is what she came for. Quinn Query
(analyst outside the application) arrives with a batch of identifiers and nothing on screen yet, and
needs an address she can bookmark and hand on.

## What

- [ ] The builder is a dialog over the result list, and one address holds it
- [ ] An empty query is a legal state: the dialog opens over the unfiltered list
- [ ] The address holds the whole query, so reload reopens the builder on it and a copied link gives
      it back editable rather than approximated
- [ ] Back goes to the previous address, so someone who opened the builder returns to the list they
      opened it from
- [ ] The builder stays usable when JavaScript does not run
- [ ] Arriving from a filtered list, each active filter is an editable condition row
- [ ] A filter a condition holds reports that in the sidebar, with a way to edit the condition
- `out of scope` The result list, its filters and its sorting

> **Screenshot:** the builder open over the results (`templates/biblio-public/public-works.html?state=builder-full-query`)
> **Screenshot:** the sidebar reporting a filter held by a condition
> (`templates/biblio-public/public-works.html?state=facet-set-in-builder`)

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and the [pattern page](https://bkt-ui.vercel.app/patterns/query-builder.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: focus enters the dialog on
      open and returns to what opened it on close
- [ ] `make build` passes

## Dependencies

Blocked by 02 and 03.
