# DD-006 — A smaller builder replaces public power search

Status: Accepted
Date: 2026-10-19
Scope: Public

## Decision

The public V1 query builder replaces the Advanced and Expert authoring screens. It
supports a small set of selected search tasks and adds nothing the old screens lack: no
live result count, no OR groups and no spelling suggestions. Existing working query
links, including queries V1 cannot author, return the same intended result set.

V1 goes live and is tested with real users and real data. The backoffice gets its own
V1 builder, which covers pasted identifier batches and other curator tasks. Complex new
analysis uses the API or Power BI.

## Because

The old query URLs receive heavy repeat traffic, while few people author power queries.
Preserving those links and simplifying new authoring solve different needs. Clause counts
in the query log overstate demand for some fields; live use shows which tasks matter.
Leaving out new capabilities keeps V1 small enough to ship and measure.

## Trade-off

Some queries that still work through an old link are not editable in V1. Without a
count, people see the size of a result set only after leaving the dialog.

## Revisit when

Live use shows a necessary public task that V1 cannot do, or many people return from
the results to the builder because a set was empty or too large.

## References

- [`docs/wip/QUERY-BUILDER-BET.md`](../wip/QUERY-BUILDER-BET.md)
- [`docs/wip/QUERY-BUILDER-EVIDENCE.md`](../wip/QUERY-BUILDER-EVIDENCE.md)
- [`patterns/query-builder.html`](../../patterns/query-builder.html)
- [DD-001 — dialog over results](DD-001-advanced-search-dialog.md)
- [Raven #223](https://github.com/ugent-library/raven/issues/223)
