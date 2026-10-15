# DD-006 — A smaller builder replaces public power search

Status: Accepted
Date: 2026-09-28
Scope: Public

## Decision

Raven's first public query builder replaces the Advanced and Expert authoring screens
with a smaller V1 built around selected search jobs. Existing working query links,
including queries V1 cannot author, must still return the same intended result set.
People who need to create more complex analyses use the API or Power BI.

The prototype keeps one-level OR groups as an experiment. They are not required for V1.
Saved searches remain a parity requirement outside the public builder. Sharing formats
are parity work that can have their own issue.

## Because

The old query URLs receive heavy repeat traffic, while few people author power queries.
Preserving those links and simplifying new authoring solve different needs. Clause counts
in the query log also overstate demand for some fields, so the V1 jobs need testing with
the Biblio team and researchers before the field set is fixed.

## Trade-off

Some queries that still work through an old link will not be editable in V1. The
replacement depends on reliable legacy-link translation and usable API access for
complex new queries.

## Revisit when

Biblio team or researcher testing finds a necessary query that V1 cannot make and that
the API or Power BI cannot reasonably serve.

## References

- [`docs/wip/QUERY-BUILDER-BET.md`](../wip/QUERY-BUILDER-BET.md)
- [`docs/wip/QUERY-BUILDER-EVIDENCE.md`](../wip/QUERY-BUILDER-EVIDENCE.md)
- [`patterns/query-builder.html`](../../patterns/query-builder.html)
- [Raven #223](https://github.com/ugent-library/raven/issues/223)
