# JavaScript architecture

> Comment conventions for this area: `docs/CODE-COMMENTS.md`.


The Booktower UI Library uses vanilla JavaScript with custom events for component communication. No framework dependencies.

---

## Rules

**All JavaScript that runs on real pages belongs in a named file in `assets/js/`.** Each file handles one concern. Inline `<script>` blocks are never acceptable in templates or partials.

> **Current state:** ~19 templates still carry inline behavioral `<script>`. Each must be extracted into a named `assets/js/` file and registered below.

In UI kit documentation pages (`foundations/`, `elements/`, `patterns/`), inline scripts are permitted only to demonstrate a JS interaction pattern — never to provide actual working behaviour.

Every file in `assets/js/` must be listed in this document with:
- its purpose
- which templates load it
- which events it listens to
- which events it dispatches
- whether it is prototype-only (to be removed when the real endpoint exists)
- whether it fails the test in "The prototype shows how it would work", and what
  replaces it when someone rewrites it

---

## The prototype shows how it would work

A prototype carries no code it does not need. A reader has to see how something
works, and has to be able to open every variant of it — neither needs the thing
to run, so JavaScript that only produces what a written-out state produces is
code the page pays for and does not use.

**The test:** name the before and the after. If both are states a reader can
open, write two states. JavaScript earns its place where the *transition* is
what the design is asking about — does watching a count change while you type
help, does wrapping a row into a group read as one move. Two states cannot
answer those.

JavaScript also earns its place where the action happens outside the page — the
clipboard, print, a download. No state can show a value landing on someone's
clipboard, and the prototype has to survive a user test where copying is the
task. The visible change stays on the control: a label and an icon swap, never
the data around it.

Behaviour a reader operates is the thing itself, and it stays implemented: the
card/table toggle, keyboard navigation inside the suggest panel, the sidebar
collapse. Each is an interaction someone performs rather than a variant they
open, and the registry below marks them `Prototype-only: no`.

The kit's own chrome sits outside the rule for the same reason. `shell/shell.js`
runs the documentation site itself — the copy button on a code block, the state
switcher, the page navigation. It serves the person reading the docs instead of
prototyping a Biblio interaction, so it implements what it does and keeps
working.

Flag JavaScript that already fails the test; do not delete it on sight. Say in its
entry below what should replace it, and rewrite it when someone is in that file
anyway. A prototype page that still works is worth more than a rule applied the
moment it is written.

- Data-dependent variants are `@state` blocks in one file (`docs/SERVER.md` →
  Template states). A count, a recognition summary, a warning that depends on how
  much someone pasted: each is a state, with its values written by hand.
- New nodes clone a `<template>` in the partial. JavaScript that builds markup as
  strings overwrites the markup the partial documents, so the partial stops being
  reviewable and the kit loses the thing it should be showing.
- Domain vocabulary stays in the catalogs and contracts. Field names, operator
  lists, statuses and labels copied into a JavaScript object drift, and no check
  compares the copy with its source.
- Written-in values say so. A number the prototype invents is a placeholder,
  marked as one, never computed to look real.
- A `-stub.js` file carries the fake responses, so deleting that file is how the
  real endpoint arrives.

| Reach for | Write instead |
|---|---|
| JavaScript that recognises what someone typed and reports on it | a state carrying the summary already written out |
| JavaScript that inserts a warning once a threshold is crossed | a state that shows the warning |
| JavaScript that computes a plausible number | one state per number the design needs to show |
| JavaScript that renders a row from a field name | a `<template>` per row kind, cloned |
| A JavaScript object listing fields, operators or statuses | a data attribute on the element that already names it |

---

## Core principles

- **Progressive enhancement** — all interactions work without JavaScript
- **Event-driven** — components communicate via custom events, not direct coupling
- **Modular** — each script handles one concern
- **Prototype-ready** — stub data allows testing before real APIs exist

---

## Script loading order

Load order matters. Scripts must be declared in this sequence in any template that uses them:

```html
<script src="/assets/js/people-search.js"></script>
<script src="/assets/js/people-search-stub.js"></script>  <!-- prototype only -->
<script src="/assets/js/suggest-panel.js"></script>
<script src="/assets/js/filter-bar.js"></script>
```

Remove the `-stub.js` files when wiring real endpoints.

---

## Files

### `clipboard.js`

