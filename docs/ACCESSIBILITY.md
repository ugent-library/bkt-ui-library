# Accessibility rules

Target: **WCAG 2.1 AA** minimum on every template. WCAG 2.2 and stable WCAG 3
guidance applied where noted.

We build two things: a **public research repository** (anonymous users,
read-heavy, search + discovery, must work for screen reader users who cannot
see the visual layout) and a **backoffice data management app** (authenticated
library staff, task-heavy, CRUD + bulk operations + multi-step deposit forms,
used repeatedly all day — efficiency matters as much as correctness).

Static HTML can be produced correctly; runtime behaviour after HTMX swaps
cannot be tested by an agent. Screen reader testing with VoiceOver or NVDA is
a human responsibility.

The enforcement summary is the pre-flight checklist at the bottom of this
file — run it before finalising any template (`npm test`'s `check:a11y`
enforces a subset mechanically). The project-specific decisions the generic
WCAG rules don't cover are digested right below; the lettered sections hold
the full rules and reasoning.

## Project decisions the generic WCAG rules don't cover

One-line digest — reasoning and markup live in the lettered sections:

- **Record-card titles are surface-dependent (H1):** public cards are `<article>` with an `<h2>` title; backoffice cards use `<p class="bt-work-card__title">` — list-item navigation replaces heading-jump there. Both carry `aria-labelledby`.
- **The view toggle is a pair of buttons, not a tab panel (E5).**
- **`bt-toolbar` carries no `role` (I1)** — only the bulk action bar is `role="toolbar"`, and it hides with the `hidden` attribute, never `display:none` (F5).
- **Focus after swaps (D4):** search results — focus stays on the input; deposit step advance — focus to the new step's `<h2>`; modal close — back to the trigger.
- **Filter tags and facet checkboxes carry full labels (I2, I3):** action + value ("Remove filter: Type is Journal article"); facet labels include the count, visible count `aria-hidden`.
- **`text-muted` only for supplementary content (G4)** — never for information needed to complete a task.

---

## A. Page-level structure

**A1. One `<h1>` per page.** It names the current view. Heading hierarchy flows beneath it without skipping levels. In the backoffice, `<h1>Research output</h1>` is correct; `<h1>Biblio</h1>` is not — that names the application, not the view.

**A2. `<main id="main-content">` on every page.** This is the skip-link target and the primary landmark. There is exactly one `<main>` per page.

**A3. Skip link is the first focusable element inside the layout wrapper.** It targets `#main-content`. The current `.skip-link` implementation in `_accessibility.scss` uses `transform: translateY(-100%)` and reveals on `:focus` — this is correct. Do not replace it with `top: -999px` (breaks at high zoom).

```html
<!-- ✓ Inside u-layout--app, before bt-navbar -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**A4. `lang` attribute on `<html>`.** Always `<html lang="en">` for English content. For Dutch fragments: `<span lang="nl">&hellip;</span>`.

**A5. Every `<nav>` has a distinct `aria-label`.** When multiple navigation landmarks exist on one page, each must be uniquely named so a screen reader user can distinguish them.

```
Application navigation   ← bt-navbar primary nav
Section navigation       ← bt-sidebar
Breadcrumb               ← breadcrumb nav
Filter by                ← facet/filter aside (use aria-label on <aside>)
Results pagination       ← pagination nav
Results pagination (top) / (bottom) ← when one list repeats its pagination nav
```

Pagination labels in full — single bar, repeated bar, several lists on one page — are pinned in the kit: `patterns/pagination.html`.

**A6. Landmark regions used correctly.**
- `<header>` for the topbar (`bt-navbar`)
- `<main>` for primary content
- `<nav>` for navigation (with label — see A5)
- `<aside>` for facets and supplementary sidebars (with label)
- `<section aria-labelledby="&hellip;">` for named content sections on detail pages
- `<article>` for self-contained records (search result cards)
- Never use `<div>` where a semantic element applies

---

## B. Interactive elements — accessible names

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

## C. Forms

**C1. Every `<input>`, `<select>`, and `<textarea>` has a visible `<label>`.** `placeholder` is not a label — it vanishes on focus, has insufficient contrast, and is not announced reliably by all screen readers. Use `<label for="id">` always.

The only acceptable exception: a search input inside `<form role="search">` may use a visually-hidden label if a visible one would be redundant given surrounding context — but the label must still exist in the DOM.

**A wrapping label still carries `for`/`id`.** Wrap-only (implicit) association is valid HTML but Dragon NaturallySpeaking and Apple Voice Control don't recognise it — voice users can't say "Click <label text>" to reach the field. Explicit `for`/`id` inside the wrap fixes that while keeping the large hit area (TPGi, [Should form labels be wrapped or separate?](https://www.tpgi.com/should-form-labels-be-wrapped-or-separate/)). This is why `no-redundant-for` is off in `.htmlvalidate.json` — the "redundant" `for` is load-bearing. Applies to the file-drop zones.

```html
<!-- ✓ Correct — visually-hidden label for search -->
<form role="search" aria-label="Search research output">
  <label for="q" class="visually-hidden">Search by title, author, or DOI</label>
  <input type="search" id="q" name="q" placeholder="Search&hellip;">
  <button type="submit">Search</button>
