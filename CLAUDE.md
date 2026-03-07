# CLAUDE.md
# Working guidelines for AI-assisted development on this project

This file is written by Claude, for Claude.
It documents what this project is, what I tend to get wrong, and what I must verify before producing code.
Add it to the root of any project where I'm a regular collaborator.

---

## What this project is

A design system and prototype environment for **biblio.ugent.be** — Ghent University's research output repository. It serves two distinct user contexts that must never be conflated:

- **Public** — researchers, readers, the open web. Knowledge is the subject.
- **Backoffice** — curators, librarians, depot workers. Work is the subject.

The system is HTMX-first, Bootstrap-based, semantically correct HTML, progressively enhanced, accessible by default. It is not a React app. It is not a SPA. Server-side rendering, stable URLs, graceful degradation are not constraints — they are the architecture.

---

## The surface system

Every layout container must carry `data-surface="public"` or `data-surface="backoffice"`. This is not optional decoration — it activates surface tokens that change typography, density, and visual weight throughout the component tree.

```
Public:     IBM Plex Serif headings · 16px body · 1.7 leading · generous padding · shadow on cards
Backoffice: IBM Plex Sans headings  · 15px body · 1.5 leading · compact padding  · flat cards
```

**When I forget this, I produce inconsistent UIs.** Check every new template has the attribute on `<body>` or the outermost layout element.

In the UI kit, pages without any `data-surface` declaration get `data-surface="backoffice"` injected on `<body>` automatically by the server. To override this for a specific page, add `<!-- @surface: public -->` at the top of the file.

---

## The icon system

One icon system only: the UGent icon font. Use `i.if.if-[name]` for all icons. There is no second icon system — no Remix Icons, no other external icon libraries.

The full icon list is documented at `/foundations/icons.html` and defined in `assets/scss/icons/_icon-font.scss`. Icon names there are the ground truth — do not invent names not present in that file. When adding a new icon, run `npm run build:icons` which regenerates the SCSS automatically from the SVG sources in `assets/icon-font-source/`.

---

## Accessibility: what I get right and what I get wrong

### What I get right
- `role`, `aria-label`, `aria-live`, `aria-current` attribute syntax
- `fieldset`/`legend` for grouped controls
- `visually-hidden` for screen-reader-only text
- Skip links
- Keyboard focus order (in static HTML — not in dynamic HTMX swaps)

### What I get wrong or must always verify

**1. aria-label on the wrong element**

The label belongs on the interactive element, never on the icon.

```html
<!-- ✓ Correct: label on the button -->
<button type="button" aria-label="Close dialog">
  <i class="if if-close" aria-hidden="true"></i>
</button>

<!-- ✗ Wrong: label on the <i> — unreliable across screen readers -->
<button type="button">
  <i class="if if-close" aria-label="Close"></i>
</button>
```

**2. Row action labels — include the record context**

An icon button inside a table row must name the record it acts on, not just the action. A screen reader user navigating by button hears only the label, with no visual row context.

```html
<!-- ✓ Correct -->
<a href="#" aria-label="Edit record: Urban forests as essential infrastructure">
  <i class="if if-edit" aria-hidden="true"></i>
</a>

<!-- ✗ Wrong — which record? -->
<a href="#" aria-label="Edit">
  <i class="if if-edit" aria-hidden="true"></i>
</a>
```

**3. Facet counts — decorative, not informative**

The counts in `.c-facets` are supplementary. The label (e.g. "Journal article") is sufficient. Counts should carry `aria-hidden="true"` unless the screen reader context would be improved by hearing them. The `aria-label` on the checkbox input is the right place to include the count when needed:

```html
<input type="checkbox" id="f-journal"
  aria-label="Journal article (1,234 records)">
<label for="f-journal">Journal article</label>
<div class="c-facet-count" aria-hidden="true">1,234</div>
```

**4. Dynamic content — HTMX swaps**

After an HTMX swap, screen readers may not announce the change. I produce the HTML correctly but cannot test the runtime behaviour. Always verify:
- `aria-live` regions receive the updated content (not just a parent container)
- Form validation errors after a failed HTMX POST move focus to the error or error summary
- Loading indicators use `aria-live="polite"` and the class `.htmx-indicator`

**5. I have never run a screen reader on this code**

