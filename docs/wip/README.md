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

## Query builder (Advanced search) — phase-1 revision

One visual builder replacing Advanced and Expert search. **Reading order for a first review:**

**Stage:** Phase-1 prototype revision on `feature/query-builder-phase-1`; the filed
Raven issues own implementation.
**Accepted:** Prototype and issue set filed as Raven #223–#230, plus the phase-2
placeholder #295. The backoffice field set is phase 2 (fields TBD); OR groups are
phase 3 (#230).
**Blocking:** Ownership audit before deleting the legacy drafts.
**Next:** Move remaining live facts to their owners and remove this WIP entry. The
field contract is promoted out of `docs/wip/`, not deleted.

1. [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md) — the proposal: problem, capability,
   definition of done, risks. Start here; it is one page.
2. [`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md) — the field ledger:
   which fields each surface offers, with their labels, operators and inputs.
3. [`QUERY-BUILDER-MEASUREMENT.md`](QUERY-BUILDER-MEASUREMENT.md) — what we measure and why.
4. Raven #223–#230 and #295 own the implementation scope. The local issue copies
   were deleted after filing.

Supporting material, read as needed:

- [`QUERY-BUILDER-LEGACY-COVERAGE.md`](QUERY-BUILDER-LEGACY-COVERAGE.md) — translator context:
  the legacy names each field covers, the folds and the drops. Not a specification.
- [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) — 194 acceptance cases (all
  values are fixtures), the gate for "every existing query keeps working". The numbers behind
  it: [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md).
- [`QUERY-BUILDER-OR-GROUPS.md`](QUERY-BUILDER-OR-GROUPS.md) — the group: how a row becomes
  an alternative, and which queries need it.

Two documents these reference live in `notes/`, which is not in the repository:
`PLAN-measurement.md` (the house measurement standard, product-owned) and
`REPORT-search-log-analysis.md` (the base search-log analysis). Ask if you need them.

## Review & curation flow — flow wireframes

The review flow of the next Biblio: analysis, email notifications and
high-level flow wireframes. The analysis and its actor-level breadboards
precede the bet and per-screen breadboards by design.

**Stage:** Flow wireframes (pre-bet)
**Accepted:** The [current review decisions](REVIEW-FLOW-ANALYSIS.md#current-review-decisions--baseline-revision-pending)
revise the baseline: Request changes for missing information, Return/withdraw for
exclusion, curator corrections, curator-controlled consolidation, whole-record review
with all questions and current values on one screen, and no Undo.
The two email cadences and proxy grouping are provisionally accepted
([`EMAIL-NOTIFICATIONS-ANALYSIS.md`](EMAIL-NOTIFICATIONS-ANALYSIS.md)).
**Blocking:** Curator rounds and researcher action on Return/withdraw remain open;
Raven must resolve exclusion on re-entry. These do not prevent representative examples.
**Next:** Align the baseline, dependent guides and prototype with the Return/withdraw
and consolidation decisions before design acceptance.

1. [`REVIEW-FLOW-ANALYSIS.md`](REVIEW-FLOW-ANALYSIS.md) — the baseline:
   model, rail, actor flow breadboards, Raven dependencies, assumptions and
   open questions.
2. [`EMAIL-NOTIFICATIONS-ANALYSIS.md`](EMAIL-NOTIFICATIONS-ANALYSIS.md) —
   cadence, digest shape, the setting.
3. [`REVIEW-FLOW-WIREFRAME-BRIEF.md`](REVIEW-FLOW-WIREFRAME-BRIEF.md) —
   the build brief for `templates/review-flow/`.

## Other active design work

- [`epics/`](epics/README.md) — epic proposals grouping the toplan with the open GitHub
  issues (2026-09-17). Order is not priority.
- [`ENTITY-PICKERS.md`](ENTITY-PICKERS.md) — organization and project picker questions.
- [`WORK-CARD-HANDOFF.md`](WORK-CARD-HANDOFF.md) — work-card decisions and remaining work.
