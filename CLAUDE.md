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

### Verified existing classes (from the real styleguide)
```
bc-toolbar          bc-toolbar-left      bc-toolbar-right     bc-toolbar-title
bc-navbar           bc-navbar-brand      bc-navbar-nav        bc-navbar-link
bc-avatar           bc-avatar--small     bc-avatar--large
c-blank-slate       c-blank-slate-default  c-blank-slate-muted  c-blank-slate-primary
c-facets            c-facet-title        c-facet-check        c-facet-name
c-facet-count       c-facet-separator
c-button-toolbar    c-button-toolbar--wide-spacing  c-button-toolbar--vertical
c-sub-sidebar       c-sub-sidebar--bordered
c-radio-card        c-radio-card-body    c-radio-card-group
app-sidebar         app-sidebar-link     app-sidebar-label
```

### Classes I defined in booktower.css v2 (new, not in the existing production system)
```
bt-dl               (definition list)
c-stepper           c-stepper-item       c-stepper-num        c-stepper-label
c-file-drop         c-file-drop-icon     c-file-drop-text
filter-tag          filter-tag-remove
badge-oa            badge-restricted
```

### Icon names — verified source of truth
Check `assets/scss/icons/_icon-font.scss` for the complete list. Do not use any `if-[name]` not present in that file.

---

## What to do when uncertain

**About a class name:** search the existing `booktower.css` and the production styleguide at `https://booktower-ui.vercel.app/styleguide/` before using it. If I can't confirm it exists, say so.

**About an icon name:** do not guess. Use a placeholder (`if-[placeholder]`) and flag it explicitly.

**About HTMX behaviour at runtime:** describe what should happen, mark the URL as a stub, and note that integration testing is required.

**About accessibility:** produce the correct static HTML, then explicitly state that screen reader testing has not been performed.

**About the surface of a new page:** ask which user this is for before writing the first line of HTML.

---

## CSS architecture — where styles live

All CSS belongs in `assets/scss/` and compiles to `assets/booktower.css`. This is not negotiable.

**Never put CSS in:**
- `<style>` blocks inside HTML files
- `style="..."` inline attributes
- `<script>` files (no programmatic style mutations unless toggling a class)
- Any file outside the `assets/scss/` architecture

**The one documented exception:** `shell/scss/` compiles to `shell/shell.css`. This exists because the shell chrome (nav, layout, demo wrappers) and the `?view=html` source viewer load without `booktower.css`. The shell is design-system tooling, not the design system itself. If a style applies to the shell chrome only and would be meaningless in a production app, it belongs in `shell/scss/`. If it could reasonably be used in a page built with the design system, it belongs in `assets/scss/`.

**When I produce HTML:** I must not add a `<style>` block or inline styles even as a quick patch. If a style is missing from the system, I flag it and add it to the correct SCSS partial. One-off styles in HTML are invisible to the system and will not be reused or maintained.

**When I produce JavaScript:** I must not write `element.style.foo = 'bar'`. I add or remove classes. The classes are defined in SCSS.

---

## CSS architecture: where styles live

All CSS belongs in the SCSS architecture under `assets/scss/`. This is not a preference — it is the rule.

```
assets/scss/
  foundation/   ← tokens, colors, surfaces, bootstrap overrides
  base/         ← typography, accessibility resets
  elements/     ← buttons and other discrete UI elements
  components/   ← bootstrap component overrides
  patterns/     ← booktower-specific components (toolbar, facets, etc.)
  icons/        ← icon system rules
  utilities/    ← utility classes
```

**I must never put CSS in:**
- `<style>` blocks inside HTML files
- `style=` attributes on HTML elements
- JavaScript files (no style manipulation via `.style.*` except for unavoidable dynamic values like drag coordinates)
- `<head>` of any HTML page
- Shell files, template files, or any file outside `assets/scss/`

**The only acceptable exceptions:**
- A CSS custom property set dynamically by JS where the value cannot be known at build time (e.g. a drag offset in pixels)
- A `:root` override scoped to a specific page that genuinely cannot live in the shared system (and even then, open a discussion first)

