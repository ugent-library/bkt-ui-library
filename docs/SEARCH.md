# Search System

The Booktower UI Library implements two distinct search patterns optimized for different user contexts.

## Search-First (Public)

Used on public-facing search pages where users may not know what they're looking for.

### Components
- **Autocomplete Panel**: Multi-entity suggestions (People, Works, Organizations, Projects, Keywords)
- **Filter Chips**: Active filters shown as removable chips below search bar
- **Facet Sidebar**: Optional refinement filters (same as backoffice but collapsed by default)

### Files
- `templates/partials/search-suggest-panel.html` — Inner content of autocomplete panel
- `assets/js/suggest-panel.js` — Panel show/hide, keyboard navigation, filter chip dispatch
- `assets/js/filter-stubs.js` — Prototype autocomplete data (remove when real endpoints exist)

### Behavior
- Search input shows suggestions on focus + keyup
- Arrow keys navigate, Enter selects, Escape closes
- Person/Work selections navigate directly to detail pages
- Org/Project/Keyword selections add filter chips via `biblio:filter-add` event

## Filter-First (Backoffice)

Used in backoffice where curators need to narrow large datasets systematically.

### Components
- **Facet Sidebar**: Primary filtering interface with scope indicators and saved views
- **Filter Bar**: Chips + "Add filter" dropdown for additional dimensions
- **Results Toolbar**: Sort, view toggle, bulk actions

### Files
- `templates/partials/backoffice-facet-sidebar.html` — Complete filter sidebar with scope/views/facets
- `templates/partials/search-filter-bar.html` — Chips + add filter dropdown
- `assets/js/filter-editor.js` — Chip management and filter editor modal

### Behavior
- Scope shown at top (orgs + types from user settings)
- Saved views for repeatable workflows
- Facets update counts dynamically
- "Add filter" opens modal for text/autocomplete fields

## Layout Modes

Backoffice search uses the standard `u-layout--app` shell:

```html
<main id="main-content">
  <div class="u-main__header"><!-- page-level toolbar --></div>
  <div class="u-main__body">
    <aside class="u-main__sidebar"><!-- facets --></aside>
    <section class="u-main__content">
      <div class="u-main__content-header"><!-- results toolbar --></div>
      <div class="u-main__content-body"><!-- results list --></div>
    </section>
  </div>
</main>
```

Detail and dashboard pages use the same shell without the split sidebar.

## Event System

Components communicate via custom events:

- `biblio:filter-add` — Add a filter chip (dispatched by autocomplete rows, filter editor)
- `people-search:select` — Person selected from people widget
- `htmx:afterSwap` — HTMX content updates

## Testing

Search components are tested through:
- Template integration in `templates/biblio-public/public-search.html`
- Template integration in `templates/biblio-backoffice/backoffice-search-filter-first.html`
- Prototype data in `filter-stubs.js` (remove when real APIs exist)
