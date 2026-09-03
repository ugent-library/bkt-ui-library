# Product bet — Candidates

*Draft for ProductBoard · Evidence: [personas](../RESEARCH-PERSONAS.md),
[demand findings](../../notes/demand/FINDINGS.md), UB2030 §3.2.1 (internal plan) ·
Design: [breadboard](CANDIDATES-BREADBOARD.md) and wireframes*

## Problem

Plato automatically imports dissertations, sometimes before the final version (note
`d32a8c8b`). WoS is manual: researchers export a file and upload it; one upload
produced duplicate drafts (note `26ed1edf`). No WoS, ORCID or Crossref candidate feed
exists. Claire Searcher asks for reliable automatic inflow. Safely surfacing imports
and helping researchers finish them supports UB2030's goal to reduce manual registration.

## Solution

Raven stores harvested output as private, system-owned Work records. When several
sources identify the same Work, Raven selects one complete source record through
configured source precedence. The dashboard gains two routes.

**Found for you** lists records matched through the researcher's linked person
identity. The dashboard shows at most three candidates and the total pending count.
**View all** and the navigation item open a filtered, paginated overview; its status
filter (New, Skipped, Added, Rejected) holds the review history. **Review N
research outputs** starts a round through the New and Skipped candidates, one at a
time. New arrivals wait for the next round.

Every candidate card offers **Review**, a focused page asking only the missing or
researcher-owned fields; imported values stay available read-only. **Submit publicly**
(default) or **Submit privately** claims and submits the harvested Work. **Save
draft** and **Edit the full record** claim it as an Incomplete draft with **Resume**.
Opening, Skip and Reject never claim. Other matched co-authors stop seeing the
candidate and reach the Work once it is submitted.

**Reject** removes only this researcher's match. The record survives for curators
and co-authors; the overview offers **Undo**. **Skip** holds the record for the
next round.

**Added for you** keeps the lightweight activity region for Plato imports and
curator-added Works. Each entry names its source or actor; incomplete drafts offer
**Complete**, submitted or reviewed Works only link to their detail. **View all**
opens the direct-added My research output state. Neither route is rejectable. **Not
yours?** opens a helpdesk email to biblio@ugent.be without changing the Work.

**Phase 1A — surface existing direct additions**

- Plato imports and curator-added Works together under Added for you
- Lightweight entries name provenance, offer state-dependent completion and report
  through the helpdesk

**Phase 1B — candidate review, after the first candidate feed exists**

- Found for you overview, focused review rounds, Submit, Reject, Skip and history
- Matches through the linked person identity only

**Later:** proxy claim on behalf · bulk claim · researcher-facing duplicate flagging ·
notification cadence

## Rabbit holes

- Claim reuses the harvested Work. It must not create a second Work.
- Direct addition establishes authorship, not that every value is final or complete.

## No-gos

- Connecting candidate feeds — a dependency owned by its own bet.
- Source-precedence controls or comparison — Raven resolves at whole-record level;
  curator tooling is separate.
- No curator candidate inbox.
- Proxy candidate review — phase 1 serves researchers only.
- Duplicate detection inside researcher review — Raven's clusters and merge remain
  the curator route.
- Bulk claim — the profile may ask work-specific questions.
- Pending requests — a separate future workflow; Candidates works without it.

## How we know it works

1. **Is the record safe?** Launch gate: no candidate action deletes harvested data,
   every rejection is recoverable, and a claim creates zero duplicate Works.
2. **Does review reduce effort?** A phase 1B pilot compares completion rate and median
   completion time with manual import and sets the release threshold.
3. **Are direct additions trustworthy?** Phase 1A measures how often researchers say
   an added Work is not theirs, separately for Plato and curator additions. This rate
   gates expansion.

## The ask

**Go or no-go on phase 1A and the phase 1B dependency.** React especially to claiming
the existing record, linked-identity matching and per-origin routing.

## Open questions

**Blockers before implementation; prototypes use stubs:**

- What deposit status and visibility a Plato-added work receives. A draft cannot be
  public. Owner: Raven with the Biblio team.
- Which candidate feed unlocks phase 1B. Owner: ProductBoard with Raven.
- Whether weak or unlinked matches are discarded, retained privately or shown to
  curators. Owner: ProductBoard with the Biblio team and Raven.
- How Raven claims a system-owned record on the first persisted action and handles
  later harvests after researcher edits without creating a duplicate. Owner: Raven.
- How the owner keeps a record off the public site at submit; Raven's user role has no
  visibility capability yet. Owner: Raven.
- How a co-author sees the claimed Work in their research-output list.
  Owner: Raven.
- Whether Reject records a reason and if reason capture belongs in phase 1B. Owner:
  Product, Biblio team and Raven.

**Later:**

- Whether automated imports pass through curator review. Owner: Biblio team.
- Which later sources take which route. Owner: Biblio team.
