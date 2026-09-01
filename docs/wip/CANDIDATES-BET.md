# Product bet — Candidates

*Draft for ProductBoard · Evidence: [personas](../RESEARCH-PERSONAS.md),
[demand findings](../../notes/demand/FINDINGS.md), UB2030 §3.2.1 (internal plan) ·
Design: [flow and wireframes](CANDIDATES-FLOW.md)*

## Problem

Plato automatically imports dissertations, sometimes before the final version (note
`d32a8c8b`). WoS is manual: researchers export a file and upload it; one upload
produced duplicate drafts (note `26ed1edf`). No WoS, ORCID or Crossref candidate feed
exists. Claire Searcher asks for reliable automatic inflow. Safely surfacing imports
and helping researchers finish them supports UB2030's goal to reduce manual registration.

## Solution

Raven stores harvested output as private, system-owned Work records. When several
sources identify the same Work, Raven selects one complete source record through
configured source precedence. It does not mix fields from several sources. The
dashboard gains two routes.

**Found for you** lists records matched through the researcher's linked person
identity. During a review round, the remaining count only goes down. It includes the
current card; new arrivals wait for the next round, and leaving resumes the same round.

Opening review changes nothing. The dashboard has no separate **Preview**: **Review**
opens the first card, and a title opens that record in the same review flow.

Each card names its source and match. **Review and add** claims the existing record
as the researcher's draft and opens the profile-driven deposit prefilled. The form
asks only applicable researcher-owned and policy-risk questions; uncertainty remains
a valid answer. The record leaves Found for you immediately. Leaving the form keeps
it under Incomplete (draft) work with **Resume**; submitting moves it to Submitted.
Other matched co-authors stop seeing the candidate and see the resulting work in
their research output.

**Reject** removes only this researcher's match. The record survives for curators
and co-authors, and history offers **Undo**. **Skip** holds the record for the next
review round.

**Added for you** lists records from a source where the researcher already confirmed
authorship. Phase 1A uses the existing Plato import. Each record names the source, is
marked system-added, and carries **Complete** and **View**. It is not rejectable.
**Not yours?** opens a helpdesk email to biblio@ugent.be; the record remains unchanged
until the Biblio team acts.

The Biblio and development teams decide each source's route. This bet does not decide
whether weak or unlinked matches are retained or shown.

**Phase 1A — surface existing Plato direct additions**

- Added for you on the dashboard and the system-added marker in My research output
- Complete, View and the helpdesk report route

**Phase 1B — candidate review, after the first candidate feed exists**

- Found for you, review rounds, Review and add, Reject, Skip and history
- Matches through the linked person identity only

**Later:** proxy claim on behalf · bulk claim · researcher-facing duplicate flagging ·
notification cadence

## Rabbit holes

- Claim reuses the harvested Work. It must not create a second Work.
- A direct-added source proves authorship, not that every value is final or complete.

## No-gos

- Connecting candidate feeds — a dependency owned by its own bet.
- Source-precedence controls or comparison — Raven resolves at whole-record level;
  any curator tooling is separate.
- No curator candidate inbox is assumed or designed.
- Proxy candidate review — phase 1 serves researchers only.
- Duplicate detection inside researcher review — Raven's clusters and merge remain
  the curator route.
- Bulk claim — the profile may ask work-specific questions.

## How we know it works

1. **Is the record safe?** Launch gate: no candidate action deletes harvested data,
   every rejection is recoverable, and a claim creates zero duplicate Works.
2. **Does review reduce effort?** A phase 1B pilot compares completion rate and median
   completion time with manual import. The pilot sets the baseline and release
   threshold before broad release.
3. **Are direct additions trustworthy?** A phase 1A pilot measures helpdesk reports
   that a system-added work is not theirs, per source. The pilot sets the acceptable
   rate before another source receives this route.

## The ask

**Go or no-go on phase 1A and the phase 1B dependency.** React especially to claiming
the existing record, linked-identity matching and per-source routing.

## Open questions

**Blockers before implementation; prototypes use stubs:**

- What deposit status and visibility a Plato-added work receives. A draft cannot be
  public. Owner: Raven with the Biblio team.
- Which candidate feed unlocks phase 1B. Owner: ProductBoard with Raven.
- Whether weak or unlinked matches are discarded, retained privately or shown to
  curators. Owner: ProductBoard with the Biblio team and Raven.
- How Raven claims a matched system-owned record and handles later harvests after
  researcher edits. The result is one resumable draft, not a duplicate. Owner: Raven.
- How a co-author gains sight of the claimed draft in their research-output list.
  Owner: Raven.

**Later:**

- Whether system-added works pass through curator review. Owner: Biblio team.
- Which later sources take which route. Owner: Biblio team.
