# PRODUCT.md
# Product decisions, prototype status, and roadmap

This file tracks what we're building, what's decided, what's deferred, and what still
has open questions. It is not a changelog (see CHANGELOG.md) and not domain vocabulary
(see DOMAIN.md). For strategic context behind these decisions, see STRATEGY.md.

Update this file when: a flagged item is resolved, a new gap is found, a prototype
session produces a decision, or priorities shift.

---

## Roadmap

### Now — prototype coverage for the dev when he surfaces

**Dashboards — three roles, three views**
See the Dashboards section below for the full planning. In short: we need three
distinct dashboards, none of which currently exists as a complete prototype.
The existing `dashboard.html` is a partial researcher view only.

| What | Prototype | Status |
|------|-----------|--------|
| Dashboard — researcher | `backoffice/dashboard.html` | Nearing completion, with filled, empty and message state. |
| Dashboard — proxy | ✗ | **Not designed** |
| Dashboard — curator | ✗ | **Not designed — highest priority gap** |

**Curator review queue**
After a researcher submits, the work is automatically published. The curator sees it in their queue. They can choose to go with FIFO (first in, first out) or go by urgency (deadlines, important missing information). They can also see who or what service added the reviews and either edits, asks a question or returns the work (doubles or if this is not the right platform). When they are finished, they can check it as reviewed.
This closes the deposit loop.

| What | Prototype | Status |
|------|-----------|--------|
| Curator review queue (list of submitted works) | ✗ | Not prototyped |
| Curator review: approve | ✗ | Not prototyped |
| Curator review: return with reason | ✗ | Not prototyped |

**Deposit flow**
The four-step flow is structurally prototyped. The field content is illustrative —
it does not yet reflect the actual required-by-researcher vs. curator-fills field split
per output type. That split needs a workshop with curators and policy makers before
the form can be considered implementation-ready. See Output types section below.

| What | Prototype | Status |
|------|-----------|--------|
| Step 1a: entry (blank) | `backoffice/deposit-1-0-find.html` | ✓ Structure done |
| Step 1b: entry (pre-filled from import) | `backoffice/deposit-1-1-find.html` | ✓ Structure done |
| Step 2: upload | `backoffice/deposit-2-upload.html` | ✓ Structure done |
| Step 3: access rights | `backoffice/deposit-3-access-rights.html` | ✓ Structure done |
| Step 4: review & submit | `backoffice/deposit-4-review.html` | ✓ Structure done |
| Field requirements per output type | — | ✗ **Needs curator/policy workshop** |

**Backoffice search**
Filter-first is the committed approach.

| What | Prototype | Status |
|------|-----------|--------|
| Search, filter-first | `backoffice/search-filter-first.html` | ✓ Committed approach |
| Search settings / scope | `backoffice/search-settings-scope.html` | ✓ Exploration |

**Public surface**
All primary detail pages exist. Overview/browse pages are missing — no way for
a user to browse to an organisation, project, or researcher page without a direct URL.

| What | Prototype | Status |
|------|-----------|--------|
| Homepage | `public/public-index.html` | ✓ |
| Search | `public/public-search.html` | ✓ |
| Work detail | `public/public-research-detail.html` | ✓ |
| Organisation detail | `public/public-organisation.html` | ✓ |
| Project detail | `public/public-project.html` | ✓ |
| Researcher profile | `public/public-researcher.html` | ✓ |
| Organisations overview | ✗ | Not prototyped |
| Projects overview | ✗ | Not prototyped |
| Researchers overview | ✗ | Not prototyped |

---

### Next

**Candidate review (auto-import inbox)**
To be discussed; right now the idea is that researchers review harvested candidates (WoS, ORCID, arXiv) and accept or reject them.
Distinct from the curator review queue: that handles researcher-submitted works;
this handles machine-harvested records.

| What | Prototype | Notes |
|------|-----------|-------|
| Candidate list / inbox | ✗ | Filter by source, confidence, person, org |
| Candidate detail: accept | ✗ | Merge check if duplicate suspected |
| Candidate detail: reject with reason | ✗ | |

**Duplicate detection**
When a candidate or submission likely matches an existing record. Interaction for
resolving (merge, dismiss, confirm distinct) is not yet designed.

