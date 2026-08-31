# JavaScript

Booktower uses small vanilla JavaScript files around server-rendered HTML. Bootstrap and HTMX are
runtime dependencies; there is no client application framework. Comment rules:
[`CODE-COMMENTS.md`](CODE-COMMENTS.md).

## Rules

- Real pages keep behavior in `assets/js/`. They contain no inline behavioral scripts.
- A kit page may use inline JavaScript only for a self-contained demonstration. Shared behavior
  belongs in a named file.
- Each file handles one concern, exits when its host markup is absent and appears in the registry
  below.
- Components communicate through DOM state or custom events. One component does not call another's
  private functions.
- HTMX-swapped content must work after the swap. Use delegated listeners or initialize from
  `htmx:afterSwap`.
- JavaScript may toggle existing classes. CSS values and layout rules stay in SCSS.

## Prototype test

Use separate `@state` blocks when both the before and after can be opened as static examples.
JavaScript belongs in a prototype only when the interaction itself must be tested, such as keyboard
navigation, live grouping or copying to the clipboard.

- Clone new UI from a `<template>` in the owning partial. Do not build reviewable markup from strings.
- Keep fields, operators, statuses and labels in markup or their owning catalog.
- Mark invented values as fixtures. Do not compute plausible-looking data.
- Put fake responses in a `-stub.js` file so production can remove the stub without replacing the
  component behavior.
- Record existing violations below and fix them when that script is changed.

Template states are defined in [`SERVER.md`](SERVER.md). Kit-page HTML owns the examples a reader
reviews; this document owns JavaScript behavior and dependencies.

## Loading

The development server loads HTMX in the document head, then Bootstrap, `clipboard.js` and
`popovers.js` at the end of every page. Page-specific scripts follow their host markup.

Only two local orders matter:

1. `people-search.js` before `people-search-stub.js`.
2. `filter-bar.js` before `filter-sheet.js`.

Remove a `-stub.js` include when its endpoint replaces the fixture response.

## Registry

### `bulk-select.js`

- **Purpose:** Shows the backoffice bulk-action bar, controls select-all and maintains its checked,
  unchecked and indeterminate names.
- **Hosts:** `curate.html`.
- **Input/output:** Listens for checkbox `change`; dispatches no custom event.
- **Status:** Production-shaped behavior; the current curate page is still a prototype.

### `clipboard.js`

- **Purpose:** Copies the adjacent `<code>` or `data-clipboard-target`, then briefly changes the
  button's label, icon and state.
- **Hosts:** All kit pages through `server.js`; explicitly included by `work-detail.html` for the
  consumer-facing template.
- **Input/output:** Delegated click on `[data-clipboard]`; dispatches no custom event.
- **Status:** Production-shaped behavior. Pattern: `patterns/copy-to-clipboard.html`.

### `directory-search.js`

- **Purpose:** Filters one directory's inline fixture data and provides combobox show, hide and
  keyboard behavior.
- **Hosts:** public researchers, organizations and projects.
- **Markup contract:** One `[data-directory-search]` wrapper contains the input and
  `.bt-suggest-panel`; `script[data-suggest-source]` supplies the fixture rows. The script binds
  structurally, so directory-local ids may vary.
- **Input/output:** Listens for input, focus, keyboard, outside click and form submit; dispatches no
  custom event.
- **Status:** The behavior is reusable; production replaces `script[data-suggest-source]` with a
  server suggestion endpoint.
- **Template debt:** `update()` builds result and no-match markup as strings. Replace both with
  templates in the directory-search partial.

### `filter-bar.js`

- **Purpose:** Runs each `[data-filter-bar]`: picker, editor, editable chips and clear-all.
- **Hosts:** public works, researchers and projects.
- **Markup contract:** The value of `data-filter-bar` is the id prefix. Each host provides
  `<prefix>filter-picker-list`, `<prefix>add-filter-dropdown`, `<prefix>add-filter-btn`,
  `<prefix>filter-editor`, `<prefix>active-chips` and `<prefix>clear-all`. Picker buttons declare
  their label, editor type and source through `data-*`. Options live in
  `filter-option-lists.html`; editor and chip templates live in `filter-editor-templates.html`;
  entity pickers name their panel partial. Include each named panel once per host. Values are
  stored by ID, not display label.
- **Input/output:** Listens for clicks, editor input and Escape; dispatches no custom event.
- **Status:** Prototype-only. Chips do not refilter results. Template test: passes.

### `filter-sheet.js`

- **Purpose:** Moves the works filter picker, editor and clear-all control into the mobile Offcanvas
  below `lg`, then restores them to the toolbar above it.
- **Hosts:** public works, after `filter-bar.js`.
- **Input/output:** Listens for viewport changes, editor visibility and sheet actions; dispatches no
  custom event.
- **Status:** Prototype-only because it rides on the client-only filter bar.
- **Template debt:** `decorateRows()` builds a small value-and-chevron suffix with `innerHTML`.
  Move it to a template if that suffix grows.

### `org-tree.js`

