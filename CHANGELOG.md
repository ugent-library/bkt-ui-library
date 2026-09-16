# Booktower UI Kit — Changelog

What changed in v2, newest first. The old→new class map moved to
[`docs/MIGRATING-FROM-OLD-KIT.md`](docs/MIGRATING-FROM-OLD-KIT.md).

---

## Primary copy actions confirm in green (v2.45, 2026-09-16)

No CSS change. A primary copy button now turns into its green success variant while its copy icon
and label change to a check and &ldquo;Copied&rdquo;. The button may resize naturally for the confirmation.
See the labelled and icon-only examples in `patterns/copy-to-clipboard.html`.

## Record pages open with one heading block (v2.44, 2026-09-15)

CSS changed — re-copy the compiled assets, and re-adapt the detail templates. `bt-detail-heading`
is the status row and title at the top of a record page, and `bt-detail-heading__title` goes on its
`h1`. Works, projects, researchers and organisations all use it; the organisation page carries no
status row. The block owns the gap between row and title and the space below itself, so drop the
`mb-2`/`mb-3` utilities that set them, and drop `h1 class="h3"` for a plain `h1`. Title size comes
from the block: `--bt-text-xl` on backoffice, `--bt-text-2xl` on public, stepping back to
`--bt-text-xl` below 40rem.

Canonical example: `patterns/detail-heading.html`.

## The active breadcrumb item meets AA contrast (v2.43, 2026-09-15)

CSS changed — re-copy the compiled assets. The active breadcrumb item is `gray-600` at full
opacity, in place of `gray-900` with `opacity: .6`, and meets WCAG AA at 14px. Consumer markup does
not change — the item stays `<li class="breadcrumb-item active" aria-current="page">`.

## Modal roots declare their dialog role (v2.42, 2026-09-15)

No CSS change — re-adapt the modal templates. Every `.modal` root now sets `role="dialog"` next to
its `tabindex="-1"` and `aria-labelledby`; a bare `<div class="modal">` is a `generic` element and
cannot carry `aria-labelledby`. `aria-modal` and `aria-hidden` stay out of the markup and remain
Bootstrap's to set. The advanced search, export, save search, share search, return, pickup and
delete list modals all changed.

## The Add to list toggle shows saved state, and the panel links to lists (v2.41, 2026-09-15)

CSS changed — re-copy the compiled assets and the icon fonts: `if-bookmark-fill` and `bt-link-more`
are new. `bt-link-more` is the View all / Open link that opens the complete list; the dashboards and
the team queue drop their `small text-muted text-decoration-none` spellings for it — re-adapt those
templates. A work already in one of the viewer's lists shows the filled bookmark and the count,
"In 1 list", in place of "Add to list". Inside the panel a ticked list ends in an Open link to that
list, and the footer links to My lists. Demonstrated on Panel and as the `in-list` state of the
public work detail.

## Chips can untick a sidebar filter (v2.40, 2026-09-10)

No CSS change. A ticked sidebar box now has a chip above the results, and the chip's × unticks the
box again. The chip's label leads back to the box instead of opening an editor; below `lg` it opens
the filter sheet first. A chip finds its box by naming the id in `data-initial-filters`, and chips
for the Add-filter dimensions still open their editor. Demonstrated on Facets.

## Project picker rows name their values (v2.39, 2026-09-10)

CSS changed — re-copy the compiled assets. A project picker row labels its acronym, project ID,
funder and programme. *Project ID* is the project's own identifier in raven, not a grant's award
number. Identifiers sit in `code`; the row search matches all of them. Stack one `bt-meta-list`
per group; picker panel rows drop `bt-meta-list--xs` for the base size, and the dense variant stays
for the people-search overlay. A filter-bar picker keeps the panel's own search placeholder rather
than one built from the filter's label.

Every picker panel and checklist editor marks what a search matched.

Funding programme is project metadata: the picker shows it on each funding entry and the row search
matches it; no condition filters on it.

## Alternative-title hierarchy on public work details (v2.38, 2026-09-10)

CSS changed — re-copy the compiled assets. Public work-detail pages can render
stored alternative titles in a single `bt-alt-titles` block between the primary
title and contributors. Order entries subtitle, translated title, then other
title; emphasize subtitles with `bt-alt-titles__item--subtitle`; render
translated and other labels as muted small text. Do not truncate entries, and
omit the block when there are no alternative titles.

New classes: `bt-alt-titles`, `bt-alt-titles__item`,
`bt-alt-titles__item--subtitle`. See `docs/CLASS-USAGE.md` for the consumer
markup contract.

## One query builder serves both surfaces (v2.37, 2026-09-09)

CSS changed — re-copy the compiled assets. New `bt-query-builder__date` sizes date and decimal
inputs; builder textareas do not auto-grow; `bt-query-builder__year` and the row hooks are
unchanged. New row templates: `qb-row-date`, `qb-row-quantity`, `qb-row-record-history` and
`qb-row-actor`, with `actor-picker-panel.html` for the Record history actor.

The backoffice researcher and curator works lists compose the same partials and `query-builder.js`
as `public-works.html`, and open the public Advanced search dialog. One field list carries every
chooser group; backoffice entries are gated by surface (v2.36). Re-adapt the field list against
`docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md`, which owns every field, operator, catalog and value
cap. Legacy coverage for the translator: `docs/wip/QUERY-BUILDER-LEGACY-COVERAGE.md`.

## Backoffice-only markup is gated by surface, not state names (v2.36, 2026-09-09)

