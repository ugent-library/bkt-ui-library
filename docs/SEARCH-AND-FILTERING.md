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

### State transitions

- **A new query keeps the active filters.** Changing the search text — including fixing
  a typo — re-runs within the current filters rather than clearing them; `q` and the
  filter params are orthogonal. A clean slate is a deliberate act, via the box's × or
  "Clear all filters".
- **Changing a filter or the sort resets to the first page** — a page number is only
  meaningful against a fixed, ordered set. Sort and page-size selections are preserved
  across filter changes, and sort across a page-size change; only explicit pagination
  moves off page one.
- **Filtering updates in place; a facet toggle doesn't reposition the page.** On desktop,
  real-time filtering — results update as you select, the persistent sidebar and the
  user's scroll position staying put — is Baymard's documented standard; ticking several
  boxes in a row (e.g. multiple languages low in the sidebar) must not scroll the page. On
  mobile, Baymard instead recommends an explicit "Show X results" apply button, *because*
  live updates cause disorienting refreshes mid-interaction — so the mobile tray batches
  changes behind Apply (a Step-8 / mobile-pass concern). Scroll-to-top belongs to
  pagination or a new query, not to filter toggles — that half is convention, not cited.
  ([Baymard, *Ecommerce Filter UI*](https://baymard.com/learn/ecommerce-filter-ui).)

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
| Journal / host title (a link on cards and record pages — not a box suggestion) | identifier-scoped works search (`?issn=` / `?isbn=`) | names a *set of works* — the keyword logic applied to a venue; lands as an Identifier chip (Rule 5) |
| Free text (Enter / Search) | works results (`?q=…`) | topical search enters the result space |

**Submit vs. select.** Pressing Enter or clicking Search always submits the typed text as
a free-text query to the results space, whether or not suggestions matched. Navigating to
an entity happens *only* by explicitly selecting a suggestion (click, or ArrowDown into a
row then Enter). The panel opens with nothing highlighted, so Enter always searches your
text. `suggest-panel.js` already behaves this way.

### Scoped links on cards and record pages

The same routing governs the links inside result cards and work detail pages: an author
name goes to the researcher page, a keyword badge to the keyword-scoped works search, a
journal/host title to the identifier-scoped works search (its ISSN/ISBN). These
link-follows are the measured volume path of results-page refinement — author ~199k,
keyword ~252k, journal ~204k sessions over seven months of live logs (Evidence below) —
so every one of them must be a working link, never decorative text. Publisher/platform
names (e.g. Zenodo) are not a public scope and stay unlinked.

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
a qualifying-but-rarely-used facet. **Language currently holds its slot on parity alone**:
the live facet drew 349 uses / 322 sessions in seven months of logs (measured 2026-07-21) —
a dropping candidate, decided with post-launch usage data. Research discipline already fell
to the same test (see below).

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

### Keywords vs. Research discipline — two dimensions, not one (settled)

The old "Keywords / subject" picker item conflated two dimensions with different shapes.
**Keywords** are an open, high-cardinality vocabulary: a **picker filter** (backend-dependent,
not indexed yet). **Research discipline** (raven `research_disciplines`) is a closed
taxonomy, so its home — if it ever ships publicly — is a **sidebar checklist**, never the
picker.

Research discipline is **cut from the public surface** (M, 2026-07-21): no sidebar facet,
not shown on detail pages. Grounds: the live Subject facet drew 392 uses / 269 sessions in
seven months of query logs (~0.03% of results-page interactions) — it fails the "worth the
space" test — and the vocabulary itself needs review before any public display (the scheme —
UGent categories / Frascati / OECD / ANZSRC — is raven config and a policy decision). The
review flag lives as a comment on the work detail page, where the data would first
resurface. Revisit only after the vocabulary review, with post-launch usage data.

### How facets combine

Public facets use the standard discovery convention: **OR within a facet** (Type = Journal
article OR Dataset) and **AND across facets** (Type AND Year AND Access). There is no
user-facing boolean control on the public surface — this keeps the sidebar legible and
matches how comparable discovery layers behave. Choosing the operator (AND / OR / NOT) is an
advanced/expert affordance, not a public one. (AND across filter types, OR within a
type's options is Baymard's stated filter-logic rule — [Baymard, *Ecommerce Filter UI*](https://baymard.com/learn/ecommerce-filter-ui).)

### Facet counts — drill-down

The count beside each value is a **drill-down** count: it reflects the current query
plus the *other* applied facets — "add this and you'd get N" — not the global result
set. This prevents dead-ends, where a global count promises a number the combination
can't deliver. By the OR-within rule, a facet's counts are computed with **that
facet's own selection excluded**, so selecting one value never shrinks the other
values in the same facet — you can still see and add them. This is the standard
OpenSearch faceted-navigation pattern (post-filter aggregations). Note it is **more
expensive** — one aggregation pass per facet, each with a different filter set — a
real but standard cost.

Evidence: Baymard calls a per-option count one of the single highest-impact filter
improvements — it tells users the selection will return results, heading off zero-result
dead-ends ([Baymard, *Ecommerce Filter UI*](https://baymard.com/learn/ecommerce-filter-ui)).
The self-excluding drill-down mechanism itself is the standard OpenSearch faceting pattern,
not a Baymard prescription.

### Filters don't disappear at zero

A facet value or filter option stays present even when the current combination would
return zero results for it — options never silently vanish as the user narrows. An
already-applied filter is likewise never auto-dropped to dodge an empty result: the
system honours it and shows the zero-results state. (How a zero-count value is shown —
greyed, disabled, or a plain "0" — is an implementation detail; that it *stays* is the
rule.)

Facet values are ordered by count, most first; a **selected value stays put** — it does
not reshuffle or drop under a "More" collapse.

The dead-end-avoidance principle is Baymard's — a silently-zero result is a dead-end to
prevent or offer recovery from ([*Ecommerce Filter UI*](https://baymard.com/learn/ecommerce-filter-ui)).
That page doesn't prescribe the exact zero-count treatment; keeping the value visible
rather than removing it is our choice, for list stability.

### Identifier — one filter, scheme auto-detected

The picker's **Identifier** filter matches any value in the work's `identifiers` bag — DOI,
ISSN, ISBN, arXiv, handle — scheme auto-detected, not one filter per scheme. Filtering by a
journal works through its ISSN (searching a venue by name is unreliable; the ISSN is exact),
so there is **no separate Journal/venue filter**. The suggest panel additionally offers a
known-item shortcut — pasting a full DOI jumps straight to the work — but the filter is not
restricted to that. Journal/host titles on cards and record pages link into this filter
(`?issn=` / `?isbn=` → an applied Identifier chip) — see Rule 3, Scoped links.

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
Keywords as a discrete filter, Research discipline (`research_disciplines`), and Language
(which also blocks the sidebar Language facet). UGent config enables only
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
- **Refinement is a results-page behaviour — and it is mostly scoped links, not facets**
  *(corrected 2026-07-21)*. Filter clauses appear in ~1% of typed searches, so narrowing
  happens after arrival (Rule 2 stands). But the per-field split shows the ~49% of
  results-page interactions carrying filter clauses is almost entirely **link-follows** —
  clicking an author (~199k sessions / 7 months), keyword (~252k), or journal title
  (~204k) on a record, which re-runs a scoped query. That is Rule 3's navigate-to-scope
  behaviour, and it is the volume path. True checklist-facet usage is minuscule (type 477
  sessions, year 779, subject 269, language 322 over 7 months — upper bounds). Consequence:
  wiring author / keyword / journal links to their scoped views outranks facet-rail polish;
  the sidebar stays small and every facet must re-earn its slot from post-launch usage.
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

## Mobile — one Filters tray (settled; do not reopen)

On small screens **every filter input collapses into a single Bootstrap Offcanvas "Filters"
tray**: the sidebar facets (Access / Type / Year / Language) and the record-dimension picker
(Author, Organisation, Project, Keywords, Identifier — as drill-ins) live together in the one
sheet. The chip bar stays the readout *above* the results (Rule 4). The only filter-adjacent
controls kept out of the tray are **Sort** and **results-per-page**, surfaced as pills in the
results header. This was evaluated against a Vinted-style horizontal filter-pill bar and
settled in favour of the tray — **do not reopen without new evidence.**

Why the tray, not a pill bar and not two separate entry points:

- **Mobile faceted search wants a tray, not a separate screen (NN/g).** The effective mobile
  pattern is an *overlay tray* of the filter controls over the results — Amazon and eBay
  converged on it — because a separate filter *screen* forces "pogo-sticking" between filters
  and results. Keep the **result count always visible** and label it with the plain word
  "Filter" / "Refine", never a cryptic icon. This is exactly the offcanvas tray we ship.
  <https://www.nngroup.com/articles/mobile-faceted-search/>
- **Horizontal filter-pill rows have poor discoverability (Baymard).** Users routinely
  overlook anything past the right edge of a horizontally-scrolled row, so a pill scroller is
  a shortcut for one or two top filters *at most*, never the whole mechanism. Our
  high-cardinality record dimensions (Author, Organisation, Project, Keyword, Identifier)
  would scroll off-screen and be missed — so they belong in the tray, not a pill bar.
  *(Baymard mobile-filtering research; attributed from prior study — live search was
  unavailable when this was noted.)*
- **One canonical state (Rule 1).** A pill bar plus a separate sheet would be two competing
  filter inputs; one tray keeps a single input surface and preserves chip-bar-as-readout.
- **Refinement is a results-page behaviour (query log, Evidence above — corrected
  2026-07-21).** Filter clauses appear in ~1% of typed searches; narrowing happens after
  arrival, and measured checklist-facet usage is small — so the mobile filter surface
  should be a lightweight, discoverable results-page tray, not a heavy separate screen,
  more syntax, or anything that competes with the scoped links on the cards.

Pills (Sort + the couple of common facets) are a deliberate *garnish* layered on the tray,
never the primary mechanism.
