# Domain vocabulary for raven / biblio.ugent.be

This file defines the shared language between the backend (`raven`) and the UI layer (`booktower-ui-library`). When working on either side, use these terms consistently. Do not invent synonyms.

---

## Core entities

### Work
The central entity. A publication, dataset, software, or other research output produced by one or more people. Every card, row, or detail page in the UI represents a Work.

- Stored in the works table
- Has a `kind` (see Work kind) and a `status` (see Work status)
- Metadata lives in `attrs jsonb` on the database row
- Display data (contributors, files, organisations, projects) is aggregated into `doc jsonb` — this is what the UI renders, no joins required
- A Work is **never hard-deleted** once it has been public; it can only be withdrawn, retracted, or taken down

### Work kind
The publication type. Determines which fields are active in the deposit form (profile-driven — see The profile system).

The authoritative list of work kinds lives in `raven/docs/raven-design.md`. It is not duplicated here, to avoid drift.

All kinds are collectively referred to as **research output** — not "publications" or "publications and datasets". The term "publications" is not used in the UI. This is intentional: new kinds may be added in the future without requiring a UI redesign.

In the UI: shown as a `badge text-bg-primary` badge and controls which form fields appear.

### Work status
The lifecycle state of a Work.

| Status | Meaning | Who sees it |
|--------|---------|-------------|
| `draft` | Created, not yet submitted | Owner and curators only |
| `submitted` | Submitted for review | Owner and curators |
| `public` | Published and visible | Everyone |
| `deleted` | Withdrawn, retracted, or taken down | Curators only (tombstone) |

In the UI: shown as a badge. `draft` → `badge text-bg-warning` (yellow). `submitted` → `badge text-bg-info` (blue). `public` → `badge text-bg-success` (green). `deleted` is not shown in normal lists.

### Work delete_kind
Only set when `status = 'deleted'`. Distinguishes the reason.

| Value | Meaning |
|-------|---------|
| `withdrawn` | Author or editor request post-publication |
| `retracted` | Post-publication integrity issue |
| `takedown` | Legal obligation (GDPR, court order) — attrs may be purged |

### Person
A real-world individual who contributed to research output. May be known only by name (external, unlinked) or linked to a canonical authority record.

Two-layer model:
- **PersonRecord** — a source avatar, one per import payload. Carries raw data from ORCID, LDAP, WoS, etc.
- **PersonIdentity** — the canonical golden record. One per real-world person. Synthesised from one or more PersonRecords, or created directly by a curator (curation-only identity, no source records needed).

In the UI: a contributor in the deposit form is a Person. They may be **linked** (has a `person_identity_id`, shown as a UGent-identified person) or **unlinked** (known by name only — valid and expected for external co-authors). The distinction matters for person-centric queries but not for display rendering.

### Contributor
A Person as they appear on a specific Work. Carries: display name, role (`author`, `editor`, `translator`, &hellip;), affiliation at time of work, and optionally a link to a PersonIdentity.

Ordered by `pos` (fracdex) — order is semantically meaningful (author order on a paper matters).

In the UI: rendered in `bt-work-card__authors` on cards, and as the editable people list in the deposit flow. UGent-affiliated contributors are distinguished from external ones.

### Organisation
An institutional entity (faculty, department, research group, university). Hierarchical — an org can be `part_of` another, with temporal bounds on that relationship.

In the UI: shown as metadata on the detail page sidebar, as affiliation labels on contributors in the deposit flow, and as a facet filter in the backoffice list.

### Project
A funded research project (e.g. an FWO or BOF grant). Has start/end dates and can have person–project roles (PI, co-PI, researcher).

In the UI: linked from Work detail pages. Searchable as a filter in the backoffice. A work can be linked to multiple projects.

### User
An application account. May be linked to a PersonIdentity (most staff users) or not (admin/service accounts). Has a global role: `admin` or `user`. Curation rights are expressed through Grants, not the role field alone.

### Grant
A permission record. One row = one permission for one user over one scope. A user's full access picture is one query on the grants table. Grants can be global, org-scoped, project-scoped, or entity-level.

In the UI: not directly visible to end users, but determines which action buttons appear (edit, submit, publish, delete).

### Candidate
A possible Work collected by an automated harvester (Web of Science, ORCID, arXiv, etc.). Not a Work until explicitly accepted by a curator or the submitting researcher.

In the UI: the "Suggestions" section in the backoffice sidebar. Shown as a review queue — accept or reject. The badge count on "Suggestions" reflects pending candidates matched to the current user's works or organisation.

### Revision (Rev)
One transaction boundary in the audit trail. Every state change goes through `AddRev`, which writes one revision row and one or more Mutation rows. Human actions have `user_id` set; automated imports have `source` set.

In the UI: surfaces as a change history view on a Work detail page (who changed what, when).

### Mutation
A named, serializable unit of state change within a Revision. Examples: `SetTitle`, `PublishWork`, `AddContributor`. The audit trail is a log of mutations. Pure and testable — no DB access in the apply step.

