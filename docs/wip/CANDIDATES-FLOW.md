# Candidates — flow and wireframes

Draft companion to [CANDIDATES-BET.md](CANDIDATES-BET.md). All names, titles,
counts and identifiers below are invented placeholder data.

## Flow

```
Dashboard
  Found for you (12)
  [ Review 12 research outputs ]
        │
        ▼
  REVIEW ROUND: the remaining count only goes down
  skipped candidates and new arrivals appear in the next round
  current card is included in "n left"
  leaving and returning resumes this round
        │
        ├─ Review and add ─► claim existing Work as researcher draft
        │                       │
        │                       ├─ submit ─► Submitted ─► Next
        │                       └─ leave ──► Incomplete work [Resume]
        │
        ├─ Reject ──────────► remove this match; keep Work; Next
        │                       └─ Reviewed history [Undo]
        │
        └─ Skip ────────────► hold for next review round; Next

  0 left ─► Review complete
             claimed · rejected · skipped
             [Dashboard]

Next round = skipped records + candidates that arrived during this round.
```

Interaction rules:

- The count includes the displayed card: **Review 12** opens at **12 left**. Every
  decision reduces it by one. There is no position index such as “3 of 12.”
- Each candidate has its own URL. Back and refresh return to the same card. Leaving
  the flow preserves the round and the next undecided card.
- **Review and add** claims the existing Work before opening the deposit. The Work
  leaves Found for you immediately. If the researcher leaves the deposit, it appears
  under Incomplete work with **Resume**; it is not skipped.
- After one researcher claims a shared Work, matched co-authors no longer receive it
  as a candidate. They see the resulting Work in their research output.
- Reject applies without confirmation and affects only this match. Previous cards
  show the decision; **Undo** returns a rejected card to review and raises the count.
- Skip exists only inside the review. It cannot return during the same round.
  Candidates arriving mid-round also wait for the next round.
- A failed action keeps the current card and count. The error names the failed action
  and offers retry. If another person claimed it first, the card links to that Work
  and the round continues.
- Loading the next card moves focus to the replacement review region's first
  meaningful element. A status message announces the decision and remaining count.

### The review is the preview

The dashboard has no separate **Preview** action. **Review** opens the first full
candidate card; selecting a dashboard title opens that candidate in the same review
flow. Opening either route is non-mutating. Only **Review and add**, **Reject** and
**Skip** change state.

This replaces the previous dashboard-row design, where Preview separated full detail
from Import. The one-by-one review now owns both context and decisions. Keeping one
path removes a competing action and keeps completion beside the metadata and match
evidence needed to decide. [DD-003](../decisions/DD-003-candidate-review-is-preview.md)
records the rationale and revisit signal.

## Dashboard sections

```
┌ Added for you (recent activity) ─────┐
│ 2h ago  Biblio assistant via Plato   │
│ Self-healing polymer…                │
│ Needs completion  Complete           │
│                                      │
│ 6d ago  Added by Marie Curator       │
│ Coastal adaptation dataset…          │
│                              View all│
└──────────────────────────────────────┘

Found for you (12)  [Review 12 research outputs]
<ol>
  <li><article class="bt-work-card">…</article></li>
  <li><article class="bt-work-card">…</article></li>
  <li><article class="bt-work-card">…</article></li>
</ol>
Review history (5)

Incomplete work (4)  [View all]
<ol>
  <li><article class="bt-work-card">…</article></li>
  <li><article class="bt-work-card">…</article></li>
  <li><article class="bt-work-card">…</article></li>
</ol>
```

Added for you preserves the position, density and activity-feed character of the
existing Added on your behalf region. It does not become a main-column action queue.
An entry names the source or actor and links its title to the Work. Only automated
imports carry the system-added marker. A Work that needs researcher input shows its
state and a quiet **Complete** link; the strong completion action also lives under
Incomplete work. A reviewed or submitted Work has no completion action. **Not yours?**
lives on the Work's own view and on the completion form, not on the row; it identifies
the Work in a helpdesk email and changes nothing in Biblio. **View all** opens the
direct-added state in My research output.

