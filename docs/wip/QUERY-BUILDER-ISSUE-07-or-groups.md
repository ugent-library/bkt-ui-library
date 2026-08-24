---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][07] Advanced search: OR rule groups"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of epic 00. -->

## Why

Rows join with AND. A row can hold several values for one field, but only an OR group
can express alternatives across fields, such as “in this journal or from this
publisher.” Expert search supports four observed shapes that need this grouping.

The group legend says “any of these conditions” so it does not read like one row's
`is any of` value list.

## What

- [ ] A row becomes a group without moving
- [ ] Groups are one level deep; each alternative is one condition
- [ ] Removing alternatives down to one restores a plain row
- [ ] Spoken output distinguishes a group from a row
- [ ] “Split into AND rows” replaces the group with conditions that must all match
- [ ] Back restores the previous query because the address holds the group
- [ ] No condition is blocked or removed automatically

Issue 04 decides whether zero results suggest turning same-field rows into an OR group.

**Prototype:** [OR group](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-or-group)

> **Screenshot:** a group of two alternatives (`screenshots/07-or-group.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] The group is announced, not only drawn
- [ ] Each control names its alternative
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by issue 02 and the epic's address decision.
