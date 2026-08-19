---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][02] Advanced search: condition rows and the field chooser"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

The old advanced form gives you a fixed ladder of five rows, one field each, in the order it prints
them. Anything else means expert search and its query language.

Here a query is a list of rows under one heading that says how they join. The field name is the
control that starts each row, so changing what a condition asks never means deleting the row and
building it again.

Ans Rapport (faculty communications officer) has no repository vocabulary. She has to recognise her
field by its name, in a list she can read.

## What

- [ ] The condition row, in the anatomy depending on the selected field
- [ ] The twenty-one public fields, each showing the operators and the qualifier of the field
- [ ] Picking a field in the chooser replaces that row's field in place, and the chooser is
      searchable
- `out of scope` The value inputs behind each operator — 03
- `out of scope` The count on the submit — 04

> **Screenshot:** the built page with three rows (`public-search-advanced.html`)
> **Screenshot:** the field chooser open over a row

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [page](https://bkt-ui.vercel.app/templates/biblio-public/public-search-advanced.html) and
its blank state, `?state=advanced-empty`.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: every row control carries
      a name that identifies its own row, and the list announces a row arriving or leaving
- [ ] `make build` passes

## Dependencies

Blocked by the address decision in the epic. The Licence row additionally waits on raven indexing a
field it already carries, which a developer should scope first.