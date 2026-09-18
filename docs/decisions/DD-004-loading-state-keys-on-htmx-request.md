# DD-004 — The panel's loading state keys on htmx's request class

Status: Accepted
Date: 2026-09-18
Scope: Both

## Decision

While a request runs inside the add-to-list panel, the checklist dims and pulses. The CSS
selects `.bt-panel__body--checklist.htmx-request`, the class htmx puts on every
`hx-indicator` target for the length of a request. No script sets state for it.

## Because

htmx already counts overlapping requests and removes the class only when the last one
ends. A bridge that mirrored the class into `aria-busy="true"` was built and removed:
screen readers act on `aria-busy` only inside live regions, so the attribute bought no
accessibility, and the spoken result already comes from the page's `role="status"`
region. Raven runs htmx with the default class name and keys its own CSS on it.

## Trade-off

The stylesheet depends on a library's class name. A consumer without htmx has no
loading state until it sets the class itself.

## Revisit when

A consumer stops using htmx, or a second component needs the same state expressed in
markup. The move is one selector in `assets/scss/patterns/_panel.scss` and a script
that mirrors the class into `aria-busy`; markup does not change.

## References

- `docs/ACCESSIBILITY.md` D1
- `patterns/panel.html`
- `docs/CLASS-USAGE.md`, `bt-panel`
