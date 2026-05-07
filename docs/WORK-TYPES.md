# WORK-TYPES.md
# Research output type redesign — decisions, principles, and obligations

Version 0.3 — May 2026

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

Examples of both tests passing: `dataset` vs `journal-article` — different fields,
different identifier infrastructure (DataCite vs CrossRef), different FWO reporting
category. Separate types correct.

Examples of only one test passing: a conference paper vs a conference short paper —
near-identical metadata schema (same fields, just shorter), external world does not
distinguish. Short paper is a context note on `conference-paper`, not a type.

Parts and wholes follow the same logic. A book chapter is a separate type from a
book because both tests pass: the metadata schema is substantially different (parent
title, parent ISBN, page range, editor), and the external world treats them as
distinct (different CrossRef type, different VABB category). The parent book link on
a book chapter record is required, not optional. Multiple ISBNs are supported to
handle series. Whether a work is part of a series or collection is captured by a
required indicator field, not by a separate type.

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

TBD: A podcast is not a new type. It is `research-communication` with a
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
- Journal articles, including reviews (peer-reviewed, 4+ pages, in approved journal list — letters and notes also fall under `journal-article`)
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

**Impact on type design:** `journal-article` and `review-article` must be unambiguous
types in Biblio. FWO pulls journal article metadata automatically — errors in type
assignment propagate directly into funding reports. Letters and notes were dropped
as separate types in v0.3 — they are `journal-article` records.

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

**Impact on type design:** CrossRef distinguishes `journal-article`, review, letter,
and proceedings-article. Of these, only review and proceedings-paper are first-class
type choices in Biblio. CrossRef `journal-article` and CrossRef `letter` both import
as Biblio `journal-article` (see Resolved decisions for the letter/note rationale).
The CrossRef-original-type is preserved as import-provenance metadata.

---

## Proposed type list

These seventeen types are intended to cover approximately 90% of research output at UGent.
Each has a positive definition. None is a residual category. Eight further candidates
are flagged ⚠️ TBD at the bottom of the table — they are under discussion and not part
of v1. See "To be discussed" for full rationale on each.

The internal `kind` uses plain hyphenated descriptive identifiers. No namespace
prefix. Each identifier is self-explanatory and aligns with the naming conventions
of COAR, CrossRef, and DataCite where possible, making the mapping layer easier
to maintain.

| Researcher label | Internal `kind` | Core question answered |
|-----------------|----------------|----------------------|
| Journal article | `journal-article` | Original research article published in a peer-reviewed journal? |
| Review article | `review-article` | Critical synthesis or review published in a peer-reviewed journal? |
| Book | `book` | A standalone monograph with ISBN? |
| Book chapter | `book-chapter` | A contribution to an edited volume? |
| Conference paper | `conference-paper` | Full paper or extended abstract presented at a scholarly conference, with a written component in proceedings or programme? |
| Conference abstract | `conference-abstract` | Abstract-only submission to a scholarly conference, not published as a full paper? |
| Poster | `conference-poster` | A poster presented at a scholarly venue? |
| Presentation | `conference-presentation` | A standalone presentation at a scholarly venue? |
| Dissertation | `dissertation` | A degree-granting thesis? |
| Dataset | `dataset` | A structured collection of data for reuse? |
| Software | `software` | A citable software artefact? |
| Report | `report` | A standalone document produced by or for an organisation, not peer-reviewed as a journal? |
| Working paper | `working-paper` | A pre-publication research paper circulated for comment, typically in a series? |
| Policy report | `policy-report` | An evidence-based document addressed to decision-makers or public bodies? |
| Annotation | `annotation` | A single citable annotation on an existing resource? |
| Annotation collection | `annotation-collection` | A structured collection of annotations on existing resources? |
| Research communication | `research-communication` | Research-derived output delivered in a public, non-scholarly venue? |
| ⚠️ TBD **Musical notation** | `musical-notation` | A musical score or notation produced as part of research? |
| ⚠️ TBD **Transcription** | `transcription` | A scholarly transcription of a manuscript or primary source? |
| ⚠️ TBD **Critical edition** | `critical-edition` | A critically edited version of an existing text? |
| ⚠️ TBD **Data management plan** | `data-management-plan` | A formal data management plan for a research project? |
| ⚠️ TBD **Project deliverable** | `project-deliverable` | A formal deliverable submitted to a project funder? |
| ⚠️ TBD **Project milestone** | `project-milestone` | A formal milestone marker for a research project? |
| ⚠️ TBD **Proposal** | `proposal` | A research proposal submitted to a funder? |
| ⚠️ TBD **Thesis (sub-doctoral)** | `thesis` | A bachelor's or master's thesis (scope question — see To be discussed)? |

