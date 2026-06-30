# JavaScript architecture

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
<script src="/assets/js/filter-editor.js"></script>
<script src="/assets/js/filter-stubs.js"></script>        <!-- prototype only -->
<script src="/assets/js/suggest-panel.js"></script>
<script src="/assets/js/deposit.js"></script>             <!-- deposit flow only -->
```

Remove the `-stub.js` files when wiring real endpoints.

---

## Files

### `clipboard.js`

**Purpose:** Copies the Biblio ID (the `<code>` next to a `[data-clipboard]` button) to the clipboard; shows "Copied!" for 2s.

**Loaded by:** all pages (global footer script, injected by the dev server).

**Listens for:** click on `[data-clipboard]`

**Dispatches:** nothing

**Prototype-only:** no

---

### `filter-editor.js`

**Purpose:** Manages the filter picker, editor panel, and active filter chips. Owns the filter state and fires search requests when a filter changes.

**Loaded by:** none currently — removed from `public-works.html`. Retained for the Advanced search / backoffice filter builder (not yet on a live page); documented in the `patterns/filter-picker.html` UI-kit page.

**Listens for:**
- `biblio:filter-add` — adds a chip without opening the editor (used by autocomplete selections)
- Click on `[data-filter]` items in the picker dropdown
- Click on `.filter-tag--editable` chips (reopens editor in edit mode)
- Click on `.filter-tag__remove` buttons
- Click on `#clear-all-btn`

**Dispatches:** nothing (fires HTMX GET directly via `htmx.ajax`)

**Prototype-only:** no

---

### `suggest-panel.js`

**Purpose:** Controls the autocomplete panel on public search. Shows/hides the panel on input focus and keyup and handles keyboard navigation within the panel. Suggestion rows navigate via their own `href` ("type decides"); the panel no longer mutates filter state.

**Loaded by:** `public-works.html`

**Listens for:**
- `focus` and `keyup` on `#q`
- `keydown` for Arrow/Enter/Escape navigation
- `htmx:afterSwap` on `#suggest-panel` (updates panel visibility after content loads)

**Dispatches:** nothing

**Prototype-only:** no (panel show/hide and keyboard nav are real behaviour; stub data is in `filter-stubs.js`)

---

### `directory-search.js`

**Purpose:** Scoped typeahead for a single directory page (Researchers, Organisations). Filters an inline JSON dataset client-side and renders suggestion rows; does not filter the page's result list.

**Loaded by:** `public-researchers.html`, `public-organisations.html`, `public-projects.html`

**Listens for:**
- `input` and `focus` on the directory `input[type="search"]`
- `keydown` for Arrow/Enter/Escape navigation (input and panel)
- Click on `document` (outside-click close)
- `submit` on the enclosing form

**Dispatches:** nothing

**Prototype-only:** no (typeahead behaviour is real; the inline JSON dataset is the stub). Replace the inline data + client-side filter with `GET /{directory}/suggest?q=&hellip;` when the endpoint exists.

---

### `directory-filters.js`

**Purpose:** People-scoped chip + editor filter bar for the researcher directory. Same interaction as `filter-editor.js`, but the filter set is Faculty/department, Membership (current / alumni), and Public research output — not works. Owns its own filter state and chips.

**Loaded by:** `public-researchers.html` (via `templates/partials/result-filter-bar-researchers.html`)

**Listens for:**
- `input` on `#rdir-filter-search` (picker search)
- Click on `[data-filter]` items in the `#rdir-filter-picker-list` dropdown
- Click on `.filter-tag--editable` chips (reopens editor)
- Click on `.filter-tag__remove` buttons
- Click on `#rdir-clear-all`
- `keydown` Escape inside the editor; outside-click close

**Dispatches:** nothing

**Prototype-only:** yes (chips are client-side only and do not refilter the list; faculty values and the public-output rollup are stubs). Wire to real query params when the directory endpoint exists.

---

### `directory-filters-projects.js`

**Purpose:** Project-scoped chip + editor filter bar for the project directory. Same interaction as `directory-filters.js`, plus a year-range editor. Filter set is Host faculty, Status (active / completed), and Period. Owns its own filter state and chips.

**Loaded by:** `public-projects.html` (via `templates/partials/result-filter-bar-projects.html`)

**Listens for:**
- `input` on `#pdir-filter-search` (picker search)
- Click on `[data-filter]` items in the `#pdir-filter-picker-list` dropdown
- Click on `.filter-tag--editable` chips (reopens editor)
- Click on `.filter-tag__remove` buttons
- Click on `#pdir-clear-all`
- `keydown` Escape inside the editor; outside-click close

**Dispatches:** nothing