**Purpose:** Copy button — copies the `<code>` next to a `[data-clipboard]` button (Biblio ID, persistent link); shows "Copied!" for 2s. Reads the visible `<code>`, so display and copied value can't drift; or copies `data-clipboard-target` (a CSS selector resolved at click time) for dynamic sources like the active citation tab. Handles both labelled buttons (`.btn-text` swaps to "Copied!") and icon-only buttons (temporary `aria-label`, original restored after). Pattern: `patterns/copy-to-clipboard.html`.

**Loaded by:** all pages (global footer script, injected by the dev server).

**Listens for:** click on `[data-clipboard]`

**Dispatches:** nothing

**Prototype-only:** no

---

### `view-toggle.js`

**Purpose:** Card/table results toggle. Shows the `[data-view-panel]` matching the checked `[data-view-toggle]` radio and hides the rest; persists the choice to `localStorage` when a `[data-view-store]` key is present. Markup-driven, so one file serves every results page.

**Loaded by:** `curate.html`, `search-researcher.html`

**Listens for:** `change` on `[data-view-toggle]`

**Dispatches:** nothing

**Prototype-only:** no

---

### `bulk-select.js`

**Purpose:** Row selection + bulk-action bar for backoffice result tables. Shows `[data-bulk-bar]` while any `[data-bulk-row]` checkbox is checked; a `[data-bulk-all]` master checkbox selects/clears all rows and tracks the indeterminate state with a matching `aria-label`.

**Loaded by:** `curate.html`

**Listens for:** `change` on `[data-bulk-row]` and `[data-bulk-all]`

**Dispatches:** nothing

**Prototype-only:** no

**Note:** Dormant for now — the backoffice list page (`curate`) is WIP (backoffice not settled), so the bulk bar isn't in active use yet.

---

### `popovers.js`

**Purpose:** Initialises Bootstrap popovers (`[data-bs-toggle="popover"]`), e.g. the identifier IDs shown on hover over ORCID/UGent icons in author lists. Triggers inside links need `data-bs-container="body"`.

**Loaded by:** all pages (global footer script, injected by the dev server).

**Listens for:** `htmx:afterSwap` on `body` — re-initialises popovers inside swapped fragments.

**Dispatches:** nothing

**Prototype-only:** no

---

### `filter-sheet.js`

**Purpose:** Mobile only — relocates the works filter-bar's picker list, editor, and clear-all button into the `#filters-offcanvas` sheet below `lg`, and back to the toolbar above `lg`, so every filter input lives in one place on a phone. Moving the nodes keeps the single `filter-bar.js` instance and its state (the handlers were attached at init). In the sheet it: turns each record row into a drill-in (label · applied value read from the chips · chevron, replacing filter-bar's floating tick); makes tapping a row swap `#wf-sheet-main` for `#wf-sheet-detail` (the editor + a back button), returning on Apply/back; and strips the editor's `position-absolute`/`top-100`/`bt-panel`/`bt-panel--wide` so it flows inline full-width instead of as a floating panel.

**Loaded by:** `public-works.html` (after `filter-bar.js`).

**Listens for:**
- `matchMedia('(max-width: 991.98px)')` change
- `#wf-filter-editor` `hidden` attribute (drill in on open, return + refresh row values on close)
- click on `#wf-detail-back` (closes the editor) and `#wf-clear-all` (refreshes row values)

**Dispatches:** nothing

