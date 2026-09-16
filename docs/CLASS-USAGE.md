# Class usage notes and gotchas

## Shell and layout

**`u-main__*`** — build a results page from `u-main__body`, holding `u-main__sidebar`, `u-main__content`, `u-main__content-header` and `u-main__content-body`. The filters go in `u-main__sidebar`, which is an `<aside>`. `bt-sidebar` is the app's main navigation column and never holds filters. [`patterns/layout-shells.html`](../patterns/layout-shells.html)

**`u-notifications`** — this stack positions its contents. Do not set `z-index` on anything you put inside it. [`assets/scss/patterns/_layouts.scss`](../assets/scss/patterns/_layouts.scss)

## Navigation

**`bt-sidebar`** — wrap the text of every sidebar link in `.bt-sidebar__label`. Do not give a sidebar link an `aria-label`. [`patterns/sidebar.html`](../patterns/sidebar.html)

**`bt-toolbar`** — put every toolbar action in its own `bt-toolbar__item`, inside `bt-toolbar__left`, `bt-toolbar__middle` or `bt-toolbar__right`. Do not gather actions in a wrapper `<div>` with flex utilities. `bt-title-toolbar` is a heading with one action button on the right. [`patterns/toolbar.html`](../patterns/toolbar.html)

## Lists and cards

**`bt-work-card`** — `bt-work-card__header`, `__body` and `__footer` set their own padding. Do not add Bootstrap's `card-*` classes to a work card. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card--compact`** — this makes the card's padding, margins and gaps smaller and changes nothing else. Do not hide, shorten or rewrite card content with CSS. The button on a compact card is `btn-xs`, and on a normal card `btn-sm`. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card__meta`** — this marks every metadata row in a card, not only the row in the header. Inside it, `bt-work-card__meta-item` marks a text value. A vertical rule appears between two neighbouring values, but never after a badge and never after the last value. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-work-card__author`** — use one of these per contributor. Put the identifier icons, such as ORCID, inside `bt-work-card__author` but outside the link. Put the `visually-hidden` text naming them inside the link. [`patterns/work-card.html`](../patterns/work-card.html)

**`bt-meta-list`** — this is the metadata row used outside a card, on detail-page file rows, suggestion rows and person rows. Never use it inside a card. Each `bt-meta-list__item` pairs a leading icon with its text. `bt-meta-list--xs` is the denser version; rows inside a panel stay at the normal size. [`assets/scss/patterns/_booktower-components.scss`](../assets/scss/patterns/_booktower-components.scss)

**Two metadata rows, two separators** — inside a card, `bt-work-card__meta-item` puts a vertical rule between neighbouring values. Every other metadata row, including the one in a detail heading, separates values by the row's gap instead. Both are correct. Do not change one to match the other.

**Table** — tables are plain Bootstrap and Booktower adds no table class. In a title cell, put `fw-semibold text-reset text-decoration-none` on the link and `small text-muted mt-1` on the line below it. In an action cell, put `text-end` on the `<td>` and `btn-ghost btn-sm` on the buttons inside. Mark a selected row with `.table-active` on the `<tr>`.

## Detail pages

**`bt-detail-heading`** — this is the status row and title at the top of a record page, status row first. It sets its own spacing below, so do not add a margin utility to it. Put `bt-detail-heading__title` on the `h1`. Build the status row from `bt-meta-list`, not `bt-work-card__meta-item`, and leave the row out when the record has no badges or values.

Use `bt-detail-heading` when the `h1` is the record's own title, including when a verb comes first, as in "Edit Quantum computing". When the `h1` names a task instead, leave `bt-detail-heading` out and show the record below as a `bt-work-card--compact`. [`patterns/detail-heading.html`](../patterns/detail-heading.html)

**`bt-alt-titles`** — on a public work-detail page, put this between the `h1` and the contributors. Render one `bt-alt-titles__item` per stored title, in the order subtitle, translated, other. Add `bt-alt-titles__item--subtitle` to the subtitle, and label every other item with a plain `small text-muted` span. Never shorten a title. [`assets/scss/patterns/_booktower-components.scss`](../assets/scss/patterns/_booktower-components.scss)

**`csl-entry`** — `csl-entry`, `csl-left-margin` and `csl-right-inline` come from citeproc-js. Do not restyle or rename them. [`patterns/citations.html`](../patterns/citations.html)

## Search and filtering

**`badge--outline`** — an applied filter chip is `badge badge--outline` on a `<button>` or an `<a>`. `filter-chip-group` joins two such chips into one pill, a label on the left and a remove button on the right. A chip that only displays a value, with nothing to click, is `badge text-bg-primary-light` instead. [`patterns/filter-picker.html`](../patterns/filter-picker.html)

