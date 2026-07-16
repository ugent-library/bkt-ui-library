# Search & filtering

The settled interaction model for the **public** search & filtering surface. Backoffice,
advanced, and expert search reuse the same primitives but expose more dimensions; they are
separate surfaces, deepened later and out of scope here.

For the component markup this composes, see the kit pages: `elements/search-bar.html`
(search form), `patterns/filter-picker.html` (Add-filter picker + editor + chips),
`patterns/facets.html` (sidebar checklists + ranges), `patterns/sidebar.html`
(navigation sidebar, a different component), and `patterns/search-and-filtering.html`
(this system, assembled).

The reasoning trail and open threads live in the local plans and reports (`notes/`, not
shipped): `PLAN-search-query-state.md`, `PLAN-public-works-parity.md`,
`REPORT-search-log-analysis.md`, `ARCHIVE-PLAN-filter-subsystem.md`, and
`ARCHIVE-PROPOSAL-panel-unification.md`. Those are gitignored, so this doc is the durable
record — the settled decisions survive here if the notes disappear.

---

## The five rules

Everything below follows from five rules. They define the public search surface;
backoffice / advanced / expert search reuse the same primitives and are deepened separately.

1. **The URL is the truth.** One canonical query state lives in the URL. The search box,
   the sidebar, the Add-filter picker, and the chip bar are all views onto that one
   state — server-derived in production, so they cannot drift.
2. **Search enters; filters narrow.** The search box takes you *into* a result space or
   *to* a record. Filters work *within* the result space you are already in. These are
   two different jobs and two different controls.
3. **A suggestion navigates to the record it names.** Pick a record → land on it; pick a
   topic → get the works about it. This is identical on every search box.
4. **The chip bar is the readout.** Applied filters surface as chips. The
   inputs are the sidebar and the picker; the chips report what those inputs produced.
5. **Dimension placement is decided by the shape of the dimension**, not by taste — a
   fixed taxonomy assigns every dimension a home (sidebar / picker / query box /
   backoffice).

---

## Rule 1 — the URL is the truth

The checked sidebar boxes, the chips, and the search box value are all derived from the URL
server-side, so the views are always consistent — there is no client-side source of truth
to keep in sync.

Every significant view is bookmarkable: a filtered, sorted, paginated result is a URL.
Use `hx-push-url` whenever a user would expect Back to work or want to bookmark the state.

---

## Rule 2 — search enters, filters narrow

The split is **enter vs. narrow-in-place**, not "box never touches filters".

The **search box navigates** — it takes you somewhere. Submitting typed text enters a
result space (`?q=`); selecting a suggestion goes to a record (Rule 3). The box is not a
*filter-within-results* field: typing in it does not trim the list you are currently
looking at. Any narrowing-in-place goes through the sidebar or picker and always leaves a
visible chip.

The **sidebar and the Add-filter picker narrow in place.** They add filter params to the
current URL, within the result space you are already in, and each one surfaces as a chip.

**The keyword/tag case — where the box does produce a filter param.** Selecting a
keyword or tag suggestion navigates to a works search *pre-scoped* by that value
(`?keyword=` / `?tag=`). That is a filter param, so the box's output and a filter param
do meet here — but it is still *entering* a scoped result space, not narrowing the current
one. It is the one forced exception in Rule 3 ("pick a topic → get the works about it"),
and the landed scope behaves like any other filter once you are there: it shows as a chip
and can be removed. A typed free-text query stays `?q=` and is never a filter (Rule 4).

Two scoped clears follow from this separation, each clearing only what sits next to it:

| Control | Location | Clears |
|---|---|---|
| Inline clear (×) | inside the search box | the query text (`q`) only; filters stay |
| **Clear all filters** | in the chip bar | every filter param; the query stays |

A full reset composes the two — so there is no third "reset everything" button. The inline
× shows only when the box is non-empty.

---

## Rule 3 — a suggestion navigates to the record it names

**What the box exposes: navigation shortcuts, never filter controls.** Suggestions are only
things you can *go to* — the four entity types (person, work, organisation, project) and
keyword/tag rows. Narrowing dimensions (Type, Access, Year, status) never appear as box
behaviours; they live in the sidebar and the picker. The dividing line is navigate vs.
narrow. This is why the dual-action autocomplete row (a suggestion with an extra "add as
filter" button) was rejected for public — it folds a filter control into the box.

Keywords qualify because they *navigate*, not narrow: a keyword names a set of works — a
topic — and "pick a topic → get the works about it" is the box's native job (it is what
submitting free text already does). A keyword suggestion is that same job pre-resolved to a
canonical value; it sends you *into* a scoped result space, it does not trim the list you
are on. A keyword *suggestion* in the box (navigation) is therefore fine; a keyword *facet*
in the box (narrowing) is not.

A suggestion takes you to the thing it names, routed identically on every search box.

