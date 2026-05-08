# WORK-TYPES.md
# Research output type redesign — decisions, principles, and obligations

Version 0.4 — May 2026

Owner: Miet Claes

Workshop participants: Anniek Toye, Dorien Van de Wouwer, Evelien D'Hollander,
Inge Van Nieuwerburgh, Marthe Vandenbussche, Nicolas Steenlant, Rien De Raedt,
Stefanie De Bodt, Kevin Michael Leonard — facilitated by Miet Claes

This document captures the decisions made on the type system, the design principles
that constrain them, and the external reporting obligations that must be satisfied.

For the legacy type list, see `docs/old-research-output-types.md`.
For the working type list used in prototypes, see the Output types section in `PRODUCT.md`.
For domain vocabulary (kind values, status, badges), see `DOMAIN.md`.

---

## Hard rules

These are non-negotiable constraints. They apply to every decision about the type system.

**No subtypes.** The type list is flat. There is no mandatory second step. Ever.
Distinctions that matter for mapping or reporting are shown as first-class type
choices — not hidden in secondary metadata fields. What we show to a researcher can
differ from what we export to external systems. The mapping layer handles translation.

**No Miscellaneous.** If a type cannot be positively defined — by what it is, not by
what it isn't — it does not ship. A residual catch-all corrupts every analysis that
uses the type field and becomes impossible to clean up retroactively.

**Types are not classifications.** A VABB classification (A1, A2, B1, B2, C1) is a
curator-owned field applied after deposit. It is not a type. A type describes what
the output is. A classification describes how an external system values it.
Do not conflate them.

**Types are not states.** A preprint is a state of an article (submitted version),
not a separate type. Publication version is captured as a per-record field — see
Fields to be defined. The legacy system treated `preprint` as a `miscellaneous_types`
subtype; that was a misclassification, corrected in this design.

**Required fields at deposit are not optional curator cleanup.** If a field matters
for citation, discovery, or external export, it is required at deposit — not left for
curators to fill in later. The curator team is small. Their job is quality review and
classification, not completing researcher metadata.

**Biblio is a primary source.** Type decisions have long-term consequences. External
systems (OpenAlex, WoS, FRIS, DataCite) index from Biblio. Getting type wrong means
wrong data in every downstream system, permanently, until someone corrects it record
by record.

**What a researcher sees, what Biblio stores, and what external systems receive are
three distinct layers.** They do not need to be identical. The researcher-facing label
is optimised for clarity at deposit. The internal `kind` is the stable database
identifier. The mapping layer translates `kind` to external schemas at import and
export time. A researcher never sees the mapping layer. This separation is what makes
it possible to have a flat, simple deposit UI without lying to external systems.

---

## Design principles

### 1. Describes an activity, not a medium

The type captures what the researcher produced intellectually. A recorded lecture, a
written transcript of that lecture, and a slide deck of that lecture are three media
for the same activity. Medium is a metadata field, not a type distinction.

### 2. Academically scoped

Every type must represent output that reports, applies, communicates, or documents
research activity that the depositing researcher was personally involved in. If the
connection to a specific research activity cannot be stated in one sentence, it does
not belong in Biblio.

This excludes purely institutional output (a university annual report, a press
release written by communications staff) and purely personal output (a novel written
for pleasure, a private blog unrelated to research). The link to research activity
is what separates those from output that belongs here.

### 3. Not stressful to choose

General enough that researchers can self-classify without hesitation. Specific enough
that meaningful distinctions are preserved. Compatible enough that external mapping
does not require lying.

A distinction warrants a separate type only when **both** of the following are true:

1. The metadata schema is substantially different — the fields required to describe
   it are meaningfully different in structure, not just in content.
2. The external world treats them as distinct — different identifier systems,
   different reporting obligations, or different access models.

If only one test passes, the distinction is handled by a field, not a type split.

A distinction becomes a type when a researcher can answer "which one am I?" without
ambiguity and without needing to read a tooltip. "Did you write a review article or
an original article?" — a researcher knows immediately. That is the practical test.

Examples of both tests passing: `dataset` vs `journal_article` — different fields,
different identifier infrastructure (DataCite vs CrossRef), different FWO reporting
category. Separate types correct.

Examples of only one test passing: a conference paper vs a conference short paper —
near-identical metadata schema (same fields, just shorter), external world does not
distinguish. Short paper is a context note on `conference_paper`, not a type.

Parts and wholes follow the same logic. A book chapter is a separate type from a
book because both tests pass: the metadata schema is substantially different (parent
title, parent ISBN, page range, editor), and the external world treats them as
distinct (different CrossRef type, different VABB category). The parent book ISBN
on a book chapter record is required at deposit — it is the durable anchor that
works whether or not the parent book exists in Biblio. When the parent book is a
Biblio record, raven additionally resolves the ISBN to a record-to-record link;
the ISBN remains the requirement, the record link is a strengthening when
available. Multiple ISBNs are supported to handle series. Whether a work is part
of a series or collection is captured by a required indicator field, not by a
separate type.

### 4. Durable

No types that encode a medium or platform trend. "Blogpost" will be confusing in ten
years. The activity it represents will not be.

### 5. Recognisable

Understood without a tooltip by any researcher at any university, in any discipline,
in any country. Prefer alignment with COAR, CrossRef, DataCite, and OpenAIRE
vocabularies. Deviations require explicit justification.

### 6. Future-proof without becoming a trash bucket

The type list must not need to be reopened every time a new format or practice
emerges in academia. Types are stable containers. Controlled vocabularies inside
them — medium, context — absorb novelty.

TBD: A podcast is not a new type. It is `research_communication` with a
`free description field` that can describe the medium, such as podcast.
Whatever comes after that free field will be the same. The type list does not track trends.

The corollary: broad types are only acceptable if they have a tight positive
definition and a functioning trash-bucket test. A broad type without those
degenerates into Miscellaneous over time.

---

## External reporting obligations

These are the systems Biblio feeds. Type decisions must not break these pipelines.

### VABB-SHW (Flemish Academic Bibliography — Social Sciences and Humanities)

Operated by ECOOM. Feeds the BOF funding key for Flemish universities.
Types that are eligible for VABB-SHW validation:
- Journal articles, including reviews (peer-reviewed, 4+ pages, in approved journal list — letters and notes also fall under `journal_article`)
- Books (with ISBN, from approved publisher list)
- Book chapters (with ISBN, from approved publisher list)
- Conference papers in proceedings (with ISBN/ISSN)
- Working papers (with ISBN/ISSN)

VABB does not recognise science communication, policy reports, datasets, or software
as eligible output. The VABB classification (A1, A2, B1, B2, C1, R1) is a
**curator-owned field**, not a type. It is applied after deposit.

**Impact on type design:** VABB-eligible types must map cleanly from Biblio types.
No type should be ambiguous as to whether it is VABB-eligible.

### FWO (Research Foundation — Flanders)

FWO mandates three types of research results to be submitted to FRIS:
1. Peer-reviewed journal articles (since 2024: pulled automatically from FRIS via Biblio)
2. Datasets
3. Research infrastructure

All other output types are supplementary — reported manually by the researcher in the
FWO portal. FWO does not recognise science communication or policy reports as
reportable output categories.

**Impact on type design:** `journal_article` and `review_article` must be unambiguous
types in Biblio. FWO pulls journal article metadata automatically — errors in type
assignment propagate directly into funding reports.