---

## Access and file concepts

### Visibility
Describes who can access a file. Per-file, not per-work. Field and values are raven's (`raven/docs/metadata-work-fields.md` → Files); records carry their own `visibility` with the same values.

| Value | Label | Badge |
|-------|-------|-------|
| `public` | Open access | `badge text-bg-success` |
| `restricted` | Restricted | `badge text-bg-warning` |
| `private` | — | never listed publicly |

In summary views (cards, table rows), show the most permissive visibility across all files on the work.

### Embargo
A file can be under embargo: `lift_embargo_on` (release date) paired with `visibility_after_embargo` — restricted now, switching automatically on the date. The transition is applied by a background job. In the deposit form: the submitter chooses "Under embargo" as the OA status and sets a release date. After the embargo lifts, the dates are kept as a bibliographic record.

---

## The profile system

Work kinds have **profiles** — YAML configuration files that define which fields are active, required, or optional for that kind at this installation. This is the authoritative source for form shape and field order.

**What this means for UI work:**
- Do not hardcode which fields appear in a work edit form. The form is generated from the profile.
- Field order in the form follows declaration order in the profile YAML — not alphabetical or arbitrary.
- A field absent from the profile must not appear in the form, even if data exists in `attrs` for it.
- A deprecated work kind renders read-only — no editing, but existing data is shown in full.
- Required fields in the profile must get the `required` HTML attribute and the visible `*` marker.
- Field labels, help text, and placeholder text come from the i18n locale files, not the profile YAML itself.

---

## The review / curation workflow

The lifecycle transition for a Work from draft to public:

```
[draft] ──SubmitWork──► [submitted] ──PublishWork──► [public]
                              │
                       ReturnToDraft
                       (with curator reason)
                              │
                              ▼
                           [draft]
```

A review message thread records the back-and-forth between submitter and curator:
- `submitted` — cover note from submitter (optional)
- `review_comment` — curator or submitter comment during review
- `returned` — curator returned to draft with reason
- `published` — optional curator note on publish

In the UI: the deposit flow (`templates/biblio-researcher/deposit-1-0-find.html` through `deposit-4-review.html`) covers the **submitter side**. The **curator side** is prototyped in `templates/biblio-team/`.

---

## Surfaces

Two distinct user contexts. Must never be conflated. Determined by `data-surface` on the outermost layout element.

| Surface | `data-surface` value | Users | Primary task |
|---------|---------------------|-------|-------------|
| Public | `public` | Researchers, readers, the open web | Discovery, reading, citing |
| Backoffice | `backoffice` | Curators, librarians, depot workers | Data entry, curation, review |

---

## Page types — prototyped and still to do

### ~~Researcher profile page (public)~~ ✓ `templates/biblio-public/public-researcher-detail.html`
A public-facing page for a `PersonIdentity`. Shows: name, affiliation(s), linked works, ORCID and other identifiers. The A–Z researcher directory that links to these is `public-researchers.html`.

### ~~Organisation page (public)~~ ✓ `templates/biblio-public/public-organisation-detail.html`
A landing page for a faculty, department, or research group. Shows: name, hierarchy (parent org), linked works, linked projects, linked people. The organisation directory that links to these is `public-organisations.html`.

### ~~Project page (public)~~ ✓ `templates/biblio-public/public-project-detail.html`
A page for a funded research project. In progress. Shows: title, funder, period, PI and members, linked works. Connects to the Research Explorer. The project directory that links to these is `public-projects.html` (in progress).

### Curated list / collection page (public) — not yet prototyped
A named set of Works, editable by curators. Used for OAI-PMH sets, open access subsets, faculty publication feeds, heritage object collections, and reading lists. Backed by lists (user-curated) and work collections (administratively defined).

### Heritage / erfgoed object page (public) — not yet prototyped
Works from the Boekentoren erfgoedcollectie (manuscripts, maps, rare books, archival items). These may share the Work data model but have distinct display needs: high-resolution image viewer, physical location, digitisation status, loan requests, and provenance. The Boekentoren is an officially recognised Erfgoedbibliotheek — heritage display is a primary public mission, not an edge case.

### Candidate review (backoffice) — not yet prototyped
The inbox for harvested Work candidates. Filtering by source (WoS, ORCID), confidence, person, and organisation. Accept/reject actions with a reason. Reducing manual registration burden for researchers is an explicit UB2030 goal — this interface is doing strategic work.

### ~~Curator review queue (backoffice)~~ ✓ `templates/biblio-team/`
The curator-side view of the `submitted → public` workflow. Dashboard, queue overview (Wachtrij), single-record review with inline editing and AI suggestions, team health overview. Distinct from the researcher deposit flow.

### Proxy dashboard (backoffice) — not yet prototyped
The proxy-side view for managing deposits on behalf of one or more researchers. `templates/biblio-proxy/` directory exists; no templates yet.

---

## Open access as a design principle

The UB2030 plan takes a strong position: open access is the institutional default, not an option. Diamond OA (no cost to author or reader) is preferred over pay-to-publish. The UI must reflect this.

