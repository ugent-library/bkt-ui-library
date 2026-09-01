# Candidates — HTML wireframe brief

Prototype the backoffice flow, Phase 1A before Phase 1B; label unknowns as stubs.

## Read first

`AGENTS.md` · [bet](CANDIDATES-BET.md) · [flow](CANDIDATES-FLOW.md) ·
[DD-003](../decisions/DD-003-candidate-review-is-preview.md) ·
[domain vocabulary](../DOMAIN-VOCABULARY.md) ·
[domain context](../DOMAIN-CONTEXT.md) · [surfaces](../SURFACES.md) ·
[kit pages](../KIT-PAGES.md).

## Prototype artifacts

1. Adapt **Added on your behalf** for Phase 1A; replace the annotated **Suggestions**
   block for Phase 1B. Do not create duplicate dashboard sections.
2. Add `candidate-review.html` for one-by-one review states.
3. Add `candidate-history.html` for claimed/rejected history.
4. Add direct-added and claimed researcher-output states. Link **Review and add** to
   the existing prefilled deposit.
5. Inventory every reusable part used. Link or extend its existing kit page; create
   and register one only when no canonical example exists. Related patterns may share
   a page.

Preserve unrelated blocks, including **Connect ORCID**; only these regions are in
scope.

## State inventory

| Surface | State | Must make visible |
|---|---|---|
| Dashboard | Added only | Adapted region; source/actor, state, Complete, View, Not yours? |
| Dashboard | Found only | Titles, remaining count, Review, Reviewed history |
| Dashboard | Both | Completion work clearly precedes candidate review |
| Dashboard | Neither | Candidate sections omitted; existing empty state |
| Review | Pending | Full metadata, source and match; Review and add, Reject, Skip; no Preview |
| Review | Action failed | Card and count preserved; named error, Retry |
| Review | Claimed elsewhere | Resulting Work link; continue the round |
| Review | Previous decision | Rejected/Undo; draft/Resume; submitted/View |
| Review | Complete | Decision totals; Dashboard |
| History | Mixed | Claimed/rejected groups; Resume, View, Undo |
| Research output | Direct-added | Public/reviewed and private/draft variants; source/actor, automated marker |
| Research output | Claimed | Draft with Resume and submitted Work with View |

## Interaction and responsive rules

- **Review and add** is the primary review action. Keep **Reject** and **Skip**
  subordinate. Keep labels intact at narrow widths by wrapping or stacking actions.
- Opening **Review** or a title changes nothing. Back, refresh and returning from
  deposit preserve the round.
- Keep the status region in the initial DOM. After an action, focus the replacement's
  first meaningful element. Use `role="status"` for confirmation and `role="alert"`
  for blocking errors.
- Candidate cards are list items with `article[aria-labelledby]` and a non-heading
  title. Use real links or buttons and title-qualified row-action names.
- Verify normal desktop, narrow split-screen and 375 px without horizontal scrolling.

## Boundaries

Do not design source-precedence controls, source retrieval or comparison, weak or
unlinked matches, a curator inbox, feed connection, proxy or bulk review, or duplicate
resolution. Use Plato imports and curator-added Works for Added for you. Label data
as placeholder.

## Ready for review when

Every state is selectable, has canonical kit coverage, uses documented classes and
icons, passes `npm test`, and is inspected wide and narrow. Run the accessibility
pre-flight and record when screen-reader testing was not performed. Wait for prototype
acceptance before writing Raven issues.
