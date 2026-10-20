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

## Standard public search — redesign direction

**Stage:** Direction accepted; interface design pending.
**Accepted:** [DD-008](../decisions/DD-008-public-search-and-builder-separate-design-scopes.md):
the standard search page will be reworked as a separate interface problem from
Advanced search. Both preserve the same query meaning. Current guide rules remain
the baseline until replacement designs are accepted.
**Blocking:** Filter arrangement, labels, period presets and defaults are not decided.
These belong to this redesign.
**Next:** Review the standard search interface, coordinating its entry and return paths
with the accepted Advanced search prototype.

Candidates retained for that review, not accepted choices:

- Open content, type and period directly visible; record filters and language under
  More filters; one desktop filter area versus the current sidebar/Add-filter split.
- Relative period presets plus a custom range; exact labels and periods remain open.
- Open content opt-in (proposed), default filtering or ranking higher. The domain
  guide's OA default applies to deposit, not search; no search-policy approval
  dependency has been established.

Earlier plans do not approve a new layout or enlarge the builder scope.

## Query builder — backoffice V1 and future directions

**Stage:** Backoffice scope proposal. Public V1 design and kit are accepted; its Raven
issues have been updated.
**Accepted:** [DD-006](../decisions/DD-006-query-builder-v1-replaces-power-search.md)
sets the public V1 boundary. [DD-008](../decisions/DD-008-public-search-and-builder-separate-design-scopes.md)
keeps the standard search redesign separate.
**Blocking:** Backoffice V1 fields and value limits remain undecided
([Raven #295](https://github.com/ugent-library/raven/issues/295)).
**Next:** Scope the first useful backoffice release from curator tasks. Public V2 is
not scoped; the `explore-*` prototype states retain future directions.

- [Public V1 bet](QUERY-BUILDER-BET.md) — accepted design context and success criteria.
- [Field reference](QUERY-BUILDER-FIELD-CONTRACT.md) — public V1 fields, backoffice
  proposals and fields beyond V1.
- [Evidence](QUERY-BUILDER-EVIDENCE.md) — historical query analysis and curator tasks.
- [Golden set](QUERY-BUILDER-GOLDEN-SET.md) and [legacy coverage](QUERY-BUILDER-LEGACY-COVERAGE.md)
  — test fixtures and translator context.
- [OR groups](QUERY-BUILDER-OR-GROUPS.md) — future exploration, outside public V1.

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