### Type definitions

| Type | Definition | Examples | Not | Notes |
|------|-----------|---------|-----|-------|
| **Journal article** `journal-article` | Original research article, short communication, letter, note, or correspondence published in a peer-reviewed journal. | Experimental study; observational study; original clinical trial; computational study; letter to the editor; brief communication; technical note; correction; erratum | A review article (→ `review-article`); a conference paper published in a journal (→ TBD) | Maps to CrossRef `journal-article`, COAR `research article`, WoS `Article`. A submitted-version preprint is not a separate type — it is a `journal-article` with publication version `submitted version`. Letters and notes were dropped as separate types — see Resolved decisions for the reasoning and import-provenance handling. |
| **Review article** `review-article` | A critical synthesis or systematic review of existing literature, published in a peer-reviewed journal. | Systematic review; meta-analysis; narrative review; scoping review; literature survey | An original research article reporting new data (→ `journal-article`) | Maps to CrossRef `journal-article` + review flag, COAR `review article`, WoS `Review`. VABB A1/A2 eligible. Kept as a separate type because review is a different research activity (synthesis vs. original work), not a publishing format — both principle 3 tests pass cleanly. |
| **Book** `book` | A standalone scholarly monograph published with an ISBN. Includes authored and edited volumes. | Research monograph; edited volume; handbook; critical anthology | A book chapter (→ `book-chapter`); a report with an ISBN issued by an institution (→ `report`) | Editor role is a contributor role field, not a separate type. Series membership captured by a series indicator field. |
| **Book chapter** `book-chapter` | A defined contribution to an edited book, with its own title and authorship, published within a volume with an ISBN. | Chapter in an edited volume; entry in a handbook; contribution to a Festschrift | A standalone report (→ `report`); a journal article (→ `journal-article`) | Always linked to a parent book record. Parent link is required, not optional. |
| **Conference paper** `conference-paper` | A full paper or extended abstract presented at a scholarly conference and published in proceedings or a conference programme. | Proceedings paper with ISBN/ISSN; extended abstract in a programme; short paper in conference proceedings | A poster (→ `conference-poster`); slides only (→ `conference-presentation`); abstract only (→ `conference-abstract`) | Proceedings indicator field (yes/no) required — drives COAR mapping and VABB C1 eligibility. |
| **Conference abstract** `conference-abstract` | An abstract-only submission to a scholarly conference, not accompanied by a full paper. | Meeting abstract in a conference booklet; congress abstract; symposium abstract | A full paper in proceedings (→ `conference-paper`); a poster (→ `conference-poster`) | Not VABB-eligible. Maps to COAR `conference object`. Typically no DOI. |
| **Poster** `conference-poster` | A display poster presented at a scholarly venue — conference, symposium, workshop, or seminar. | Research poster at a conference; poster at a doctoral symposium; poster at an academic workshop | A poster at a public science festival (→ `research-communication`) | The `conference-` prefix follows COAR convention; scope is not limited to conferences. If a full paper exists in proceedings, deposit that as `conference-paper` and link the poster. |
| **Presentation** `conference-presentation` | A set of slides or documented talk presenting research at a scholarly venue. | Invited talk slides; keynote deck; seminar presentation; guest lecture at a university | A public lecture at a museum or community event (→ `research-communication`) | A recording of a presentation is a related output — attach as a file linked to this record. |
| **Dissertation** `dissertation` | A thesis submitted in fulfilment of a degree requirement. | Doctoral dissertation; master's thesis | A bachelor's thesis (scope question — see To be discussed) | Degree, supervisor, and institution are required fields. |
| **Dataset** `dataset` | A structured, documented collection of data produced for reuse by others, with a persistent identifier. | Survey data with codebook; experimental measurements; annotated corpus; genomic data deposited at EGA or ENA | Any internal analysis file or spreadsheet; a database that is internal tooling (→ `software`) | DOI via DataCite preferred. Intent to make data reusable and citable is the criterion. |
| **Software** `software` | A citable software artefact produced as part of research, with a persistent identifier or versioned repository URL. | Research tool with DOI on Zenodo; analysis pipeline on GitHub with version tag; R or Python package | An analysis script used once and not intended for reuse; a commercial tool the researcher used but did not produce | Version and licence are required fields. |
| **Report** `report` | A standalone document produced by or for an organisation, not published through journal or book peer review. Requires an issuing body. | Institutional research report; technical report; research report to a funder | A working paper in a series (→ `working-paper`); a policy brief (→ `policy-report`); a peer-reviewed article (→ `journal-article`) | Technical reports, internal reports, and research reports all use this type. |
| **Working paper** `working-paper` | A pre-publication research paper circulated for comment, typically issued in a numbered series by an institution or research group. | NBER working paper; IZA discussion paper; departmental working paper; SSRN preprint in a series | A finalised institutional report (→ `report`); a published journal article (→ `journal-article`) | VABB R1 eligible when published with ISBN/ISSN. Series name and institution are required fields. Maps to COAR `working paper`. Distinct from a `journal-article` with `submitted version` — a working paper is a standalone document in a series; a preprint is a state of an article. |
| **Policy report** `policy-report` | An evidence-based document addressed to decision-makers — government bodies, regulators, or public institutions — with the explicit purpose of informing a decision or policy. | Policy brief; advisory report; government commission report; regulatory submission | A general institutional report (→ `report`); a journal article (→ `journal-article`) | Target audience (the decision-making body) is a required field. Maps to COAR `policy report`. Not VABB-eligible. |
| **Annotation** `annotation` | A single, citable annotation applied to a specific existing resource — text, image, dataset, or other primary source. The annotated resource is a required parent link. | A TEI annotation on a manuscript line; a scholarly note attached to a corpus sentence | A collection of annotations (→ `annotation-collection`); inline commentary in a book chapter (→ `book-chapter`) | Distinct from `annotation-collection` as `book-chapter` is from `book` — both principle 3 tests pass. |
| **Annotation collection** `annotation-collection` | A structured set of annotations applied to one or more existing resources, with a documented annotation scheme. | A TEI-encoded annotated corpus; a named entity recognition dataset with annotation guidelines | A dataset without annotation structure (→ `dataset`); a book with scholarly commentary (→ `book-chapter`) | Annotation scheme (e.g. TEI, Web Annotation, CATMA) is a required field. **⚠️ TBD:** Volume at UGent needs confirmation — confirm with humanities faculty librarians. |
| **Research communication** `research-communication` | Research-derived output delivered in a public, non-scholarly venue, where the purpose is to make research accessible beyond academia. | Newspaper or magazine article; opinion piece; blog post; public podcast episode; popular science book; radio or TV appearance; public lecture at a museum or festival | A seminar talk at a university (→ `conference-presentation`); a scholarly review article (→ `review-article`); anything where the link to a specific research activity cannot be stated | Medium field required (e.g. `blog post`, `podcast`, `newspaper article`). Trash-bucket test: if you cannot answer "which research does this communicate?", it does not belong here. No VABB, FWO, or FRIS obligation. |

