# Class usage notes and gotchas

## Shell and layout

**`u-main__*`** — a results layout is `u-main__body`, `u-main__sidebar`, `u-main__content`, `u-main__content-header` and `u-main__content-body`. `u-main__sidebar` is the facet `<aside>`; `bt-sidebar` is the app navigation rail, never a filter rail. [`patterns/layout-shells.html`](../patterns/layout-shells.html)

**`u-notifications`** — never set `z-index` at the call site. [`assets/scss/patterns/_layouts.scss`](../assets/scss/patterns/_layouts.scss)

## Navigation

**`bt-navbar__brand`** — the backoffice logo link. [`assets/scss/patterns/_booktower-navbar.scss`](../assets/scss/patterns/_booktower-navbar.scss)

**`bt-sidebar`** — Wrap link text in `.bt-sidebar__label`; never add `aria-label` to a sidebar link. [`patterns/sidebar.html`](../patterns/sidebar.html)

**`bt-toolbar`** — give each action its `bt-toolbar__item` inside `bt-toolbar__left`, `bt-toolbar__middle` or `__right`, never a flex group. `bt-title-toolbar` pairs a heading with a right-aligned button. [`patterns/toolbar.html`](../patterns/toolbar.html)

## Lists and cards

**`bt-work-card`** — `__header`, `__body` and `__footer` own their padding, so a card takes no `card-*` class. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card--compact`** — tightens padding, margins and gaps and nothing else: never hide, truncate or rewrite content with CSS. Its action is `btn-xs`; a full card keeps `btn-sm`. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card__meta`** — *every* metadata row in a card, not only the header one. `__meta-item` marks a text value; no divider follows a badge or trails the last value. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card__pub`** — the reference line takes plain spans, links and `<time>` values. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card__author`** — one contributor per element. Identifier icons go inside `bt-work-card__author` and outside its link; the `visually-hidden` identifier text goes inside the link. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-meta-list`** — the metadata line outside a card; it appears in no card. `bt-meta-list__item` pairs a leading icon with its text and serves file rows, suggestion rows and person rows alike. `bt-meta-list--xs` is the dense variant, and panel rows stay at the base size. [`assets/scss/patterns/_booktower-components.scss`](../assets/scss/patterns/_booktower-components.scss)

**`__meta-item` against `bt-meta-list`** — a card's `bt-work-card__meta-item` divides consecutive values with a rule. Every other metadata line, the detail heading included, separates them by the row's gap. Neither is a mistake to correct against the other.

**Table** — plain Bootstrap; no custom table class exists. Title cell: `fw-semibold text-reset text-decoration-none` on the link, `small text-muted mt-1` on the secondary line. Action cell: `text-end` on the `<td>`, `btn-ghost btn-sm` inside. Selected row: `.table-active` on the `<tr>`.

## Detail pages

**`bt-detail-heading`** — the status row and title opening a record page; it owns the space below, so add no margin utility there. Put `bt-detail-heading__title` on the `h1`. The status slot is a `bt-meta-list`, never `bt-work-card__meta-item`, omitted when the record has no badges or values. Use the block when the `h1` carries the record's title, an Edit prefix included; when the `h1` names the task, summarise the record as a `bt-work-card--compact` instead. [`patterns/detail-heading.html`](../patterns/detail-heading.html)

**`bt-alt-titles`** — goes between the `h1` and the contributors on a public work-detail page. One `bt-alt-titles__item` per stored entry, ordered subtitle → translated → other, with `bt-alt-titles__item--subtitle` on the subtitle and a plain `small text-muted` span on the rest. Never truncate an item. [`assets/scss/patterns/_booktower-components.scss`](../assets/scss/patterns/_booktower-components.scss)

**`csl-entry`** — it, `csl-left-margin` and `csl-right-inline` are citeproc-js output. Keep it intact. [`patterns/citations.html`](../patterns/citations.html)

## Search and filtering

**`badge--outline`** — an applied filter chip is `badge badge--outline` on a `<button>` or `<a>`; `filter-chip-group` joins two into a split label and remove pill. A display-only summary is `badge text-bg-primary-light`. [`patterns/filter-picker.html`](../patterns/filter-picker.html)

**`bt-result`** — one row of search results, `bt-results` the floating list around them. `bt-result__icon` is the leading icon and `bt-result__name` a name line, not a font-weight utility, and `is-selected` is the chosen state, paired with `aria-selected="true"`. [`patterns/people-search.html`](../patterns/people-search.html)

**`bt-query-builder__conditions`** — a row's markup sets no width. [`patterns/query-builder.html`](../patterns/query-builder.html)

- `bt-query-builder__row` takes three children and no layout classes: `bt-query-builder__row-kind`, `bt-query-builder__phrase` (role select, operator select, `bt-query-builder__row-value`) and `bt-query-builder__row-actions`.
- `bt-query-builder__alts` is an OR group's inner list, whose alternatives line up with each other and not with the rows outside it.
- A `bt-textarea-auto` pasted-identifier box needs `bt-query-builder__row--batch` on its row.
- A person token is `badge text-bg-primary-light` in the value cell, beside a `badge badge--outline` button opening the picker.
- The field chooser opens from `bt-btn-inline-edit` into a `bt-panel bt-panel--wide` on `dropdown-menu`; each group is `min-w-0` around a `dropdown-header` and a `ul.list-unstyled` of `dropdown-item` rows.

## Forms and controls

**`btn-ghost`** — it and every `btn-outline-*` carry Booktower tokens. [`elements/buttons.html`](../elements/buttons.html)

**`bt-link-more`** — takes an optional trailing `if-arrow-right if--xs`. [`elements/buttons.html`](../elements/buttons.html)

**`bt-avatar`** — with a Bootstrap background utility it forces white text and icon colour. [`elements/avatars.html`](../elements/avatars.html)

**`bt-search-clear`** — goes on a `btn btn-ghost` **between the input and the submit button**, with `aria-label="Clear search"` and `if-close`, inside an `.input-group`. Use an `<a>` where clearing changes the address, a `<button type="button">` where the box filters in place. Size follows the group, so `input-group-sm` needs no modifier, and where the field is `type="search"` the browser's own clear is suppressed. [`elements/search-bar.html`](../elements/search-bar.html)

**`bt-panel`** — a title, one or more `bt-panel__body` blocks, an optional `bt-panel__actions` footer. [`patterns/panel.html`](../patterns/panel.html)

- A panel sizes to content; `bt-panel--wide` suits one whose body swaps while the user types.
- The body layouts `--checklist`, `--boolean`, `--year`, `--form` and `--list` are generic; `--list` holds rows that act rather than tick.
- Bodies are direct children of `bt-panel`. A first body with no title above it takes `border-top-0`; a panel holding prose instead of bodies overrides with `p-3`.
- On a `dropdown-menu`, `bt-panel` zeroes the menu's own padding, so no `p-0` at the call site.
- Action rows are plain `.dropdown-item`. A checklist row's trailing link goes after the `form-check-label`, never inside it.
- A rich `form-check-label` carries `bt-result__name` plus one `bt-meta-list` per group of values. [`patterns/people-search.html`](../patterns/people-search.html)

**`modal-dialog--wide`** — the only Booktower modal modifier: stack it on `modal-dialog modal-xl`, which it does not replace. [`assets/scss/components/_bootstrap-components.scss`](../assets/scss/components/_bootstrap-components.scss)

**`popover--sm`** — it and `popover--dark` apply through `data-bs-custom-class`. [`elements/popovers.html`](../elements/popovers.html)

## Badges and alerts

- The neutral metadata badge is `badge text-bg-light border`.
- A clickable badge is a `<button>` or `<a>` carrying `.badge`; a plain status badge stays a `<span>`. A `<button>` inside a badge is the remove control. Neither takes an extra class.
- The chip whose editor is open adds Bootstrap's `.active` to `badge--outline`, plus `aria-current="true"` on the label half.
- `badge--lg` is the tap-target size; `badge--tab` pairs with `role="tab"` and `aria-selected`.

**`alert--sm`** — it and `alert--dashed` sit on Bootstrap `.alert` and `.alert-*`. [`elements/alerts.html`](../elements/alerts.html)

## Utilities

**`bg-faculty-<code>`** — it and `bg-faculty-<code>-light` are keyed by live Biblio org code. [`assets/scss/utilities/_utilities.scss`](../assets/scss/utilities/_utilities.scss)

**`bt-table-sticky-col`** — on a `.table` inside `.table-responsive` it pins the first column. `bt-dropdown-scroll` is the scrollable inner list of a `dropdown-menu` with a fixed header, and takes its width from `--bs-dropdown-min-width`. [`assets/scss/patterns/_booktower-components.scss`](../assets/scss/patterns/_booktower-components.scss)

**`ff-sans`** — forces system-UI sans where a heading or display font would otherwise be inherited. A muted caption is Bootstrap's `small text-muted`; there is no Booktower class for one.

**Icons** — use only an `if-[name]` present in [`assets/scss/icons/_icon-font.scss`](../assets/scss/icons/_icon-font.scss).

## Plain Bootstrap — no `bt-*` class exists, do not invent one

```
Modal        modal, modal-dialog, modal-content, modal-header/-body/-footer
Tabs         nav nav-tabs + tab-content/tab-pane
Breadcrumb   nav > ol.breadcrumb > li.breadcrumb-item
Pagination   ul.pagination pagination-sm
Facets       fieldset, legend, form-check*, collapse
```

A show-more button carries `aria-expanded="false"` while its `<div class="collapse">` starts collapsed; do not rely on `.collapsed`.

Breadcrumb rule H3 and modal ARIA rule E6: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md).