### FRIS (Flanders Research Information Space)

Flemish government metadatabase. Collects: publications, datasets, patents,
infrastructure. Fed by Biblio via GISMO. Used by FWO, BOF, and the Flemish
government for research monitoring.

**Impact on type design:** FRIS distinguishes publications, datasets, patents, and
infrastructure. Biblio types must map to one of these categories without ambiguity.

### OpenAIRE / COAR

OpenAIRE uses the COAR Resource Type vocabulary for OAI-PMH harvesting.
COAR 3.2 has distinct terms for journal articles, reviews, letters, conference
papers, working papers, policy reports, and more.

**Impact on type design:** Biblio types must map to COAR types for OAI-PMH export.
Where our label differs from the COAR term, the mapping must be explicit and
documented.

### CrossRef / DataCite

CrossRef handles DOI registration for journal articles, books, conference papers,
and datasets. DataCite handles DOI registration for datasets, software, and other
research outputs. Type must match the registrar's schema at the point of DOI
minting or import.

**Impact on type design:** CrossRef distinguishes `journal_article`, review, letter,
and proceedings-article. Of these, only review and proceedings-paper are first-class
type choices in Biblio. CrossRef `journal_article` and CrossRef `letter` both import
as Biblio `journal_article` (see Resolved decisions for the letter/note rationale,
including how the original CrossRef type is handled in that specific case).
Whether source-system types are preserved as audit metadata more broadly is an
Open question.

---

## Proposed type list

These seventeen types are intended to cover approximately 90% of research output at UGent.
Each has a positive definition. None is a residual category. Eight further candidates
are flagged ⚠️ TBD at the bottom of the table — they are under discussion and not part
of v1. See "To be discussed" for full rationale on each.

The internal `kind` uses plain underscore-separated descriptive identifiers — same
convention raven uses across its YAML config, Go constants, search index, and CSL
map (`work_type` discriminator, `journal_article`, `book_chapter`, etc.). No
namespace prefix. Each identifier is self-explanatory and aligns with the naming
conventions of COAR, CrossRef, and DataCite where possible (with the underscore
substituted for the hyphen they use), making the mapping layer easier to maintain.

| Researcher label | Internal `kind` | Core question answered |
|-----------------|----------------|----------------------|
| Journal article | `journal_article` | Original research article published in a peer-reviewed journal? |
| Review article | `review_article` | Critical synthesis or review published in a peer-reviewed journal? |
| Book | `book` | A standalone monograph with ISBN? |
| Book chapter | `book_chapter` | A contribution to an edited volume? |
| Conference paper | `conference_paper` | Full paper or extended abstract presented at a scholarly conference, with a written component in proceedings or programme? |
| Conference abstract | `conference_abstract` | Abstract-only submission to a scholarly conference, not published as a full paper? |
| Poster | `conference_poster` | A poster presented at a scholarly venue? |
| Presentation | `conference_presentation` | A standalone presentation at a scholarly venue? |
| Dissertation | `dissertation` | A degree-granting thesis? |
| Dataset | `dataset` | A structured collection of data for reuse? |
| Software | `software` | A citable software artefact? |
| Report | `report` | A standalone document produced by or for an organisation, not peer-reviewed as a journal? |
| Working paper | `working_paper` | A pre-publication research paper circulated for comment, typically in a series? |
| Policy report | `policy_report` | An evidence-based document addressed to decision-makers or public bodies? |
| Annotation | `annotation` | A single citable annotation on an existing resource? |
| Annotation collection | `annotation_collection` | A structured collection of annotations on existing resources? |
| Research communication | `research_communication` | Research-derived output delivered in a public, non-scholarly venue? |
| ⚠️ TBD **Musical notation** | `musical_notation` | A musical score or notation produced as part of research? |
| ⚠️ TBD **Transcription** | `transcription` | A scholarly transcription of a manuscript or primary source? |
| ⚠️ TBD **Critical edition** | `critical_edition` | A critically edited version of an existing text? |
| ⚠️ TBD **Data management plan** | `data_management_plan` | A formal data management plan for a research project? |
| ⚠️ TBD **Project deliverable** | `project_deliverable` | A formal deliverable submitted to a project funder? |
| ⚠️ TBD **Project milestone** | `project_milestone` | A formal milestone marker for a research project? |
| ⚠️ TBD **Proposal** | `proposal` | A research proposal submitted to a funder? |
| ⚠️ TBD **Thesis (sub-doctoral)** | `thesis` | A bachelor's or master's thesis (scope question — see To be discussed)? |

### Type definitions

