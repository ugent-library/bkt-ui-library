---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][02] Advanced search: condition rows and the field chooser"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of epic 00. -->

## Why

Current Advanced search fixes five fields in one order. Other combinations require
Expert search and its query language. The builder lets Ans Rapport (faculty
communications officer) choose fields by recognizable public labels and change a row
without rebuilding it.

## What

- [ ] Each row follows the selected field's anatomy
- [ ] The chooser offers the 21 public fields from the field contract and is searchable
- [ ] Changing the field replaces that row in place
- [ ] Two rows may use one field; two Person rows require both people to match
- `out of scope` Value controls — issue 03
- `out of scope` Approximate count — issue 04

If two same-field rows find nothing, the interface may suggest an OR group. Issue 04
owns that recovery decision.

**Prototype:** [full query](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [empty builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-empty)

> **Screenshot:** the builder with several condition rows (`screenshots/00-builder-over-results.png`)
> **Screenshot:** the field chooser open over a row (`screenshots/02-field-chooser.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Every row control names its row
- [ ] Adding and removing a row is announced
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by the epic's address decision. Licence also requires Raven to expose the
field to public search.
