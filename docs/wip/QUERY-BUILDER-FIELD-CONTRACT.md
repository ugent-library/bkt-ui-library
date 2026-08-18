# Query builder field contract - draft

*Companion to [`QUERY-BUILDER-DESIGN.md`](QUERY-BUILDER-DESIGN.md),
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md), and
[`SEARCH-AND-FILTERING.md`](../SEARCH-AND-FILTERING.md). This is a Booktower draft of the
field contract the advanced search builder needs. It is intended to move to raven once the
field and URL grammar decisions are accepted there.*

## Sources

This contract is grounded in:

- Raven implementation: `app/search.go`, `app/search_filter_options.go`,
  `app/search_directories.go`, `app/backoffice.go`, `search.go`, and the
  `opensearchindex/*` document builders.
- Raven metadata docs: `docs/metadata-work-fields.md`,
  `docs/metadata-work-types.md`, `docs/metadata-organization-fields.md`,
  `docs/metadata-project-fields.md`, `docs/metadata-overview.md`, and
  `docs/architecture-overview.md`.
- Booktower search docs: [`SEARCH-AND-FILTERING.md`](../SEARCH-AND-FILTERING.md) and the
  query-builder wip set.
- Evidence notes: `notes/REPORT-search-log-analysis.md`,
  `notes/_powerquery/golden-queries.json`, and
  [`QUERY-BUILDER-GOLDEN-SET-METHOD.md`](QUERY-BUILDER-GOLDEN-SET-METHOD.md).

## Contract rules

The builder authors **research output** queries. The first surface is **public advanced
search**; the same field registry should be usable by Raven's backoffice later, with
surface-specific exposure.

Each row has one field, one operator, and one value input. Top-level rows combine with AND.
`is any of` is the one phase-1 OR shape: it stores several values for the same field in one
row. A second row for the same field is still a second AND condition, so two Contributor rows
mean co-contributor, not "either contributor."

Raven's current public works URL is `q` plus repeated filter params such as
`type=journal_article&year=2020`. It does not yet serialize every builder shape. In the table,
`URL param` means the target stable name, not that the current public URL already supports the
operator. `Current` means Raven already parses the public works URL into a `SearchOpts` filter
for that field today. `Needs Raven` means the metadata exists or the evidence demands it, but
the query-builder contract needs a Raven field, index mapping, filter definition, or URL grammar
decision.

Common operator meanings:

| Operator | Meaning | Query model |
|---|---|---|
| `contains` | text contains the entered words | text query or field-specific text query |
| `is` | exactly one selected value | one terms filter |
| `is not` | excludes one selected value | negated terms filter |
| `is any of` | matches any value in one pasted/selected list | one terms filter with several terms |
| `is before` / `is after` | date or year comparison | inclusive or exclusive range |
| `is between` | bounded date or year interval | range with two bounds |
| `is present` / `is absent` | field has at least one matching value | presence query or derived trait |

## Phase-1 fields

