---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][00] Advanced search: one query builder replaces both power tiers"
---

<!-- Raven #223. -->

## Why

Current Advanced search offers a fixed field set. Expert search supports more queries
but requires its query language. One visual builder replaces both with plain-language
condition rows and an approximate result count.

The backoffice reuses the builder with more fields.

Wim Webb (researcher with a site) and Ans Rapport (faculty communications officer)
build and reuse sets. Cody Crawley (machine reader) needs their addresses to remain
stable.

`out of scope` Quinn Query (external analyst) uses the API. Marie Curator
(reviewer/curator) arrives with phase 2.

Existing power-search URLs keep working.

## What

This is front-end work. Where the backend lacks a capability, create a backend issue
or stub it in the front end.

- [ ] `phase 1` #224 — measurement baseline
- [ ] `phase 1` #225 — condition rows and field chooser
- [ ] `phase 1` #226 — value input per field type
- [ ] `phase 1` #227 — approximate count
- [ ] `phase 1` #228 — dialog and durable address
- [ ] `phase 1` #229 — Share and Save search
- `out of scope, phase 2` #295 — backoffice field set (fields TBD)
- `out of scope, phase 3` #230 — OR groups across fields
- `out of scope` Legacy-query translator — separate workstream
- `out of scope` Simple search box and results list — free text stays there, never a
  condition

**Prototype:** [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [pattern](https://bkt-ui.vercel.app/patterns/query-builder.html)

> **Screenshot:** the builder open over the results (`screenshots/00-builder-over-results.png`)

Raven's `docs/public-site-semantics.md` governs machine-facing output. Prototype URLs
are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Every golden-set subset A case is authorable, or signed off (not exposed, over
      cap, parked for a later phase)
- [ ] Every authored query survives copy and reload
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Raven defines how one durable address carries the full query before the child issues
land.