No CSS changed. The server renders `<!-- @surface-only: backoffice -->` blocks only on pages
declaring that `@surface`; a page without one renders no surface blocks. The field list's
backoffice entries and the backoffice demo rows use the gate; arrival and action state lists
keep their state names. Mechanism: `docs/SERVER.md` → Surface blocks.

## Badge semantics: three tiers and viewer-dependent weight (v2.33, 2026-09-04)

No CSS changed. Re-adapt cards, rows and message blocks; no re-copy.

Backoffice cards order status in three tiers. Work kind and file access are never badges there —
table Type and Access cells render plain text. The Status → badge mapping lives in
`docs/DOMAIN-VOCABULARY.md`.

Review-state badges are soft (`text-bg-*-light`) at rest, filled (`text-bg-warning`,
`text-bg-danger`) only when the state waits on the current viewer; at most one filled badge per
card. The visibility badge is omitted on drafts; every other state keeps Public or Private.
Retracted is one badge on both surfaces.

Message blocks are `alert alert-light alert--sm` at rest, `alert-warning` only on a card whose
filled badge marks it as the viewer's move, never on a curator row.

---

## Result actions recomposed, one class removed — re-adapt and re-copy (v2.32, 2026-09-04)

On `public-works.html` the Save search and Share dropdowns merge into one Actions dropdown, hooked
through `data-result-actions`, `data-result-actions-toggle` and `data-result-actions-modal`.
Re-adapt the results bar and carry the new `assets/js/result-actions.js` (`docs/JAVASCRIPT.md`).

Every entry in `templates/partials/search-field-list.html` sets `data-qb-field` to its id in
`docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md`; re-apply the ids if you adapted the partial.

`alert--seamless-inbox` is removed, against the promise in `docs/CLASS-USAGE.md`. Confirmations
render as a standard `alert` inside the scrollable content column, never in the page chrome.

Re-copy the compiled assets: the last work card inside a `.card` draws no doubled bottom border,
and the icon font gained `if-archive-line`, `if-bank-line`, `if-barcode-line` and `if-gallery-line`.

`docs/CONSUMING-BOOKTOWER.md` and `docs/UI-LAYER.md` decide `data-surface` by product layer, never
by user role. No markup changes.

### Class migration

| Removed | Use instead |
|---------|-------------|
| `alert--seamless-inbox` | `alert alert-*` inside the content column |

---

## Candidates become an overview and a focused round (v2.31, 2026-09-04)

Backoffice only — every backoffice template still says do not implement in raven yet. Nothing here
asks a consumer to act.

`candidate-review.html` is the filtered overview; `candidate-focused-review.html` completes
candidates one at a time; `candidate-history.html` is deleted. Decision record:
`docs/decisions/DD-003-candidate-review-is-a-focused-round.md`.

Backoffice conventions hold across the templates: the page's primary action sits in the page
header, applied filters render as the public-works split chips, the results bar renders in every
state and carries the page's only result count, Submit is a split button, and a suggestion offers
Add and Reject, never Remove.

Additive classes `bt-work-card--compact` and `bt-work-card__meta--borderless` are in
`docs/CLASSES.md`.

Explorations that may not survive review: `dashboard-ranked-queue.html` and batch reviews in
`curate.html`.

---

## Pagination markup aligned everywhere (v2.30, 2026-09-03)

The nine files in `PAGINATION_DRIFT` are aligned and the allowance in `scripts/check-a11y.js` is empty, so `check:a11y` fails any old-markup
occurrence anywhere. No class changed — `booktower.css` needs no re-copy.

Re-apply the v2.11 table to any pagination bar adapted from `public-works.html`, a public detail or
directory page, or a backoffice list: inert page items are `<span class="page-link">` in
`li.page-item.disabled`, an anchor again once a target page exists; arrows are `if-chevron-*` icons;
the count sits beside the `<nav>`; the screen-reader prefix is plain `visually-hidden`; and
`ul.pagination` carries no `mb-0`. Backoffice list bars also gained page size and sort on the right.

Remove the count lines inside the organisations directory's cards if you adapted
`public-organisations.html`.

---

## Breaking change — advanced search is one builder, and search shares its contracts (v2.29, 2026-08-21)

Sync from v2.21 (`584b9dd/2026-08-11`) by re-adapting, not re-copying. This replaces v2.22–v2.28
and supersedes v2.16 and v2.20.

`public-search-advanced.html` is retired: the builder renders once, as a wide dialog over
`public-works.html`, at `?advanced=1`. An empty query is legal
(`docs/wip/QUERY-BUILDER-EVIDENCE.md`).

`query-builder.js`, `people-search.js` and the filter bars read only hooks: `data-qb-*`,
`[data-qb-count]`, `__row--error`, `__row--warning`, `data-picker-*`, `data-id`, `data-ps-row`,
`data-filter-bar`. One picker panel partial per entity. Contracts: `docs/CLASS-USAGE.md`,
`docs/JAVASCRIPT.md`, `docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md`.

`[hidden] { display: none !important; }` — never `d-*` on an element JS toggles with `hidden`. New
`bt-search-clear` with `search-clear.js`. `bt-panel` zeroes `dropdown-menu` padding: drop any
`p-0`. `.form-text`: xs → sm.

### Consumer sync

