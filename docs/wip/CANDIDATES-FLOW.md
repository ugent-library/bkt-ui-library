# Candidates — flow and wireframes

Draft companion to [CANDIDATES-BET.md](CANDIDATES-BET.md). All names, titles,
counts and identifiers below are invented placeholder data.

## Flow

```
Dashboard
  [ Review 12 works ]
        │
        ▼
  REVIEW QUEUE ◄────────────────┐
  next unreviewed, "n left"     │
  ‹ Previous walks this pass    │
   │                            │
   ├─ Claim ─► deposit form,    │
   │           prefilled        │
   │             │ submit       │
   │             ▼              │
   │           ┌─────────────┐  │
   │           │ Submitted ✓ │  │
   │           │ [Next (9)] ─┼──┘
   │           │ ‹ Dashboard │
   │           └─────────────┘
   ├─ Reject ─► next, n−1;
   │            ‹ Previous
   │            re-opens it
   └─ Skip ───► next, n−1;
                work stays
                unreviewed, heads
                the next batch
```

Interaction rules the drawings assume:

- There is no position index ("3 of 12"); the queue serves the next unreviewed
  candidate and shows works left in this pass. Every action drops the count.
- Each candidate has its own URL; back and refresh land on the same work, and
  ‹ Previous is the same navigation made explicit.
- No confirmation dialogs. Reject applies at once; stepping back re-opens a
  rejected or skipped card for a new decision. Undoing a reject raises the
  count again. A claimed card shows read-only — withdrawing a submission is a
  different path.
- A Reviewed history (claimed and rejected) hangs off the dashboard. Rejected
  entries carry Reclaim; claimed entries link to the work.
- Skip exists only in the review view, never on the dashboard. A skipped work
  leaves this pass and heads the next batch — queue ordering is a Raven open
  question in the bet.
- The match is shown on the contributor, marked with the connected source
  (`* ORCID`), so a wrong match is spottable before Claim.
- No explanatory copy; labels only.

## Dashboard sections

```
┌ Added for you (3) ───────────────┐
│ • Self-healing polymer… (2026)   │
│   2 fields missing               │
│   [Complete]  View               │
│ • …                              │
│                                  │
│ Not yours? biblio@ugent.be       │
└──────────────────────────────────┘

┌ Found for you (12) ──────────────┐
│ • Soft actuator design… (2026)   │
│ • Polymer network mode… (2025)   │
│ • …                              │
│                                  │
│        [ Review 12 works ]       │
│                                  │
│ Reviewed (5)                     │
└──────────────────────────────────┘
```

Added for you leads with Complete; View is secondary. "Not yours?" is a mailto
link to biblio@ugent.be. "Reviewed (5)" opens the review history.

## Review view

```
┌ Found for you ───────────────────┐
│ ‹ Dashboard             11 left  │
├──────────────────────────────────┤
│ ‹ Previous                       │
│                                  │
│ Web of Science                   │
│                                  │
│ journal_article · 2026           │
│ Self-healing polymer networks    │
│ for soft robotics                │
│                                  │
│ J. Ito, K. De Vos*, M. Okafor    │
│ * ORCID                          │
│                                  │
│ Polymer Science                  │
│ doi 10.1234/ps.2026.0142         │
│                                  │
│ [ Claim ]  [ Reject ]     Skip   │
└──────────────────────────────────┘
```

Claim and Reject are the primary pair; Skip is visually quiet. After submit,
the interstitial offers Next (n) and a way back to the dashboard.

Previous card, rejected — the decision banner replaces the action row:

```
┌ Found for you ───────────────────┐
│ ‹ Dashboard             11 left  │
├──────────────────────────────────┤
│ ‹ Previous               Next ›  │
│                                  │
│ Rejected · [ Undo ]              │
│                                  │
│ Web of Science                   │
│ journal_article · 2026           │
│ Soft actuator design for grip    │
│ J. Ito, K. De Vos*  · * ORCID    │
│ doi 10.1234/ps.2026.0117         │
└──────────────────────────────────┘
```

A claimed previous card shows the same shape with "Claimed · View work" and no
Undo.

## Reviewed history

```
┌ Reviewed ────────────────────────┐
│ ‹ Dashboard                      │
├──────────────────────────────────┤
│ Claimed (3)                      │
│ • Self-healing polymer… (2026)   │
│   View work                      │
│                                  │
│ Rejected (2)                     │
│ • Soft actuator design… (2026)   │
│   [Reclaim]                      │
└──────────────────────────────────┘
```

Reclaim puts the work back into the review queue.