**Prototype-only:** yes (rides on `filter-bar.js`'s prototype chips; production would render the sheet vs. toolbar placement server-side).

---

### `suggest-panel.js`

**Purpose:** Controls the autocomplete panel on public search. Shows/hides the panel on input focus and keyup, handles keyboard navigation within the panel, and wires the type-filter tabs over the freshly server-rendered grouped result list. Selecting a type hides the other groups without issuing another request; All restores them. Tab Arrow/Home/End keys change selection with roving focus. Escape closes the panel and restores input focus without reopening it. Suggestion rows navigate via their own `href` ("type decides"); the panel never mutates result-page filter state.

**Loaded by:** `public-works.html`

**Listens for:**
- `focus` and `keyup` on `#q`
- `keydown` for Arrow/Enter/Escape navigation
- click and keyboard events on `[data-suggest-filter]`
- `htmx:afterSwap` on `#suggest-panel` (rebinds swapped navigation and updates panel visibility)

**Dispatches:** nothing

**Prototype-only:** no (panel show/hide and keyboard nav are real behaviour; stub suggestions are server-rendered into the panel)

---

### `directory-search.js`

**Purpose:** Scoped typeahead for a single directory page (Researchers, Organizations). Filters an inline JSON dataset client-side and renders suggestion rows; does not filter the page's result list.

**Loaded by:** `public-researchers.html`, `public-organisations.html`, `public-projects.html`

**Listens for:**
- `input` and `focus` on the directory `input[role="combobox"]`
- `keydown` for Arrow/Enter/Escape navigation (input and panel)
- Click on `document` (outside-click close)
- `submit` on the enclosing form

**Dispatches:** nothing

**Prototype-only:** no (typeahead behaviour is real; the inline JSON dataset is the stub). Replace the inline data + client-side filter with `GET /{directory}/suggest?q=&hellip;` when the endpoint exists.

---

### `filter-bar.js`

**Purpose:** Generic chip + editor filter bar — the filter picker pattern (`patterns/filter-picker.html`). One engine, one config per bar; it self-discovers which bars are on the page by their id prefix and wires each independently. Editor types: checklist (multi-select; a search-within box appears for lists > 8), boolean, year-range, text. A bar may pre-apply filters via a `data-initial-filters` JSON attribute on its chips container, so template states can start with different chips.

**Bars & filter sets:**
- `wf-` — public works (`public-works.html`): Author, Organization, Project, Keywords (searchable checklists), and Identifier (text; any of the work's ids — DOI, ISSN, ISBN, arXiv — a journal via its ISSN). Two chips pre-applied in the results and no-results states.
- `rdir-` — researcher directory (`public-researchers.html`, bar inline): Organization, Current or alumni.
- `pdir-` — project directory (`public-projects.html`, bar inline): Organization, Status, Year (range).

**Loaded by:** `public-works.html`, `public-researchers.html`, `public-projects.html`

**Listens for (per bar, `<prefix>` = `wf-` / `rdir-` / `pdir-`):**
- Click on `[data-filter]` items in `#<prefix>filter-picker-list`
- Click on `[data-filter-id]` chip badges (reopens editor)
- Click on `[data-remove-id]` remove buttons
- Click on `#<prefix>clear-all`
- `keydown` Escape inside the editor; outside-click close

**Dispatches:** nothing

**Prototype-only:** yes (chips are client-side only and do not refilter the list; the Organization tree, author, project, and keyword option lists are stubs, and those facets are backend-dependent). Wire to real query params when the endpoints exist.

---

### `query-builder.js`

**Purpose:** Advanced search, phase 2 — turns a condition row into an "any of these" OR group
(a `<fieldset>`) in place and collapses it back when one alternative is left. The chooser is
cloned from `#qb-chooser` into the slot beside whichever control opened it, re-identified
(`identify()` re-points `label[for]` and `aria-labelledby`), and its search filters the field
choices. A chooser pick clones the row template the choice names and writes the label in.
Rebuilds the `and` / `or` separators after every change, hides a row's ⋯ menu while it sits
inside a group (with remove promoted out, "Add an 'or'" is all it holds), and rewrites the
⋯ and remove buttons' accessible names from the row's current field, operator and value
(`nameRow()`), so the remove control always names the condition it removes. Markup hooks:
`#qb-conditions`, `[data-qb-row]`, `[data-qb-group]`, `[data-qb-alts]`, `[data-qb-sep]`,
`[data-qb-change-field]`, `[data-qb-or]`, `[data-qb-remove]`, `[data-qb-remove-group]`,
`[data-qb-add-alt]`, `[data-qb-clear]`, `[data-qb-token]`, `[data-qb-count]`,
`[data-qb-chooser-slot]`, `[data-qb-choice]` (+ `data-qb-label`/`data-qb-template`),
`[data-qb-choice-search]`, `[data-qb-choice-group]`.

**Loaded by:** `public-works.html`, which renders the builder as a dialog, and
`public-search-advanced.html`, which renders it as a page. Both include the same two
partials, `search-advanced-conditions.html` and `search-advanced-actions.html`; the
conditions partial itself includes `search-field-list.html` twice, so the blank state's
field list and the chooser's cannot drift. It also opens the dialog when the URL carries
`?advanced=1`, standing in for the server-side render.
Pattern page: `patterns/query-builder.html`.

**Listens for:** click / input / change inside `#qb-conditions`, input in
`[data-qb-choice-search]`, and click on `[data-qb-choice]`, `[data-qb-add-condition]`,
`[data-qb-choice-close]`, and `[data-qb-clear]`

**Dispatches:** nothing

**Prototype-only:** yes — it exists so the group interaction can be judged before it is built.
Production renders the condition list server-side. The result count is not simulated: it stays
as rendered while the sentence updates.

---

### `people-search.js`

**Purpose:** People selection widget. Renders a federated search interface and dispatches `people-search:select` when a person is chosen. Used in the deposit flow add-author form. (The works Author filter is a text stub today; production would resolve it through this widget.)

**Loaded by:** deposit flow templates (`deposit-1-0-find.html`, `deposit-1-1-find.html`)

**Listens for:**
- `keyup` on `[data-ps-input]` inputs
- Click / keyboard on `[role="option"]` rows in `[data-ps-results]`

**Dispatches:**
- `people-search:select` — `{ id, name, affiliation }` when a person is chosen

**Prototype-only:** no (widget logic is real; stub data is in `people-search-stub.js`)

---

### `org-tree.js`

**Purpose:** Expand/collapse-all toggle for the public organization tree. Toggles every `.collapse` inside the `[aria-label="Organization tree"]` region via Bootstrap's Collapse API and keeps the button's `aria-expanded` and label text in sync.

**Loaded by:** `templates/biblio-public/public-organisations.html`

**Listens for:** click on `#org-tree-toggle-all`

**Dispatches:** nothing

**Prototype-only:** yes (the tree is stub markup; wire to real org data when available)

---

### `sidebar-toggle.js`

**Purpose:** Handles the backoffice sidebar collapse/expand toggle. Adds or removes `bt-sidebar--slim` on the controlled nav and keeps the toggle button's `aria-expanded` and `aria-label` state in sync. Below `xl`, the main sidebar defaults to slim mode so narrow desktop panes keep the work area primary; crossing the `xl` breakpoint after load syncs the sidebar to the new viewport.

It also owns the sidebar's link tooltips: created on first use, enabled in slim mode and disabled while the sidebar is expanded, where they would only repeat a label the reader already has. The tooltip is never the accessible name — that stays on `.bt-sidebar__label`. Why: `patterns/sidebar.html`, Collapsible — slim mode.

**Loaded by:** backoffice pages via `templates/partials/main-sidebar.html`

**Listens for:**
- Click on `.bt-sidebar__toggle`
- Viewport query changes: `(max-width: 1199.98px)`

**Dispatches:** nothing

**Prototype-only:** no

**Persisting the collapsed state — decided; the prototype stays session-only.** The prototype's toggle resets on every page load. In a server-rendered multi-page app that means the sidebar re-expands on every navigation, which is wrong for the users who prefer it folded. A consuming app persists the choice in a cookie the server reads, so the first paint already carries `bt-sidebar--slim` and there is no expand-then-collapse flash. localStorage cannot carry it: the server never sees it. Raven implements this (issue #197). The prototype stays session-only: it has no server-side state to read a cookie in.

---

### `people-search-stub.js` (prototype only)

**Purpose:** Provides mock person data for `people-search.js` when the real `/people/search` endpoint does not exist.

**Loaded by:** deposit flow templates (`deposit-1-0-find.html`, `deposit-1-1-find.html`) (prototype builds only)

**Remove when:** the real `/people/search` endpoint is wired up.

---

## Custom events

### `biblio:filter-add`

Fired when a filter should be added without opening the editor panel (e.g. selecting a suggestion from the autocomplete panel).

```javascript
document.dispatchEvent(new CustomEvent('biblio:filter-add', {
  detail: {
    filterId: 'affiliation',           // key matching FILTERS in the directory filter engine
    displayValue: 'Faculty of Sciences',
    rawValue: { id: 'fw', name: 'Faculty of Sciences' }
  }
}));
```

Fired by: nothing currently — the public suggest panel navigates instead of dispatching.
Handled by: nothing currently — the directory filter engines manage their own chips directly. Kept as a reserved contract for a future filter builder.

---

### `people-search:select`

Fired when a person row is selected in the people-search widget.

```javascript
document.dispatchEvent(new CustomEvent('people-search:select', {
  detail: { id: 'p-jd2', name: 'Jane Doe', affiliation: 'Faculty of Performing Arts' }
}));
```

Fired by: `people-search.js`
Handled by: the deposit flow author form

---

## HTMX integration

Scripts listen for `htmx:afterSwap` to update UI state after content changes. Key targets:

| Target | Listener | Action |
|--------|----------|--------|
| `#suggest-panel` | `suggest-panel.js` | Show panel if content is non-empty |
| `#file-list` | — | No JS needed; HTMX swap is sufficient |
| `#author-list` | — | No JS needed; HTMX swap is sufficient |

---

## View toggle and bulk actions

The view toggle (card/table) and bulk select/checkbox logic in `curate.html` and `search-researcher.html` currently live as inline `<script>` blocks in those templates. These should be extracted to `assets/js/search.js` when the backoffice search is implemented in Go templ.

Until then: do not copy or duplicate the inline script. The template is the single source.