| Type | Definition | Examples | Not | Notes |
|------|-----------|---------|-----|-------|
| **Journal article** `journal_article` | Original research article, short communication, letter, note, or correspondence published in a peer-reviewed journal. | Experimental study; observational study; original clinical trial; computational study; letter to the editor; brief communication; technical note; correction; erratum | A review article (→ `review_article`); a conference paper published in a journal (→ TBD) | Maps to CrossRef `journal_article`, COAR `research article`, WoS `Article`. A submitted-version preprint is not a separate type — it is a `journal_article` with publication version `submitted version`. Letters and notes were dropped as separate types — see Resolved decisions for the reasoning and import-provenance handling. |
| **Review article** `review_article` | A critical synthesis or systematic review of existing literature, published in a peer-reviewed journal. | Systematic review; meta-analysis; narrative review; scoping review; literature survey | An original research article reporting new data (→ `journal_article`) | Maps to CrossRef `journal_article` + review flag, COAR `review article`, WoS `Review`. VABB A1/A2 eligible. Kept as a separate type because review is a different research activity (synthesis vs. original work), not a publishing format — both principle 3 tests pass cleanly. |
| **Book** `book` | A standalone scholarly monograph published with an ISBN. Includes authored and edited volumes. | Research monograph; edited volume; handbook; critical anthology | A book chapter (→ `book_chapter`); a report with an ISBN issued by an institution (→ `report`) | Editor role is a contributor role field, not a separate type. Series membership captured by a series indicator field. |
| **Book chapter** `book_chapter` | A defined contribution to an edited book, with its own title and authorship, published within a volume with an ISBN. | Chapter in an edited volume; entry in a handbook; contribution to a Festschrift | A standalone report (→ `report`); a journal article (→ `journal_article`) | Parent ISBN required at deposit (the durable anchor — works whether or not the parent book is in Biblio). When the parent book is a Biblio record, raven resolves the ISBN to a record-to-record link automatically. |
| **Conference paper** `conference_paper` | A full paper or extended abstract presented at a scholarly conference and published in proceedings or a conference programme. | Proceedings paper with ISBN/ISSN; extended abstract in a programme; short paper in conference proceedings | A poster (→ `conference_poster`); slides only (→ `conference_presentation`); abstract only (→ `conference_abstract`) | Proceedings indicator field (yes/no) required — drives COAR mapping and VABB C1 eligibility. |
| **Conference abstract** `conference_abstract` | An abstract-only submission to a scholarly conference, not accompanied by a full paper. | Meeting abstract in a conference booklet; congress abstract; symposium abstract | A full paper in proceedings (→ `conference_paper`); a poster (→ `conference_poster`) | Not VABB-eligible. Maps to COAR `conference object`. Typically no DOI. |
| **Poster** `conference_poster` | A display poster presented at a scholarly venue — conference, symposium, workshop, or seminar. | Research poster at a conference; poster at a doctoral symposium; poster at an academic workshop | A poster at a public science festival (→ `research_communication`) | The `conference-` prefix follows COAR convention; scope is not limited to conferences. If a full paper exists in proceedings, deposit that as `conference_paper` and link the poster. |
| **Presentation** `conference_presentation` | A set of slides or documented talk presenting research at a scholarly venue. | Invited talk slides; keynote deck; seminar presentation; guest lecture at a university | A public lecture at a museum or community event (→ `research_communication`) | A recording of a presentation is a related output — attach as a file linked to this record. |
| **Dissertation** `dissertation` | A thesis submitted in fulfilment of a degree requirement. | Doctoral dissertation; master's thesis | A bachelor's thesis (scope question — see To be discussed) | Degree, supervisor, and institution are required fields. |
| **Dataset** `dataset` | A structured, documented collection of data produced for reuse by others, with a persistent identifier. | Survey data with codebook; experimental measurements; annotated corpus; genomic data deposited at EGA or ENA | Any internal analysis file or spreadsheet; a database that is internal tooling (→ `software`) | DOI via DataCite preferred. Intent to make data reusable and citable is the criterion. |
| **Software** `software` | A citable software artefact produced as part of research, with a persistent identifier or versioned repository URL. | Research tool with DOI on Zenodo; analysis pipeline on GitHub with version tag; R or Python package | An analysis script used once and not intended for reuse; a commercial tool the researcher used but did not produce | Version and licence are required fields. |
| **Report** `report` | A standalone document produced by or for an organisation, not published through journal or book peer review. Requires an issuing body. | Institutional research report; technical report; research report to a funder | A working paper in a series (→ `working_paper`); a policy brief (→ `policy_report`); a peer-reviewed article (→ `journal_article`) | Technical reports, internal reports, and research reports all use this type. |
| **Working paper** `working_paper` | A pre-publication research paper circulated for comment, typically issued in a numbered series by an institution or research group. | NBER working paper; IZA discussion paper; departmental working paper; SSRN preprint in a series | A finalised institutional report (→ `report`); a published journal article (→ `journal_article`) | VABB R1 eligible when published with ISBN/ISSN. Series name and institution are required fields. Maps to COAR `working paper`. Distinct from a `journal_article` with `submitted version` — a working paper is a standalone document in a series; a preprint is a state of an article. |
| **Policy report** `policy_report` | An evidence-based document addressed to decision-makers — government bodies, regulators, or public institutions — with the explicit purpose of informing a decision or policy. | Policy brief; advisory report; government commission report; regulatory submission | A general institutional report (→ `report`); a journal article (→ `journal_article`) | Target audience (the decision-making body) is a required field. Maps to COAR `policy report`. Not VABB-eligible. |
| **Annotation** `annotation` | A single, citable annotation applied to a specific existing resource — text, image, dataset, or other primary source. The annotated resource must be referenced by a stable identifier (DOI, Handle, URL, or other persistent ID) at deposit. When the annotated resource is itself a Biblio record, raven additionally resolves to a record-to-record link. | A TEI annotation on a manuscript line; a scholarly note attached to a corpus sentence | A collection of annotations (→ `annotation_collection`); inline commentary in a book chapter (→ `book_chapter`) | Distinct from `annotation_collection` as `book_chapter` is from `book` — both principle 3 tests pass. |
| **Annotation collection** `annotation_collection` | A structured set of annotations applied to one or more existing resources, with a documented annotation scheme. | A TEI-encoded annotated corpus; a named entity recognition dataset with annotation guidelines | A dataset without annotation structure (→ `dataset`); a book with scholarly commentary (→ `book_chapter`) | Annotation scheme (e.g. TEI, Web Annotation, CATMA) is a required field. |
| **Research communication** `research_communication` | Research-derived output delivered in a public, non-scholarly venue, where the purpose is to make research accessible beyond academia. | Newspaper or magazine article; opinion piece; blog post; public podcast episode; popular science book; radio or TV appearance; public lecture at a museum or festival | A seminar talk at a university (→ `conference_presentation`); a scholarly review article (→ `review_article`); anything where the link to a specific research activity cannot be stated | Medium field required (e.g. `blog post`, `podcast`, `newspaper article`). Trash-bucket test: if you cannot answer "which research does this communicate?", it does not belong here. No VABB, FWO, or FRIS obligation. |

---

## Fields to be defined

The type system depends on several metadata fields that are referenced throughout
this document but not yet fully specified. These must be defined before any type
is considered implementation-ready. Field definitions are a separate deliverable
from type definitions — they require input from curators, the backend developer,
and in some cases policy confirmation.

**Publication version**
A closed-vocabulary text field aligned with COAR Version Type vocabulary and
NISO/ALPSP JAV: `submitted version`, `accepted version`, `published version`.

This is the field that captures preprint state. A preprint is not a type — it is a
`journal_article` (or other applicable type) with publication version `submitted
version` and a server identifier. The legacy system's `miscellaneous_types.preprint`
subtype is replaced by this field. See "What is not a type" below.

**Applies to** (peer-review lifecycle types only): `journal_article`,
`review_article`, `book`, `book_chapter`, `conference_paper`. Possibly `report`
and `policy_report` (drafts vs. final — confirm with curators). Does not apply
to types without a peer-review lifecycle: `dataset`, `software`, `dissertation`,
`conference_abstract`, `conference_poster`, `conference_presentation`,
`annotation`, `annotation_collection`, `research_communication`, `working_paper`
(a working paper is by definition pre-publication; the document *is* the
working paper, no submitted/accepted/published lifecycle on top).

**Server identifier when state is `submitted version`.** When the value is
`submitted version`, the record must carry an identifier that locates the
preprint on a server (arXiv ID, bioRxiv DOI, ChemRxiv DOI, SSRN ID, etc.). This
reuses the existing `identifier` field with `relation = self` and the existing
scheme machinery (`arxiv`, `doi`, `handle`, `ssrn`) — no new field shape is
introduced. arXiv broadens beyond its current `allowed_for: [journal_article,
dataset]` to cover the peer-review lifecycle types listed above.

**How the conditional is enforced** (server identifier required when
publication_version is submitted version) is a raven implementation question —
see Open questions for raven. The type design commits to the requirement;
raven decides the mechanism (engine layer, form layer, or guidance only).

Owner: researcher-provided at deposit, curator-correctable.

**Proceedings indicator**
A required yes/no field on `conference_paper`: was this paper published in a formal
proceedings volume with an ISBN or ISSN? Drives three downstream consequences:
(1) COAR mapping — `conference paper` when yes, `conference paper not in proceedings`
when no; (2) VABB C1 eligibility — only applies when yes and ISBN/ISSN is present;
(3) citation format — proceedings citations require publisher and proceedings title;
non-proceedings citations do not.
Required for all `conference_paper` records. Field shape — see Open questions for
raven for the raven-side representation choice.
Owner: researcher-provided at deposit, curator-correctable.

**Medium**
A free-text field on `research_communication`. The researcher describes the format
of delivery in their own words — "opinion piece in De Standaard", "weekly podcast
on climate policy", "guest appearance on Canvas". No filtering. Medium is not
consumed by external pipelines and carries no reporting obligation. Its purpose
is to give curators enough context to assess scope (principle 2) and to give
human readers a descriptive label.

