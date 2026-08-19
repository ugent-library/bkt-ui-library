---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][00] Advanced search: one query builder replaces both power tiers"
---

<!-- Draft. Query-builder track: docs/wip/README.md. -->

## Why

Current Biblio: advanced search offers a fixed set of fields and cannot express every combination.
Expert search expresses everything and asks you to know a query language. One builder replaces both:
conditions are rows in plain language, the submit carries an approximate count, and the results
toolbar hands the set on.

Wim Webb (researcher with a site of his own) embeds it, Ans Rapport (faculty communications officer)
puts it on a faculty page and checks the count, Quinn Query (analyst outside the application) exports
it, and Cody Crawley (machine reader) reads the addresses they produce.

Every URL the old tiers produced keeps working, and every query anyone authored on them stays
expressible on the fields for each surface. We parked a few legacy index names: nobody used them in the
logged period, and we take that to mean no reader needs them in a builder.
We assume a query API is the likelier home for them. A translated query carrying one still resolves.
A copied link has to keep resolving too, which is the harder promise: it must hold every condition
the builder can build, and keep "by both of these people" distinct from "by either of them".

## What

- [ ] 01 — keep power-search usage measurable
- [ ] 02 — condition rows: the field chooser, the operators, add and remove
- [ ] 03 — the value input per field type, including pasted lists
- [ ] 04 — the approximate count on the submit
- [ ] 05 — the dialog over the results list, at one address
- [ ] 06 — Share and Save this search on the results toolbar
- [ ] 07 — OR rule groups: alternatives across two fields
- `out of scope` The legacy-query translator. Separate workstream, requirements in subset B of the
  golden set.
- `out of scope` The simple search box and the results list.
- `out of scope` The backoffice builder, which reuses this one with more fields.

Raven settles how an address carries a query before the rest starts.

> **Screenshot:** the builder open over the results (`templates/biblio-public/public-works.html?state=builder-full-query`)

_The prototype governs the visible page and markup. Machine-facing output is governed by
`docs/public-site-semantics.md` — preserve as-is. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and the [pattern page](https://bkt-ui.vercel.app/patterns/query-builder.html).

## Acceptance criteria

- [ ] Every subset A case in the golden set is authorable, or signed off as not exposed
- [ ] Every case survives being copied and reopened
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`
- [ ] `make build` passes
