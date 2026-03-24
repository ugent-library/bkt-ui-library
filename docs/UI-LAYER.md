# UI layer — reference for bbl Go developers

This document describes the design system and HTML prototype environment that produces the CSS and component patterns consumed by the `bbl` Go application.

For entity definitions and shared vocabulary, see `DOMAIN.md` in `booktower-ui-library`.

---

## The design system

**Repository:** `booktower-ui-library` (local: `Sites/booktower-ui-library`)

**What it produces:**
- `assets/booktower.css` — the stylesheet. Copy this + `assets/fonts/` into `bbl/app/assets/` to update.
- HTML prototype templates in `templates/` — reference implementations for Go templ work.

**Running it locally:**
```bash
cd Sites/booktower-ui-library
npm run dev   # builds and serves on http://localhost:3000
```

---

## The surface system

Every rendered page must declare which of the two user contexts it belongs to. This is done via `data-surface` on `<body>` or the outermost layout element.

```html
<body data-surface="backoffice">   <!-- curators, librarians -->
<body data-surface="public">       <!-- researchers, readers, the open web -->
```

This is not optional decoration. It activates CSS tokens that change typography, density, and visual weight throughout the component tree:

```
Public:     IBM Plex Serif headings · 16px body · 1.7 leading · generous padding · shadow on cards
Backoffice: IBM Plex Sans headings  · 15px body · 1.5 leading · compact padding  · flat cards
```

**In Go templ templates:** set `data-surface` in the layout shell, not in individual partials. The layout shell owns the surface declaration for the whole page.

---

## CSS class names

The class list in `booktower-ui-library/ASSISTANT.md` is the authoritative ground truth. Do not invent class names — they will not exist in the CSS. The most common mistake is writing plausible-looking BEM names that have no SCSS definition.

When in doubt, check `assets/booktower.css` or the SCSS source in `assets/scss/`.

Key layout shells:

| Class | Used for |
|-------|----------|
| `u-layout--app` | Backoffice list and detail pages |
| `u-layout--public` | Public search and detail pages |

Backoffice pages use this main-area contract inside `u-layout--app`:

```html
<main id="main-content">
  <div class="u-main__header">...</div>
  <div class="u-main__body">
    <aside class="u-main__sidebar">...</aside>
    <section class="u-main__content">
      <div class="u-main__content-header">...</div>
      <div class="u-main__content-body">...</div>
      <div class="u-main__content-footer">...</div>
    </section>
  </div>
  <div class="u-main__footer">...</div>
</main>
<aside class="u-main__panel">...</aside>
```

Use `u-main__header`, `u-main__sidebar`, `u-main__content-header`, `u-main__content-footer`, `u-main__footer`, and `u-main__panel` only when needed. `u-main__body` is the required middle row, and `u-main__content-body` is the right-pane scroll container when the body is split.

---

## The icon system

One icon system only: the UGent icon font.

```html
<i class="if if-edit" aria-hidden="true"></i>
```

The full icon list is at `http://localhost:3000/foundations/icons.html` (UI kit running locally). Do not guess icon names — use a placeholder and flag it if uncertain.

---

## HTML prototype templates

The `templates/` directory in `booktower-ui-library` contains full-page prototype implementations. These are the reference for Go templ work.

| Prototype | Go templ equivalent |
|-----------|-------------------|
| `templates/biblio-backoffice/backoffice-search-filter-first.html` | Backoffice search/list view |
| `templates/biblio-backoffice/deposit-v2-upload.html` | Deposit flow step |
| `templates/biblio-public/public-search.html` | Public search page |
| `templates/biblio-public/public-project.html` | Public detail page |

HTMX URLs in prototypes are stubs (`hx-get="/search"`, etc.). The corresponding real endpoints in `bbl/app/*_handlers.go` are the production wiring.

---

## HTMX patterns

The application is HTMX-first. Server-rendered partials, not client-side state.

Rules that must hold in Go templ templates:

1. **Every `hx-get` / `hx-post` has `hx-indicator`.** No silent loading states.
2. **`hx-target` selectors must exist in the DOM at request time** — not injected by HTMX. Place empty containers in the initial render.
3. **`aria-live` regions must be in the initial HTML** — screen readers only observe regions present at page load. Place `<span aria-live="polite" id="result-count">` in the layout, not in a swapped partial.
4. **Progressive enhancement:** forms must be submittable without HTMX. Real `action` attribute, real `<button type="submit">`.

---

## Accessibility requirements

Target: WCAG 2.1 AA minimum on every template.

The most critical rules for Go templ work:

- One `<h1>` per page — it names the current view, not the application
- `<main id="main-content">` on every page
- Skip link is the first focusable element inside the layout wrapper
- Every `<nav>` has a distinct `aria-label`
- Icon-only buttons: `aria-label` on the `<button>`, `aria-hidden="true"` on the `<i>`
- Row action buttons must include the record name in their label
- Every `<input>` has an associated `<label for>` — `placeholder` is not a label
- `aria-current="page"` on the active nav link; `aria-current="step"` in the deposit stepper

The full accessibility reference is in `booktower-ui-library/ASSISTANT.md`.

---

## CSS architecture

All CSS lives in `booktower-ui-library/assets/scss/` and compiles to `assets/booktower.css`. Never put CSS in:
- `<style>` blocks in templ files
- `style=` attributes on HTML elements
- JavaScript files (add/remove classes only; no `.style.foo = 'bar'`)

When a style is missing from the system, flag it and add it to the correct SCSS partial in `booktower-ui-library`. Do not patch inline.

---

## Distributing updates

After SCSS changes in `booktower-ui-library`:
1. Run `npm run build` in `booktower-ui-library`
2. Copy `assets/booktower.css` and `assets/fonts/` to `bbl/app/assets/`

A future npm package will replace the manual copy step.