</form>
```

**C2. Required fields: `required` attribute + visible indicator + screen reader announcement.**

```html
<!-- ✓ Correct -->
<label for="title" class="form-label">
  Title <span class="text-danger" aria-hidden="true">*</span>
</label>
<input type="text" id="title" class="form-control" required autocomplete="off">
```

The `*` is decorative (`aria-hidden`); assistive tech announces the field as required from the input's `required` attribute, not from a label on the asterisk — a `<span>` can't carry an accessible name.

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
- Every checkbox filter group in a filter `<aside>`
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

**Prototype exception:** prototype templates navigate between steps with `<a>` links, and those endpoints will never exist in the kit. A `<form>` that cannot satisfy this rule is omitted instead — mark the spot where the real implementation needs one:

```html
<!-- real impl: form POST /deposit/new -->
<div class="col-8">
```

Any `<form>` that *is* present must satisfy this rule (`npm run check:html` enforces it via `wcag/h32`).

---

## D. Dynamic content and HTMX

**D1. Every `hx-get` / `hx-post` has `hx-indicator`.** No silent loading states. The indicator element uses `aria-live="polite"`.

```html
<!-- ✓ Correct -->
<input hx-get="/search" hx-trigger="keyup changed delay:300ms"
  hx-target="#results" hx-indicator="#search-indicator">
<span id="search-indicator" class="htmx-indicator" aria-live="polite">Searching&hellip;</span>
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

## E. Keyboard navigation

**E1. Tab order follows visual reading order.** Never use `tabindex` values above 0.

**E2. `tabindex="-1"` for programmatic focus targets only.** Section headings that receive focus after an HTMX swap, error summaries, modal containers. Not for anything that should be in the natural tab flow.

**E3. Modal focus trap.** When a Bootstrap modal opens: focus moves to the first focusable element inside the modal. Tab cycles within the modal. Escape closes it and returns focus to the trigger. Bootstrap handles this — do not override it.

**E4. Dropdowns.** Bootstrap dropdown keyboard handling is correct (Enter/Space open, Arrow keys navigate items, Escape closes). Do not replace Bootstrap dropdowns with custom implementations.

**E5. We use button groups for view toggle buttons.** The view toggle (card/table view) is a pair of buttons, not a tab panel. `role="tab"` requires an associated `role="tabpanel"` and Arrow-key navigation — that is not what this component does. We do not invent a new view-toggle.

---

## F. Tables

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

## G. Colour and contrast

**G1. Contrast ratios (WCAG 2.1 AA).**
- Normal text (< 18px regular, < 14px bold): **4.5:1**
- Large text (≥ 18px regular, ≥ 14px bold): **3:1**
- UI component boundaries (input borders, button outlines, focus rings): **3:1** against adjacent colour

**G2. Focus ring must be visible against both the element and the page background.** `--bt-focus-ring` must meet 3:1 in both contexts. Verify when adding new surface colours.

**G3. Never convey information by colour alone.** Status badges (`Published`, `Draft`, `Locked`) use colour + text label — correct. A purely colour-coded dot or border with no text equivalent fails WCAG 1.4.1.

**G4. `text-muted` (`--bt-gray-500`) on white is borderline.** Only use it for supplementary, non-critical content: publication year, secondary author lines, helper text. Never for primary information the user needs to complete a task.

**G5. WCAG 2.2 — focus appearance (AA, new in 2.2).** The focus indicator must have a minimum area and contrast. The current `outline: 3px solid var(--bt-focus-ring)` satisfies this for most elements — do not reduce outline width or offset below these values.