| Do this | To these |
|---|---|
| Re-copy | `assets/booktower.css`; from `assets/js/`: `filter-bar.js`, `filter-sheet.js`, `people-search.js`, `people-search-stub.js` (prototype only), `query-builder.js`, `search-clear.js`, `view-toggle.js` |
| Adopt | `filter-editor-templates.html`, `filter-option-lists.html`, the three picker panels, `search-advanced-conditions.html`, `search-advanced-actions.html`, `search-advanced-dialog.html`, `search-advanced-blank.html`, `search-field-list.html` — every node clones from these |
| Re-sync | `add-author-form.html`, `people-search-widget.html` |
| Move the vocabulary they carry in JS into templ markup (`docs/RENDERED-HTML-CONTRACT.md`) | Raven's `filter_bar_core.js`, `works_filter_bar.js`, `directory_filter_bar.js`, `checklist_search.js` and its three search templates |

### Class migration

| Removed | Use instead |
|---------|-------------|
| `people-results` | `bt-results` |
| `people-result` | `bt-result` |
| `people-result__icon` | `bt-result__icon` |
| `people-result__name` | `bt-result__name` |
| `people-result__meta` | `bt-meta-list bt-meta-list--xs` |
| `people-result__meta-item` | `bt-meta-list__item` |
| `bt-meta-list__item-bordered` | `bt-work-card__meta-item`, which now draws the separator |
| `bt-meta-text` | Bootstrap `small text-muted` |
| `bt-query-builder__editor` | nothing — the host supplies the box; in the dialog that is `modal-body` |
| `bt-query-builder__heading` | nothing — the host supplies the heading |
| `bt-query-builder__exit` | the dialog's own `modal-footer` |
| `bt-query-builder__row-op` | `bt-query-builder__phrase` wraps role, operator and value as one unit |
| `bt-query-builder__row--last-changed` | `bt-query-builder__row--error` / `--warning` |
| `bt-query-builder__field` | `bt-btn-inline-edit` |
| `bt-query-builder__role` | a permanently visible `form-select` in the phrase |
| `bt-query-builder__more` | nothing — the ⋯ button is a plain `btn btn-ghost` |
| `bt-query-builder__and` | separators are `visually-hidden`, built by the JS; the hook stays `data-qb-sep` |
| `bt-query-builder__or` | same |
| `bt-query-builder__group-label` | `form-label h6 mb-2` on the group's legend |
| `bt-query-builder__batch` | `bt-textarea-auto` on the textarea, `bt-query-builder__row--batch` on the row |
| `bt-query-builder__people-field` | the entity row's picker slot (`data-qb-picker-slot`) |
| `bt-query-builder__people-input` | — |
| `bt-query-builder__people-search` | — |
| `bt-query-builder__person-token` | `badge text-bg-primary-light` + `data-qb-token` |
| `bt-query-builder__chooser` | `bt-panel bt-panel--wide` on the `dropdown-menu` |
| `bt-query-builder__chooser-body` | `bt-panel__body--list` |
| `bt-query-builder__chooser-search` | the panel's search-first body (`bt-panel__body` + `form-control`) |
| `bt-query-builder__choice` | `dropdown-item`; the hook stays `data-qb-choice` |
| `bt-query-builder__choice-group` | `min-w-0` + `data-qb-choice-group` |
| `bt-query-builder__choice-heading` | `dropdown-header` |
| `bt-query-builder__pick` | — (died with the full-page chooser) |
| `bt-query-builder__field-links` | — |
| `bt-query-builder__blank` | `data-qb-blank`; Add a condition is the blank state |
| `bt-query-builder__blank-columns` | — |
| `bt-query-builder__starts` | — (the starting cards are retired) |
| `bt-query-builder__start` | — |
| `bt-query-builder__start-head` | — |
| `bt-query-builder__start-body` | — |
| `bt-query-builder__start-shape` | — |
| `bt-query-builder__start-slot` | — |

`modal-footer` leaves the generated list; Bootstrap still provides it.

### Other contract changes

| Contract | Was | Is |
|----------|-----|-----|
| Advanced search page | `public-search-advanced.html` | a dialog over `public-works.html`; `search-advanced-dialog.html` holds the chrome |
| Works template states | `query-empty`, `advanced-condition`; the retired page's `built` / `advanced-*` / `phase-*` | `no-query`, `facet-set-in-builder`; `builder-full-query`, `builder-empty`, `builder-one-condition`, `builder-or-group`, `builder-no-results` |
| Filter bar wiring | `CONFIGS` object in `filter-bar.js`, bars found by id prefix | markup: `data-filter-bar`, per-button `data-filter-*`, two template partials |
| Filter editor buttons | `#wf-editor-apply` / `-cancel` / `-remove` ids | `[data-editor-apply]` / `[data-editor-cancel]` / `[data-editor-remove]` |
| Entity filter type | `people`, hard-wired to the people widget | `picker`; the button names its panel in `data-filter-panel` |
| Picker panel hooks | `data-person-*` | `data-picker-*`; `data-person-ugent` stays, marking the UGent record |
| People-search rows | selected by `.people-result` | selected by `[data-ps-row]` |
| Card/table view toggle | persisted to `localStorage` via `data-view-store` | session-only; a consuming app persists the choice in a cookie it reads at first paint |
| `biblio:filter-add` event | reserved contract, never fired | removed |

---

## Slim sidebar keeps its labels, and its tooltips wait for slim (v2.21, 2026-08-14)

Re-copy `assets/booktower.css`; the icon fonts are unchanged since v2.20.

In `bt-sidebar--slim` the link and button text stays in the accessibility tree:
`.bt-sidebar__label` and `.btn-text` are visually hidden inside `.bt-sidebar--slim` rather than
`display: none`. Delete any `aria-label` you added to a sidebar link, and read each link's `title`
against its visible label — each `title` repeats it word for word. Bootstrap moves `title` to
`data-bs-original-title` when it initialises a tooltip. Where you mirror `sidebar-toggle.js`, enable
the tooltips with the slim state instead of at page load.

