# Class usage notes and gotchas

Companion to the generated [`CLASSES.md`](CLASSES.md): what that list can't express — composition rules, traps, and names agents tend to invent. `CLASSES.md` says what exists; this file says how to use it. Read the entries for every component you compose. Rule references (H3, &hellip;) point into [`ACCESSIBILITY.md`](ACCESSIBILITY.md).

**Navigation & topbar** — `bt-navbar__brand` is the backoffice logo link. `bt-navbar__mark` does NOT exist.

**Toolbar** — give each toolbar action its own `bt-toolbar__item` (siblings within `bt-toolbar__left`/`__middle`/`__right`, automatic padding between them) rather than wrapping actions in a flex group. `bt-title-toolbar` is a flex row pairing a heading with a right-aligned action button.

**Avatar** — `bt-avatar` plus a Bootstrap background utility (`.bg-primary`, `.bg-success`, `.bg-warning`, `.bg-danger`) automatically forces white text and icon colour; no extra class needed for coloured initials chips. On a `<button>`, use `bt-avatar` alone — never with `.btn`; the avatar owns its own button reset.

**Scroll utilities** — `bt-table-sticky-col` on a `.table` inside `.table-responsive` pins the first column while the rest scrolls horizontally. `bt-dropdown-scroll` is the scrollable inner list for a dropdown-menu with a fixed header (e.g. the filter picker's search box); per-dropdown width via `--bs-dropdown-min-width`.

**Work card** — grammar, rules, and demos live at `/patterns/work-card.html` (reference-line composition per surface: `wip/WORK-CARD-REFERENCE-STYLES.md` — draft). The structural wrappers are `bt-work-card__header`, `__body` and `__footer` — real BEM elements owning their own padding, so a work card carries no Bootstrap `card-*` class. `bt-work-card` itself draws the separator rule between cards; `bt-work-card--border-bottom` and `bt-work-card--researcher` do NOT exist. `bt-work-card__meta` is *every* metadata row, not only the header one — the backoffice blocks (departments, projects, VABB, provenance) are `__meta` rows too. `__meta-item` is the opt-in for a separator, drawn only between direct children of one row; badges, links and plain spans ride in a row without it. `bt-meta-list` is the off-card metadata line (detail-page file rows) and no longer appears inside a card. `__author` is one contributor: identifier icons inside the span and outside the link, `visually-hidden` identifier text inside it. The span is `white-space: nowrap` and carries a left margin against its predecessor — the comma between authors is a text node, so its word space alone would leave an icon equidistant from both names and it would read as marking the previous one. Every `__author` carries a link, and its identifier icons decide where it goes: a name with the crest or ORCID links to that person's page (raven holds a person record, which is what a page needs), a name with neither links to a works search on itself (`?q=`). There is no muted, unlinked contributor, and no crest without a page behind it.

**List wrapper** — cards rendered as a list of results belong inside `<ol class="list-unstyled mb-0">` with each card wrapped in `<li>`. A plain `<section>` wrapper is wrong: it is an unlabelled landmark and AT cannot announce a count.

**Facets sidebar** — plain Bootstrap: `fieldset`, `legend`, `form-check*`, spacing utilities, Collapse. The old custom facet classes (`bt-facets`, `bt-facet-name`, `bt-facet-separator`, `bt-results-col`) do not exist. Show-more toggle: put the overflow in `<div class="collapse">` with a `data-bs-toggle="collapse"` button + `if-chevron-down` after it; the button must carry `aria-expanded="false"` when the list starts collapsed (do not rely on `.collapsed`, which Bootstrap only adds after the first click). Documented at `/patterns/facets.html`.

**Sub-sidebar navigation** — `.bt-sidebar a.nav-link` already applies `display:flex`, `align-items:center`, `gap`, and padding. Do not add `d-flex`/`align-items-center`/`gap-*`/`p-*` utilities on nav links inside `bt-sidebar`.

**Sidebar link text** — wrap it in `.bt-sidebar__label`. Slim mode hides that span from view and keeps it in the accessibility tree, so it names the link in both states. Never add `aria-label` to a sidebar link — the reason is in `patterns/sidebar.html`.

**Backoffice list layout** — `u-main__sidebar` is the `<aside>` wrapping the facet groups; `bt-sidebar` is the app navigation rail and never a filter rail. Results layouts use `u-main__body`, `u-main__sidebar`, `u-main__content`, `u-main__content-header`, `u-main__content-body`. Use `bt-toolbar` for search/filter bars, bulk action bars, and pagination rows — not custom classes.

**Table** — plain Bootstrap: `<table class="table table-hover align-middle">`, `text-uppercase text-muted small` on `<thead>`. No custom table classes exist. Title cells: `fw-semibold text-reset text-decoration-none` on the link, `small text-muted mt-1` on the secondary line. Action cells: `text-end` on `<td>`, `btn-ghost btn-sm` buttons directly inside. Row selection: Bootstrap's `.table-active` on `<tr>` (`--bs-table-active-bg`/`--bs-table-hover-bg` overridden in `_layouts.scss`). `btn-ghost` is already quiet at rest — no reveal mechanism needed.

**Filter chips** — applied-filter chips are clickable badges: `badge badge--outline` on a `<button>`/`<a>` (see Badges). `filter-chip-group` joins two into a split label + remove pill. Display-only summaries use `badge text-bg-primary-light`. The "Add filter" dropdown's scrollable list uses the generic `bt-dropdown-scroll`. Defined in `patterns/_filters.scss`.

**Query builder** — the blank state's start cards are `card text-start w-100 h-100 bt-query-builder__start` (the custom class keeps the tighter radius and hover; `w-100 h-100` because a `<button>` sizes to its content in a column where a grid item stretched) in a plain `row row-cols-1 row-cols-lg-3 g-3`, and its field columns are a `row row-cols-1 row-cols-lg-4 g-4` — the pattern owns no grid of its own; the role and operator selects carry `w-auto mw-100`, so each is as wide as its longest option; person tokens are `badge text-bg-primary-light` + `data-qb-token`, sitting directly in `bt-query-builder__row-value` beside a `badge badge--outline` button that opens the person picker; the role is a plain `form-select` in its own `bt-query-builder__row-role` cell, styled with the operator's; the field chooser is a `bt-panel bt-panel--wide` composed on `dropdown-menu` (see Panel); field-list groups are `min-w-0` + `data-qb-choice-group` holding a `dropdown-header` and a `ul.list-unstyled` of `dropdown-item` rows — one grouped list in the chooser, the same rows in columns in the blank state, where Bootstrap's item variables are out of scope and they fall back to plain links; the pasted-identifier box is `form-control form-control-sm font-monospace bt-textarea-auto bt-query-builder__batch` — `bt-textarea-auto` does the growing and the cap, the pattern class only makes it fill its column, and the row needs `bt-query-builder__row--batch` or the value cell's `flex: 1 1 12rem` lands on the textarea's height instead of its width. The row's actions cell is a ⋯ menu (only "Add an 'or'") plus a dedicated `btn-ghost` remove button carrying `if-delete` — the remove control always names its condition. Pattern page: `patterns/query-builder.html`.

**Panel** — `bt-panel` is the generic popover panel (title + one or more bodies + optional actions footer). Sizes to content by default; `bt-panel--wide` (480px) is for panels whose body is swapped while the user types — the filter editor and the add-to-list picker — because a content-sized panel resizes on every keystroke. Body layouts (`--checklist/--boolean/--year/--form/--list`) are generic; `--list` is one scrolling column of rows that act rather than tick, group headings inside it — the query builder's field chooser. **Search-first shape:** stack two bodies — a plain `bt-panel__body` holding the search field (it stays put) above a `bt-panel__body--checklist` or `--list` (it scrolls); each body draws its own top border, so the divider comes for free — the bodies must be direct children of `bt-panel`, and a first body with no title above it takes `border-top-0`. Used by the add-to-list picker, the `filter-bar.js` filter editors (search-within), and the query builder's chooser and person picker (`dropdown-menu p-0 bt-panel bt-panel--wide` + `role="dialog"` + `aria-label`). Action rows are plain `.dropdown-item`; `_panel.scss` re-declares their padding, since Bootstrap takes it from variables only declared on `.dropdown-menu`. Defined in `patterns/_panel.scss`.

**Badges** — colour with `text-bg-*`, never `bg-*` + `text-*`: the latter skips the `_badges.scss` token overrides and silently falls back to stock Bootstrap colour. `text-bg-*` owns the foreground — don't add `text-white`/`text-dark`; icons inherit it. The overrides use `!important` to beat Bootstrap's own — don't remove it. Solid badges need a dark-enough background to clear WCAG AA with white text: success uses green-700, danger red-600 (their 500/600 steps fail); warning is the exception — dark text on orange-500, no amber passes with white. Size is fixed at `--bt-text-xs` (12px), not Bootstrap's `.75em` (shrinks to 9px inside `bt-meta-list`). The neutral/metadata badge (counts, codes, roles) is `badge text-bg-light border` — a utility composition, not its own class; `text-bg-light` is borderless by default, add `.border` on white. Clickable badge: a `<button>`/`<a>` carrying `.badge` is styled squared with pointer + hover + focus — element-based, no extra class; this is the only interactive badge case, a plain status badge stays a `<span>`. The chip whose editor is open adds Bootstrap's `.active` to `badge--outline` plus `aria-current="true"` on the label half — a state class, there is no `badge--active`. A `<button>` directly inside a badge (the query builder's person tokens) is the element-based remove control — sized, transparent and colour-inheriting with a soft hover; no extra class.