---

## H. Public surface specifics

The public site is read by researchers, students, and automated agents (crawlers, citation managers, accessibility overlays). Semantic correctness here is both an accessibility and an interoperability concern. The authoritative contract for crawl semantics, structured data, and render formats is raven's `docs/public-site-semantics.md`.

**H1. Research output cards are `<article>` elements.** On the **public surface**, the title is an `<h2>` — each card is a self-contained document fragment (it gets indexed, cited, shared). On the **backoffice surface**, the title is a `<p class="bt-work-card__title">` — the page is a list of records, not a stack of mini-documents, and 12–100 `<h2>`s under one `<h1>` mis-describes the page structure. Both variants get an accessible name via `aria-labelledby` pointing at the title's `id` (this works on any element with an id, not just headings). The backoffice list-item navigation (NVDA `I`, JAWS list mode) replaces heading-jump as the way to traverse records.

```html
<!-- ✓ Public surface -->
<article aria-labelledby="card-title-01k9">
  <h2 id="card-title-01k9" class="bt-work-card__title"><a href="&hellip;">Urban forests&hellip;</a></h2>
</article>

<!-- ✓ Backoffice surface -->
<li>
  <article aria-labelledby="card-title-01k9">
    <p id="card-title-01k9" class="bt-work-card__title"><a href="&hellip;">Urban forests&hellip;</a></p>
  </article>
</li>
```

**H2. Detail page sections use `<section aria-labelledby="&hellip;">`.** The heading `id` must exactly match the `aria-labelledby` value. This lets screen reader users navigate by region.

**H3. Breadcrumb: `<nav aria-label="Breadcrumb">` + `<ol>` + `aria-current="page"` on the last item.** `<ol>` because position in the hierarchy is meaningful.

**H4. Structured data on every public record page.** Include `<script type="application/ld+json">` with schema.org markup — this is how reference managers and accessibility overlays read metadata when the HTML rendering is not available. Minimum payload for a research output:

- `@type: "ScholarlyArticle"` (or `Dataset`, `SoftwareSourceCode` etc.)
- `headline`, `author[]`, `datePublished`, `publisher`, `isPartOf` for journal
- `license` as a URL when open access
- `identifier` with DOI

The authoritative contract for public crawl semantics, structured data, and render formats is raven's `docs/public-site-semantics.md`, audited by Rubric. Check it before changing anything a crawler or reference manager consumes.

**H5. Tab panel pattern for citation formats.** The cite modal uses Bootstrap tabs. Each `<button role="tab">` must have `aria-controls` pointing to its panel, and each panel must have `role="tabpanel"` and `aria-labelledby` pointing back to its tab. Bootstrap handles this — do not strip the data attributes.

---

## I. Backoffice surface specifics

Staff use this all day. Every extra announcement or unnecessary focus jump costs time at scale. Correctness and efficiency are equally important.

**I1. `bt-toolbar` is not a landmark and does not need `role`.** It is a styled div, not a navigation or toolbar in the ARIA sense. Only add `role="toolbar"` when all children are navigable with Arrow keys — the regular page toolbar is not, so it gets no role. The bulk action bar gets `role="toolbar"` because it is a grouped set of actions on the current selection.

**I2. Filter tags: label describes the action and the value.**

```html
<!-- ✓ Correct -->
<button type="button" class="badge badge--outline"
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
<span class="text-muted small" aria-hidden="true">1,234</span>
```

---

## J. Motion

**J1. All transitions and animations use token durations** (`--bt-dur-fast`, `--bt-dur-base`). The reduced-motion rule in `_accessibility.scss` sets all durations to `.01ms` for users who have `prefers-reduced-motion: reduce` enabled. Custom `transition` or `animation` values set outside these tokens bypass this.

**J2. SVG ink animations** in `_svg-animations.scss` are suppressed correctly by the global reduced-motion rule — no extra work needed there. Do not add `@keyframes` that are not caught by the universal selector override.

**J3. Reduced-motion has one owner.** Durations are handled only in `base/_accessibility.scss` — never re-tuned in component partials. A component may carry its own `prefers-reduced-motion` block only to swap in a replacement rendering (`_svg-animations.scss` hides the SMIL layer). Named exceptions live next to the global rule.

---

## Pre-flight checklist — run before finalising any template

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
□ Required fields have required attribute + visible marker (aria-hidden)
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
