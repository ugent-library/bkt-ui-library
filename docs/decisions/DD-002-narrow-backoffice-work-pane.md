# DD-002 — Keep the backoffice work pane primary at narrow desktop widths

Status: Accepted
Date: 2026-08-24
Scope: Backoffice

## Decision

The main app navigation starts expanded at `xl` and wider and slim below `xl`. Its toggle remains
available in both states. On work queues and result lists below `xl`, the facet pane becomes a
Bootstrap Offcanvas drawer and the result region takes the full split-body width. Other split pages
keep their ordinary internal pane.

## Because

Marie Curator works record by record across Biblio and external sources. The documented reviewer
mode is split-screen, where the available browser pane is already narrow. A full navigation rail
and a persistent facet rail would make the record, list or form feel secondary to its controls.

The responsive default preserves navigation while giving the current task the horizontal space.
It applies Design Principle 01, Structure is the style: hierarchy comes from the space assigned to
the work, not from extra emphasis.

## Trade-off

Slim navigation is less immediately legible to sighted users, so every link keeps its text in the
accessibility tree and exposes the same label in a tooltip. The prototype resets the responsive
default on reload instead of remembering a personal preference.

## Revisit when

Revisit if reviewer testing shows that slim navigation slows repeated task switching, or if a
persisted preference can provide a better first paint without reducing the work pane at narrow
desktop widths.

## References

- [`patterns/sidebar.html`](../../patterns/sidebar.html)
- [`patterns/layout-shells.html`](../../patterns/layout-shells.html)
- [`docs/RESEARCH-PERSONAS.md`](../RESEARCH-PERSONAS.md)
- [`docs/JAVASCRIPT.md`](../JAVASCRIPT.md)
- [`foundations/design-principles.html`](../../foundations/design-principles.html)
