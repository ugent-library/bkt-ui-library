---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public] Work detail: related research output"
---

> **Nice-to-have public follow-up.** This replaces raven#125, which was never
> picked up. It is outside the backoffice work-card epic.

## Why

The public work detail page should help readers move from one work to nearby
research output. Related works are useful when the record shares keywords with
other works: a reader who arrives deep-linked from Google can continue browsing
without going back to search.

The related item is a normal work card. The reader is scanning works, so the panel
uses the card grammar from **01** — the same list wrapper and card regions as every
other public work list — plus one added keyword row that explains why the match is
there.

The section is public information and should be served with the page. The old
lazy-load framing from raven#125 is dropped. The match query may still be expensive;
cache, precompute, or another backend strategy is Raven's implementation decision.

> **Screenshot:** the related research panel on the work detail page
> **Screenshot file:** `07--work-detail-related.png`

## What

- [ ] Add a "Related research output" section to public work detail pages
- [ ] Render up to three related works, ranked by shared-keyword similarity
- [ ] Render each related work as a standard public work card, per **01**
- [ ] Add a keyword row to each related work card
  - shared keywords are marked and include text for screen readers
  - other displayed keywords remain available as keyword links
- [ ] Keyword links go to the keyword-scoped works search
- [ ] Show two related works when there are two
- [ ] Omit the section when there are no related works
- [ ] Show "More related research, by keyword" only when more than three related
      works exist
- [ ] The "More related research" link lands on a works search filtered by this
      work's keywords once keyword filtering supports it

The prototype shows the section on
`templates/biblio-public/public-work-detail.html` and
`templates/biblio-public/public-work-detail-dataset.html`.

_The prototype governs the visible page and markup. Machine-facing output
(`citation_*` tags, Signposting, `?format=` alternates, crawl semantics) is governed
by `docs/public-site-semantics.md` — preserve as-is. Prototype URLs are
placeholders. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-public/public-work-detail.html](https://bkt-ui.vercel.app/templates/biblio-public/public-work-detail.html) and
[templates/biblio-public/public-work-detail-dataset.html](https://bkt-ui.vercel.app/templates/biblio-public/public-work-detail-dataset.html).

## Acceptance Criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] Related works use the standard public work-card markup from **01**
- [ ] Card titles sit one level below the section heading
- [ ] Shared keywords have a text equivalent that survives without sight
- [ ] The section is absent when there are no related works
- [ ] The "More related research" link is absent when there are three or fewer
      related works
- [ ] `make build` passes

## Dependencies

- Blocked by **01** for the shared work-card grammar.
- The "More related research" link depends on raven#159 for keyword filtering and
  the final URL state.
- The matching query needs a backend strategy before production if it is too
  expensive to compute on every render.

## Out Of Scope

- A bespoke compact match-card component
- Lazy-loading the section on scroll
- Backoffice related-record counts on cards
- The related-record count shown inside backoffice work cards

## Open Questions

- Should the "More related research" result set match any shared keyword or require
  all shared keywords? The prototype assumes a keyword-filtered works search, but
  the OR/AND rule belongs with raven#159.
