# AGENT.md
# Working guidelines for AI-assisted development on this project

This file is written by AI, for AI.
It documents what this project is, what I tend to get wrong, and what I must verify before producing code.
Add it to the root of any project where I'm a regular collaborator.

---

## Session start — do this first, every time

When a new session begins on this project, execute these steps before writing any code or HTML:

1. **Read the docs folder** — read all relevant files before writing code:
   - `docs/DOMAIN-VOCABULARY.md` — entity vocabulary, status values, badge mappings, profile system, review workflow
   - `docs/DOMAIN-CONTEXT.md` — how this repo connects to the `raven` backend, data flow, what is out of scope
   - `docs/UI-LAYER.md` — surface system, CSS distribution, HTMX rules, template map
   - `docs/CONSUMING-BOOKTOWER.md` — how to use this UI library correctly inside another project
   - `docs/JAVASCRIPT.md` — JS file registry, event contract, loading order
   - `docs/SEARCH-AND-FILTERING.md` — the search & filtering interaction model (URL-is-truth, suggestion routing, dimension placement, public vs backoffice); read when touching any search box, facet sidebar, or filter picker
   - `docs/ISSUE-TEMPLATE.md` — template and anti-rot rules for implementation issues (read when drafting an issue)

2. **Check the verified class list** — the complete class list in this file (AGENT.md) is the working reference for CSS class names. Do not guess names not on that list. If verifying something not listed, read `assets/booktower.css` directly.

3. **Identify the surface** — before writing the first line of HTML, confirm whether this is a `public` or `backoffice` page. If uncertain, ask.

4. **Answer the plain-language layout questions** — before choosing layout classes, read the “Questions to answer before writing layout HTML” section in `docs/CONSUMING-BOOKTOWER.md`.

5. **Run the pre-flight checklist** — before finalising any template, run the accessibility checklist at the bottom of this file.

### Recommended session-start prompt (paste this at the start of a new conversation)

```
Read /Users/mietclaes/Sites/booktower-ui-library/AGENT.md and follow
the session start instructions, including reading the docs/ files listed in
step 1 below. You're working on the booktower-ui-library.
```

---

## What this project is

A design system and prototype environment for **biblio.ugent.be** — Ghent University's research output repository. It serves two distinct user contexts that must never be conflated:

- **Public** — researchers, readers, the open web. Knowledge is the subject.
- **Backoffice** — curators, librarians, depot workers. Work is the subject.

The system is HTMX-first, Bootstrap-based, semantically correct HTML, progressively enhanced, accessible by default. It is not a React app. It is not a SPA. Server-side rendering, stable URLs, graceful degradation are not constraints — they are the architecture.

---

## What lives where

Four tools, one lane each. Don't duplicate one in another.

| Tool | Owns |
|------|------|
| **ProductBoard** | Demand and priority — user needs and feedback, feature requests, the problem a page solves, roadmap status. The *why at the user-need level*. |
| **booktower-ui-library** (this repo) | The prototype and the design system — HTML, CSS classes, layout and interaction, the UI *how*. Concepts are prototyped here, not defined here. |
| **Raven** | The backend and the source of truth for the domain model — schema, field registry, work/organization/project catalogs, subtypes. What a concept *is*. |
| **GitHub issues** (raven repo) | The build — implementation scope and acceptance criteria, following raven's issue → branch → commit → PR chain. Drafted with the `biblio-issue-writer` skill. |

The flow: demand starts in ProductBoard → gets prototyped here → domain concepts get modelled in Raven → work is tracked as GitHub issues. See raven's `CLAUDE.md` for the backend and git rules.

---

## The surface system

Every layout container must carry `data-surface="public"` or `data-surface="backoffice"`. This is not optional decoration — it activates surface tokens that change typography, density, and visual weight throughout the component tree.

```
Public:     system-UI headings weight 700, blue-800 · 16px body · 1.6 leading · italic .lead · warm off-white bg (--bt-bg-paper #faf8f6)
Backoffice: system-UI headings weight 600, blue-900 · 15px body · 1.5 leading · upright .lead · white bg
```

