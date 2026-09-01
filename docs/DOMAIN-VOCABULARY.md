# Domain vocabulary for raven / biblio.ugent.be

This file defines the shared language between the backend (`raven`) and the UI layer (`booktower-ui-library`). When working on either side, use these terms consistently. Do not invent synonyms.

---

## Core entities

### Work
The central entity. A publication, dataset, software, or other research output produced by one or more people. Every card, row, or detail page in the UI represents a Work.

- Stored as a raven record: a header envelope (id, type, `visibility`, `deposit_status`, timestamps) plus source-partitioned imported records. When sources identify the same Work, configured source precedence selects one complete source record for the projection; values are not mixed field by field (`raven/docs/architecture-overview.md`)
- Has a `kind` (see Work kind), a `deposit_status`, and a `visibility` (see Work status — two axes)
- The UI renders the selected projection with relations resolved (contributors, files, organizations, projects) — templates never join or reconcile sources
- A Work that never went public can be hard-deleted; once public it is only ever soft-deleted into a tombstone (see Deletion, withdrawal, retraction)

### Work kind
The research-output type. Determines which fields are active in the deposit form (profile-driven — see The profile system).

The authoritative list of work kinds lives in `raven/docs/raven-design.md`. It is not duplicated here, to avoid drift.

All kinds are collectively referred to as **research output** — not "publications" or "publications and datasets". The term "publications" is not used in the UI. This is intentional: new kinds may be added in the future without requiring a UI redesign.

In the UI: shown as a `badge text-bg-primary` badge and controls which form fields
appear. The deposit flow asks for evidence first — an identifier, source, file or
harvested Work — and lets the system infer the work kind where it can. Asking the
depositor to choose the kind is the fallback, not the first task.

### Accepted value and pending request

This flow is still experimental in both booktower-ui-library and Raven.

The record shows its **accepted values** — the values the Biblio team stands
behind, on the public site and in the backoffice. A researcher, proxy or curator
proposes a new value; that proposal is a **pending request**, and the Biblio team
accepts it, declines it or asks for clarification. A work can carry multiple
pending requests at once.

Pending requests do not alter the public surface. Public pages keep showing the last
accepted value until the Biblio team accepts the request. This is the workflow form of
`docs/RESPONSIBILITIES.md`: review follows responsibility, not the whole record.

### Policy-risk value

A policy-risk value decides whether Biblio can expose a file or object without legal,
contractual or institutional risk. Access level, licence, embargo, file version and
the four doctoral-thesis questions are policy-risk values.

When a depositor cannot answer a policy-risk question, the interface records the
uncertainty, applies the safest configured access state, and creates a review request.
The fallback state is still an open Biblio-team decision, informed by Open Science
Policy. Until it is settled, designs must show explicit unresolved access instead of
assuming closed, restricted or hidden.

### Work status — two axes

Raven models a work's state on two orthogonal axes (`raven/deposit_status.go`,
`raven/docs/architecture-overview.md`). One badge cannot say both things; backoffice
cards carry both.

**Deposit status** — the workflow state:

| `deposit_status` | Meaning |
|---|---|
| `draft` | Being prepared; editable by the owner |
| `submitted` | Handed to curation. Review follows submit whatever the visibility. Submit puts the record on the public site by default; the depositor can keep it off (see Record visibility) |
| `returned` | Sent back by a curator with a reason; owner edits and resubmits |
| `reviewed` | Curator stamped the editorial state. Terminal — there is no "published" status and no publish verb |

**Record visibility** — whether the record is on the public site, independent of
workflow. Raven values (`raven/visibility.go`) are `private`, `restricted`, and
`public`; only `public` puts a record on the public site. The badge reads that
outcome, never the stored value: `public` → **Public**, everything else →
**Private**.

Who moves visibility, mapped to raven's mechanisms:

- **A draft is never visible.** Raven enforces this at the database level
  (`records_draft_is_private`).
- **Submit puts the record on the public site by default.** The depositor can keep
  it off at submit, for research output metadata that can't be shown publicly.
  Review follows submit either way — it does not depend on visibility.
- **Return takes the record off the public site.**
- **Visibility persists through review.** Reviewed-and-private is a valid end state
  (confidential, on-file). A curator can change visibility at any time after
  draft — a late publication, or a takedown.
- **Trusted import sources seed visibility directly.** Harvested records never pass
  through submit.

The submit and return defaults are UGent deposit policy layered on raven's
independent axes: raven's `Submit` and `Return` move the workflow state, and
`SetVisibility` moves the visibility. How raven's duplicate gate (a move to
`public` is refused while a duplicate is unresolved), tombstones, merges and soft
deletes surface in the UI is parked for a later design pass.

**Do not confuse record visibility with file access.** Raven uses the same word and
vocabulary at two levels: the *record's* `visibility` says whether the record exists
on the public site; each *file's* `visibility` (plus embargo) says whether you can get
the full text or dataset. "Open access / Restricted" on a card is the file level, never
the record level.

An **external deposit's** access and embargo (data on Zenodo, EGA, …) still need
their own mapping in raven. The UI maps to that field once it lands.

