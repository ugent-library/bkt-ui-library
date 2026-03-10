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

## Accessibility rules

Target: **WCAG 2.1 AA** minimum on every template. WCAG 2.2 and stable WCAG 3 guidance applied where noted.

We build two things: a **public research repository** (anonymous users, read-heavy, search + discovery, must work for screen reader users who cannot see the visual layout) and a **backoffice data management app** (authenticated library staff, task-heavy, CRUD + bulk operations + multi-step deposit forms, used repeatedly all day — efficiency matters as much as correctness).

**I produce correct static HTML. I cannot test runtime behaviour after HTMX swaps. Screen reader testing with VoiceOver or NVDA is a human responsibility.**

---

### A. Page-level structure

**A1. One `<h1>` per page.** It names the current view. Heading hierarchy flows beneath it without skipping levels. In the backoffice, `<h1>Research output</h1>` is correct; `<h1>Biblio</h1>` is not — that names the application, not the view.

**A2. `<main id="main-content">` on every page.** This is the skip-link target and the primary landmark. There is exactly one `<main>` per page.

**A3. Skip link is the first focusable element inside the layout wrapper.** It targets `#main-content`. The current `.skip-link` implementation in `_accessibility.scss` uses `transform: translateY(-100%)` and reveals on `:focus` — this is correct. Do not replace it with `top: -999px` (breaks at high zoom).

```html
<!-- ✓ Inside u-layout--app, before bt-navbar -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**A4. `lang` attribute on `<html>`.** Always `<html lang="en">` for English content. For Dutch fragments: `<span lang="nl">…</span>`.

**A5. Every `<nav>` has a distinct `aria-label`.** When multiple navigation landmarks exist on one page, each must be uniquely named so a screen reader user can distinguish them.

```
Application navigation   ← bt-navbar primary nav
Section navigation       ← bt-sub-sidebar
Breadcrumb               ← breadcrumb nav
Filter by                ← bt-facets-col aside (use aria-label on <aside>)
Results pagination       ← pagination nav
```

**A6. Landmark regions used correctly.**
- `<header>` for the topbar (`bt-navbar`)
- `<main>` for primary content
- `<nav>` for navigation (with label — see A5)
- `<aside>` for facets and supplementary sidebars (with label)
- `<section aria-labelledby="…">` for named content sections on detail pages
- `<article>` for self-contained records (search result cards)
- Never use `<div>` where a semantic element applies

---

### B. Interactive elements — accessible names

**B1. Every interactive element has an accessible name.** The name comes from (in priority order): visible text content → `aria-labelledby` → `aria-label`. An element without any of these fails WCAG 4.1.2.

**B2. Icon-only buttons: label on the button, `aria-hidden` on the icon.**

```html
<!-- ✓ Correct -->
<button type="button" aria-label="Close dialog">
  <i class="if if-close" aria-hidden="true"></i>
</button>

<!-- ✗ Wrong — label is on the icon, not the interactive element -->
<button type="button">
  <i class="if if-close" aria-label="Close"></i>
</button>
```

**B3. Buttons with visible text: do not add `aria-label`.** `aria-label` replaces visible text in the accessibility tree — it does not supplement it. If visible text says "Export" and `aria-label` says "Download CSV file", screen readers announce the label only, creating a mismatch with what sighted users see.

```html
<!-- ✓ Correct — visible text is sufficient -->
<button type="button">
  <i class="if if-download" aria-hidden="true"></i>
  Export
</button>
```

**B4. Row actions must include the record name in their label.** A keyboard or screen reader user navigating by button has no visual row context. This applies to every action button inside `card-research`, table rows, and list items.

```html
<!-- ✓ Correct -->
<a href="#" class="btn btn-ghost btn-sm p-1"
   aria-label="Edit: Urban forests as essential infrastructure">
  <i class="if if-edit" aria-hidden="true"></i>
</a>

<!-- ✗ Wrong -->
<a href="#" aria-label="Edit">
  <i class="if if-edit" aria-hidden="true"></i>