No web fonts — all typefaces are OS-native. `foundation/_surfaces.scss` wins when this table disagrees with it. Surfaces mix within a page: both surface attributes carry their own tokens, and every `[data-surface]` boundary applies its own body size/leading/colour.

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

**A4. `lang` attribute on `<html>`.** Always `<html lang="en">` for English content. For Dutch fragments: `<span lang="nl">&hellip;</span>`.

**A5. Every `<nav>` has a distinct `aria-label`.** When multiple navigation landmarks exist on one page, each must be uniquely named so a screen reader user can distinguish them.

```
Application navigation   ← bt-navbar primary nav
Section navigation       ← bt-sidebar
Breadcrumb               ← breadcrumb nav
Filter by                ← facet/filter aside (use aria-label on <aside>)
Results pagination       ← pagination nav
```

**A6. Landmark regions used correctly.**
- `<header>` for the topbar (`bt-navbar`)
- `<main>` for primary content
- `<nav>` for navigation (with label — see A5)
- `<aside>` for facets and supplementary sidebars (with label)
- `<section aria-labelledby="&hellip;">` for named content sections on detail pages
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
  <input type="search" id="q" name="q" placeholder="Search&hellip;">
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

---

### D. Dynamic content and HTMX

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

### E. Keyboard navigation

**E1. Tab order follows visual reading order.** Never use `tabindex` values above 0.

**E2. `tabindex="-1"` for programmatic focus targets only.** Section headings that receive focus after an HTMX swap, error summaries, modal containers. Not for anything that should be in the natural tab flow.

**E3. Modal focus trap.** When a Bootstrap modal opens: focus moves to the first focusable element inside the modal. Tab cycles within the modal. Escape closes it and returns focus to the trigger. Bootstrap handles this — do not override it.

**E4. Dropdowns.** Bootstrap dropdown keyboard handling is correct (Enter/Space open, Arrow keys navigate items, Escape closes). Do not replace Bootstrap dropdowns with custom implementations.

**E5. We use button groups for view toggle buttons.** The view toggle (card/table view) is a pair of buttons, not a tab panel. `role="tab"` requires an associated `role="tabpanel"` and Arrow-key navigation — that is not what this component does. We do not invent a new view-toggle.

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

**G3. Never convey information by colour alone.** Status badges (`Published`, `Draft`, `Locked`) use colour + text label — correct. A purely colour-coded dot or border with no text equivalent fails WCAG 1.4.1.

**G4. `text-muted` (`--bt-gray-500`) on white is borderline.** Only use it for supplementary, non-critical content: publication year, secondary author lines, helper text. Never for primary information the user needs to complete a task.

**G5. WCAG 2.2 — focus appearance (AA, new in 2.2).** The focus indicator must have a minimum area and contrast. The current `outline: 3px solid var(--bt-focus-ring)` satisfies this for most elements — do not reduce outline width or offset below these values.

---

### H. Public surface specifics

The public site is read by researchers, students, and automated agents (crawlers, citation managers, accessibility overlays). Semantic correctness here is both an accessibility and an interoperability concern.

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

**H4. Structured data (`<script type="application/ld+json">`) on every public record page.** This is how reference managers and accessibility overlays read metadata when the HTML rendering is not available. Minimum: `@type`, `headline`, `author[]`, `datePublished`, `identifier` (DOI), `license` (when OA).

**H5. Tab panel pattern for citation formats.** The cite modal uses Bootstrap tabs. Each `<button role="tab">` must have `aria-controls` pointing to its panel, and each panel must have `role="tabpanel"` and `aria-labelledby` pointing back to its tab. Bootstrap handles this — do not strip the data attributes.

---

### I. Backoffice surface specifics

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

### J. Motion

**J1. All transitions and animations use token durations** (`--bt-dur-fast`, `--bt-dur-base`). The reduced-motion rule in `_accessibility.scss` sets all durations to `.01ms` for users who have `prefers-reduced-motion: reduce` enabled. Custom `transition` or `animation` values set outside these tokens bypass this.

**J2. SVG ink animations** in `_svg-animations.scss` are suppressed correctly by the global reduced-motion rule — no extra work needed there. Do not add `@keyframes` that are not caught by the universal selector override.