`research_communication` cites generically as CSL `article-magazine` regardless
of medium — see "Why generic citation for research_communication" below for the
reasoning, and the Decision history at the end of this section for the path we
took to get there.

Note: a recording of a `conference_presentation` is not a medium value. It is a
related output — attach the recording as a file linked to the presentation record.
Owner: researcher. Free text.

**Why generic citation for research_communication**

`research_communication` is a deliberately broad type. CSL has medium-specific
types for many of its members (`post-weblog` for blog posts, `broadcast` for
podcasts and TV, `speech` for public lectures, `book` for popular science books,
`article-newspaper` and `article-magazine` for press pieces). We do not route to
those medium-specific CSL types. Every `research_communication` record cites as
`article-magazine`.

This is a cost we accept. A TV appearance cited as `article-magazine` reads
slightly wrong; a podcast cited as `article-magazine` reads slightly wrong; a
public lecture cited as `article-magazine` reads more wrong. The trade is that
the type stays clean: one type, one CSL mapping, no closed-vocabulary subtype
field hidden as a property, no keyword-matching code to maintain.

If, in practice, generic citation proves too lossy — researchers complain that
their podcasts read as magazine articles, or accessibility / citation-manager
tools mis-handle the records — Plan B is to **split `research_communication`
into multiple top-level types**. Each medium becomes a first-class type choice
on the deposit list, not a subtype:

- `popular_article` — newspaper, magazine, opinion piece (CSL `article-magazine`)
- `online_publication` — blog post, web article (CSL `post-weblog`)
- `broadcast_appearance` — radio, TV, podcast (CSL `broadcast`)
- `public_lecture` — public talk at a museum, festival, or community event (CSL `speech`)
- `popular_book` — popular science book (CSL `book`)

The catalogue grows from 17 to 21 types. Researchers self-classify into a
medium-specific type at deposit — the same way they already choose between
`book` and `book_chapter`. No subtype rule is violated because the distinction
is a first-class type choice. The cost is researcher-side cognitive load (more
options on the deposit picker) and the principle-6 risk that future media
formats need new types added.

Plan B is not the v1 design. It is the documented escape hatch if generic
citation does not hold up.

**Decision history for research_communication and citation rendering**

Three options were evaluated. Recording the path here so future readers
understand why we landed on generic citation rather than something more
expressive.

1. **Generic citation.** Single CSL type for the whole bucket. Simple, honest
   about limits, slightly wrong on non-press cases.
2. **Light controlled vocabulary on top of free text.** Add a `medium_kind`
   field with six closed values (`written`, `online`, `broadcast`, `spoken`,
   `book`, `other`) that map to CSL. System-derived from free-text `medium` via
   keyword matching, curator-correctable. Considered, drafted, then rejected.
   Reason: structurally identical to the rejected `article-form` field for
   letter / note (a closed-vocabulary subdivision of a parent type, dressed as
   a property field). The "no subtypes" hard rule kills it for the same reason.
3. **Free text with render-time CSL derivation.** Citation formatter reads the
   free-text `medium` and derives the CSL type at render time via the same
   keyword logic. No closed vocabulary stored on the record. Considered,
   rejected on maintenance grounds. The keyword map is a small thing today
   and a creeping maintenance burden tomorrow — every new medium becomes a
   code change in the citation layer.

**Resolved on option 1 (generic citation, CSL `article-magazine`).** Plan B
(split into multiple top-level types) is held in reserve.

**Context** (specification deferred to the per-type fields project)
A free-text field available on all types, used by researchers to describe their
output when no controlled term fits precisely. Referenced by several type
definitions and Open questions in this doc as an existing field. Full
specification (length limits, indexing, curator visibility) lives in the
per-type fields project, not here.

**Annotation scheme** (specification deferred to the per-type fields project)
Required for `annotation_collection`. Captures the standard or framework used
(e.g. TEI, Web Annotation, CATMA). Listed here because it is required for the
type to be defined; the field's vocabulary, value list, and validation belong
in the per-type fields project.

**Parent reference**
For `book_chapter`: the parent ISBN is the required anchor (captured as an
identifier with `relation = part_of`). When the parent book exists as a Biblio
record, raven resolves the ISBN to a record-to-record link automatically — the
link is a strengthening, not a separate requirement. The same pattern applies
to `annotation_collection` when its members reference parent resources, and to
`annotation` for the annotated resource (anchored on DOI, Handle, URL, or other
persistent identifier as appropriate to the target).
Owner: researcher-provided at deposit, curator-correctable.

**Series indicator**
A required yes/no field on `book`. Asks the researcher whether the book is
published as part of a named series — publisher series like "Springer Lecture
Notes in Computer Science", scholarly series like "Routledge Studies in
Comparative Literature", or institutional working-paper-style series with a
book ISBN.

When yes, two follow-on fields apply:

- **Series name** (required). The human-readable series name. Used in citation
  rendering and series-level discovery — many series do not have their own
  ISBN, so the name is the only durable identifier.
- **Series ISBN or ISSN** (optional). Captured as an additional identifier on
  the book record with `relation = part_of`, scheme `isbn` or `issn`. The
  book's own ISBN remains the `relation = self` identifier; raven's existing
  `TermListField` already supports multiple identifiers per record, so no
  schema work is needed beyond extending the `allowed_for` scope.

When no, no series fields are shown.

Required for `book`. Field shape (yes/no) — see Open questions for raven for
the raven-side representation choice.

Owner: researcher-provided at deposit, curator-correctable.

**Policy report audience** (specification deferred to the per-type fields project)
Required for `policy_report`. The target decision-making body or institution the
report is addressed to. The existence of this field is what distinguishes
`policy_report` from `report` (see Open question on the policy_report / report
split). The field's exact shape — free-text vs. controlled vocabulary — is
deferred to the per-type fields project.

**Working paper series**
A required compound field on `working_paper`. Captures the series in which the
working paper is issued — NBER Working Paper Series, IZA Discussion Papers,
departmental working paper series, SSRN preprint series, etc. The presence of a
series is what distinguishes `working_paper` from `report`: a standalone
document with an issuing body but no series is a `report`.

Sub-fields:

- **Series name** (required). The human-readable series name. Used in citation
  rendering and for series-level discovery. Many series do not have their own
  ISBN or ISSN, so the name is the primary durable identifier.
- **Issuing institution** (required). The institution or research group that
  issues the series. Captured as an organization reference where possible
  (linkable to a Biblio organization record), free-text otherwise.
- **Series number** (optional but recommended). The numeric or alphanumeric
  identifier of this paper within the series.
- **Series ISBN or ISSN** (optional). Captured as an additional identifier on
  the working paper record with `relation = part_of`, scheme `isbn` or `issn`.
  Required for VABB R1 eligibility — without it, the working paper is not
  VABB-eligible regardless of other criteria. The working paper's own
  identifier (DOI, Handle, etc.) remains the `relation = self` identifier;
  raven's existing `TermListField` already supports multiple identifiers per
  record, so no schema work is needed beyond extending the `allowed_for` scope.

Required for `working_paper`. Field shapes for the sub-fields — see Open
questions for raven for the raven-side representation choices on the
organization reference and the compound-field structure.

Owner: researcher-provided at deposit, curator-correctable.

---

## Mapping architecture

