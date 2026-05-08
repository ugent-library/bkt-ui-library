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

## Three layers

What a researcher sees at deposit, what Biblio stores internally, and what
external systems receive are three distinct layers. They do not need to be
identical.

- **Researcher-facing label** — Biblio's own vocabulary, optimised for clarity
  at deposit.
- **Internal `kind`** — the stable identifier used in the database and codebase.
- **External schema** — COAR, DataCite, CrossRef, VABB, FRIS — what the mapping
  layer translates to at import and export time.

This separation is what makes it possible to have a flat, simple deposit UI
without lying to external systems. A researcher never sees the mapping layer.
Some decisions in this document only make sense once this three-layer view is in
place — read them through that lens. Full elaboration in Mapping architecture
further down.

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

**Curators are not a migration mechanism.** Migration from legacy types to the new
type system cannot rely on per-record curator review as its primary path. The curator
team is too small to be the safety net for hundreds of thousands of legacy records,
and the rule above — that curator work is quality review and classification, not
metadata completion — applies as much to historical data as to new deposits. The
implications of this constraint for the migration matrix are deferred; the rule
itself stands now.

**Biblio is a primary source.** Type decisions have long-term consequences. External
systems (OpenAlex, WoS, FRIS, DataCite) index from Biblio. Getting type wrong means
wrong data in every downstream system, permanently, until someone corrects it record
by record.

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
- Reports issued in a series with ISBN/ISSN (what was historically called a "working paper" — R1 eligibility computed at export time from `series_indicator = yes` AND series ISBN/ISSN; see Resolved decisions § "`working_paper` merged into `report`")

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

These twenty types are intended to cover approximately 95% of research output at UGent.
Each has a positive definition. None is a residual category. Four further candidates
are flagged ⚠️ TBD at the bottom of the table — they are under discussion and not part
of v1. See "To be discussed" for full rationale on each.

A further set of candidates that were considered and explicitly rejected are
documented in "What is not a type" (image, video, website, peer review — these
are attachments or media, not types) and "Out of scope (handled by other
systems)" (proposal, patent, DMPs, project deliverables, sub-doctoral theses).

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
| Report | `report` | A standalone document produced by or for an organisation, with optional series membership? |
| Policy report | `policy_report` | An evidence-based document addressed to decision-makers or public bodies? |
| Annotation | `annotation` | A single citable annotation on an existing resource? |
| Review | `review` | A scholarly review of a single specific work — book, film, exhibition, performance, etc.? |
| Popular article | `popular_article` | A research-derived article in a newspaper, magazine, or popular periodical? |
| Online publication | `online_publication` | A research-derived blog post or web article? |
| Broadcast appearance | `broadcast_appearance` | A research-derived appearance on radio, TV, or in a podcast? |
| Public lecture | `public_lecture` | A research-derived public talk at a museum, festival, or community event? |
| Popular book | `popular_book` | A popular-science book aimed at a general audience? |
| ⚠️ TBD **Musical notation** | `musical_notation` | A musical score or notation produced as part of research? |
| ⚠️ TBD **Transcription** | `transcription` | A scholarly transcription of a manuscript or primary source? |
| ⚠️ TBD **Critical edition** | `critical_edition` | A critically edited version of an existing text? |
| ⚠️ TBD **Workflow** | `workflow` | A citable computational or research workflow? |

### Type definitions

