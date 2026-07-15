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
<script src="/assets/js/suggest-panel.js"></script>
<script src="/assets/js/filter-bar.js"></script>
<script src="/assets/js/deposit.js"></script>             <!-- deposit flow only -->
```

Remove the `-stub.js` files when wiring real endpoints.

---

## Files

### `clipboard.js`

**Purpose:** Copy button — copies the `<code>` next to a `[data-clipboard]` button (Biblio ID, persistent link); shows "Copied!" for 2s. Reads the visible `<code>`, so display and copied value can't drift. Handles both labelled buttons (`.btn-text` swaps to "Copied!") and icon-only buttons (temporary `aria-label`, original restored after). Pattern: `patterns/copy-to-clipboard.html`.

**Loaded by:** all pages (global footer script, injected by the dev server).

**Listens for:** click on `[data-clipboard]`

**Dispatches:** nothing

**Prototype-only:** no

---

### `popovers.js`

**Purpose:** Initialises Bootstrap popovers (`[data-bs-toggle="popover"]`), e.g. the identifier IDs shown on hover over ORCID/UGent icons in author lists. Triggers inside links need `data-bs-container="body"`.

**Loaded by:** all pages (global footer script, injected by the dev server).

**Listens for:** `htmx:afterSwap` on `body` — re-initialises popovers inside swapped fragments.

**Dispatches:** nothing

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

**Prototype-only:** no (panel show/hide and keyboard nav are real behaviour; stub suggestions are server-rendered into the panel)

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

### `filter-bar.js`

**Purpose:** Generic chip + editor filter bar — the filter picker pattern (`patterns/filter-picker.html`). One engine, one config per bar; it self-discovers which bars are on the page by their id prefix and wires each independently. Editor types: checklist, boolean, year-range, text. A bar may pre-apply filters (`INITIAL`) so it starts populated.

**Bars & filter sets:**
- `wf-` — public works (`public-works.html`): Author, Organisation/affiliation, Journal/venue, Project, Keywords/subject, Identifier. Two chips pre-applied.
- `rdir-` — researcher directory (`public-researchers.html` via `result-filter-bar-researchers.html`): Faculty/department, Current or alumni, Has public research output.
- `pdir-` — project directory (`public-projects.html` via `result-filter-bar-projects.html`): Host faculty, Status, Period (year range).

**Loaded by:** `public-works.html`, `public-researchers.html`, `public-projects.html`

**Listens for (per bar, `<prefix>` = `wf-` / `rdir-` / `pdir-`):**
- Click on `[data-filter]` items in `#<prefix>filter-picker-list`
- Click on `[data-filter-id]` chip badges (reopens editor)
- Click on `[data-remove-id]` remove buttons
- Click on `#<prefix>clear-all`
- `keydown` Escape inside the editor; outside-click close

**Dispatches:** nothing

**Prototype-only:** yes (chips are client-side only and do not refilter the list; faculty/venue/project/keyword values are stubs, and organisation/venue/project/keyword facets are backend-dependent). Wire to real query params when the endpoints exist.

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

The view toggle (card/table) and bulk select/checkbox logic in `search-filter-first.html` currently live as an inline `<script>` in that template. These should be extracted to `assets/js/search.js` when the backoffice search is implemented in Go templ.

Until then: do not copy or duplicate the inline script. The template is the single source.