What a researcher sees at deposit, what Biblio stores internally, and how each type
maps to the systems we import from and export to are three distinct layers.
They do not need to be identical — but the translation between them must be
explicit, documented, and maintained as a contract.

**Architecture:**
- The researcher-facing label and definition are Biblio's own. Optimised for clarity at deposit.
- The internal `kind` is the stable identifier used in the database and codebase.
- The mapping layer translates `kind` to external schemas at import and export time.
  A researcher never sees this layer. It does not need to be one-to-one.

**Vocabulary decision:** Biblio maintains its own type labels. It does not adopt
COAR, DataCite, or any other external vocabulary as its deposit UI vocabulary.
COAR 3.2 is the authoritative export mapping target for OAI-PMH. DataCite 4.6 is
the mapping target for DOI registration. CrossRef types are used for journal article
and book import and export. These are mapping targets, not the source of truth for
what researchers see.

**Fit legend:**
- ✅ Direct match — import or export term maps cleanly without approximation
- ≈ Approximate — closest available term, not an exact match
- — Not applicable to this system
- ⚠️ Weak-fit type — Biblio-owned, no import pipeline, export is approximate only

### Import sources

What each source system calls the type when Biblio imports a record from it.

| Researcher label | Biblio `kind` | WoS | CrossRef / DOI | PubMed | OpenAIRE | BibTeX |
|-----------------|--------------|-----|---------------|--------|----------|--------|
| **Journal article** | `journal_article` | Article | `journal_article` | Journal Article | literature → journal article | `@article` |
| **Review article** | `review_article` | Review | `journal_article` (+ review flag) | Review | literature → review article | `@article` |
| **Book** | `book` | Book | `book`; `edited-book` | Book | literature → book | `@book` |
| **Book chapter** | `book_chapter` | Book Chapter | `book_chapter` | Book Section | literature → part of book | `@incollection`; `@inbook` |
| **Conference paper** | `conference_paper` | Proceedings Paper | `proceedings-article`; `book` | Conference Paper | literature → conference paper | `@inproceedings` |
| **Conference abstract** | `conference_abstract` | Meeting Abstract | — | — | ≈ literature → conference object | ≈ `@misc` |
| **Poster** | `conference_poster` | — | — | — | ≈ literature → conference object | ≈ `@misc` |
| **Presentation** | `conference_presentation` | — | — | — | ≈ literature → conference object | ≈ `@misc` |
| **Dissertation** | `dissertation` | — | `dissertation` | Dissertation; Thesis | literature → thesis | `@phdthesis`; `@mastersthesis` |
| **Dataset** | `dataset` | Data Paper | `dataset` | — | dataset | ≈ `@misc` |
| **Software** | `software` | Software | `software` | — | software | ≈ `@misc` |
| **Report** | `report` | Report | `report` | Technical Report | ≈ literature → other research product | `@techreport` |
| **Working paper** | `working_paper` | — | `posted-content` | — | ≈ literature → working paper | `@techreport` |
| **Policy report** | `policy_report` | — | `report` | — | ≈ literature → other research product | `@techreport` |
| **Annotation** | `annotation` | — | — | — | ≈ literature → other research product | ≈ `@misc` |
| **Annotation collection** | `annotation_collection` | — | — | — | ≈ literature → other research product | ≈ `@misc` |
| **Research communication** ⚠️ | `research_communication` | — | — | — | — | ≈ `@misc` |

**Note on life sciences repositories (EGA, ENA, BioStudies, ENA BioProject, Ensembl, Handle):**
These systems apply only to datasets. They do not carry publication type vocabularies —
they use study types, data types, and accession identifiers. A record from any of
these sources is always imported to Biblio as `dataset`, with the repository
accession as the persistent identifier. They are not export targets.

**Note on letter and note imports.** Records imported from WoS as `Letter` or `Note`,
from PubMed as `Letter`, or from CrossRef as `letter`, are stored as `journal_article`
in Biblio. The original source-system type value is preserved as import-provenance
metadata only — it is not a classification field, is not read by any export pipeline,
and is not shown in the deposit UI. See Resolved decisions for the rationale.

### Export targets

What label Biblio sends when exporting a record to each target system.

| Researcher label | Biblio `kind` | COAR 3.2 | DataCite 4.6 | OpenAIRE | CSL 1.0.2 | VABB | FRIS / FWO |
|-----------------|--------------|----------|-------------|----------|-----------|------|------------|
| **Journal article** | `journal_article` | ✅ `research article` | ✅ `JournalArticle` | ✅ literature | ✅ `article-journal` | A1 / A2 | ✅ publication (FWO mandatory) |
| **Review article** | `review_article` | ✅ `review article` | ✅ `JournalArticle` | ✅ literature | ✅ `article-journal` | A1 / A2 | ✅ publication (FWO mandatory) |
| **Book** | `book` | ✅ `book` | ✅ `Text / Book` | ✅ literature | ✅ `book` | B1 | ✅ publication |
| **Book chapter** | `book_chapter` | ✅ `book part` | ✅ `Text / BookChapter` | ✅ literature | ✅ `chapter` | B2 | ✅ publication |
| **Conference paper** | `conference_paper` | ✅ `conference paper` | ✅ `Text / ConferencePaper` | ✅ literature | ✅ `paper-conference` | C1 | ✅ publication |
| **Conference abstract** | `conference_abstract` | ✅ `conference object` | ≈ `Text / Other` | ≈ literature | ≈ `paper-conference` | — | publication |
| **Poster** | `conference_poster` | ✅ `conference poster` | ≈ `Text / Other` | ≈ literature | ≈ `paper-conference` | — | publication |
| **Presentation** | `conference_presentation` | ✅ `conference presentation` | ≈ `Text / Other` | ≈ literature | ✅ `speech` | — | publication |
| **Dissertation** | `dissertation` | ✅ `thesis` | ✅ `Text / Dissertation` | ✅ literature | ✅ `thesis` | — | ✅ publication |
| **Dataset** | `dataset` | ✅ `dataset` | ✅ `Dataset` | ✅ dataset | ✅ `dataset` | — | ✅ dataset (FWO mandatory) |
| **Software** | `software` | ✅ `software` | ✅ `Software` | ✅ software | ✅ `software` | — | ✅ publication |
| **Report** | `report` | ✅ `report` | ✅ `Text / Report` | ≈ literature | ✅ `report` | — | ✅ publication |
| **Working paper** | `working_paper` | ✅ `working paper` | ✅ `Text / Report` | ✅ literature | ≈ `report` | R1 (with ISBN/ISSN) | ✅ publication |
| **Policy report** | `policy_report` | ✅ `policy report` | ≈ `Text / Report` | ≈ other research product | ≈ `report` | — | publication |
| **Annotation** | `annotation` | ✅ `annotation` | ≈ `Text / Other` | ≈ other research product | ≈ `entry` | — | publication |
| **Annotation collection** | `annotation_collection` | ✅ `annotation collection` | ≈ `Text / Other` | ≈ other research product | ≈ `entry` | — | publication |
| **Research communication** | `research_communication` | ≈ `other (text)` | ≈ `Text / Other` | ≈ other research product | ≈ `article-magazine` | — | publication |

⚠️ **Weak-fit types are Biblio-owned.** Research communication, policy report, and
annotation types have no import pipeline and approximate external schema mappings.
This is intentional — these types exist because Biblio's completeness mission extends
beyond what funding systems reward.

