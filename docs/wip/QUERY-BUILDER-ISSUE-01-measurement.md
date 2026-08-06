---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public] Make power-search usage measurable: request method, result count, builder events"
labels: backend
---

<!-- Draft. Query-builder track (docs/WIP/QUERY-BUILDER-BET.md). Backend / measurement, no UI. -->

## Why

The legacy Biblio search log classifies every search request as **form / link / direct / bot**.
That classification is where the two numbers this project is judged on come from: the power
tiers are **2.1% of human searches**, and the URLs those searches produce carry **63% of all
Biblio traffic** (2026-H1, `REPORT-search-log-analysis.md`). The legacy log also records the
query — but not how many results it returned, which is why nobody can say today how often a
power query dead-ends, or which fields and operators are worth exposing.

What we need after the migration: the same four-way classification is derivable for search
requests, a search request is recorded together with the query it ran **and** its result count,
and the Advanced search builder reports three moments — first condition added, artifact copied
(and from which tab), search saved. Those four things answer: did the power-tier audience stay,
do built queries dead-end, which output is the real product, was phase 2 worth building.

**Marie Curator** is that audience — the bibliographic reviewer who lives in filters, wants
year ranges and combined search, and shares her queries as bookmarked URLs. The builder
replaces two UIs she depends on daily. Without the classification we would ship that
replacement and have no way to notice we had lost her.

## What

- [ ] **Human and machine search traffic stay separable the way the 2026-H1 log separates
      them** — the same four request methods (form / link / direct / bot), comparable with the
      legacy figures.
  - *Consequence:* without it the 2.1% baseline is not computable after migration and success
    measure 2 dies — the bet loses one of its only two measures.
- [ ] **For any search request we can tell which query ran and how many results it returned**,
      from what the server already sees.
  - *Consequence:* this is the single source for field and operator usage, paste-list sizes,
    zero-result rate and OR-group usage. Without it phase 2's go/no-go has no usage evidence,
    and the decision falls back to the 2026-H1 log alone. That fallback is accepted — it is
    explicitly **not** a reason to substitute client-side tracking.
- [ ] **We can tell whether a builder session produced an artefact, and which of the three
      outputs it was** — URL, embed, or API. The three-way distinction is the product question:
      it decides which output gets resourced. A session that built conditions and left with
      nothing has to be distinguishable from one that copied.
  - *Consequence:* diagnostic only, and explicitly **not a target**. It answers "does the
    builder produce artifacts" and "which output is the product". A session that only reads the
    live count is a success with zero copies, and manual URL selection is invisible — so this
    can never be scored.

Privacy, all three: no cookies, no user identifiers, no third-party trackers, aggregate only.
Query text and session ids are personal data — retention and aggregation per the DPO rules.
Where a question is answerable from what the server already sees, it is not re-collected
client-side.

## Acceptance criteria

- [ ] The power-tier share of human searches can be computed the way it was computed for
      2026-H1, so the 2.1% baseline stays comparable year over year
- [ ] Which fields and operators were authored, paste-list sizes, the share of searches
      returning zero results, and the share of built queries using an OR group are all
      derivable without client-side tracking
- [ ] We can see whether a builder session ends in an artefact, and which of the three outputs
      it was
- [ ] No cookies, no user identifiers and no third-party requests from the page; DPO sign-off
      on retention and on any stored query text
- [ ] `make build` passes

## For orientation, not binding

The route product assumed was possible. It is here to help estimate, and nothing in it is a
requirement — if a cheaper route satisfies the acceptance criteria above, take it:
request-classification middleware; the result count carried on the search request log; three
cookieless, aggregate-only events (`builder_started`, `builder_copy` with a `tab` property,
`builder_save`) on a tool of that class (Plausible: daily-rotating visitor salt, EU, open
source, self-hostable).

Ownership: product owns why and what (`PLAN-measurement.md` — "only four constraints, not
instructions"); identifiers, event shape, log fields, sampling, storage and retention are
engineering's.

## Out of scope

- The legacy-query translator and the golden-set launch gate — separate workstream, its
  requirements list is subset B of `QUERY-BUILDER-GOLDEN-SET.md`.
- Journey stitching across surfaces, and the deposit / simple-search questions in
  `PLAN-measurement.md`. This issue is that plan's builder-specific instance, not the platform
  plan.
- Any UI. Nothing here is visible to a user.
- The zero-result **recovery** trace. `REPORT-search-log-analysis.md` proposes a correlation id
  linking a failed query to what the user did next; the design doc drops it as machinery
  disproportionate to the answer — the zero-result rate alone is enough for design feedback.
  Don't build it from the report.

## Dependencies

- The three builder events need the Advanced search page to exist. The classification and the
  query-plus-count record do not, and are worth landing first: they define the baseline the
  page is measured against.

## Open questions

- **Analytics hosting** — self-hosted or EU cloud, and who signs off with the DPO. Both are
  acceptable to product. (Team + DPO call.)
- **Bot classification** — reuse the legacy log's bot rule, or the new stack's own detection?
  The two must produce comparable numbers, and only the legacy rule is auditable against
  2026-H1. (Dev + product call.)

> No screenshot — backend.

Source: `docs/WIP/QUERY-BUILDER-BET.md`, `docs/WIP/QUERY-BUILDER-DESIGN.md` § What we need to
measure, `notes/PLAN-measurement.md`.