</a>
```

**B5. Links vs buttons.** `<a href>` navigates (changes the URL or goes somewhere). `<button>` acts (triggers behaviour without navigation). Never use `<a>` without `href`. Never use `<div>` or `<span>` as a clickable element.

**B6. `aria-current` for active state.** Use `aria-current="page"` on the active link in navigation. Do not rely on `class="active"` alone — it is invisible to assistive technology.

```html
<!-- ✓ Correct -->
<a href="/research" class="nav-link" aria-current="page">Research output</a>
```

---

### C. Forms

**C1. Every `<input>`, `<select>`, and `<textarea>` has a visible `<label>`.** `placeholder` is not a label — it vanishes on focus, has insufficient contrast, and is not announced reliably by all screen readers. Use `<label for="id">` always.

The only acceptable exception: a search input inside `<form role="search">` may use a visually-hidden label if a visible one would be redundant given surrounding context — but the label must still exist in the DOM.

```html
<!-- ✓ Correct — visually-hidden label for search -->
<form role="search" aria-label="Search research output">
  <label for="q" class="visually-hidden">Search by title, author, or DOI</label>
  <input type="search" id="q" name="q" placeholder="Search…">
  <button type="submit">Search</button>
</form>
```

**C2. Required fields: `required` attribute + visible indicator + screen reader announcement.**

```html
<!-- ✓ Correct -->
<label for="title" class="form-label">
  Title <span class="text-danger" aria-label="required">*</span>
</label>
<input type="text" id="title" class="form-control" required autocomplete="off">
```

**C3. Validation errors: `aria-describedby` + `aria-invalid` + focus management.** After a failed submit, move focus to the first invalid field or to an error summary at the top of the form.

```html
<!-- ✓ Correct -->
<label for="year" class="form-label">Year</label>
<input type="number" id="year" class="form-control is-invalid"
  aria-describedby="year-error" aria-invalid="true" required>
<div id="year-error" class="invalid-feedback" role="alert">
  Year is required and must be a 4-digit number.
</div>
```

**C4. Grouped controls use `<fieldset>` and `<legend>`.** This applies to:
- The open access status radio group (deposit flow)
- Every checkbox filter group in `bt-facets-col`
- Any set of related checkboxes or radio buttons anywhere

```html
<!-- ✓ Correct -->
<fieldset>
  <legend class="form-label">Open access status</legend>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="oa" id="oa-open" value="open" checked>
    <label class="form-check-label" for="oa-open">Open access</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="oa" id="oa-restricted" value="restricted">
    <label class="form-check-label" for="oa-restricted">Restricted</label>
  </div>
</fieldset>
```

**C5. Autocomplete on personal data fields.** Any field that collects user-identifiable data must carry `autocomplete`. Minimum: `name`, `email`, `organization`. This is a WCAG 1.3.5 requirement.

**C6. `<button type="submit">` inside every form.** Progressive enhancement: the form must be submittable without JavaScript and without HTMX. A real `action` attribute on `<form>` and a real submit button.

---

### D. Dynamic content and HTMX

**D1. Every `hx-get` / `hx-post` has `hx-indicator`.** No silent loading states. The indicator element uses `aria-live="polite"`.

```html
<!-- ✓ Correct -->
<input hx-get="/search" hx-trigger="keyup changed delay:300ms"
  hx-target="#results" hx-indicator="#search-indicator">
