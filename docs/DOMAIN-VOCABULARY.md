# Domain vocabulary for raven / biblio.ugent.be

This file defines the shared language between the backend (`raven`) and the UI layer (`booktower-ui-library`). When working on either side, use these terms consistently. Do not invent synonyms.

---

## Core entities

### Work
The central entity. A publication, dataset, software, or other research output produced by one or more people. Every card, row, or detail page in the UI represents a Work.

- Stored as a raven record: a header envelope (id, type, `visibility`, `deposit_status`, timestamps) plus source-partitioned fields that reconcile into one projection (`raven/docs/architecture-overview.md`)
- Has a `kind` (see Work kind), a `deposit_status`, and a `visibility` (see Work status — two axes)
- The UI renders the reconciled projection with relations resolved (contributors, files, organizations, projects) — templates never join
- A Work that never went public can be hard-deleted; once public it is only ever soft-deleted into a tombstone (see Deletion, withdrawal, retraction)

### Work kind
The publication type. Determines which fields are active in the deposit form (profile-driven — see The profile system).

The authoritative list of work kinds lives in `raven/docs/raven-design.md`. It is not duplicated here, to avoid drift.

All kinds are collectively referred to as **research output** — not "publications" or "publications and datasets". The term "publications" is not used in the UI. This is intentional: new kinds may be added in the future without requiring a UI redesign.

In the UI: shown as a `badge text-bg-primary` badge and controls which form fields appear.

### Work status — two axes

Raven models a work's state on two orthogonal axes (`raven/deposit_status.go`,
`raven/docs/architecture-overview.md`). One badge cannot say both things; backoffice
cards carry both.

**Deposit status** — the workflow state:

| `deposit_status` | Meaning |
|---|---|
| `draft` | Being prepared; editable by the owner |
| `submitted` | Handed to curation. UGent decision: visibility goes `public` on submit — review happens after publication |
| `returned` | Sent back by a curator with a reason; owner edits and resubmits |
| `reviewed` | Curator stamped the editorial state. Terminal — there is no "published" status and no publish verb |

**Record visibility** — whether the record is on the public site, independent of
workflow. Raven values (`raven/visibility.go`): `private` (owners only), `restricted`
(institution), `public` (world). Reviewed-and-private is a valid end state (embargoed,
on-file, confidential — e.g. metadata that cannot be shown).

**Do not confuse record visibility with file access.** Raven uses the same word and
vocabulary at two levels: the *record's* `visibility` says whether the record exists
on the public site; each *file's* `visibility` (plus embargo) says whether you can get
the full text or dataset. "Open access / Restricted" on a card is the file level, never
the record level.

