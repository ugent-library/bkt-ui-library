# Work in progress

Shared drafts — visible to the team, not yet contracts. Each file either graduates to `docs/`
when it stabilises, or is deleted when the work lands.

## Candidates — for review

Two source-trust routes for harvested research output. Read in this order:

1. [`CANDIDATES-BET.md`](CANDIDATES-BET.md) — the problem, phased release,
   boundaries, measures and backend questions.
2. [`CANDIDATES-FLOW.md`](CANDIDATES-FLOW.md) — review-round behavior and
   wireframes for Found for you and Added for you.
3. [`CANDIDATES-WIREFRAME-BRIEF.md`](CANDIDATES-WIREFRAME-BRIEF.md) — HTML prototype
   artifacts, state inventory, boundaries and review gate.

The flow supersedes the candidate block in `templates/biblio-researcher/dashboard.html`.
That fixture stays in place only until the candidate draft is accepted and rebuilt.

## Query builder (Advanced search) — for review

One visual builder replacing Advanced and Expert search. **Reading order for a first review:**

1. [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md) — the proposal: problem, capability,
   definition of done, risks. Start here; it is one page.
2. [`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md) — the field ledger:
   which fields each surface offers, with their labels, operators and inputs.
3. [`QUERY-BUILDER-MEASUREMENT.md`](QUERY-BUILDER-MEASUREMENT.md) — what we measure and why.
4. `QUERY-BUILDER-ISSUE-*` — the implementation issues, filed as
   [raven #223](https://github.com/ugent-library/raven/issues/223) (the epic) with children
   #224–#230; the drafts stay until the work lands. Start at
   [`ISSUE-00-EPIC`](QUERY-BUILDER-ISSUE-00-EPIC.md), which names the children and the order
   they land in. [`ISSUE-01`](QUERY-BUILDER-ISSUE-01-measurement.md) (#224) goes to the lead
   developer as a conversation first. Every **Screenshot** callout names its capture in
   [`screenshots/`](screenshots/), numbered by the issue that calls for it
   (`02-field-chooser.png`); each is embedded in its filed issue. The epic's overview shot
   (`00-builder-over-results.png`) serves issues 02 and 05 as well.

Supporting material, read as needed:

- [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) — 194 acceptance cases (all
  values are fixtures), the gate for "every existing query keeps working". The numbers behind
  it: [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md).
- [`QUERY-BUILDER-OR-GROUPS.md`](QUERY-BUILDER-OR-GROUPS.md) — the group: how a row becomes
  an alternative, and which queries need it.

Two documents these reference live in `notes/`, which is not in the repository:
`PLAN-measurement.md` (the house measurement standard, product-owned) and
`REPORT-search-log-analysis.md` (the base search-log analysis). Ask if you need them.

## Other active design work

- [`ENTITY-PICKERS.md`](ENTITY-PICKERS.md) — organization and project picker questions.
- [`WORK-CARD-HANDOFF.md`](WORK-CARD-HANDOFF.md) — work-card decisions and remaining work.
