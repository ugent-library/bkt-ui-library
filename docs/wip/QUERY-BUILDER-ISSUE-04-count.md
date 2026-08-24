---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][04] Advanced search: the approximate count on the submit"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of epic 00. -->

## Why

The current power tiers reveal an over-broad or empty query only after submission.
The builder shows an approximate count while Ans Rapport (faculty communications
officer) narrows a set. The results page remains the exact count.

## What

- [ ] The submit shows and announces the count after complete conditions change
- [ ] The count settles after typing; an older response cannot replace a newer one
- [ ] Zero results never cause the builder to remove a condition
- [ ] The builder remains usable when counting is unavailable
- `out of scope` Results list

**Prototype:** [count](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [zero results](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-no-results)

> **Screenshot:** the submit carrying a count (`screenshots/04-submit-count.png`)
> **Screenshot:** the zero-result state (`screenshots/04-no-results.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] The count is the builder's only announced region
- [ ] Counting cannot make public search more expensive than the search it previews
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by issue 02 and issue 03.

## Open questions

- **Count wording:** exact total, or a capped “more than N” total?
- **Zero-result help:** generic help, same-field OR suggestion, spelling help, or both
  suggestions? Spelling help requires search support; the OR suggestion uses the query
  structure.
