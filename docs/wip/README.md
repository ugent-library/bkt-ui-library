# Work in progress

Shared drafts — visible to the team, not yet contracts. Active features record the
stage, accepted direction, blockers and next deliverable defined by
[`FEATURE-WORKFLOW.md`](../FEATURE-WORKFLOW.md). At issue handoff, live facts move to
their owners and the feature's temporary drafts and WIP entry are deleted.

## Candidates — for review

Two source-trust routes for harvested research output. Read in this order:

**Stage:** Prototype and kit
**Accepted:** [DD-003](../decisions/DD-003-candidate-review-is-a-focused-round.md):
filtered, paginated Found for you overview that holds the history; focused one-at-a-time
review rounds; **Review** per card, **Submit publicly** or **Submit privately**
completes; the Work is claimed on the first persisted action. Lightweight **Added for
you** activity.
**Blocking:** None for prototyping; Raven questions remain labelled stubs. Reject-reason
capture stays an open product question.
**Next:** Human design acceptance of the rebuilt prototype and kit coverage, then
Raven issue drafting.

1. [`CANDIDATES-BET.md`](CANDIDATES-BET.md) — the problem, phased release,
   boundaries, measures and backend questions.
2. [`CANDIDATES-BREADBOARD.md`](CANDIDATES-BREADBOARD.md) — places, affordances and
   wiring for the overview, focused review and Added for you behavior.
3. [`CANDIDATES-WIREFRAME-BRIEF.md`](CANDIDATES-WIREFRAME-BRIEF.md) — HTML prototype
   artifacts, state inventory, boundaries and review gate.

Found for you has replaced Suggestions on the dashboard. `candidate-review.html`
becomes the overview, `candidate-focused-review.html` is new and
`candidate-history.html` is deleted. Pending requests are a separate future workflow
(`docs/DOMAIN-VOCABULARY.md`, “Accepted value and pending request”), not part of
Candidates.

## Query builder (Advanced search) — handed off, cleanup pending

One visual builder replacing Advanced and Expert search. **Reading order for a first review:**

**Stage:** Issue handoff cleanup
**Accepted:** Prototype and issue set filed as Raven #223–#230.
**Blocking:** Ownership audit before deleting the legacy drafts.
**Next:** Move any live facts to their owners, delete local drafts and remove this WIP
entry. Raven issues own implementation.

1. [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md) — the proposal: problem, capability,
   definition of done, risks. Start here; it is one page.
2. [`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md) — the field ledger:
   which fields each surface offers, with their labels, operators and inputs.
3. [`QUERY-BUILDER-MEASUREMENT.md`](QUERY-BUILDER-MEASUREMENT.md) — what we measure and why.
4. `QUERY-BUILDER-ISSUE-*` — local copies of the implementation issues, filed as
   [raven #223](https://github.com/ugent-library/raven/issues/223) (the epic) with children
   #224–#230. These copies are pending handoff cleanup. Start at
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
