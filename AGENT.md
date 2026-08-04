# AGENT.md
# Working guidelines for AI-assisted development on this project

This file is written by AI, for AI.
It documents what this project is, what I tend to get wrong, and what I must verify before producing code.
Add it to the root of any project where I'm a regular collaborator.

---

## Session start — do this first, every time

When a new session begins on this project, execute these steps before writing any code or HTML:

1. **Read the docs the task needs** — reading is proportional to the task, per this map:

   | Task touches | Read first |
   |---|---|
   | Scoping any new page or feature | `docs/SURFACES.md` — the public vs backoffice surface test |
   | Audience, personas, or legibility questions | `docs/RESEARCH-PERSONAS.md` — the public personas anchor the surface and vocabulary tests |
   | Domain meaning — entities, statuses, badges, review workflow | `docs/DOMAIN-VOCABULARY.md`, `docs/DOMAIN-CONTEXT.md` |
   | Building or changing a template | `docs/UI-LAYER.md`, `docs/CONSUMING-BOOKTOWER.md`, `docs/ACCESSIBILITY.md` |
   | Any search box, facet sidebar, or filter picker | `docs/SEARCH-AND-FILTERING.md` |
   | JavaScript | `docs/JAVASCRIPT.md` — file registry, event contract, loading order |
   | Kit server behaviour — template states, mock endpoints | `docs/SERVER.md` |
   | Drafting an implementation issue | `docs/ISSUE-TEMPLATE.md` + the `biblio-issue-writer` skill; raven's `CLAUDE.md` owns the issue → branch → commit → PR chain |
   | A field, status, or entity that might need modelling | raven is the source of truth — check its schema and catalog docs (`docs/metadata-*.md` in the raven repo) before inventing a concept here |
   | Public record pages that crawlers or reference managers consume | raven's `docs/public-site-semantics.md` — the Rubric-audited contract |

2. **Check class names against `docs/CLASSES.md`** — the generated reference for every class that exists (rebuilt by `npm run build`). Do not guess names not on that list. Usage gotchas are in this file under "CSS class names".

3. **Identify the surface** — before writing the first line of HTML, confirm whether this is a `public` or `backoffice` page. If uncertain, apply the test in `docs/SURFACES.md`; if the test doesn't settle it, ask.

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

The full rules with code examples — A. page structure, B. accessible names, C. forms, D. HTMX/dynamic content, E. keyboard, F. tables, G. colour and contrast, H. public surface, I. backoffice surface, J. motion — live in `docs/ACCESSIBILITY.md`. Read it when building or changing any template. The pre-flight checklist below is the enforcement summary; rule references (H1, E5, &hellip;) point into that doc.

### Project decisions the generic WCAG rules don't cover

One-line digest — reasoning and markup live in `docs/ACCESSIBILITY.md`:

- **Record-card titles are surface-dependent (H1):** public cards are `<article>` with an `<h2>` title; backoffice cards use `<p class="bt-work-card__title">` — list-item navigation replaces heading-jump there. Both carry `aria-labelledby`.
- **The view toggle is a pair of buttons, not a tab panel (E5).**
- **`bt-toolbar` carries no `role` (I1)** — only the bulk action bar is `role="toolbar"`, and it hides with the `hidden` attribute, never `display:none` (F5).
- **Focus after swaps (D4):** search results — focus stays on the input; deposit step advance — focus to the new step's `<h2>`; modal close — back to the trigger.
- **Filter tags and facet checkboxes carry full labels (I2, I3):** action + value ("Remove filter: Type is Journal article"); facet labels include the count, visible count `aria-hidden`.
- **`text-muted` only for supplementary content (G4)** — never for information needed to complete a task.

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

---

## HTML patterns I must follow

### Semantic structure
Rules: `docs/ACCESSIBILITY.md` §A (page structure), H1 (record cards).

### Forms
Rules: `docs/ACCESSIBILITY.md` §C.

