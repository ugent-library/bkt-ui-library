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
┌ Added for you (3) ────────────────────┐
│ System-added · Plato                  │
│ Self-healing polymer… (2026)         │
│ 2 fields missing                     │
│ [Complete]  View                     │
│                                      │
│ Added by Biblio team                  │
│ Coastal adaptation dataset… (2025)   │
│ [Complete]  View                     │
│                                      │
│ Not yours? Email biblio@ugent.be     │
└──────────────────────────────────────┘

┌ Found for you (12) ──────────────────┐
│ Soft actuator design… (2026)         │
│ Polymer network mode… (2025)         │
│ …                                    │
│                                      │
│ [ Review 12 research outputs ]       │
│                                      │
│ Reviewed (5)                         │
└──────────────────────────────────────┘
```

Added for you adapts the existing Added on your behalf region. It contains Plato
imports and curator-added Works, names the source or actor, and leads with
**Complete**; **View** is secondary. Only automated imports carry the system-added
marker. The helpdesk mailto identifies the Work in its subject or body. Reporting does
not change the record in Biblio. Reviewed opens claimed and rejected history.

## Review view

```
┌ Found for you ────────────────────────┐
│ ‹ Dashboard                  12 left  │
├──────────────────────────────────────┤
│                                      │
│ Candidate source · placeholder       │
│                                      │
│ Journal article · 2026               │
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

Review and add is the primary action. Reject is secondary; Skip is visually quiet.
After submit, the interstitial offers the next candidate and the dashboard. Leaving
the deposit returns through Incomplete work instead.

Previous card, rejected:

```
┌ Found for you ────────────────────────┐
│ ‹ Dashboard                  11 left  │
├──────────────────────────────────────┤
│ ‹ Previous                    Next ›  │
│                                      │
│ Rejected · [Undo]                    │
│                                      │
│ Candidate source · placeholder       │
│ Journal article · 2026               │
│ Soft actuator design for grip        │
│ J. Ito, K. De Vos, M. Okafor         │
│ DOI 10.1234/ps.2026.0117             │
└──────────────────────────────────────┘
```

A claimed card shows **Draft · Resume** until submission, then **Submitted · View**.

## Review complete

```
┌ Review complete ──────────────────────┐
│ 9 claimed · 2 rejected · 1 skipped   │
│                                      │
│ [Dashboard]                          │
└──────────────────────────────────────┘
```

The skipped Work and any new arrivals form the next round.

## Reviewed history

```
┌ Reviewed ─────────────────────────────┐
│ ‹ Dashboard                           │
├──────────────────────────────────────┤
│ Claimed (3)                           │
│ • Self-healing polymer… · Draft       │
│   Resume                              │
│ • Polymer network mode… · Submitted  │
│   View                                │
│                                      │
│ Rejected (2)                          │
│ • Soft actuator design… (2026)        │
│   [Undo]                              │
└──────────────────────────────────────┘
```

Undo returns the Work to Found for you. Empty dashboard sections are omitted; Reviewed
remains available while history exists.
