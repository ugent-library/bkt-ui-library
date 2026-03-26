# PRODUCT.md
# Pending decisions, open items, and prototype status

This file tracks product decisions that aren't yet resolved, implementation gaps
flagged during prototyping, and questions deferred for later. It is not a
changelog (see CHANGELOG.md) and not domain vocabulary (see DOMAIN.md).

Update this file when: a flagged item is resolved, a new gap is found, or a
prototype session produces a decision that affects other templates.

---

## Open design decisions

### Search architecture: public vs. backoffice split
**Decision:** Build two separate search UIs sharing one query model.
- **Public** — search-first, multi-entity autocomplete, facet sidebar for refinement.
  Prototype: `templates/biblio-public/public-search-suggest.html`
- **Backoffice** — filter-first, saved views, search as refinement inside results.
  Prototype: `templates/biblio-backoffice/backoffice-search-filter-first.html`

**Still open:**
- When `/search/suggest` endpoint is specced: "Librarian tags" is included in the backoffice autocomplete for curators.
- Entity routing from autocomplete: People → profile page, Works → detail page,
  Organisations/Projects → filtered search. Confirm with backend team.

---

### Scope
**Decision:** Persistent per-user constraint on default search/dashboard/candidate
queue view. Stored in user settings. Available to: curators and _perhaps_ proxies (not
researcher role). Configurable in Settings > Work scope. To be discussed with development team, and see if this is not overlapping too much with "saved views" or "saved searches".

Scope has two independent dimensions:
- **Organisations** — one or more faculties, departments, research groups.
  No cap on number. Sidebar indicator shows first two names; 3+ shows "+N more".
- **Output types** — optional. Empty = all types within org scope.

Scope ≠ Grant (grants = what you *can* access; scope = what you *choose to focus on*).
Scope ≠ filter (filters are session-level; scope persists across sessions).

**Prototype:** `templates/biblio-backoffice/backoffice-settings-scope.html`
**Sidebar indicator:** `templates/biblio-backoffice/backoffice-search-filter-first.html`

**Still open:**
- Where would scope be stored in `bbl`? Proposal: `user_settings.scope_orgs[]` and
  `user_settings.scope_types[]` on the user record. Needs a backend decision.
- How is scope applied server-side on page load? Proposal: injected as default
  query params before the search handler runs. Needs backend implementation spec.
- Proxies: scope org picker should only show orgs the proxy has proxy rights for.
  Confirm this is derivable from the Grant table without a separate lookup.

---

### Saved views
**Decision:** Named filter presets for repeatable curator/proxy workflows.
Mechanically: a URL with pre-applied query params saved per user.
Available to: curators and proxies. Compare with "scopes".

Four system-provided views bootstrapped on first login:
- All records (no constraint)
- Needs review (`status=submitted`, scoped to user's scope)
- Missing full text (`oa=missing`)
- Recently updated (`updated_since=7d`)

Users can save additional views from the current query state ("Save current view").

**Prototype:** sidebar of `templates/biblio-backoffice/backoffice-search-filter-first.html`

**Still open:**
- Where are saved views stored? Proposal: `user_saved_views` table with
  `(user_id, name, url_params, created_at)`. Needs backend decision.
- Can views be deleted or renamed in the prototype? Not yet designed.
- Are system views localised (Dutch/English)? Assumption: yes — via i18n keys.

---

## UI library gaps identified during prototyping

These patterns are used in prototype templates but not yet documented or implemented
in `assets/scss/`. Flag these before implementing in `bbl`.

### Components needed

| Component | Used in | Status |
|-----------|---------|--------|
| `bt-panel` / `bt-panel__header` / `bt-panel__body` | `backoffice-dashboard.html` | ⚠ Not in SCSS — inline styles used as workaround |
| `bt-list-item` | `backoffice-dashboard.html` | ⚠ Not in SCSS |
| Scope indicator block (sidebar) | `backoffice-search-filter-first.html` | ⚠ No component — Bootstrap utilities only |
| Saved views nav | `backoffice-search-filter-first.html` | ⚠ No component — Bootstrap utilities only |
| `filter-tag--editable` modifier | `result-filter-bar.html` | ⚠ Modifier exists in JS but not in SCSS |
| `filter-tag-group` wrapper | `result-filter-bar.html` | ⚠ Not in SCSS |

### Token issues

| Issue | File | Status |
|-------|------|--------|
| `--bt-text-muted` token mismatch | `_surfaces.scss` | ⚠ Reported — not yet resolved |
| IBM Plex Serif weight 600 missing from Google Fonts import | `_header.scss` | ✓ Fixed |
| `--s-display-weight: 600` missing from public surface block | `_surfaces.scss` | ✓ Fixed |
| `style=` on year range inputs (sidebar) | `backoffice-search-filter-first.html` | ⚠ Needs SCSS token |
| `style=` on `max-width: 680px` (settings page) | `backoffice-settings-scope.html` | ⚠ Needs layout token or utility |

---

## Partial architecture (pending implementation)

Three partials need to be extracted from inline template code and made reusable.
See `docs/PARTIALS.md` for the full spec.

| Partial | Status |
|---------|--------|
| `backoffice-facet-sidebar.html` — filter sidebar with scope indicator + saved views | ✓ Extracted — used by backoffice-search.html and backoffice-search-filter-first.html |
| `search-filter-bar.html` — chips + add filter + filter editor | ✓ Extracted — used by backoffice-search.html and public-search.html |
| `search-suggest-panel.html` + `suggest-panel.js` | ✓ Extracted — panel content partial + JS in assets/js/suggest-panel.js |

---

## Templates: implementation status in `bbl`

| Template | Prototype exists | Implemented in bbl |
|----------|-----------------|-------------------|
| backoffice | - | - |
| `backoffice-search.html` | ✓ | ✗ |
| `backoffice-dashboard.html` | ✓ | ✗ |
| `backoffice-dashboard-empty.html` | ✓ | ✗ |
| `backoffice-search-filter-first.html` | ✓ exploration | ✗ |
| `backoffice-settings-scope.html` | ✓ exploration | ✗ |
| `backoffice-deposit-flow.html` | ✓ | ✗ |
| Curator review queue | ✗ not prototyped | ✗ |
| Candidate review | ✗ not prototyped | ✗ |
| Duplicate review | ✗ not prototyped | ✗ |
| public | - | - |
| `public-index.html` | ✓ | ✗ |
| `public-search.html` | ✓ | ✗ |
| `public-research-detail.html` | ✓ | ✗ |
| public-organisations-overview | ✗ not prototyped | ✗ |
| `public-organisation.html` | ✓ | ✗ |
| public-projects-overview | ✗ not prototyped | ✗ |
| `public-project.html` | ✓ | ✗ |
| public-researchers-overview | ✗ not prototyped | ✗ |
| `public-researcher.html` | ✓ | ✗ |
| Public heritage object page | ✗ not prototyped | ✗ |

---

## Deferred / won't do (v1)

- Natural language search
- Client-side query building
- Scope for researcher role
- Bulk export respects scope (scope intentionally excluded from exports and API)
- Saved views for researcher role
- View sharing between curators
