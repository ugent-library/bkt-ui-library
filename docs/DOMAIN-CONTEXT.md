# Domain context for the UI layer

This file explains how the booktower-ui-library relates to the `bbl` backend — what the templates represent, how data flows into the UI, and what backend constraints shape UI decisions.

For entity definitions and shared vocabulary, see `DOMAIN.md`.

---

## What this repo is

A design system and HTML prototype environment. It produces:
1. `assets/booktower.css` — the design system stylesheet, consumed by the `bbl` Go application
2. HTML templates — living prototypes of real application pages, used for design and accessibility review before Go/templ implementation

The templates in `templates/` are **prototypes**, not production code. HTMX URLs are stubs. Data is hardcoded. They document intent and structure — the Go templ templates in `bbl/app/views/` are the production implementation.

---

## How CSS gets into bbl

Current process: copy `assets/booktower.css` and `assets/fonts/` into `bbl/app/assets/`. The font path in CSS is `/assets/fonts/` — the Go app must serve fonts there.

Future: npm package (not yet set up).

When you change SCSS here, the Go app needs an updated CSS file before the change is live. This is a manual step today.

---

## How templates map to Go templ components

Each HTML template in this repo has a corresponding templ template in `bbl/app/views/`. The HTML prototype is the reference for structure, class names, accessibility attributes, and HTMX patterns. The Go templ template is the production rendering.

When the prototype and the Go template diverge, the prototype is the design authority for HTML structure and accessibility. The Go template is the authority for data bindings and URL patterns.

---

## What the backend provides to templates

The `bbl` backend provides data to templates through the `doc jsonb` field on `bbl_works`. This is a pre-aggregated snapshot written on every save — contributors, files, organisations, projects — so templates do not need to make extra requests for this data.

For the backoffice list and public search, data comes from OpenSearch (eventually consistent — there is a short lag after a save before search results update). Post-save redirects go to the detail page, which is served directly from PostgreSQL and is always consistent.

**Practical implication for templates:** design for the data being present. Design empty states (`bt-blank-slate`) for when there is genuinely no data (no files, no keywords, no linked project), not for loading states caused by lag.

---

## Profile-driven forms

The deposit form does not have a fixed field list. Which fields appear, in what order, and whether they are required is determined by the work kind's profile (a YAML config file in `bbl`).

When prototyping a deposit form for a specific work kind:
- The fields shown in the prototype are illustrative — they represent a plausible profile for that kind
- Do not design form logic that assumes a fixed field set
- The "Type" step (work kind selection) always comes first — it determines which fields follow
- A changed work kind reloads the form section with a different field set (HTMX swap)

---

## Eventual consistency and search

The backoffice list and public search pages are powered by OpenSearch. Results reflect the state of the index, not the live database. After a curator saves a work, search results may take a few seconds to update.

The UI does not re-query search immediately after a save. It redirects to the detail page (PostgreSQL-backed, always current). Do not design search result pages to show a just-saved record as if it were instantly updated.

Facet counts (the numbers next to filter checkboxes) also come from OpenSearch aggregations. They are counts of indexed works, not live PostgreSQL counts.

---

## The two backoffice entry points

The backoffice has two distinct starting points depending on the user:

**Researcher / submitter view** — "My work". Scoped to the current user's own works and candidates suggested for them. Navigation: Research output, Datasets, Suggestions.

**Curator / librarian view** — institution-wide. Scoped to all works the curator has rights over (their org, their assigned projects, or globally). Navigation includes additional admin sections.

Templates should not conflate these. The sub-sidebar navigation (`bt-sub-sidebar`) differs between the two contexts.

---

## Candidate review queue

The "Suggestions" section in the backoffice sidebar shows Work candidates matched to the current user. A candidate is a possible publication harvested from an external source (WoS, ORCID) that has not yet been accepted or rejected.

Relevant UI states for a candidate:
- **Pending** — awaiting review. Shows preview metadata from the source.
- **Accepted** — a Work has been created from it. Link to the resulting Work.
- **Rejected** — dismissed. Shows tombstone with reject reason if one was given.

The candidate review UI is not yet prototyped.

---

## Person linking in the deposit form

When adding an author in the deposit form, the user may:
1. Search for and link a known UGent person (resolves to a `PersonIdentity`)
2. Enter a name manually (unlinked external author — valid, no identity needed)

An unlinked author is not an error state. It is normal for works with external co-authors. Do not design the form to treat missing identity links as incomplete.

A linked UGent author shows their affiliation (department). An unlinked author shows "External".

---

## File access and embargo in the deposit form

The deposit form's "Full text & files" section has three OA status options that correspond to `access_kind` on the file:

| Form label | `access_kind` value |
|------------|-------------------|
| Open access | `open` |
| Under embargo | `restricted` (with `embargo_until` set) |
| Restricted | `restricted` (no embargo date) |

When "Under embargo" is selected, a date picker must appear for the embargo lift date. The background job (Catbird) handles the transition automatically — the curator does not need to manually lift it.

---

## The public surface is strategically primary

The UB2030 plan makes clear that making research output open and discoverable to the world — not just to UGent staff — is a core institutional mission. The public surface of biblio.ugent.be is the primary interface for that mission.

This has practical consequences for UI work:
- The public search and detail pages deserve the same design rigour as the backoffice, not less
- Public pages are read by automated agents (crawlers, citation managers, reference tools) as well as humans — semantic correctness and structured data (`application/ld+json`) are interoperability requirements, not optional polish
- Performance and mobile usability matter on the public surface in a way they do not for the backoffice (staff use desktop, the open web does not)
- The public surface should be functional and meaningful without a login — anonymous access is the norm, not an edge case

---

## The heritage context

The Boekentoren is an officially recognised Erfgoedbibliotheek (heritage library) in Flanders. A significant portion of its public mission is making digitised heritage collections — manuscripts, maps, rare books, archival items — discoverable and reusable.

Heritage objects may share the `Work` data model but have distinct UI needs:
- High-resolution image viewing (IIIF or equivalent)
- Physical location and shelf mark
- Digitisation status (fully digitised, partial, not digitised)
- Loan request for museum exhibitions
- Provenance and ownership history
- Link to the Google Books digitisation where applicable

The Boekentoren has approximately 187,000 digitised items and 225,000 Google-digitised books. This is not a minor feature — it is a primary public collection. When designing public detail pages, do not assume all Works are journal articles. The heritage object display case may require its own template.

---

## What is not in scope for this repo

- Go templ template implementation (lives in `bbl/app/views/`)
- HTMX endpoint logic (lives in `bbl/app/*_handlers.go`)
- Database queries or mutations
- Authentication and permission enforcement
- Background job scheduling (Catbird)
- Search index management (OpenSearch)