`.badge:not(.badge--total)` left the stylesheet — slim mode styles count badges only. The CSS build
runs autoprefixer against `.browserslistrc`, and `shell/shell.css` carries the same build stamp as
`assets/booktower.css`.

| Removed | Replaced by |
|---------|-------------|
| `bt-navbar__nav` | nothing — the class was unused |
| `aria-label` on a sidebar nav link | `.bt-sidebar__label`, which slim mode keeps in the accessibility tree |

---

## Experimental Advanced search builder shared rendering (v2.20, 2026-08-12)

Re-copy `assets/booktower.css` after the CSS rebuild, and render the advanced-search builder from
the shared condition and action partials rather than two separate copies. The builder renders
either as a full page or as a wide dialog over the results list, from the same partials, with the
conditions/actions split made explicit. The shell documents how to include partials cleanly.

This builder is experimental, and there is no legacy migration from a prior builder markup.

---

## Backoffice shell + work-card contract alignment (v2.19, 2026-08-12)

Re-copy `assets/booktower.css` after the CSS rebuild. The classes affected are `bt-sidebar`,
`bt-sidebar--slim` and `badge--total`.

The app shell supports a filter-drawer layout via `u-main__body--filter-drawer` and the companion
`u-main__sidebar` drawer behaviour. Sidebar count badges stay visible in the expanded app sidebar
and collapse into the slim-dot state under `bt-sidebar--slim`; remove helper wrappers such as
`d-inline-flex flex-shrink-0` from reusable sidebar links.

Public work-card references are aligned across the kit templates and sample result content. No new
CSS classes. If you mirror the main sidebar or work-card examples, match the current contract
instead of patching the output by hand.

---

## Sidebar badge layout fix and pattern sync (v2.18, 2026-08-12)

Re-copy `assets/booktower.css` after the CSS rebuild. The only classes affected are `bt-sidebar`,
`bt-sidebar--slim` and `badge--total`.

Sidebar count badges stay visible in the expanded app sidebar and collapse into the slim-dot state
under `bt-sidebar--slim`. The main sidebar markup drops helper wrappers such as
`d-inline-flex flex-shrink-0`. `patterns/sidebar.html` matches
`templates/partials/main-sidebar.html`; issue draft in `docs/wip/SIDEBAR-TOGGLE-BACKOFFICE.md`.

## Work card contributor links and access vocabulary settle (v2.17, 2026-08-11)

Re-copy `assets/booktower.css` and update work-card contributor markup. No classes changed.

Every contributor name is a link, and its identifier icon says where: the UGent crest or ORCID to
the researcher page; neither to a works search on the name (`?q=`). The muted, unlinked form is retired. Names print as first name, middle initials, surname
(`Mark B. De Moor`) on public, researcher and curator cards, deposit summaries and table fallbacks.
`bt-work-card__author` keeps each contributor together with `white-space: nowrap`.

Access badges on cards use the table below; closed access is backoffice only.

| Work-card access state | Badge |
|---|---|
| Open access | `badge text-bg-success` + `if-open-access` |
| Restricted access | `badge text-bg-secondary` + `if-lock` |
| Embargo | `badge text-bg-secondary` + `if-time`, naming the date |
| Embargo | `badge text-bg-transparent` + `if-forbid` |

Cards link year and container/publisher-as-container to the works overview; projects link to detail
pages, and publisher-as-container names render in `<cite>`.

Three decisions close in `docs/wip/`: visibility, retraction, per-type reference line.

## Advanced search becomes one builder in two renderings (v2.16, 2026-08-10)

`public-search-advanced.html` keeps its address and loses its markup: the builder now
lives in two partials, `search-advanced-conditions.html` and
`search-advanced-actions.html`, rendered twice — as that page, and as a dialog over
`public-works.html`. Both dead `/advanced-search` hrefs resolve.

One class added: `modal-dialog--wide`, feeding `--bs-modal-width`. Usage note in
`CLASS-USAGE.md`.

Removed, with where each thing went:

| Removed | Replaced by |
|---|---|
| The URL / Embed / API tab strip and the Save section inside the builder | The works toolbar actions group: Save search, Share, Export |
| `#cite-modal` on `public-work-detail.html` | A Cite panel on the same button, matching Add to list beside it |
| The unlabelled `⋯` dropdown on the works toolbar | Three labelled buttons |
| Subscribe to feed as a menu item | The Feed tab inside Share |
| The builder's `phase-1` / `phase-1-empty` / `phase-2` / `phase-2-empty` states | `built`, `advanced-empty`, `advanced-group`; `public-works.html` adds `advanced-condition` |

Eleven fields left the public field list — seven that `SEARCH-AND-FILTERING.md` rule 5
already places off the public surface, four awaiting an exposure decision. Pattern page:
`patterns/query-builder.html`.

---

## Token search retires; unused classes fail the gate (v2.15, 2026-08-10)

Seventeen classes removed: the `token-bar` and `token-suggestions` families, `bt-code-block` and
`bt-scroll-frame`. `public-search-advanced.html` with `query-builder.js` is the surviving
direction. `server/content/token-results.js` and its `/search` HTMX target go with them.

`check:classes` now **exits 1** on a class defined in `booktower.css` and used nowhere, matching the
direction it already enforced for undefined classes. A class kept on purpose goes in the
`intentional` list in `scripts/check-classes.js` with a reason.

**Consumers: re-copy `assets/booktower.css`.**

## Design principles move into the kit — and into the gates (v2.14, 2026-08-07)

No class or CSS changes. Consumers: nothing to re-copy. Update any link to `/base/*` per the table
below.