**J3. Reduced-motion has one owner.** Durations are handled only in `base/_accessibility.scss` — never re-tuned in component partials. A component may carry its own `prefers-reduced-motion` block only to swap in a replacement rendering (`_svg-animations.scss` hides the SMIL layer). Named exceptions live next to the global rule.

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
Rules: section A above (page structure), H1 (record cards).

### Forms
Rules: section C above.

### HTMX
Behavioural rules: section D above, plus C6 (progressive enhancement).
Unique here: all `hx-*` URLs in templates are stubs — documentation of
intent, not working code.

### Template states
Data-dependent variants of a template (empty, no-files, filled&hellip;) are **states
inside the one template file**, never separate files.

Syntax: declare `<!-- @states: default, other -->` in the leading meta-comment block
(beside `@title`/`@surface`); wrap each variant in `<!-- @state: name -->` &hellip; `<!-- @state -->`;
markup outside any wrapper shows in every state; the **first declared state is the
default**; `?state=<name>` renders one, and the kit shows a button per state. Full
behaviour: `docs/SERVER.md` → Template states. Example: `biblio-public/public-work-detail.html`.

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

Machine-checkable via `npm test` (see the README). `check:classes` reports
undefined and unused classes — keep both at zero. `check:partials` runs inside
the build and fails it on any partial `booktower.scss` doesn't `@use`.

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
bt-title-toolbar
```
`bt-toolbar__item` elements are siblings within `bt-toolbar__left`/`bt-toolbar__right`/`bt-toolbar__middle` and get automatic padding between them. Give each toolbar action its own `bt-toolbar__item` rather than wrapping actions in a flex group.
`bt-title-toolbar` is a flex row for pairing a heading with a right-aligned action button.

**Avatar**
```
bt-avatar               bt-avatar--xsmall       bt-avatar--small
bt-avatar--large        bt-avatar--outline      bt-avatar--square
bt-avatar__img
```
Note: `bt-avatar` combined with a Bootstrap background utility (`.bg-primary`,
`.bg-success`, `.bg-warning`, `.bg-danger`) automatically forces white text and
icon colour. No extra class needed for coloured initials chips.
On a `<button>`, use `bt-avatar` alone — never with `.btn`; the avatar owns
its own button reset.

**Hero (public surface)**
```
bt-hero                  bt-hero__bg              bt-hero__content
input-group--hero
```

**Landing page sections (public surface)**
```
bt-section-landing       bt-section-landing--border   bt-section-landing--light
bt-section-detail
```

**Suggestion / autocomplete panel**
```
bt-suggest-panel         bt-suggest-panel__body
token-suggestions        token-suggestions__group  token-suggestions__item
token-suggestions__hint  token-suggestions__footer token-suggestions__syntax-link
```

**Token search bar**
```
token-bar                token-bar__display        token-bar__token
token-bar__field         token-bar__sep            token-bar__value
token-bar__token--negated
token-bar__input         token-bar__clear          token-bar__indicator
```

**People search results**
```
people-results           people-result             people-result__meta
people-result__meta-item people-result.is-selected
people-result__icon      people-result__name
```

**Scroll utility**
```
bt-scroll-frame          bt-code-block            bt-table-sticky-col
bt-dropdown-scroll
```
`bt-table-sticky-col` on a `.table` inside `.table-responsive` pins the first column while the rest scrolls horizontally. `bt-dropdown-scroll` is the scrollable inner list for a dropdown-menu with a fixed header (e.g. the filter picker's search box); per-dropdown width via `--bs-dropdown-min-width`.

**Work card**
```
bt-work-card            bt-work-card--border-bottom
bt-work-card__title     bt-work-card__authors   bt-work-card__pub
bt-meta-list            bt-meta-list__item      bt-meta-list__item-bordered
```
Note: `bt-work-card` uses Bootstrap's `.card` as the structural base. Internal regions
use Bootstrap's own `.card-header`, `.card-body`, and `.card-footer` — not BEM elements.
`bt-work-card--researcher` and `bt-work-card__head`/`__body`/`__foot` do NOT exist in SCSS.

**Title element — surface-dependent.** On `data-surface="public"` the title is `<h2 class="bt-work-card__title">`; on `data-surface="backoffice"` it is `<p class="bt-work-card__title">`. See rule H1 above. The class is purely visual styling — SCSS does not require any specific tag.

**List wrapper.** Cards rendered as a list of results belong inside `<ol class="list-group list-group-flush list-unstyled mb-0">` with each card wrapped in `<li>`. A plain `<section>` wrapper is wrong: it is an unlabelled landmark and AT cannot announce a count.

**Facets sidebar**
Use Bootstrap structure directly: `fieldset`, `legend`, `form-check`, `form-check-input`, `form-check-label`, spacing utilities, and Collapse where needed.
Note: the old custom facet classes (`bt-facets`, `bt-facet-name`, `bt-facet-separator`, `bt-results-col`) do not exist in this system.
Show-more toggle: for a long facet list, put the overflow in `<div class="collapse">` and a `data-bs-toggle="collapse"` button with `if-chevron-down` after it. The caret rotates via `[aria-expanded="true"]`, so the button must carry `aria-expanded="false"` when the list starts collapsed (do not rely on `.collapsed`, which Bootstrap only adds after the first click). Documented at `/patterns/facets.html`.

**Sub-sidebar navigation**
```
bt-sidebar               bt-sidebar--bordered    bt-sidebar--slim
bt-sidebar__toggle       bt-sidebar__label       bt-sidebar__group-label
```
Note: `.bt-sidebar a.nav-link` already applies `display:flex`, `align-items:center`,
`gap`, and padding. Do not add `d-flex`/`align-items-center`/`gap-*`/`p-*`
utilities on nav links inside `bt-sidebar` — they are redundant.

**Backoffice list layout**
Note: `bt-sidebar` is the sticky `<aside>` wrapping the facet groups. Results layouts now use `u-main__body`, `u-main__sidebar`, `u-main__content`, `u-main__content-header`, and `u-main__content-body`.
Use `bt-toolbar` for search/filter bars, bulk action bars, and pagination rows — not custom classes.

**Table**

Use Bootstrap classes directly: `<table class="table table-hover align-middle">`. Apply `text-uppercase text-muted small` to `<thead>`. No custom table classes exist in this system.

For title cells: `fw-semibold text-reset text-decoration-none` on the link, `small text-muted mt-1` on the secondary line. For action cells: `text-end` on `<td>`, then `btn-ghost btn-sm` buttons directly inside.

Row selection state: Bootstrap's `.table-active` on `<tr>`. The CSS tokens `--bs-table-active-bg` and `--bs-table-hover-bg` are overridden in `_layouts.scss` to match design system colours. Action buttons use `btn-ghost` which is already visually quiet at rest — no reveal mechanism needed.

**Empty states**
```
bt-blank-slate           bt-blank-slate--muted
bt-blank-slate--primary
```

**Deposit flow components**
```
bt-btn-check__group (works with btn-check from bootstrap)
bt-file-drop             bt-file-drop__icon       bt-file-drop__text
bt-file-drop__hint
```

**Filter chips**
```
filter-chip-group
```
Applied-filter chips are clickable badges — `badge badge--outline` on a `<button>`/`<a>` (see Badges). `filter-chip-group` joins two into a split label + remove pill. Display-only summaries use `badge text-bg-primary-light`. The "Add filter" dropdown's scrollable list uses the generic `bt-dropdown-scroll` (see Scroll utility). Defined in `patterns/_filters.scss`.

**Panel** (`bt-panel`: generic popover panel — title + scrollable body + actions footer)
```
bt-panel                 bt-panel--wide           bt-panel__title
bt-panel__actions        bt-panel__body           bt-panel__body--checklist
bt-panel__body--boolean  bt-panel__body--form     bt-panel__body--year
bt-panel__year-input
```
Sizes to content by default; `bt-panel--wide` (480px cap) is the filter-editor case. Used by the add-to-list picker and the `filter-bar.js` filter editors. Body layouts (`--checklist/--boolean/--year/--form`) are generic. Defined in `patterns/_panel.scss`.

**HTMX state classes**
```
htmx-indicator          htmx-swapping           htmx-settling
```

**Badges**

Colour with `text-bg-*`, never `bg-*` + `text-*` — the latter skips the
`_badges.scss` token overrides and silently falls back to stock Bootstrap colour.
`text-bg-*` owns the foreground, so don't add `text-white`/`text-dark`; icons
inherit it. The overrides use `!important` to beat Bootstrap's own `!important`
on `.text-bg-*` — don't remove it.
```
badge.text-bg-primary        badge.text-bg-primary-light
badge.text-bg-success        badge.text-bg-success-light
badge.text-bg-warning        badge.text-bg-warning-light
badge.text-bg-danger         badge.text-bg-danger-light
badge.text-bg-info           badge.text-bg-info-light      (submitted status — blue-600)
badge.text-bg-secondary      badge.text-bg-light           (neutral: gray-50 fill, dark text — needs .border to be visible on white)
badge.bg-transparent         badge.badge--outline          badge--total
```
Solid badges need a dark-enough background to clear WCAG AA with white text —
success uses green-700, danger red-600 (their 500/600 steps fail). Warning is the
exception: no amber passes with white, so it's dark text on orange-500. Size is
fixed at `--bt-text-xs` (12px), not Bootstrap's `.75em`, which shrinks to 9px
inside `bt-meta-list`.

The neutral / metadata badge (counts, codes, roles) is `badge text-bg-light
border` — a utility composition, not its own class. `text-bg-light` is borderless
by default; add `.border` when the chip needs to stand out on white.

Clickable badge: a `<button>` or `<a>` carrying `.badge` is styled squared (vs the
pill status badge) with pointer + hover + focus — element-based, no extra class.
Pick the look with `badge--outline` or `text-bg-*`. This is the only case where a
badge is interactive; a plain status badge stays a `<span>`. Used for filter chips.

**Buttons**
`btn-xs` (extra small), `btn-sm`, `btn`, `btn-lg` are all defined. All standard Bootstrap
variants (`btn-primary`, `btn-secondary`, `btn-ghost`, `btn-success`, `btn-warning`,
`btn-danger`, `btn-info`, `btn-light`, `btn-dark`, `btn-link`) and all `btn-outline-*` variants are overridden with Booktower tokens.

**Layout shells**
```
u-layout--app           u-layout--public
```

**Main area regions (inside `u-layout--app`)**
```
u-main__header
u-main__body            u-main__body--split
u-main__sidebar         u-main__sidebar--border-right   u-main__sidebar--border-left
u-main__content
u-main__content-header  u-main__content-body    u-main__content-footer
u-main__footer
u-main__panel
```

**Overlay regions (body-level, outside the shell grid)**
```
u-notifications
```
Fixed top-right stack for transient notifications. Structural only — it positions,
stacks, and z-indexes (`--bt-z-overlay`) whatever fragments land in it; the
contents (e.g. `.alert`) bring their own styling and dismissal. The consumer never
sets `z-index`.

**App nav sidebar**
```
bt-sidebar              bt-sidebar--bordered    bt-sidebar--slim    bt-sidebar--flush
bt-sidebar__toggle      bt-sidebar__label       bt-sidebar__group-label
badge--total
```

**Footer**
```
nav-title
```

**Typography helpers** ⚠️ TBD — may not survive review
```
bt-meta-text            bt-text-xsmall          ff-sans
```
`bt-meta-text` is the standard "caption / muted secondary line" style.
`ff-sans` forces system-UI sans inside a context that would otherwise inherit
the heading or display font (e.g. inside a styled `<h*>` wrapper).

**Custom utilities**
```
bt-border
bt-bg                   bt-bg-alt               bt-bg-dark              bt-bg-white
bg-danger-light         bg-success-light
min-w-0
```
These are the only custom utilities. Everything else (spacing, sizing, alignment,
text colour, display) comes from Bootstrap. Do not invent further `bt-*` utility
classes — reference the token directly in SCSS instead. `min-w-0` exists because
Bootstrap has no min-width utility and flex truncation needs it.

**Faculty colours** — keyed by live Biblio org code, defined in `_utilities.scss`:
```
bg-faculty-lw … bg-faculty-ps          (brand fill + readable foreground)
bg-faculty-lw-light … bg-faculty-ps-light  (12% tint, holds body text)
```
Never inline a faculty hex.

**Alert modifiers** (on top of Bootstrap `.alert` and `.alert-*` variants) ⚠️ TBD — `--seamless-inbox` and `--dashed` may not survive review
```
alert--sm               alert--seamless-inbox   alert--dashed
```
`alert--seamless-inbox` is a borderless flat alert used inside the researcher
inbox; `alert--dashed` swaps the solid border for a 2px dashed one.

**Popover modifiers** (applied via `data-bs-custom-class`, initialised by `assets/js/popovers.js`)
```
popover--sm             popover--dark
```
Both feed `--bs-popover-*` variables only. Combine for the identifier-icon
hover pattern in author lists (see `elements/popovers.html`).

**Form variants** ⚠️ TBD — may not survive review
```
form-control-search
```
Pill-shaped search input with an inset magnifier glyph. Use on standalone
search fields outside of `bt-toolbar` and outside of `input-group--hero`.

### Used straight from Bootstrap — no custom classes, do not invent any

Like Table and Facets sidebar above, these components are plain Bootstrap. No `bt-*`
class exists for them; getbootstrap.com is the reference:

```
Modal        modal, modal-dialog, modal-content, modal-header/-body/-footer
Tabs         nav nav-tabs + tab-content/tab-pane (also drives the cite modal)
Breadcrumb   nav > ol.breadcrumb > li.breadcrumb-item (see rule H3)
Pagination   ul.pagination pagination-sm
```

Canonical compositions with project conventions (pagination + result count,
cite modal) get kit recipes — see `notes/PLAN-kit-gaps-from-templates.md` —
but the components themselves stay undocumented Bootstrap.

### Classes that no longer exist

Not documented here — old knowledge lives in `CHANGELOG.md` (OLD→v2 tables
and the v2 removals map). `npm test` fails on any undefined class; the
changelog says what replaced it.

### Icon names — verified source of truth
Check `assets/scss/icons/_icon-font.scss` for the complete list. Do not use any `if-[name]` not present in that file.

---

## What to do when uncertain

**About a domain or policy decision:** never invent a rule. Record it as an open question naming the concrete options. These decisions are made with business and development — who exactly (Open Science Policy, reviewers and curators, the dev team) depends on the question; don't assume the route. A prototype with an honest open question beats one with a plausible invented rule.

**About whether a concept should be modelled:** the prototype is not where domain concepts get defined — Raven is. Before inventing a field, status, or entity in a prototype, check whether Raven's schema, field registry, or catalogs already cover it. If it's genuinely new or ambiguous, flag it as an open question for a design discussion so it lands in Raven, not ad hoc in the prototype.

**About a class name:** search the existing `booktower.css`, the SCSS source and Bootstrap. If I can't confirm it exists, say so and add it to the correct SCSS partial rather than guessing.

**About an icon name:** do not guess. Use a placeholder (`if-[placeholder]`) and flag it explicitly.

**About HTMX behaviour at runtime:** describe what should happen, mark the URL as a stub, and note that integration testing is required.

**About accessibility:** produce the correct static HTML, then explicitly state that screen reader testing has not been performed.

**About the surface of a new page:** check or ask which user this is for before writing the first line of HTML.

---

## Bootstrap-first: check before creating any new class

Before writing a new CSS class, answer: does Bootstrap already have a component or pattern that handles this use case?

The check is not "does Bootstrap have a class with this exact visual output?" — it is "does Bootstrap have a pattern that handles this *use case*?" Check the full Bootstrap component list: buttons, dropdowns, button groups, list groups, cards, navs, tabs, pagination, modals, collapse, offcanvas, tooltips, popovers, progress, spinners, alerts, badges, breadcrumbs, tables, forms. Read what each component *does*, not just what it looks like.

If Bootstrap covers the use case, use it — even if you would need to override some styles with a Booktower token. Overriding is cheaper than duplicating.

A new Booktower class is only justified when:
1. Bootstrap has no equivalent concept, **or**
2. The pattern is domain-specific to Biblio and meaningfully reused across multiple templates

If you proceed with a new class, state in a comment: which Bootstrap component you checked, and the specific reason it did not fit.

---

## Overriding Bootstrap safely

Three rules, each earned by a real bug (see `docs/AUDIT-BOOTSTRAP-GAPS.md`):

**Feed variables, don't fight selectors.** Where a `--bs-*` component variable exists, set it — you inherit Bootstrap's state handling (`:hover`, `.active`, `btn-check:checked`, `:disabled`) instead of re-implementing part of it. Verify the variable exists in the dist first; several past overrides targeted variables that were never real.

**Longhands, never shorthands across grouped selectors.** A shorthand resets every sub-property you didn't mention: `background:` erased the select caret, `padding:` erased its gutter. Group selectors only when the declaration is identical in consequence for every member.

**Raw colours live in three places only:** `_colors.scss` (palette + `--bt-*-rgb` triplets), `_tokens.scss` (shadows, focus rings), and SVG data URIs. Everything else references variables.

---

## JavaScript: no inline scripts, no undocumented files

**Never write an inline `<script>` block in a template or partial.** All JavaScript that runs on real pages belongs in a named file in `assets/js/`. Each file handles one concern.

The only exception: UI kit documentation pages (`foundations/`, `elements/`, `patterns/`) may contain inline scripts to *demonstrate* a JS interaction pattern — never to provide working behaviour.

**Every file in `assets/js/` must be documented in `docs/JAVASCRIPT.md`** with:
- its purpose
- which templates load it
- which events it listens to
- which events it dispatches
- whether it is prototype-only (to be removed when a real endpoint exists)

If you find a `<script>` block in a template, flag it and move it to the correct file before considering the template ready for Go templ implementation.

---

## No inline styles — with one exception

Never use `style=` attributes in HTML. If a value isn't in SCSS, add it there first, then reference it via a class.

**The one exception:** genuinely dynamic values that cannot be known at build time — for example, a progress bar width (`style="width: 73%"`) driven by data. Static visual values like `font-size`, `color`, `padding`, `background` are never acceptable inline.

Before writing `style=`, ask: is this value static? If yes — ask yourself if it's available in Bootstrap or if there's already a class we can use. If not, ask before you write the css class.

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

Two CSS grid shells live in `patterns/_layouts.scss`. Both use `--s-topbar-height` (defined in `foundation/_surfaces.scss`) for sticky sidebar calculations.

| Shell | Used for | Children |
|-------|----------|----------|
| `u-layout--app` | Backoffice pages, including deposit flows | `.bt-navbar` + `.bt-sidebar` + `<main>` |
| `u-layout--public` | Public search/detail | `.bt-navbar` + `<main>` |

**Deprecated layout classes (OLD system — do not use):**
`u-scroll-wrapper`, `u-scroll-wrapper__body`, `u-maximize-height`

---

## Naming conventions

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `bt-` | Bootstrap Custom — extends/wraps Bootstrap | `bt-navbar`, `bt-toolbar`, `bt-avatar`, `bt-btn-check__group`  |
| `bt-` | Component — a styled widget, no Bootstrap base | `bt-blank-slate`, `bt-work-card` |
| `u-` | Layout — structural regions and layout shells, not visual styling | `u-layout--app`, `u-main__panel`, `u-notifications` |

BEM separators: `__` for elements, `--` for modifiers. Single dash is never a BEM separator in this system.

`u-` is the layout prefix: a `u-` class positions or structures a region of the
page (shell, grid cell, fixed overlay region) and carries no visual personality
of its own — the contents bring that. `bt-` is for styled things (widgets that
wrap Bootstrap, or standalone components). The split is structure vs. styling,
not custom vs. Bootstrap.

Known inconsistency: the single-purpose utilities (`bt-bg`, `bt-bg-alt`,
`bt-bg-dark`, `bt-bg-white`, `bt-border`) carry `bt-`, not `u-`. They predate
this rule. Do not re-prefix them ad hoc — that is a separate, deliberate cleanup
pass. Until then, treat the existing `bt-*` utility names as ground truth and do
not invent new ones (reference the token directly in SCSS instead).

Bootstrap utilities (`d-flex`, `gap-3`, `text-muted`, `mb-4`) are used directly without wrapping.

**Do not invent new prefixes** without an explicit decision.

---

## UI kit page conventions

Before creating a new page in `foundations/`, `elements/`, or `patterns/`, read at least two existing pages. Match their structure exactly.

```html
<!-- Page header — data-surface="public" for display heading style -->
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
    <pre>&hellip;</pre>
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
- **Static `ds-code` blocks are only justified when they show something the "Show HTML" toggle cannot** — for example, a structural skeleton with explanatory comments, a JS snippet, or a usage pattern that differs from the live demo. If a `ds-code` block duplicates what the toggle would generate, delete it. If the code block is *more complete* than the demo, update the demo to match — then delete the block.