| id | label | surface | meaning | Raven source | URL param | index/filter field | value type | operators | selector type | multi-value behavior | examples | open questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `any` | Any field | public advanced; later backoffice | Free-text search across the work search document. Covers legacy `basic` and bare text submitted to a power form. | `workDoc.primary` and `workDoc.secondary`; Raven `SearchOpts.Query` | `q` | text query, not a filter field | text | `contains`; `contains any of` for imported OR text phrases | text input; pasted lines become a value list only for `contains any of` | Multiple Any field rows are AND conditions. A value list is OR within this field. | `basic = TEXT`; `PERSON_1`; `basic = TEXT AND affiliation any "ORG_1"` | Field-specific text query URL grammar is separate from `q`; decide whether Any field is the only free-text field that maps to `q`. |
| `title` | Title | public advanced; later backoffice | Words in the work title. Covers legacy `title`. | `Work.Title`; indexed today as boosted `workDoc.primary` and `sort_title`, not as a field-specific text filter | `title` | Needs Raven: field-specific title search | text | `contains`, `is`, `is any of` | text input; paste supported | Value list is OR within title. Repeated rows are AND. | `title = TEXT`; `title exact TEXT`; `title any "TEXT"` | Decide whether `is` means exact normalized title or quoted phrase. |
| `abstract` | Abstract | public advanced; later backoffice | Words in work abstracts. | `Work.Abstracts`; indexed today in `workDoc.secondary`, not as a field-specific text filter | `abstract` | Needs Raven: field-specific abstract search | text | `contains`, `contains any of` | text input; paste supported | Value list is OR within abstract. | `abstract = TEXT`; `abstract all "TEXT"` | Decide whether legacy `all` becomes `contains all words` or is normalized to `contains`. |
| `contributor` | Contributor | public advanced; backoffice | A linked person contributing to the work, in any contributor role by default. Covers legacy `author`, `editor`, and `promoter` through role narrowing where needed. | `Work.Contributors`; person IDs indexed as `workDoc.contributor_person_ids`; roles live on the contributor data but are not indexed today | `contributor`; current public alias: `author` | current public filter: `author` -> `contributor_person_ids`; proposed stable filter: `contributor` | Person record ID | `is`, `is not`, `is any of` | person typeahead; paste list of IDs | `is any of` is OR. Separate Contributor rows are AND, preserving co-author queries. | `author = PERSON_1`; `editor exact PERSON_1`; `promoter exact PERSON_1`; `author exact PERSON_1 AND author exact PERSON_2` | Decide stable URL name: keep `author` for compatibility or move builder output to `contributor`. Role-specific filtering needs role-aware index support. |
| `contributor_role` | Contributor role | public advanced if role narrowing ships; backoffice | Narrows a Contributor row to author, editor, thesis advisor, or another configured contributor role. This is not a standalone field. | `Work.Contributors[].Roles`; role vocabulary from Raven work config | row option under `contributor` | Needs Raven: role-aware contributor filtering | configured role token | `is`, `is any of` | select inside the Contributor row | Several roles on one Contributor row are OR. | legacy author/editor idiom: `author=X or (type any "bookEditor issueEditor" and editor=X)` becomes `contributor is X, role is any`. | Decide whether phase 1 ships role narrowing or treats all person conditions as any-role. |
| `organization` | Organisation | public advanced; backoffice | The organization credited with the work. Public selection expands descendants when searching but keeps the selected organization in the URL. Covers part of legacy `affiliation`. | `Work.CreditedOrganizations`; `Organization.parent` for descendant expansion | `organization`; legacy alias: `affiliation` | current public filter: `organization` -> `organization_ids`; option counts expand via Repo descendants | Organization record ID | `is`, `is not`, `is any of` | organization typeahead/tree picker | Value list is OR across selected organization subtrees. Separate rows are AND. | `affiliation any "ORG_1"`; `affiliation <> ORG_1` | Decide whether legacy `affiliation` also needs contributor-affiliation semantics distinct from credited organization. |
| `project` | Project | public advanced; backoffice | A project the work is an output of. | `Work.ProducingProjects`; Project metadata in `metadata-project-fields.md` | `project`; legacy alias: `project.id` | current public filter: `project` -> `project_ids` | Project record ID | `is`, `is not`, `is any of` | project typeahead; paste list of IDs | Value list is OR. Separate rows are AND. | `project.id exact PROJECT_1`; `project any "PROJECT_1 ... _189"` | None for phase 1 if `project` stays the stable name and `project.id` is translator-only. |
| `keyword` | Keyword | public advanced; backoffice | Free author keywords on the work. Covers legacy `keyword` and `subject` for migrated public search. | `Work.Keywords`; normalized into `workDoc.keywords` | `keyword`; legacy alias: `subject` | current public filter: `keyword` -> `keywords` | normalized text token | `is`, `is not`, `is any of`, `contains` for option search | keyword typeahead/token input; paste list | Value list is OR. Values normalize with Raven `NormalizeSearchTerm`. | `keyword exact KEYWORD_1`; `subject = KEYWORD_1`; machine `keyword exact KEYWORD_1` | Decide whether `subject` ever maps to `research_disciplines` in a separate migration context, or is always a legacy alias for keywords in the builder. |
| `identifier` | Identifier | public advanced; backoffice | Any work identifier Raven recognizes: DOI, ISBN, ISSN, arXiv, Handle, PubMed, WoS, ESCI, repository accessions, and configured authority IDs. Covers legacy `doi`, `issn`, `identifier`; can cover legacy `id` when the value is a migrated biblio identifier. | `Work.Identifiers`; Raven scheme recognizers canonicalize values | `identifier`; aliases: `doi`, `issn`, `id` where applicable | current public filter: `identifier` -> `identifiers` | identifier string; optional recognized scheme | `is`, `is not`, `is any of` | identifier input with paste list and scheme recognition | Value list is OR. Recognized values expand to canonical `scheme:value` and value terms where Raven does so. | `doi = DOI_1`; `issn exact ISSN_1`; `identifier any "ID_1 ... _200"` | Decide whether Raven record IDs get a separate `record_id` field; current `identifier` is about metadata identifiers, not necessarily Raven `records.id`. |
| `record_id` | Raven record ID | backoffice; public only for translator/permalink compatibility if needed | Exact Raven record ID lookup. Legacy `id` batches may be biblio IDs rather than Raven IDs. | `Header.ID`; indexed as document `id` | `id` or `record_id` | Needs Raven: explicit filter definition for `id` where the builder uses it | Raven ID / migrated biblio ID | `is`, `is any of` | paste list | Value list is OR; observed batches reach 763 values and 9,336 characters. | `id any "ID_1 ... _763"` | Decide whether public builder exposes this, or only the translator accepts it. Long lists need a saved-search or short-id answer before launch. |
| `work_type` | Type | public advanced; backoffice | Raven's work type catalog. Covers legacy `type`, `articletype`, `misctype`, and `conferencetype` through migration mapping. | `Work.WorkType`; catalog in `metadata-work-types.md` | `type`; current public URL also accepts `work_type` as input but echoes `type` | current public filter: `work_type`; current URL label: `type` | closed work-type token | `is`, `is not`, `is any of` | multi-select checklist | Value list is OR. Separate rows are AND. | `type any "journalArticle"`; `misctype any "report"`; `conferencetype any "proceedingsPaper"` | Decide whether legacy subtype fields are translator-only aliases or visible helper filters in the builder. |
| `year` | Publication year | public advanced; backoffice | Year derived from the work's canonical fuzzy date. | `Work.Date`; indexed as integer `workDoc.year` | `year`, `year_from`, `year_to` today; builder grammar TBD | current public filter/range: `year` | four-digit year | `is`, `is not`, `is any of`, `is before`, `is after`, `is between` | year input; range pair for between; paste list for `is any of` | Value list is OR. A row may combine exact years and a range only when imported from current public facets; builder should keep one shape per row. | `year exact 2020`; `year >= 2015`; `year >= 2015 AND year <= 2020`; `year any "2020 ..."` | Decide exclusive vs inclusive wording for legacy `<` / `>` because Raven `RangeFilter` is inclusive today. |
| `language` | Language | public advanced; backoffice | Content language of the work. | `Work.Languages`; normalized to base language codes in `workDoc.languages` | `language` | current public filter: `language` -> `languages` | normalized language code | `is`, `is not`, `is any of` | language select/token picker | Value list is OR. Values normalize with Raven `NormalizeLanguageCode`. | `language any "eng"`; `language <> eng` | Decide display code vocabulary: Raven stores normalized base codes while UGent config uses legacy three-letter main language codes in forms. |
| `access` | Full-text access | public advanced; backoffice | Exclusive public-discovery access state derived from hosted full-text files and external full-text links: open, embargo, restricted; metadata-only exists but is not offered as a public facet value. Covers legacy `file.access`, `accesslevel`, and part of `external`/`embargo`. | `Work.Access()` derives from `Work.Files` and `Work.Links`; `WorkAccessFacetValues` | `access`; aliases: `file.access`, `accesslevel` | current public filter: `access` | closed token: `open`, `embargo`, `restricted` | `is`, `is not`, `is any of` | select/checklist | Value list is OR. `open OR embargo` means either state. | `file.access exact open`; `file.access <> open`; `accesslevel any "open"` | Decide whether "metadata only" becomes a builder value even though it is not a public facet value. |
| `has_full_text` | Has full text | public advanced; backoffice | Whether the work has hosted or external full text. Plain-language boolean companion to Access. | Derived from `Work.Access()`; `open`, `embargo`, and `restricted` mean yes; `none` means no | `has_full_text` | Needs Raven: derived filter or trait | boolean | `is` | yes/no segmented control | No value list. Multiple rows are invalid. | `file.access exact open`; `file <> FILE_1` only partly overlaps | Decide whether this replaces or supplements Access in phase 1. |
| `embargo` | Embargo | public advanced if exposed; backoffice | Whether the work has full text scheduled to become public after embargo. | Derived by `Work.Access() == embargo`; file fields `lift_embargo_on` and `visibility_after_embargo` carry the underlying detail | `embargo` | current via `access=embargo`; standalone field needs Raven alias | boolean or access token | `is` | yes/no segmented control | No value list. | `embargo exact 0`; `embargo = 0` | Decide whether Embargo is a separate builder field or an Access value only. |
| `publication_version` | Full-text version | public advanced; backoffice | Version of a hosted full-text file: author, accepted, published, updated. | `File.PublicationVersion`; vocabulary `PublicationVersions` | `publication_version`; legacy alias: `file.publicationversion` | Needs Raven: file-version index/filter | closed token | `is`, `is not`, `is any of` | select/checklist | Value list is OR across file versions. | `file.publicationversion exact publishedVersion` | Public search doc keeps full-text version out of the public sidebar; decide whether advanced public search may expose it. |
| `classification` | Classification | public advanced if exposed; backoffice | Scheme-tagged categorization on a work, including UGent research-evaluation tags such as A1. | `Work.Classifications`; scheme vocabularies in Raven config | `classification` | Needs Raven: classification index/filter; likely scheme-qualified | scheme + value term | `is`, `is not`, `is any of` | select with scheme grouping | Value list is OR within the same scheme unless scheme-qualified values allow mixed lists. | `classification any "A1"`; `classification <> A1`; `vabb_approved exact 1` | Exposure is a policy/team decision. Decide scheme qualification in URL so `A1` cannot collide across schemes. |
| `publication_status` | Publication status | public advanced if exposed; backoffice | Publisher-side publication state from the legacy query language. In Raven this appears to map to file/work publication-version data rather than a standalone work field. | No standalone Raven work field found; publication versions are file-level | `publication_status` | Needs Raven source decision | closed token | `is`, `is not`, `is any of` | select | Value list is OR. | `publication_status exact published`; `publicationstatus any "published"` | Decide the Raven concept: file publication version, a classification scheme, or translator-only legacy alias. |
| `external` | External output | public advanced if exposed; backoffice | Legacy boolean for output whose content lives outside the repository. Raven models external content as identifiers or links rather than mirrored files. | `Work.Identifiers`, `Work.Links`, and file absence; no single Raven field found | `external` | Needs Raven: derived trait/filter | boolean | `is` | yes/no segmented control | No value list. | `external exact 0`; `external exact 0 AND file.access exact open` | Define the Raven meaning before exposing: external record, external full text, no hosted file, or migrated legacy flag. |
| `container` | Journal, book, proceedings, venue | public advanced; backoffice | The host publication or venue a work appears in. Covers legacy `parent` and `publication`; journal/host links are high-volume scoped navigation. | `Work.Container()` over `journal_title`, `book_title`, `proceedings_title`, `magazine_title`, `newspaper_title`, `venue`; `Work.ContainerIdentifier()` for ISSN/ISBN where present | `container`; aliases: `parent`, `publication` | Needs Raven: container text and/or identifier filter | text or identifier-backed value | `contains`, `is`, `is not`, `is any of` | text input with optional identifier recognition | Text list is OR. Exact journal filtering should prefer identifiers when available. | `parent exact JOURNAL_1`; `publication exact JOURNAL_1`; `issn exact ISSN_1` | Decide whether container search is text-on-name, identifier-only for journals, or a two-part selector that stores identifier when known and text otherwise. |
| `publisher` | Publisher | public advanced; backoffice | Publishing house, issuing institution, or platform-like publisher where Raven stores it as publisher. | `Work.Publisher`; type-specific field | `publisher` | Needs Raven: publisher index/filter | text | `contains`, `is`, `is not`, `is any of` | text input/typeahead if Raven builds values | Value list is OR. | `publisher = PUBLISHER_1`; machine `publisher exact PUBLISHER_1` | Decide how this relates to `container` for online posts and platforms. |
| `conference` | Conference | public advanced if exposed; backoffice | Conference name/location/date bundle for conference outputs. | `Work.Conference` struct on conference work types | `conference` | Needs Raven: conference text index/filter | text | `contains`, `is` | text input | Value list optional only after evidence. | `conference = CONF_1` | Decide which subfields are searched and displayed as the value label. |
| `created_at` | Date created | backoffice; public advanced only if accepted | Raven record creation date, used in legacy power queries. | `Header.CreatedAt` | `created_at`; legacy alias: `datecreated` | Needs Raven: indexed date/range filter | year or date | `is before`, `is after`, `is between` | date or year range | No value list in phase 1. | `datecreated >= 2024`; `datecreated <= 2024` | Decide whether this belongs on public advanced search or only backoffice/translator. |
| `visibility` | Record visibility | backoffice | Raven record visibility. Not a public discovery field because public works search always filters to public records. | `Header.Visibility`; indexed as `visibility`; backoffice facet config includes it | `visibility` | current backoffice filter: `visibility` | closed token: `private`, `restricted`, `public` | `is`, `is not`, `is any of` | select/checklist | Value list is OR. | backoffice facet, no public golden authored case | Backoffice-only; translator should not let a public URL reveal non-public records. |
| `deposit_status` | Deposit status | backoffice | Work deposit workflow: draft, submitted, returned, reviewed. | `Header.DepositStatus`; indexed as `deposit_status`; backoffice facet config includes it | `deposit_status` | current backoffice filter: `deposit_status` | closed token | `is`, `is not`, `is any of` | select/checklist | Value list is OR. | backoffice facet | Backoffice-only unless a public legacy permalink needs a safe reviewed-only translation. |
| `copyright_statement` | Copyright statement | public advanced if exposed; backoffice | Rights statement or license/copyright state. | `Work.License`, `File.License`, `OtherLicense`; license vocabulary in `metadata-work-fields.md` | `copyright_statement`; legacy alias: `copyrightstatement` | Needs Raven: source and index decision | closed license/rights token | `is`, `is not`, `is any of` | select/checklist | Value list is OR. | `copyrightstatement any "STATEMENT_1"` | Decide whether this is work-level license, file-level license, or a legacy translator-only field. |
| `jcr_category` | Journal metric category | public advanced if Raven carries it; backoffice | Journal metrics category used by legacy power queries. | No Raven field found in current metadata docs | `jcr_category`; legacy alias: `jcr.category` | Needs Raven source, if exposed | closed category token | `is`, `is any of` | typeahead/select | Value list is OR. | machine `jcr.category exact CATEGORY_1` | Expose only if Raven carries the field and the team accepts the public surface. |
| `jcr_impact_factor` | Journal impact factor | backoffice | Numeric journal metric used by one observed human query. | No Raven field found in current metadata docs | `jcr_impact_factor`; legacy alias: `jcr.impact_factor` | Needs Raven source, if exposed | decimal number | `is more than`, `is less than`, `is between` | numeric input/range | No value list in phase 1. | `jcr.impact_factor > 5` | Backoffice only (2026-08-18): the backoffice reuses this builder with more fields, and the impact factor is one of them. Still needs a Raven source. |