---

## Fields to be defined

The type system depends on several metadata fields that are referenced throughout
this document but not yet fully specified. These must be defined before any type
is considered implementation-ready. Field definitions are a separate deliverable
from type definitions — they require input from curators, the backend developer,
and in some cases policy confirmation.

**Publication version**
Values aligned with COAR Version Type vocabulary and NISO/ALPSP JAV:
`submitted version`, `accepted version`, `published version`.
Required fields when version is `submitted version`: server name, server identifier
(arXiv ID, bioRxiv DOI, etc.).
This is the field that captures preprint state. A preprint is not a type — it is a
`journal-article` (or other applicable type) with publication version `submitted
version` and a server identifier. The legacy system's `miscellaneous_types.preprint`
subtype is replaced by this field. See "What is not a type" below.
Owner: to be confirmed. Applies to: all types.

**Proceedings indicator**
A required boolean field on `conference-paper`: was this paper published in a formal
proceedings volume with an ISBN or ISSN? Values: `yes` / `no`. Drives three
downstream consequences: (1) COAR mapping — `conference paper` when yes,
`conference paper not in proceedings` when no; (2) VABB C1 eligibility — only
applies when yes and ISBN/ISSN is present; (3) citation format — proceedings
citations require publisher and proceedings title; non-proceedings citations do not.
Required for all `conference-paper` records.
Owner: researcher-provided at deposit, curator-correctable.