---

## The design system dogfoods itself

The design system documentation uses the same CSS it produces. If a component can't be shown in the kit using its own classes, the gap is in `assets/scss/` — not an excuse for inline styles in HTML.

---

## Distributing the design system

`docs/CONSUMING-BOOKTOWER.md` is the source of truth for which files to copy
and where (fonts sit in `fonts/` next to the CSS file).

Future: npm package. Not set up yet. Don't suggest symlinks or git submodules.

---

## Citing sources when there is disagreement

When I and the developer disagree on a CSS, HTML, or accessibility approach, I must cite my sources before defending or conceding a position. Authoritative sources for this project, in priority order:

1. **MDN Web Docs** (developer.mozilla.org) — specification-level reference for HTML, CSS, ARIA
2. **CSS-Tricks** (css-tricks.com) — practical CSS techniques and patterns
3. **A List Apart** (alistapart.com) — web standards, semantics, accessibility
4. **WHATWG / W3C specs** — when the question is about what the spec actually says
5. **Scott O'Hara / Adrian Roselli / Sara Soueidan** — accessibility-specific edge cases

I must not just assert a position — I must name which source supports it and why. If I cannot cite a source, I should say so and defer to the developer's judgment or look it up.

---

## Comments

Default to **no comment**. Add one only when a later change would break something you
wouldn't quickly catch — a **silent or non-local failure**: it breaks a different
element, depends on order, relies on a value defined elsewhere, or must match an
external spec / a check outside visual review (WCAG contrast, a z-index tier, a
query-param that must match raven). If breaking it fails **loudly and locally** —
visible at once in review or the browser — omit the comment. Never restate what the
code does; a few words when one is kept.