| Old URL | v2.14 |
|---|---|
| `/base/ai-guidelines.html` | removed — `AGENTS.md` is the working guide |
| `/base/integration.html` | removed — `docs/CONSUMING-BOOKTOWER.md` is the integration contract |
| `/base/design-principles.html` | `/foundations/design-principles.html` |

`base/` is gone; the principles page moved to `foundations/`, where `check:classes`, `check:a11y`
and `check:html` see it — they glob `templates elements patterns foundations getting-started`, and
HTML outside those five directories is validated by nothing. `base/` carried `font-serif`, a class
defined in no stylesheet.

The page holds six principles rather than four. Each carries a pass/fail test; the conflicts section
resolves eight standing tensions and names one open question for Open Science Policy. `AGENTS.md`
names all six inline, and `check:doc-refs` fails when the guide and the page disagree — the page
stays the only copy of their content.

## Work card — BEM wrappers, and the block absorbs its only modifier (v2.13, 2026-08-07)

Three classes added, four names retired. Supersedes v2.8's "Bootstrap structural regions stay":
without a `.card` ancestor, `--bs-card-*` is undefined.

| Old markup (selectors deleted) | v2.13 |
|---|---|
| `div.card-header` (inside `bt-work-card`) | `div.bt-work-card__header` |
| `div.card-body` (inside `bt-work-card`) | `div.bt-work-card__body` |
| `div.card-footer` (inside `bt-work-card`) | `div.bt-work-card__footer` |
| `bt-work-card bt-work-card--border-bottom` | `bt-work-card` |

`bt-work-card--border-bottom`'s declarations (`border-bottom`, vertical padding) moved to
`.bt-work-card`. The wrappers also dropped four declarations that only cancelled Bootstrap —
`background: transparent` and `border-bottom: none` on `__header`, `background: transparent` and
`border-top: none` on `__footer`, plus `margin-bottom: 0` — all the initial value on a `<div>` with
no `card-*` class. Every other declaration is unchanged, and real Bootstrap `.card` components
elsewhere keep `card-*`.

Re-copy `booktower.css`, rename the three wrappers, and drop `bt-work-card--border-bottom`. The
`.bt-work-card .card-*` and `.bt-work-card--border-bottom` selectors are gone from the compiled
CSS, so old markup with new CSS loses the card's header/body/footer layout and the rule between
cards.

## Modal ARIA — Bootstrap owns the runtime attributes (v2.12, 2026-08-06)

No class changes. Re-adapt the markup: all ten modal openers across `templates/` carry only
`class`, `id`, `tabindex="-1"` and `aria-labelledby`, and the two delete-list confirmations' footer
buttons drop `btn-sm`.

- **Remove `role="dialog"` and `aria-modal="true"` from static markup.** Bootstrap's `modal.js`
  sets both on show and removes them on hide (5.3.3 `_showElement` / `_hideModal`).
- **`aria-hidden="true"` is not the replacement.** It fails `check:html`'s `hidden-focusable` rule.
  Carry none of the three.
- **`aria-describedby` goes on the three confirmations** (`delete-list-modal`, `return-modal`,
  `pickup-modal`), pointing at the sentence that states the consequence, never at `.modal-body`.
  `export-modal` and `cite-modal` get none.
- **`role="alertdialog"` is unavailable.** Bootstrap overwrites `role` with `dialog` on every show.

Rule: `docs/ACCESSIBILITY.md` E6 · consumer duty: `docs/CONSUMING-BOOKTOWER.md`
accessibility baseline · reference example: `templates/biblio-researcher/lists.html`.

## Pagination pattern — the results bar (v2.11, 2026-08-06)

**Re-copy `booktower.css`.** No class changed, the icon fonts are unchanged, and one rule changed:
`bt-toolbar__right` is `flex-wrap: wrap` and shrinkable, from `flex-shrink: 0`.

`patterns/pagination.html` and `docs/CLASS-USAGE.md` pin the bar: each control in its own
`bt-toolbar__item`. Apply the markup below; `check:classes` stays silent on it.

