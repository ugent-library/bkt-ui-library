# UI layer — reference for bbl Go developers

This document describes the design system and HTML prototype environment that produces the CSS and component patterns consumed by the `bbl` Go application.

For entity definitions and shared vocabulary, see `DOMAIN.md` in `booktower-ui-library`.
For cross-project consumption rules, read `docs/CONSUMING-BOOKTOWER.md` before copying layouts or classes into another repo.

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
Public:     system-UI headings weight 300 · 16px body · 1.75 leading · italic lead · warm off-white bg
Backoffice: system-UI headings weight 600 · 15px body · 1.5 leading  · upright lead · white bg
```

Both surfaces share `--bt-blue-800` (`#132e53`) as the heading colour.

**In Go templ templates:** set `data-surface` in the layout shell, not in individual partials. The layout shell owns the surface declaration for the whole page.

---

## CSS class names

The class list in `booktower-ui-library/ASSISTANT.md` is the authoritative ground truth. Do not invent class names — they will not exist in the CSS. The most common mistake is writing plausible-looking BEM names that have no SCSS definition.

If this library is being consumed from another project, also follow `docs/CONSUMING-BOOKTOWER.md`. That file defines the shell contract, Bootstrap vs Booktower responsibilities, and the scroll rules that are easiest to get wrong.

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
  <div class="u-main__body u-main__body--split">
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

Use `u-main__header`, `u-main__sidebar`, `u-main__content-header`, `u-main__content-footer`, `u-main__footer`, and `u-main__panel` only when needed. `u-main__body` is the required middle row. Add `u-main__body--split` only when that row contains a left `u-main__sidebar`; `u-main__content-body` is then the right-pane scroll container.

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

| Prototype | Role | Go templ equivalent |
|-----------|------|--------------------|
| `templates/biblio-public/public-search.html` | Public | Public search page |
| `templates/biblio-public/public-research-detail.html` | Public | Work detail page |
| `templates/biblio-public/public-project.html` | Public | Project detail page |
| `templates/biblio-researcher/dashboard.html` | Researcher | Researcher inbox |
| `templates/biblio-researcher/deposit-*.html` | Researcher | Deposit flow steps |
| `templates/biblio-researcher/search-researcher.html` | Researcher | My research output list |
| `templates/biblio-team/team-queue.html` | Curator | Queue overview (Wachtrij) |
| `templates/biblio-team/team-review.html` | Curator | Single-record review |
| `templates/biblio-team/search-team.html` | Curator | All research output (curator) |
| `templates/biblio-team/overview-team.html` | Curator | Team health overview (head of curation) |

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
- `aria-current="page"` on the active nav link

The full accessibility reference is in `booktower-ui-library/ASSISTANT.md`.

---

## CSS architecture

All CSS lives in `booktower-ui-library/assets/scss/` and compiles to `assets/booktower.css`. Never put CSS in:
- `<style>` blocks in templ files
- `style=` attributes on HTML elements
- JavaScript files (add/remove classes only; no `.style.foo = 'bar'`)

The SCSS is no longer just one large pattern partial. Shared patterns still live in `patterns/_booktower-components.scss`, while larger feature blocks are being split into focused partials such as:
- `patterns/_booktower-navbar.scss`
- `patterns/_booktower-toolbar.scss`
- `patterns/_booktower-work-card.scss`

When a style is missing from the system, flag it and add it to the correct SCSS partial in `booktower-ui-library`. Do not patch inline.

---

## Distributing updates

After SCSS changes in `booktower-ui-library`:
1. Run `npm run build` in `booktower-ui-library`
2. Copy `assets/booktower.css` and `assets/fonts/` to `bbl/app/assets/`

A future npm package will replace the manual copy step.

---

## TODO

### Patterns

- Decide whether blank-slate is a component we should keep, or if it is just a card with text-center
- Decide whether research-card is a component we should keep, or if it is just a card with text-center
- Fix people-search