<span id="search-indicator" class="htmx-indicator" aria-live="polite">Searching…</span>
```

**D2. Live regions must be in the DOM before the swap.** HTMX cannot inject an `aria-live` region and have it work immediately — screen readers only observe regions that existed at page load. The result count, status messages, and error regions must be present (even if empty) in the initial HTML.

```html
<!-- ✓ Correct — empty on load, populated by HTMX -->
<span aria-live="polite" id="result-count">4,831 records</span>
<span id="save-status" role="status" aria-live="polite"></span>
```

**D3. `role="status"` vs `role="alert"`.** Use `role="status"` (polite) for confirmations: saved, copied, updated. Use `role="alert"` (assertive) only for errors that block the user. Never use `role="alert"` for success messages — it interrupts whatever the screen reader was doing.

**D4. Focus management after swaps.**
- Search results swap → focus stays on the search input. Do not move it.
- Deposit step advance → move focus to the new step's `<h2>` (add `tabindex="-1"` to the heading, call `.focus()`).
- Modal close → return focus to the element that opened the modal.
- HTMX partial that replaces a section the user was interacting with → move focus to the replaced region's first meaningful element.

**D5. `hx-target` selectors must exist in the DOM at request time**, not just at page load. If the target is conditionally rendered, use `hx-swap="outerHTML"` on the element itself or ensure the container is always present.

---

### E. Keyboard navigation

**E1. Tab order follows visual reading order.** Never use `tabindex` values above 0.

**E2. `tabindex="-1"` for programmatic focus targets only.** Section headings that receive focus after an HTMX swap, error summaries, modal containers. Not for anything that should be in the natural tab flow.

**E3. Modal focus trap.** When a Bootstrap modal opens: focus moves to the first focusable element inside the modal. Tab cycles within the modal. Escape closes it and returns focus to the trigger. Bootstrap handles this — do not override it.

**E4. Dropdowns.** Bootstrap dropdown keyboard handling is correct (Enter/Space open, Arrow keys navigate items, Escape closes). Do not replace Bootstrap dropdowns with custom implementations.

**E5. Toggle buttons use `aria-pressed`, not `role="tab"`.** The view toggle (card/table view) is a pair of toggle buttons, not a tab panel. `role="tab"` requires an associated `role="tabpanel"` and Arrow-key navigation — that is not what this component does.

```html
<!-- ✓ Correct -->
<div class="view-toggle" role="group" aria-label="Switch view">
  <button type="button" class="view-toggle-btn is-active"
    aria-pressed="true" aria-label="Card view">
    <i class="if if-list" aria-hidden="true"></i>
  </button>
  <button type="button" class="view-toggle-btn"
    aria-pressed="false" aria-label="Table view">
    <i class="if if-table" aria-hidden="true"></i>
  </button>
</div>
```

**E6. Stepper links.** The deposit flow `bt-stepper__item` elements are links (`<a href>`) pointing to named sections on the same page. They navigate — `<a>` is correct. `aria-current="step"` on the active one.

---

### F. Tables

**F1. `<th scope="col">` on every column header.** Never `<td>` for a header cell.

**F2. Table has an accessible name.** Use `aria-label` on `<table>`. A `<caption>` is the semantic alternative but renders visually and requires hiding — `aria-label` is cleaner here.

**F3. Sortable columns announce sort state** using `aria-sort` on the `<th>`. Valid values: `ascending`, `descending`, `none`. The button inside the `<th>` handles the click — `aria-sort` lives on the `<th>`, not the button.

```html
<!-- ✓ Correct -->
<th scope="col" aria-sort="descending">
  <button type="button" class="btn btn-ghost btn-sm p-0"
    aria-label="Sort by year, currently descending">
    Year <i class="if if-caret-down if--xs" aria-hidden="true"></i>
  </button>
</th>
```

**F4. Select-all checkbox communicates indeterminate state to AT.**

```javascript
// ✓ Correct — update both the property and the label
selectAll.indeterminate = true;
selectAll.setAttribute('aria-label', 'Some records selected — click to select all');
```

**F5. Bulk action bar uses `hidden` attribute**, not CSS `display:none` or `visibility:hidden`. `hidden` is what AT uses to determine whether content is available. Toggle it with `element.hidden = true/false`.

```html
<!-- ✓ Correct — hidden attribute; role=toolbar because arrow-key nav is appropriate for bulk actions -->
<div class="bt-toolbar" id="bulk-bar" role="toolbar" aria-label="Bulk actions" hidden>
```

---

### G. Colour and contrast

**G1. Contrast ratios (WCAG 2.1 AA).**
- Normal text (< 18px regular, < 14px bold): **4.5:1**
- Large text (≥ 18px regular, ≥ 14px bold): **3:1**
- UI component boundaries (input borders, button outlines, focus rings): **3:1** against adjacent colour

**G2. Focus ring must be visible against both the element and the page background.** `--bt-focus-ring` must meet 3:1 in both contexts. Verify when adding new surface colours.

**G3. Never convey information by colour alone.** Status badges (`Published`, `Draft`, `Locked`) use colour + text label — correct. `badge-oa` and `badge-restricted` use colour + text — correct. A purely colour-coded dot or border with no text equivalent fails WCAG 1.4.1.

**G4. `text-muted` (`--bt-gray-500`) on white is borderline.** Only use it for supplementary, non-critical content: publication year, secondary author lines, helper text. Never for primary information the user needs to complete a task.

**G5. WCAG 2.2 — focus appearance (AA, new in 2.2).** The focus indicator must have a minimum area and contrast. The current `outline: 3px solid var(--bt-focus-ring)` satisfies this for most elements — do not reduce outline width or offset below these values.

---

### H. Public surface specifics

The public site is read by researchers, students, and automated agents (crawlers, citation managers, accessibility overlays). Semantic correctness here is both an accessibility and an interoperability concern.

**H1. Research output cards are `<article>` elements.** Give each an accessible name via `aria-labelledby` pointing to its `card-title` heading. When dynamic IDs are impractical, `aria-label` with the title string is acceptable.

```html
<!-- ✓ Preferred -->
<article aria-labelledby="card-title-01k9">
  <h2 id="card-title-01k9" class="card-title"><a href="…">Urban forests…</a></h2>