Access status is the one fixed badge recipe: `text-bg-success` + `if-open-access` for open access, `text-bg-secondary` + `if-lock` for restricted, `text-bg-secondary` + `if-time` for embargo (badge names the date) — never `text-bg-warning`, which reads as an error and competes with open access, `text-bg-transparent` + `if-forbid` for embargo (badge names the date) — closed access is never rendered on a public page. Those are the whole access badge vocabulary. `badge--lg` is the tap-target size; `badge--tab` is the quiet type-tab variant in the search suggest overlay — its active state is the selected type filter, so it pairs with `role="tab"` and `aria-selected`.

**Buttons** — `btn-xs`/`btn-sm`/`btn`/`btn-lg` all defined; all standard Bootstrap variants (including `btn-ghost`) and all `btn-outline-*` variants are overridden with Booktower tokens.

**Overlay regions** — `u-notifications` (fixed top-right stack, body-level, outside the shell grid) is structural only: it positions, stacks, and z-indexes (`--bt-z-overlay`) whatever fragments land in it; the contents (e.g. `.alert`) bring their own styling and dismissal. The consumer never sets `z-index`.

**Typography helpers** ⚠️ TBD — may not survive review. `bt-meta-text` is the standard "caption / muted secondary line" style. `ff-sans` forces system-UI sans inside a context that would otherwise inherit the heading or display font.

