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
<script src="/assets/js/search-clear.js"></script>
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

**Purpose:** Card/table results toggle. Shows the `[data-view-panel]` matching the checked `[data-view-toggle]` radio and hides the rest. Markup-driven, so one file serves every results page.

**Loaded by:** `curate.html`, `search-researcher.html`

**Listens for:** `change` on `[data-view-toggle]`

**Dispatches:** nothing

**Prototype-only:** no

**Persisting the chosen view — decided; the prototype stays session-only.** `curate.html` used
to carry a `data-view-store` key and the toggle wrote the choice to `localStorage`, which meant a
reader could open the template and meet a rendering the file does not show. Same problem, same
answer as the sidebar (see `sidebar-toggle.js` below): the server never sees `localStorage`, so it
cannot carry a view choice into the first paint, and a consuming app persists it in a cookie the
server reads. The prototype has no server-side state to read a cookie in, so it resets per load
and every template renders what it says it renders.

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
- `#wf-filter-editor` `hidden` attribute (drill in on open, opening the sheet when the editor opens from outside it; return + refresh row values on close)
- click on `#wf-head-back` and `#wf-foot-apply` / `#wf-foot-remove`, which forward to the editor's own `[data-editor-cancel]` / `[data-editor-apply]` / `[data-editor-remove]` buttons, and `#wf-clear-all` (refreshes row values)

**Dispatches:** nothing