**When I'm tempted to write inline CSS**, the correct response is:
1. Identify which SCSS partial the rule belongs in
2. Add a class there
3. Apply the class in HTML

This is how the system dogfoods itself. A design system that uses inline styles to style its own documentation is undermining its own argument.

---

## What this project is not

- Not a React / Vue / Angular project. Do not suggest component frameworks.
- Not a utility-first CSS project. Do not suggest replacing the token system with Tailwind.
- Not a REST API client. HTMX replaces the need for most JavaScript fetch calls.
- Not a visually-only project. Machine-readability (schema.org, stable URLs, meta tags) is a first-class concern.
- Not finished. The icon font class names need verification. HTMX endpoints are stubs. Screen reader testing has not been performed.

---

## Layout shells: what exists and what to build

The OLD system had no CSS grid layout shell. Page layout was `d-flex` + `u-scroll-wrapper` + `u-scroll-wrapper__body` — Bootstrap flex utilities stacked as siblings, with `height: 100%` and `overflow: hidden` on `<main>`. Sidebars were `c-sidebar` (narrow icon rail) and `c-sub-sidebar` (wider text nav), placed as flex children.

The new system should **improve** on this, not replicate it. The old approach's weaknesses:
- Sticky positioning breaks inside `overflow: hidden` ancestors
- Scroll management is fragile and requires careful nesting
- No named layout concept — structure lived entirely in the HTML

**Confirmed existing classes for layout (verified against OLD source):**
- `bc-navbar`, `bc-navbar--fixed`, `bc-navbar--white` — topbar bar component
- `bc-toolbar`, `bc-toolbar-left`, `bc-toolbar-right`, `bc-toolbar-title` — page header row
- `bc-toolbar-item` — spacing unit inside toolbar halves
- `c-sidebar` — narrow icon rail sidebar (blue background, icon+label)
- `c-sub-sidebar`, `c-sub-sidebar--bordered` — wider text navigation sidebar
- `c-stepper`, `c-stepper__item`, `c-stepper__step` — step navigator for deposit flows
- `c-facets`, `c-facet-title`, `c-facet-check`, `c-facet-name`, `c-facet-count`, `c-facet-separator` — filter sidebar
- `c-button-toolbar` — button groups
- `c-blank-slate` — empty states
- `c-radio-card` — large radio option cards
- `u-scroll-wrapper`, `u-scroll-wrapper__body` — scroll management utility
- `u-maximize-height` — `height: 100%`

**Layout shells (agreed and active in `_layouts.scss`):**
- `u-layout--app` — topbar + left sidebar + main. Optional right panel with `.has-panel`.
- `u-layout--deposit` — topbar + `c-stepper` + main content column
- `u-layout--public` — topbar + centred content, no sidebar

All three expect `.bc-navbar` as their topbar child. Sidebars use existing `c-sub-sidebar` and `c-stepper` — no new sidebar classes invented.

---

## Naming conventions

The system uses three prefixes, each with a clear job:

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `bc-`  | Bootstrap Custom — extends/wraps Bootstrap components | `bc-navbar`, `bc-toolbar`, `bc-avatar` |
| `c-`   | Component — built from scratch, no Bootstrap base | `c-sidebar`, `c-facets`, `c-stepper`, `c-blank-slate` |
| `u-`   | Utility — single-purpose helpers AND layout shells | `u-scroll-wrapper`, `u-layout--app`, `u-layout--deposit` |

Bootstrap's own utilities (`d-flex`, `gap-3`, `text-muted`, `mb-4`) are used directly without wrapping.

**I must not invent new prefixes** (`bt-app-*`, `bt-deposit-*`, `bo-*`, `ds-*` outside the shell, etc.) without an explicit decision to do so.

---

## The design system dogfoods itself

The design system documentation (the shell, the `ds-page`, `ds-demo`, `ds-code` chrome) should use the same CSS it produces. If the system cannot style its own documentation using its own classes, that is a gap to fix in `assets/scss/` — not a reason to write one-off CSS in `shell/shell.css`.