## Translator-only aliases and rejected fields

These legacy names must not crash the translator, but they are not builder fields unless Raven
assigns them a real concept:

| legacy name | treatment |
|---|---|
| `field`, `for`, `of` | Parse artifacts from logged CQL. Translator-only: fail closed or translate to no field with an error state. |
| `author.affiliation` | Open mapping question. It may be the same as Organisation, or it may require contributor-affiliation indexing. |
| `file` | A specific file identifier negation appeared once. Treat as translator-only unless Raven adds file-level query fields. |
| `articletype`, `misctype`, `conferencetype` | Translator aliases into Raven `work_type`, because Raven flattens legacy subtypes into the work-type catalog. |
| `publicationstatus` | Alias spelling for `publication_status`; the underlying Raven concept is still open. |

## URL and value-list requirements

The URL is still the truth, but the builder needs a longer answer than today's public facet
params:

- Negation, field-specific text search, and OR groups need one durable grammar. Raven's
  `QueryFilter` can express `Not`, `Or`, `Terms`, and `Range`; the public URL cannot yet
  round-trip all of them.
- Repeated rows for the same field are AND. A single `is any of` row is OR. The URL grammar must
  preserve that difference.
- Pasted lists are first-class. Observed batches reach 763 record IDs, 200 identifiers, 189
  projects, 99 authors, and 41 organizations. Some real queries exceed 9,000 characters, so the
  shareable artifact needs a saved-search or short-id path, or a documented ceiling with a clear
  failure state.