**Prototype-only:** yes (rides on `filter-bar.js`'s prototype chips; production would render the sheet vs. toolbar placement server-side).

**Fails the template test:** partly. `decorateRows()` builds the drill-in row's value + chevron with `innerHTML` — two elements, decorating a row that already exists rather than creating the thing under review. Left as is; if it grows past those two nodes, move it to a `<template>` alongside the filter editor's.

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

### `search-clear.js`

**Purpose:** Keeps the inline × in step with its box: it shows while the field holds text, and a
button-shaped clear empties the field when clicked. Binds structurally, so one file serves every
search box and the `hidden` attribute in the markup stays the no-JS state.

**Loaded by:** `public-index.html`, `public-works.html`, `public-researchers.html`,
`public-organisations.html`, `public-projects.html`

**Listens for:** `input` on the field in front of each `.bt-search-clear`, and `click` on a clear
that is a `<button>`

**Dispatches:** nothing

**Prototype-only:** no (typing is the trigger and the clearing is real; a link-shaped clear needs
no script)

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

**Fails the template test:** yes. `update()` builds the suggestion row and the no-matches line as strings, so the row a reader is asked to judge is not in any partial. Replaced by a `<template>` per row kind in the directory-search partial, cloned and filled with `textContent` — the shape `filter-bar.js` now uses — with `<mark>` on the matched span the one node still built by hand. Rewrite it when someone is in the file; the escaping helpers (`esc`, `highlight`) go away with the strings.

---

### `filter-bar.js`

**Purpose:** Generic chip + editor filter bar — the filter picker pattern (`patterns/filter-picker.html`). One engine, no config of its own. Editor types: checklist (multi-select; a search-within box appears for lists > 8), picker, boolean, year-range, text. A bar may pre-apply filters via a `data-initial-filters` JSON attribute on its chips container, so template states can start with different chips.

**Nothing it renders and nothing it offers lives in the file:**

- **A bar announces itself** with `data-filter-bar="<prefix>"` on its `position-relative` wrapper. The engine wires one instance per marked bar; adding a fourth needs no edit here. Ids stay the handle after that, because `filter-sheet.js` moves the picker, the editor and clear-all out of the bar and into the mobile offcanvas.
- **A picker button carries its own definition** — `data-filter-label`, `data-filter-type`, and then `data-filter-options` (checklist), `data-filter-panel` (picker), `data-filter-placeholder` (text) or `data-filter-yes`/`data-filter-no` (boolean). A `picker` filter needs no list: its button names the panel whose rows it offers. The picker list is therefore the whole filter set: a filter the markup does not offer cannot be opened.
- **The option lists** are `templates/partials/filter-option-lists.html`, one JSON block keyed by the name a picker button gives in `data-filter-options`. Stub vocabularies; real values come from raven.
- **Every node** is cloned from a partial. `templates/partials/filter-editor-templates.html` holds the shell, the editor bodies, a checklist row, the chip and the picker tick; a `picker` editor clones the panel its button names — `people-picker-panel.html`, `organization-picker-panel.html` or `project-picker-panel.html` — and drops its title and footer, because the shell supplies both. A picked row is kept as `{id, label}` and matched by id, so two rows of one label stay apart; the label is display only. Values are written with `textContent`, so a typed filter value cannot become markup. The shell's three actions are fixed: Apply, Cancel, Remove filter. Remove is drawn whether or not the filter is applied, so the footer keeps one shape; removing an unapplied filter is a no-op that closes the panel.

Those partials are included once per page carrying a bar, before the `filter-bar.js` script tag.

**Search-within matches the whole row**, not just its label, so a people editor finds an ORCID or a department code. For a plain checklist the row is its label, so nothing changes there. Why that is wanted: `patterns/filter-picker.html` → Editor — people.

**Bars & filter sets:**
- `wf-` — public works (`public-works.html`): Person, Organization, Project (pickers), Keywords (searchable checklist), and Identifier (text; any of the work's ids — DOI, ISSN, ISBN, arXiv — a journal via its ISSN). Two chips pre-applied in the results and no-results states.
- `rdir-` — researcher directory (`public-researchers.html`, bar inline): Organization (picker).
- `pdir-` — project directory (`public-projects.html`, bar inline): Status, Year (range). No Organization: project participation is deferred in raven's data contract, so the control would be inert.

**Loaded by:** `public-works.html`, `public-researchers.html`, `public-projects.html`

**Listens for (per bar, `<prefix>` = `wf-` / `rdir-` / `pdir-`):**
- Click on `[data-filter]` items in `#<prefix>filter-picker-list`
- Click on `[data-filter-id]` chip badges (reopens editor)
- Click on `[data-remove-id]` remove buttons
- Click on `#<prefix>clear-all`
- `keydown` Escape inside the editor; outside-click close

**Dispatches:** nothing

**Prototype-only:** yes (chips are client-side only and do not refilter the list; the panels' rows and the keyword option list are stubs, and those facets are backend-dependent). Wire to real query params when the endpoints exist.

**Fails the template test:** no (since v2.25). It built its markup as strings and carried its own filter and option vocabulary in a `CONFIGS` object; both now live in the markup, per the two partials above.

---

### `query-builder.js`

**Purpose:** Advanced search — the condition rows, the field chooser, the picker panels and the
OR groups.

- **The chooser** is cloned from `#qb-chooser` into the slot beside whichever control opened it
  and re-identified (`identify()` re-points `label[for]` and `aria-labelledby`); its search
  filters the field choices. A pick clones the row template the choice names and writes the
  field label into it.
- **The picker panels** ride on the same slot mechanism. A slot names its panel template in
  `data-qb-picker-slot` — the same panels the works filter bar clones, so each is defined once
  and neither engine owns it. Add
  clones a token per ticked row the condition does not already carry, matched on `data-id` so
  two rows of one label both land, and clears the boxes; a token's × removes it. `#qb-token` is
  the token, crestless; the crest is the exception — `#qb-person-token` is cloned for rows
  marked `data-person-ugent`, a person with a UGent person record. The panel opens on its search
  box and hands focus back to the control that opened it (`docs/ACCESSIBILITY.md` E4).
- **OR groups (phase 2)** turn a condition row into an "any of these" `<fieldset>` in place and
  collapse it back to a plain row when one alternative is left. The `or` separators inside a
  group are rebuilt after every change; the top level is AND-joined, which the heading states,
  so it carries none. A row sitting inside a group hides its ⋯ menu — with remove promoted out,
  "Add an 'or'" is all it holds.
- **The accessible names** of the ⋯ and remove buttons are rewritten from the row's current
  field, operator and value (`nameRow()`), so the remove control always names the condition it
  removes.
- **The blank state** returns when the list empties, by Clear all or by removing the last
  condition: whatever `#qb-blank` holds is restored and re-identified. That template may hold
  nothing, in which case Add a condition is the blank state.
- **Markup hooks:** `#qb-conditions`, `[data-qb-row]`, `[data-qb-group]`, `[data-qb-alts]`,
  `[data-qb-sep]`, `[data-qb-change-field]`, `[data-qb-or]`, `[data-qb-remove]`,
  `[data-qb-remove-group]`, `[data-qb-add-alt]`, `[data-qb-clear]`, `[data-qb-token]`,
  `[data-qb-count]`, `[data-qb-chooser-slot]`, `[data-qb-choice]` (+
  `data-qb-label`/`data-qb-template`, `data-qb-ops` where a field keeps a subset of its
  template's operators, `data-qb-values` where the contract fixes a select's values, and
  `data-qb-panel`/`data-qb-add` on an entity choice),
  `[data-qb-choice-search]`, `[data-qb-choice-group]`, `[data-qb-picker-slot]` (naming the panel
  template it clones), `[data-qb-add-label]`, `[data-qb-token-name]` (+ `data-id` on the token),
  `[data-qb-value]`, `[data-qb-op]`,
  `[data-qb-actions]`, `[data-qb-blank]`, `[data-qb-open]`. The panels' own hooks carry no
  `qb-` prefix, because neither engine owns them: `[data-picker-search]`,
  `[data-picker-name]`, `[data-picker-add]`, `[data-picker-cancel]`, and `data-id` on each row's
  checkbox. A person row carries `data-person-ugent` where a UGent person record stands behind
  the person, and its token carries the crest.
- **The row is read through its data attributes, never its classes.** `[data-qb-value]`,
  `[data-qb-op]`, `[data-qb-actions]` and `[data-qb-blank]` are the value cell, the operator
  select, the actions cell and the blank state's root, so a layout change can rename or drop a
  cell class without costing the row its accessible name. The file writes two classes —
  `bt-query-builder__row--alt`, and `visually-hidden` on the separators it builds — because
  those are styling, which is the one direction that belongs in `classList`.

**Loaded by:** `public-works.html`, which renders the builder as a dialog over the result list. It
includes `search-advanced-conditions.html` and `search-advanced-actions.html`, and
supplies the heading, the box and the bar surface around them. The conditions partial holds the row templates, the chooser
(which includes `search-field-list.html`) and `#qb-blank`; the person picker is not in it —
`people-picker-panel.html` is included separately, because the filter bar clones it too. It also opens the dialog when the URL
carries `?advanced=1` or the page renders a `[data-qb-open]` marker, standing in for the
server-side render. The works page renders one dialog, shut; its five `builder-*` states carry the
marker (`docs/SERVER.md` → Template states), and the Advanced search link's href is the address.
Pushing that address on open and close is production's job, not the prototype's.
Pattern page: `patterns/query-builder.html`.

**Listens for:** click / input / change inside `#qb-conditions`, input in
`[data-qb-choice-search]`, and click on `[data-qb-choice]`, `[data-qb-add-condition]`,
`[data-qb-choice-close]`, and `[data-qb-clear]`

**Dispatches:** nothing

**Prototype-only:** yes — it exists so the group interaction can be judged before it is built.
Production renders the condition list server-side and computes the count
(`docs/wip/QUERY-BUILDER-ISSUE-04-count.md`), writing it into the submit's `[data-qb-count]`
span — the builder's one `aria-live` region. Each state carries its own count, written by hand; nothing here derives one.

---

### `people-search.js`

**Purpose:** People selection widget. Renders a federated search interface and dispatches `people-search:select` when a person is chosen. Used in the deposit flow add-author form. The `[data-ps-hint]` element is the widget's live region: it announces the result count and the no-results message — nothing but `bt-result` rows goes inside the `[data-ps-results]` listbox. Each row carries `data-ps-row`, which is what the script selects on, so the row's classes stay presentational. Pattern page: `patterns/people-search.html`. (The works Person filter clones the shared people picker instead; in production both draw their rows from `/people/search`.)

**Loaded by:** deposit flow templates (`deposit-1-0-find.html`, `deposit-1-1-find.html`)

**Listens for:**
- `keyup` on `[data-ps-input]` inputs
- Click / keyboard on `[data-ps-row]` rows in `[data-ps-results]`

**Dispatches:**
- `people-search:select` — `{ id, name, affiliation }` when a person is chosen

**Prototype-only:** no (widget logic is real; stub data is in `people-search-stub.js`)

**Fails the template test:** yes, in one function. `renderSelected()` builds the collapsed selected-person row as a string. It is reachable — it is the branch for a host with no `[data-ps-selected]` slot, which is every instance on `patterns/people-search.html` and the query builder's person field — so it is not dead code to delete. The same row is hand-written a third time at `patterns/people-search.html` §Selected. Replaced by one `<template>` holding that row, cloned by the widget and shown statically by the pattern page. `people-search-stub.js`'s `renderRow()` is not in scope: it stands in for the `[data-ps-row]` rows the server will return, which is what a `-stub.js` file is for.

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
