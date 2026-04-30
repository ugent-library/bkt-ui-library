# PRODUCT.md
# Product decisions, prototype status, and roadmap

This file tracks what we're building, what's decided, what's deferred, and what still
has open questions. It is not a changelog (see CHANGELOG.md) and not domain vocabulary
(see DOMAIN.md). For strategic context behind these decisions, see STRATEGY.md.
For who is responsible for which fields and workflow steps, see `RESPONSIBILITY.md`.

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
| Dashboard — researcher | `biblio-researcher/dashboard.html` | Nearing completion, with filled, empty and message state. |
| Dashboard — proxy | ✗ | **Not designed** |
| Dashboard — curator | `biblio-team/team-dashboard.html.html` | ✓ Prototyped |

**Curator review queue**
After a researcher submits, the work is automatically published. The curator sees it
in their queue. They can choose FIFO or urgency-first (deadlines, missing high-stakes
fields). They can see who or what created the record, then edit, ask a question, or
return the work (for duplicates or records that don't belong on this platform). When
finished, they mark it as reviewed. This closes the deposit loop.

| What | Prototype | Status |
|------|-----------|--------|
| Curator review queue (list of submitted works) | `biblio-team/team-queue.html` | ✓ Prototyped |
| Curator review: mark as reviewed | `biblio-team/team-review.html` | ✓ Prototyped |
| Curator review: return with reason | `biblio-team/team-review.html` | ✓ Prototyped (modal) |

**Deposit flow**
The four-step flow is structurally prototyped. The field content is illustrative —
it does not yet reflect the actual required-by-researcher vs. curator-fills field split
per output type. That split needs a workshop with curators and policy makers before
the form can be considered implementation-ready. See Output types section below.

| What | Prototype | Status |
|------|-----------|--------|
| Step 1a: entry (blank) | `biblio-researcher/deposit-1-0-find.html` | ✓ Structure done |
| Step 1b: entry (pre-filled from import) | `biblio-researcher/deposit-1-1-find.html` | ✓ Structure done |
| Step 2: upload | `biblio-researcher/deposit-2-upload.html` | ✓ Structure done |
| Step 3: access rights | `biblio-researcher/deposit-3-access-rights.html` | ✓ Structure done |
| Step 4: review & submit | `biblio-researcher/deposit-4-review.html` | ✓ Structure done |
| Field requirements per output type | — | ✗ **Needs curator/policy workshop** |

**Backoffice search**
Filter-first is the committed approach.

| What | Prototype | Status |
|------|-----------|--------|
| Search, filter-first | `biblio-researcher/search-filter-first.html` | ✓ Exploration |
| Search settings / scope | `biblio-researcher/search-settings-scope.html` | ✓ Exploration |
| Search — researcher | `biblio-researcher/search-researcher.html` | ✓ Done |
| Search — curator | `biblio-team/search-team.html` | ✓ Done |

**Public surface**
All primary detail pages exist. Overview/browse pages are missing — no way for
a user to browse to an organisation, project, or researcher page without a direct URL.

| What | Prototype | Status |
|------|-----------|--------|
| Homepage | `biblio-public/public-index.html` | ✓ |
| Search | `biblio-public/public-search.html` | ✓ |
| Work detail | `biblio-public/public-research-detail.html` | ✓ |
| Organisation detail | `biblio-public/public-organisation.html` | ✓ |
| Project detail | `biblio-public/public-project.html` | ✓ |
| Researcher profile | `biblio-public/public-researcher.html` | ✓ |
| Organisations overview | ✗ | Not prototyped |
| Projects overview | ✗ | Not prototyped |
| Researchers overview | ✗ | Not prototyped |

---

### Next

**Candidate review (auto-import inbox)**
Researchers review harvested candidates (WoS, ORCID, arXiv) and accept or reject them.
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
| Requested | Works returned by curator — researcher must act | Highest |
| Suggestions | Harvested candidates matched to this researcher — confirm or dismiss | High — time-sensitive |
| Added on your behalf | Works added by a librarian or proxy — researcher should verify | Medium |
| Returned | Works that don't belong on this platform | Low — informational |
| Merged | Duplicates now merged as one | Low — informational |
| Recent activity | Audit trail of changes to the researcher's works | Low — informational |

**What does not belong here:**
- Anything scoped beyond the researcher's own works
- Bulk actions
- Filter/search controls

**Current prototype:** `biblio-researcher/dashboard.html` — partial, needs review.

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
| Needs action | Works needing extra information across all represented researchers, grouped by researcher | Highest |
| My deposit queue | Works the proxy has started but not yet submitted | High |
| Suggestions | Harvested candidates for represented researchers — proxy can confirm or forward | High |
| Recent activity | Changes across represented researchers | Medium |

**What does not belong here:**
- Anything outside the proxy's assigned researchers

**Current prototype:** ✗ Does not exist. Must be built.

**Open questions:**
- Can a proxy see the full list of researchers they represent? Where does that live?
- If a researcher has multiple proxies, do suggestions appear for all of them?
- Should the proxy dashboard have a "Switch researcher" context mechanism?

---

### Dashboard: curator

**Full brief:** `docs/CURATOR-DASHBOARD-BRIEF.md`

**Primary question the dashboard answers:** "What is in my queue, and what is at risk — within my scope?"

Curators currently work inside the filter list — applying "Needs review" saved views and
managing from search results. That works but means every session starts with rebuilding
context. The curator dashboard is a triage layer that front-loads the most important
signals. It sits **alongside** the filter-first search list, not as a replacement.

The current unofficial dashboard (list of unclassified records) is the wrong model —
it is driven by bibliography metadata, not by what curators actually need to do today.

**Scope is the personalisation mechanism.** Curators arrive with a configured scope
(one or more faculties/departments, optional type filter). The entire dashboard reflects
that scope. Scope can vary per curator — not everyone covers the same departments.

**What belongs here:**

| Section | Contents | Priority |
|---------|----------|----------|
| Review queue | Works with `status=submitted` within scope, not yet reviewed | Highest |
| At risk / flagged | Works approaching deadlines (VABB, FWO, OA mandate), missing required fields, system or curator-set flags | High |
| Candidate inbox | Count + preview of unreviewed harvested candidates within scope | High |
| Answers / resubmissions | Works returned to researcher and since resubmitted — time-sensitive | Medium |
| Scope activity | Recent changes within scope — published, returned, imported | Medium |
| Stats | Deferred to v2 — belongs in a reporting surface, not this dashboard | — |

**Sort order for review queue:**
- If any item has a deadline within 30 days: sort deadline-flagged items first, by date
- Otherwise: oldest submitted first (FIFO)
- Curators can override sort

**Risk tiers (from RESPONSIBILITY.md):**

| Tier | Label | Conditions |
|------|-------|-----------|
| 1 | Fast Pass | Clean import, no funding ambiguity, no duplicate flag, no file issue |
| 2 | Standard | Grant confirmation needed, affiliation mismatch, duplicate warning, missing link |
| 3 | Deep curation | VABB-sensitive, FWO attribution critical, books/chapters, embargo complexity |

Tier 3 items are visually distinct — not just a badge.

**What does not belong here:**
- Individual researcher-level notifications
- UI for editing records (link to detail page)
- Bulk editing tools (that is the search list)
- Stats requiring a separate reporting pipeline
- Anything requiring manual curation to stay current

**Decided:**
- Dashboard and search list are alongside each other — not replacements
- Review queue count = "Needs review" saved view count (same query, same number)
- Sort: deadline-first when deadlines are present; FIFO otherwise
- Scope is per-curator, collapsible by department
- At-risk flags: both system-generated and curator-set
- Dashboard must not require manual maintenance — everything derived from record state

**Current prototype:** `biblio-team/team-dashboard.html.html` — ✓ Prototyped.

**Open questions:**
- Trusted import definition: when a WoS harvest creates a record without researcher
  initiation, does it land in the review queue or the candidate inbox? (RESPONSIBILITY.md: open)
- Curator-owned fields — complete list: VABB, pagination, short journal title confirmed.
  Full list still pending from curator team.
- Proxy-submitted flags: how prominent should the flag be when OA/version/access was
  set by a proxy rather than the researcher?
- Multi-department coordination: when the same output is being entered by two
  departments, does it surface here? No current mechanism.
- "Done" definition: what does an all-clear state mean exactly? Queue empty?
  No Tier-3 unresolved? No deadlines within 14 days?

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

**Prototype:** `biblio-researcher/search-settings-scope.html` + sidebar of `biblio-researcher/search-filter-first.html`

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

**Prototype:** sidebar of `biblio-researcher/search-filter-first.html`

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
| `bt-list-item` | `biblio-researcher/dashboard.html` | ⚠ Not in SCSS |
| Scope indicator block | `biblio-researcher/search-filter-first.html` | ⚠ Bootstrap utilities only |
| Saved views nav | `biblio-researcher/search-filter-first.html` | ⚠ Bootstrap utilities only |
| `filter-tag--editable` modifier | `partials/result-filter-bar.html` | ⚠ Exists in JS, not in SCSS |
| `filter-tag-group` wrapper | `partials/result-filter-bar.html` | ⚠ Not in SCSS |
| `--bt-text-muted` token mismatch | `_surfaces.scss` | ⚠ Not yet resolved |
| `style=` on year range inputs | `biblio-researcher/search-filter-first.html` | ⚠ Needs SCSS token |
| `style=` on `max-width: 680px` | `biblio-researcher/search-settings-scope.html` | ⚠ Needs layout token or utility |
| Risk tier Tier-3 visual treatment | `biblio-team/curator-*` | ⚠ Not yet designed |
| Scope indicator in dashboard header | `biblio-team/curator-*` | ⚠ Bootstrap utilities only |

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