Found for you replaces the old Suggestions block. The dashboard **Review** action and
candidate titles open the full, non-mutating review view; there is no dashboard
**Review & confirm** or **View all** action. Review history opens claimed and
rejected candidates. The section is a heading and an accessible list of canonical
`bt-work-card` articles, not bespoke rows inside one Bootstrap card. Incomplete work
uses the same grammar. On the dashboard both lists use the documented compact
Work-card variant and render at most the first three Works in the server-provided
order; the section count remains the total. Compactness reduces spacing and optional
dashboard detail, not the card's semantic regions. The existing Work-card kit page
demonstrates both Incomplete and candidate compact states. Incomplete **View all**
opens the complete list when more exist; Found for you's **Review** covers its full
round. Do not concatenate metadata with literal middle dots; use the card's existing
metadata elements and separators. In compact cards, year and venue are sibling
`bt-work-card__meta-item` values; do not use a compound `bt-work-card__pub` line or a
decorative separator span. Full lists and review views keep the full card.

## Review view

```
┌ Found for you ────────────────────────┐
│ ‹ Dashboard                  12 left  │
├──────────────────────────────────────┤
│                                      │
│ Candidate source (placeholder)       │
│                                      │
│ Journal article                      │
│ 2026                                 │
│ Self-healing polymer networks        │
│ for soft robotics                    │
│                                      │
│ J. Ito, K. De Vos, M. Okafor         │
│ Matched through your linked identity │
│                                      │
│ Polymer Science                      │
│ DOI 10.1234/ps.2026.0142             │
│                                      │
│ [Review and add]  [Reject]     Skip  │
└──────────────────────────────────────┘
```

The full candidate uses the established backoffice Work-card anatomy and visual
hierarchy, extended only with source, match evidence and candidate actions. It does
not introduce a second card grammar. **Review and add** is the primary action and
opens the existing prefilled deposit flow. Reject is secondary; Skip is visually
quiet. After submit, the interstitial offers the next candidate and the dashboard.
Leaving the deposit returns through Incomplete work instead.

Previous card, rejected:

```
┌ Found for you ────────────────────────┐
│ ‹ Dashboard                  11 left  │
├──────────────────────────────────────┤
│ ‹ Previous                    Next ›  │
│                                      │
│ Rejected  [Undo]                     │
│                                      │
│ Candidate source (placeholder)       │
│ Journal article                      │
│ 2026                                 │
│ Soft actuator design for grip        │
│ J. Ito, K. De Vos, M. Okafor         │
│ DOI 10.1234/ps.2026.0117             │
└──────────────────────────────────────┘
```

A claimed card shows **Draft** with **Resume** until submission, then **Submitted**
with **View**.

## Review complete

```
┌ Review complete ──────────────────────┐
│ 9 claimed                            │
│ 2 rejected                           │
│ 1 skipped                            │
│                                      │
│ [Dashboard]                          │
└──────────────────────────────────────┘
```

The skipped Work and any new arrivals form the next round.

## Review history

```
┌ Review history ───────────────────────┐
│ ‹ Dashboard                           │
├──────────────────────────────────────┤
│ Claimed (3)                           │
│ Self-healing polymer…                │
│ Draft  Resume                        │
│ Polymer network mode…                │
│ Submitted  View                      │
│                                      │
│ Rejected (2)                          │
│ Soft actuator design… (2026)         │
│ [Undo]                               │
└──────────────────────────────────────┘
```

Undo returns the Work to Found for you. Empty dashboard sections are omitted; Review
history remains available while history exists.

## Prototype navigation contract

- Added for you title → Work detail; **Complete** → Work edit; **View all** → the
  direct-added My research output state.
- Found for you **Review** → first pending candidate; a title → that candidate.
- Candidate **Review and add** → the existing prefilled deposit; **Reject**, **Skip**
  and **Undo** → their documented prototype states.
- Reviewed → candidate history; **Resume** and **View** → the resulting Work.
- Every visible control reaches a reviewable HTML state. Remove a control when its
  destination is outside the prototype; do not leave `href="#"` or an inert button.