In the UI (backoffice cards): deposit status is one badge — `draft` →
`badge text-bg-warning`, `submitted` → `badge text-bg-info`, `returned` →
`badge text-bg-danger`, `reviewed` → `badge text-bg-success`. Record visibility is a
separate neutral badge with an icon **and a visible label**: `if-eye Public` or
`if-eye-off Private` — the icon never stands alone. Public cards never show deposit
status or record visibility: a deliberate absence, the public card must not leak
workflow. File access renders as a plain `bt-work-card__meta-item` ("Open",
"Restricted", "Embargo <start date> – <end date> | Private [if-arrow-right] Open"),
never as a badge on the backoffice.

In the researcher view, a submitted work is awaiting review; its status reads
"Submitted". After review the list shows "Reviewed" — for now, researchers see all
four statuses on their own list.

### Messages on backoffice cards

Two blocks, split by audience — lines inside, never columns:

**For the researcher** — `alert alert-warning alert--sm`, visible to researcher *and*
curator. Lines, in order: automated missing items the researcher is accountable for;
the **Biblio message** (curator → researcher note); the "Complete metadata" call to
action. Examples include the file or external object, file-version/access-risk answers,
abstract, contributors, keywords, projects and licence, when the active work profile
and rules require them.

**For curators** — `alert alert-light alert--sm` with the `if-lock` icon, curator only.
Lines: automated missing items the Biblio team is accountable for; the **Internal
note** (curator → curators; old biblio: "Librarian message"). Examples include
container, publisher, date/year, ISSN/ISBN, volume, issue, pages and policy-rule
outcomes, when the active work profile and rules require them.

Where each text lives in raven:

- **The internal note** maps to raven's record notes: standing, per record,
  curator-only (`raven/note.go`, the `manage_notes` grant).
- **The Biblio message** is the comment on a workflow action: submit, return,
  review, or a requested change. A message always accompanies an action; there is
  no standing Biblio message for now. On a returned record it is the return
  reason — one text, one field.
- **"Additional information"** (e.g. "the physical book misses pages 12–14") is
  work metadata, not a message: raven's `notes` field on the work, where old
  biblio's AdditionalInfo migrates. It stays out of the message blocks.

In new responsibility-bounded workflows, missing policy-risk answers should become
pending requests rather than whole-record locks where possible.

"Complete metadata" opens the record's edit form. The researcher fast lane — an edit
view scoped to the missing fields — is a separate design, out of scope for the
work-card issues and not yet designed.

Missing metadata that affects card scanning can also appear where the value would
normally sit, as a compact metadata item: `Missing access`, `Missing year`, `Missing
pages`. The metadata-row marker is a locator, not the work list: the responsibility
block still carries the complete missing-items line and the action. Do not use this
pattern for the card's identity fields, such as title; those are prevented or handled
in the form/detail flow instead of turning the card title into "Missing title".
Public cards never show internal missing-metadata markers.

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
carries the notice).

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
A private, system-owned Work harvested from an external source and matched to a
researcher through their linked PersonIdentity. A Candidate is already a Work before
the researcher reviews it.

In the UI: **Found for you** on the researcher dashboard. **Review and add** claims
the existing Work as the researcher's draft and opens the prefilled deposit flow.
Before that action, dashboard **Review** or a candidate title opens the full candidate
without changing it. **Reject** removes only that researcher's match; **Skip** defers
it to the next review round. Neither action deletes the Work. The count reflects
pending matches for the current researcher.

### Direct-added Work
A Work added to a researcher's output without their action after authorship was
established. The current routes are an automated Plato import and addition by a
curator.

In the UI: the lightweight **Added for you** activity region on the researcher
dashboard. The entry names the source or actor; only automated imports carry the
system-added marker. The Work's state decides its action. An incomplete draft offers
**Complete** and remains under Incomplete work. A submitted or reviewed Work has no
completion action and opens through its title. **View all** opens the direct-added
state in My research output. The Work is not rejectable. **Not yours?** reports it to
the Biblio helpdesk from its detail and completion views without changing it.

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

### Numbers in the UI

- **Both surfaces** — European notation: a thin space groups every three digits, and a comma marks
  the decimal. "312&thinsp;000 results", "3&thinsp;300,3".
- Write the thin space as `&thinsp;`, which is what the kit uses today. It is a breaking space, so a
  long number can wrap between its groups. Holding the number together needs `&#8239;`, the narrow
  no-break space, instead. Which one we want is an open question.

### Names in the UI

- **One form on both surfaces** — first name, middle name initials then surname:
  "Mark B. De Moor". The backoffice's old sort-order form, "De Moor, B.",
  puts a comma inside the name while the comma is also what separates one
  name from the next, so a contributor line offers no way to tell where
  one person ends and the next begins.
- Sorting a list *by* surname is a different question from printing a name, and this
  rule settles only the printing. This is an open question.

## Access and file concepts

### Visibility
Describes who can access a file. Per-file, not per-work. Field and values are raven's (`raven/docs/metadata-work-fields.md` → Files); records carry their own `visibility` with the same values.