⚠️ **This table is unvalidated.** It must be reviewed with the backend developer
against live schema versions of COAR, CrossRef, DataCite, and FRIS before any
import or export pipeline is built on it.

---

## What is not a type

These are explicitly out of scope as types. They are handled by dedicated fields,
defined in the Fields to be defined section above.

- **Publication version** (preprint, accepted manuscript, published version) — captured
  as a per-record state field, not a type. **A preprint is not a separate kind of
  output; it is an article in `submitted version` state.** The legacy system treated
  `preprint` as a `miscellaneous_types` subtype — that conflated state with kind and is
  corrected here. See Fields to be defined for the Publication version field
  specification, including required server identifier (arXiv, bioRxiv, etc.) when
  state is `submitted version`.
- **VABB classification** (A1, A2, B1, B2, C1, R1) — curator-owned field, applied after deposit.
- **Proceedings indicator** (yes/no) on `conference_paper` — see Fields to be defined.
- **OA status** — per-file field.
- **Peer review status** — metadata field.
- **Medium** — see Fields to be defined.
- **Context** — see Fields to be defined.
- **Editor role** — contributor role field on book records.
- **Letter and note** — not separate types. Both are `journal_article`. Letters and
  notes encode a print-era publishing format that is in active decline, fail
  principle 3, and were dropped. A subtype-as-field replacement
  (e.g. `article-form` with values `letter`, `note`, `editorial`) was considered
  and rejected as a violation of the no-subtypes rule. WoS / PubMed / CrossRef
  source-system type values are preserved as import-provenance metadata only.
  See Resolved decisions for full reasoning.
- **Technical report, research report** — use `report`. Distinguish in context field if needed.
- **Conference short paper** — use `conference_paper`. A short paper has the same metadata schema; length is not a type distinction.
- **Artistic works, patents** — out of scope for v1; revisit when volume at UGent warrants it.

---

## Open questions

- **Policy report and report as separate types vs. combined.** The current proposal
  treats `policy_report` as a distinct top-level type from `report`. Both share most
  of their schema; the only structurally distinct field is target audience
  (decision-making body) on `policy_report`. The case for the split is contested.

  Pros of keeping them separate (current proposal):
  - COAR 3.2 has `policy report` as a distinct, ✅-mapped term — clean export.
  - UB2030 §3.1 elevates maatschappelijke impact as a strategic line; a separate
    type makes societal-impact output discoverable and reportable as a distinct
    category.
  - The audience semantics differ meaningfully — a policy report is addressed *to*
    someone with the explicit purpose of informing a decision; a general report is
    not.
  - Enables distinct curation rules and aggregate reporting on policy-facing output
    without retroactive cleanup.

  Cons (arguments for merging):
  - Principle 3 test 1 (substantially different metadata schema) is weak — same
    skeleton, one extra field.
  - Principle 3 test 2 (external world treats as distinct) is partial — DataCite
    collapses both to `Text / Report` (≈); OpenAIRE actually maps `policy_report`
    to `≈ other research product`, a *worse* fit than `report`'s `≈ literature`.
    Only COAR distinguishes cleanly.
  - Boundary is fuzzy at deposit — a report to a ministry and an institutional
    report can be hard to tell apart, especially when the same document serves both
    purposes.
  - VABB-irrelevant either way; FWO does not distinguish.

  Three viable resolutions:
  1. Keep both as separate types (current proposal). Justification: COAR clean
     mapping + UB2030 strategic alignment + clean aggregate reporting.
  2. Merge into a single `report` type with a required audience field (values:
     `academic`, `institutional`, `policy-maker`, etc.). Justification: principle 3
     fails for the split; the field drives both COAR mapping (export as `policy
     report` when audience is `policy-maker`) and societal-impact reporting,
     without forcing the researcher to make the distinction at deposit.
  3. Keep `report` and capture policy framing via the context field rather than as
     a distinct type. Justification: minimum schema, maximum researcher simplicity;
     trades clean COAR export for clean researcher experience.

  ⚠️ TBD — confirm with curators and the workshop participants.

- **Proceedings paper published in a journal:** A conference paper that ends up
  published in a journal with an ISSN — is it `conference_paper` (C1) or
  `journal_article` (A1)? VABB cares. WoS calls it "Proceedings Paper" even when
  in a journal. No decision yet. ⚠️ TBD — confirm with curators.
- **Lecture as a type:** Not added. `conference_presentation` covers slides and
  documented talks at scholarly venues. A recording of a presentation is a related
  output attached to the presentation record. Course material not linked to a
  specific research activity fails principle 2 and belongs in an educational
  repository. Confirm with faculty librarians.
- **Working paper vs. report:** `working_paper` requires a series and institution.
  A standalone document with an issuing body but no series is `report`. Confirm this
  boundary is sufficient for VABB R1 eligibility.
- **Software and VABB:** Software is not VABB-eligible. Confirm that `software` type
  records are excluded from VABB validation queries without manual intervention.
- **Mapping table validation:** The table above needs review by the backend developer
  against live schema versions of COAR, CrossRef, DataCite, and FRIS before any
  import/export pipeline is built.
- **Roles per type.** The new types broaden role vocabulary beyond what the
  legacy system covered: annotator (annotation, annotation_collection), data
  creator (dataset), software developer (software), addressee organization
  (policy_report), issuing institution (working_paper). The legacy system's
  contributor list was a known trash bucket — researchers, curators, and
  reviewers all left it half-filled. Before defining a roles-per-type schema,
  decide: do we want to commit to richer role vocabularies for the new types,
  or keep contributor minimal (author + a few essentials) and capture
  role-specific information in dedicated fields where it matters? This is a
  workflow decision, not just a vocabulary decision. ⚠️ TBD — confirm with
  curators and workshop participants.
- **Source-system type preservation scope.** The doc commits to preserving the
  original WoS / PubMed / CrossRef type as import-provenance metadata for
  letter / note (see Resolved decisions). Should the same principle apply more
  broadly to every imported record where the source-system type doesn't map
  one-to-one to a Biblio kind (correction, editorial material, anything that
  comes through with a source-specific tag), or stay scoped to the letter /
  note case where it was specifically resolved? Related: what other
  source-system metadata is worth preserving as audit data (sub-classifiers,
  funding mentions, license tags)? This is a scope question about what the
  audit metadata strategy is for imports broadly. ⚠️ TBD.

---

## Open questions for raven

Implementation questions surfaced by this type design that need decisions from
the raven backend team. Distinct from the curator/policy questions above —
these are about how raven represents and enforces the design, not about what
the design is.

- **Boolean field shape.** `proceedings_indicator` (yes/no on `conference_paper`)
  and `series_indicator` (yes/no on `book`) need a representation in raven's
  field registry. Add a new `BoolFieldSchema`, or model as `TextFieldSchema`
  with closed `values: [yes, no]`? Either works; consistency matters more than
  the choice.
- **`publication_version` field shape and conditional requirement.** The field
  is a closed-vocabulary text value (`submitted version`, `accepted version`,
  `published version`). When the value is `submitted version`, a server
  identifier (arXiv, bioRxiv DOI, SSRN, etc.) is required. raven's existing
  `required_for` machinery is per-subtype, not per-other-field-value — does
  this conditional get expressed in the field registry, in form-layer
  validation, or somewhere else?