| Row type | Destination | Why |
|---|---|---|
| Person | researcher detail page | a record you visit |
| Work | work detail page | a record you visit |
| Organisation | organisation detail page | a record you visit (its page lists/searches its own output) |
| Project | project detail page | a record you visit |
| Keyword / tag | scoped works search (`?keyword=` / `?tag=`) | names a *set of works*, so it resolves to those works — the one forced exception |
| Free text (Enter / Search) | works results (`?q=…`) | topical search enters the result space |

**Submit vs. select.** Pressing Enter or clicking Search always submits the typed text as
a free-text query to the results space, whether or not suggestions matched. Navigating to
an entity happens *only* by explicitly selecting a suggestion (click, or ArrowDown into a
row then Enter). The panel opens with nothing highlighted, so Enter always searches your
text. `suggest-panel.js` already behaves this way.

### Every box, one grammar

All four public search boxes obey the same two-part grammar, so they read as one system:

- **Select a suggestion → that entity's page** (same everywhere).
- **Submit the text → the result space of this box's scope.**

Only the submit-scope varies, and it equals the page the box is on:

| Box | Submit scope | Autocomplete |
|---|---|---|
| Works (landing + `public-works`) | all research output → works results (`?q=`) | cross-entity: people / works / orgs / projects / keywords, as navigation shortcuts |
| Researchers directory | researchers → filtered directory list | within-type (researchers only) |
| Organisations directory | organisations → filtered directory list | within-type (orgs only) |
| Projects directory | projects → filtered directory list | within-type (projects only) |

The works box searches all research output and returns a works list; its autocomplete
additionally surfaces people, orgs, projects, and keywords as navigation shortcuts, so
cross-entity discovery lives in the autocomplete and the entity directories. Directory
autocompletes stay within-type on purpose — "this box finds researchers" is worth more
than occasional cross-type convenience, and the omni-box already covers cross-entity.

There are no entity-scope tabs on the results page (Publications / Datasets / Authors /
Organisations / Projects re-running the query per type). A work's kind — **datasets
included** — is a Type facet value, not a separate surface, tab, or listing. Cross-entity
discovery is the autocomplete and the entity directories.

### Entity narrowing lives on the entity's own page

"Show me this org's / person's / project's output" is funnelled onto the entity **detail
page**, which is the scoped view. Those pages keep an embedded works listing with its
read/browse controls — work cards, sort, page size, pagination. What they do *not* carry is
the filter/analysis subsystem: narrowing by facet is delegated to the shared `public-works`
space via an explicit **Refine in search** action that pre-scopes by the entity
(`public-works.html?org=` / `?project=` / `?person=`). The entity scope lands there as an
applied chip, and the standard sidebar facets narrow further. One faceting engine, not a
copy per detail page.

---

## Rule 4 — the chip bar is the readout

Applied filters surface as chips: the visible output of the sidebar and the picker.

- Chips are **editable split chips** — the label reopens the editor, the × removes the
  filter. Markup and variants are in `elements/badges.html` and `patterns/filter-picker.html`.
- Display-only summaries are not removable and read as a soft, non-interactive badge.
- **The query is never a chip.** It lives in the box and is cleared by the box's inline ×.
- Sidebar tick ↔ chip appears; chip × ↔ sidebar unticks; both reflect the URL.

---

## Rule 5 — dimension placement

A dimension's shape decides its home. This is the taxonomy in full:

| Shape of dimension | Home | Examples |
|---|---|---|
| Closed, low-cardinality, broad, legible, discovery | **Sidebar checklist** | Access, Type, Language |
| Ordinal / continuous | **Sidebar range** | Year |
| High-cardinality *records* | **Add-filter picker + typeahead** | Author, Organisation, Project |
| Open concept / free vocabulary | **Query box** | topic |
| Curation / workflow / expert | **Not public** — backoffice / advanced / expert (surfaces TBD) | status, classification (A1/A2…), full-text version (COAR), subtype, tags, created/updated dates |

**Sidebar inclusion test.** A dimension earns a public sidebar slot only if it is: closed &
low-cardinality, countable per value, broad across research output, legible to a
non-expert, and discovery (not curation). A soft sixth test — *worth the space* — can demote
a qualifying-but-rarely-used facet.

**The search box holds the open concepts; the picker holds the record dimensions.** The box
still navigates (Rule 2); the picker is a separate, explicit input for high-cardinality
dimensions the sidebar cannot hold (author, journal, project, organisation — resolved by
typeahead).

### What is not public

Curation, workflow, and expert dimensions are deliberately kept off the public surface —
status, classification (A1/A2…), full-text version, subtype, research group, librarian tags,
created/updated dates — as is cross-tab / bulk / impact analysis. These belong to the
backoffice and advanced/expert search: separate surfaces that reuse the same primitives but
expose more dimensions. That some dimensions show in the backoffice and deliberately not on
public *is* the split — but the backoffice search UI itself is undecided and is deepened
elsewhere, not here.