**Medium**
To be discussed: A free field field(?) applying to `research-communication`. Captures the
format of public delivery: `newspaper article`, `magazine article`, `blog post`,
`podcast`, `video`, `radio or TV appearance`, `popular science book`, etc.
Vocabulary is maintained by curators and versioned over time. New formats are added
to the vocabulary — they do not become types. Deprecated terms are retained for
historical records but hidden from the deposit UI. Required for all
`research-communication` records.

Note: a recording of a `conference-presentation` is not a separate type or medium
value. It is a related output — attach the recording as a file linked to the
presentation record. Course materials not linked to a specific research activity
fail principle 2 and do not belong in Biblio.
Owner: curators maintain the vocabulary. Researcher provides value at deposit.

**Context**
A free-text field available on all types. For a researcher to describe their output
in their own words when no medium term or type label fits precisely. Not indexed as
a type or classification. Not a substitute for structured fields. Curators can use
it as a signal during review.
Owner: researcher. No controlled vocabulary.

**Annotation scheme**
Required for `annotation-collection`. Captures the standard or framework used
(e.g. TEI, Web Annotation, CATMA). Controlled vocabulary or free-text — to be
confirmed with the digital humanities community at UGent.
Owner: researcher-provided at deposit.

**Series indicator and parent link**
For `book-chapter` and `annotation-collection`: the parent record is a required
link, not optional. For `book`: a series indicator field flags whether the book is
part of a series, enabling multiple ISBN support. Schema to be confirmed with the
backend developer.
Owner: researcher-provided at deposit, curator-correctable.

**Policy report audience**
Required for `policy-report`: the target decision-making body or institution the
report is addressed to. Free-text or controlled vocabulary — to be confirmed.
Owner: researcher-provided at deposit.

**Working paper series**
Required for `working-paper`: the name of the series and the issuing institution.
Series number is optional but recommended.
Owner: researcher-provided at deposit.

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
| **Journal article** | `journal-article` | Article | `journal-article` | Journal Article | literature → journal article | `@article` |
| **Review article** | `review-article` | Review | `journal-article` (+ review flag) | Review | literature → review article | `@article` |
| **Book** | `book` | Book | `book`; `edited-book` | Book | literature → book | `@book` |
| **Book chapter** | `book-chapter` | Book Chapter | `book-chapter` | Book Section | literature → part of book | `@incollection`; `@inbook` |
| **Conference paper** | `conference-paper` | Proceedings Paper | `proceedings-article`; `book` | Conference Paper | literature → conference paper | `@inproceedings` |
| **Conference abstract** | `conference-abstract` | Meeting Abstract | — | — | ≈ literature → conference object | ≈ `@misc` |
| **Poster** | `conference-poster` | — | — | — | ≈ literature → conference object | ≈ `@misc` |
| **Presentation** | `conference-presentation` | — | — | — | ≈ literature → conference object | ≈ `@misc` |
| **Dissertation** | `dissertation` | — | `dissertation` | Dissertation; Thesis | literature → thesis | `@phdthesis`; `@mastersthesis` |
| **Dataset** | `dataset` | Data Paper | `dataset` | — | dataset | ≈ `@misc` |
| **Software** | `software` | Software | `software` | — | software | ≈ `@misc` |
| **Report** | `report` | Report | `report` | Technical Report | ≈ literature → other research product | `@techreport` |
| **Working paper** | `working-paper` | — | `posted-content` | — | ≈ literature → working paper | `@techreport` |
| **Policy report** | `policy-report` | — | `report` | — | ≈ literature → other research product | `@techreport` |
| **Annotation** | `annotation` | — | — | — | ≈ literature → other research product | ≈ `@misc` |
| **Annotation collection** | `annotation-collection` | — | — | — | ≈ literature → other research product | ≈ `@misc` |
| **Research communication** ⚠️ | `research-communication` | — | — | — | — | ≈ `@misc` |