**In the deposit form:**
- Open access should be the pre-selected default, not one of three equal options
- The embargo path should be clearly available but not equal in visual weight to open access
- Restricted access should require a reason or at minimum feel like a deliberate choice, not the easy path

**In search and discovery:**
- OA status should be a prominent, early filter — not buried
- the open-access badge (`badge text-bg-success`) should be visually distinct and positive, not neutral
- Works without full-text access should not look broken — restricted access is sometimes correct, but the UI should make open access feel like the norm

---

## Content categories and their display differences

All research output is modelled as a single `Work` entity with a `kind` — not separate categories with separate UI sections. Some kinds have meaningfully different display needs. The authoritative list of kinds and their definitions lives in `raven/docs/raven-design.md`; it is not duplicated here.

Heritage objects in particular may need a distinct template — the Boekentoren erfgoedcollectie includes manuscripts, maps, and archival items where the primary experience is visual and physical provenance matters more than bibliographic metadata.

---

## Template-to-entity map

### Public — `templates/biblio-public/`

| Template | Entity / concept |
|----------|------------------|
| `public-index.html` | Public homepage |
| `public-works.html` | Work search + results |
| `public-work-detail.html` | Work detail page |
| `public-researchers.html` | Researcher directory (A–Z browse) |
| `public-researcher-detail.html` | Researcher profile (PersonIdentity) |
| `public-organisations.html` | Organisation directory |
| `public-organisation-detail.html` | Organisation landing page |
| `public-project-detail.html` | Project detail page (in progress) |
| `public-projects.html` | Project directory (in progress) |

### Researcher — `templates/biblio-researcher/`

| Template | Entity / concept |
|----------|------------------|
| `dashboard.html` | Researcher inbox + activity |
| `search-researcher.html` | My research output list |
| `search-filter-first.html` | Filter-first search exploration |
| `search-advanced-builder.html` | Advanced filter builder |
| `search-advanced-token.html` | Advanced filter token variant |
| `settings-profile.html` | Settings — own profile (display name, contact, language) |
| `settings-accounts.html` | Settings — connected accounts (ORCID, UGent login, WoS ResearcherID) |
| `settings-scope.html` | Settings — curation work scope (orgs + output types); curator/proxy only in production |
| `deposit-1-0-find.html` | Deposit step 1a — entry (blank) |
| `deposit-1-1-find.html` | Deposit step 1b — entry (pre-filled from import) |
| `deposit-2-upload.html` | Deposit step 2 — upload full text |
| `deposit-3-access-rights.html` | Deposit step 3 — OA + access rights |
| `deposit-4-review.html` | Deposit step 4 — review & submit |

### Curator / team — `templates/biblio-team/`

| Template | Entity / concept |
|----------|------------------|
| `my-queue.html` | Queue overview (Wachtrij) — personal scoped waiting list |
| `curate-detail.html` | Single-record review — inline edit, AI suggestions, return modal |
| `curate.html` | All research output (curator scope + flags) |
| `team-overview.html` | Team health overview — entry point for head of curation |

### Proxy — `templates/biblio-proxy/`

Directory exists; no templates yet. Proxy dashboard and deposit-on-behalf flow are still to be designed.

### Partials — `templates/partials/`

| Partial | Used by |
|---------|---------|
| `backoffice-header.html` | All backoffice templates |
| `main-sidebar.html` | All backoffice templates (researcher, curator, proxy) |
| `backoffice-facet-sidebar.html` | Search pages with filter sidebar |
| `search-suggest-panel.html` | Search autocomplete panel |
| `result-filter-bar.html` | Active filter chips bar |
| `public-header.html` | Public templates |
| `public-footer.html` | Public templates |
| `backoffice-footer.html` | Backoffice templates |
| `people-search-widget.html` | Deposit author search |
| `add-author-form.html` | Deposit author add form |
| `settings-sidebar.html` | All settings pages (section nav inside `u-main__sidebar`) |

**Vocabulary note:** All Work kinds are called **research output** in the UI. Do not use "publications" as a category label. Do not create a separate "Datasets" tab or navigation item — datasets are research output with `kind=dataset`. The work kind badge is how type is communicated, not separate nav sections.

---

## Status → badge mapping

| `status` | Badge | Colour |
|----------|-------|--------|
| `public` | `badge text-bg-success` | Green |
| `submitted` | `badge text-bg-info` | Blue |
| `draft` | `badge text-bg-warning` | Yellow |
| `deleted` | not rendered in normal lists | — |

| Visibility | Badge |
|------------|-------|
| `public` | `badge text-bg-success` |
| `restricted` | `badge text-bg-warning` |
| `private` | never listed publicly |

Work kind is always `badge text-bg-primary` (blue).

### Heritage / diamond OA badges

No verified badge classes exist yet for:
- Diamond OA (published via openjournals.ugent.be) — needs design
- Heritage object type — needs design

Do not invent class names for these. Flag as needing addition to SCSS when a template requires them.
