---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][01] Search box: an inline clear for the query"
---

<!-- Draft, not filed. The number is this track's own — resolve it against the
     query-builder track ([public][00]–[07]) before filing. -->

## Why

A visitor who wants to drop the query has to select the text, delete it and submit again. Nothing
on the page clears the query, and nothing clears it while leaving the filters alone: the query and
the filters are separate parts of one address, but there is no control that treats them separately.

The search box gets a clear (×) inside the field, at its trailing edge, visible only while the box
holds text. Clicking it re-runs the search without the query text, and every filter stays applied —
the same result space, the topic dropped. It sits inside the field's border; the Search button stays
outside it, so the two read as different jobs. The chips keep their own **Clear all filters**, which
drops the filters and leaves the query. Each control clears what sits next to it, and a full reset is
the two together, which is why there is no third button.

Sue Kerr (public discovery visitor) narrows to open access and 2024, searches a topic, then wants to
see everything in that narrowed set — or has mistyped a word and wants the box empty without
rebuilding the rest. Marie Curator (bibliographic reviewer) assembles a filter set and shares it as a
bookmarked URL; losing that set to clear one word costs her the whole setup. For both, the cheap act
has to stay cheap: clearing one part of the query must not cost the other.

> **Screenshot:** works results header, query present, × inside the field

## What

- [ ] The clear in every public search box — the works results header, the researchers, organizations
      and projects directories, and the landing hero
  - it appears when the box holds a query and is absent when it does not
  - it follows the box as the visitor types: it arrives with the first character and goes with the last
  - it navigates to the current address minus the query; every other parameter survives
  - its accessible name is "Clear search", its glyph comes from the icon font, and it leaves the tab
    order when it goes
- [ ] Re-sync the compiled design-system CSS. The hero bar changed shape: it now draws the field and
      holds its controls inside it in flow, so a second control cannot land on the first and typed
      text cannot run under either.
- `out of scope` Backoffice search boxes

> **Screenshot:** landing hero with a query typed, × visible

Copy for the translation files, as a starting point:

| EN | NL |
|---|---|
| Clear search | Zoekopdracht wissen |

House style is open: "wissen" or "leegmaken".

_The prototype governs the visible page and markup. Machine-facing output (`citation_*` tags,
Signposting, `?format=` alternates, crawl semantics) is governed by `docs/public-site-semantics.md` —
preserve as-is. JS follows raven's frontend standards. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at
[bkt-ui.vercel.app](https://bkt-ui.vercel.app). Run it locally with `npm start` and the same paths on
`localhost:3111`.

View the [works results header](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html),
the [empty box](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=query-empty),
the [landing hero](https://bkt-ui.vercel.app/templates/biblio-public/public-index.html), the
[researchers](https://bkt-ui.vercel.app/templates/biblio-public/public-researchers.html),
[organizations](https://bkt-ui.vercel.app/templates/biblio-public/public-organisations.html) and
[projects](https://bkt-ui.vercel.app/templates/biblio-public/public-projects.html) directories, and
the component itself on [Search bar](https://bkt-ui.vercel.app/elements/search-bar.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus these component-specific
      concerns:
  - [ ] Clearing the query keeps every applied filter, and only the query goes
  - [ ] Clearing lands on the first page of the new set, and keeps the sort and the page size
  - [ ] The field's text and placeholder never run under the clear, at every box size
  - [ ] An empty box shows no clear and no leftover gap where it was
  - [ ] The clear is reachable by keyboard between the field and Search, and its focus ring is visible
  - [ ] The clear's pointer target stays at least 24×24 CSS px (WCAG 2.5.8); the prototype's is 32
  - [ ] The box shows one clear, never two — the field type must not add the browser's own
- [ ] `make build` passes

## Out of scope

- Backoffice search boxes. The backoffice search UI is undecided — `docs/SEARCH-AND-FILTERING.md`,
  Rule 5.
- **Clear all filters**, which already exists on the results and directory pages. This issue only
  scopes the query half of the pair.

## Open questions

- The compact header search overlay has no filters to keep and no suggestion panel, and its field
  type means the browser draws a clear of its own. Either it keeps the browser's clear, or it takes
  this one so every box on the public surface reads the same. A visitor sees the difference, so the
  choice is ours to make rather than the implementer's.