---

### Later — wait for backend contracts before designing

- Ingestion pipeline monitoring — depends on `bbl` implementation
- OA policy guidance in deposit (Sherpa Romeo or equivalent) — external data source
- Bulk operations on candidate review — after single-item flow is validated

---

### Deferred / won't do (v1) (TBD)

- Natural language search
- Client-side query building
- Bulk export respects scope
- Saved views for researcher role
- View sharing between curators

---

## Dashboards

Three roles, three dashboards. They share a layout shell but have completely different
content, information hierarchy, and primary actions. They must be designed separately.

### Why three, not one

The three roles have different relationships to the work in Biblio:

- **Researcher** — owns their output. Needs to know what requires their attention
  (revision requested, suggestions to confirm) and what is happening to their work.
- **Proxy** — acts on behalf of one or more researchers. Needs to know what requires
  action across the people they represent, plus their own deposit queue.
- **Curator** — responsible for quality across a scope (faculty, department, all).
  Needs to know what is waiting for review, what is overdue, and what requires
  intervention.

The mistake to avoid: designing one dashboard and trying to make it serve all three
by showing/hiding sections. The information hierarchy is different enough that this
produces a confused interface for all three.
---

### Dashboard: researcher

**Primary question the dashboard answers:** "Do I need to do anything right now?"

**What belongs here:**

| Section | Contents | Priority |
|---------|----------|----------|
| Requested | Works that need to be completed by curator, only for doubles or | Highest — researcher must act |
| Suggestions | Harvested candidates matched to this researcher — confirm or dismiss | High — time-sensitive |
| Added on your behalf | Works added by a librarian or proxy — researcher should verify | Medium |
| Returned | Works that are not supposed to be in Biblio |  Low — informational |
| Merged | Doubles that are now merged as one |  Low — informational |
| Recent activity | Audit trail of changes to the researcher's works — published, edited, submitted | Low — informational |

**What does not belong here:**
- Anything scoped beyond the researcher's own works
- Bulk actions
- Filter/search controls

**Current prototype:** `backoffice/dashboard.html` — partial, needs review.
**Empty state:** `backoffice/dashboard-empty.html` — exists.

**Open questions:**
- Which metrics should be shown? To be discussed with policy.
- Should suggestions expire or be dismissible permanently?
- What to do with drafts?

---

### Dashboard: proxy

**Primary question the dashboard answers:** "What needs my attention across the
researchers I represent?"

A proxy acts on behalf of one or more researchers. Their dashboard is the researcher
dashboard scaled across multiple people, plus their own deposit queue.

**What belongs here:**

| Section | Contents | Priority |
|---------|----------|----------|
| Needs action | Works that need extra information across all represented researchers, grouped by researcher | Highest |
| My deposit queue | Works the proxy has started depositing but not yet submitted | High |
| Suggestions | Harvested candidates for represented researchers — proxy can confirm or forward | High |
| Recent activity | Changes across represented researchers — scoped to proxy's people | Medium |

**What does not belong here:**
- Anything outside the proxy's assigned researchers
- Curator-level bulk review tools (TBD, are we sure? Does the scope not make that redundant?)

**Current prototype:** ✗ Does not exist. Must be built.

**Open questions:**
- Can a proxy see the full list of researchers they represent? Where does that live?
- If a researcher has multiple proxies, do suggestions appear for all of them?
- Should the proxy dashboard have a "Switch researcher" context mechanism?

---

### Dashboard: curator

**Primary question the dashboard answers:** "What is in my queue, and what is at risk?"

Curators are currently working inside the filter list — applying "Needs review" saved
views and managing from search results. That works but it means every session starts
with rebuilding context. The curator dashboard should front-load the most important
signals without requiring a filter.

Their dashboard now consists out of a list of publications that don't have a classification yet. That is not the right approach, it's depending on the bibliography's metadata.

**What belongs here:**