- Values in committed examples stay fixtures. No logged names, IDs, session identifiers, or raw
  hostile strings move into docs or tests.

## Open questions to settle before moving this to Raven

1. Which URL grammar carries AND rows, repeated same-field rows, negation, ranges, and phase-2
   OR groups?
2. Which fields are public advanced search fields, and which are backoffice-only:
   `classification`, `publication_version`, `publication_status`, `external`, `created_at`,
   copyright, and journal metrics?
3. Does the builder output stable Raven names (`contributor`, `container`, `created_at`) while
   the translator accepts legacy aliases (`author`, `parent`, `datecreated`), or do public URLs
   keep the legacy names for compatibility?
4. What is the Raven source for `external` and `publication_status`?
5. Is `affiliation` a credited-organization filter, a contributor-affiliation filter, or two
   separate fields?
6. Does `id` mean Raven record ID, legacy biblio identifier, or both with scheme recognition?
7. How does Raven represent exact text operators for title, abstract, publisher, and container:
   normalized exact value, phrase match, or field-specific full-text query?
8. What is the long-list permalink answer: saved search, short server-side list ID, POST-backed
   export/search artifact, or a hard limit?
9. Do the works page's facet parameters round-trip into condition rows without loss? Arrival
   from a filtered list renders each active facet as an editable row. Options: every public
   facet maps onto a condition row; some facets stay outside the builder and the page says
   which; or an arrival carrying an unmappable facet is refused.
10. Can "is not" be honoured on a name-as-written text condition, where the value is a string
    rather than a person record? Options: negate the string match; restrict "is not" to
    resolved records; or drop "is not" from that field.
11. Where does the approximate count come from? Options: the index `total`; the index `total`
    under a `track_total_hits` cap, with a documented ceiling above which the count stops
    being reported; or a count route separate from search.
