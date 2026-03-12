# Domain vocabulary for bbl / biblio.ugent.be

This file defines the shared language between the backend (`bbl`) and the UI layer (`booktower-ui-library`). When working on either side, use these terms consistently. Do not invent synonyms.

---

## Core entities

### Work
The central entity. A publication, dataset, software, or other research output produced by one or more people. Every card, row, or detail page in the UI represents a Work.

- Stored in `bbl_works`
- Has a `kind` (see Work kind) and a `status` (see Work status)
- Metadata lives in `attrs jsonb` on the database row
- Display data (contributors, files, organisations, projects) is aggregated into `doc jsonb` — this is what the UI renders, no joins required
- A Work is **never hard-deleted** once it has been public; it can only be withdrawn, retracted, or taken down

### Work kind
The publication type. Determines which fields are active in the deposit form (profile-driven — see The profile system).

Known kinds: `journal_article`, `book`, `book_chapter`, `dataset`, `software`, `conference_paper`, `dissertation`, `report`, `preprint`

All kinds are collectively referred to as **research output** — not "publications" or "publications and datasets". The term "publications" is not used in the UI. This is intentional: new kinds (e.g. `educational_material`, `patent`) may be added in the future without requiring a UI redesign.

In the UI: shown as a `badge bg-primary` badge (`Journal article`, `Dataset`, etc.) and controls which form fields appear.

### Work status
The lifecycle state of a Work.

| Status | Meaning | Who sees it |
|--------|---------|-------------|
| `draft` | Created, not yet submitted | Owner and curators only |
| `submitted` | Submitted for review | Owner and curators |
| `public` | Published and visible | Everyone |
| `deleted` | Withdrawn, retracted, or taken down | Curators only (tombstone) |

In the UI: shown as a badge. `draft` → `badge bg-warning` (yellow). `submitted` → `badge bg-info` (blue). `public` → `badge bg-success` (green). `deleted` is not shown in normal lists.

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
A Person as they appear on a specific Work. Carries: display name, role (`author`, `editor`, `translator`, …), affiliation at time of work, and optionally a link to a PersonIdentity.

Ordered by `pos` (fracdex) — order is semantically meaningful (author order on a paper matters).

In the UI: rendered in `card-authors` on cards, and as the editable people list in the deposit flow. UGent-affiliated contributors are distinguished from external ones.

### Organisation
An institutional entity (faculty, department, research group, university). Hierarchical — an org can be `part_of` another, with temporal bounds on that relationship.

In the UI: shown as metadata on the detail page sidebar, as affiliation labels on contributors in the deposit flow, and as a facet filter in the backoffice list.

### Project
A funded research project (e.g. an FWO or BOF grant). Has start/end dates and can have person–project roles (PI, co-PI, researcher).

In the UI: linked from Work detail pages. Searchable as a filter in the backoffice. A work can be linked to multiple projects.

### User
An application account. May be linked to a PersonIdentity (most staff users) or not (admin/service accounts). Has a global role: `admin` or `user`. Curation rights are expressed through Grants, not the role field alone.

### Grant
A permission record. One row = one permission for one user over one scope. A user's full access picture is one query on `bbl_grants`. Grants can be global, org-scoped, project-scoped, or entity-level.

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

### Access kind
Describes who can access the full text of a file. Access is **per-file**, not per-work.

| Value | Label | Badge |
|-------|-------|-------|
| `open` | Open access | `badge-oa` |
| `restricted` | Restricted | `badge-restricted` |
| `closed` | Closed | no badge shown |

In summary views (cards, table rows), show the most permissive access level across all files on the work.

### Embargo
A file can be under embargo: restricted now, automatically becoming open after `embargo_until`. The transition is applied by a background job. In the deposit form: the submitter chooses "Under embargo" as the OA status and sets a release date. After the embargo lifts, the dates are kept as a bibliographic record.

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

In the UI: the deposit flow (`templates/deposit-flow.html`) covers the **submitter side**. The **curator side** (review queue, approve/return actions, message thread) is not yet prototyped in the UI library.

---

## Surfaces

Two distinct user contexts. Must never be conflated. Determined by `data-surface` on the outermost layout element.

| Surface | `data-surface` value | Users | Primary task |
|---------|---------------------|-------|-------------|
| Public | `public` | Researchers, readers, the open web | Discovery, reading, citing |
| Backoffice | `backoffice` | Curators, librarians, depot workers | Data entry, curation, review |

---

## Page types not yet prototyped

These are first-class UI destinations implied by the domain model and the UB2030 strategic plan. They do not exist as templates yet but must be treated as real pages when designing.

### Researcher profile page (public)
A public-facing page for a `PersonIdentity`. Shows: name, affiliation(s), linked works, ORCID and other identifiers. Distinct from the backoffice person edit view. Strategic priority — open science means making researchers and their output discoverable, not just searchable.