| Section | Contents | Priority |
|---------|----------|----------|
| Review queue | Works with `status=submitted` within the curator's scope, oldest first | Highest — this is the primary job (Is that true? Should they not focus on the nearest deadlines?) |
| At risk / flagged | Works approaching deadlines (VABB, mandate), works with missing required fields, works flagged by the system | High |
| Candidate inbox | Count of unreviewed harvested candidates within scope. These can also be submitted if we trust the source. | High |
| Answers | Changes to research output by the resercher, that have been answered. Resubmitted | Medium (TBD) |
| Scope activity | Recent changes within the curator's scope — published, returned, imported | Medium |
| Stats (optional) | Records reviewed this week, OA percentage within scope, pipeline health | Low — may belong in a separate reports view |

**What does not belong here:**
- Individual researcher-level notifications (that is the researcher's dashboard)
- UI for editing records (click through to the detail page)

**Current prototype:** ✗ Does not exist. Must be built.

**Open questions:**
- Q: Should the review queue on the dashboard be the same as the "Needs review" saved
  view in the filter list — or is the dashboard a separate, curated surface?
  A: it needs to be the same count
- Q: What is the right sort order for the review queue: oldest submitted first
  (fairness), or highest risk first (urgency)?
  A: depending if there is a nearing deadline
- Q: Should curators see a queue for their entire scope, or should scope be collapsible
  by faculty/department?
  A: They should be scopable by department. Not each curator has the same set.
- Q: Are "at risk" flags generated by the system automatically, or manually set by
  curators? Both?
  A: Both
- Q: Does the curator dashboard replace the current filter-list-as-working-surface,
  or does it sit alongside it?
  A: they should still be able to filter themselves. Alongside.

**Design constraint:** the curator dashboard must not become another place curators
have to maintain. If it requires manual curation to stay useful, it will be ignored.
Everything on it should be derived automatically from record state and scope.

---

## Output types

### Top-level types – open for workshop

These are industry-standard types with clear semantics, external identifier support,
and meaningful volume at UGent. These are the types we will use for our prototype.
They will be enhanced after the workshop.

| Type | Subtypes | Auto-import coverage | Primary identifier |
|------|----------|---------------------|--------------------|
| `journal_article` | Original, Review, Letter/Note, Proceedings Paper | High | DOI (Crossref) |
| `book` | — | Medium | ISBN, DOI |
| `book_chapter` | — | Low | DOI (inconsistent) |
| `conference` | Proceedings paper, Meeting abstract, Poster, Other | Low–medium | DOI (inconsistent) |
| `dissertation` | — | Low | Handle, institutional repo |
| `dataset` | — | High | DOI (DataCite) |
| `software` | — | Low | DOI (Zenodo), GitHub URL |
| `preprint` | — | High | arXiv ID, bioRxiv DOI |
| `report` | — | Very low | Handle, institutional |

### Field requirements per output type — open for workshop

Which fields a researcher must provide to submit, and which a curator must complete
before publishing, needs to be defined per output type. This is a policy decision,
not a design decision — it must be made with curators and policy makers.

**Workshop agenda:**
1. For each output type: what is the minimum a researcher must provide?
2. For each output type: what must a curator complete before publishing?
3. For each output type: what is optional/enrichment only?
4. What is the minimum viable submission — the lowest bar before curators take over?

**Starting proposal for journal article** (to validate in workshop, not final):

| Field | Researcher must provide | Curator must complete | Optional |
|-------|------------------------|----------------------|----------|
| Title | ✓ | | |
| At least one author | ✓ | | |
| Year | ✓ | | |
| Output type | ✓ | | |
| Full text file OR reason for no file | ✓ | | |
| OA status + licence | ✓ | | |
| Abstract | | ✓ | |
| Journal name | | ✓ | |
| DOI | | ✓ | |
| UGent departments | | ✓ | |
| Volume / issue / pages | | | ✓ |
| VABB classification | | ✓ (curator only) | |
| Projects | | | ✓ |
| Keywords | | | ✓ |

---

## Open design decisions

### Search architecture

**Decision:** Filter-first for backoffice. Committed.

**Still open:**
- Entity routing from autocomplete: People → profile page, Works → detail page,
  Organisations/Projects → filtered search. Confirm with backend team.
- "Librarian tags" in backoffice autocomplete — include when `/search/suggest` is specced.

### Scope

**Decision:** Persistent per-user constraint on default search/dashboard view.
Available to curators and possibly proxies. Configurable in Settings > Work scope.

Two dimensions:
- **Organisations** — one or more faculties, departments, research groups.
  Sidebar shows first two; 3+ shows "+N more".
- **Output types** — optional. Empty = all types within org scope.

Scope ≠ Grant (what you *can* access). Scope ≠ filter (session-level).

**Prototype:** `backoffice/search-settings-scope.html` + sidebar of `search-filter-first.html`

**Still open:**
- Overlap with saved views: scope = persistent org/type constraint;
  saved views = named URL presets. Related but not the same.
- Storage in `bbl`: proposed `user_settings.scope_orgs[]` + `scope_types[]`. Backend decision needed.
- Applied server-side: proposed as default query params injected before handler runs.
- Proxies: org picker limited to orgs they have proxy rights for — confirm derivable from Grant table.

### Saved views

**Decision:** Named filter presets per user. Mechanically: a saved URL with query params.
Available to curators and proxies.

Four system views bootstrapped on first login:
- All records
- Needs review (`status=submitted`, within scope)
- Missing full text (`oa=missing`)
- Recently updated (`updated_since=7d`)

Users can save additional views from the current query state.

**Prototype:** sidebar of `backoffice/search-filter-first.html`

**Still open:**
- Storage: proposed `user_saved_views (user_id, name, url_params, created_at)`. Backend decision needed.
- Delete / rename views: not yet designed.
- Localisation: assumed yes, via i18n keys.

---

## UI library gaps

Patterns used in prototypes but not yet in `assets/scss/`.
Resolve before handing a template to the dev for implementation.

| Component / issue | Used in | Status |
|-------------------|---------|--------|
| `bt-list-item` | `dashboard.html` | ⚠ Not in SCSS |
| Scope indicator block | `search-filter-first.html` | ⚠ Bootstrap utilities only |
| Saved views nav | `search-filter-first.html` | ⚠ Bootstrap utilities only |
| `filter-tag--editable` modifier | `result-filter-bar.html` | ⚠ Exists in JS, not in SCSS |
| `filter-tag-group` wrapper | `result-filter-bar.html` | ⚠ Not in SCSS |
| `--bt-text-muted` token mismatch | `_surfaces.scss` | ⚠ Not yet resolved |
| `style=` on year range inputs | `search-filter-first.html` | ⚠ Needs SCSS token |
| `style=` on `max-width: 680px` | `search-settings-scope.html` | ⚠ Needs layout token or utility |

---

## Partial architecture

| Partial | Status |
|---------|--------|
| `backoffice-facet-sidebar.html` | ✓ Extracted |
| `search-filter-bar.html` | ✓ Extracted |
| `search-suggest-panel.html` + `suggest-panel.js` | ✓ Extracted |

See `docs/PARTIALS.md` for full spec.

---

## Research card — design decisions

### Surfaces and variants

Three variants, designed in this order:
1. **Backoffice curator** — maximum density, all metadata visible
2. **Backoffice researcher** — lighter, same structure, fewer fields
3. **Public** — open, readable, action-focused

Backoffice is the base. Public is derived with information removed, not added.

### Naming

The entity is a **work**. Component class: `bt-work-card`.

### Backoffice density

Curators use the work list as a working surface — filter and act directly from the list.
The card must expose all metadata at once:
- Status badges (Biblio status, work type, OA status)
- Title (links to the record)
- Authors with affiliation indicators (UGent icon, ORCID icon)
- Publication line (year, journal/venue, volume/pages)
- Departments, Projects
- Biblio message (when present — addressed to the researcher)
- Biblio ID + audit trail
- VABB data (when present)
- Quick links

**Known tension:** this density is a workaround for the absence of a proper curator
dashboard. The card design must not make a future action-driven dashboard harder to add.

### Backoffice researcher card

Same structure — remove: projects, VABB. Keep: departments (own only), Biblio message,
Biblio ID, audit, quick links.

### Actions

**Backoffice:** View/Edit via title link and secondary action button — no prominent action row.
**Public:** Read/Download primary (prominent button). Cite secondary (explicit button).
Save to list tertiary (icon-only, hidden from logged-out users).