| Type | Definition | Examples | Not | Notes |
|------|-----------|---------|-----|-------|
| **Journal article** `journal_article` | Original research article, short communication, letter, note, or correspondence published in a peer-reviewed journal. | Experimental study; observational study; original clinical trial; computational study; letter to the editor; brief communication; technical note; correction; erratum; **data paper** describing a dataset; **software paper** describing a research tool | A review article (→ `review_article`); a conference paper also published in a journal (→ see Resolved decisions § "Proceedings paper published in a journal") | Maps to CrossRef `journal_article`, COAR `research article`, WoS `Article`. A submitted-version preprint is not a separate type — it is a `journal_article` with publication version `submitted version` (see Export consequence in Fields to be defined: preprints export as COAR `preprint` `c_816b`, not `research article`). Letters and notes were dropped as separate types — see Resolved decisions for the reasoning and import-provenance handling. Data papers and software papers route here too — see Open questions § "Data papers and software papers" for reasoning and counter-argument. |
| **Review article** `review_article` | A critical synthesis or systematic review of existing literature, published in a peer-reviewed journal. | Systematic review; meta-analysis; narrative review; scoping review; literature survey | An original research article reporting new data (→ `journal_article`) | Maps to CrossRef `journal_article` + review flag, COAR `review article`, WoS `Review`. VABB A1/A2 eligible. Kept as a separate type because review is a different research activity (synthesis vs. original work), not a publishing format — both principle 3 tests pass cleanly. |
| **Book** `book` | A standalone scholarly monograph published with an ISBN. Includes authored and edited volumes. | Research monograph; edited volume; handbook; critical anthology | A book chapter (→ `book_chapter`); a report with an ISBN issued by an institution (→ `report`) | Editor role is a contributor role field, not a separate type. Series membership captured by a series indicator field. |
| **Book chapter** `book_chapter` | A defined contribution to an edited book, with its own title and authorship, published within a volume with an ISBN. | Chapter in an edited volume; entry in a handbook; contribution to a Festschrift | A standalone report (→ `report`); a journal article (→ `journal_article`) | Parent ISBN required at deposit (the durable anchor — works whether or not the parent book is in Biblio). When the parent book is a Biblio record, raven resolves the ISBN to a record-to-record link automatically. |
| **Conference paper** `conference_paper` | A full paper or extended abstract presented at a scholarly conference and published in proceedings or a conference programme. | Proceedings paper with ISBN/ISSN; extended abstract in a programme; short paper in conference proceedings | A poster (→ `conference_poster`); slides only (→ `conference_presentation`); abstract only (→ `conference_abstract`) | Proceedings indicator field (yes/no) required — drives COAR mapping and VABB C1 eligibility. |
| **Conference abstract** `conference_abstract` | An abstract-only submission to a scholarly conference, not accompanied by a full paper. | Meeting abstract in a conference booklet; congress abstract; symposium abstract | A full paper in proceedings (→ `conference_paper`); a poster (→ `conference_poster`) | Not VABB-eligible. Maps to COAR `conference object`. Typically no DOI. |
| **Poster** `conference_poster` | A display poster presented at a scholarly venue — conference, symposium, workshop, or seminar. | Research poster at a conference; poster at a doctoral symposium; poster at an academic workshop | A poster at a public science festival (→ `public_lecture` if accompanied by a talk; otherwise marginal v1 case) | The `conference-` prefix follows COAR convention; scope is not limited to conferences. If a full paper exists in proceedings, deposit that as `conference_paper` and link the poster. |
| **Presentation** `conference_presentation` | A set of slides or documented talk presenting research at a scholarly venue. | Invited talk slides; keynote deck; seminar presentation; guest lecture at a university | A public lecture at a museum or community event (→ `public_lecture`); a TV/radio/podcast appearance (→ `broadcast_appearance`) | A recording of a presentation is a related output — attach as a file linked to this record. |
| **Dissertation** `dissertation` | A thesis submitted in fulfilment of a degree requirement. | Doctoral dissertation; master's thesis | A bachelor's thesis (out of scope — handled by separate institutional software, see "Out of scope") | Degree, supervisor, and institution are required fields. |
| **Dataset** `dataset` | A structured, documented collection of data produced for reuse by others, with a persistent identifier. | Survey data with codebook; experimental measurements; annotated corpus; genomic data deposited at EGA or ENA | Any internal analysis file or spreadsheet; a database that is internal tooling (→ `software`) | DOI via DataCite preferred. Intent to make data reusable and citable is the criterion. |
| **Software** `software` | A citable software artefact produced as part of research, with a persistent identifier or versioned repository URL. | Research tool with DOI on Zenodo; analysis pipeline on GitHub with version tag; R or Python package | An analysis script used once and not intended for reuse; a commercial tool the researcher used but did not produce; **a software paper describing a research tool (→ `journal_article`)** | Version and licence are required fields. COAR distinguishes `software` (`c_5ce6`, the artefact) from `software paper` (`c_7bab`, the article describing the artefact); Biblio uses `software` only for the artefact. The article describing it is a `journal_article` with a `related_identifier` linking back to this software record — see Resolved decisions for reasoning and counter-argument. |
| **Report** `report` | A standalone document produced by or for an organisation, not published through journal or book peer review. Requires an issuing body. Absorbs what was historically called a "working paper" — a report issued in a numbered series is still a `report`, with `series_indicator = yes` and series fields filled in. | Institutional research report; technical report; research report to a funder; NBER working paper; IZA discussion paper; departmental working paper series; SSRN preprint in a series | A policy brief (→ `policy_report`); a peer-reviewed article (→ `journal_article`); a `journal_article` in `submitted version` state (a preprint, not a series-bearing report) | Technical reports, internal reports, research reports, and working papers all use this type. VABB R1 eligibility is determined at export time from `series_indicator = yes` AND a series ISBN/ISSN — the type itself is `report`; the VABB-R1 routing happens in the mapping layer. Maps to COAR `report` (default) or `working paper` (when `series_indicator = yes`) at export time — see Resolved decisions § "`working_paper` merged into `report`". |
| **Policy report** `policy_report` | An evidence-based document addressed to decision-makers — government bodies, regulators, or public institutions — with the explicit purpose of informing a decision or policy. | Policy brief; advisory report; government commission report; regulatory submission | A general institutional report (→ `report`); a journal article (→ `journal_article`) | Target audience (the decision-making body) is a required field. Maps to COAR `policy report`. Not VABB-eligible. The boundary with `report` is contested — see Open questions. |
| **Annotation** `annotation` | A single, citable annotation applied to a specific existing resource — text, image, dataset, or other primary source. The annotated resource must be referenced by a stable identifier (DOI, Handle, URL, or other persistent ID) at deposit. When the annotated resource is itself a Biblio record, raven additionally resolves to a record-to-record link. | A TEI annotation on a manuscript line; a scholarly note attached to a corpus sentence | A published annotated corpus or dataset of annotations (→ `dataset` with `annotation_scheme` field); inline commentary in a book chapter (→ `book_chapter`) | A `collection_indicator` (yes/no) field captures whether this annotation belongs to a named collection or scheme, parallel to `series_indicator` on `book`. A *published collection of annotations as a deliverable* (e.g. a TEI-encoded annotated corpus with its own DOI) is a `dataset`, not its own type — see Resolved decisions for the simplification. |
| **Review** `review` | A scholarly review of a single specific work — a book, film, exhibition, performance, recording, software, or product — written for either a scholarly or popular audience. The reviewed work is referenced by a stable identifier (ISBN, DOI, URL, Handle, or other persistent ID). | Book review in a scholarly journal; film review in a magazine; exhibition review on a blog; theatre review in a newspaper; software review in a peer-reviewed journal | A literature-synthesis review of multiple works (→ `review_article`); an analytical commentary that does not focus on a single specific work (→ see Open question on `journal_article`); an article that mentions other works without being primarily a review (→ `journal_article` or `popular_article`) | Maps to COAR `review` (`c_efa0`) with `book review` (`c_ba08`) as a known sub-concept. CSL `review` or `review-book`. Required: identifier of the reviewed work, work-type-of-reviewed-work (book, film, exhibition, etc.). Replaces the earlier venue-based migration rule for `artReview`/`bookReview`/`filmReview`/`exhibitionReview`/`musicReview`/`productReview`/`theatreReview` — all collapse to `review` regardless of venue. |
| **Popular article** `popular_article` | A research-derived article published in a newspaper, magazine, or popular-interest periodical, written for a general audience rather than a scholarly readership. | Opinion piece in De Standaard; feature article in Eos; column in De Morgen; commentary in Knack; piece in The Conversation in print | A scholarly review article (→ `review_article`); an article in a peer-reviewed journal (→ `journal_article`); a blog post or web-native article (→ `online_publication`); a review of a specific work (→ `review`) | CSL `article-magazine`. Maps to COAR `≈ other (text)`. Required field: publication name. Not VABB, FWO, or FRIS eligible. |
| **Online publication** `online_publication` | A research-derived blog post, web article, or other web-native publication, written for a general audience. | Blog post on a personal academic blog; article on The Conversation online; piece on UGent's institutional blog; long-form essay on a popular-science platform | A peer-reviewed open-access article (→ `journal_article`); a podcast (→ `broadcast_appearance`); an institutional or research-project website (→ not a type, see "What is not a type"); a print-first piece that also appears online (→ `popular_article`) | CSL `post-weblog`. Maps to COAR `c_6947 blog post`. Required fields: URL, site/blog name. Not VABB-eligible. |
| **Broadcast appearance** `broadcast_appearance` | A research-derived appearance on radio, television, or in a podcast — a recorded broadcast where the researcher communicates research to a general audience. | Guest appearance on Canvas; interview on Radio 1; weekly podcast episode on climate policy; TED talk recording released as broadcast | A public lecture at a museum or community event (→ `public_lecture`); a presentation at a scholarly conference (→ `conference_presentation`); a research-output video that is not a broadcast (→ attach as a file on the parent record, see "What is not a type") | CSL `broadcast`. Maps to COAR `≈ other`. DataCite `≈ Audiovisual` (video) or `≈ Sound` (audio). Required fields: channel/platform, programme name, air date. Not VABB-eligible. Absorbs research-communication video forms. |
| **Public lecture** `public_lecture` | A research-derived public talk at a non-scholarly venue — museum, library, festival, community event, or similar public setting. | Lecture at the Boekentoren during Open Monumentendag; talk at a science festival; community lecture at a public library; public-facing TED-style talk at a non-academic venue | An invited seminar at a university (→ `conference_presentation`); a TV/radio appearance (→ `broadcast_appearance`); a recorded online lecture for general audiences (→ `broadcast_appearance` if released as a broadcast) | CSL `speech`. Maps to COAR `≈ other`. Required fields: venue, date. A recording of a public lecture is a related output — attach as a file linked to this record. |
| **Popular book** `popular_book` | A research-derived book aimed at a general audience, published with an ISBN through a trade publisher rather than a scholarly press. | Popular-science book; trade book aimed at general readers; popular history written for a non-academic audience | A scholarly monograph (→ `book`); a textbook for university students (→ `book`); a popular article in a periodical (→ `popular_article`); a children's educational book unrelated to specific research (→ out of scope) | CSL `book`. Maps to COAR `≈ book`. Required: ISBN, publisher. Not VABB-eligible (popular venues do not qualify for VABB). The boundary with scholarly `book` is publisher and intended audience: a scholarly press publishing for academics is `book`; a trade press publishing for general readers is `popular_book`. |

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
`review_article`, `book`, `book_chapter`, `conference_paper`. Possibly `report`,
`policy_report`, and `review` (drafts vs. final — confirm with curators). Does
not apply to types without a peer-review lifecycle: `dataset`, `software`,
`dissertation`, `conference_abstract`, `conference_poster`,
`conference_presentation`, `annotation`, `popular_article`,
`online_publication`, `broadcast_appearance`, `public_lecture`, `popular_book`.

**A note on `report` and document iterations.** A `report` issued in a
series (what was historically called a "working paper") may go through
multiple revisions before being finalised — NBER v1, v2, v3, etc. These
are *document* iterations, not peer-review-lifecycle states. Biblio's
`publication_version` field does not capture this. The legacy
`working_paper` type also did not capture document iteration; this is
a pre-existing gap, not a regression of the merge into `report`.

**Consequence.** Each iteration is a separate `report` record, linked
via `related_identifier` (with `relation = is_version_of` or
equivalent). The researcher re-deposits when a new version appears; the
series name and series ISBN/ISSN are repeated on each record. The
practical effects:

- *Researcher experience.* Re-deposit per version is friction. For
  active series (NBER, IZA), the same researcher may deposit three or
  four iterations of one paper. Acceptable for v1; revisit if user
  testing shows this is a frequent abandonment point.
- *VABB R1 classification.* Each version is independently evaluated.
  In practice the latest version with a series ISBN/ISSN is the one
  that should count; curators apply this judgement when validating R1
  status. The mapping layer does not deduplicate across
  `related_identifier`-linked records.
- *Citation.* Each version cites independently with its own series
  number. Where citations need to point to "the latest version", that
  is a discovery-UI concern (surface the most recent linked record),
  not a type-design concern.
- *Migration.* Legacy records with version metadata in free-text
  fields ("v2", "revised") cannot be reliably parsed into separate
  records by script. Migrate the most recent version as the canonical
  `report` record; preserve the prior-version metadata in import-
  provenance so future cleanup is possible. Do not attempt automatic
  splitting into multiple linked records during migration.

A dedicated `document_version` field or a versioned-record model is
out of scope for v1; flag this for the per-type fields workshop. If
the per-type fields workshop concludes that document versioning
deserves first-class support, the change is field-shaped, not
type-shaped — the type stays `report`.

**Server identifier when state is `submitted version`.** When the value is
`submitted version`, the record must carry an identifier that locates the
preprint on a server (arXiv ID, bioRxiv DOI, ChemRxiv DOI, SSRN ID, etc.). This
reuses the existing `identifier` field with `relation = self` and the existing
scheme machinery (`arxiv`, `doi`, `handle`, `ssrn`) — no new field shape is
introduced. arXiv broadens beyond its current `allowed_for: [journal_article,
dataset]` to cover the peer-review lifecycle types listed above.