`shell/shell.css` is the current exception. It now contains **only** the shell navigation chrome (`bt-shell`, `bt-nav`, `bt-content`) and design system documentation classes (`ds-page`, `ds-demo`, `ds-code`). The reset, font import, and accessibility utilities have been moved to `assets/scss/`. Do not add to `shell/shell.css` — only remove from it.

---

## Distributing the design system to other apps

Current approach: copy `assets/booktower.css` and `assets/fonts/` into the consumer app. The font path in `booktower.css` is `/assets/fonts/` — the consumer app must serve the fonts at that path, or rebuild with a different `fontsUrl` in `.fantasticonrc.js`.

Future approach: npm package. Not set up yet. When distribution to multiple apps becomes painful, publishing to a registry (public or private) is the right move. The package output would be the compiled CSS, font files, and optionally SCSS source for apps that customise tokens.

Do not suggest symlinks (breaks on other machines) or git submodules (unfamiliar UX, overhead not yet justified).

---

## No redundancy between files

Every rule must live in exactly one place. Before writing any CSS, check whether it already exists elsewhere in the system.

Known boundaries:
- **Reset** (`box-sizing`, `html`, `body`, `ul`/`ol`) — `assets/scss/base/_reset.scss` only
- **Fonts** (`@import url(...)`) — `assets/scss/_header.scss` only. Sass requires `@use` rules to come before any other statements, so the CSS `@import` must live in a partial (`_header.scss`) that is itself `@use`d first.
- **Tokens** (CSS custom properties) — `assets/scss/foundation/_tokens.scss` and `_colors.scss` only
- **Accessibility** (focus ring, `.visually-hidden`, reduced motion) — `assets/scss/base/_accessibility.scss` only
- **Component overrides** (`.form-label`, `.btn`, etc.) — their respective SCSS partials only, never in `_typography.scss` or the shell
- **Shell chrome** — `shell/shell.css` only, and only for `bt-shell`, `bt-nav`, `bt-content`, `ds-page`, `ds-demo`, `ds-code`

If I find myself writing a rule that already exists somewhere, I stop and use the existing one. If the existing one is wrong, I fix it in place — I do not write a second copy.

---

## UI kit page conventions

Before creating a new page in `foundations/`, `elements/`, or `patterns/`, read at least two existing pages in that folder. Match their structure exactly. Do not invent new wrapper elements, heading patterns, or layout approaches.

The established patterns from reading the existing pages:

```html
<!-- Page header -->
<header class="ds-page-header col-6" data-surface="public">
  <p class="ds-eyebrow">Foundations</p>
  <h1 class="display-2">Page title</h1>
  <p class="lead">Introduction.</p>
</header>

<!-- Section -->
<section class="ds-section">
  <h2 class="h4 mb-3">Section heading</h2>

  <!-- Demo block -->
  <div class="ds-demo">
    <h3 class="ds-demo-label">Label</h3>
    <div class="ds-demo-body">
      <!-- component HTML -->
    </div>
  </div>
</section>
```

Key rules:
- Page header uses `<header>`, not `<div>`
- Sections use `<section>`, not `<div>`  
- Section headings are `<h2 class="h4 mb-3">`, not plain `<h2>`
- Demo labels use `<h3 class="ds-demo-label">`, not `<div class="ds-demo-label">`
- No `<style>` blocks in HTML files — styles go in the correct SCSS partial
- No `style=` attributes except when the value is genuinely dynamic or a one-off token reference with no class equivalent

If something looks wrong or inconsistent across pages, flag it rather than silently picking one approach.

---

## A note on confidence

I produce code confidently regardless of whether I am correct. Confidence is not a reliability signal. The higher the confidence, the more important it is to check:

1. Does this class name actually exist?
2. Does this ARIA attribute go on the right element?
3. Does this icon name match the actual font?
4. Does this HTMX pattern account for the empty, error, and loading states?

Treat my output as a well-researched first draft, not a finished implementation.