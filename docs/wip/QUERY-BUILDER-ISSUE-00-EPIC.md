---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][00] Advanced search: one query builder replaces both power tiers"
---

<!-- Draft. Query-builder track: docs/wip/README.md. -->

## Why

Current Advanced search offers a fixed field set. Expert search supports more queries
but requires its query language. One visual builder replaces both with plain-language
condition rows and an approximate result count.

Wim Webb (researcher with a site), Ans Rapport (faculty communications officer) and
Quinn Query (external analyst) need to build and reuse sets. Cody Crawley (machine
reader) needs their addresses to remain stable.

Existing power-search URLs keep working. Every query in the accepted golden set stays
expressible or receives an explicit exception.

## What

- [ ] issue 01 — measurement baseline
- [ ] issue 02 — condition rows and field chooser
- [ ] issue 03 — value input per field type
- [ ] issue 04 — approximate count
- [ ] issue 05 — dialog and durable address
- [ ] issue 06 — Share and Save search
- [ ] issue 07 — OR groups across fields
- `out of scope` Legacy-query translator — separate workstream
- `out of scope` Simple search box and results list
- `out of scope` Backoffice field set

**Prototype:** [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [pattern](https://bkt-ui.vercel.app/patterns/query-builder.html)

> **Screenshot:** the builder open over the results (`templates/biblio-public/public-works.html?state=builder-full-query`)

Raven's `docs/public-site-semantics.md` governs machine-facing output. Prototype URLs
are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Every golden-set subset A case is authorable or explicitly not exposed
- [ ] Every authored query survives copy and reload
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Raven defines how one durable address carries the full query before the child issues
land.