- **Purpose:** Expands or collapses every department in the public organization tree and updates the
  controlling button.
- **Hosts:** public organizations.
- **Input/output:** Listens for the expand-all click; dispatches no custom event.
- **Status:** Prototype-only until the tree uses real organization data.

### `people-search.js`

- **Purpose:** Runs the single-person picker, including result visibility, keyboard selection,
  selected state, hidden form values and clearing.
- **Hosts:** deposit find steps and the public works query builder.
- **Input/output:** Listens for row click/keyboard, input keyboard and `htmx:afterSwap`; dispatches
  `people-search:select` from the widget with `{ id, name, affiliation }`.
- **Status:** Production-shaped behavior; fixture responses live in `people-search-stub.js`.
- **Template debt:** `renderSelected()` builds the fallback selected row as a string. Hosts should
  provide `[data-ps-selected]`, or the widget should clone one selected-row template.

### `people-search-stub.js`

- **Purpose:** Supplies fixture people and emits the swap event that a real search response would
  cause.
- **Hosts:** immediately after `people-search.js` in prototype pages.
- **Input/output:** Listens for input on `[data-ps-input]`; dispatches `htmx:afterSwap` from the result
  container.
- **Status:** Prototype-only. Remove the include when `/people/search` exists.

### `popovers.js`

- **Purpose:** Initializes Bootstrap popovers on first paint and inside swapped fragments.
- **Hosts:** All kit pages through `server.js`.
- **Input/output:** Listens for `htmx:afterSwap`; dispatches no custom event.
- **Status:** Production-shaped behavior. A trigger inside a link needs
  `data-bs-container="body"`.

### `query-builder.js`

- **Purpose:** Runs advanced-search rows, field changes, value shapes, shared picker panels, OR
  groups, blank-state restoration and accessible action names.
- **Hosts:** public works. Pattern and openable states: `patterns/query-builder.html`.
- **Markup contract:** Row, group, chooser, token and picker markup lives in
  `search-advanced-conditions.html` and its included partials. Choices name the row template,
  allowed operators, fixed values and picker panel through `data-qb-*`; the script carries no field
  catalog.
- **Input/output:** Listens for click, input and change in `#qb-conditions`, Bootstrap dropdown events
  and dialog toggles; dispatches no custom event.
- **Status:** Prototype-only. Production renders query state and count server-side; static states
  carry fixture counts.

### `result-actions.js`

- **Purpose:** Returns focus to the results bar's Actions button after a dialog opened from its
  dropdown closes.
- **Hosts:** public works.
- **Input/output:** Listens for Bootstrap modal close events; dispatches no custom event.
- **Status:** Production-shaped behavior.

### `search-clear.js`

- **Purpose:** Shows an inline clear control only while its preceding input has text. A button clear
  empties the input, emits `input` and restores focus; a link clear needs no click handler.
- **Hosts:** public search and directory pages.
- **Input/output:** Listens for input and button click; dispatches a native `input` event.
- **Status:** Production-shaped behavior.

### `sidebar-toggle.js`

- **Purpose:** Collapses and expands the backoffice sidebar, updates its accessible state and enables
  link tooltips only in slim mode. Below `xl`, slim is the default.
- **Hosts:** backoffice pages through `main-sidebar.html`.
- **Input/output:** Listens for toggle clicks and viewport changes; dispatches no custom event.
- **Status:** Production-shaped behavior. A consuming server may persist the preference in a cookie;
  the prototype resets on reload.

### `suggest-panel.js`

- **Purpose:** Opens and closes public autocomplete, filters rendered result groups by type and
  provides keyboard movement for tabs and suggestion rows.
- **Hosts:** public index and works pages.
- **Markup contract:** These hosts use the fixed `#q`, `#suggest-wrapper` and `#suggest-panel` ids;
  HTMX swaps the server-owned suggestion rows into the existing panel. Directory pages use
  `directory-search.js` instead and bind through `[data-directory-search]`.
- **Input/output:** Listens for input focus/keyboard, panel keyboard, outside click, submit and
  `htmx:afterSwap`; dispatches no custom event.
- **Status:** Production-shaped behavior. The server owns suggestion rows.

### `view-toggle.js`

- **Purpose:** Shows the result panel selected by `[data-view-toggle]` and hides the other
  `[data-view-panel]` values.
- **Hosts:** curate and researcher search.
- **Input/output:** Listens for radio `change`; dispatches no custom event.
- **Status:** Production-shaped behavior. The prototype resets on reload; a consuming server may
  persist the initial view.

## HTMX

| Target | Listener | Result |
|---|---|---|
| `#suggest-panel` | `suggest-panel.js` | Rebind type tabs and synchronize visibility |
| `[data-people-search]` | `people-search.js` | Initialize a swapped widget |
| `[data-ps-results]` | `people-search.js` | Update result visibility and live-region text |
| Popover trigger in any swapped fragment | `popovers.js` | Initialize Bootstrap popover |

`#file-list` and `#author-list` need no JavaScript after their HTMX swaps.