- **Import-provenance audit field for letter / note.** WORK-TYPES.md commits
  to preserving the original WoS / PubMed / CrossRef type value
  (`Letter`, `Note`, `letter`) as import-provenance metadata only. Does that
  live in `source_records.raw` (already on the row, no schema change), as a
  dedicated audit-only column on `source_records`, or as a never-displayed
  field on the work itself? The constraint is: not a classification field,
  not read by export, not shown in deposit UI, but reachable for backward
  lookup.
- **Identifier scheme expansion.** DOI, ISBN, and ISSN scheme `allowed_for`
  lists need to widen to cover the new types. DOI to `software`,
  `book_chapter`, `conference_paper`, `report`, `working_paper`,
  `policy_report`. ISBN to `book_chapter` (parent ISBN with `relation = part_of`),
  `working_paper` (when in series). ISSN to `working_paper` (series ISSN).
  arXiv broadens beyond `journal_article` and `dataset` once `publication_version`
  is wired in. Mostly mechanical YAML — listed once so it's not forgotten.
- **`work_relation_values` timing and ISBN backfill.** `book_chapter` ships
  ISBN-anchored. When `work_relation_values` lands, the record-to-record link
  to a parent book (when the parent is a Biblio record) should be derivable
  from the ISBN. Is the backfill from existing ISBN identifiers to
  `work_relation_values` rows automatic when the table ships, or a separate
  follow-up pass?

---

## Resolved decisions

This section records type decisions made after the initial proposal, with the
reasoning preserved so future readers understand the trade-offs.

### `journal-letter` and `journal-note` dropped

Both were proposed as separate types in v1.0–1.2. Both are dropped. They fold into
`journal_article`. **No replacement field is added.**

**Reasoning.** Principle 3 fails for both. Schema is identical to `journal_article`.
External world mostly collapses them: CrossRef has no separate type for either,
OpenAIRE collapses both, PubMed has no `Note`, only COAR provides distinct vocabulary
terms (`letter` ✅, `journal-note` ≈), only WoS distinguishes both cleanly. Principle
4 (Durable) was the deciding argument: letter and note as journal subtypes encode a
print-era publishing format that is in active decline. Online-first journals do not
have "letters sections" the way print journals did, and preprint servers have absorbed
much of the rapid-communication function. The format will look vestigial in ten years;
the types would become legacy carryovers — exactly what `book_editor` and
`miscellaneous_types.preprint` look like in the legacy list now.

A subtype-as-field replacement was considered and rejected. An `article-form` or
`journal-section` field with values `letter`, `note`, `editorial`, `original` would
be a subtype with a different name on the box. The "no subtypes" hard rule says
distinctions of *kind* are types or they are nothing. Property fields (medium,
publication version, peer-review status) are not subtypes; a `letter / note /
editorial` field is one. Adding it would replicate the legacy
`journal_article_types` subtype mechanism that this redesign exists to remove.