**Note on life sciences repositories (EGA, ENA, BioStudies, ENA BioProject, Ensembl, Handle):**
These systems apply only to datasets. They do not carry publication type vocabularies —
they use study types, data types, and accession identifiers. A record from any of
these sources is always imported to Biblio as `dataset`, with the repository
accession as the persistent identifier. They are not export targets.

**Note on letter and note imports.** Records imported from WoS as `Letter` or `Note`,
from PubMed as `Letter`, or from CrossRef as `letter`, are stored as `journal-article`
in Biblio. The original source-system type value is preserved as import-provenance
metadata only — it is not a classification field, is not read by any export pipeline,
and is not shown in the deposit UI. See Resolved decisions for the rationale.

### Export targets

What label Biblio sends when exporting a record to each target system.

| Researcher label | Biblio `kind` | COAR 3.2 | DataCite 4.6 | OpenAIRE | VABB | FRIS / FWO |
|-----------------|--------------|----------|-------------|----------|------|------------|
| **Journal article** | `journal-article` | ✅ `research article` | ✅ `JournalArticle` | ✅ literature | A1 / A2 | ✅ publication (FWO mandatory) |
| **Review article** | `review-article` | ✅ `review article` | ✅ `JournalArticle` | ✅ literature | A1 / A2 | ✅ publication (FWO mandatory) |
| **Book** | `book` | ✅ `book` | ✅ `Text / Book` | ✅ literature | B1 | ✅ publication |
| **Book chapter** | `book-chapter` | ✅ `book part` | ✅ `Text / BookChapter` | ✅ literature | B2 | ✅ publication |
| **Conference paper** | `conference-paper` | ✅ `conference paper` | ✅ `Text / ConferencePaper` | ✅ literature | C1 | ✅ publication |
| **Conference abstract** | `conference-abstract` | ✅ `conference object` | ≈ `Text / Other` | ≈ literature | — | publication |
| **Poster** | `conference-poster` | ✅ `conference poster` | ≈ `Text / Other` | ≈ literature | — | publication |
| **Presentation** | `conference-presentation` | ✅ `conference presentation` | ≈ `Text / Other` | ≈ literature | — | publication |
| **Dissertation** | `dissertation` | ✅ `thesis` | ✅ `Text / Dissertation` | ✅ literature | — | ✅ publication |
| **Dataset** | `dataset` | ✅ `dataset` | ✅ `Dataset` | ✅ dataset | — | ✅ dataset (FWO mandatory) |
| **Software** | `software` | ✅ `software` | ✅ `Software` | ✅ software | — | ✅ publication |
| **Report** | `report` | ✅ `report` | ✅ `Text / Report` | ≈ literature | — | ✅ publication |
| **Working paper** | `working-paper` | ✅ `working paper` | ✅ `Text / Report` | ✅ literature | R1 (with ISBN/ISSN) | ✅ publication |
| **Policy report** | `policy-report` | ✅ `policy report` | ≈ `Text / Report` | ≈ other research product | — | publication |
| **Annotation** | `annotation` | ✅ `annotation` | ≈ `Text / Other` | ≈ other research product | — | publication |
| **Annotation collection** | `annotation-collection` | ✅ `annotation collection` | ≈ `Text / Other` | ≈ other research product | — | publication |
| **Research communication** | `research-communication` | ≈ `other (text)` | ≈ `Text / Other` | ≈ other research product | — | publication |

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
- **Proceedings indicator** (yes/no) on `conference-paper` — see Fields to be defined.
- **OA status** — per-file field.
- **Peer review status** — metadata field.
- **Medium** — see Fields to be defined.
- **Context** — see Fields to be defined.
- **Editor role** — contributor role field on book records.
- **Letter and note** — not separate types. Both are `journal-article`. Letters and
  notes encode a print-era publishing format that is in active decline, fail
  principle 3, and were dropped. A subtype-as-field replacement
  (e.g. `article-form` with values `letter`, `note`, `editorial`) was considered
  and rejected as a violation of the no-subtypes rule. WoS / PubMed / CrossRef
  source-system type values are preserved as import-provenance metadata only.
  See Resolved decisions for full reasoning.