### Organisation page (public)
A landing page for a faculty, department, or research group. Shows: name, hierarchy (parent org), linked works, linked projects, linked people. Supports the cluster model in UB2030 where library services are organised by campus cluster, not individual faculty.

### ~~Project page (public)~~ ✓ `templates/project.html`
A page for a funded research project. Shows: title, funder, period, PI and members, linked works. Connects to the Research Explorer. Important for grant reporting and societal impact visibility.

### Curated list / collection page (public)
A named set of Works, editable by curators. Used for OAI-PMH sets, open access subsets, faculty publication feeds, heritage object collections, and reading lists. Backed by `bbl_lists` (user-curated) and `bbl_work_collections` (administratively defined).

### Heritage / erfgoed object page (public)
Works from the Boekentoren erfgoedcollectie (manuscripts, maps, rare books, archival items). These may share the Work data model but have distinct display needs: high-resolution image viewer, physical location, digitisation status, loan requests, and provenance. The Boekentoren is an officially recognised Erfgoedbibliotheek — heritage display is a primary public mission, not an edge case.

### Candidate review (backoffice)
The inbox for harvested Work candidates. Filtering by source (WoS, ORCID), confidence, person, and organisation. Accept/reject actions with a reason. Reducing manual registration burden for researchers is an explicit UB2030 goal — this interface is doing strategic work.

### Curator review queue (backoffice)
The curator-side view of the `submitted → public` workflow. Shows submitted works awaiting review, with approve/return actions and the review message thread. Not yet prototyped. Distinct from the researcher deposit flow.

---

## Open access as a design principle

The UB2030 plan takes a strong position: open access is the institutional default, not an option. Diamond OA (no cost to author or reader) is preferred over pay-to-publish. The UI must reflect this.

**In the deposit form:**
- Open access should be the pre-selected default, not one of three equal options
- The embargo path should be clearly available but not equal in visual weight to open access
- Restricted access should require a reason or at minimum feel like a deliberate choice, not the easy path

**In search and discovery:**
- OA status should be a prominent, early filter — not buried
- `badge-oa` should be visually distinct and positive, not neutral
- Works without full-text access should not look broken — restricted access is sometimes correct, but the UI should make open access feel like the norm

---

## Content categories and their display differences

All research output is modelled as a `Work` with a `kind`, but some categories have meaningfully different display needs:

| Work kind | Display specifics |
|-----------|------------------|
| `journal_article` | Journal title, volume, issue, pages, DOI prominent |
| `book`, `book_chapter` | ISBN, publisher, edition; chapter shows parent book |
| `dataset` | Repository link, data format, licence, reuse instructions |
| `software` | Repository URL (GitHub etc.), version, language |
| `dissertation` | Degree, supervisor, institution, embargo common |
| `conference_paper` | Conference name, location, proceedings |
| `report` | Issuing body, report number |
| `preprint` | Server (arXiv, bioRxiv), version number |
| Heritage object kinds | Physical location, digitisation status, image viewer, loan request |

All of the above are **research output**. The table shows display differences within a single unified entity — not separate categories with separate UI sections.

Heritage objects in particular may need a distinct template — the Boekentoren erfgoedcollectie includes manuscripts, maps, and archival items where the primary experience is visual and physical provenance matters more than bibliographic metadata.

---

## Template-to-entity map

| Template | Entity / concept | Surface |
|----------|-----------------|---------|
| `templates/backoffice-search.html` | Work list, search, facets | Backoffice |
| `templates/research-detail.html` | Work detail page | Public |
| `templates/deposit-flow.html` | Work create/edit (deposit) | Backoffice |
| `templates/public-search.html` | Work search | Public |
| `templates/public-index.html` | Public homepage | Public |
| `patterns/research-card.html` | Work card component | Both |
| `patterns/deposit-components.html` | Deposit form components | Backoffice |
| `templates/project.html` | Project detail page | Public |
| `patterns/sidebar.html` | Sub-sidebar nav | Backoffice |

**Vocabulary note:** All Work kinds are called **research output** in the UI. Do not use "publications" as a category label. Do not create a separate "Datasets" tab or navigation item — datasets are research output with `kind=dataset`. The work kind badge (`Dataset`, `Journal article`, etc.) is how type is communicated, not separate nav sections.

---

## Status → badge mapping

| `status` | Badge | Colour |
|----------|-------|--------|
| `public` | `badge bg-success` | Green |
| `submitted` | `badge bg-info` | Blue |
| `draft` | `badge bg-warning` | Yellow |
| `deleted` | not rendered in normal lists | — |

| Access kind | Badge class |
|-------------|-------------|
| `open` | `badge-oa` |
| `restricted` | `badge-restricted` |
| `closed` | no badge |

Work kind is always `badge bg-primary` (blue).

### Heritage / diamond OA badges

No verified badge classes exist yet for:
- Diamond OA (published via openjournals.ugent.be) — needs design
- Heritage object type — needs design

Do not invent class names for these. Flag as needing addition to SCSS when a template requires them.