</article>
```

**H2. Detail page sections use `<section aria-labelledby="…">`.** The heading `id` must exactly match the `aria-labelledby` value. This lets screen reader users navigate by region.

**H3. Breadcrumb: `<nav aria-label="Breadcrumb">` + `<ol>` + `aria-current="page"` on the last item.** `<ol>` because position in the hierarchy is meaningful.

**H4. Structured data (`<script type="application/ld+json">`) on every public record page.** This is how reference managers and accessibility overlays read metadata when the HTML rendering is not available. Minimum: `@type`, `headline`, `author[]`, `datePublished`, `identifier` (DOI), `license` (when OA).

**H5. Tab panel pattern for citation formats.** The cite modal uses Bootstrap tabs. Each `<button role="tab">` must have `aria-controls` pointing to its panel, and each panel must have `role="tabpanel"` and `aria-labelledby` pointing back to its tab. Bootstrap handles this — do not strip the data attributes.

---

### I. Backoffice surface specifics

Staff use this all day. Every extra announcement or unnecessary focus jump costs time at scale. Correctness and efficiency are equally important.

**I1. `bt-toolbar` is not a landmark and does not need `role`.** It is a styled div, not a navigation or toolbar in the ARIA sense. Only add `role="toolbar"` when all children are navigable with Arrow keys — the regular page toolbar is not, so it gets no role. The bulk action bar gets `role="toolbar"` because it is a grouped set of actions on the current selection.

**I2. Filter tags: label describes the action and the value.**

```html
<!-- ✓ Correct -->
<button type="button" class="filter-tag"
  aria-label="Remove filter: Type is Journal article">
  Type: Journal article <i class="if if-close" aria-hidden="true"></i>
</button>
```

**I3. Facet checkboxes include the count in their `aria-label`.** The visible count has `aria-hidden="true"`. The label carries both name and count so screen reader users get the same information as sighted users.

```html
<!-- ✓ Correct -->
<input type="checkbox" id="f-journal"
  class="form-check-input" checked
  aria-label="Journal article (1,234 records)">
<label for="f-journal">Journal article</label>
<div class="bt-facet-count" aria-hidden="true">1,234</div>
```

**I4. Deposit flow: `aria-current="step"` on the active stepper item.** Not `aria-current="page"` — the URL does not change between steps.

---

### J. Motion

**J1. All transitions and animations use token durations** (`--bt-dur-fast`, `--bt-dur-base`). The reduced-motion rule in `_accessibility.scss` sets all durations to `.01ms` for users who have `prefers-reduced-motion: reduce` enabled. Custom `transition` or `animation` values set outside these tokens bypass this.

**J2. SVG ink animations** in `_svg-animations.scss` are suppressed correctly by the global reduced-motion rule — no extra work needed there. Do not add `@keyframes` that are not caught by the universal selector override.

---

### Pre-flight checklist — run before finalising any template

```
□ <html lang="en"> present
□ Exactly one <h1>, logical heading hierarchy, no skipped levels
□ <main id="main-content"> present
□ Skip link is first focusable element in layout wrapper
□ Every <nav> has a distinct aria-label
□ Every icon-only button: aria-label on button, aria-hidden on icon
□ Every row action label includes the record name
□ No aria-label that duplicates or overrides visible button text
□ aria-current="page" (or "step") on all active nav links
□ Every <input>/<select>/<textarea> has a <label for>
□ No placeholder used as the sole label
□ Required fields have required attribute + visible marker + aria-label="required"
□ Grouped radio/checkbox controls wrapped in <fieldset> + <legend>
□ Personal data fields have autocomplete attributes
□ Every hx-get/hx-post has hx-indicator with aria-live="polite"
□ All aria-live regions exist in DOM at page load (not injected by HTMX)
□ role="status" for confirmations, role="alert" for errors only
□ bulk-bar uses hidden attribute (not CSS display:none)
□ Table: aria-label on <table>, scope="col" on all <th>
□ Sortable columns: aria-sort on <th>
□ No information conveyed by colour alone
□ text-muted used only for supplementary, non-critical content
```

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
bt-navbar               bt-navbar__brand        bt-navbar__nav
bt-navbar__link         bt-navbar__sep
```
Note: `bt-navbar__brand` is used (backoffice logo link). `bt-navbar__mark` does NOT exist — do not use it.

