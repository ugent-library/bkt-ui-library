# DD-008 — Public search and Advanced search have separate design scopes

Status: Accepted
Date: 2026-10-19
Scope: Public

## Decision

The standard public search page will be reworked. Its ordinary filters and the
Advanced search query builder are separate interface problems, with separate scope
and design reviews.

The standard search review decides how people find and use ordinary filters on the
results page. The builder review decides which tasks, conditions and combinations
Advanced search supports in its smaller V1, then develops that interaction.

Both operate on the same search. Moving between them must preserve the selection's
meaning. Entry into Advanced search, return to results and the presentation of
conditions ordinary filters cannot express belong to their shared boundary.

The next work is to scope Advanced search under DD-006, then develop its accepted
scope. Completing the standard search redesign is not a prerequisite. This decision
does not approve a filter layout, default selection, builder field set or operator list.

## Because

The combined proposal made filter placement and defaults prerequisites for selecting
builder tasks. That joined two reviews with different questions and obscured what
was ready to decide. Separating them allows a bounded builder proposal while keeping
the planned standard search redesign explicit.

## Trade-off

Separate reviews require an explicit check of the transition between the interfaces.
A task may be available through both without either interface becoming a second,
independent search state.

## Revisit when

A selected task cannot be evaluated without changing both interfaces together, or
testing shows that the transition changes or conceals the meaning of the selection.
Review that shared path together before implementation.

## References

- [Search and filtering](../SEARCH-AND-FILTERING.md)
- [Active work](../wip/README.md)
- [Advanced search proposal](../wip/QUERY-BUILDER-BET.md)
- [DD-006 — smaller builder](DD-006-query-builder-v1-replaces-power-search.md)
- [DD-001 — dialog over results](DD-001-advanced-search-dialog.md)
