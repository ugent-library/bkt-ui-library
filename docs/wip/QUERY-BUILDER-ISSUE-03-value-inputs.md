---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][03] Advanced search: the value input per field type"
---

<!-- Refile source for raven #226: copy the body over the issue at the reveal. -->

## Why

The old power tiers treat people and organizations as text. A surname can match several
people, and similar organization names are hard to distinguish. The builder stores the
record Ans Rapport (faculty communications officer) picked.

## What

- [ ] The selected field sets the value control; the year operator switches between
      a year list and a pair
- [ ] A condition can hold several values; a work matches when any one of them
      matches
- [ ] A public condition takes at most five values; a picker disables further values
      at the cap
- [ ] An empty year leaves that end of a between open, announced as "2015 and later"
- [ ] Person, organization and project controls store the selected record
- [ ] Paste reports recognised lines, unread lines and what the cap drops — nothing
      disappears silently
- `out of scope` The identifier paste box — #295 (phase 2)

**Prototype:** [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [pattern](https://bkt-ui.vercel.app/patterns/query-builder.html)

> **Screenshot:** a person row with two people and the picker open (`screenshots/03-person-picker.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Each selected value is keyboard-removable and named when removed
- [ ] Value lists come from Raven's configured vocabularies
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by #225. Title and Keywords autocomplete depend on a raven index capability.

## Open questions

Do we need a way to add strings for person, project or organization?