**Toolbar & button groups**
```
bt-toolbar              bt-toolbar--bordered
bt-toolbar__left        bt-toolbar__right       bt-toolbar__middle
bt-toolbar__item        bt-toolbar__title
```
`bt-toolbar__item` elements are siblings within `bt-toolbar__left`/`bt-toolbar__right`/`bt-toolbar__middle` and get automatic padding between them.

**Avatar**
```
bt-avatar               bt-avatar--small        bt-avatar--large
```

**Hero (public surface)**
```
bt-hero                  bt-hero__bg              bt-hero__content
```

**Research card**
```
card-research           card-meta               card-actions
card-body               card-title              card-authors
card-publication
```

**Facets sidebar**
```
bt-facets                bt-facet-title           bt-facet-check
bt-facet-name            bt-facet-count           bt-facet-separator
```

**Sub-sidebar navigation**
```
bt-sub-sidebar           bt-sub-sidebar--bordered
```

**Backoffice list layout**
```
bt-content-area          bt-facets-col            bt-results-col
```
Use `bt-toolbar` for search/filter bars, bulk action bars, and pagination rows — not custom classes.

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
bt-blank-slate           bt-blank-slate--default  bt-blank-slate--muted
bt-blank-slate--primary
```
Note: BEM modifier double-dash (`--`). The old styleguide used single-dash — that was wrong.

**Deposit flow components**
```
bt-stepper               bt-stepper__item         bt-stepper__item--done
bt-stepper__num          bt-stepper__label        bt-stepper__required
bt-radio-card            bt-radio-card__body      bt-radio-card__group
bt-file-drop             bt-file-drop__icon       bt-file-drop__text
bt-file-drop__hint
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
bt-navbar__mark
bt-blank-slate-default   (replaced by bt-blank-slate--default)
bt-blank-slate-muted     (replaced by bt-blank-slate--muted)
bt-blank-slate-primary   (replaced by bt-blank-slate--primary)
bt-table                 (use Bootstrap .table .table-hover .align-middle)
bt-filter-bar            (use bt-toolbar)
bt-bulk-bar              (use bt-toolbar)
bt-pagination-bar        (use bt-toolbar)
bt-results-toolbar       (use bt-toolbar bt-toolbar--bordered)
is-selected on <tr>     (use Bootstrap .table-active)
td-title  td-meta  td-actions  td-actions-inner  row-actions   (use Bootstrap utilities directly)
u-scroll-wrapper        u-scroll-wrapper__body  (OLD layout system, removed)
bt-sidebar               (OLD narrow icon rail — removed in v2)
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
| `u-layout--app` | Backoffice list/detail pages | `.bt-navbar` + `.bt-sub-sidebar` + `<main>` |
| `u-layout--deposit` | Deposit flow | `.bt-navbar` + `.bt-stepper` + `<main>` |
| `u-layout--public` | Public search/detail | `.bt-navbar` + `<main>` |

Public `<main>` uses Bootstrap `.container` inside it for gutters — the shell itself has no `max-width` or padding.

`u-layout--app` supports an optional right panel with `.has-panel` on the shell.

**Deprecated layout classes (OLD system — do not use):**
`u-scroll-wrapper`, `u-scroll-wrapper__body`, `bt-sidebar`, `u-maximize-height`

---

## Naming conventions

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `bt-` | Bootstrap Custom — extends/wraps Bootstrap | `bt-navbar`, `bt-toolbar`, `bt-avatar` |
| `bt-` | Component — no Bootstrap base | `bt-facets`, `bt-stepper`, `bt-blank-slate` |
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
