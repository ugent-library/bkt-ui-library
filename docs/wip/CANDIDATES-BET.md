# Product bet — Candidates

*Draft for Booktower · Evidence: `docs/RESEARCH-PERSONAS.md`, `notes/demand/FINDINGS.md`, UB2030 §3.2.1*

## The bet

When Biblio shows a researcher the works it harvested for them and lets them claim
each one in a short review, research output that already exists in other systems
reaches Biblio sooner and costs the researcher less typing. The researcher still
answers access level, file version and licence on every claimed work.

## Problem

Work by UGent researchers already exists in Web of Science, ORCID, Crossref and
Plato, but a person must type it into Biblio before Biblio has it. Claire Searcher
(researcher) asks for automatic inflow from WoS, ORCID and other reliable sources.
Otto Thor (self-depositing author) bulk-imports from WoS today; one import flooded
the team with duplicate drafts (note `26ed1edf`). UB2030 §3.2.1 names reducing the
manual registration burden as a goal.

## Solution

Raven already stores a harvested candidate as a private work record that no
researcher owns or sees. The researcher dashboard (backoffice surface) gains two
sections.

**Found for you** lists candidates matched to the researcher through their linked
person identity. One candidate at a time: the metadata with its source named,
then **Claim**, **Reject** and **Skip**. Claim opens the deposit flow
prefilled; the researcher checks the fields and answers the policy-risk questions
in that session — the import never answers them. Reject removes the match and hides
the candidate; the record survives for curators and co-authors. Stepping back
in the pass re-opens a rejected or skipped card, and a review history (claimed
and rejected) allows reclaiming later. Skip drops the work from this pass; it
returns at the head of the next review batch.

**Added for you** announces works from sources where the researcher already
confirmed authorship (Plato), landing directly in My research output. Each is
marked as system-added and carries **View** and **Complete**. Plato pushes records
before the final version exists (note `540fd477`), so the researcher still has
fields to fill. Disowning one sends a report to the Biblio team; the work stays
live until the team acts.

The Biblio team decides per source which route it takes; the prototype treats that
as given. Weak or unlinked matches wait for the curator candidate inbox, the next
bet.

**Phase 1 — first useful release**

- Both dashboard sections
- Candidate review: one at a time; claim opens the prefilled deposit flow; Reject
  hides the candidate, undone by stepping back; a review history for later;
  Skip defers to the next batch
- System-added marker in My research output, with disown-and-report
- Matches through the linked person identity only
- `docs/DOMAIN-VOCABULARY.md` Candidate entry corrected: a candidate is a work
  record; claim, not accept (the Biblio team's verb)

**Later:** proxy claim on behalf (claim mechanics may not assume the claimant owns
the result) · bulk claim · duplicate flagging and merge · notification cadence ·
the curator candidate inbox

## Rabbit holes

- Fuzzy name matching: Raven decides how matching evolves beyond the linked person identity.
- A lighter curator check for works Plato adds directly is not decided; nothing
  here builds or promises one.
- A claim that skips the policy-risk questions recreates the abandoned-draft
  problem.

## No-gos

- Curator candidate inbox — own bet.
- Connecting the sources — own bet. Plato already flows in, so Added for you
  can start; the other feeds (ORCID and the rest) do not exist yet.
- Proxy view of candidates — phase 1 serves researchers only.
- Duplicate detection inside the review — Raven's duplicate clusters and merge
  serve curators; a researcher-facing flag is later.
- Bulk claim — a bulk action cannot answer per-work policy-risk questions.

## How we know it works

Rows extend `notes/PLAN-measurement.md`.

1. **Do claimed candidates arrive complete?** (non-negotiable) Success: a claimed
   candidate reaches submitted with its policy-risk fields answered in the claim
   session. Failure: claims pile up as abandoned drafts. Baseline: none.
2. **Is Reject safe?** (non-negotiable, test gate before launch) Success: a
   rejected candidate stays retrievable from the review history, and no researcher
   action deletes a record. Failure: any researcher path that destroys harvested
   data.
3. **Does the claim path carry deposits?** (diagnostic) Share of new works entering
   through claim rather than manual deposit. Failure: researchers ignore the
   sections. Baseline: 0.

## The ask

**Go or no-go on phase 1.** React especially to claim as an operation on an
existing record, identity-linked matching only, and routing as a per-source
setting.

## Open questions

**Blockers before implementation; the prototype builds stubs:**

- How Raven computes and exposes "matched to me" (contributor link → person record
  → user link), how a researcher gains sight of a work they do not own, and how
  the queue is ordered (skipped work heads the next batch). Owner: Raven.
- What claim does in Raven: transfer ownership, or copy and keep the system
  record — and what Reject does, since RejectSource is not it. Owner: Raven.
- A Plato-added work's arrival status: a draft cannot be public, so it lands as
  submitted or as public outside the draft path. Owner: Raven with the Biblio team.

**Later:**

- The Biblio-team flow after a researcher disowns a system-added work. Owner:
  Biblio team.
- Whether curators see system-added works pass, and how they are flagged. Owner:
  Biblio team.
- Which sources take which route. Owner: Biblio team
