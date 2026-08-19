---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][06] Search results: Share the set, and save the search"
---

<!-- Draft, under construction: Save this search has no pattern yet, so the Share half is the
     reviewable part. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

Building the query is half the job. What people came for is the set somewhere else — a group site, a
spreadsheet, a feed reader, another application — and today that means copying the address out of the
browser bar and hoping. The two embed parameters that exist are written down nowhere.

The results toolbar carries the handoff, beside Export. Share opens four tabs, each with an address
and a copy control, one per way of taking the set away: Link, Embed, API, Feed. Save search names the
query and keeps it, which needs a login.

Wim Webb (researcher with a site of his own) needs the embed, and Ans Rapport (faculty
communications officer) needs the faculty page it feeds to stay right with nobody maintaining it.

## What

- [ ] Each tab's address re-runs the search rather than freezing the set it matched
- [ ] Embed's sort order, citation style and info-block switch keep the two legacy embed parameters
      working
- [ ] Everything except saving works without an account
- `out of scope` Export, which already exists on this toolbar
- `out of scope` What a saved search does once saved — its own surface

> **Screenshot:** the Share panel, Embed tab (`public-works.html`)
> **Screenshot:** Save search open

_The prototype governs the visible page and markup. Machine-facing output is governed by
`docs/public-site-semantics.md` — preserve as-is. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [results page](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] An embed written against the old parameters keeps rendering the same way
- [ ] Which artefact a session produced — link, embed, API or feed — is answerable afterwards
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: copying reports that it
      happened, and the tabs are operable from the keyboard
- [ ] `make build` passes

## Dependencies

Blocked by the address decision in the epic: every tab shows an address.

## Open questions

- **The feed and the API have no legacy behind them.** No existing parameter says what either
  should be, so each needs a shape: which format the feed speaks, and what the API returns.
