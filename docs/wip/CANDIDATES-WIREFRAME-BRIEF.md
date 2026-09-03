# Candidates — HTML wireframe brief

Prototype Candidates. Label Raven unknowns as stubs.

## Read first

`AGENTS.md` · [bet](CANDIDATES-BET.md) · [breadboard](CANDIDATES-BREADBOARD.md) ·
[DD-003](../decisions/DD-003-candidate-review-is-a-focused-round.md) ·
[domain vocabulary](../DOMAIN-VOCABULARY.md) · [domain context](../DOMAIN-CONTEXT.md) ·
[class usage](../CLASS-USAGE.md) · [search and filtering](../SEARCH-AND-FILTERING.md) ·
[work cards](../../patterns/work-card.html) · [facets](../../patterns/facets.html) ·
[pagination](../../patterns/pagination.html) · [kit pages](../KIT-PAGES.md).

## Prototype artifacts

1. Preserve **Added for you**, Connect ORCID and Recent activity. Found and Incomplete
   keep compact Work cards and show at most three; the Found count is every pending
   match.
2. Dashboard Found section: **View all** link, primary **Review N research outputs**,
   quiet **Review** on every candidate card. Titles open the overview at their
   candidate without changing it. Remove the review-history button.
3. Rebuild `candidate-review.html` as the Found for you overview on the filter-first
   backoffice shell: a search field that narrows within the list, status filter (New,
   Skipped, Added, Rejected; New and Skipped selected by default), source, publication
   year and faculty filters (faculty: multi-select with search, on the record's
   credited organizations), pagination, count that names the entity. Applied filters
   render as the public-works split chips. New
   and Skipped cards are full candidate cards with source, match evidence, **Review**
   and **Reject**; a Skipped card says it was skipped. Added cards show the Work's own
   status with **Resume** or **View**. Rejected cards offer **Undo**. Delete
   `candidate-history.html` and every reference to it.
4. Add `candidate-focused-review.html` with round and single states. Identity summary
   as a compact Work card; only the missing fields — a credited organization the
   source supplied is not re-asked, and when it supplied none the researcher's
   current affiliation is offered as a visible suggestion with a one-action Add,
   never preselected. When nothing is missing the page shows the identity, the
   imported fields and the decisions alone. A read-only
   disclosure of the imported fields; primary **Submit publicly** as a split button
   whose one alternative is **Submit privately**, then **Save draft**, **Reject**,
   **Skip**, and the quiet link **Edit the full record**; Back to the opening place.
   Skip is available in both modes; in single mode it returns to the opening place. Do
   not reuse the deposit stepper or `deposit.html`. The interface carries no
   explanation copy; how the submit consequence becomes clear is an open pattern
   question, kept as a source-local note.
5. Typed values are remembered in the browser per candidate: Back, refresh and
   return restore them; every decision clears them; nothing is claimed. No
   unsaved-changes prompt or dialog. Raven implements the memory; the prototype
   describes it in a source-local note and builds nothing.
6. The round's last decision returns to the dashboard: a confirmation states the
   round's decision totals, and the dashboard sections say what remains.
7. No Reject-reason control; a source-local prototype note keeps the question open.
   No Pending-request controls or status anywhere in Candidates.

## State inventory

| Surface | State | Must make visible |
|---|---|---|
| Dashboard | Added/Found/both/neither | Counts, direct actions, existing regions |
| Overview | Default, filtered, empty | Search, filters, entity count, cards per status, results bar |
| Overview | Action success/failure | Announcement, Undo or Retry; preserved order and count |
| Overview | Claimed elsewhere | Card removed, announcement says a co-author or the Biblio team added it, no Undo |
| Focused | Round pending, nothing missing, single | Position and remaining (round only), identity, researcher fields, disclosure |
| Focused | Action failed | Preserved values; the header actions retry |
| Focused | Claimed elsewhere, on open or on Submit | No form; a submitted claim says the Work sits under the researcher's research output, another owner's draft says it appears there once submitted; Next candidate |
| Dashboard | After a round | Confirmation of the round's decisions; the sections carry what remains |

## Reusable kit coverage

| Part | Canonical page | Work needed |
|---|---|---|
| Full and compact Work card | `patterns/work-card.html` | Compact candidate: **Review**; full candidate: **Review**, **Reject**, skipped marker; Added and Rejected examples |
| Added activity row | `patterns/activity-rows.html` | Keep dashboard and kit examples synced |
| Facets and pagination | `patterns/facets.html`, `patterns/pagination.html` | Reuse; add a status example only when none fits |
| Split button | `elements/buttons.html` | Add one example: default action plus one alternative |

Focused review composes existing parts; add kit coverage only for changed reusable
components.

## Interaction, responsive and accessibility rules

- Lists use `ol.list-unstyled`, one `li` and one `article[aria-labelledby]` per Work.
- After a decision, focus the next candidate or list heading. Announce action, Undo
  availability and remaining count without stealing focus.
- Titles stay non-mutating. Actions have title-qualified accessible names.
- Focused review is a routed page with one URL per candidate, not a dialog; Back,
  refresh and recovery remain predictable.
- Let labels and metadata wrap. Verify desktop, split-screen and 375 px without
  horizontal scrolling or hidden actions.

## Boundaries

Do not design feed connection, source comparison, weak or unlinked matches, curator
inbox, proxy, bulk review, duplicate resolution or Pending requests. Use placeholder
data.

## Ready for review when

Every control reaches a state, reusable parts have live kit coverage, documented
classes and icons are used, and `npm test` passes. Inspect wide and narrow, run the
accessibility pre-flight and record missing screen-reader testing. Wait for acceptance
before Raven issues.
