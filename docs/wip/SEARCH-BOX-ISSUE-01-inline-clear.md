---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][01] Search box: clear the query in place"
---

<!-- Resolve this number against the query-builder track before filing. -->

## Why

Clearing a query currently means selecting the text, deleting it and submitting
again. It can also discard filters even though query and filters are separate URL
parts.

Sue Kerr (public discovery visitor) needs to remove a mistyped topic without rebuilding
her filters. Marie Curator (bibliographic reviewer) needs bookmarked filter sets to
survive clearing one word.

## What

- [ ] Public search boxes show one inline clear while they contain text
- [ ] Clearing removes only the query, preserves filters, sort and page size, and
  returns to page one
- [ ] Compact search-within fields clear in place and refresh their filtered list
- [ ] Empty fields show no clear and reserve no gap
- [ ] Browser-native clear controls are suppressed where Booktower supplies one
- `out of scope` Backoffice search — its pattern is undecided

**Prototype:** [works search](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html),
[empty state](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=no-query)
and [component](https://bkt-ui.vercel.app/elements/search-bar.html)

Prototype URLs are placeholders. UI copy uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] The clear is keyboard reachable between the field and Search
- [ ] Its target is at least 24 by 24 pixels
- [ ] Text and placeholder never run under it
- [ ] The accessible name is translated; Dutch copy remains open
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes
