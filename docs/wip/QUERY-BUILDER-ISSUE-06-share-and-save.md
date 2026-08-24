---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][06] Search results: share the set and save the search"
---

<!-- Draft. Save search has no pattern yet. Query-builder track: docs/wip/README.md. -->

## Why

People build a set to use elsewhere. Current Biblio leaves them to copy the browser
address, while its two embed parameters are undocumented. The results toolbar makes
Link, Embed, API and Feed explicit.

Wim Webb (researcher with a site) needs the embed. Ans Rapport (faculty communications
officer) needs the faculty page it feeds to stay current.

## What

- [ ] Each shared address reruns the search instead of freezing its current results
- [ ] Embed preserves the legacy citation-style and info-block parameters
- [ ] Link, Embed, API and Feed work anonymously
- [ ] Save search requires a login and a name
- `out of scope` Export
- `out of scope` Managing saved searches — separate surface

**Prototype:** [results toolbar](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html)

> **Screenshot:** the Share panel, Embed tab (`screenshots/06-share-embed.png`)
> **Screenshot:** Save search open (`screenshots/06-save-search.png`)

Raven's `docs/public-site-semantics.md` governs machine-facing output. Prototype URLs
are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Legacy embeds render unchanged
- [ ] Link, Embed, API and Feed use is measurable by artifact type
- [ ] Copy confirmation is announced and tabs work from the keyboard
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by the epic's address decision.

## Open questions

- Which feed format does Raven support?
- What public API representation does Raven return?
