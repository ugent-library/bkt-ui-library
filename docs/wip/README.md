# Work in progress

Shared drafts — visible to the team, not yet contracts. Each file either graduates to `docs/`
when it stabilises, or is deleted when the work lands.

## Query builder (Advanced search) — for review

One visual builder replacing Advanced and Expert search. **Reading order for a first review:**

1. [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md) — the proposal: problem, capability,
   definition of done, risks. Start here; it is one page.
2. [`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md) — the field ledger:
   which fields each surface offers, with their labels, operators and inputs.
3. [`QUERY-BUILDER-MEASUREMENT.md`](QUERY-BUILDER-MEASUREMENT.md) — what we measure and why.
4. `QUERY-BUILDER-ISSUE-*` — the implementation issues. Drafted, none filed. Start at
   [`ISSUE-00-EPIC`](QUERY-BUILDER-ISSUE-00-EPIC.md), which names the children and the order
   they land in. [`ISSUE-01`](QUERY-BUILDER-ISSUE-01-measurement.md) goes to the lead developer
   as a conversation first. Every **Screenshot** callout names its capture in
   [`screenshots/`](screenshots/), numbered by the issue that calls for it
   (`02-field-chooser.png`); attach them when filing. The epic's overview shot
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
