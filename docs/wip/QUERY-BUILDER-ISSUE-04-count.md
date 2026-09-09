---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][04] Advanced search: the approximate count on the submit"
---

<!-- Refile source for raven #227: copy the body over the issue at the reveal. -->

## Why

Advanced and Expert search reveal an over-broad or empty query only after it runs.
The builder shows an approximate count while Ans Rapport (faculty communications
officer) narrows a set.

## What

- [ ] The submit button shows the count and announces it when a complete condition
      changes
- [ ] The count settles after typing; an older response never replaces a newer one
- [ ] The count is exact below a threshold raven picks and reads "more than 10,000"
      above it; zero is always exact
- [ ] Zero results never cause the builder to remove a condition
- [ ] The builder remains usable when counting is unavailable
- `out of scope` The results list
- `out of scope` Spelling feedback on a zero-result row — later phase

**Prototype:** [count](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query)
and [zero results](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-no-results)

> **Screenshot:** the submit carrying a count (`screenshots/04-submit-count.png`)
> **Screenshot:** the zero-result state (`screenshots/04-no-results.png`)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] The count is the builder's only live region
- [ ] Counting never costs more than the search it previews
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by #225 and #226.