| What | Was | Now | Why |
|---|---|---|---|
| Screen-reader prefix | `<span class="d-none d-md-inline-block visually-hidden">Showing </span>` | plain visible text: `Showing 1–50 of 879 results` | `visually-hidden` carries no `display`, so `d-none` won below `md` and dropped the word from the accessibility tree there while hiding it from everyone above it. One string, every width, every reader. |
| Result count | inside `<nav aria-label="Results pagination">` | sibling of the `<nav>`, in `bt-toolbar__left` | A count is a status, not navigation. Removes the `nav.d-flex.gap-3` wrapper too — `bt-toolbar__left` already gaps. |
| Inert page item | `<a class="page-link" href="#" aria-disabled="true">` | `<span class="page-link">` in `li.page-item.disabled` | `aria-disabled` is a label, not a behaviour: the link stayed focusable and clickable. Applies to end arrows, `…` gaps, and letters with no entries. |
| Arrows | `‹` / `›` text glyphs | `<i class="if if-chevron-left">` / `if-chevron-right`, `aria-hidden`, size inherited | One icon system. The link keeps `aria-label="Previous page"` / `"Next page"` — several sites had an arrow with no accessible name at all. |
| Live region | `aria-live="polite"` on both bars, or neither | exactly one count per list carries it — the bar at the head | A repeated bottom bar announced the same change twice. |
| Spacing | `mb-0` on `ul.pagination`, `ms-3` on the count | neither | `base/_reset.scss` zeroes list margins; the toolbar owns the gap. |
| Toolbar children | controls sometimes bare in `bt-toolbar__left`/`__right` | every child in its own `bt-toolbar__item` | Confirmed as the pattern for consuming apps. It is also load-bearing for `form-select`: as a direct flex child, `width: 100%` makes every select shrink to one shared width and the longest label truncates (visible on `public-works` today as “Year (new to…”). |

`check:a11y` enforces the five rules above (P1–P5): `visually-hidden` beside a display utility, an
`<a>` inside `li.page-item.disabled`, a text glyph in a `page-link`, text inside a pagination
`<nav>`, `mb-0` on `ul.pagination`. Nine files on the old markup are listed in `PAGINATION_DRIFT` in
`scripts/check-a11y.js`; `npm run check:pagination` lists them. `public-projects.html` is the
reference template (`Projects pagination (top)` / `(bottom)`); the other nine are tracked in
`notes/PLAN-kit-gaps-from-templates.md`, Tier 2 item 6.

---

## Backoffice status model + card completion (v2.10, 2026-07-30)

No class changes.

Deposit status (draft/submitted/returned/reviewed) is the one badge, visibility inside it as
`if-eye`/`if-eye-off` plus visually-hidden text. File access is never a badge on a backoffice card —
plain `bt-work-card__meta-item`. Org badges are muted (`text-bg-light`).

`bt-meta-list` leaves work cards: departments, projects, VABB and the footer are
`bt-work-card__meta` rows of `bt-work-card__meta-item`; separator scoped to
`__meta > __meta-item + __meta-item`; `.bt-work-card__meta-item .if` glues on an icon.
`bt-meta-list` moves off-card to `patterns/_booktower-components.scss`, minus its `__item`.

Public card titles open `templates/biblio-public/public-work-detail.html`, not `#` or
`/research/<id>`; backoffice titles stay `#`.

Apply the access-badge table below; `check:classes` stays silent. `text-bg-warning` on an access
badge is wrong; icons are `aria-hidden="true"`.

| Access state | v2.9 and earlier | v2.10 |
|---|---|---|
| Open access | `badge text-bg-success` | `badge text-bg-success` + `if-open-access` |
| Restricted access | `badge text-bg-warning` | `badge text-bg-secondary` + `if-lock` |
| Embargo | `badge text-bg-warning` + `if-time` | `badge text-bg-secondary` + `if-time` (badge names the date) |
| Closed access | `badge text-bg-secondary` | unchanged — and it never takes an icon |

Swept: `public-works.html`, `public-work-detail.html`, `public-work-detail-dataset.html`,
`public-project-detail.html`, `public-researcher-detail.html`, `public-organisation-detail.html`,
`deposit-4-review.html`, `search-advanced-builder.html`, `partials/search-suggest-panel.html`,
`server/content/search-result-cards.js`, `server/content/token-results.js`,
`patterns/work-card.html`, `patterns/work-actions.html`, `patterns/hero.html`,
`elements/badges.html`.

## Work card grammar — backoffice cards + add-to-list recipe (v2.9, 2026-07-30)

No class changes. The backoffice cards (curate.html, search-researcher,
search-my-research, search-filter-first, search-advanced-token, and the kit
page's curator/researcher sections) migrated to the v2.8 grammar: `__meta` /
`__meta-item` / `__actions`, access always a badge (fixed the double-class
`bt-meta-list__item-bordered badge` element in the researcher search twins),
curator kit titles corrected `h2`→`p`, curator authors as `__author` spans with
comma separators. The backoffice `__pub` scan line keeps its `·` separators —
deliberately distinct from the public Harvard line. Backoffice-only blocks
(departments, projects, VABB, footer) stay on generic `bt-meta-list` markup;
naming them is an open decision. The add-to-list dropdown composition is now a
documented recipe on `patterns/panel.html`.

## Work card grammar — public surface (v2.8, 2026-07-30)

Four classes added, no removals. The card's inner rows get semantic elements; Bootstrap structural
regions (`.card-header`, `.card-body`) stay. Migrate the markup below on touch.

| Old markup (still valid CSS, migrate on touch) | v2.8 |
|---|---|
| `div.bt-meta-list.pt-1` (card badge row) | `div.bt-work-card__meta` |
| `span.bt-meta-list__item-bordered` (type, in cards) | `span.bt-work-card__meta-item` |
| `div.d-flex.align-items-center.gap-2` (card actions) | `div.bt-work-card__actions` |
| author `<a>` with icons + space inside | `span.bt-work-card__author` — icons outside the `<a>`, spacing via CSS |

- `bt-meta-list__item-bordered` and `bt-work-card__meta-item`: the separator renders only *between*
  consecutive items (sibling `border-left`), never after the last item.
- `bt-work-card__authors` drops `display:flex`/`gap` — authors are prose with comma text nodes.
- The `.bt-work-card.card` chrome-strip rule is deleted; its one usage dropped `.card`.
- Access state on cards is always a badge; the bordered-item and bare-sentence renderings go from
  public cards.
- The public `__pub` line follows `docs/wip/WORK-CARD-REFERENCE-STYLES.md` (Harvard, `<cite>`,
  linked `<time>` year); `·` separator spans go on public.

Swept: search-result-cards.js, public-works.html, public-project-detail.html, work-card.html (public
section), work-actions.html, search-advanced-builder.html. Backoffice cards still carry the old
markup.

## HTML validity batch — check:html and check:a11y green (v2.7, 2026-07-30)

No class changes. `npm run check:html` and `check:a11y` pass; curate-detail gained
`h1.bt-toolbar__title` ("Curate record").

- **Stub forms:** prototypes carry no `<form>` without a working submit path; mark the spot
  `<!-- real impl: form POST /… -->` (ACCESSIBILITY.md C6).
- **Wrapping labels keep `for`/`id`:** `no-redundant-for` is off in `.htmlvalidate.json`
  (ACCESSIBILITY.md §C1). File-drop zones carry both.
- **`@state` vs checks:** ids unique across states; duplicate landmark names get an inline
  `html-validate-disable-next` directive (SERVER.md → Template states).
- **Duplicate pagination navs:** named "Results pagination (top)"/"(bottom)" (ACCESSIBILITY.md A5).
- Redundant `role="banner"`/`"contentinfo"` and invalid `width="auto"` are removed; the sidebar
  toggle's aria attributes moved to the button (`sidebar-toggle.js` selector updated).
- All 19 backoffice templates carry a WIP marker: do not implement in raven yet.

## Filter engines consolidated into filter-bar.js (v2.6, 2026-07-15)

One class removed: `filter-group--backoffice-only` and its `[data-surface]` rule, which dressed
backoffice groups in the deleted `search-filter-bar.html` partial. Surface scoping is per-bar
config, not CSS.

`filter-editor.js`, `filter-stubs.js`, `directory-filters.js` and `directory-filters-projects.js`
are replaced by one config-driven `assets/js/filter-bar.js`: one engine, one config per bar,
self-discovered by id prefix (`wf-` works, `rdir-` researchers, `pdir-` projects). Editor types:
checklist, boolean, year-range, text. The works page uses the same live chip bar as the
directories. Chips remain client-side prototype stubs. Registry: `docs/JAVASCRIPT.md`; interaction
model: `docs/SEARCH-AND-FILTERING.md`.

## Copy-to-clipboard pattern (v2.5, 2026-07-14)

No class changes. New kit page `patterns/copy-to-clipboard.html`. `clipboard.js` copies the
sibling `<code>` (or `data-clipboard-target` for dynamic sources) and drives icon-only
buttons. Public detail templates moved off inline `onclick` to `data-clipboard` (persistent
link + cite-modal Copy citation).

## Public search form + filter picker unified (v2.4, 2026-07-14)

**Public search form:** one skeleton per public listing header (`public-works`,
`public-researchers`, `public-organisations`, `public-projects`): `<form role="search">` →
`#suggest-wrapper` → `.input-group.input-group-lg` (`type="search"` input) →
`#suggest-panel.bt-suggest-panel`. Generic IDs: `q`, `suggest-wrapper`,
`suggest-panel`. Only `aria-label` copy, `action` and the hook vary: `hx-*` on works,
`data-directory-search` on directories (`elements/search-bar.html`).

**Filter picker:** one markup in `search-filter-bar`, `result-filter-bar` + `-projects` /
`-researchers`, `backoffice-facet-sidebar` and `patterns/filter-picker.html`: `role="group"`,
`.dropdown-header` labels, plain `.dropdown-item` buttons. Removed: the per-item `py-2` and
`d-flex align-items-center` utilities, the "Find a filter" input with its `filter-editor.js`
guard, and the invalid `aria-labelledby` on the menu `<div>`. Row padding:
`--bs-dropdown-item-padding-y: 0.5rem` on `.dropdown-menu`, read by `.dropdown-header` too.
`.bt-dropdown-scroll .dropdown-item` is flex, putting an applied check (`.ms-auto`) at the edge.

**Search-bar kit page:** `.input-group--hero` pill, listing search, `.form-control-search`
compact/toolbar.

---

## Access CTA rules + formatting conventions (v2.3, 2026-07-13)

No class changes; copy and behaviour on the public surface. Decision record: #141.

The access CTA splits into v1, parity with biblio.ugent.be, and v2, extended. Templates show v1:
the full CTA on the detail header, cards carrying only Cite + Add to list. v2 — Download / Access
at ⟨host⟩ / Log in / Select file on the card — is preserved as designs on
`patterns/work-actions.html`.

Removed: **Request access**, the per-row "Log in to access" links, the disabled **Under embargo**
button (embargo renders as text naming the post-embargo state), "Full Text at Publisher", and every
public trace of `private` files, not even a count (patent risk).

New rules: access-CTA file selection in `docs/DOMAIN-VOCABULARY.md`, formatting conventions in
`docs/UI-LAYER.md`.

---

## Bootstrap gap audit (v2.2, 2026-07-03)

The findings doc is retired (2026-08-13).

**Fixed:** the `.form-select` caret (a `background:` shorthand erased it), `bt-blank-slate`
compiling with its partial `@use`d, `--bs-info-rgb` matched to `--bt-blue`, disabled primary buttons,
slim-sidebar badge counts and reduced-motion spinners.

**Removed:** the classes in the map below, all no-op Bootstrap overrides,
`patterns/research-card-backup.html`, `patterns/htmx-patterns.html` and the duplicate
`elements/toolbar.html`.

### Removed during v2 development — migration map

Classes gone from v2's own churn. `npm test` fails on any undefined class; the OLD→v2 tables below
cover `bc-`/`c-`.

| Removed | Use instead |
|---------|-------------|
| `bt-btn-toolbar`, `--wide-spacing`, `--vertical` | One `bt-toolbar__item` per action inside `bt-toolbar`; `d-flex align-items-center gap-2` elsewhere |
| `bt-facets`, `bt-facet-name`, `bt-facet-check`, `bt-facet-count`, `bt-facet-separator`, `bt-facet-sep` | `fieldset`/`legend` + `d-flex form-check` rows, count as `badge bg-transparent`, plain `<hr>` between groups |
| `bt-avatar--dark` | Base `bt-avatar` (already the dark chip) |
| `btn-outline-white` | Nothing — design a dark-surface button when one is needed |
| `sr-only` | Bootstrap's `visually-hidden` |
| `bt-navbar__mark` | `bt-navbar__brand` |
| `people-result__meta`, `people-result__meta-item` | `bt-meta-list bt-meta-list--xs`, `bt-meta-list__item` |
| `people-results`, `people-result`, `people-result__icon`, `people-result__name` | `bt-results`, `bt-result`, `bt-result__icon`, `bt-result__name` |
| `bt-meta-list__item-bordered` | `bt-work-card__meta-item` draws the separator now |
| `bt-meta-text` | Bootstrap `small text-muted` |
| `app-sidebar`, `app-sidebar-link`, `app-sidebar-label` | `bt-sidebar` and its elements |
| `bt-blank-slate-muted/-primary` (single dash) | `bt-blank-slate--muted/--primary` |
| `bt-table` | Bootstrap `.table .table-hover .align-middle` |
| `bt-filter-bar`, `bt-bulk-bar`, `bt-pagination-bar` | `bt-toolbar` |
| `bt-results-toolbar` | `bt-toolbar bt-toolbar--bordered` |
| `bt-results-col`, `bt-content-area`, `bt-facets-col` | `u-main__content` / `u-main__body--split` layout contract |
| `bt-sub-sidebar`, `--bordered`, `--slim` | `bt-sidebar` and its modifiers |
| `bt-stepper` family | Not part of this library |
| `card--work`, `card-research`, `card-meta`, `card-actions`, `card-title`, `card-authors`, `card-publication` | `bt-work-card` with Bootstrap `card-header`/`card-body`/`card-footer` |
| `is-selected` on `<tr>` | Bootstrap `.table-active` |
| `td-title`, `td-meta`, `td-actions`, `td-actions-inner`, `row-actions` | Bootstrap utilities directly |
| `u-scroll-wrapper`, `u-scroll-wrapper__body`, `u-maximize-height` | The `u-layout--app` / `u-main__*` shell |
| `.bt-toolbar.h-auto` state hook | `align-items-start` where needed |
| `filter-editor`, `__title`, `__body`, `__body--checklist`, `__actions` | `bt-panel` and its elements/modifiers (see `notes/ARCHIVE-PROPOSAL-panel-unification.md`) |
| `filter-tag` | Clickable badge: `<button>`/`<a>` with `badge badge--outline` |
| `filter-year__input` | `bt-panel__year-input` |

**New rules** are in `docs/CSS-ARCHITECTURE.md`: feed `--bs-*` component variables; longhands
across grouped selectors; raw colours only in `_colors.scss`/`_tokens.scss`/SVG.
`npm run check:partials` and `npm run check:classes` enforce them.

**Added:** `min-w-0`, `bg-success-light` and `--bt-*-rgb` tokens; backoffice surface tokens work on
nested `[data-surface]` containers.

---

## Breaking change — unified `bt-` prefix (v2.1)

All component classes now use a single `bt-` prefix. The old `bc-` and `c-`
prefixes are retired. The `u-` prefix for utilities and layout shells is unchanged.
Find-and-replace the following across every template, partial, and stylesheet:

| Old class | New class |
|-----------|-----------|
| `bc-navbar` | `bt-navbar` |
| `bc-navbar__brand` | `bt-navbar__brand` |
| `bc-navbar__sep` | `bt-navbar__sep` |
| `bc-navbar__nav` | `bt-navbar__nav` |
| `bc-navbar__link` | `bt-navbar__link` |
| `bc-toolbar` | `bt-toolbar` |
| `bc-toolbar__left` | `bt-toolbar__left` |
| `bc-toolbar__right` | `bt-toolbar__right` |
| `bc-toolbar__middle` | `bt-toolbar__middle` |
| `bc-toolbar__title` | `bt-toolbar__title` |
| `bc-toolbar__item` | `bt-toolbar__item` |
| `bc-toolbar--bordered` | `bt-toolbar--bordered` |
| `bc-avatar` | `bt-avatar` |
| `bc-avatar--small` | `bt-avatar--small` |
| `bc-avatar--large` | `bt-avatar--large` |
| `c-sidebar` | `bt-sidebar` |
| `c-sidebar--bordered` | `bt-sidebar--bordered` |
| `c-sub-sidebar` | `u-main__sidebar` |
| `c-sub-sidebar--bordered` | `u-main__sidebar--bordered` |
| `c-blank-slate` | `bt-blank-slate` || `c-blank-slate-muted` | `bt-blank-slate--muted` |
| `c-blank-slate-primary` | `bt-blank-slate--primary` |
| `c-radio-card` | `btn-check` (Bootstrap) |
| `c-radio-card__group` | `bt-btn-check__group` (Bootstrap extension for grouping btn-checks) |
| `c-radio-card__body` | Deprecated |
| `c-file-drop` | `bt-file-drop` |
| `c-file-drop__icon` | `bt-file-drop__icon` |
| `c-file-drop__text` | `bt-file-drop__text` |
| `c-file-drop__hint` | `bt-file-drop__hint` |
| `c-hero` | `bt-hero` |
| `c-hero__bg` | `bt-hero__bg` |
| `c-hero__content` | `bt-hero__content` |
| `c-button-toolbar` | `bt-btn-toolbar` |
| `c-button-toolbar--wide-spacing` | `bt-btn-toolbar--wide-spacing` |
| `c-button-toolbar--vertical` | `bt-btn-toolbar--vertical` |
