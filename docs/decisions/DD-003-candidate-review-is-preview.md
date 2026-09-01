# DD-003 — Candidate review is the preview

Status: Accepted
Date: 2026-08-31
Scope: Backoffice

## Decision

The candidate dashboard has no separate Preview action. **Review** opens the first
full candidate card. Selecting a candidate title opens that record in the same
one-by-one review flow. Opening either route changes no record or review decision.
Only **Review and add**, **Reject** and **Skip** change state.

## Because

The previous dashboard-row design placed Preview beside Import and Reject because
the row did not carry enough detail for those decisions. The new review flow gives
each candidate a full card with its source, match evidence, metadata and actions.
A second preview mode would duplicate that screen and add another dashboard choice.

The design conclusion is that one contextual path better supports completion: the
researcher can inspect the complete candidate and act without moving between a
preview and a separate decision screen. Dashboard title links still provide direct
access to a particular candidate.

## Trade-off

A researcher who only wants to inspect one candidate enters the review flow. The
interface must therefore make clear that opening review is non-mutating, preserve
the round on exit and provide an immediate route back to the dashboard.

## Revisit when

Revisit if testing shows that researchers avoid opening review because it appears
to commit them to processing the queue, or that they need to compare several full
candidates before deciding which one to complete.

## References

- [`docs/wip/CANDIDATES-FLOW.md`](../wip/CANDIDATES-FLOW.md)
- [`docs/wip/CANDIDATES-BET.md`](../wip/CANDIDATES-BET.md)
- [`templates/biblio-researcher/dashboard.html`](../../templates/biblio-researcher/dashboard.html)
- [`foundations/design-principles.html`](../../foundations/design-principles.html)
