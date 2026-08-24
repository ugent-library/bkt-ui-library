# DD-001 — Advanced search opens as a dialog over results

Status: Accepted
Date: 2026-08-24
Scope: Public

## Decision

Advanced search opens in a wide dialog over the results page. The dialog owns query conditions,
the approximate count and one exit to the results. Share, Save search and Export remain on the
results toolbar because they act on the resulting set.

Use a panel for a short choice anchored to its trigger, a dialog for a focused task that needs the
screen, and a page for a destination with its own address. A dialog does not open another dialog;
an interaction that outgrows a panel becomes a step inside the existing dialog.

## Because

Observed power queries reach six or more rows and may contain long identifier batches. They need
more width and concentration than the facet rail, filter bar and result list can provide inline.
Keeping the results visible at the edges preserves context without implementing sorting, paging,
faceting and exporting a second time inside the builder.

The split also keeps one responsibility per region: the dialog authors the set; the results page
supports reading and taking that set elsewhere.

## Trade-off

The dialog creates a strong mode and limits the vertical workspace. Long queries scroll inside it,
and the URL must restore whether the dialog is open. Closing must return focus to its trigger.

## Revisit when

Revisit if usability testing shows that people must compare conditions with individual results
while editing, or if typical queries become short enough that an inline builder is clearer and does
not displace the results.

## References

- [`patterns/query-builder.html`](../../patterns/query-builder.html)
- [`docs/wip/QUERY-BUILDER-BET.md`](../wip/QUERY-BUILDER-BET.md)
- [`docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md`](../wip/QUERY-BUILDER-FIELD-CONTRACT.md)
- [`foundations/design-principles.html`](../../foundations/design-principles.html)