- **Technical report, research report** — use `report`. Distinguish in context field if needed.
- **Conference short paper** — use `conference-paper`. A short paper has the same metadata schema; length is not a type distinction.
- **Artistic works, patents** — out of scope for v1; revisit when volume at UGent warrants it.

---

## Open questions

- **Policy report and report as separate types vs. combined.** The current proposal
  treats `policy-report` as a distinct top-level type from `report`. Both share most
  of their schema; the only structurally distinct field is target audience
  (decision-making body) on `policy-report`. The case for the split is contested.

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
    collapses both to `Text / Report` (≈); OpenAIRE actually maps `policy-report`
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
  published in a journal with an ISSN — is it `conference-paper` (C1) or
  `journal-article` (A1)? VABB cares. WoS calls it "Proceedings Paper" even when
  in a journal. No decision yet. ⚠️ TBD — confirm with curators.
- **Lecture as a type:** Not added. `conference-presentation` covers slides and
  documented talks at scholarly venues. A recording of a presentation is a related
  output attached to the presentation record. Course material not linked to a
  specific research activity fails principle 2 and belongs in an educational
  repository. Confirm with faculty librarians.
- **Working paper vs. report:** `working-paper` requires a series and institution.
  A standalone document with an issuing body but no series is `report`. Confirm this
  boundary is sufficient for VABB R1 eligibility.
- **Software and VABB:** Software is not VABB-eligible. Confirm that `software` type
  records are excluded from VABB validation queries without manual intervention.
- **Mapping table validation:** The table above needs review by the backend developer
  against live schema versions of COAR, CrossRef, DataCite, and FRIS before any
  import/export pipeline is built.

---

## Resolved decisions

This section records type decisions made after the initial proposal, with the
reasoning preserved so future readers understand the trade-offs.

### `journal-letter` and `journal-note` dropped

Both were proposed as separate types in v1.0–1.2. Both are dropped. They fold into
`journal-article`. **No replacement field is added.**

**Reasoning.** Principle 3 fails for both. Schema is identical to `journal-article`.
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
  imports tagged `letter` all become `journal-article` records. The original
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
  through as `journal-article`.
- Migration: existing `letter` and `note` records become `journal-article`. The
  legacy distinction is preserved in a one-time migration-audit field for historical
  lookup, not used going forward.

**`review-article` checked against the same logic and kept.** Review is a different
research *activity* (synthesis of existing literature vs. original work), not a
publishing format. Both principle 3 tests pass cleanly: the metadata schema differs
meaningfully (review type, search strategy, scope), and the external world treats
them as distinct (WoS `Review`, COAR `review article`, CrossRef `journal-article` +
review flag). Survives.

**The one workflow that should reopen this.** If curators routinely query "show me
all letters in the queue" as a standard operational task — not "we could in
principle" but "we do this every week" — the import-provenance-only approach is
insufficient. To be confirmed with the curator team. If confirmed, the question
returns as: "is this distinction load-bearing enough to deserve a type, or can the
queue filter run on the source-type audit field?"

---

## To be discussed

These types from other systems were considered and not rejected, but require further
investigation before a decision can be made. They are explicitly out of scope for v1.

**`musical-notation`** (Musical score or notation)
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

**`critical-edition`** (Critical edition)
An edited version of an existing text with scholarly apparatus — introductory
notes, variants, critical commentary. Common in literary studies, classical
philology, history, and theology. Distinct from `book` because the primary
intellectual contribution is editorial rather than authorial. HAL (French national
repository) recognises this as a distinct type; COAR covers it under `book` which
is a weaker fit. Both principle 3 tests likely pass. Needs confirmation with
humanities faculty librarians.

**`data-management-plan`** (Data Management Plan)
**`project-deliverable`** (Project Deliverable)
**`project-milestone`** (Project Milestone)
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
- `docs/old-research-output-types.md` — Legacy i18n strings; reference for migration scope.