**Consequences.**
- WoS imports tagged `Letter` or `Note`, PubMed imports tagged `Letter`, and CrossRef
  imports tagged `letter` all become `journal_article` records. The original
  source-system type is preserved as import-provenance metadata — audit data only,
  never read by classification or export logic, never shown to the researcher or
  curator at deposit. Available for backward lookup ("what did WoS originally call
  this") if ever needed.
- COAR export loses the `letter` term — everything exports as `research article`.
  Acceptable loss: COAR consumers can downstream-classify if they care, the data
  was never reliable at type-level (researchers do not all correctly distinguish
  a letter from a short article), and future-proofing wins.
- VABB unaffected. Classification is curator-owned, driven by journal + peer review
  + page count + approved-list membership, not by Biblio type.
- FWO unaffected. FWO pulls journal articles automatically; letters and notes flow
  through as `journal_article`.
- Migration: existing `letter` and `note` records become `journal_article`. The
  legacy distinction is preserved in a one-time migration-audit field for historical
  lookup, not used going forward.

**`review_article` checked against the same logic and kept.** Review is a different
research *activity* (synthesis of existing literature vs. original work), not a
publishing format. Both principle 3 tests pass cleanly: the metadata schema differs
meaningfully (review type, search strategy, scope), and the external world treats
them as distinct (WoS `Review`, COAR `review article`, CrossRef `journal_article` +
review flag). Survives.

**The one workflow that should reopen this.** If curators routinely query "show me
all letters in the queue" as a standard operational task — not "we could in
principle" but "we do this every week" — the import-provenance-only approach is
insufficient. To be confirmed with the curator team. If confirmed, the question
returns as: "is this distinction load-bearing enough to deserve a type, or can the
queue filter run on the source-type audit field?"

---

## Migration matrix

This section maps every legacy type and subtype value (from the i18n keys in
`docs/old-research-output-types.md`) to a destination in the new type system.

Mappings fall into three categories:

- **Mechanical** — one-to-one or driven by a clear sub-classifier. Can be
  migrated by script, no per-record review needed.
- **Curator-review** — the destination depends on record-level context (venue,
  form, scholarly vs. popular framing) that the legacy type alone doesn't
  encode. Per-record review needed.
- **Out of scope for v1** — no v1 destination. Records remain in legacy
  storage until the corresponding TBD type lands or a curator re-classifies.

⚠️ This matrix needs validation by the curator / reviewer team before any migration
script is run. The mechanical rows are reasonably confident; the
curator-review rows are uncertain by design.

### Mechanical mappings

| Legacy key | New `kind` | Notes |
|------------|-----------|-------|
| `dataset` | `dataset` | — |
| `book` | `book` | — |
| `book_chapter` | `book_chapter` | — |
| `dissertation` | `dissertation` | — |
| `journal_article` (no subtype, or subtype `original`) | `journal_article` | — |
| `journal_article_types.review` | `review_article` | New dedicated type for scholarly reviews of literature. |
| `journal_article_types.letterNote` | `journal_article` | Per resolved decision; original WoS / PubMed / CrossRef type preserved as import-provenance metadata only. |
| `journal_article_types.proceedingsPaper` | `conference_paper` | With `proceedings_indicator = yes`. The "proceedings paper published in a journal" boundary case is flagged in Open questions — confirm with curators before migrating. |
| `conference_types.proceedingsPaper` | `conference_paper` | With `proceedings_indicator = yes`. |
| `conference_types.abstract` | `conference_abstract` | — |
| `conference_types.poster` | `conference_poster` | — |
| `conference_types.other` | `conference_presentation` | Lossy by definition — "other" may have included presentations, posters, abstracts, or panels. Curator spot-check recommended. |
| `miscellaneous_types.preprint` | `journal_article` | With `publication_version = submitted version` and the preprint server identifier as `relation = self` on the existing `identifier` field. |
| `miscellaneous_types.report` | `report` | — |
| `miscellaneous_types.workingPaper` | `working_paper` | — |
| `miscellaneous_types.technicalStandard` | `report` | A technical standard is a standalone document with an issuing body — same metadata schema as `report`. |
| `miscellaneous_types.correction` | `journal_article` | Same logic as letter / note: published in a journal, schema identical to `journal_article`. Whether the original "Correction" tag is preserved as import-provenance metadata depends on the source-system type preservation scope question — see Open questions. |
| `miscellaneous_types.editorialMaterial` | `journal_article` | Same logic. |
| `miscellaneous_types.dictionaryEntry` | `book_chapter` | A dictionary entry is a contribution to an edited reference work with ISBN — same schema as `book_chapter`. |
| `miscellaneous_types.encyclopediaEntry` | `book_chapter` | Same logic. |
| `miscellaneous_types.lemma` | `book_chapter` | Same logic. |
| `miscellaneous_types.blogPost` | `research_communication` | Free-text `medium = "blog post"` (or original blog name if known). |
| `miscellaneous_types.magazinePiece` | `research_communication` | Free-text `medium` carries the magazine name. |
| `miscellaneous_types.newsArticle` | `research_communication` | Free-text `medium` carries the publication name. |
| `miscellaneous_types.newspaperPiece` | `research_communication` | Free-text `medium` carries the newspaper name. |

### Role-only migrations (record stays, type does not split)

| Legacy key | Action |
|------------|--------|
| `book_editor` | Record becomes `book` with the depositor recorded as a contributor with `role = editor`. Editor is no longer a type — it is a contributor role on `book` records. |

### Curator-review mappings

These cases need per-record review because the destination depends on context
not encoded in the legacy type alone (typically: scholarly venue vs. popular
venue, or standalone publication vs. embedded contribution).

| Legacy key | Likely destinations | What the curator decides |
|------------|--------------------|--------------------------|
| `issue_editor` | `book` (with editor role), or split into multiple `journal_article` records linked together, or remain unmapped | Whether a guest-edited journal special issue is treated as an edited volume (book) or as a set of articles. Boundary case — needs explicit curator decision. |
| `miscellaneous_types.artReview` | `journal_article` (peer-reviewed venue) or `research_communication` (popular venue) | Was it published in a scholarly journal or in a magazine / newspaper / blog? |
| `miscellaneous_types.bookReview` | Same as artReview | Same. |
| `miscellaneous_types.exhibitionReview` | Same | Same. |
| `miscellaneous_types.filmReview` | Same | Same. |
| `miscellaneous_types.musicReview` | Same | Same. |
| `miscellaneous_types.productReview` | Same | Same. |
| `miscellaneous_types.theatreReview` | Same | Same. |
| `miscellaneous_types.biography` | `book` (standalone scholarly biography), `journal_article` (biographical sketch in a journal), or `research_communication` (popular biographical piece) | Form and venue. |
| `miscellaneous_types.bibliography` | `book` (standalone published bibliography), `journal_article` (short list in a journal), or `report` (institutional bibliography) | Form and venue. |
| `miscellaneous_types.manual` | `report` (institutional / technical manual) or `book` (published with ISBN) | Whether it has an ISBN and was issued through a publisher. |
| `miscellaneous_types.lectureSpeech` | `conference_presentation` (scholarly venue) or `research_communication` (public venue: museum, festival, community event) | Was the venue scholarly or public? |
| `miscellaneous_types.musicEdition` | `book` (published score), or eventually `musical_notation` / `critical_edition` if those TBD types land | If the TBD types land, re-classify; otherwise default to `book` when ISBN is present. |
| `miscellaneous_types.textEdition` | `book` (published edition), or eventually `critical_edition` (TBD) | Same logic. |
| `miscellaneous_types.textTranslation` | `book` (standalone published translation) or `journal_article` (translation embedded in an article) | Form. Note: translation is the work, not a separate type. |
| `miscellaneous_types.other` | Per-record curator review | Catch-all. Most likely targets: `research_communication`, `report`, or `journal_article`. No automatic destination. |

### Out of scope for v1

| Legacy key | Status |
|------------|--------|
| `miscellaneous_types.artisticWork` | No v1 destination. Per the doc, artistic works are out of scope for v1; revisit when volume at UGent warrants it. Records remain in legacy storage. |

### What this matrix does not cover

- **The `book_editor` and `issue_editor` legacy types as curator workload.**
  Mechanical conversion of `book_editor` records to `book` + editor role is
  scriptable, but the conversion needs the depositor's contributor record to
  exist and be linkable. Records where the depositor's identity is unclear
  fall into curator review.
- **Records with multiple legacy subtype values** (where a record was
  re-classified in legacy and carries history). Migration script should
  read the most recent value; legacy history preserved in audit metadata.
- **Provenance preservation for the merged `journal_article` path.** The
  resolved decision commits to preserving the original WoS / PubMed / CrossRef
  type as import-provenance metadata for letter and note specifically. Whether
  the same treatment applies to correction, editorial material, and other
  migrated cases is the source-system audit scope question — see Open
  questions. The implementation question (where the audit data lives in
  raven) is in Open questions for raven.

---

## To be discussed

These types from other systems were considered and not rejected, but require further
investigation before a decision can be made. They are explicitly out of scope for v1.

**`musical_notation`** (Musical score or notation)
A musical score, sheet music, or other notated musical work produced as part of
research — musicology, composition as research practice, or digital editions of
historical scores. Relevant at UGent's humanities faculties and the Boekentoren
heritage collection. Both principle 3 tests likely pass: distinct metadata schema
(composer, instrumentation, edition, notation format) and COAR recognises it as a
distinct type. Volume at UGent humanities needs confirmation.

**`transcription`** (Scholarly transcription)
An edited transcription of a manuscript, archival document, oral recording, or
other primary source. Common in history, linguistics, literary studies, and digital
humanities. Distinct from the source document — the intellectual contribution is
the transcription and editorial apparatus. COAR 3.2 added this in version 3.1.
Both principle 3 tests likely pass. Needs confirmation with humanities faculty
librarians.

**`critical_edition`** (Critical edition)
An edited version of an existing text with scholarly apparatus — introductory
notes, variants, critical commentary. Common in literary studies, classical
philology, history, and theology. Distinct from `book` because the primary
intellectual contribution is editorial rather than authorial. HAL (French national
repository) recognises this as a distinct type; COAR covers it under `book` which
is a weaker fit. Both principle 3 tests likely pass. Needs confirmation with
humanities faculty librarians.

**`data_management_plan`** (Data Management Plan)
**`project_deliverable`** (Project Deliverable)
**`project_milestone`** (Project Milestone)
**`proposal`** (Proposal)
These are project management artefacts from Zenodo's vocabulary. At UGent, the
administrative tool GISMO handles project reporting to FWO and other funders.
GISMO consumes Biblio's OAI-PMH feed. Whether these artefact types should live in
Biblio (as research output) or exclusively in GISMO (as administrative records)
needs a decision involving the GISMO team and FWO reporting requirements. They
fail principle 2 as currently understood — a project milestone cannot state its
connection to a specific research activity in one sentence — but FWO reporting
obligations may override that judgment.

**`thesis`** (master's thesis, bachelor's thesis)
Theses below doctoral level are currently managed in separate institutional
software outside Biblio. Whether they should also be deposited in Biblio — for
discoverability, OA compliance, or completeness — is an open question that requires
a decision involving the relevant institutional stakeholders. This is not a type
design question; it is a scope question about what belongs in Biblio at all.

---

## Relationship to other documents

- `DOMAIN.md` — `kind` values must be updated to match the finalised type list here.
- `PRODUCT.md` — Output types section and field requirements workshop depend on this.
- `RESPONSIBILITY.md` — Field ownership per type will be defined after types are settled.
- `docs/old-research-output-types.md` — Legacy strings; the source list every legacy key is mapped from in the Migration matrix above.