**Custom utilities** — `bt-border`, `bt-bg`/`bt-bg-alt`/`bt-bg-dark`/`bt-bg-white`, `bg-danger-light`/`bg-success-light`, and `min-w-0` are the only custom utilities; everything else comes from Bootstrap. Do not invent further `bt-*` utility classes — reference the token directly in SCSS instead. `min-w-0` exists because Bootstrap has no min-width utility and flex truncation needs it.

**Faculty colours** — keyed by live Biblio org code, defined in `_utilities.scss`: `bg-faculty-<code>` (brand fill + readable foreground) and `bg-faculty-<code>-light` (12% tint, holds body text). Never inline a faculty hex.

**Alert modifiers** — on top of Bootstrap `.alert`/`.alert-*`. `alert--seamless-inbox` (borderless flat, researcher inbox) is kept — it mirrors the old-backoffice inbox alerts. `alert--dashed` (2px dashed border) is ⚠️ TBD — may not survive review. `alert--sm` is stable.

**Undemoed but kept** — `u-notifications`, `bt-toolbar__middle`, `u-main__sidebar--border-left`, and `alert--seamless-inbox` have no kit demo yet. Each mirrors an old-backoffice component (toasts/flash, `bc-toolbar-center`, sub-sidebar, inbox alerts), so they sit in the `intentional` list in `scripts/check-classes.js`; every other unused class fails the gate.

