---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][04] Advanced search: the approximate count on the submit"
---

<!-- Draft. Query-builder track: docs/wip/README.md. Child of 00. -->

## Why

On both old tiers you submit and find out afterwards whether the query was too narrow. Building
blind is why people submit the same query five times with one word changed.

Here the submit carries the count — "Show ± 1 280 results" — and it moves as conditions change. It
answers "am I narrowing the right way"; the results page answers "how many exactly".

Ans Rapport (faculty communications officer) checks the count rather than reading the list, because it
is how she knows the faculty page will be right.

## What

- [ ] The count moves as conditions change, and is announced when it moves for A11Y purposes
- [ ] It changes only on complete conditions, settles rather than flickering while someone types, and
      a superseded answer never overwrites a newer one
- [ ] Nothing is dropped on the reader's behalf when the set empties
- [ ] The builder stays fully usable when the count is unavailable
- `out of scope` The result list itself

> **Screenshot:** the submit carrying a count (`templates/biblio-public/public-works.html?state=builder-full-query`)
> **Screenshot:** the zero-result state, `?state=builder-no-results`

_The prototype governs the visible page and markup. Prototype URLs are placeholders, not real
endpoints. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [builder](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html?state=builder-full-query) and
its `?state=builder-no-results` rendering.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `docs/ACCESSIBILITY.md`, plus: the count is the one
      announced region on the builder, so nothing else competes with it
- [ ] Counting cannot be used to load the public search route beyond what it already takes
- [ ] `make build` passes

## Dependencies

Blocked by 02 and 03: a count needs conditions to count.

## Open questions

- **How exact the number is allowed to be.** A capped total is cheaper and needs a stated ceiling
  the wording has to carry ("more than 10 000"); an uncapped total is exact and costs more per
  keystroke.
- **Whether the zero-result state names its causes.** The prototype draws two recoveries in
  place: a misspelled value marked on its row, and a same-field pair carrying "Remove a
  condition, or turn one into an 'or' group". The pair reads from the query's own
  structure; the spelling mark needs an answer the search has to produce. Options: a generic
  zero-result state, the pair suggestion only, or both. (Team, with a developer's view.)
