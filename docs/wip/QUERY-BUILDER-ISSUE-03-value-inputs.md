---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][03] Advanced search: the value input per field type"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of epic 00. -->

## Why

The old power tiers treat people and organizations as text. A surname can match several
people, and similar organization names are hard to distinguish. The builder stores the
record Ans Rapport (faculty communications officer) picked.

Quinn Query (external analyst) also needs to paste large identifier batches; observed
batches reach 763 values.

## What

- [ ] Each value type has one control, selected by its operator
- [ ] `is any of` accepts several values for the eight closed-vocabulary fields
- [ ] Person, organization and project controls store the selected record
- [ ] Paste reports recognized and unread lines without dropping any silently
- [ ] A batch too long for a durable link points to Save search

**Prototype:** [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [pattern](https://bkt-ui.vercel.app/patterns/query-builder.html)

> **Screenshot:** a person row with two people and the picker open (`screenshots/03-person-picker.png`)
> **Screenshot:** the identifier row with a pasted batch (`screenshots/03-identifier-batch.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Each selected value is keyboard-removable and named when removed
- [ ] A batch of several hundred values remains usable
- [ ] Value lists come from Raven's configured vocabularies
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by issue 02.

## Open questions

Do we need a way to add strings for person, project or organization?
