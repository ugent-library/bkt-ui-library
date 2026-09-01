# Candidates — HTML wireframe brief

Prototype Phase 1A, then Phase 1B. Stub unknowns.

## Read first

`AGENTS.md` · [bet](CANDIDATES-BET.md) · [flow](CANDIDATES-FLOW.md) ·
[DD-003](../decisions/DD-003-candidate-review-is-preview.md) ·
[domain vocabulary](../DOMAIN-VOCABULARY.md) · [domain context](../DOMAIN-CONTEXT.md) ·
[class usage](../CLASS-USAGE.md) · [work cards](../../patterns/work-card.html) ·
[kit pages](../KIT-PAGES.md).

## Prototype artifacts

1. Rename right-column **Added on your behalf** **Added for you**; preserve its
   activity position and density.
2. Replace **Suggestions** with Found for you; remove its dashboard **Review &
   confirm** and **View all**.
3. Add `candidate-review.html` and `candidate-history.html`.
4. **Review and add** opens prefilled `deposit-1-1-find.html`. Add direct-added and
   claimed output states; Added **View all** opens their list.
5. Preserve unrelated regions, including **Connect ORCID** and Recent activity.

## State inventory

| Surface | State | Must make visible |
|---|---|---|
| Dashboard | Added | Activity; time, provenance, title, conditional Complete, View all |
| Dashboard | Found | Up to 3 compact Work cards, total count, Review, history |
| Dashboard | Both | Compact cards in Found/Incomplete; Added stays secondary |
| Dashboard | Neither | Candidate sections omitted; existing empty state |
| Review | Pending | Work card; metadata, source, match and decisions |
| Review | Action failed | Preserve card/count; error and Retry |
| Review | Claimed elsewhere | Resulting Work; continue |
| Review | Previous decision | Rejected/Undo; draft/Resume; submitted/View |
| Review | Complete | Decision totals; Dashboard |
| History | Mixed | Claimed/rejected; Resume, View, Undo |
| Research output | Direct-added | Work cards; draft/reviewed; provenance; report on Work |
| Research output | Claimed | Work cards; draft/Resume and submitted/View |

## Reusable kit coverage

| Part | Canonical page | Work needed |
|---|---|---|
| Work card | `patterns/work-card.html` | Show compact and full states |
| Added activity | Existing dashboard | Add kit coverage only if extracted |

## Interaction, responsive and accessibility rules

- Found and Incomplete use documented compact Work cards; Added is not a card list.
- Render at most three per dashboard section; counts show totals.
- Compact reduces spacing and optional detail, not the card's semantic anatomy. Add
  its SCSS and kit example before using it.
- No bespoke rows/wrappers. Compact year and venue are `bt-work-card__meta-item`
  siblings, never decorative bullets.
- Dashboard **Review** and titles open full review without mutation. **Review and add**
  opens the deposit. Added **View all** opens the direct-added list.
- Remove inert/out-of-scope controls and `href="#"`.
- Preserve the round on back/refresh. Manage focus; announce results and errors.
- Work-card lists use the documented list wrapper and `article[aria-labelledby]`;
  actions have title-qualified accessible names.
- Verify desktop, split-screen and 375 px without horizontal scrolling.

## Boundaries

Do not design source comparison, weak or unlinked matches, a curator inbox, feed
connection, proxy or bulk review, or duplicate resolution. Use placeholder data.

## Ready for review when

Every control works, reusable parts have kit coverage, documented classes/icons and
`npm test` pass. Inspect wide/narrow, run accessibility pre-flight and record missing
screen-reader testing. Wait for acceptance before Raven issues.
