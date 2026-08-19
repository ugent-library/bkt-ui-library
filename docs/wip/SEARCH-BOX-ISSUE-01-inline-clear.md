---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][01] Search box: an inline clear for the query"
---

<!-- Draft. The number is this track's own — resolve it against the
     query-builder track ([public][00]–[07]) before filing. -->

## Why

Nothing on the page clears the query: you select the text, delete it and submit again. And nothing
drops the query while keeping the filters, though the two are separate parts of one address.

We can't use the native clear for comboboxes, and want to align the experience everywhere.

So the box gets a clear (×) inside the field, while the box holds text. It re-runs the search without
the query text and every filter stays applied. The chips keep their own **Clear all filters**, so each control clears what sits
beside it, and a full reset is the two together.

Sue Kerr (public discovery visitor) narrows to open access and 2024, searches a topic, then wants
that set without the topic — or has mistyped and wants the box empty without rebuilding the rest.
Marie Curator (bibliographic reviewer) shares a filter set as a bookmarked URL, and losing it to
clear one word costs her the setup.

> **Screenshot:** works results header, query present, × inside the field

## What

- [ ] The clear in every public search box — the works results header, the three directories, the
      landing hero
  - it shows while the box holds a query, and follows what the visitor types
  - it navigates to the current address minus the query; every other parameter survives
  - its accessible name is "Clear search" ("Zoekopdracht wissen" — "wissen" or "leegmaken" is open)
- [ ] The same clear one size down in the compact fields — the search-within box on a long facet, the
      header search overlay. There it empties the field and the list re-filters, since those boxes
      narrow a list rather than change the address.
- [ ] Re-sync the compiled design-system CSS: the hero bar now draws the field itself and holds its
      controls inside it, so nothing overlaps the typed text
- `out of scope` Backoffice boxes — that search UI is undecided (`docs/SEARCH-AND-FILTERING.md`,
  Rule 5)

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at
[bkt-ui.vercel.app](https://bkt-ui.vercel.app). View the
[works results header](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html), its
[empty box](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=no-query),
and the component on [Search bar](https://bkt-ui.vercel.app/elements/search-bar.html). Prototype URLs
are placeholders; UI copy goes through the translation files.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus these component-specific
      concerns:
  - [ ] Clearing keeps every applied filter, lands on the first page, and keeps the sort and page size
  - [ ] Text and placeholder never run under the ×, and an empty box shows no × and no gap where it was
  - [ ] The × is reachable by keyboard between the field and Search, with a target of at least 24×24
  - [ ] One clear per box, never two, and the same one in every box
- [ ] `make build` passes
