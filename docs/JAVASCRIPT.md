# JavaScript architecture

The Booktower UI Library uses vanilla JavaScript with custom events for component communication. No framework dependencies.

---

## Rules

**All JavaScript that runs on real pages belongs in a named file in `assets/js/`.** Each file handles one concern. Inline `<script>` blocks are never acceptable in templates or partials.

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

### `filter-editor.js`

**Purpose:** Manages the filter picker, editor panel, and active filter chips. Owns the filter state and fires search requests when a filter changes.

**Loaded by:** `public-search.html`, `search-filter-first.html`

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

**Purpose:** Controls the autocomplete panel on public search. Shows/hides the panel on input focus and keyup, handles keyboard navigation within the panel, and dispatches `biblio:filter-add` when the user selects an Org, Project, Keyword, or Tag suggestion.

**Loaded by:** `public-search.html`

**Listens for:**
- `focus` and `keyup` on `#q`
- `keydown` for Arrow/Enter/Escape navigation
- `htmx:afterSwap` on `#suggest-panel` (updates panel visibility after content loads)
- Click on suggestion rows

**Dispatches:**
- `biblio:filter-add` — when a non-navigating suggestion (Org, Project, Keyword, Tag) is selected

**Prototype-only:** no (panel show/hide and keyboard nav are real behaviour; stub data is in `filter-stubs.js`)

---

### `people-search.js`

**Purpose:** People selection widget. Renders a federated search interface and dispatches `people-search:select` when a person is chosen. Used inside the filter editor (Author filter) and the deposit flow add-author form.

**Loaded by:** `public-search.html`, `search-filter-first.html`, deposit flow templates (when add-author form is active)

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

**Note:** The embargo date logic currently lives as an inline `<script>` in `deposit-3-access-rights.html`. It must be moved here before Go templ implementation.

---

### `people-search-stub.js` (prototype only)

**Purpose:** Provides mock person data for `people-search.js` when the real `/people/search` endpoint does not exist.

**Loaded by:** `public-search.html`, `search-filter-first.html` (prototype builds only)

**Remove when:** the real `/people/search` endpoint is wired up.

---

### `filter-stubs.js` (prototype only)

**Purpose:** Provides mock autocomplete suggestions for text filter fields (used by `suggest-panel.js` and `filter-editor.js` in prototypes).

**Loaded by:** `public-search.html`, `search-filter-first.html` (prototype builds only)

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

Fired by: `suggest-panel.js`
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