**`bt-result`** — `bt-result` is one row of search results and `bt-results` is the floating list holding them. `bt-result__icon` is the icon at the start of the row. `bt-result__name` is the display name; use that class rather than a font-weight utility. Mark the chosen row with `is-selected` and `aria-selected="true"` together. [`patterns/people-search.html`](../patterns/people-search.html)

**`bt-query-builder__conditions`** [`patterns/query-builder.html`](../patterns/query-builder.html)

- Give each `bt-query-builder__row` exactly three children and no layout classes: `bt-query-builder__row-kind`, then `bt-query-builder__phrase` holding the role select, the operator select and `bt-query-builder__row-value`, then `bt-query-builder__row-actions`.
- `bt-query-builder__alts` is the inner list of an OR group. Its alternatives align with each other, not with the rows outside the group.
- A row holding a `bt-textarea-auto` box for pasted identifiers also needs `bt-query-builder__row--batch`.
- A person token is `badge text-bg-primary-light`, sitting in the value cell next to a `badge badge--outline` button that opens the picker.
- The field chooser opens from a `bt-btn-inline-edit` button. Its panel is `bt-panel bt-panel--wide` on a `dropdown-menu`. Each group inside carries `min-w-0` and holds a `dropdown-header` above a `ul.list-unstyled` of `dropdown-item` rows.

## Forms and controls

**`bt-search-clear`** — put this on a `btn btn-ghost` **between the input and the submit button**, and put all three in an `.input-group`. Give it `aria-label="Clear search"` and an `if-close` icon. Use an `<a>` when clearing loads a new URL, and a `<button type="button">` when it filters a list in place. The button takes its size from the input group. On a field with `type="search"`, the browser's own clear button is hidden. [`elements/search-bar.html`](../elements/search-bar.html)

**`bt-panel`** — a panel holds a title, one or more `bt-panel__body` blocks, and an optional `bt-panel__actions` footer. [`patterns/panel.html`](../patterns/panel.html)

- A panel is as wide as its contents. Use `bt-panel--wide` when the body is replaced as the user types.
- `--checklist`, `--boolean`, `--year`, `--form` and `--list` are the body layouts, and any panel may use any of them. Rows in a `--list` body run an action; rows in a `--checklist` body tick a box.
- Every `bt-panel__body` is a direct child of `bt-panel`. Add `border-top-0` to a first body that has no title above it. A panel holding prose rather than body blocks sets its own padding with `p-3`.
- On a `dropdown-menu`, `bt-panel` already removes the menu's padding, so do not add `p-0` yourself.
- Action rows are plain `.dropdown-item`. When a checklist row ends in a link, put that link after the `form-check-label`, never inside it.
- A `form-check-label` may carry `bt-result__name` and one `bt-meta-list` per group of values. [`patterns/people-search.html`](../patterns/people-search.html)

**`modal-dialog--wide`** — add this to `modal-dialog modal-xl`. It widens that size rather than replacing it, and it is the only modal modifier Booktower adds. [`assets/scss/components/_bootstrap-components.scss`](../assets/scss/components/_bootstrap-components.scss)

## Badges and alerts

- A badge that acts or navigates is a `<button>` or an `<a>` carrying `.badge`; a badge that only shows a status stays a `<span>`. A `<button>` placed inside a badge is its remove control. None of these needs an extra class.
- When a chip's editor is open, add Bootstrap's `.active` to `badge--outline` and `aria-current="true"` to the label half.

## Utilities

**`bg-faculty-<code>`** — `bg-faculty-<code>` and `bg-faculty-<code>-light` take the faculty's organisation code from Biblio, as in `bg-faculty-we`. [`assets/scss/utilities/_utilities.scss`](../assets/scss/utilities/_utilities.scss)

**`bt-dropdown-scroll`** — set the width of this scrolling dropdown list with `--bs-dropdown-min-width`. [`patterns/filter-picker.html`](../patterns/filter-picker.html)

**`ff-sans`** — this sets the sans-serif body font on an element that would otherwise inherit a heading or display font. For a muted caption, use Bootstrap's `small text-muted`; Booktower adds no class for one.

**Icons** — use only an `if-[name]` that exists in [`assets/scss/icons/_icon-font.scss`](../assets/scss/icons/_icon-font.scss).

## Plain Bootstrap — no `bt-*` class exists, do not invent one

```
Modal        modal, modal-dialog, modal-content, modal-header/-body/-footer
Tabs         nav nav-tabs + tab-content/tab-pane
Breadcrumb   nav > ol.breadcrumb > li.breadcrumb-item
Pagination   ul.pagination pagination-sm
Facets       fieldset, legend, form-check*, collapse
```

A show-more button needs `aria-expanded="false"` when the `<div class="collapse">` it controls starts closed. Bootstrap only adds its own `.collapsed` class after the first click, so do not style against that.

Breadcrumbs follow rule H3 and modal ARIA follows rule E6 in [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md).
