---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][backoffice] Work card: retracted badge"
---

## Why

Old Biblio files retraction with author withdrawal and legal takedown, as reasons a
record leaves the site. A retraction is not a removal: the work stays public and
citable, and carries a mark saying the scholarly record was corrected.

In raven the card carries that mark as one badge in the metadata row — red, the
card's strongest colour — on the public card and the backoffice card alike. It is
the only card element that speaks about the research itself rather than about the
record or the file; that is why it may compete with the open-access badge for
attention. The notice itself — what, by whom, why — belongs to the detail page.

Sue Kerr (academic reader) scans a result list and downloads without opening the
record, so the mark has to survive on the card. Marie Curator (reviewer) is the
one who records it.

> **Screenshot:** the retracted public card (`patterns/work-card.html`, "Public card
> — retracted")

> **Screenshot:** a retracted record in the researcher's list
> (`search-researcher.html`) — the badge beside the status badge

## What

- [ ] Retracted badge on the public card, in the metadata row
- [ ] Retracted badge on the backoffice card, beside the deposit-status badge
- [ ] The work keeps its access badge and reference line — the mark adds, it does
      not replace
- [ ] A retracted work stays public and keeps appearing in result lists
- `out of scope` The retraction notice on the detail page — own issue
- `out of scope` Marking a work as retracted — the curator-facing act is 10
- `out of scope` Withdrawal and takedown — deletion states, design pending

The prototype covers **a retracted public card and a retracted backoffice card**. We
iterate on top. Flag ambiguity.

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
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] The mark never rests on colour alone
  - [ ] Badge contrast holds in both surface themes
- [ ] `make build` passes

## Dependencies

Blocked by **10**, which owns the mark this badge shows, and **01**.

## Open questions

None. Notice text, who writes it, and whether a retracted work is excluded from any
export are 10's.