**Modal width** — `modal-dialog--wide` is the only Booktower modal modifier: it sets
`--bs-modal-width` and nothing else, so it stacks on `modal-dialog modal-xl` rather than
replacing a Bootstrap size. Reach for it when a dialog holds form rows instead of prose;
`modal-xl` first, this only when a row still wraps. Do not invent `modal-wide`,
`modal-xxl` or a `bt-modal-*` family.

**Popover modifiers** — `popover--sm`, `popover--dark`, applied via `data-bs-custom-class`, initialised by `assets/js/popovers.js`. Both feed `--bs-popover-*` variables only. Combine for the identifier-icon hover pattern in author lists (see `elements/popovers.html`).

**Form variants** ⚠️ TBD — may not survive review. `form-control-search`: pill-shaped search input with an inset magnifier glyph, for standalone search fields outside `bt-toolbar` and `input-group--hero`.

## Used straight from Bootstrap — no custom classes, do not invent any

Like Table and Facets sidebar above, these components are plain Bootstrap. No `bt-*`
class exists for them; getbootstrap.com is the reference:

```
Modal        modal, modal-dialog, modal-content, modal-header/-body/-footer
             (one Booktower modifier exists: modal-dialog--wide, see above)
Tabs         nav nav-tabs + tab-content/tab-pane (also drives the cite panel)
Breadcrumb   nav > ol.breadcrumb > li.breadcrumb-item (see rule H3)
Pagination   ul.pagination pagination-sm  (the bar around it: patterns/pagination.html)
```

Canonical compositions with project conventions (pagination + result count,
cite panel) get kit recipes — see `notes/PLAN-kit-gaps-from-templates.md` —
but the components themselves stay undocumented Bootstrap.

**Modal ARIA** — the opener carries `tabindex="-1"`, `aria-labelledby`, and, on a
confirmation, `aria-describedby` pointing at the consequence sentence (never at
`.modal-body`). It carries no `role`, `aria-modal` or `aria-hidden`: Bootstrap's JS sets
those on show and removes them on hide, and a static `aria-hidden` fails `check:html`.
Reference: `templates/biblio-researcher/lists.html`. Reasoning: `docs/ACCESSIBILITY.md` E6.

**Results bar** — the pagination + count + read-controls composition is pinned in
`patterns/pagination.html`: a `bt-toolbar` with `nav > ul.pagination` and the count in
`__left`, page size / sort / more actions in `__right`. The count is a sibling of the
`<nav>`, never inside it; exactly one count per list carries `aria-live="polite"`; the
prefix is `<span class="visually-hidden">Showing </span>` alone — `visually-hidden`
hides it at every width, so pairing it with `d-none d-md-inline-block` only drops it
from the accessibility tree below `md`. Inert page items (end arrows, empty letters,
`…` gaps) are `<span class="page-link">` in `li.page-item.disabled` — a disabled
`<a href>` stays clickable. `ul.pagination` needs no `mb-0`: the base reset zeroes list
margins.

## Classes that no longer exist

Not documented here — old knowledge lives in `CHANGELOG.md` (OLD→v2 tables
and the v2 removals map). `npm test` fails on any undefined class; the
changelog says what replaced it.

## Icon names — verified source of truth

Check `assets/scss/icons/_icon-font.scss` for the complete list. Do not use any `if-[name]` not present in that file.