Everything above is written-correctly-in-HTML. None of it has been tested with VoiceOver or NVDA in a real browser. Testing with a screen reader is a human responsibility. Flagging this is an AI responsibility.

---

## HTML patterns I must follow

### Semantic structure
- One `<h1>` per page, logical heading hierarchy underneath
- `<main id="main-content">` on every page, targeted by the skip link
- `<nav aria-label="...">` when multiple navs coexist on a page
- `<article>` for self-contained records (a research output card is an article)
- `<aside aria-label="...">` for facet sidebars and supplementary panels

### Forms
- Every `<input>` has an associated `<label>` — `placeholder` is never the label
- Required fields use the `required` attribute, not just a visual asterisk
- Error messages use `aria-describedby` to associate with their field
- Personal data fields carry appropriate `autocomplete` attributes
- Grouped radio/checkbox controls use `<fieldset>` and `<legend>`

### HTMX
- Every `hx-post` / `hx-get` has an `hx-indicator` — no silent loading states
- `hx-target` selectors must exist in the DOM at request time, not just at page load
- All `hx-get` / `hx-post` URLs in templates are stubs until connected to real endpoints — treat them as documentation of intent, not working code
- Progressive enhancement: the form must be submittable without HTMX (a real `action` attribute, a real `<button type="submit">`)

### Structured data
Public-facing record pages must include `<script type="application/ld+json">` with schema.org markup. Minimum for a research output:
- `@type: "ScholarlyArticle"` (or `Dataset`, `SoftwareSourceCode` etc.)
- `headline`, `author[]`, `datePublished`, `publisher`, `isPartOf` for journal
- `license` as a URL when open access
- `identifier` with DOI

---

## CSS class names: what exists vs what I invent

This is the most common mistake I make. I produce plausible-looking class names with high confidence. Many of them do not exist in the actual CSS.

### Complete verified class list (ground truth — cross-checked against SCSS source)

**Navigation & topbar**
```
bc-navbar               bc-navbar__brand        bc-navbar__nav
bc-navbar__link         bc-navbar__sep
```
Note: `bc-navbar__brand` is used (backoffice logo link). `bc-navbar__mark` does NOT exist — do not use it.

**Toolbar & button groups**
```
bc-toolbar              bc-toolbar--bordered
bc-toolbar__left        bc-toolbar__right       bc-toolbar__item
bc-toolbar__title
c-button-toolbar        c-button-toolbar--wide-spacing  c-button-toolbar--vertical
```
`bc-toolbar__item` is a flex child that takes `flex:1` — use it (with `w-100` if needed) instead of reaching for utility class hacks on `__left`.

**Avatar**
```
bc-avatar               bc-avatar--small        bc-avatar--large
```

**Hero (public surface)**
```
c-hero                  c-hero__bg              c-hero__content
```

**Research card**
```
card-research           card-meta               card-actions
card-body               card-title              card-authors
card-publication
```

**Facets sidebar**
```
c-facets                c-facet-title           c-facet-check
c-facet-name            c-facet-count           c-facet-separator
```

**Sub-sidebar navigation**
```
c-sub-sidebar           c-sub-sidebar--bordered
```

**Backoffice list layout**
```
c-content-area          c-facets-col            c-results-col
```
Use `bc-toolbar` for search/filter bars, bulk action bars, and pagination rows — not custom classes.

**View toggle**
```
view-toggle             view-toggle-btn         view-toggle-btn.is-active
```

**Table**

Use Bootstrap classes directly: `<table class="table table-hover align-middle">`. Apply `text-uppercase text-muted small` to `<thead>`. No custom table classes exist in this system.

For title cells: `fw-semibold text-reset text-decoration-none` on the link, `small text-muted mt-1` on the secondary line. For action cells: `text-end` on `<td>`, then `btn-ghost btn-sm` buttons directly inside.

Row selection state: Bootstrap's `.table-active` on `<tr>`. The CSS tokens `--bs-table-active-bg` and `--bs-table-hover-bg` are overridden in `_layouts.scss` to match design system colours. Action buttons use `btn-ghost` which is already visually quiet at rest — no reveal mechanism needed.

**Empty states**
```
c-blank-slate           c-blank-slate--default  c-blank-slate--muted
c-blank-slate--primary
```
Note: BEM modifier double-dash (`--`). The old styleguide used single-dash — that was wrong.