**Prototype-only:** yes (chips are client-side only and do not refilter the list; faculty values, status and period are stubs). Wire to real query params when the directory endpoint exists.

**Note:** Near-duplicate of `directory-filters.js` (filter set, the `pdir-` id prefix, and the added year-range editor differ). When a real endpoint lands, consider consolidating the directory filter engines into one config-driven module.

---

### `people-search.js`

**Purpose:** People selection widget. Renders a federated search interface and dispatches `people-search:select` when a person is chosen. Used inside the filter editor (Author filter) and the deposit flow add-author form.

**Loaded by:** deposit flow templates (`deposit-1-0-find.html`, `deposit-1-1-find.html`); also embedded in the `patterns/filter-picker.html` UI-kit demo. (Removed from `public-works.html` with the filter builder.)

**Listens for:**
- `keyup` on `[data-ps-input]` inputs
- Click / keyboard on `[role="option"]` rows in `[data-ps-results]`

**Dispatches:**
- `people-search:select` — `{ id, name, affiliation }` when a person is chosen

**Prototype-only:** no (widget logic is real; stub data is in `people-search-stub.js`)

---

### `deposit.js`

**Purpose:** Deposit flow behaviour. Currently contains the embargo date field show/hide on Step 3 (Access & Rights). Additional deposit flow interactions should be added here as the flow is implemented.

**Loaded by:** deposit flow templates (`deposit-3-access-rights.html` at minimum; load on all deposit steps for consistency)

**Listens for:**
- `change` on `input[name="oa"]` radio group (Step 3) — shows/hides `#embargo-date-field`, moves focus to date input when shown

**Dispatches:** nothing

**Prototype-only:** no

**Note:** The Step 3 embargo toggle now lives here and uses the `hidden` attribute on `#embargo-date-field`, not `d-none`.

---

### `sidebar-toggle.js`

**Purpose:** Handles the backoffice sidebar collapse/expand toggle. Adds or removes `bt-sidebar--slim` on the controlled nav and keeps the toggle button's `aria-expanded` and `aria-label` state in sync.

**Loaded by:** backoffice pages via `templates/partials/main-sidebar.html`

**Listens for:**
- Click on `.bt-sidebar__toggle`

**Dispatches:** nothing

**Prototype-only:** no

**TBD — persist collapsed state.** The toggle currently resets on every page load. In a server-rendered multi-page app that means the sidebar re-expands on every navigation, which is wrong for the users who prefer it folded in most of the time. The collapsed state must be remembered across page loads — and ideally read server-side (e.g. a cookie) so the first paint already renders collapsed, with no expand-then-collapse flash. Decide the mechanism (localStorage vs server-read cookie) before wiring this into a real deployment. Not yet implemented.

---

### `people-search-stub.js` (prototype only)

**Purpose:** Provides mock person data for `people-search.js` when the real `/people/search` endpoint does not exist.

**Loaded by:** deposit flow templates (`deposit-1-0-find.html`, `deposit-1-1-find.html`) (prototype builds only)

**Remove when:** the real `/people/search` endpoint is wired up.

---

### `filter-stubs.js` (prototype only)

**Purpose:** Provides mock autocomplete suggestions for text filter fields (used by `suggest-panel.js` and `filter-editor.js` in prototypes).

**Loaded by:** none currently — was `public-works.html`; unused since the suggest panel renders rows server-side (prototype builds only)

**Remove when:** real server endpoints for autocomplete exist.

---

## Custom events

### `biblio:filter-add`

Fired when a filter should be added without opening the editor panel (e.g. selecting a suggestion from the autocomplete panel).

```javascript
document.dispatchEvent(new CustomEvent('biblio:filter-add', {
  detail: {
    filterId: 'affiliation',           // key matching FILTERS in filter-editor.js
    displayValue: 'Faculty of Sciences',
    rawValue: { id: 'fw', name: 'Faculty of Sciences' }
  }
}));
```

Fired by: nothing currently — the public suggest panel now navigates instead of dispatching. Retained for the filter builder (`filter-editor.js`) on the Advanced search / backoffice surfaces.
Handled by: `filter-editor.js`

---

### `people-search:select`

Fired when a person row is selected in the people-search widget.

```javascript
document.dispatchEvent(new CustomEvent('people-search:select', {
  detail: { id: 'p-jd2', name: 'Jane Doe', affiliation: 'Faculty of Performing Arts' }
}));
```

Fired by: `people-search.js`
Handled by: `filter-editor.js` (Author filter) and deposit flow author form

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

The view toggle (card/table) and bulk select/checkbox logic in `search-filter-first.html` currently live as an inline `<script>` in that template. These should be extracted to `assets/js/search.js` when the backoffice search is implemented in Go templ.

Until then: do not copy or duplicate the inline script. The template is the single source.
