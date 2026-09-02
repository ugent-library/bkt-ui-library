# DD-003 — Candidate review is a focused round

Status: Accepted
Date: 2026-09-02
Scope: Backoffice

## Decision

The dashboard keeps at most three compact Found for you cards; its count is the total
of pending matches. Three routes leave it, each with one intent:

- **View all** and the navigation item open the Found for you overview: a filtered,
  paginated list on the filter-first backoffice shell. The status filter offers
  **New**, **Skipped**, **Added** and **Rejected**; New and Skipped are selected by
  default. Review history is a filter, not a page. A dashboard title opens this
  overview at its candidate and changes nothing.
- **Review N research outputs** starts a round through the New and Skipped candidates
  at that moment, one at a time. New arrivals join the next round.
- **Review** on a candidate card opens the same focused page for that one candidate
  and returns to the place that opened it.

The focused page shows an identity summary — title, contributors, year, output type,
source and match evidence — and only the fields that are missing or that the
researcher owns. Imported values that need no decision sit behind a read-only
disclosure. The deposit stepper is not used. The actions are **Add**, **Skip**,
**Reject**, **Save for later** and **Edit the full record**; Skip holds the candidate
for the next round from either mode.

The harvested Work is claimed the first time the researcher persists something: Add,
Save for later or Edit the full record. Opening, Skip, Reject and Back never claim.
After a claim the Work is an ordinary draft or submission in the researcher's own
output. Matched co-authors stop seeing the candidate; they are told a co-author or the
Biblio team added it and reach the Work once it is submitted. Another owner's draft is
never linked.

Values typed on the focused page are remembered in the browser for that candidate:
Back, refresh and return restore them without claiming anything. Skip and Reject
discard them; Save for later and Edit the full record keep them in the draft. There is
no unsaved-changes prompt. Progress reads as position and remaining count, never as
completed.

## Because

Earlier drafts sent **Review N research outputs** either to a one-candidate sequence
that hid the queue, or to one complete list that mixed two intents: seeing what is
waiting, and the batch work of completing it. Both completed inside the full deposit,
which asked for values the source had already supplied, against principle 05.

Separate places give the overview filters and pagination, and give completion a form
holding only the researcher's questions. Claiming on the first persisted action keeps
opening non-mutating and needs no un-claim path in Raven.

## Trade-off

Two review surfaces instead of one. The focused page composes the compact card and
form parts, plus a small script that remembers typed values per candidate; that memory
is per browser and dies with cleared storage, so Save for later stays the durable
route. Editing the full record leaves the round;
the researcher comes back through the overview. **Review** becomes the fourth meaning
of that word on the dashboard; accessible names carry the title to tell them apart.

## Revisit when

Revisit if researchers open Review mainly to inspect and the disclosure does not
serve that, or if round summaries and overview filters stop matching how candidates
arrive in volume.

## References

- [`docs/wip/CANDIDATES-BREADBOARD.md`](../wip/CANDIDATES-BREADBOARD.md)
- [`docs/wip/CANDIDATES-BET.md`](../wip/CANDIDATES-BET.md)
- [`docs/DOMAIN-VOCABULARY.md`](../DOMAIN-VOCABULARY.md)
- [`templates/biblio-researcher/dashboard.html`](../../templates/biblio-researcher/dashboard.html)
- [`foundations/design-principles.html`](../../foundations/design-principles.html)