**Deposit flow components**
```
c-stepper               c-stepper__item         c-stepper__item--done
c-stepper__num          c-stepper__label        c-stepper__required
c-radio-card            c-radio-card__body      c-radio-card__group
c-file-drop             c-file-drop__icon       c-file-drop__text
c-file-drop__hint
```

**Filter tags**
```
filter-tag
```

**Definition list**
```
bt-dl
```

**HTMX state classes**
```
htmx-indicator          htmx-swapping           htmx-settling
```

**Badges**
```
badge-oa                badge-restricted
```

**Footer**
```
nav-title
```

**Layout shells**
```
u-layout--app           u-layout--deposit       u-layout--public
```

### Classes that no longer exist — do not use

```
app-sidebar             app-sidebar-link        app-sidebar-label
bc-navbar__mark
c-blank-slate-default   (replaced by c-blank-slate--default)
c-blank-slate-muted     (replaced by c-blank-slate--muted)
c-blank-slate-primary   (replaced by c-blank-slate--primary)
c-table                 (use Bootstrap .table .table-hover .align-middle)
c-filter-bar            (use bc-toolbar)
c-bulk-bar              (use bc-toolbar)
c-pagination-bar        (use bc-toolbar)
c-results-toolbar       (use bc-toolbar bc-toolbar--bordered)
is-selected on <tr>     (use Bootstrap .table-active)
td-title  td-meta  td-actions  td-actions-inner  row-actions   (use Bootstrap utilities directly)
u-scroll-wrapper        u-scroll-wrapper__body  (OLD layout system, removed)
c-sidebar               (OLD narrow icon rail — removed in v2)
u-maximize-height       (OLD layout utility — removed in v2)
```

### Icon names — verified source of truth
Check `assets/scss/icons/_icon-font.scss` for the complete list. Do not use any `if-[name]` not present in that file.

---

## What to do when uncertain

**About a class name:** search the existing `booktower.css`, the SCSS source and Bootstrap. If I can't confirm it exists, say so and add it to the correct SCSS partial rather than guessing.

**About an icon name:** do not guess. Use a placeholder (`if-[placeholder]`) and flag it explicitly.

**About HTMX behaviour at runtime:** describe what should happen, mark the URL as a stub, and note that integration testing is required.

**About accessibility:** produce the correct static HTML, then explicitly state that screen reader testing has not been performed.

**About the surface of a new page:** check or ask which user this is for before writing the first line of HTML.

---

## CSS architecture — where styles live

All CSS belongs in `assets/scss/` and compiles to `assets/booktower.css`. This is not negotiable.

```
assets/scss/
  foundation/   ← tokens, colors, surfaces, bootstrap overrides
  base/         ← reset, typography, accessibility
  elements/     ← buttons, badges
  components/   ← bootstrap component overrides
  patterns/     ← booktower-specific components and layout shells
  icons/        ← icon system rules
  utilities/    ← utility classes
```

**I must never put CSS in:**
- `<style>` blocks inside HTML files
- `style=` attributes on HTML elements
- JavaScript files (no style mutation via `.style.*` except unavoidable dynamic values like drag coordinates)
- Any file outside `assets/scss/`

**The one documented exception:** `shell/scss/` compiles to `shell/shell.css` for shell chrome only (`bt-shell`, `bt-nav`, `bt-content`, `ds-page`, `ds-demo`, `ds-code`). Do not add to it — only remove from it as the design system matures.

**When I produce HTML:** if a style is missing from the system, I flag it and add it to the correct SCSS partial. No inline patches.

**When I produce JavaScript:** I add or remove classes. Classes are defined in SCSS. No `.style.foo = 'bar'`.

---

## No redundancy between files

Every rule must live in exactly one place.

| What | Where |
|------|-------|
| Reset (`box-sizing`, `html`, `body`, list reset) | `base/_reset.scss` |
| Font `@import` | `_header.scss` (must precede all `@use`) |
| Colour tokens (palette + semantic aliases) | `foundation/_colors.scss` |
| Non-colour tokens (type, spacing, borders, shadows, motion) | `foundation/_tokens.scss` |
| Layout geometry (`--s-topbar-height`) | `foundation/_surfaces.scss` |
| Surface tokens (`--s-heading-font` etc.) | `foundation/_surfaces.scss` |
| SVG ink-alpha tokens (`--i02`–`--i40`) | `patterns/_svg-animations.scss` |
| Accessibility (focus ring, `.visually-hidden`, reduced motion) | `base/_accessibility.scss` |
| Bootstrap overrides | `foundation/_bootstrap-overrides.scss` |
| Shell chrome only | `shell/shell.css` |