---

## A note on confidence

I produce code confidently regardless of whether I am correct. Confidence is not a reliability signal. Before finalising any output, check:

1. Does this class name actually exist in SCSS?
2. Does this ARIA attribute belong on the right element?
3. Does this icon name match `_icon-font.scss`?
4. Does this HTMX pattern account for the empty, error, and loading states?
5. Does this template carry the correct `data-surface`?

Default to the dumbest version that works. Don't extract a helper for a single call site. Don't add a comment that restates what the code does. Don't add aria-describedby when sequential reading order suffices. Don't introduce a variable to avoid duplicating two lines. If you find yourself thinking "this might be useful later," stop — write the current case only. For example: write plain html instead of a stub.

Justify, don't defend. For example: "Why does trustPillar exist?" is a better question than "is trustPillar necessary?" The first one forces you to name the reason out loud, so you can hear that it's weak. Read your own output skeptically.

Don't extract a helper for a single call site. Don't introduce a variable to avoid duplicating two lines. Prefer the dumb version when it's legible.

Placeholder data must be announced as placeholder. Any claim about the real domain (funders, classifications, faculty behaviour) is sourced or flagged as a guess — never asserted.

---

## Writing in plans and docs

Frame information active and positive: say what a thing **is**, not what it isn't. Lead with the affirmative statement. Reserve negation for genuine constraints where naming the rejected alternative is the point (e.g. "the query is not a chip").

---

## Working mode: build-and-show

Default to **build-and-show, not ask-and-record.** Take the obvious option, implement it, and show the result for review — the user vetoes in review. Reserve questions for genuinely load-bearing forks.

This is an HTML prototype, so keep process light: planning notes stay local (they're gitignored) and are updated only when a load-bearing decision changes; commit in coherent chunks without ceremony; verify by confirming the files you touched add no new errors, plus a browser eyeball. Keep strict only what has real downstream cost — the accessibility pre-flight, no invented CSS classes, and flagging raven-dependent work.