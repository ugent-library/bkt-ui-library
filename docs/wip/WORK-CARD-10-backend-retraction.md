---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Retraction mark on works"
labels: backend
---

## Why

A retraction is not a deletion. The work stays public and citable, but carries a
mark wherever it appears.

## What

- [ ] A work can be marked as retracted, and stays public when it is
- [ ] The mark is available wherever the work is listed, not only on its own page
- [ ] A retracted work remains in result lists, exports, harvesting sets and the
      researcher's own publication list
- [ ] The mark records who made it and when
- [ ] Retraction is distinct from deletion, tombstones and author withdrawal

## Acceptance

- [ ] A retracted work still resolves at its own URL and still appears in result
      lists
- [ ] Every card in a result list shows the mark
- [ ] `make test` passes

## Dependencies

Blocks #193, the retracted indicator on cards.

## Open questions

- **Retraction notice:** free text, publisher link, or both? Policy — Open Science
  Policy with the curation lead and lead dev.

> No backend screenshot. Card output is shown in the public and backoffice
> retraction screenshots.
> **Screenshot files:** `10-12--public-retracted-card.png`,
> `10-12--backoffice-retracted-card.png`