**Access vs. version and classification (settled, prior sessions).** The public sidebar
carries only **Access** ("can I read it?"). **Full-text version** (the COAR published /
accepted / author-version distinction) and **classification** (A1/A2/… research-evaluation
tags) are backoffice + advanced/expert filters, not public discovery axes: version is a
repository-savvy distinction, shown per record on the work detail file line rather than as a
public facet, and classification is a curator tag. Publisher-side publication status is not
a separate axis — raven models it as `PublicationVersions`, which the full-text-version
filter surfaces. Indexing `publication_version` as a facet is raven work not yet done.

### How facets combine

Public facets use the standard discovery convention: **OR within a facet** (Type = Journal
article OR Dataset) and **AND across facets** (Type AND Year AND Access). There is no
user-facing boolean control on the public surface — this keeps the sidebar legible and
matches how comparable discovery layers behave. Choosing the operator (AND / OR / NOT) is an
advanced/expert affordance, not a public one.

### Identifier — one filter, scheme auto-detected

The picker's **Identifier** filter matches any value in the work's `identifiers` bag — DOI,
ISSN, ISBN, arXiv, handle — scheme auto-detected, not one filter per scheme. Filtering by a
journal works through its ISSN (searching a venue by name is unreliable; the ISSN is exact),
so there is **no separate Journal/venue filter**. The suggest panel additionally offers a
known-item shortcut — pasting a full DOI jumps straight to the work — but the filter is not
restricted to that.

---

## What the data supports (grounded against raven)

Which dimensions can be filtered depends on `raven` (work index, traits, facet config). The
split:

**Index-backed** (a real filter needs only a facet-config entry): Type (`work_type`), Year,
Access (`open_access` trait + `visibility`), Author (`contributor_person_ids` via person
typeahead), Identifier / DOI / ISSN (`identifiers`, scheme-scoped), and the free-text query
box (`primary`/`secondary`).

**Backend-dependent** (needs a raven field + index mapping + facet config first):
Organisation (the tree — institution / faculty / department / research group), Project,
Keyword/subject as a discrete facet, and Language (which also blocks the sidebar Language
facet). UGent config enables only
`work_type` publicly today, so promoting an index-backed dimension is a config edit; a
backend-dependent one is an index + config change. These land as raven issues.

---

## Evidence and audiences

The redesign is grounded in a query-log analysis (≈102M logged interactions over
2025-12 → 2026-07; `notes/REPORT-search-log-analysis.md`) and the tested personas
(`docs/RESEARCH-PERSONAS.md`). The findings that shape the rules:

- **Known-item, name-first.** Of genuine human searches, ~66% are a person's name and ~73%
  are known-item lookups; topical discovery is the minority (~20%). The flagship search job
  is **name → author**: a typed name should resolve to the researcher and their output.
  This is why a suggestion navigates to the record it names (Rule 3) — it serves the
  majority intent directly instead of dumping a hit list.
- **The simple box wins.** 98% of human searches use the simple box with bare keywords;
  the CQL query language and the advanced/expert tiers are, in practice, used far less.
  Invest in a fast, forgiving keyword box (ranking, typo tolerance, autosuggest).
- **Facets are a results-page behaviour.** Filter clauses appear in ~1% of typed searches
  but ~49% of results-page interactions. People search broadly, then narrow on the
  results page — which is exactly Rule 2 (search enters, filters narrow) and why the facets
  and picker live on the results page, never bolted onto the box.
- **The query permalink is a first-class surface.** ~63% of all traffic *arrives* on a
  query-result page from an external link, bookmark, or citation — a genuine long tail.
  Query URLs are durable, citable identifiers, which is the practical stakes of Rule 1
  (the URL is the truth): a filtered/sorted/paginated state must be a stable, shareable URL.
- **Advanced & expert search: low volume, high value.** Under 2% of humans use them, but a
  small group (curators, librarians, integrators) uses them heavily, and they power much of
  the inbound link traffic. Keep them as a stable machine/permalink contract *and* a
  maintained power-user tool — they are not to be degraded. What is not warranted is
  mass-market effort making CQL friendlier for the 98% who never touch it. Boolean
  operators (AND / OR / NOT) and curator analysis (cross-tab, bulk, impact) live here and in
  the backoffice / Power BI, not on the public discovery surface.

The audiences these serve, in one line each (full profiles in `docs/RESEARCH-PERSONAS.md`):

- **Sue Kerr — public discovery visitor.** Arrives deep-linked to one record from Google /
  Scholar, scans, grabs the PDF, leaves. Wants full text fast, a trustworthy version signal,
  one-click cite. The record page is the front door; discovery faceting must be quick and
  legible, not exhaustive.
- **Cody Crawley — machine reader (first-class).** Scholar indexing, OAI-PMH/Dublin Core
  harvesters, ORCID, citation managers. Needs semantic, machine-readable markup and stable
  deep links — a user requirement, not compliance polish.
- **Marie Curator — bibliographic reviewer.** *Lives in filters:* status, publication
  status, classification, faculty, type, year, locked. Wants year ranges, filter-on-missing,
  export to Excel, and shares filters via bookmarked URLs. This is the analysis surface that
  stays in the backoffice — the reason the public sidebar carries discovery axes only.
