---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public] Make power-search usage measurable: request method, result count, builder events"
labels: backend
---

<!-- Draft, not filed: to discuss with the lead developer first. Query-builder track
     (docs/wip/QUERY-BUILDER-BET.md). Backend and measurement, no UI. -->

## Why

Both numbers this project is judged on come from the legacy log's four-way classification of a
search request — form, link, direct, bot. It puts the power tiers at 2.1% of human searches, and
their URLs at 63% of all Biblio traffic (2026-H1). It never records how many results a query
returned. The builder replaces the two UIs that Wim Webb (publishes his group's list on his own
site) and Quinn Query (exports the set) rely on; without the classification we ship that and never
notice we lost them.

## What

- [ ] Human and machine search traffic stay separable the way the 2026-H1 log separates them.
- [ ] For any search request we can tell which query ran and how many results it returned, from
      what the server already sees. Fields and operators authored, paste-list sizes, the
      zero-result share and OR-group use all follow from that.
- [ ] We can tell whether a builder session produced an artefact, and which one — link, embed,
      API or feed.

No cookies, no user identifiers, no third-party trackers, aggregate only. Query text and session
ids are personal data: retention and aggregation follow the DPO rules.

## Acceptance criteria

- [ ] The 2.1% baseline stays computable, and comparable year over year
- [ ] None of it needs client-side tracking
- [ ] No third-party requests from the page; DPO sign-off on retention and on stored query text
- [ ] `make build` passes

## Out of scope

- The legacy-query translator and its launch gate. Separate workstream.
- Any UI. Nothing here is visible to a user.
- The zero-result recovery trace. The zero-result rate alone is enough for design feedback.
- The rest of `notes/PLAN-measurement.md`. This is its builder-specific instance.

## Dependencies

The classification and the query-plus-count record need no page in front of them, and land first:
they set the baseline.

## Open questions

- **Analytics hosting** — self-hosted or EU cloud, and who signs off with the DPO. Either suits
  product. (Team + DPO call.)
- **Bot classification** — the legacy bot rule, or the new stack's own? Only the legacy rule is
  auditable against 2026-H1. (Team call.)

Source: [`BET`](QUERY-BUILDER-BET.md), `notes/PLAN-measurement.md`.