### HTMX
Behavioural rules: `docs/ACCESSIBILITY.md` §D, plus C6 (progressive enhancement).
Unique here: all `hx-*` URLs in templates are stubs — documentation of
intent, not working code. Same logic for forms: no `<form>` without a working
submit path — mark where the real implementation needs one
(`<!-- real impl: form POST /… -->`, see C6's prototype exception).

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

The authoritative contract for public crawl semantics, structured data, and
render formats is raven's `docs/public-site-semantics.md`, audited by Rubric.
Check it before changing anything a crawler or reference manager consumes.

---

## CSS class names: what exists vs what I invent

This is the most common mistake I make. I produce plausible-looking class names with high confidence. Many of them do not exist in the actual CSS.

Ground truth is the generated reference **`docs/CLASSES.md`** — every class in
`assets/booktower.css`, regenerated by `npm run build`. A class not in that
list does not exist. `npm test` enforces this mechanically: `check:classes`
reports undefined and unused classes — keep both at zero; `check:partials`
fails the build on any partial `booktower.scss` doesn't `@use`.

### Usage notes and gotchas

What the generated list can't express — composition rules, traps, and names I tend to invent.

**Navigation & topbar** — `bt-navbar__brand` is the backoffice logo link. `bt-navbar__mark` does NOT exist.

**Toolbar** — give each toolbar action its own `bt-toolbar__item` (siblings within `bt-toolbar__left`/`__middle`/`__right`, automatic padding between them) rather than wrapping actions in a flex group. `bt-title-toolbar` is a flex row pairing a heading with a right-aligned action button.

**Avatar** — `bt-avatar` plus a Bootstrap background utility (`.bg-primary`, `.bg-success`, `.bg-warning`, `.bg-danger`) automatically forces white text and icon colour; no extra class needed for coloured initials chips. On a `<button>`, use `bt-avatar` alone — never with `.btn`; the avatar owns its own button reset.

**Scroll utilities** — `bt-table-sticky-col` on a `.table` inside `.table-responsive` pins the first column while the rest scrolls horizontally. `bt-dropdown-scroll` is the scrollable inner list for a dropdown-menu with a fixed header (e.g. the filter picker's search box); per-dropdown width via `--bs-dropdown-min-width`.

**Work card** — grammar, rules, and demos live at `/patterns/work-card.html` (reference-line composition: `docs/WORK-CARD-REFERENCE-STYLES.md`). `bt-work-card--researcher` and `__head`/`__body`/`__foot` do NOT exist. Backoffice cards still carry old utility markup pending the backoffice pass (CHANGELOG v2.8).

**List wrapper** — cards rendered as a list of results belong inside `<ol class="list-unstyled mb-0">` with each card wrapped in `<li>`. A plain `<section>` wrapper is wrong: it is an unlabelled landmark and AT cannot announce a count.

**Facets sidebar** — plain Bootstrap: `fieldset`, `legend`, `form-check*`, spacing utilities, Collapse. The old custom facet classes (`bt-facets`, `bt-facet-name`, `bt-facet-separator`, `bt-results-col`) do not exist. Show-more toggle: put the overflow in `<div class="collapse">` with a `data-bs-toggle="collapse"` button + `if-chevron-down` after it; the button must carry `aria-expanded="false"` when the list starts collapsed (do not rely on `.collapsed`, which Bootstrap only adds after the first click). Documented at `/patterns/facets.html`.

**Sub-sidebar navigation** — `.bt-sidebar a.nav-link` already applies `display:flex`, `align-items:center`, `gap`, and padding. Do not add `d-flex`/`align-items-center`/`gap-*`/`p-*` utilities on nav links inside `bt-sidebar`.

**Backoffice list layout** — `bt-sidebar` is the sticky `<aside>` wrapping the facet groups. Results layouts use `u-main__body`, `u-main__sidebar`, `u-main__content`, `u-main__content-header`, `u-main__content-body`. Use `bt-toolbar` for search/filter bars, bulk action bars, and pagination rows — not custom classes.

**Table** — plain Bootstrap: `<table class="table table-hover align-middle">`, `text-uppercase text-muted small` on `<thead>`. No custom table classes exist. Title cells: `fw-semibold text-reset text-decoration-none` on the link, `small text-muted mt-1` on the secondary line. Action cells: `text-end` on `<td>`, `btn-ghost btn-sm` buttons directly inside. Row selection: Bootstrap's `.table-active` on `<tr>` (`--bs-table-active-bg`/`--bs-table-hover-bg` overridden in `_layouts.scss`). `btn-ghost` is already quiet at rest — no reveal mechanism needed.

**Filter chips** — applied-filter chips are clickable badges: `badge badge--outline` on a `<button>`/`<a>` (see Badges). `filter-chip-group` joins two into a split label + remove pill. Display-only summaries use `badge text-bg-primary-light`. The "Add filter" dropdown's scrollable list uses the generic `bt-dropdown-scroll`. Defined in `patterns/_filters.scss`.

**Panel** — `bt-panel` is the generic popover panel (title + one or more bodies + optional actions footer). Sizes to content by default; `bt-panel--wide` (480px) is for panels whose body is swapped while the user types — the filter editor and the add-to-list picker — because a content-sized panel resizes on every keystroke. Body layouts (`--checklist/--boolean/--year/--form`) are generic. **Search-first shape:** stack two bodies — a plain `bt-panel__body` holding the search field (it stays put) above a `bt-panel__body--checklist` (it scrolls); each body draws its own top border, so the divider comes for free. Used by the add-to-list picker and the `filter-bar.js` filter editors (search-within). Action rows are plain `.dropdown-item`; `_panel.scss` re-declares their padding, since Bootstrap takes it from variables only declared on `.dropdown-menu`. Defined in `patterns/_panel.scss`.

**Badges** — colour with `text-bg-*`, never `bg-*` + `text-*`: the latter skips the `_badges.scss` token overrides and silently falls back to stock Bootstrap colour. `text-bg-*` owns the foreground — don't add `text-white`/`text-dark`; icons inherit it. The overrides use `!important` to beat Bootstrap's own — don't remove it. Solid badges need a dark-enough background to clear WCAG AA with white text: success uses green-700, danger red-600 (their 500/600 steps fail); warning is the exception — dark text on orange-500, no amber passes with white. Size is fixed at `--bt-text-xs` (12px), not Bootstrap's `.75em` (shrinks to 9px inside `bt-meta-list`). The neutral/metadata badge (counts, codes, roles) is `badge text-bg-light border` — a utility composition, not its own class; `text-bg-light` is borderless by default, add `.border` on white. Clickable badge: a `<button>`/`<a>` carrying `.badge` is styled squared with pointer + hover + focus — element-based, no extra class; this is the only interactive badge case, a plain status badge stays a `<span>`. The chip whose editor is open adds Bootstrap's `.active` to `badge--outline` plus `aria-current="true"` on the label half — a state class, there is no `badge--active`. `badge--lg` is the tap-target size; `badge--tab` is the quiet type-tab variant in the search suggest overlay — its active state tracks scroll position, so it pairs with `aria-current`, not `aria-selected`.

**Buttons** — `btn-xs`/`btn-sm`/`btn`/`btn-lg` all defined; all standard Bootstrap variants (including `btn-ghost`) and all `btn-outline-*` variants are overridden with Booktower tokens.

**Overlay regions** — `u-notifications` (fixed top-right stack, body-level, outside the shell grid) is structural only: it positions, stacks, and z-indexes (`--bt-z-overlay`) whatever fragments land in it; the contents (e.g. `.alert`) bring their own styling and dismissal. The consumer never sets `z-index`.

**Typography helpers** ⚠️ TBD — may not survive review. `bt-meta-text` is the standard "caption / muted secondary line" style. `ff-sans` forces system-UI sans inside a context that would otherwise inherit the heading or display font.

**Custom utilities** — `bt-border`, `bt-bg`/`bt-bg-alt`/`bt-bg-dark`/`bt-bg-white`, `bg-danger-light`/`bg-success-light`, and `min-w-0` are the only custom utilities; everything else comes from Bootstrap. Do not invent further `bt-*` utility classes — reference the token directly in SCSS instead. `min-w-0` exists because Bootstrap has no min-width utility and flex truncation needs it.

**Faculty colours** — keyed by live Biblio org code, defined in `_utilities.scss`: `bg-faculty-<code>` (brand fill + readable foreground) and `bg-faculty-<code>-light` (12% tint, holds body text). Never inline a faculty hex.

**Alert modifiers** — on top of Bootstrap `.alert`/`.alert-*`. `alert--seamless-inbox` (borderless flat, researcher inbox) is kept — it mirrors the old-backoffice inbox alerts. `alert--dashed` (2px dashed border) is ⚠️ TBD — may not survive review. `alert--sm` is stable.

**Undemoed but kept** — `u-notifications`, `bt-toolbar__middle`, `u-main__sidebar--border-left`, and `alert--seamless-inbox` have no kit demo yet, so `check:classes` lists them as unused. Keep them: each mirrors an old-backoffice component (toasts/flash, `bc-toolbar-center`, sub-sidebar, inbox alerts). `token-bar__token--negated` and `no-tokens` also show as unused but are applied by JS (negated tokens in advanced search) — not dead, keep.

**Popover modifiers** — `popover--sm`, `popover--dark`, applied via `data-bs-custom-class`, initialised by `assets/js/popovers.js`. Both feed `--bs-popover-*` variables only. Combine for the identifier-icon hover pattern in author lists (see `elements/popovers.html`).

**Form variants** ⚠️ TBD — may not survive review. `form-control-search`: pill-shaped search input with an inset magnifier glyph, for standalone search fields outside `bt-toolbar` and `input-group--hero`.

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

**About a class name:** check the generated `docs/CLASSES.md`, then Bootstrap. If I can't confirm it exists, say so and add it to the correct SCSS partial rather than guessing.

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

**The one documented exception:** `shell/scss/` compiles to `shell/shell.css` for shell chrome only (`bt-shell`, `bt-nav`, `bt-content`, `ds-page`, `ds-demo`, `ds-code`). Kit-only — no template links it and `docs/CONSUMING-BOOKTOWER.md` doesn't ship it. Edit it when the kit itself is broken, and keep the repair minimal; new styling belongs in `assets/scss/`, so the file shrinks as the design system matures.

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

### Never cite a source I haven't opened

A citation is a promise that the source says what I claim. Before putting any external
citation in a doc or issue, I open the source (`web_fetch` or read it) and confirm it
actually states the claim — a search-engine summary is **not** the source; it stitches
together adjacent findings and I have fabricated a citation that way. I cite only what
the source states; anything reasoned or conventional is labelled as such, never dressed
as research; if a source can't be read, I don't attribute to it. When an internal source
is corrected, I grep its dependents and re-sync. A wrong citation in a durable doc is
worse than no citation.

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

Default to the dumbest version that works, when it's legible. Don't extract a helper for a single call site. Don't introduce a variable to avoid duplicating two lines. Don't add aria-describedby when sequential reading order suffices. If you find yourself thinking "this might be useful later," stop — write the current case only. For example: write plain html instead of a stub.

Justify, don't defend. For example: "Why does trustPillar exist?" is a better question than "is trustPillar necessary?" The first one forces you to name the reason out loud, so you can hear that it's weak. Read your own output skeptically.

Placeholder data must be announced as placeholder. Any claim about the real domain (funders, classifications, faculty behaviour) is sourced or flagged as a guess — never asserted.

---

## Writing in plans and docs

Frame information active and positive: say what a thing **is**, not what it isn't. Lead with the affirmative statement. Reserve negation for genuine constraints where naming the rejected alternative is the point (e.g. "the query is not a chip").

---

## Working mode: build-and-show

Default to **build-and-show, not ask-and-record.** Take the obvious option, implement it, and show the result for review — the user vetoes in review. Reserve questions for genuinely load-bearing forks.

This is an HTML prototype, so keep process light: planning notes stay local (they're gitignored) and are updated only when a load-bearing decision changes; commit in coherent chunks without ceremony; verify by confirming the files you touched add no new errors, plus a browser eyeball. Keep strict only what has real downstream cost — the accessibility pre-flight, no invented CSS classes, and flagging raven-dependent work.