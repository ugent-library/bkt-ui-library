# PARTIALS.md
# Partial architecture for search, filters, and autocomplete

This document specifies how the filter sidebar, filter chips, and autocomplete
panel are structured as reusable partials, and how they connect to each other.

For entity vocabulary see `DOMAIN.md`. For surface system see `UI-LAYER.md`.

---

## The three components

### 1. Filter sidebar (`backoffice-facet-sidebar.html`)
The left-side `<aside>` on backoffice search pages. Contains:
- Scope indicator (read from user settings, links to Settings > Work scope)
- Saved views nav (curator/proxy only)
- Facet groups (Status, Type, Year, Access, + More filters dropdown)

**Surface:** backoffice only. The public search sidebar is structurally simpler
(no scope, no saved views) and lives inline in `public-search.html` for now.

**Parameters the Go templ component needs:**
```
scope_orgs     []Org     — user's active scope organisations (empty = no scope)
scope_types    []string  — user's active scope types (empty = all types)
saved_views    []View    — user's saved views including system defaults
active_view_id string    — ID of the currently active view (for aria-current)
facets         Facets    — facet counts from OpenSearch (Type, Status, Year, Access)
active_filters []Filter  — currently applied filters (to pre-check facet checkboxes)
```

**Partial path:** `templates/partials/backoffice-facet-sidebar.html`
**Include directive:** `<!-- @include: templates/partials/backoffice-facet-sidebar.html -->`

---

### 2. Filter bar (`search-filter-bar.html`)
The chips + Add filter + filter editor row. Used on:
- Backoffice search (above results column)
- Public search (below search input)
- Entity result pages (researcher, organisation, project — via `result-filter-bar.html`)

The existing `result-filter-bar.html` partial covers entity pages and is working.
The backoffice and public variants are currently inline. They should be extracted
as a single configurable partial, or two surface-specific variants. Recommendation:
**one partial, surface-aware via a parameter**, because the filter list differs
(backoffice has Status, Workflow filters; public does not).

**Parameters:**
```
surface        string    — "public" | "backoffice"
active_filters []Filter  — currently active filters (rendered as chips on load)
search_target  string    — HTMX target selector for result updates (e.g. "#results-body")
indicator_id   string    — HTMX indicator element ID
filter_defs    []FilterDef — which filters are available in the Add filter picker
                             (surface-specific, provided by server)
```

**Partial path:** `templates/partials/search-filter-bar.html`

---

### 3. Autocomplete panel (`search-suggest-panel.html`)
The dropdown that appears below the search input on keyup. Currently inline in
`public-search-suggest.html`. Should be extracted as an HTMX server-rendered
partial — the panel content is always a server response, never static HTML.

**How it works:**
```
GET /search/suggest?q={query}&surface={public|backoffice}&types={scoped_types}
→ returns HTML partial: suggest-panel contents only (tab bar + result rows + footer)
```

The outer panel shell (`<div id="suggest-panel">`) stays in the page DOM at all
times (required for HTMX targeting and `aria-live`). The server partial fills the
inner content. The tab bar is part of the server response — counts come from the
index, not the client.

**Suggestion routing by entity type:**

| Entity type | Action on select | URL pattern |
|-------------|-----------------|-------------|
| Person | Navigate to profile page | `/researchers/{id}` |
| Work | Navigate to detail page | `/works/{id}` |
| Organisation | Run filtered search | `/search?org={id}` |
| Project | Run filtered search | `/search?project={id}` |
| Keyword | Run filtered search | `/search?keyword={value}` |
| Librarian tag | Run filtered search | `/search?tag={value}` (backoffice only) |

**Partial path:** `templates/partials/search-suggest-panel.html`
This partial is the server's rendered response only — not the outer panel wrapper.

---

## How the three components connect

```
Search input (#q)
  │
  ├─ keyup (delay 200ms) ──► GET /search/suggest
  │                              └─► server renders suggest-panel partial
  │                                  HTMX swaps into #suggest-panel
  │
  ├─ form submit / Enter ──► GET /search?q={q}&{active_filter_params}
  │                              └─► server renders results partial
  │                                  HTMX swaps into #results-body (or #search-results)
  │
  └─ selecting a suggestion
       ├─ Person/Work → navigate (full page load)
       └─ Org/Project/Keyword → sets filter chip + closes panel + fires result update


Filter sidebar (facets)
  │
  └─ checkbox change ──► GET /search?{all_current_params}&{changed_facet}
                             └─► HTMX swaps #results-body
                             └─► filter chip added via filter-editor.js


Add filter picker
  │
  └─ filter selected ──► filter editor panel opens (JS, no server round-trip)
       │
       └─ Apply ──► chip added to #active-chips
                    GET /search?{all_current_params}&{new_filter}
                    HTMX swaps #results-body


Filter chips
  │
  ├─ click chip ──► filter editor re-opens with existing value (edit mode)
  └─ × on chip ──► filter removed, GET /search fires, results update
```

### The shared query state

All three components read from and write to the same query parameter set.
There is no separate client-side filter state — the URL is the state.

`filter-editor.js` builds the query string from `activeFilters` and fires an
HTMX GET. The server always has the full picture. On page load, any
`?q=...&type=...&status=...` params in the URL pre-populate the chips and
pre-check the facet sidebar checkboxes. This is how bookmarkable URLs and saved
views both work.

---

## Implementation sequence

Do these in order — each step unblocks the next.

1. **Extract `search-filter-bar.html` partial** from `backoffice-search.html`
   and `public-search.html`. These are currently near-identical inline blocks.
   Parameterise by surface for the filter list.

2. **Extract `backoffice-facet-sidebar.html`** from `backoffice-search-filter-first.html`.
   Wire scope indicator to read from user settings (requires backend `user_settings`).

3. **Extract `search-suggest-panel.html`** — create the server endpoint
   `GET /search/suggest` that renders the partial. The outer panel shell in the
   page template is already in place (`public-search-suggest.html`).

4. **Connect autocomplete selection to filter chips.** When a user selects an
   Org or Project suggestion, `filter-editor.js` should receive the signal and
   add the appropriate chip. This requires a small JS hook — the suggest panel
   rows emit a `biblio:filter-add` custom event; `filter-editor.js` listens for it.

5. **Pre-populate chips and facets from URL params on page load.** Currently chips
   are empty on load even if the URL has params. `filter-editor.js` should read
   `window.location.search` on `DOMContentLoaded` and render chips for any known
   filter params present.

---

## Custom event: `biblio:filter-add`

Used to bridge the autocomplete panel and the filter editor without coupling them.

```javascript
// Fired by: suggest panel row click (Org, Project, Keyword, Tag)
// Listened to by: filter-editor.js

document.dispatchEvent(new CustomEvent('biblio:filter-add', {
  detail: {
    filterId: 'affiliation',          // matches a key in FILTERS in filter-editor.js
    displayValue: 'Faculty of Sciences',
    rawValue: { id: 'fw', name: 'Faculty of Sciences' }
  }
}));
```

`filter-editor.js` handles `biblio:filter-add` by calling `applyFilter(detail)`
directly, bypassing the editor panel (no user confirmation needed for suggestion
selections — they already made the choice by clicking the row).

---

## What stays inline (not extracted)

- The outer `#suggest-panel` wrapper — must be in DOM at page load for HTMX
  targeting and `aria-live`. It is not a partial.
- The `#filter-editor` panel wrapper — same reason.
- The `#active-chips` container — same reason.
- Pagination — page-specific, not reused.
