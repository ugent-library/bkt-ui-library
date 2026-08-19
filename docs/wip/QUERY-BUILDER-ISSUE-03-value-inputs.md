---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][03] Advanced search: the value input per field type"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

In both old tiers a person is a text box, so you have to know how the name is written, and a search
for one surname finds everyone who shares it. Here a person row holds the researcher you picked, so it
shows who it means.

Quinn Query (analyst outside the application) pastes rather than types: real batches run to 763
identifiers. Ans Rapport (faculty communications officer) has to pick the right organization out of
several similar names, which a text box cannot do for her.

## What

- [ ] One control per kind of value, and changing the operator changes the control
- [ ] `is any of` on the eight select fields takes several values in one row — 22% of authored
      queries on a closed-vocabulary field carry more than one
- [ ] Person, organization and project resolve against records, so a row holds who was picked rather
      than what was typed
- [ ] A pasted batch reports what it recognised, lists the lines it could not read, and drops nothing
      silently
- [ ] A list too long for a durable link says so, and points at Save this search

> **Screenshot:** a person row with two people and the picker open
> **Screenshot:** the identifier row with a pasted batch

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?advanced=1) and
the [pattern page](https://bkt-ui.vercel.app/patterns/query-builder.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: each picked value can be
      removed from the keyboard and is named when it is removed
- [ ] A pasted batch of several hundred values stays usable in the row
- [ ] Every value list is read from raven's configured vocabulary, never copied from the lists
      printed in the field contract
- [ ] `make build` passes

## Dependencies

Blocked by 02, the row it sits in.
