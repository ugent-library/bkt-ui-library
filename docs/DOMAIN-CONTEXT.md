# Domain context for the UI layer

This file explains how the booktower-ui-library relates to the `raven` backend — what the templates represent, how data flows into the UI, and what backend constraints shape UI decisions.

For entity definitions and shared vocabulary, see `DOMAIN-VOCABULARY.md`.
For field accountability, policy-risk values and review requests, see
`RESPONSIBILITIES.md`.

---

## What this repo is

A design system and HTML prototype environment. It produces:
1. `assets/booktower.css` — the design system stylesheet, consumed by the `raven` Go application
2. HTML templates — living prototypes of real application pages, used for design and accessibility review before Go/templ implementation

The templates in `templates/` are **prototypes**, not production code. HTMX URLs are stubs. Data is hardcoded. They document intent and structure — the Go templ templates in `raven` are the production implementation.

---

## How CSS gets into raven

Current process: copy `assets/booktower.css` and `assets/fonts/` into raven's assets directory. The CSS references the font by a relative URL (`fonts/icon-font.woff?HASH`), so the fonts must sit in a `fonts/` directory next to `booktower.css` — see `docs/CONSUMING-BOOKTOWER.md` for the exact layout.

Future: npm package (not yet set up).

When you change SCSS here, the Go app needs an updated CSS file before the change is live. This is a manual step today.

---

## How templates map to Go templ components

Each HTML template in this repo has a corresponding templ template in `raven`. The HTML prototype is the reference for structure, class names, accessibility attributes, and HTMX patterns. The Go templ template is the production rendering.

When the prototype and the Go template diverge, the prototype is the design authority for HTML structure and accessibility. The Go template is the authority for data bindings and URL patterns.

---

## What the backend provides to templates

The `raven` backend provides data to templates through the `doc jsonb` field on the works table. This is a pre-aggregated snapshot written on every save — contributors, files, organizations, projects — so templates do not need to make extra requests for this data.

When several imported sources identify the same Work, Raven selects one complete
source record according to configured source precedence. The projection does not mix
fields from several sources. Templates receive the selected projection; they do not
offer source selection or comparison.

For the backoffice list and public search, data comes from OpenSearch (eventually consistent — there is a short lag after a save before search results update). Post-save redirects go to the detail page, which is served directly from PostgreSQL and is always consistent.

**Practical implication for templates:** design for the data being present. Design empty states (`bt-blank-slate`) for when there is genuinely no data (no files, no keywords, no linked project), not for loading states caused by lag.

---

## Profile-driven forms

The deposit form does not have a fixed field list. Which fields appear, in what order, and whether they are required is determined by the work kind's profile (a YAML config file in `raven`).

When prototyping a deposit form for a specific work kind:
- The fields shown in the prototype are illustrative — they represent a plausible profile for that kind
- Do not design form logic that assumes a fixed field set
- The system asks for evidence before it asks for type: identifier, source, file or
  harvested Work. Work kind selection is the fallback when inference cannot decide
  enough.
- A changed work kind reloads the form section with a different field set (HTMX swap)

---

## Eventual consistency and search

The backoffice list and public search pages are powered by OpenSearch. Results reflect the state of the index, not the live database. After a curator saves a work, search results may take a few seconds to update.

The UI does not re-query search immediately after a save. It redirects to the detail page (PostgreSQL-backed, always current). Do not design search result pages to show a just-saved record as if it were instantly updated.

Facet counts (the numbers next to filter checkboxes) also come from OpenSearch aggregations. They are counts of indexed works, not live PostgreSQL counts.

---

## The two backoffice entry points

The backoffice has two distinct starting points depending on the user:

**Researcher / submitter view** — "My work". Scoped to the current user's own works and candidates found for them.

**Curator / librarian view** — institution-wide. Scoped to all works the curator has rights over (their org, their assigned projects, or globally).

Templates should not conflate these. All backoffice pages include one sidebar partial (`main-sidebar.html`); the nav groups it shows (My research output, Curation, Proxy) vary by the user's grants. In the prototype every group renders unconditionally to demonstrate the multi-role shell.