Component code references only semantic aliases (`--bt-text`, `--bt-danger`, `--bt-bg` etc.), never raw palette steps or hex values.

---

## Layout shells

Three CSS grid shells live in `patterns/_layouts.scss`. All use `--s-topbar-height` (defined in `foundation/_surfaces.scss`) for sticky sidebar calculations.

| Shell | Used for | Children |
|-------|----------|----------|
| `u-layout--app` | Backoffice list/detail pages | `.bc-navbar` + `.c-sub-sidebar` + `<main>` |
| `u-layout--deposit` | Deposit flow | `.bc-navbar` + `.c-stepper` + `<main>` |
| `u-layout--public` | Public search/detail | `.bc-navbar` + `<main>` |

Public `<main>` uses Bootstrap `.container` inside it for gutters — the shell itself has no `max-width` or padding.

`u-layout--app` supports an optional right panel with `.has-panel` on the shell.

**Deprecated layout classes (OLD system — do not use):**
`u-scroll-wrapper`, `u-scroll-wrapper__body`, `c-sidebar`, `u-maximize-height`

---

## Naming conventions

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `bc-` | Bootstrap Custom — extends/wraps Bootstrap | `bc-navbar`, `bc-toolbar`, `bc-avatar` |
| `c-` | Component — no Bootstrap base | `c-facets`, `c-stepper`, `c-blank-slate` |
| `u-` | Utility — single-purpose helpers and layout shells | `u-layout--app`, `u-layout--deposit` |

BEM separators: `__` for elements, `--` for modifiers. Single dash is never a BEM separator in this system.

Bootstrap utilities (`d-flex`, `gap-3`, `text-muted`, `mb-4`) are used directly without wrapping.

**Do not invent new prefixes** without an explicit decision.

---

## UI kit page conventions

Before creating a new page in `foundations/`, `elements/`, or `patterns/`, read at least two existing pages. Match their structure exactly.

```html
<!-- Page header — data-surface="public" for serif display -->
<header class="ds-page-header col-6" data-surface="public">
  <p class="ds-eyebrow">Patterns</p>
  <h1 class="display-1">Page title</h1>
  <p class="lead">Introduction.</p>
</header>

<!-- Section -->
<section class="ds-section">
  <h2 class="h4 mb-3">Section heading</h2>

  <!-- Demo block -->
  <div class="ds-demo">
    <h3 class="ds-demo-label">Variant label</h3>
    <div class="ds-demo-body">
      <!-- live component HTML here -->
    </div>
  </div>

  <!-- Code block -->
  <div class="ds-code">
    <div class="ds-code-bar">
      <span class="ds-code-lang">html</span>
      <button class="ds-code-copy">Copy</button>
    </div>
    <pre>…</pre>
  </div>
</section>
```

Rules:
- `<header>` not `<div>` for the page header
- `<section>` not `<div>` for each content section
- Section headings: `<h2 class="h4 mb-3">`
- Demo labels: `<h3 class="ds-demo-label">` not `<div>`
- No `<style>` blocks — all styles go in SCSS
- No `style=` attributes unless the value is genuinely dynamic
- `ds-demo-body` wraps live demos; `ds-code` wraps code examples — never mix them

---

## The design system dogfoods itself

The design system documentation uses the same CSS it produces. If a component can't be shown in the kit using its own classes, the gap is in `assets/scss/` — not an excuse for inline styles in HTML.

---

## Distributing the design system

Current: copy `assets/booktower.css` + `assets/fonts/` to the consumer app. Font path in CSS is `/assets/fonts/` — the consumer must serve fonts there.

Future: npm package. Not set up yet. Don't suggest symlinks or git submodules.

---

## A note on confidence

I produce code confidently regardless of whether I am correct. Confidence is not a reliability signal. Before finalising any output, check:

1. Does this class name actually exist in SCSS?
2. Does this ARIA attribute belong on the right element?
3. Does this icon name match `_icon-font.scss`?
4. Does this HTMX pattern account for the empty, error, and loading states?
5. Does this template carry the correct `data-surface`?