**Export consequence — preprint as a derived COAR term.** When `publication_version
= submitted version` AND a server identifier is present, the COAR export emits
`preprint` (`c_816b`) instead of the type's default COAR term (e.g. `research
article` for `journal_article`). Other export targets are unaffected: DataCite
stays `JournalArticle` (DataCite has no preprint sub-type), CSL stays
`article-journal` (preprints cite as articles), CrossRef stays `journal_article`
(CrossRef does not register preprints). VABB and FRIS/FWO are unaffected—preprints
are not VABB-eligible regardless of derivation, and FWO pulls only the published
version. This is the only render-time COAR-term derivation in the export
pipeline; it is justified because the rule is exactly one condition
(`publication_version == submitted version`), not a growing keyword map. If a
second derivation rule is ever proposed, that is the signal to revisit whether
preprint should become a top-level type after all.

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

**Per-type fields for the five popular-bucket types**

Each of `popular_article`, `online_publication`, `broadcast_appearance`,
`public_lecture`, and `popular_book` carries its own structured fields
appropriate to its medium, replacing the free-text `medium` field on the
now-removed `research_communication` type.

- `popular_article`: required `publication_name`; optional page reference.
- `online_publication`: required `url`, `site_name`.
- `broadcast_appearance`: required `channel_or_platform`, `programme_name`,
  `air_date`; optional duration; optional recording link.
- `public_lecture`: required `venue_name`, `date`; optional recording link.
- `popular_book`: required `isbn`, `publisher`, `edition`.

Field shapes are the responsibility of the per-type fields document, not this
one. The list above is the type-design commitment to *which* fields each type
requires; *how* each field is represented in raven is decided in the field
workshop.

Note: a recording of a `conference_presentation`, `public_lecture`, or
`broadcast_appearance` is a related output — attach the recording as a file
linked to the parent record. The recording is not a separate `video` deposit.

**Why granular types rather than a single bucket**

The v1 design splits the popular-communication territory into five
medium-specific top-level types. This reverses the v0.3 single-bucket
design (`research_communication`). The rationale and the path that led there:

**Principle 3, properly applied.** Principle 3 requires both tests to pass for
a type split: substantially different metadata schema AND the external world
treats them as distinct. On close inspection of what records of each medium
actually carry:

- `popular_book` has ISBN, publisher, edition — book-shaped record.
- `popular_article` has publication name, page reference — article-shaped record.
- `online_publication` has URL, site name — web-shaped record.
- `broadcast_appearance` has channel, programme name, air date — broadcast-shaped record.
- `public_lecture` has venue, date — event-shaped record.

These ARE meaningfully different schemas, not just different labels for an
identical structure. Test 1 passes. Test 2 also passes (COAR / CSL / DataCite
distinguish each: `blog post`, `book`, `Audiovisual`, etc.). Per Principle 3,
granular types are the rule-consistent answer.

**The earlier single-bucket reasoning was wrong.** An earlier draft claimed the
schema was identical across media (all just title + author + date + venue or
medium name). On review with the colleague's 2024 mapping work, the schema
differences are real — ISBN vs URL vs channel vs venue vs publisher are
genuinely different fields. The earlier reasoning dismissed those differences
too quickly. The single bucket was a Principle 3 misjudgment, now corrected.

**The cost.** The catalogue grew from 17 to 20 v1 types. Researchers see
five additional options on the deposit picker. We accept that cost — with
the caveat that the workshop should revisit whether five medium-specific
types is the right granularity (see Open questions § "Granular popular-bucket
types: keep five, or simplify?"). Researchers already distinguish `book`
from `book_chapter` from `journal_article` without hesitation; "a magazine
piece vs a podcast vs a public lecture" is at least as clear an everyday
distinction. The principle-6 trash-bucket risk is mitigated because each new
type has a tight positive definition tied to a specific venue-shape, not a
residual catch-all.

**Decision history**

Three options were evaluated for handling research-communication output.
Recording the path so future readers understand the reasoning.

1. **Single bucket with generic citation** (earlier draft). One type
   `research_communication`, free-text `medium`, generic CSL `article-magazine`.
   **Rejected**: schemas DO differ meaningfully across media;
   Principle 3 actually requires the split.

2. **Light controlled vocabulary on top of free text** (considered, never
   released). Add a closed-vocabulary `medium_kind` field with values mapping
   to CSL. **Rejected**: structurally identical to the rejected `article-form`
   field for letter / note — a closed-vocabulary subdivision dressed as a
   property field, violating "no subtypes."

3. **Granular split into five top-level types** (current). Each medium
   is a first-class type choice on the deposit picker, with its own
   appropriate fields. **Adopted.** Researchers self-classify into a
   medium-specific type the same way they choose between `book` and
   `book_chapter`.

**Resolved on option 3 (granular split).** The single-bucket Plan A is held
in reserve only as a documentation artefact — if researcher cognitive load
proves too high in user testing and people consistently misclassify across
the five types, the fallback is a single `popular_communication` parent type
with required medium fields. That fallback is not currently planned.

**Context** (specification deferred to the per-type fields project)
A free-text field available on all types, used by researchers to describe their
output when no controlled term fits precisely. Referenced by several type
definitions and Open questions in this doc as an existing field. Full
specification (length limits, indexing, curator visibility) lives in the
per-type fields project, not here.

**Annotation scheme** (specification deferred to the per-type fields project)
Optional on `annotation`. Captures the standard or framework used
(e.g. TEI, Web Annotation, CATMA) when the annotation belongs to a defined
scheme. Required when `collection_indicator = yes`. Listed here because it is
referenced by the type definition; the field's vocabulary, value list, and
validation belong in the per-type fields project.

**Collection indicator** (parallel to `series_indicator` on `book`)
A yes/no field on `annotation`. Asks whether this annotation belongs to a
named collection or annotation scheme. When yes, two follow-on fields apply:

- **Collection name** (required). The human-readable name of the collection or
  scheme.
- **Collection identifier** (optional). A DOI, Handle, or URL pointing to the
  collection-as-deliverable, captured as an additional identifier on the
  annotation record with `relation = part_of`. When the collection is itself
  a Biblio record (typically a `dataset`), raven resolves to a record-to-record
  link.

When no, no collection fields are shown. Required for `annotation`. Field shape
(yes/no) — see Open questions for raven for the raven-side representation choice.

A published collection of annotations as a deliverable (e.g. a TEI-encoded
annotated corpus with its own DOI) is a `dataset`, not a separate type. See
Resolved decisions for the collapse of `annotation_collection`.

**Parent reference**
For `book_chapter`: the parent ISBN is the required anchor (captured as an
identifier with `relation = part_of`). When the parent book exists as a Biblio
record, raven resolves the ISBN to a record-to-record link automatically — the
link is a strengthening, not a separate requirement. The same pattern applies
to `annotation` for the annotated resource (anchored on DOI, Handle, URL, or
other persistent identifier as appropriate to the target), and to `review` for
the reviewed-work identifier.
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

**Series indicator on `report`** (parallel to `series_indicator` on `book`)
A required yes/no field on `report`. Asks whether the report is published
as part of a numbered or named series — working-paper series like NBER or
IZA, departmental working-paper series, institutional report series, etc.
The presence of a series is what was historically captured by the separate
`working_paper` type; merging that type into `report` makes this a
field-driven distinction rather than a type-driven one. See Resolved
decisions § "`working_paper` merged into `report`".

When yes, the following follow-on fields apply:

- **Series name** (required). The human-readable series name. Used in
  citation rendering and for series-level discovery. Many series do not
  have their own ISBN or ISSN, so the name is the primary durable
  identifier.
- **Issuing institution** (required). The institution or research group
  that issues the series. Captured as an organization reference where
  possible (linkable to a Biblio organization record), free-text otherwise.
- **Series number** (optional but recommended). The numeric or
  alphanumeric identifier of this report within the series.
- **Series ISBN or ISSN** (optional). Captured as an additional
  identifier on the report record with `relation = part_of`, scheme `isbn`
  or `issn`. Required for VABB R1 eligibility — the export-time mapping
  to COAR `working paper` and VABB R1 only fires when both
  `series_indicator = yes` AND a series ISBN/ISSN is present.

When no, no series fields are shown.

Required for `report`. Field shape (yes/no) — see Open questions for
raven for the raven-side representation choice.

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
| **Policy report** | `policy_report` | — | `report` | — | ≈ literature → other research product | `@techreport` |
| **Annotation** | `annotation` | — | — | — | ≈ literature → other research product | ≈ `@misc` |
| **Review** ⚠️ | `review` | Book Review | — | — | ≈ literature → review | ≈ `@misc` |
| **Popular article** ⚠️ | `popular_article` | — | — | — | — | ≈ `@article` |
| **Online publication** ⚠️ | `online_publication` | — | — | — | — | ≈ `@misc` |
| **Broadcast appearance** ⚠️ | `broadcast_appearance` | — | — | — | — | ≈ `@misc` |
| **Public lecture** ⚠️ | `public_lecture` | — | — | — | — | ≈ `@misc` |
| **Popular book** ⚠️ | `popular_book` | — | — | — | — | ≈ `@book` |

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
| **Report** | `report` | ✅ `report` (default) / ✅ `working paper` (when `series_indicator = yes`) | ✅ `Text / Report` | ≈ literature | ✅ `report` | R1 (when `series_indicator = yes` AND series ISBN/ISSN present) | ✅ publication |
| **Policy report** | `policy_report` | ✅ `policy report` | ≈ `Text / Report` | ≈ other research product | ≈ `report` | — | publication |
| **Annotation** | `annotation` | ✅ `annotation` | ≈ `Text / Other` | ≈ other research product | ≈ `entry` | — | publication |
| **Review** ⚠️ | `review` | ✅ `review` (`c_efa0`); `book review` (`c_ba08`) for book reviews | ≈ `Text / Other` | ≈ literature | ✅ `review` / `review-book` | — | publication |
| **Popular article** ⚠️ | `popular_article` | ≈ `other (text)` | ≈ `Text / Other` | ≈ other research product | ✅ `article-magazine` | — | publication |
| **Online publication** ⚠️ | `online_publication` | ✅ `blog post` (`c_6947`) | ≈ `Text / Other` | ≈ other research product | ✅ `post-weblog` | — | publication |
| **Broadcast appearance** ⚠️ | `broadcast_appearance` | ≈ `other` | ≈ `Audiovisual` / `Sound` | ≈ other research product | ✅ `broadcast` | — | publication |
| **Public lecture** ⚠️ | `public_lecture` | ≈ `other` | ≈ `Event` | ≈ other research product | ✅ `speech` | — | publication |
| **Popular book** ⚠️ | `popular_book` | ≈ `book` | ✅ `Text / Book` | ≈ literature | ✅ `book` | — | publication |

⚠️ **Weak-fit types are Biblio-owned.** The five popular-bucket types
(`popular_article`, `online_publication`, `broadcast_appearance`,
`public_lecture`, `popular_book`), `policy_report`, `annotation`, and `review`
have limited or no import pipeline support and approximate external schema
mappings outside CSL. This is intentional — these types exist because Biblio's
completeness mission extends beyond what funding systems reward.

⚠️ **This table is unvalidated.** It must be reviewed with the backend developer
against live schema versions of COAR, CrossRef, DataCite, and FRIS before any
import or export pipeline is built on it.

---

## What is not a type

These are explicitly out of scope as types. They are handled by dedicated fields,
defined in the Fields to be defined section above, or are media/attachments
rather than research-output types.

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
- **Artistic works** — out of scope for v1; revisit when volume at UGent warrants it.
- **Image** — not a type. An image cannot be a standalone research output; it is
  always the result of, or a representation of, something else — a figure in a
  paper, a visualisation in a dataset, an illustration in a book chapter, an
  exhibition object documented in a `review`. Images are file attachments on
  the parent record that gives them context. This violates Principle 1
  ("Describes an activity, not a medium") if surfaced as a type — "image" names
  a medium, not a research activity. COAR has `image` (`c_c513`) but COAR is
  more permissive than our framework; we do not adopt it as a type.
- **Video** — not a type, same reasoning as `image`. A research-output video
  is the recording of something else: a `broadcast_appearance` (TV / podcast),
  a recording of a `public_lecture` or `conference_presentation`, footage
  attached to a `dataset` (microscopy, observational data), or accompanying
  material on a `journal_article`. The video is the *medium*; the research
  activity is the broadcast, the lecture, the data collection, or the paper.
  Attach the video file to the parent record. COAR `video` (`c_12ce`) is not
  adopted as a Biblio type.
- **Website** — not a type. A research-output "website" is either a
  `dataset` (a database, corpus exploration interface, structured data
  collection accessible via the web), `software` (an interactive tool with
  a web frontend), or `online_publication` (a single web piece). The
  bare-website case — a research project's portal page — is institutional
  infrastructure rather than a citable research output. COAR `website`
  (`c_7ad9`) is not adopted as a Biblio type.
- **Peer review** — not a type. A peer review is an attachment to the
  research output it reviews. Where peer-review records become citable
  artefacts (Publons, eLife open review), they belong as attached files
  on the reviewed work's record, with the reviewer's contribution
  captured via author-role metadata if the review is co-published with
  the article. The intellectual contribution is bound to the reviewed
  work; surfacing it as a separate Biblio record fragments the
  contribution graph. COAR `peer review` (`H9BQ-739P`), DataCite
  `PeerReview`, and CrossRef `peer-review` are recognised in the import
  pipeline as metadata on the reviewed work, not as standalone types.

---

## Out of scope (handled by other systems)

These candidate types are out of v1 scope because the canonical system of
record is elsewhere. Biblio does not duplicate them. If the upstream system
feeds Biblio with citation-only records (no full deposit), those records
ride as metadata on the relevant existing type or on a future feed; they do
not motivate new Biblio types.

- **Data Management Plan** — handled by [DMPonline.be](https://dmponline.be).
  DMPonline mints DOIs via DataCite when a citable artefact is needed.
  Reopen only if DMPonline is decommissioned or UGent policy explicitly
  requires Biblio deposit.
- **Project deliverable** — handled by GISMO. Project deliverables are
  administrative artefacts submitted to a funder, not research outputs in
  the sense Biblio captures. GISMO consumes Biblio's OAI-PMH feed for the
  publication side; deliverables stay in GISMO. Reopen only if FWO/Horizon
  reporting requirements explicitly mandate Biblio deposit.
- **Project milestone** — handled by GISMO. Same reasoning. A milestone
  fails Principle 2 directly — it's a project-management marker, not a
  research output.
- **Research proposal** — handled by GISMO and funder portals. Published
  research proposals (registered reports, ERC narratives shared as Open
  Science transparency) are increasingly citable, but the canonical system
  of record is the funder portal plus GISMO. Biblio does not duplicate.
  Reopen if UGent researcher demand for standalone proposal deposit
  surfaces, e.g. registered-reports volume becomes significant.
- **Patent** — handled by the UGent Tech Transfer Office (TTO). The TTO is
  the canonical system of record for IP. Biblio mirroring TTO data is a
  data-flow question, not a type-design question. If patent metadata
  flows from TTO into Biblio in a future integration, the receiving
  shape can be decided then. v1 does not include `patent` as a deposit
  type. FRIS already distinguishes patents as a top-level reporting
  category; that flow is via TTO, not Biblio.
- **Sub-doctoral theses** (bachelor's, master's) — currently managed in
  separate institutional software outside Biblio. Whether they should
  *also* be deposited in Biblio for discoverability or OA compliance is a
  scope question for the relevant institutional stakeholders, not a type
  design question.

---

## Open questions

*Items are ordered by discussion priority. Tentative resolutions that need
workshop confirmation come first; ordinary open questions follow; pointers
to items resolved elsewhere come at the bottom.*

### Tentative resolutions — most contested, ready to flip if the workshop says so

- **Data papers and software papers route to `journal_article` — tentative.**
  A *data paper* (a journal article describing a dataset) and a *software
  paper* (a journal article describing a research tool) currently route to
  `journal_article` rather than getting their own types. COAR distinguishes
  both (`c_beb9 data paper`, `c_7bab software paper`); the colleague's 2024
  mapping preserved both as distinct rows. The relationship to the
  described dataset or software is captured via `related_identifier`.

  **Working position reasoning.** Schema is the journal-article schema
  (peer-reviewed journal, DOI via CrossRef, citation as `article-journal`,
  authors, abstract, journal name, issue/volume, page range). The
  "what this paper describes" relationship is captured via
  `related_identifier`, not by the type. Researchers writing for Scientific
  Data, ESSD, JOSS, or SoftwareX are writing journal articles in their own
  framing.

  **Cost.** COAR export emits `research article` instead of the more specific
  `data paper` or `software paper` term — lossy at the COAR level. Discovery
  within Biblio: filtering for "UGent's data papers" requires querying
  `related_identifier` semantics, not a single type field. Strategic visibility:
  the FAIRVault collaboration and UB2030 §3.2.1 digital-sovereignty line are
  in part *about* elevating data and software as first-class research outputs;
  treating data papers as indistinguishable from regular research articles
  arguably undersells that.

  **The counter-argument.** `review_article` is the precedent that cuts
  against the working position — it's kept as a distinct type because review
  is a different research *activity*, with thin schema differences in
  practice. A data paper and a software paper are also different activities
  (curating and describing data; documenting a tool's design and behaviour)
  with distinct external venues, distinct schemas in practice (data
  availability statements, repository accessions; installation steps, API
  documentation), and explicit COAR distinction. By the activity-not-format
  argument that justified `review_article`, both deserve type promotion.

  **Honest assessment.** This is more right than the working position
  admits. The reasons it remains the working position rather than flipping:
  (a) the cost is real but currently low-volume at UGent; (b) FAIRVault's
  actual data-paper volume at UGent is the empirical question that should
  drive this. If FAIRVault produces real numbers showing meaningful volume,
  the working position should flip — promoting `data_paper` and
  `software_paper` to first-class types.

  **Reopening criteria.**
  - UGent researcher volume in dedicated data-paper or software-paper
    venues exceeds approximately 50 records per year (suggesting an
    established genre, not a marginal practice).
  - Curators routinely query "show me UGent's data papers / software papers"
    as a standard operational task.
  - FAIRVault, OpenAIRE, or FRIS-level reporting starts treating data
    papers and software papers as a distinct category for institutional
    ranking or visibility.
  - If `review_article` is challenged in the same way — if review
    collapses to `journal_article`, the data/software-paper collapse is
    internally consistent. If `review_article` survives, the case for
    surfacing `data_paper` and `software_paper` as types strengthens by
    the same reasoning.

  ⚠️ TBD — explicitly tentative; revisit with curators, head of open
  science, and open-data specialists, ideally with FAIRVault volume data.

- **Policy report and report as separate types vs. combined.** The current proposal
  treats `policy_report` as a distinct top-level type from `report`. Both share most
  of their schema; the only structurally distinct field is target audience
  (decision-making body) on `policy_report`. The case for the split is contested.

  **Why this is weak by Principle 3.** Test 1 (substantially different metadata
  schema) genuinely fails — same skeleton, one extra field. Test 2 (external world
  treats as distinct) is partial: only COAR distinguishes cleanly. DataCite
  collapses both to `Text / Report` (≈); OpenAIRE actually maps `policy_report`
  to `≈ other research product`, a *worse* fit than `report`'s `≈ literature`.
  By the doc's own rule ("if only one test passes, the distinction is handled by
  a field, not a type split"), the split is on the wrong side of the line. The
  same logic that merged `working_paper` into `report` should arguably apply
  here.

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
  - Principle 3 fails as documented above.
  - Boundary is fuzzy at deposit — a report to a ministry and an institutional
    report can be hard to tell apart, especially when the same document serves both
    purposes.
  - VABB-irrelevant either way; FWO does not distinguish.

  Three viable resolutions:
  1. Keep both as separate types (current proposal). Justification: COAR clean
     mapping + UB2030 strategic alignment + clean aggregate reporting.
  2. Merge into a single `report` type with a required audience field (values:
     `academic`, `institutional`, `policy-maker`, etc.) — same pattern as the
     `working_paper` merge. The audience field drives both COAR mapping (export
     as `policy report` when audience is `policy-maker`) and societal-impact
     reporting, without forcing the researcher to make the type distinction at
     deposit.
  3. Keep `report` and capture policy framing via the context field rather than
     as a distinct type. Justification: minimum schema, maximum researcher
     simplicity; trades clean COAR export for clean researcher experience.

  ⚠️ TBD — this is the most rule-inconsistent decision still standing in v1
  and should be settled in the workshop. Recommend resolution 2 by analogy to
  the `working_paper` merge unless the workshop surfaces a strong reason to
  preserve the type-level split.

- **Public lecture as a separate type vs. derivable from venue.** The current
  design has `public_lecture` (popular venue) and `conference_presentation`
  (scholarly venue) as two distinct types. The distinction at deposit
  requires the researcher to pick the right type, which means knowing the
  category boundary ("is the Boekentoren a popular venue? Is a community
  library popular even when I'm there for a research talk?"). If we can't
  *derive* the venue category from venue metadata, asking the researcher
  to make the call is friction for the 90% case where it's obvious and
  confusion for the 10% where it isn't.

  Three options:
  1. Keep both types as currently designed. Researcher self-classifies into
     scholarly-venue versus popular-venue at deposit. Cost: extra picker
     option, occasional misclassification.
  2. Collapse both into `conference_presentation` (or rename to a more
     generic `presentation` / `talk` type) with a venue-category field that
     is *derived* from the venue lookup where possible (museum / library /
     festival → popular; university / conference / scholarly society →
     scholarly), only asked of the researcher when derivation fails. The
     export then routes COAR `presentation` vs `≈ other` based on the
     resolved category, same mapping-layer pattern as `working_paper`
     merged into `report`.
  3. Keep both types, but add explicit guidance in the deposit form ("if in
     doubt, pick `conference_presentation`; curator will reclassify") and
     accept some misclassification at the edges.

  Principle 3 reads weak for the split: the metadata schema is venue +
  date + (recording) for both, and the external world (COAR, CSL, DataCite)
  approximates both to similar terms. The distinction is real but it is
  carried by the venue, not by the activity.

  ⚠️ TBD — confirm with faculty librarians and check whether venue lookup
  is reliable enough to support derivation in option 2.

- **Granular popular-bucket types: keep five, or simplify?** The current
  design splits popular-communication into five types: `popular_article`,
  `online_publication`, `broadcast_appearance`, `public_lecture`,
  `popular_book`. The split was made because the schemas differ
  meaningfully (ISBN versus URL versus channel versus venue versus
  publication name) and the COAR/CSL/DataCite vocabularies distinguish
  most of them — see Resolved decisions § "`research_communication` split
  into five medium-specific types".

  Reopening question: now that the design has matured and other splits
  have been folded back into fields (`working_paper` into `report`,
  `lecture` and `commentary` into Open questions), is the five-way split
  still proportionate?

  - The export-mapping argument is genuinely thin. Four of the five
    popular types map to `≈ other` in COAR; only `online_publication`
    gets `✅ blog post`. The CSL distinction is real but CSL is a
    rendering vocabulary, not an external classifier.
  - The deposit-picker cost is real. Five additional types (six counting
    `popular_book` as the boundary case with `book`) is a lot of cognitive
    load for output that is not VABB- or FWO-eligible — i.e. output where
    misclassification has low downstream consequences.
  - The schema-difference argument that justified the split holds. The
    fields each type requires *are* genuinely different.

  Three options to evaluate:
  1. Keep the five-way split as designed (current).
  2. Collapse to a single `popular_communication` type with a required
     `medium` field (closed vocabulary: article, blog, broadcast,
     lecture, book) that drives the medium-specific field set
     conditionally. Same pattern as `series_indicator` on `report`. Risk:
     looks like the rejected `medium_kind` field, but is operationally a
     conditional field-set, not a hidden subtype.
  3. Collapse to two types: `popular_book` (which has the strong
     book-shape and ISBN identifier, distinct enough to stand alone) and
     a single `popular_communication` for the other four, with a `medium`
     field driving the field set.

  ⚠️ TBD — worth a focused discussion in the workshop. Researcher
  cognitive load arguably matters more than the schema purity that drove
  the split.

### Other open questions

- **Lecture VS `conference_presentation`:** A *standalone academic lecture*
  (an invited lecture at another university outside any conference,
  an online masterclass for a discipline-specific audience) sits awkwardly
  between `conference_presentation` (part of a conference event) and
  `public_lecture` (popular venue). The colleague's
  2024 mapping preserves COAR `lecture` (`c_8544`) as distinct.

  Curator-routing is not an option. Letting the researcher pick
  `conference_presentation` and relying on a curator to flag and
  reclassify the standalone-academic-lecture case puts the work on the
  wrong actor — see the hard rule on curator workload. The deposit form
  must let the researcher land on the correct type without curator
  intervention.

  Two options to evaluate:
  1. Add `lecture` as a third type alongside `conference_presentation` and
     `public_lecture`. Researcher self-classifies into
     part-of-conference / standalone-academic / public, with each having
     its own type. The colleague's 2024 mapping supports this.
  2. Generalise `conference_presentation` into a broader `academic_talk`
     type with a venue-context field that includes "conference",
     "seminar", "masterclass", "invited talk". Single type, field-driven.
     Risks the no-subtypes rule depending on field shape.

  ⚠️ TBD — confirm whether the standalone-academic-lecture case is common
  enough to warrant its own type, or whether the field-driven
  `academic_talk` approach is preferable.

- **Commentary as a sub-question on `journal_article`:** A *commentary*
  is an in-depth analytical piece about an existing work, distinct from
  `review_article` (literature synthesis) and `review` (review of one
  specific work). COAR (`D97F-VB57`) defines it as "a more in-depth
  analysis written to draw attention to a work already published." The
  colleague's 2024 mapping captured it as distinct.

  Current design: a commentary published in a peer-reviewed journal is a
  `journal_article`. The intellectual focus on an existing work is
  captured via `related_identifier` (similar to how data papers and
  software papers route to `journal_article`).

  The case for adding `commentary` as a separate type: COAR distinguishes
  it; it has a different research activity (analytical focus on one
  existing work vs original research); the same activity-not-format
  argument that keeps `review_article` distinct could apply.

  The case for keeping it as `journal_article`: schema is identical to a
  journal article; the boundary with `review`, `review_article`, and
  ordinary `journal_article` is fuzzy at deposit; researchers writing a
  commentary will not necessarily self-identify as such.

  ⚠️ TBD — same Principle 3 question as data/software papers. Resolution
  depends on whether activity-distinction is sufficient by itself or
  whether schema-distinction is also needed.

- **Multilingual records and translations as research output.** The doc
  does not currently address two related cases:
  1. The same work published in two languages (a Dutch and an English
     edition of the same book; a Dutch summary article and an English
     full article in different journals). One Biblio record with two
     editions, or two records linked via `related_identifier`?
  2. A scholarly translation as a research activity in its own right —
     a translation of a primary source with critical apparatus.
     Currently routed in the migration matrix to `book` or
     `journal_article` (with the note: "translation is the work, not a
     separate type"), but the boundary with `critical_edition` (TBD)
     is unclear, and translation-as-scholarship is a recognised
     research output category in literary studies, classics, theology.

  Both questions belong to the per-type fields workshop more than to
  type design, but they need to be flagged because the workshop with
  letteren-bibliothecarissen will raise them. ⚠️ TBD.

- **Software and VABB:** Software is not VABB-eligible. Confirm that `software` type
  records are excluded from VABB validation queries without manual intervention.

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

- **Roles per type.** The new types broaden role vocabulary beyond what the
  legacy system covered: annotator (annotation), data creator (dataset),
  software developer (software), addressee organization (policy_report),
  issuing institution (report when `series_indicator = yes`). The legacy
  system's contributor list was a known trash bucket — researchers,
  curators, and reviewers all left it half-filled. Before defining a
  roles-per-type schema, decide: do we want to commit to richer role
  vocabularies for the new types, or keep contributor minimal (author + a
  few essentials) and capture role-specific information in dedicated fields
  where it matters? This is a workflow decision, not just a vocabulary
  decision. ⚠️ TBD — confirm with curators and workshop participants.

- **Mapping table validation:** The table above needs review by the backend developer
  against live schema versions of COAR, CrossRef, DataCite, and FRIS before any
  import/export pipeline is built.

### Pointers to items resolved elsewhere

- **Proceedings paper published in a journal:** Resolved — see Resolved
  decisions § "Proceedings paper published in a journal: VABB-C1 vs A1
  routing".
- **Working paper vs. report:** Resolved — see Resolved decisions §
  "`working_paper` merged into `report`". The distinction is now
  field-driven (series indicator + series ISBN/ISSN), with VABB R1
  classification computed at export time.

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
  `book_chapter`, `conference_paper`, `report`, `policy_report`. ISBN to
  `book_chapter` (parent ISBN with `relation = part_of`), `report` (when
  `series_indicator = yes`). ISSN to `report` (series ISSN when
  `series_indicator = yes`). arXiv broadens beyond `journal_article` and
  `dataset` once `publication_version` is wired in. Mostly mechanical
  YAML — listed once so it's not forgotten.
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

Both were proposed as separate types in earlier drafts. Both are dropped. They fold into
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

### `research_communication` split into five medium-specific types

An earlier draft used a single `research_communication` type with a
free-text `medium` field, applying generic CSL `article-magazine` citation
regardless of medium. The current design uses five top-level types:
`popular_article`, `online_publication`, `broadcast_appearance`,
`public_lecture`, `popular_book`.

**Reasoning.** Principle 3 requires both tests to pass for a type split. An
earlier draft claimed test 1 (schema) failed because all media share `title +
author + date + venue/medium name`. On review with the colleague's 2024
mapping work, the schemas DO differ meaningfully — ISBN/publisher/edition
for a popular book; URL/site name for an online publication;
channel/programme/air date for a broadcast appearance; venue/date for a
public lecture; publication name/page for a popular article. Test 1 passes.
Test 2 also passes (COAR / CSL / DataCite distinguish each). Per Principle 3,
granular types are the rule-consistent answer.

**Consequences.**
- Catalogue grows from 17 to 20 v1 types.
- Each new type cites with the correct medium-specific CSL type
  (`article-magazine`, `post-weblog`, `broadcast`, `speech`, `book`).
- COAR export becomes more accurate: `online_publication` exports as
  `blog post` (`c_6947`); the rest still approximate to `≈ other`.
- Migration matrix updates: `blogPost` → `online_publication`;
  `magazinePiece`, `newsArticle`, `newspaperPiece` → `popular_article`.
- The `medium` free-text field is deprecated; each new type carries its own
  structured fields.

**Reopening criteria.** If user testing shows researchers consistently
misclassify across the five new types — picking `popular_article` for
podcasts or `online_publication` for printed magazine pieces, etc. — the
fallback is a single `popular_communication` parent type with required
medium fields. That fallback is documented but not currently planned.

### `annotation_collection` collapsed

An earlier draft had `annotation_collection` as a separate top-level
type, citing the W3C Web Annotation Data Model. The current design retires
it. Annotation grouping is handled in two ways instead:

- For an annotation that belongs to a named collection or scheme: a
  `collection_indicator` (yes/no) field on `annotation`, parallel to
  `series_indicator` on `book`, with optional `collection_name` and
  `collection_identifier` follow-on fields.
- For a *published* collection of annotations as a deliverable (e.g. a
  TEI-encoded annotated corpus with its own DOI): `dataset` with
  `annotation_scheme` as metadata.

**Reasoning.** A single annotation and a collection of annotations do not
have meaningfully different metadata schemas — the collection is
structurally just multiple annotations linked by membership. The
book-and-series pattern handles this without a type proliferation.
`annotation_collection` was unsourced in the colleague's 2024 mapping table
(it appears in W3C Web Annotation but not in COAR or CERIF), and the earlier
definition leaned on "both Principle 3 tests pass" without demonstrating
test 1 against an actual schema difference. The collapse fixes that.

**Consequences.**
- One fewer v1 type.
- W3C Web Annotation `AnnotationCollection` semantics are preserved by the
  field-and-relationship model rather than by a type.
- Migration: any legacy records identified as annotation collections (none
  in the current legacy list) would route to either `annotation` (with
  collection_indicator) or `dataset` based on whether they're a published
  deliverable.

### Proceedings paper published in a journal: VABB-C1 vs A1 routing

A conference paper that is also published in a journal with an ISSN sits in a
grey zone for VABB classification: it could route to `conference_paper` (VABB
C1) or `journal_article` (VABB A1). Researchers should not have to know the
BOF-key rules to classify their own work correctly. The proposed approach is
four interlocking steps:

**1. Vraaggestuurde interface.** When a researcher submits a `conference_paper`,
the deposit form asks a mandatory question: *"Is this paper also published in
a journal with an ISSN?"* The question is always asked, the answer is always
stored.

**2. Duo-type identification at the mapping layer.**
- If yes → the record is internally mapped as `journal_article` (so the A1
  route is open in the VABB pipeline) but the original conference metadata
  (proceedings title, conference, dates) is preserved on the record. The
  researcher is not asked to re-deposit; the system handles the duo-shape
  in the mapping layer.
- If no → the record stays as `conference_paper`, and the existing
  `proceedings_indicator` field (yes/no) drives the VABB C1 eligibility check
  as already specified in Fields to be defined.

**3. Curator flag.** Records where the answer is yes are *automatically*
flagged for curator review. VABB classification (A1 / A2 / B1 / B2 / C1 / R1)
is a curator-owned field; the curator validates the final classification
based on ISSN/ISBN, peer-review status, and approved-list membership without
requiring the researcher to know the rules.

**4. ISSN priority over ISBN in the mapping hierarchy.** When both an ISSN
and an ISBN are present on a record, the mapping layer prioritises the ISSN
for VABB-eligibility lookup. This secures the highest available funding
category (A1 over C1) for the researcher when the choice is open. The ISBN
remains preserved on the record for citation rendering and proceedings-volume
lookup; it just doesn't outrank the ISSN at classification time.

**Reasoning.** This pattern keeps researcher cognitive load low (one yes/no
question at deposit), keeps the curator in their proper role (final
classification call, not data-completion), keeps the mapping layer doing the
work it should do (translating between researcher framing and external
schemas), and protects the funding-category outcome for the researcher
when ambiguity is genuine. It also avoids a subtype-as-field replacement—the
record has one Biblio `kind` at any time; the duo-shape lives in the mapping
layer, not in the type system.

**Consequences.**
- Deposit form gains one mandatory question on `conference_paper`.
- Mapping layer gains a `journal_article`-mode handling for
  `conference_paper` records flagged yes, preserving conference metadata in
  parallel.
- Curator queue gains an automatic flag for these records.
- VABB pipeline lookup is ISSN-first when both identifiers are present.

**Reopening criteria.** If curator review volume from the auto-flag
significantly exceeds capacity, revisit step 3 (e.g. flag only when
ISSN+ISBN are both present, or only on first-time-this-conference cases
rather than every duo-shape record).

### `working_paper` merged into `report`

Earlier drafts had `working_paper` as a separate top-level type alongside
`report`. The current design folds `working_paper` into `report` and makes
the distinction field-driven via `series_indicator`.

**Reasoning.** Principle 3 test 1 (substantially different metadata schema)
failed for the split: the only structural difference between a working
paper and a report is the presence of a series. That is exactly the kind
of distinction the doc's own rules say should be a field, not a type. Test
2 was also weak — CrossRef has no dedicated working-paper type
(`posted-content` is the closest), OpenAIRE distinguishes weakly. Only
COAR distinguishes cleanly, and COAR is an export target, not a deposit-UI
vocabulary.

The deciding pattern is the same as the proceedings-paper-published-in-a-journal
case: keep one Biblio `kind`, capture the distinguishing condition in a
field, and let the mapping layer split the export when external systems
care. Researchers do not need to know the BOF-key rules for VABB R1
eligibility; the curator validates classification, and the mapping layer
routes the export term.

**How VABB R1 routing works at export time.**

- Deposit type is always `report`.
- `series_indicator` (yes/no) is required at deposit.
- When `series_indicator = yes`, the researcher fills in series name,
  issuing institution, series number (optional), and series ISBN/ISSN
  (optional but required for VABB R1).
- At COAR export time: `report` records with `series_indicator = yes`
  emit COAR `working paper` (`c_8042`); the rest emit COAR `report`
  (`c_93fc`).
- At VABB classification time: a `report` record is R1-eligible if
  `series_indicator = yes` AND a series ISBN/ISSN is present. The
  curator validates final R1 classification (curator-owned field).
- DataCite, FRIS, FWO, and CSL exports all stay `Text / Report`,
  publication, etc. — they do not distinguish working papers.

**Consequences.**
- One fewer v1 type (21 → 20).
- Researchers no longer face a working-paper-vs-report decision at
  deposit. They pick `report` and answer the series question.
- VABB R1 stays curator-owned, as VABB classifications already are.
- Migration: `miscellaneous_types.workingPaper` mechanically becomes
  `report` with `series_indicator = yes`; series name and issuing
  institution are required follow-on fields, populated from existing
  legacy fields where present.
- The `journal_article`-with-`submitted version` distinction is
  unaffected. A preprint is a state of an article, not a series-bearing
  report. `report` with `series_indicator = yes` is the working-paper
  case; preprints stay on `journal_article`.

**Reopening criteria.** If curators discover that the
`series_indicator`-driven export logic produces incorrect VABB R1
outcomes for a meaningful share of records (false positives or false
negatives at the curator-review stage), revisit whether the field-based
approach is sufficient or whether a separate type is needed for
classification clarity.

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
  storage. For some legacy keys this is because a candidate TBD type
  (e.g. `musical_notation`, `critical_edition`) has not landed yet — those
  cases live in Curator-review mappings with a fallback. The dedicated
  Out-of-scope table below is reserved for legacy keys with no v1
  destination at all.

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
| `miscellaneous_types.workingPaper` | `report` | With `series_indicator = yes`. Series name and issuing institution required follow-on fields. VABB R1 routing happens at export time when series ISBN/ISSN is present. See Resolved decisions § "`working_paper` merged into `report`". |
| `miscellaneous_types.technicalStandard` | `report` | A technical standard is a standalone document with an issuing body — same metadata schema as `report`. |
| `miscellaneous_types.correction` | `journal_article` | Same logic as letter / note: published in a journal, schema identical to `journal_article`. Whether the original "Correction" tag is preserved as import-provenance metadata depends on the source-system type preservation scope question — see Open questions. |
| `miscellaneous_types.editorialMaterial` | `journal_article` | Same logic. |
| `miscellaneous_types.dictionaryEntry` | `book_chapter` | A dictionary entry is a contribution to an edited reference work with ISBN — same schema as `book_chapter`. |
| `miscellaneous_types.encyclopediaEntry` | `book_chapter` | Same logic. |
| `miscellaneous_types.lemma` | `book_chapter` | Same logic. |
| `miscellaneous_types.blogPost` | `online_publication` | Site/blog name and URL captured in the type's required fields. |
| `miscellaneous_types.magazinePiece` | `popular_article` | Magazine name captured in `publication_name`. |
| `miscellaneous_types.newsArticle` | `popular_article` | Publication name captured in `publication_name`. |
| `miscellaneous_types.newspaperPiece` | `popular_article` | Newspaper name captured in `publication_name`. |

### Role-only migrations (record stays, type does not split)

| Legacy key | Action |
|------------|--------|
| `book_editor` | Record becomes `book` with the depositor recorded as a contributor with `role = editor`. Editor is no longer a type — it is a contributor role on `book` records. |

### Curator-review mappings

These cases need per-record review because the destination depends on context
not encoded in the legacy type alone (typically: scholarly venue vs. popular
venue, or standalone publication vs. embedded contribution).

**Rule for review-of-work legacy keys** (artReview, bookReview, exhibitionReview,
filmReview, musicReview, productReview, theatreReview): all collapse to
`review` regardless of venue, with the venue captured in the relevant fields
on the record (journal name when peer-reviewed; publication name / URL when
popular). The earlier venue-mechanical fork is retired now that `review` is a v1
type — the colleague's 2024 mapping table treated these as a coherent family,
and the type definition handles all of them.

| Legacy key | New `kind` | Notes |
|------------|-----------|-------|
| `miscellaneous_types.artReview` | `review` | Reviewed-work-type = `art`. |
| `miscellaneous_types.bookReview` | `review` | Reviewed-work-type = `book`; reviewed-work ISBN captured if available. |
| `miscellaneous_types.exhibitionReview` | `review` | Reviewed-work-type = `exhibition`. |
| `miscellaneous_types.filmReview` | `review` | Reviewed-work-type = `film`. |
| `miscellaneous_types.musicReview` | `review` | Reviewed-work-type = `music`. |
| `miscellaneous_types.productReview` | `review` | Reviewed-work-type = `product`. |
| `miscellaneous_types.theatreReview` | `review` | Reviewed-work-type = `theatre`. |

The remaining curator-review entries below are cases where the destination
genuinely depends on per-record context that the legacy type alone doesn't
encode.

| Legacy key | Likely destinations | What the curator decides |
|------------|--------------------|--------------------------|
| `issue_editor` | `book` (with editor role), or split into multiple `journal_article` records linked together, or remain unmapped | Whether a guest-edited journal special issue is treated as an edited volume (book) or as a set of articles. Boundary case — needs explicit curator decision. |
| `miscellaneous_types.biography` | `book` (standalone scholarly biography), `journal_article` (biographical sketch in a journal), or `popular_book` / `popular_article` (general-audience biographical piece) | Form, venue, and intended audience. |
| `miscellaneous_types.bibliography` | `book` (standalone published bibliography), `journal_article` (short list in a journal), or `report` (institutional bibliography) | Form and venue. |
| `miscellaneous_types.manual` | `report` (institutional / technical manual) or `book` (published with ISBN) | Whether it has an ISBN and was issued through a publisher. |
| `miscellaneous_types.lectureSpeech` | `conference_presentation` (scholarly venue) or `public_lecture` (museum / festival / community event) | Was the venue scholarly or public? See Open question on `conference_presentation` for the standalone-academic-lecture case. |
| `miscellaneous_types.musicEdition` | `book` (published score), or eventually `musical_notation` / `critical_edition` if those TBD types land | If the TBD types land, re-classify; otherwise default to `book` when ISBN is present. |
| `miscellaneous_types.textEdition` | `book` (published edition), or eventually `critical_edition` (TBD) | Same logic. |
| `miscellaneous_types.textTranslation` | `book` (standalone published translation) or `journal_article` (translation embedded in an article) | Form. Note: translation is the work, not a separate type. |
| `miscellaneous_types.other` | Per-record curator review | Catch-all. Most likely targets: one of the popular-bucket types, `report`, or `journal_article`. No automatic destination. |

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

A number of earlier candidates have moved out of this section: `peer_review`,
`image`, `video`, `website` are now in "What is not a type" (attachments /
media); `data_management_plan`, `project_deliverable`, `project_milestone`,
`proposal`, `patent`, sub-doctoral `thesis` are in "Out of scope (handled by
other systems)"; `lecture` and `commentary` moved into Open questions as
sub-questions on `conference_presentation` and `journal_article`
respectively. Only the four standalone TBDs below remain.

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

**`workflow`** (Computational or research workflow)
A workflow is a recorded, reproducible sequence of operations — typically
computational — that processes inputs into outputs in a defined order. The
intellectual contribution is the orchestration: which steps run, in what
order, with what parameters, calling which tools. Examples: a Galaxy workflow
for genome assembly; a Snakemake pipeline for a specific biostatistics
analysis; a Common Workflow Language (CWL) description of a data-processing
pipeline; a Nextflow pipeline used in a published study; an Apache Airflow DAG
for a research data warehouse.

**Why it might be its own type rather than `software`.** Software is a
reusable tool (an analysis library, a package). A workflow is a *specific
arrangement* of software calls to accomplish a particular research task.
Workflows cite software, not the other way round. Two workflows can use the
same software and produce different research outputs; that's the workflow
doing the work, not the software. Reproducibility increasingly demands
depositing the workflow alongside (or instead of) the data and the paper.

Vocabulary support: COAR (`c_393c`), FaBiO Workflow. Particularly relevant
for FAIRVault and the bio-ingenieurs / wetenschappen / Geneeskunde
faculties. Decision needed: is this a Biblio type, or do workflows live in
specialised registries (WorkflowHub, Dockstore) with Biblio holding only the
citation? Volume and curator-effort estimate needed before adopting.

---

## Findings from 2024 vocabulary work

This section records what came out of reviewing prior vocabulary-standardisation
work done by a colleague in 2024 (`docs/os-standardization_terminology/`). The
folder contains source vocabularies (COAR Resource Types, EuroCRIS CERIF Output
Types, FaBiO, OpenAIRE Guidelines, Crossref schema) and a three-way alignment
mapping table (`resource_types-1.csv`) that the colleague produced linking
FaBiO ↔ CERIF ↔ COAR concept-by-concept. Reviewing this material against the
current design surfaced several concrete contradictions, several types worth
adding to TBD, and several field-shape questions that belong in a separate
workshop (see Relationship to other documents).

### What the colleague's mapping preserves that this design collapses

The colleague's table is *less opinionated* than this design — it preserves
every distinction the source vocabularies make. The places where the current
design collapses or diverges are not just deviations from raw COAR/CERIF;
they are deviations from what the colleague's curated synthesis explicitly
kept distinct.

- **Letter and Letter to Editor.** Two distinct rows in the colleague's table:
  CERIF `LettertoEditor` + COAR `c_545b`, and CERIF `Letter` + COAR `c_0857`.
  This design folds both into `journal_article` and preserves the original
  source-system type as import-provenance metadata only. The reopening
  tripwire (curator queries "show me letters in the queue" as standard
  weekly work) remains the right safety net. See Resolved decisions.
- **Preprint.** Distinct row in the colleague's table (COAR `c_816b`). This
  design treats preprint as a state of `journal_article` (publication_version
  = submitted version) and now derives the COAR export term `preprint` at
  render time when that state is set. See Fields to be defined → Publication
  version → Export consequence.
- **Data paper / software paper.** Distinct rows in the colleague's table
  (COAR `c_beb9` and `c_7bab`, separate from `dataset` and `software`). This
  design routes both to `journal_article`. See the journal_article and
  software type definitions for the explicit reasoning and the cost
  acknowledged.
- **Multi-level theses.** The colleague's table preserves bachelor (`c_7a1f`),
  master (`c_bdcc`), doctoral (`c_db06`), and the parent `thesis` (`c_46ec`).
  This design uses `dissertation` for doctoral + master and treats sub-doctoral
  theses (bachelor's, master's) as out of scope (handled by separate
  institutional software outside Biblio). Difference is structural; defensible
  but worth flagging.
- **Report family.** COAR has six distinct report types (`c_93fc` report,
  `c_18ww` internal report, `c_18ws` research report, `c_18hj` report to
  funding agency, `c_18gh` technical report, `c_18wq` other type of report).
  The colleague preserved them. This design collapses to a single `report`
  type with a context field. Aggressive but rule-consistent (Principle 3 test
  1 fails for the splits — schemas are near-identical).

### Types in the colleague's mapping that this design treated separately

The colleague captured these as distinct concepts in their three-way table.
Where they ended up in the v1 design has shifted across revisions; current
state:

- `peer_review` — COAR `H9BQ-739P`, DataCite `PeerReview`, CrossRef
  `peer-review`. Classified as not a type — a peer review is an
  attachment to the work it reviews. See "What is not a type."
- `workflow` — COAR `c_393c`, FaBiO Workflow. Still in "To be discussed" as
  a candidate v1+ type.
- `lecture` — COAR `c_8544`. Open question on `conference_presentation`
  rather than a standalone TBD candidate; three resolution options recorded.
- `commentary` — COAR `D97F-VB57`. Open question on `journal_article`
  rather than a standalone TBD candidate.
- `image`, `video`, `website` — COAR `c_c513`, `c_12ce`, `c_7ad9`.
  Classified as not a type — these are media or attachments to other
  research outputs, not standalone research-output types. See "What is not
  a type" for the reasoning.
- `patent` — COAR `c_15cd`. Classified as out of scope — handled by the
  UGent Tech Transfer Office (TTO) as the canonical system of record.
  See "Out of scope (handled by other systems)."

### Types in the colleague's mapping that this design rejects on principle

- **Containers** (Magazine, Newspaper, Periodical, Journal, Journal Issue,
  Encyclopedia). The colleague kept these as concepts; this design treats
  them as *containers of works*, not works themselves. A `journal_article`
  has a journal field; the journal is not itself a research output. CERIF's
  inclusion of these as top-level concepts is the kind of conflation
  Principle 3 exists to prevent.
- **Subtype-style CERIF concepts** (`JournalArticleAbstract`,
  `JournalArticleReview`, `BookChapterAbstract`, `BookChapterReview`,
  `ConferenceProceedingsArticle`). The colleague preserved them; this design
  rejects the pattern. These are subtype-fields-as-types, the legacy mistake
  this redesign exists to remove.

### What this design adds that is not in the colleague's mapping

- `policy_report` as a top-level type. COAR has it (`c_18hj` is
  funding-agency-specific; the broader policy report term is in COAR
  3.2). The colleague did not surface it as distinct from `report`. The case
  for separation is contested in Open questions.
- The five medium-specific popular-bucket types (`popular_article`,
  `online_publication`, `broadcast_appearance`, `public_lecture`,
  `popular_book`). The colleague preserved granular `Newsclipping`,
  `MagazineArticle`, `Radio/TVProgram` distinctions; the v1 design picks up
  those distinctions and elevates them to first-class types with
  medium-specific field requirements. An earlier draft tried a single
  `research_communication` bucket with a free-text `medium` field on
  Principle 3 grounds (claimed schema identity); that was retired when
  rigorous review showed the schemas DO differ meaningfully (ISBN vs URL vs
  channel vs venue vs publisher). See Resolved decisions § "`research_communication`
  split into five medium-specific types" for full reasoning.

### Concepts that this design considered and retired

- `annotation_collection`. An earlier draft had this as a separate top-level
  type, citing the W3C Web Annotation Data Model. Retired — a single annotation
  and a collection of annotations do not have meaningfully different metadata
  schemas (Principle 3 test 1 fails). Annotation grouping is now handled by a
  `collection_indicator` (yes/no) field on `annotation` (parallel to
  `series_indicator` on `book`); a *published* collection of annotations as a
  deliverable is a `dataset` with `annotation_scheme` metadata. The colleague's
  2024 mapping table did not include `annotation_collection`. See Resolved
  decisions § "`annotation_collection` collapsed."
- `research_communication` as a single bucket. An earlier draft had this as one
  bucket with a free-text `medium` field, on the assumption that all
  popular-communication output shared the same metadata schema. Retired —
  schemas DO differ meaningfully across media, the assumption was a Principle 3
  misjudgment. The territory is now five medium-specific types as listed
  above. See Resolved decisions § "`research_communication` split into five
  medium-specific types."

### Curator uncertainty in the colleague's table that this design resolves

The colleague's table contains comment-column flags where they were uncertain.
This design takes positions on each:

- *"same as book part?"* (Chapter in Book vs Inbook vs book part): all
  collapse to `book_chapter`. Aligned with CrossRef and DataCite.
- *"article vs paper"* (ConferenceProceedingsArticle vs conference paper):
  both `conference_paper`. Pure naming difference.
- *"PhD thesis also exists in cerif, not clear if there is a difference"*:
  `dissertation` covers both. CERIF redundancy eliminated.
- *"not sure whether mapping between cerif and coar is ok"* (MagazineArticle
  vs periodical): magazine pieces → `popular_article` (one of the five
  medium-specific types that replaced the retired `research_communication`
  bucket); periodical is a container, not a work.
- *"not sure whether mapping between cerif and coar is ok"*
  (ResearchReportForExternalBody vs report to funding agency): both → `report`;
  the funder relationship is captured by `funding_reference`, not by type.

### Field-shape findings that belong in a separate document

The colleague also gathered metadata-element schemas (Crossref, OpenAIRE
Guidelines for publications and datasets). These surface field-level
requirements that are out of scope for type design but need to be answered
before deposit forms can be specified. They are flagged here for the per-type
fields workshop:

- **Access Rights** must use a closed COAR Access Right Vocabulary
  (`access/embargoedAccess/restrictedAccess/openAccess/metadataOnlyAccess`).
  Currently this doc just says "OA status — per-file field" without pinning
  the vocabulary.
- **Resource Version** must align to COAR Version Vocabulary. The current
  `publication_version` field already does this implicitly; the per-type
  fields doc should make the COAR vocab binding explicit.
- **Publisher** is Mandatory-if-Applicable on datasets per OpenAIRE; the
  current dataset definition does not surface this requirement.
- **Publication Year** is a separate Mandatory field for datasets per
  OpenAIRE/DataCite, distinct from Publication Date.
- **Funding Reference** is MA on publications per OpenAIRE; this doc treats
  funder linkage as out of scope but FRIS/FWO export requires it.
- **Geolocation** and **Subject** are in scope for datasets per
  OpenAIRE/DataCite; relevant for FAIRVault discovery.

These items go to the per-type fields document, not to this one.

---

## Relationship to other documents

- `DOMAIN.md` — `kind` values must be updated to match the finalised type list here.
- `PRODUCT.md` — Output types section and field requirements workshop depend on this.
- `RESPONSIBILITY.md` — Field ownership per type will be defined after types are settled.
- `docs/old-research-output-types.md` — Legacy strings; the source list every legacy key is mapped from in the Migration matrix above.
- `docs/os-standardization_terminology/` — Source vocabularies and the colleague's 2024 mapping table; informs the Findings section above.
- **Per-type fields document** (TBD filename, separate workshop) — Will define
  the per-type metadata field requirements (deposit-required, MA, recommended,
  optional), controlled vocabularies (COAR Access Rights, COAR Version, etc.),
  field shapes, and per-type form behaviour. The items flagged in the Findings
  section above and in "Fields to be defined" deferred specifications go to
  this document, not to WORK-TYPES.md.