---

## Candidate review

**Found for you** shows private, system-owned Works harvested from an external source
and matched to the current user's linked PersonIdentity. A Candidate is already a
Work; review never creates a copy.

Match states, in the words the researcher sees:
- **New** — the match awaits a decision. Opening it changes nothing.
- **Skipped** — held for the next review round. New and Skipped together are the
  pending matches the dashboard counts and a round works through.
- **Added** — the researcher persisted something: **Add** submitted the Work, or
  **Save for later** and **Edit the full record** made it an Incomplete draft with
  **Resume**. The same Work, never a copy.
- **Rejected** — a broad disposition for a candidate that is not theirs, is a
  duplicate, or is better handled by another matched researcher. Only this
  researcher's match is dismissed; the Work is not deleted, merged or reassigned,
  and the overview offers Undo.

The Work is claimed on the first persisted action and never on opening, Skip or
Reject. Once one researcher claims a shared Candidate, matched co-authors stop seeing
it as a Candidate. They are told a co-author or the Biblio team added it and see the
Work in their research output once it is submitted; another owner's draft is never
linked.

**Added for you** is separate. It shows Works added without researcher action after
authorship was established: current Plato imports and Works added by a curator. Each
row names its source or actor; only automated imports carry the system-added marker.
It remains a lightweight activity region rather than a researcher task queue. The
Work's state decides whether it needs an action: an incomplete draft offers
**Complete** and also remains under Incomplete work; a submitted or reviewed Work is
informational and opens through its title. These Works are not rejectable. The Work
detail and completion views offer **Not yours?**, which uses the Biblio helpdesk route
while leaving the Work unchanged. **View all** opens the direct-added state in My
research output.

The draft topology and behavior live in `docs/wip/CANDIDATES-BREADBOARD.md`.

---

## Person linking in the deposit form

When adding an author in the deposit form, the user may:
1. Search for and link a known UGent person (resolves to a `PersonIdentity`)
2. Enter a name manually (unlinked external author — valid, no identity needed)

An unlinked author is not an error state. It is normal for works with external co-authors. Do not design the form to treat missing identity links as incomplete.

A linked UGent author shows their current affiliation (department), read from the person record. An unlinked author shows "External". The Work's own faculty attribution is the credited organization, fixed on the record (`DOMAIN-VOCABULARY.md`).

---

## File access and embargo in the deposit form

The deposit form's "Full text & files" section has three OA status options that correspond to `access_kind` on the file:

| Form label | `access_kind` value |
|------------|-------------------|
| Open access | `open` |
| Under embargo | `restricted` (with `embargo_until` set) |
| Restricted | `restricted` (no embargo date) |

When "Under embargo" is selected, a date picker must appear for the embargo lift date. The background job (Catbird) handles the transition automatically — the curator does not need to manually lift it.

Access level, licence, embargo, file version and the four doctoral-thesis questions
are policy-risk values. They decide public-access risk, not ordinary description. A
depositor who cannot answer must be able to record uncertainty. The accepted public
record keeps the last accepted value while the Biblio team reviews the pending
request; the unresolved fallback access state is still an open Biblio-team decision,
informed by Open Science Policy.

---

## The public surface is strategically primary

[UB2030](https://lib.ugent.be/en/info/ub2030/), the University Library's strategic plan, commits the library to "an active role in an open and fair knowledge landscape", to "repository-based Open Access and Diamond Open Access", and to "expanding its own digital infrastructure for the storage and management of research output, such as the Academic Bibliography". The link is the public landing page; the full document is internal.

That the public surface of biblio.ugent.be is therefore the primary interface for that mission is our design conclusion, drawn from those commitments rather than stated by UB2030.

UB2030 is library-wide. Biblio has its own strategy document, which is a separate source.

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

- Go templ template implementation (lives in `raven`)
- HTMX endpoint logic (lives in `raven`)
- Database queries or mutations
- Authentication and permission enforcement
- Background job scheduling (Catbird)
- Search index management (OpenSearch)