| Value | Label | Badge |
|-------|-------|-------|
| `public` | Open access | `badge text-bg-success` + `if-open-access` |
| `restricted` | public: "Restricted access"; backoffice: "Restricted" | `badge text-bg-secondary` + `if-lock` |
| `private` | backoffice: "Private" | never rendered on the public surface — not even a count |

Private files leave no public trace whatsoever: no count, no badge, no machine-facing output. Even revealing that a file *exists* is a patent risk (tech transfer). "All files private" renders identically to "no files".

Summary views (cards, table rows) render raven's derived **work access**, `Work.Access()` (`raven/work.go`): one exclusive state per work — `open`, `embargo`, `restricted` or `none` — read from full-text files and external full-text links, the most useful reader outcome first. The embargo badge names the lift date of the full-text file that decides the state. `none` renders no access element. Raven owns the derivation; the card shows the answer. This is a third mechanism beside record visibility and per-file visibility — three raven concepts, three card surfaces.

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
`deposit_reviewed`) changes the workflow state. Visibility is a separate axis with
its own defaults: submit puts the record on the public site unless the depositor
keeps it off, and return takes it off (see "Work status — two axes").

```
[draft] ──submit──► [submitted] ──review──► [reviewed]
                         │       (terminal)
                       return
                 (with curator reason)
                         │
                         ▼
                    [returned] ──resubmit──► [submitted]
```

Raven models only these four states. The pending request — a researcher or proxy
suggesting an edit, or a curator asking for one — is our design concept, defined
under "Accepted value and pending request": it runs beside the deposit status and
never moves it. The "Request changes" action creates one. Raven modelling is
planned.

A researcher edits their own record in two ways. When in draft, submitted or
returned: they edit it directly, whatever the record's visibility.
Once it is reviewed, they suggest a change, which becomes a pending request.
Raven grants owner edits on drafts and returned records today; whether the owner
also edits their own submitted record directly is still to clear out in raven.

Workflow transitions carry an optional free-text comment (raven's event `comment`
field) — the back-and-forth between submitter and curator rides on the events:
- `deposit_submitted` — cover note from the submitter (optional)
- `deposit_returned` — curator's reason for returning
- `deposit_reviewed` — optional curator note on review

In the UI: the deposit flow (`templates/biblio-researcher/deposit-1-0-find.html` through `deposit-4-review.html`) covers the **submitter side**. The **curator side** is prototyped in `templates/biblio-team/`.

---

## Surfaces

Two product layers, declared with `data-surface` on the outermost layout element.
The layer, not the user's role, determines the surface.

| Surface | `data-surface` value | Product layer |
|---------|----------------------|---------------|
| Public | `public` | Presents research-output metadata to the wider public |
| Backoffice | `backoffice` | Enters and manages research-output metadata and its workflow |

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

### ~~Candidate review (backoffice)~~ ✓ `templates/biblio-researcher/candidate-review.html`
The researcher reviews their matched Candidates one at a time through **Review and
add**, **Reject** and **Skip**. It reuses each harvested Work and does not assume a
curator candidate inbox. Claimed and rejected history lives in
`candidate-history.html`; the behavior draft is `docs/wip/CANDIDATES-FLOW.md`.

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
- **closed access belongs to backoffice, not to public** — it renders on a backoffice
  record page, with `if-forbid`, and backoffice cards. A card carries an access element
  only for an open, restricted or embargoed file on public; a work whose files are all
  closed shows none on public.
  The lock is restricted's; reusing it would say the two states are the same thing.
- Works without full-text access should not look broken — restricted access is sometimes
  correct, but the UI should encourage people to read what's available.

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
| `candidate-review.html` | Candidate review — one-at-a-time review (Found for you) |
| `candidate-history.html` | Review history — claimed and rejected candidates |
| `search-researcher.html` | My research output list |
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
| `people-search-widget.html` | Single-select person lookup shell (currently included nowhere — `add-author-form.html` carries its own copy) |
| `add-author-form.html` | Deposit author add form |
| `settings-sidebar.html` | All settings pages (section nav inside `u-main__sidebar`) |
| `filter-editor-templates.html` | Every node `filter-bar.js` clones — chip, four editor bodies, checklist row, picker tick |
| `filter-option-lists.html` | Stub option lists the filter bars offer (organization, project, keywords) |
| `people-picker-panel.html` | The shared people picker — checkable rich rows, cloned by the works Author filter and the query builder's Person condition |

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

Record visibility is a separate neutral badge on backoffice cards: `if-eye Public` /
`if-eye-off Private`.

Work access (raven's `Work.Access()`): on **public** cards a badge, and only open access carries colour — open →
`badge text-bg-success` + `if-open-access`, restricted → `badge text-bg-secondary` +
`if-lock`, embargo → `badge text-bg-secondary` + `if-time`, naming the date ("Embargo
until 1 May 2027"), closed → `badge text-bg-secondary`, text only. On **backoffice**
cards never a badge — a plain `bt-work-card__meta-item` ("Open", "Restricted",
"Embargo <start date> – <end date> | Private [if-arrow-right] Open" when both
dates and both access levels are available). The backoffice drops the noun so a
curator scans a column;
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