In the UI (backoffice cards): deposit status is the one badge — `draft` →
`badge text-bg-warning`, `submitted` → `badge text-bg-info`, `returned` →
`badge text-bg-danger`, `reviewed` → `badge text-bg-success` — and record visibility is
an icon **with a visible label** inside that badge: `· if-eye Public` or
`· if-eye-off Not public` — the icon never stands alone. Public cards never show deposit status or record visibility: a deliberate absence, the public card must not leak workflow. File access renders as a
plain `bt-work-card__meta-item` ("Open access", "Restricted", "Embargo until
<date>"), never as a badge on the backoffice.

Record-level `restricted`: a work that must be deposited but whose
metadata cannot be revealed publicly — recorded, not exposed. On cards it renders as
"Not public"; there is no third rendering. Open: the value's *name* — `restricted`
collides with restricted file access; a raven naming question.

Open questions: what a researcher sees between submit and review; and — since
visibility and workflow are separate axes, returning a record does not change its
visibility — whether policy wants an automatic visibility flip on return.

### Messages on backoffice cards

Two blocks, split by audience — lines inside, never columns:

**For the researcher** — `alert alert-warning alert--sm`, visible to researcher *and*
curator. Lines, in order: automated missing items from the researcher list (full text,
DOI/WoS, title, abstract, authors, keywords, projects); the **Biblio message**
(curator → researcher note); the "Complete metadata" call to action.

**For curators** — `alert alert-light alert--sm` with the `if-lock` icon, curator only.
Lines: automated missing items from the curator list (journal, publisher, year, ISSN,
volume, issue, pages); the **Internal note** (curator → curators; old biblio:
"Librarian message").

The researcher fast lane behind "Complete metadata" (edit view scoped to the missing
fields) has no screens yet — `notes/TOPLAN.md`, Backoffice.

### Deletion, withdrawal, retraction

Raven has no deletion *status* and no `delete_kind`. Its model
(`raven/docs/architecture-overview.md`): a record that never went public is
**hard-deleted** (the row disappears — nobody holds a citable URL); a record that was
once public is **soft-deleted into a tombstone** (`DeletedAt`/`DeletedBy`, optionally
`replaced_by` for merge redirects). Tombstones exist for permalink resolution and
OAI-PMH deleted headers; normal reads and lists exclude them.

The old biblio reasons — `withdrawn` (author request), `retracted` (integrity),
`takedown` (legal) — have no raven counterpart yet. Scholarly *retraction* is not
deletion: a retracted article stays public with a retraction notice (an editorial
state). **Retraction will be built in raven; the timing is open** —
the prototype designs ahead: a retracted work carries `badge text-bg-danger`
"Retracted" on public and backoffice cards (the work stays public; the detail page
carries the notice). See `notes/TOPLAN.md`, Backoffice.

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

### Organization
An institutional entity (faculty, department, research group, university). Hierarchical — an org can be `part_of` another, with temporal bounds on that relationship.

In the UI: shown as metadata on the detail page sidebar, as affiliation labels on contributors in the deposit flow, and as a facet filter in the backoffice list.

### Project
A funded research project (e.g. an FWO or BOF grant). Has start/end dates and can have person–project roles (PI, co-PI, researcher).

In the UI: linked from Work detail pages. Searchable as a filter in the backoffice. A work can be linked to multiple projects.

### User
An application account. May be linked to a PersonIdentity (most staff users) or not (admin/service accounts). Has a global role: `admin` or `user`. Curation rights are expressed through Grants, not the role field alone.

### Grant
A permission record. One row = one permission for one user over one scope. A user's full access picture is one query on the grants table. Grants can be global, org-scoped, project-scoped, or entity-level.

In the UI: not directly visible to end users, but determines which action buttons appear (edit, submit, review, delete). There is no publish action — visibility, not a publish verb, decides exposure.

### Candidate
A possible Work collected by an automated harvester (Web of Science, ORCID, arXiv, etc.). Not a Work until explicitly accepted by a curator or the submitting researcher.

In the UI: the "Suggestions" section in the backoffice sidebar. Shown as a review queue — accept or reject. The badge count on "Suggestions" reflects pending candidates matched to the current user's works or organization.

### Revision and events
One transaction boundary in the audit trail. Every record-touching write runs through raven's `Revise`; one revision id stamps every event the write produced (`record_created`, `record_updated`, `deposit_submitted`, `deposit_returned`, `deposit_reviewed`, `visibility_changed`, `file_embargo_lifted`, …). Events carry the actor and an optional free-text comment — the workflow back-and-forth rides on them.

In the UI: surfaces as a change history view on a Work detail page (who changed what, when), and as the review-message thread on deposit transitions.

---

### Dates in the UI

- **Public surface** — human-readable: "5 August 2026". Public work cards carry no
  metadata timestamps; the only dates on them are the reference line's own and the
  embargo badge's release date.
- **Backoffice surface** — `dd/mm/yyyy hh:mm`, built for scanning.
- **The backoffice card logs three moments**: who created the metadata and when;
  who last changed it and when; and, where the record was also touched by the
  system (an import, a background job), the last system change and when.

## Access and file concepts

### Visibility
Describes who can access a file. Per-file, not per-work. Field and values are raven's (`raven/docs/metadata-work-fields.md` → Files); records carry their own `visibility` with the same values.

| Value | Label | Badge |
|-------|-------|-------|
| `public` | Open access | `badge text-bg-success` + `if-open-access` |
| `restricted` | public: "Restricted access"; backoffice: "Restricted" | `badge text-bg-secondary` + `if-lock` |
| `private` | backoffice: "Private" | never rendered on the public surface — not even a count |

Private files leave no public trace whatsoever: no count, no badge, no machine-facing output. Even revealing that a file *exists* is a patent risk (tech transfer). "All files private" renders identically to "no files".

In summary views (cards, table rows), show the most permissive visibility across all files on the work. Where every file is embargoed, show the earliest release date among the deposited files — the full text, the dataset, the software — not supplementary material.

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

The deposit workflow (raven events: `deposit_submitted`, `deposit_returned`,
`deposit_reviewed`). Submit sets visibility `public` (UGent decision); review stamps
the editorial state afterwards.

```
[draft] ──submit──► [submitted] ──review──► [reviewed]
                         │       (terminal)
                       return
                 (with curator reason)
                         │
                         ▼
                    [returned] ──resubmit──► [submitted]
```

Workflow transitions carry an optional free-text comment (raven's event `comment`
field) — the back-and-forth between submitter and curator rides on the events:
- `deposit_submitted` — cover note from the submitter (optional)
- `deposit_returned` — curator's reason for returning
- `deposit_reviewed` — optional curator note on review

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

### ~~Organization page (public)~~ ✓ `templates/biblio-public/public-organisation-detail.html`
A landing page for a faculty, department, or research group. Shows: name, hierarchy (parent org), linked works, linked projects, linked people. The organization directory that links to these is `public-organisations.html`.

### ~~Project page (public)~~ ✓ `templates/biblio-public/public-project-detail.html`
A page for a funded research project. In progress. Shows: title, funder, period, PI and members, linked works. Connects to the Research Explorer. The project directory that links to these is `public-projects.html`; its list cards reuse the Projects-panel card source from the researcher detail prototype.

### Curated list / collection page (public) — not yet prototyped
A named set of Works, editable by curators. Used for OAI-PMH sets, open access subsets, faculty publication feeds, heritage object collections, and reading lists. Backed by lists (user-curated) and work collections (administratively defined).

### Heritage / erfgoed object page (public) — not yet prototyped
Works from the Boekentoren erfgoedcollectie (manuscripts, maps, rare books, archival items). These may share the Work data model but have distinct display needs: high-resolution image viewer, physical location, digitisation status, loan requests, and provenance. The Boekentoren is an officially recognised Erfgoedbibliotheek — heritage display is a primary public mission, not an edge case.

### Candidate review (backoffice) — not yet prototyped
The inbox for harvested Work candidates. Filtering by source (WoS, ORCID), confidence, person, and organization. Accept/reject actions with a reason. Reducing manual registration burden for researchers is an explicit UB2030 goal — this interface is doing strategic work.

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
- the open-access badge (`badge text-bg-success` + `if-open-access`) should be visually distinct and positive, not neutral
- **only open access carries colour.** Restricted and embargo are neutral badges
  (`badge text-bg-secondary`), told apart by icon: `if-lock` for restricted, `if-time` for
  embargo (which names the date). They are correct outcomes, not warnings — the orange
  `text-bg-warning` they used to wear read as an error and competed with open access
- **closed access carries no icon** — `badge text-bg-secondary`, text only.
  The lock is restricted's; reusing it would say the two states are the same thing
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
| `public-organisations.html` | Organization directory |
| `public-organisation-detail.html` | Organization landing page |
| `public-project-detail.html` | Project detail page (in progress) |
| `public-projects.html` | Project directory |

### Researcher — `templates/biblio-researcher/`

| Template | Entity / concept |
|----------|------------------|
| `dashboard.html` | Researcher inbox + activity |
| `search-researcher.html` | My research output list |
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
| `public-header.html` | Public templates |
| `public-footer.html` | Public templates |
| `backoffice-footer.html` | Backoffice templates |
| `people-search-widget.html` | Deposit author search |
| `add-author-form.html` | Deposit author add form |
| `settings-sidebar.html` | All settings pages (section nav inside `u-main__sidebar`) |

**Vocabulary note.** **Work** is the model — raven's entity, its `/works` routes and API. **Research output** is the UI copy, in both languages: *research output* / *onderzoeksoutput*, the word UGent's library already uses with researchers. A template saying "research outputs" over a `/works` route is correct, not drift.

All Work kinds are called **research output** in the UI. Do not use "publications" as a category label. Do not create a separate "Datasets" tab or navigation item — datasets are research output with `kind=dataset`. The work kind badge is how type is communicated, not separate nav sections.

**A list says what it is a list of.** Counts, pagination labels, filter and export actions name the entity on screen: `Showing 1–20 of 84 projects`, `aria-label="Researchers pagination"`, "Filter research outputs", "Export research outputs". A count is a count of something, and naming it means a label still makes sense read on its own — which is how a screen-reader user meets it, and how an export button is read before the file arrives.

Count noun: **research outputs**, plural. "Research output" stays the singular collective for the category (a heading, a nav item, a type label); counting items pluralises it.

Two places keep "results", because the entity is already there or would be repeated to no purpose:

- **Facet value counts** — `aria-label="Open access (142 results)"`. Thirty values per sidebar, each already labelled; "142 research outputs" thirty times is noise for anyone listening to it.
- **Suggest-panel tabs and other places the label names the entity already** — "People, 12 results", not "People, 12 people".

A zero state is copy, not a count: "No results for … with these filters" is about the search coming back empty, and reads better than the entity name.

---

## Status → badge mapping

| `deposit_status` | Badge | Colour |
|----------|-------|--------|
| `draft` | `badge text-bg-warning` | Yellow |
| `submitted` | `badge text-bg-info` | Blue |
| `returned` | `badge text-bg-danger` | Red |
| `reviewed` | `badge text-bg-success` | Green |

Record visibility rides *inside* the deposit-status badge as icon + visible label
(backoffice cards): `· if-eye Public` / `· if-eye-off Not public`. Record-level `restricted` (institution)
awaits the issues discussion before it gets its own rendering.

File access: on **public** cards a badge, and only open access carries colour — open →
`badge text-bg-success` + `if-open-access`, restricted → `badge text-bg-secondary` +
`if-lock`, embargo → `badge text-bg-secondary` + `if-time`, naming the date ("Embargo
until 1 May 2027"), closed → `badge text-bg-secondary`, text only. On **backoffice**
cards never a badge — a plain `bt-work-card__meta-item` ("Open access", "Restricted",
"Embargo until <date>"). The backoffice drops the noun so a curator scans a column;
the public card keeps "Restricted access", which is what a reader outside academia
understands.

Work kind is `badge text-bg-primary` (blue) on record pages; on cards it is a plain
`bt-work-card__meta-item`, so the badge slot stays access (public) or deposit status
(backoffice).

### Heritage / diamond OA badges

No verified badge classes exist yet for:
- Diamond OA (published via openjournals.ugent.be) — needs design
- Heritage object type — needs design

Do not invent class names for these. Flag as needing addition to SCSS when a template requires them.
