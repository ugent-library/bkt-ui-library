---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][01] Make power-search usage measurable: request method, and which queries found nothing"
labels: backend
---

<!-- Draft, not filed: to discuss with the lead developer first. Query-builder track
     (docs/wip/QUERY-BUILDER-BET.md). Backend and measurement, no UI. -->

## Why

Both numbers this project are judged on rest on the current log classifying every search request as
form, link, direct or bot — the classification that puts the power tiers at 2.1% of human searches.
Replace the power UIs without it and afterwards nobody can tell whether the people who used them are
still there. The log also never records whether a query found anything, so a query that dead-ended
looks like one that worked.

## What

- [ ] Human and machine search traffic stay separable the way the current log separates them
- [ ] For any search request we can tell which query ran, and whether it found nothing

## Acceptance criteria

- [ ] The 2.1% baseline stays computable, and comparable year over year
- [ ] None of it needs client-side tracking
- [ ] `make build` passes

## Open questions

- **Bot classification** — the current rule, or the new stack's? Only the current one audits
  against the baseline. (Team call.)
