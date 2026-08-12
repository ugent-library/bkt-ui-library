---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][backoffice] Work card: retracted indicator"
---

## Why

A retracted work stays public and citable. Cards must show the mark before someone
opens, downloads or cites the work.

> **Screenshot:** the retracted public card (`patterns/work-card.html`, "Public card
> — retracted")
> **Screenshot file:** `10-12--public-retracted-card.png`

> **Screenshot:** a retracted backoffice record (`patterns/work-card.html`) — the
> badge beside the status and visibility badges
> **Screenshot file:** `10-12--backoffice-retracted-card.png`

## What

- [ ] Retracted badge on the public card, in the metadata row
- [ ] Compact public-card warning for retracted records: "Retracted: this record
      has been retracted."
- [ ] Retracted badge on the backoffice card, beside the deposit-status and
      visibility badges
- [ ] The work keeps its access badge and reference line
- [ ] A retracted work stays public and keeps appearing in result lists
- `out of scope` The retraction notice on the detail page — own issue
- `out of scope` Marking a work as retracted — the curator-facing act is 10
- `out of scope` Withdrawal and takedown — deletion states, design pending

The prototype covers **a retracted public card and a retracted backoffice card**.

_The prototype governs the visible page and markup. Machine-facing output
(`citation_*` tags, Signposting, `?format=` alternates, crawl semantics) is governed
by `docs/public-site-semantics.md` — preserve as-is. UI copy goes through the
translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [patterns/work-card.html](https://bkt-ui.vercel.app/patterns/work-card.html) and
[templates/biblio-researcher/search-researcher.html](https://bkt-ui.vercel.app/templates/biblio-researcher/search-researcher.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] The badge appears on every surface that lists works
- [ ] `make build` passes

## Dependencies

Blocked by **10**, which owns the mark this indicator shows, and **01**.

## Out of scope

- How retracted will be registered in the work.
- How retracted will be shared in the OAI and other sharing methods.

## Open questions

None. Notice text is 10's.
