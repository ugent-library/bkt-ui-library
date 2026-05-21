# WORK-TYPES.md
# Research output type redesign — decisions, principles, and obligations

Version 0.5 — May 2026

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
Decided during the workshop.

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
subtype; that was a misclassification, corrected in this design. The
never-advancing preprint case (a submitted-version record that is never
followed by an accepted or published version) does not break this rule: it
is a long-lived `journal_article` in `submitted version` state, and the
COAR export already emits `preprint` for it via the publication-version
derivation rule. The re-engagement question — whether researchers actually
update the record when the article eventually publishes — is empirical and
tracked in Open questions, not as an exception to the rule itself.

**Required fields at deposit are not optional curator cleanup.** If a field matters
for citation, discovery, or external export – and a researcher only knows the correct
format, or an external system knows better than the researcher or the curator – it is
required at deposit — not left for curators to fill in later. The curator team is
small. Their job is quality review and classification, not completing metadata the
researcher is responsible for.

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

Decided during the workshop.

These constraints help us decide, but are inherently negotiable as they sometimes
suggest opposing things.

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

Examples of only one test passing: a letter (or note) vs a journal article — both
carry the same metadata (title, authors, journal, volume, issue, pages, DOI),
and modern external systems increasingly treat letters as journal articles
(CrossRef registers them under `journal_article`; OpenAlex does not surface
letter as a separate type). Test 1 fails — schemas are identical. Letter is
preserved as import-provenance on the `journal_article` record, not a separate
type.

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

A podcast is not a new type. It is `broadcast_appearance` (radio,
television, or podcast); the type's structured fields — channel or platform,
programme name, air date — capture what's specific to the medium. Whatever
comes after podcasts in the broadcast space will fit the same shape. The
type list does not track trends.

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

**Minting authority at UGent.** Biblio does not mint CrossRef DOIs.
openjournals.ugent.be is the CrossRef minting authority for UGent's
diamond OA journals (see https://openjournals.ugent.be/site/about/);
commercial publishers mint for traditional journals. DataCite minting
authority is a separate open question — see Open questions § "DataCite
minting authority at UGent". See Resolved decisions § "CrossRef and WoS
as indirect downstreams" for the full rationale.

---

## Proposed type list

These eighteen types are intended to cover approximately 95% of research output at UGent.
Each has a positive definition. None is a residual category. Seven further candidates
are flagged ⚠️ TBD at the bottom of the table — they are under discussion and not part
of v1. See "To be discussed" for full rationale on each.

A further set of candidates that were considered and explicitly rejected are
documented in "What is not a type" (image, video, website, peer review — these
are attachments or media, not types) and "Out of scope (handled by other
systems)" (proposal, DMPs, project deliverables, sub-doctoral theses).

The internal `kind` uses plain underscore-separated descriptive identifiers — same
convention raven uses across its YAML config, Go constants, search index, and CSL
map (`work_type` discriminator, `journal_article`, `book_chapter`, etc.). No
namespace prefix. Each identifier is self-explanatory and aligns with the naming
conventions of COAR, CrossRef, and DataCite where possible (with the underscore
substituted for the hyphen they use), making the mapping layer easier to maintain.

| Researcher label | Internal `kind` | Plain-language test |
|-----------------|----------------|----------------------|
| Journal article | `journal_article` | Original research article published in a peer-reviewed journal? |
| Review article | `review_article` | Critical synthesis or review published in a peer-reviewed journal? |
| Book | `book` | A standalone monograph with ISBN? |
| Book chapter | `book_chapter` | A contribution to an edited volume? |
| Reference entry | `reference_entry` | An entry in a published reference work — dictionary, encyclopedia, handbook, lexicon? |
| Conference paper | `conference_paper` | Full paper or extended abstract presented at a scholarly conference, with a written component in proceedings or programme? |
| Conference abstract | `conference_abstract` | Abstract-only submission to a scholarly conference, not published as a full paper? |
| Poster | `conference_poster` | A poster presented at a scholarly venue? |
| Presentation | `conference_presentation` | An oral presentation at a scholarly conference, with no written paper or extended abstract in proceedings? |
| Lecture | `lecture` | A standalone academic or public lecture given outside a conference setting? |
| Dissertation | `dissertation` | A degree-granting thesis? |
| Dataset | `dataset` | A structured collection of data for reuse? |
| Software | `software` | A citable software artefact? |
| Report | `report` | A standalone document produced by or for an organisation, with optional series membership? |
| Review | `review` | A scholarly review of a single specific work — book, film, exhibition, performance, etc.? |
| Popular article | `popular_article` | A research-derived article in a newspaper, magazine, popular periodical, or on a blog or web publication? |
| Broadcast appearance | `broadcast_appearance` | A research-derived appearance on radio, TV, or in a podcast? |
| Popular book | `popular_book` | A popular-science book aimed at a general audience? |
| ⚠️ TBD **Policy report** | `policy_report` | An evidence-based document addressed to decision-makers or public bodies? |
| ⚠️ TBD **Annotation** | `annotation` | A single citable annotation on an existing resource? |
| ⚠️ TBD **Musical notation** | `musical_notation` | A musical score or notation produced as part of research? |
| ⚠️ TBD **Transcription** | `transcription` | A scholarly transcription of a manuscript or primary source? |
| ⚠️ TBD **Critical edition** | `critical_edition` | A critically edited version of an existing text? |
| ⚠️ TBD **Workflow** | `workflow` | A citable computational or research workflow? |
| ⚠️ TBD **Patent** | `patent` | A granted or applied-for patent on research-derived IP? |

### Type definitions

| Type | Definition | Examples | Not | Notes |
|------|-----------|---------|-----|-------|
| **Journal article** `journal_article` | Original research article, short communication, letter, note, or correspondence published in a peer-reviewed journal. | Experimental study; observational study; original clinical trial; computational study; letter to the editor; brief communication; technical note; correction; erratum; editorial; invited perspective; **data paper** describing a dataset; **software paper** describing a research tool | A review article (→ `review_article`); a conference paper also published in a journal (→ see Resolved decisions § "Proceedings paper published in a journal") | Maps to CrossRef `journal_article`, COAR `research article`, WoS `Article`. A submitted-version preprint is not a separate type — it is a `journal_article` with publication version `submitted version` (see Export consequence in Fields to be defined: preprints export as COAR `preprint` `c_816b`, not `research article`). Letters and notes were dropped as separate types — see Resolved decisions for the reasoning and import-provenance handling. Data papers and software papers route here too — see Open questions § "Data papers and software papers" for reasoning and counter-argument. |
| **Review article** `review_article` | A critical synthesis or systematic review of existing literature, published in a peer-reviewed journal. | Systematic review; meta-analysis; narrative review; scoping review; literature survey | An original research article reporting new data (→ `journal_article`) | Maps to CrossRef `journal_article` + review flag, COAR `review article`, WoS `Review`. VABB A1/A2 eligible. Kept as a separate type because review is a different research activity (synthesis vs. original work), not a publishing format — both principle 3 tests pass cleanly. |
| **Book** `book` | A standalone scholarly monograph published with an ISBN. Includes authored and edited volumes. | Research monograph; edited volume; handbook; critical anthology | A book chapter (→ `book_chapter`); a report with an ISBN issued by an institution (→ `report`) | Editor role is a contributor role field, not a separate type. Series membership captured by a series indicator field. |
| **Book chapter** `book_chapter` | A defined contribution to an edited book, with its own title and authorship, published within a volume with an ISBN. | Chapter in an edited volume; contribution to a Festschrift | A standalone report (→ `report`); a journal article (→ `journal_article`); an entry in a reference work (→ `reference_entry`) | Parent ISBN required at deposit (the durable anchor — works whether or not the parent book is in Biblio). When the parent book is a Biblio record, raven resolves the ISBN to a record-to-record link automatically. |
| **Reference entry** `reference_entry` | An entry in a published reference work — dictionary, encyclopedia, handbook, lexicon, or similar — with its own headword and authorship, published within a volume with an ISBN. | Dictionary entry; encyclopedia article; lemma in a scholarly lexicon; entry in a handbook | A general book chapter (→ `book_chapter`); a standalone book (→ `book`) | Parent ISBN required at deposit (durable anchor — same pattern as `book_chapter`). CSL `entry` (generic; finer `entry-dictionary` / `entry-encyclopedia` distinction not carried in v1, can be added as a field later if load-bearing). COAR / DataCite / OpenAIRE collapse to `book part` / `BookChapter` / `part of book` — reference entries are visible as a distinct kind internally but indistinguishable to those external consumers. VABB B2 eligibility identical to `book_chapter` (publisher-list-driven, curator-validated). Split from `book_chapter` for clean bibliographic display — see Resolved decisions § "`reference_entry` split off from `book_chapter`". |
| **Conference paper** `conference_paper` | A full paper or extended abstract presented at a scholarly conference and published in proceedings or a conference programme. | Proceedings paper with ISBN/ISSN; extended abstract in a programme; short paper in conference proceedings | A poster (→ `conference_poster`); slides only (→ `conference_presentation`); abstract only (→ `conference_abstract`) | Proceedings indicator field (yes/no) required — drives COAR mapping and VABB C1 eligibility. |
| **Conference abstract** `conference_abstract` | An abstract-only submission to a scholarly conference, not accompanied by a full paper. | Meeting abstract in a conference booklet; congress abstract; symposium abstract | A full paper in proceedings (→ `conference_paper`); a poster (→ `conference_poster`) | Not VABB-eligible. Maps to COAR `conference object`. Typically no DOI. |
| **Poster** `conference_poster` | A display poster presented at a scholarly venue — conference, symposium, workshop, or seminar. | Research poster at a conference; poster at a doctoral symposium; poster at an academic workshop | A poster at a public science festival (→ `conference_presentation` if accompanied by a talk; otherwise marginal v1 case) | The `conference-` prefix follows COAR convention; scope is not limited to conferences. If a full paper exists in proceedings, deposit that as `conference_paper` and link the poster. |
| **Presentation** `conference_presentation` | An oral presentation at a scholarly conference where the deposited artefact is the talk itself, not a written paper. Covers contributed talks, invited talks, and keynotes at conferences. | Invited conference talk; conference keynote; contributed talk slides; panel contribution at a scholarly conference | A talk with an accompanying paper or extended abstract in proceedings (→ `conference_paper`); a poster (→ `conference_poster`); an abstract-only submission (→ `conference_abstract`); a standalone lecture outside a conference (→ `lecture`) | Maps to COAR `conference presentation`, CSL `speech`. Not VABB-eligible. A recording is an attached file on this record. |
| **Lecture** `lecture` | A standalone lecture presenting research outside a conference setting, given for either an academic or a general audience. The activity is presenting research orally; the audience (academic vs. public) is a field. | Invited lecture at another university; named lecture; masterclass for a discipline-specific audience; talk at the Boekentoren during Open Monumentendag; lecture at a science festival; community lecture at a public library | A talk at a scholarly conference (→ `conference_presentation`); a TV/radio/podcast appearance (→ `broadcast_appearance`) | Required: `lecture_audience` (closed vocabulary: `academic`, `public`). Maps to COAR `lecture` (`c_8544`), CSL `speech`. Not VABB-eligible. The audience field captures the popular-vs-scholarly distinction; COAR does not distinguish, so no derivation rule is needed. |
| **Dissertation** `dissertation` | A thesis submitted in fulfilment of a degree requirement. | Doctoral dissertation; master's thesis | A bachelor's thesis (out of scope — handled by separate institutional software, see "Out of scope") | Degree, supervisor, and institution are required fields. |
| **Dataset** `dataset` | A structured, documented collection of data produced for reuse by others, with a persistent identifier. | Survey data with codebook; experimental measurements; annotated corpus; genomic data deposited at EGA or ENA | Any internal analysis file or spreadsheet; a database that is internal tooling (→ `software`) | DOI via DataCite preferred. Intent to make data reusable and citable is the criterion. |
| **Software** `software` | A citable software artefact produced as part of research, with a persistent identifier or versioned repository URL. | Research tool with DOI on Zenodo; analysis pipeline on GitHub with version tag; R or Python package | An analysis script used once and not intended for reuse; a commercial tool the researcher used but did not produce; **a software paper describing a research tool (→ `journal_article`)** | Version and licence are required fields. COAR distinguishes `software` (`c_5ce6`, the artefact) from `software paper` (`c_7bab`, the article describing the artefact); Biblio uses `software` only for the artefact. The article describing it is a `journal_article` with a `related_identifier` linking back to this software record — see Resolved decisions for reasoning and counter-argument. |
| **Report** `report` | A standalone document produced by or for an organisation, not published through journal or book peer review. Requires an issuing body. Absorbs what was historically called a "working paper" — a report issued in a numbered series is still a `report`, with `series_indicator = yes` and series fields filled in. | Institutional research report; technical report; research report to a funder; NBER working paper; IZA discussion paper; departmental working paper series; SSRN preprint in a series; policy brief or advisory report (⚠️ TBD: `policy_report` is a candidate distinct type — see "To be discussed") | A peer-reviewed article (→ `journal_article`); a `journal_article` in `submitted version` state (a preprint, not a series-bearing report) | Technical reports, internal reports, research reports, working papers, and — pending the `policy_report` TBD resolution — policy-facing reports all use this type. VABB R1 eligibility is determined at export time from `series_indicator = yes` AND a series ISBN/ISSN — the type itself is `report`; the VABB-R1 routing happens in the mapping layer. Maps to COAR `report` (default) or `working paper` (when `series_indicator = yes`) at export time — see Resolved decisions § "`working_paper` merged into `report`". |
| **Review** `review` | A scholarly review of a single specific work — a book, film, exhibition, performance, recording, software, or product — written for either a scholarly or popular audience. The reviewed work is referenced by a stable identifier (ISBN, DOI, URL, Handle, or other persistent ID). | Book review in a scholarly journal; film review in a magazine; exhibition review on a blog; theatre review in a newspaper; software review in a peer-reviewed journal | A literature-synthesis review of multiple works (→ `review_article`); an analytical commentary that does not focus on a single specific work (→ see Open question on `journal_article`); an article that mentions other works without being primarily a review (→ `journal_article` or `popular_article`) | Maps to COAR `review` (`c_efa0`) with `book review` (`c_ba08`) as a known sub-concept. CSL `review` or `review-book`. Required: identifier of the reviewed work, work-type-of-reviewed-work (book, film, exhibition, etc.). Replaces the earlier venue-based migration rule for `artReview`/`bookReview`/`filmReview`/`exhibitionReview`/`musicReview`/`productReview`/`theatreReview` — all collapse to `review` regardless of venue. |
| **Popular article** `popular_article` | A research-derived article published for a general audience rather than a scholarly readership, whether in print (newspaper, magazine, popular-interest periodical) or on the web (blog, online magazine, popular-science platform). | Opinion piece in De Standaard; feature article in Eos; column in De Morgen; commentary in Knack; piece in The Conversation (print or online); blog post on a personal academic blog; piece on UGent's institutional blog; long-form essay on a popular-science platform | A scholarly review article (→ `review_article`); an article in a peer-reviewed journal (→ `journal_article`); a podcast or broadcast (→ `broadcast_appearance`); an institutional or research-project website (→ not a type, see "What is not a type"); a review of a specific work (→ `review`) | Required: `venue_name` (the magazine, newspaper, blog, or site name). Optional: `url`, `page_reference`, `issue_reference` — populated when the venue actually carries each. CSL renders `article-magazine`; COAR maps to `≈ other (text)`. Not VABB, FWO, or FRIS eligible. Absorbs the v0.4 `online_publication` type — see Resolved decisions § "`online_publication` collapsed into `popular_article`" and § "`venue_form` dropped from `popular_article`". The print/web distinction is not carried as a structured field; if it ever needs to be recovered downstream, `page_reference` presence is a strong (not definitional) signal for print, and the legacy migration key is preserved as import-provenance on legacy records. |
| **Broadcast appearance** `broadcast_appearance` | A research-derived appearance on radio, television, or in a podcast — a recorded broadcast where the researcher communicates research to a general audience. | Guest appearance on Canvas; interview on Radio 1; weekly podcast episode on climate policy; TED talk recording released as broadcast | A presentation at any venue, scholarly or public (→ `conference_presentation`); a research-output video that is not a broadcast (→ attach as a file on the parent record, see "What is not a type") | CSL `broadcast`. Maps to COAR `≈ other`. DataCite `≈ Audiovisual` (video) or `≈ Sound` (audio). Required fields: channel/platform, programme name, air date. Not VABB-eligible. Absorbs research-communication video forms. |
| **Popular book** `popular_book` | A research-derived book aimed at a general audience, published with an ISBN through a trade publisher rather than a scholarly press. | Popular-science book; trade book aimed at general readers; popular history written for a non-academic audience | A scholarly monograph (→ `book`); a textbook for university students (→ `book`); a popular article in a periodical (→ `popular_article`); a children's educational book unrelated to specific research (→ out of scope) | CSL `book`. Maps to COAR `≈ book`. Required: ISBN, publisher. Not VABB-eligible (popular venues do not qualify for VABB). The boundary with scholarly `book` is publisher and intended audience: a scholarly press publishing for academics is `book`; a trade press publishing for general readers is `popular_book`. |

---

## Fields to be defined

The type system depends on several metadata fields that are referenced throughout
this document but not yet fully specified. These must be defined before any type
is considered implementation-ready. Field definitions are a separate deliverable
from type definitions — they require input from curators, the backend developer,
and in some cases policy confirmation.

**Fields scoped to a ⚠️ TBD type are parked alongside that type.** They
ship if and only if the type does. Each parked field below carries a
⚠️ marker and a back-reference to the relevant entry in "To be discussed";
the specifications are preserved as drafts so the workshop has them to
react to, not as commitments.

**Publication version**
A closed-vocabulary text field aligned with COAR Version Type vocabulary and
NISO/ALPSP JAV: `submitted version`, `accepted version`, `published version`.

This is the field that captures preprint state. A preprint is not a type — it is a
`journal_article` (or other applicable type) with publication version `submitted
version` and a server identifier. The legacy system's `miscellaneous_types.preprint`
subtype is replaced by this field. See "What is not a type" below.

**Applies to** (peer-review lifecycle types only): `journal_article`,
`review_article`, `book`, `book_chapter`, `conference_paper`. Possibly
`report` and `review` (drafts vs. final — confirm with curators). Does
not apply to types without a peer-review lifecycle: `dataset`, `software`,
`dissertation`, `conference_abstract`, `conference_poster`,
`conference_presentation`, `lecture`, `popular_article`,
`broadcast_appearance`, `popular_book`. The `annotation` and `policy_report`
candidate types are ⚠️ TBD and not included here — if they ship, neither
is expected to carry a peer-review lifecycle, but that is for the workshop
to confirm.

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
article` for `journal_article`). Other export targets need explicit decisions
rather than being assumed unaffected:

- *DataCite* ⚠️ — DataCite has `Preprint` available as a `resourceTypeGeneral`
  (added in schema 4.4, retained through 4.6). Whether Biblio emits `Preprint`
  or stays with `JournalArticle` for preprint-state records is the
  workshop question. Staying with `JournalArticle` is defensible (citation
  tools that don't yet handle `Preprint` get a familiar value; the
  preprint state is already carried by COAR), but emitting `Preprint`
  is now equally available. ⚠️ TBD — confirm intended DataCite export
  with the workshop.
- *CSL* stays `article-journal` — preprints cite as articles.
- *CrossRef* — CrossRef has `posted-content` for preprints (used by preprint
  servers like ChemRxiv), not the `journal_article` type. Biblio never mints
  CrossRef DOIs anyway (see Resolved decisions § "CrossRef and WoS as
  indirect downstreams"); the earlier claim that "CrossRef does not register
  preprints" was loose phrasing on top of an already-out-of-scope concern.

VABB and FRIS/FWO are unaffected — preprints are not VABB-eligible regardless
of derivation, and FWO pulls only the published version. This rule is the
first entry in the derivation-rule budget (Mapping architecture → Export
derivation-rule budget); see there for the second rule and the budget
policy.

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

**Lecture audience**
A required closed-vocabulary field on `lecture`: `academic` (invited
institutional lectures, named lectures, masterclasses, lectures at
peer-discipline events) or `public` (museum talks, science festivals,
community lectures, heritage-day talks).

Drives UB2030 §3.1 outreach reporting (filterable as `lecture` +
`lecture_audience = public`). Does not drive any COAR export derivation — COAR
collapses both into `lecture` (`c_8544`). No new entry in the
derivation-rule budget.

Field shape (closed vocabulary) — see Open questions for raven for the
raven-side representation choice.

Owner: researcher-provided at deposit, curator-correctable.

**Per-type fields for the three popular-bucket types**

Each of `popular_article`, `broadcast_appearance`, and `popular_book` carries
its own structured fields appropriate to its medium, replacing the free-text
`medium` field on the now-removed `research_communication` type.

- `popular_article`: required `venue_name`; optional `url`, `page_reference`,
  `issue_reference` — populated when the venue actually carries each. The
  print/web distinction is not surfaced as a structured field; see Resolved
  decisions § "`venue_form` dropped from `popular_article`" for the reasoning
  and the legacy-provenance handling.
- `broadcast_appearance`: required `channel_or_platform`, `programme_name`,
  `air_date`; optional duration; optional recording link.
- `popular_book`: required `isbn`, `publisher`, `edition`.

Field shapes are the responsibility of the per-type fields document, not this
one. The list above is the type-design commitment to *which* fields each type
requires; *how* each field is represented in raven is decided in the field
workshop.

Note: a recording of a `conference_presentation`, `lecture`, or
`broadcast_appearance` is a related output — attach the recording as a
file linked to the parent record. The recording is not a separate `video`
deposit.

**Why granular types rather than a single bucket**

The current design splits the popular-communication territory into three
medium-specific top-level types. This is a two-step evolution: the v0.3
single-bucket design (`research_communication`) was first reversed into
four medium-specific types (Resolved decisions § "`research_communication`
split into four medium-specific types"), then partially walked back when
`online_publication` was folded into `popular_article` on closer reading
of Principle 1 (Resolved decisions § "`online_publication` collapsed into
`popular_article`"). The internal `venue_form` discriminator introduced
in that collapse has since been dropped (Resolved decisions § "`venue_form`
dropped from `popular_article`"). The current shape: three types, with
`popular_article` covering both print and web venues without an internal
discriminator field.

**Principle 3, properly applied.** Principle 3 requires both tests to pass for
a type split: substantially different metadata schema AND the external world
treats them as distinct. On close inspection of what records of each medium
actually carry:

- `popular_book` has ISBN, publisher, edition — book-shaped record.
- `popular_article` has venue name, optional URL, optional page/issue reference
  — article-shaped record; the print/web variation is field-shaped, not
  type-shaped, because the activity is identical and only the substrate differs
  (Principle 1).
- `broadcast_appearance` has channel, programme name, air date —
  broadcast-shaped record. A radio interview is a different *activity*
  from an authored article, not just a different substrate.

The three types ARE meaningfully different schemas, and the broadcast /
article / book trio corresponds to three distinct intellectual activities.
Test 1 passes across the three. Test 2 also passes across the three (COAR
/ CSL / DataCite distinguish each: `≈ other` vs. `≈ other (text)` /
`blog post` vs. `book` for COAR; `broadcast` vs. `article-magazine` /
`post-weblog` vs. `book` for CSL). Per Principle 3, granular types are
the rule-consistent answer at *this* level of granularity.

**Why not split print/web inside `popular_article`.** Splitting `popular_article`
further by venue would fail Principle 1: a magazine piece and a blog post are
the same intellectual activity (a researcher writing a short prose piece for a
general audience) on different substrates. Principle 3 test 1 also fails on
closer inspection — venue name, optional URL, optional page reference are
essentially the same fields under different labels. The print/web distinction
is not carried as a structured field on the record; the legacy migration key
is preserved as import-provenance, and `page_reference` presence is a strong
(not definitional) signal for print if the distinction ever needs to be
recovered downstream. See Resolved decisions § "`venue_form` dropped from
`popular_article`" for the reasoning.

**The cost.** Three medium-specific popular types in the type list:
`popular_article`, `broadcast_appearance`, `popular_book`. Reached
across multiple iterations — the v0.3 single bucket was first split four
ways in v0.4, then `online_publication` was folded back into `popular_article`
with an internal `venue_form` discriminator, and `venue_form` was
subsequently dropped entirely (see Resolved decisions for each step).

Researchers see three popular options on the deposit picker (article,
broadcast, book), each with a tight positive definition and a clearly
distinct activity. The principle-6 trash-bucket risk is mitigated because
each type maps to a distinct intellectual activity, not a residual
catch-all.

**Decision history**

Four options were evaluated for handling research-communication output across
two iterations. Recording the path so future readers understand the reasoning.

1. **Single bucket with generic citation** (v0.3 earlier draft). One type
   `research_communication`, free-text `medium`, generic CSL `article-magazine`.
   **Rejected**: schemas DO differ meaningfully across media
   (broadcast vs. article vs. book); Principle 3 actually requires *some*
   split.

2. **Light controlled vocabulary on top of free text** (considered, never
   released). Add a closed-vocabulary `medium_kind` field with values mapping
   to CSL. **Rejected**: structurally identical to the rejected `article-form`
   field for letter / note — a closed-vocabulary subdivision dressed as a
   property field, violating "no subtypes."

3. **Granular split into four top-level types** (v0.4, after `public_lecture`
   was collapsed into `conference_presentation`). Each medium a first-class
   type choice on the deposit picker: `popular_article`, `online_publication`,
   `broadcast_appearance`, `popular_book`. **Partially walked back** — the
   print/web split was a Principle 1 misjudgment that this iteration corrected
   while keeping the article/broadcast/book trio intact. See Resolved
   decisions § "`online_publication` collapsed into `popular_article`".

4. **Granular split into three top-level types with `venue_form` on**
   **`popular_article`** (subsequently revised). `popular_article` covered
   both print and web venues via an internal discriminator;
   `broadcast_appearance` and `popular_book` stayed separate because their
   activities differ from a written article, not just their substrates.
   Researchers self-classified between three intuitive categories (article,
   broadcast, book) and answered one yes/no-shaped question about the
   venue's form when the type was `popular_article`. **Superseded by
   option 5.**

5. **Granular split into three top-level types, no internal discriminator**
   (current). Same three types as option 4, but `popular_article` carries
   no `venue_form` field. The print/web distinction is not surfaced as
   structured data on new records; the legacy migration key is preserved
   as import-provenance, and `page_reference` presence acts as a strong
   (not definitional) signal if the distinction ever needs to be recovered
   downstream. **Adopted.** See Resolved decisions § "`venue_form` dropped
   from `popular_article`" for the full reasoning.

**Resolved on option 5 (granular split, three-way, no internal
discriminator).** The single-bucket Plan A is held in reserve as a
documentation artefact only — if researcher cognitive load proves too high
in user testing across the remaining three types, the fallback is a single
`popular_communication` parent type with required medium fields. That
fallback is not currently planned.

**Context** (specification deferred to the per-type fields project)
A free-text field available on all types, used by researchers to describe their
output when no controlled term fits precisely. Referenced by several type
definitions and Open questions in this doc as an existing field. Full
specification (length limits, indexing, curator visibility) lives in the
per-type fields project, not here.

**⚠️ Annotation scheme** — parked pending TBD
Applied to `annotation`, which is currently ⚠️ TBD (see "To be discussed").
This field specification is parked until the workshop confirms whether
`annotation` ships as a v1 type. Original spec preserved here for reference:
optional on `annotation`; captures the standard or framework used (e.g. TEI,
Web Annotation, CATMA) when the annotation belongs to a defined scheme;
required when `collection_indicator = yes`. Full vocabulary, value list, and
validation belong in the per-type fields project once the type ships.

**⚠️ Collection indicator** — parked pending TBD
Applied to `annotation`, which is currently ⚠️ TBD. Spec preserved for
reference: a yes/no field on `annotation` parallel to `series_indicator` on
`book`; when yes, follow-on fields `collection_name` (required) and
`collection_identifier` (optional, DOI/Handle/URL with `relation = part_of`).
A published collection of annotations as a deliverable (e.g. a TEI-encoded
annotated corpus with its own DOI) routes to `dataset` regardless of whether
`annotation` ships — see Resolved decisions § "`annotation_collection`
collapsed."

**Parent reference**
For `book_chapter`: the parent ISBN is the required anchor (captured as an
identifier with `relation = part_of`). When the parent book exists as a Biblio
record, raven resolves the ISBN to a record-to-record link automatically — the
link is a strengthening, not a separate requirement. The same pattern would
apply to `annotation` for the annotated resource and to `review` for the
reviewed-work identifier; the `annotation` case is ⚠️ parked pending TBD
(see "To be discussed").
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

**⚠️ Policy report audience** — parked pending TBD
Applied to `policy_report`, which is currently ⚠️ TBD (see "To be
discussed"). Spec preserved for reference: the target decision-making body
or institution the report is addressed to; the existence of this field was
the principal structural difference distinguishing `policy_report` from
`report`. If the workshop confirms `policy_report` ships, the field's exact
shape (free-text vs. controlled vocabulary) is deferred to the per-type
fields project.

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

How each Biblio `kind` maps to the systems we import from and export to. The
three-layer view (researcher label → internal `kind` → external schema)
is the framing; see "Three layers" above. The translation between them
must be explicit, documented, and maintained as a contract.

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
- ☢️ Weak-fit type — Biblio-owned, no import pipeline, export is approximate only

### Export derivation-rule budget

Most types map to a single external term per target schema. A small number
of rules derive the external term from a per-record field value at export
time, rather than from the type alone. The full set is held to one:

1. **Preprint COAR derivation.** When `publication_version = submitted
   version` AND a server identifier is present, COAR export emits
   `preprint` (`c_816b`) instead of the type's default term. See
   Fields to be defined → Publication version → Export consequence.

**Budget rule.** Each rule is tightly scoped — one condition each, no
growing keyword map. If a *second* derivation rule is ever proposed,
that is the signal to revisit whether the underlying distinction
deserves a top-level type rather than continuing to grow the
derivation budget. The `reference_entry` promotion (Resolved decisions)
is the precedent: a CSL derivation rule on `book_chapter` was
considered and rejected in favour of promoting the type. The earlier
`popular_article` venue-form derivation has also been retired — see
Resolved decisions § "`venue_form` dropped from `popular_article`".

### Import sources

What each source system calls the type when Biblio imports a record from it.

**Note on source status.** Plato is the only candidate-harvest source
currently wired up. WoS is the next planned source. All other columns in
the table below — CrossRef, PubMed, OpenAIRE, OpenAlex, BibTeX — are
aspirational mappings recorded while the design is fresh, not live
pipelines. The mapping rows are the working contract for when each source
is implemented. Plato's type vocabulary is not yet documented here;
adding a Plato column is a follow-up task.

| Researcher label | Biblio `kind` | WoS | CrossRef / DOI | PubMed | OpenAIRE | OpenAlex | BibTeX |
|-----------------|--------------|-----|---------------|--------|----------|----------|--------|
| **Journal article** | `journal_article` | Article | `journal_article` | Journal Article | literature → journal article | `article`; `editorial`; `erratum`; `letter` (provenance); `preprint` (→ submitted version) | `@article` |
| **Review article** | `review_article` | Review | `journal_article` (+ review flag) | Review | literature → review article | `review` | `@article` |
| **Book** | `book` | Book | `book`; `edited-book` | Book | literature → book | `book` | `@book` |
| **Book chapter** | `book_chapter` | Book Chapter | `book_chapter` | Book Section | literature → part of book | `book-chapter` | `@incollection`; `@inbook` |
| **Reference entry** | `reference_entry` | — | `reference-entry` | — | literature → part of book | `reference-entry` | ≈ `@incollection` |
| **Conference paper** | `conference_paper` | Proceedings Paper | `proceedings-article`; `book` | Conference Paper | literature → conference paper | — | `@inproceedings` |
| **Conference abstract** | `conference_abstract` | Meeting Abstract | — | — | ≈ literature → conference object | — | ≈ `@misc` |
| **Poster** | `conference_poster` | — | — | — | ≈ literature → conference object | — | ≈ `@misc` |
| **Presentation** | `conference_presentation` | — | — | — | ≈ literature → conference object | — | ≈ `@misc` |
| **Lecture** | `lecture` | — | — | — | ≈ literature → other research product | — | ≈ `@misc` |
| **Dissertation** | `dissertation` | — | `dissertation` | Dissertation; Thesis | literature → thesis | `dissertation` | `@phdthesis`; `@mastersthesis` |
| **Dataset** | `dataset` | Data Paper | `dataset` | — | dataset | `dataset` | ≈ `@misc` |
| **Software** | `software` | Software | `software` | — | software | — | ≈ `@misc` |
| **Report** | `report` | Report | `report` | Technical Report | ≈ literature → other research product | `report`; `standard` | `@techreport` |
| ⚠️ TBD **Policy report** | `policy_report` | — | `report` | — | ≈ literature → other research product | ≈ `report` | `@techreport` |
| ⚠️ TBD **Annotation** | `annotation` | — | — | — | ≈ literature → other research product | — | ≈ `@misc` |
| **Review** ☢️ | `review` | Book Review | — | — | ≈ literature → review | — | ≈ `@misc` |
| **Popular article** ☢️ | `popular_article` | — | — | — | — | — | ≈ `@article` |
| **Broadcast appearance** ☢️ | `broadcast_appearance` | — | — | — | — | — | ≈ `@misc` |
| **Popular book** ☢️ | `popular_book` | — | — | — | — | — | ≈ `@book` |
| ⚠️ TBD **Patent** | `patent` | — | — | — | — | — | ≈ `@misc` |

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

**Note on OpenAlex.** OpenAlex is not a direct export target. It reaches
Biblio data transitively via CrossRef DOIs, DataCite DOIs, and the
OpenAIRE/COAR feed — if those exports are correct, OpenAlex is correct.
See Resolved decisions § "OpenAlex as an indirect downstream, not a
direct export target" for the full reasoning and the import-direction
mapping.

| Researcher label | Biblio `kind` | COAR 3.2 | DataCite 4.6 | OpenAIRE | CSL 1.0.2 | VABB | FRIS / FWO |
|-----------------|--------------|----------|-------------|----------|-----------|------|------------|
| **Journal article** | `journal_article` | ✅ `research article` | ✅ `JournalArticle` | ✅ literature | ✅ `article-journal` | A1 / A2 | ✅ publication (FWO mandatory) |
| **Review article** | `review_article` | ✅ `review article` | ✅ `JournalArticle` | ✅ literature | ✅ `article-journal` | A1 / A2 | ✅ publication (FWO mandatory) |
| **Book** | `book` | ✅ `book` | ✅ `Text / Book` | ✅ literature | ✅ `book` | B1 | ✅ publication |
| **Book chapter** | `book_chapter` | ✅ `book part` | ✅ `Text / BookChapter` | ✅ literature | ✅ `chapter` | B2 | ✅ publication |
| **Reference entry** | `reference_entry` | ✅ `book part` | ✅ `Text / BookChapter` | ✅ literature | ✅ `entry` | B2 | ✅ publication |
| **Conference paper** | `conference_paper` | ✅ `conference paper` | ✅ `Text / ConferencePaper` | ✅ literature | ✅ `paper-conference` | C1 | ✅ publication |
| **Conference abstract** | `conference_abstract` | ✅ `conference object` | ≈ `Text / Other` | ≈ literature | ≈ `paper-conference` | — | publication |
| **Poster** | `conference_poster` | ✅ `conference poster` | ≈ `Text / Other` | ≈ literature | ≈ `paper-conference` | — | publication |
| **Presentation** | `conference_presentation` | ✅ `conference presentation` | ≈ `Text / Other` | ≈ literature | ✅ `speech` | — | publication |
| **Lecture** | `lecture` | ✅ `lecture` (`c_8544`) | ≈ `Text / Other` | ≈ literature | ✅ `speech` | — | publication |
| **Dissertation** | `dissertation` | ✅ `thesis` | ✅ `Text / Dissertation` | ✅ literature | ✅ `thesis` | — | ✅ publication |
| **Dataset** | `dataset` | ✅ `dataset` | ✅ `Dataset` | ✅ dataset | ✅ `dataset` | — | ✅ dataset (FWO mandatory) |
| **Software** | `software` | ✅ `software` | ✅ `Software` | ✅ software | ✅ `software` | — | ✅ publication |
| **Report** | `report` | ✅ `report` (default) / ✅ `working paper` (when `series_indicator = yes`) | ✅ `Text / Report` | ≈ literature | ✅ `report` | R1 (when `series_indicator = yes` AND series ISBN/ISSN present) | ✅ publication |
| ⚠️ TBD **Policy report** | `policy_report` | ✅ `policy report` | ≈ `Text / Report` | ≈ other research product | ≈ `report` | — | publication |
| ⚠️ TBD **Annotation** | `annotation` | ✅ `annotation` | ≈ `Text / Other` | ≈ other research product | ≈ `entry` | — | publication |
| **Review** ☢️ | `review` | ✅ `review` (`c_efa0`); `book review` (`c_ba08`) for book reviews | ≈ `Text / Other` | ≈ literature | ✅ `review` / `review-book` | — | publication |
| **Popular article** ☢️ | `popular_article` | ≈ `other (text)` | ≈ `Text / Other` | ≈ other research product | ✅ `article-magazine` | — | publication |
| **Broadcast appearance** ☢️ | `broadcast_appearance` | ≈ `other` | ≈ `Audiovisual` / `Sound` | ≈ other research product | ✅ `broadcast` | — | publication |
| **Popular book** ☢️ | `popular_book` | ≈ `book` | ✅ `Text / Book` | ≈ literature | ✅ `book` | — | publication |
| ⚠️ TBD **Patent** | `patent` | ✅ `patent` (`c_15cd`) | ✅ `Text / Patent` (DataCite has `Patent` as `resourceTypeGeneral` since 4.4) | ≈ other research product | ≈ `patent` (CSL 1.0.2 has `patent`) | — | ✅ patent (FRIS top-level category) |

⚠️ **The OpenAIRE column shows OpenAIRE product categories, not COAR terms.**
OpenAIRE exposes four top-level product types — `literature`, `dataset`,
`software`, `other research product` — and consumes COAR Resource Types for
sub-classification *within* a category. This table's OpenAIRE column is the
top-level category only; the COAR column carries the sub-classification
OpenAIRE will read. A reader assuming the two columns are alternative encodings
of the same thing would misread the mapping.

☢️ **Weak-fit types are Biblio-owned.** The three popular-bucket types
(`popular_article`, `broadcast_appearance`, `popular_book`) and `review`
have limited or no import pipeline support and approximate external schema
mappings outside CSL. This is intentional — these types exist because Biblio's
completeness mission extends beyond what funding systems reward. The two
TBD candidate types (`policy_report`, `annotation`) carry their mapping rows
in the tables above pending workshop confirmation; whether either ships is
an open question — see "To be discussed".

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
  a recording of a `conference_presentation`, footage attached to a `dataset`
  (microscopy, observational data), or accompanying material on a
  `journal_article`. The video is the *medium*; the research activity is the
  broadcast, the lecture, the data collection, or the paper. Attach the video
  file to the parent record. COAR `video` (`c_12ce`) is not adopted as a
  Biblio type.
- **Website** — not a type. A research-output "website" is either a
  `dataset` (a database, corpus exploration interface, structured data
  collection accessible via the web), `software` (an interactive tool with
  a web frontend), or `popular_article` (a single web piece on a blog,
  online magazine, or popular-science platform). The bare-website case —
  a research project's portal page — is institutional infrastructure
  rather than a citable research output. COAR `website` (`c_7ad9`) is not
  adopted as a Biblio type.
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
- **Patent** — ⚠️ now TBD, no longer fully out of scope. The UGent Tech
  Transfer Office (TTO) is the canonical system of record for IP and stays
  that way. The TBD demotion reflects a different question: researchers
  apparently do add patents to Biblio occasionally, and the future direction
  may be to allow it as a first-class type with TTO as the upstream source.
  See "To be discussed" § `patent` for the case-for / case-against and the
  workshop questions. FRIS distinguishes patents as a top-level reporting
  category; if `patent` ships, the FRIS flow can come either through TTO
  (status quo) or via Biblio (if researchers deposit there too), but only
  one is canonical.
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

- **Policy report and report as separate types vs. combined — now ⚠️ TBD.** This
  question was previously in tentative resolutions with `policy_report` slated
  to ship as a separate v1 type. **`policy_report` has now been demoted to
  ⚠️ TBD** — see "To be discussed." The trigger was workshop uncertainty
  about whether the type will be used enough to justify the deposit-picker
  cost and the curator-training overhead. Until that volume question is
  resolved, the current design routes policy-facing reports to `report`, with the
  policy framing captured via the context field if needed.

  The reasoning that brought the type-split question into tentative resolutions
  in the first place is preserved here, because the same arguments will
  resurface if the workshop revisits the question:

  **Why this is weak by Principle 3.** Test 1 (substantially different metadata
  schema) genuinely fails — same skeleton, one extra field (target audience – which we do not want to create because it adds cognitive load for regular reports).
  Test 2 (external world treats as distinct) is partial: only COAR distinguishes
  cleanly. DataCite collapses both to `Text / Report` (≈); OpenAIRE actually maps
  `policy_report` to `≈ other research product`, a *worse* fit than `report`'s
  `≈ literature`. By the doc's own rule ("if only one test passes, the
  distinction is handled by a field, not a type split"), the split is on the
  wrong side of the line.

  Pros of separating, if reopened:
  - COAR 3.2 has `policy report` as a distinct, ✅-mapped term — clean export.
  - UB2030 §3.1 elevates maatschappelijke impact as a strategic line; a
    separate type makes societal-impact output discoverable and reportable as
    a distinct category.
  - The audience semantics differ meaningfully — a policy report is addressed
    *to* someone with the explicit purpose of informing a decision; a general
    report is not.

  Cons (arguments for keeping it merged into `report`):
  - Principle 3 fails as documented above.
  - Boundary is fuzzy at deposit — a report to a ministry and an institutional
    report can be hard to tell apart, especially when the same document serves
    both purposes.
  - VABB-irrelevant either way; FWO does not distinguish.
  - Volume at UGent is uncertain (the trigger for this demotion).

  Three viable resolutions if the workshop reopens the question:
  1. Promote back to v1 as a separate type. Justification: COAR clean mapping
     + UB2030 strategic alignment + clean aggregate reporting.
  2. Promote back to v1 as a merged `report` type with a required audience
     field (values: `academic`, `institutional`, `policy-maker`, etc.) — same
     pattern as the `working_paper` merge. The audience field drives both
     COAR mapping (export as `policy report` when audience is `policy-maker`)
     and societal-impact reporting, without forcing the researcher to make
     the type distinction at deposit.
  3. Keep `report` and capture policy framing via the context field rather
     than as a distinct type or as a structured audience field. Justification:
     minimum schema, maximum researcher simplicity; trades clean COAR export
     for clean researcher experience.

  ⚠️ TBD — the volume-of-use question is the trigger for the next workshop
  pass. Resolution 2 remains the recommended landing if it ships at all, by
  analogy to the `working_paper` merge. Resolution 3 is the current v1
  behaviour while the type is TBD.

- **Annotation as a type — now ⚠️ TBD.** `annotation` was previously in the v1
  type list. **It has been demoted to ⚠️ TBD** — see "To be discussed." The
  trigger was reviewer feedback: it was not clear where annotations belong in
  the taxonomy, what the boundaries are with `dataset` (for annotation
  collections) and with `book_chapter` / `journal_article` (for inline
  commentary), and how researchers would self-classify into it. The collection
  vs. single-annotation split, currently handled by the `collection_indicator`
  field, is part of what is unclear.

  The previously-tracked sub-questions are now upstream of the
  ships-or-doesn't-ship decision and live in "To be discussed":
  - Is a single annotation (TEI line annotation, scholarly note on a corpus
    sentence) a citable Biblio research output at UGent volume? Or is the
    intellectual contribution always carried by the parent dataset or work,
    with the annotations as attached files?
  - If `annotation` ships, does the `collection_indicator` pattern correctly
    handle the collection-as-deliverable boundary with `dataset`, or does the
    boundary need to be re-drawn?
  - Are TEI / Web Annotation / CATMA annotation schemes the right vocabulary
    starting point, or does UGent humanities practice surface a different
    set?

  ⚠️ TBD — confirm with the workshop. Needs input from
  letteren-bibliothecarissen and from the Ghent Centre for Digital
  Humanities, since annotation as a citable artefact is most clearly a
  digital-humanities concern.

- **Granular popular-bucket types: keep three, or simplify further?** The
  current design splits popular-communication into three types:
  `popular_article`, `broadcast_appearance`, `popular_book`. This is the
  result of multiple iterations: the v0.3 single-bucket `research_communication`
  was first split into four medium-specific types (Resolved decisions §
  "`research_communication` split into four medium-specific types"),
  `online_publication` was folded back into `popular_article` with an
  internal `venue_form` discriminator (Resolved decisions §
  "`online_publication` collapsed into `popular_article`"), and
  `venue_form` was subsequently dropped (Resolved decisions § "`venue_form`
  dropped from `popular_article`"). The print/web subset of this open
  question is now resolved.

  Reopening question that remains: is even three the right granularity, or
  could `broadcast_appearance` and `popular_book` be folded into a single
  parent type as well?

  - `popular_book` has a strong book-shape (ISBN, publisher, edition) that
    makes it cleanly distinguishable from a written article. The boundary
    with scholarly `book` is publisher and audience, not substrate.
  - `broadcast_appearance` represents a meaningfully different *activity*
    from writing an article (oral, often dialogic, usually elicited by a
    host). Principle 1 supports keeping it distinct — substrate is not the
    discriminator, activity is.
  - The deposit-picker cost at three types is modest. Researcher cognitive
    load is now "is this an article, a broadcast, or a book?" — which is
    not noticeably harder than `book` vs. `book_chapter` vs.
    `journal_article`.

  Three options to evaluate, if reopened:
  1. Keep the three-way split as currently designed (current).
  2. Collapse `broadcast_appearance` into `popular_article` with a
     required `medium` field (`print`, `web`, `broadcast`). **Likely**
     **wrong** — violates Principle 1 (activity vs. substrate). Recorded for
     completeness only.
  3. Collapse all three into a single `popular_communication` type with a
     required `medium` field. Same pattern as `series_indicator` on
     `report`. Risk: looks like the rejected `medium_kind` field, but is
     operationally a conditional field-set. Would re-introduce the activity
     conflation Principle 1 was protecting against.

  ⚠️ TBD — mostly closed by the `online_publication` collapse. Worth a
  brief check-in in the workshop to confirm the three-way landing.

### Other open questions

#### Needs workshop input

- **Standalone preprints that never advance to an accepted or published
  version.** The hard rule treats preprint as a state of an article, not a
  type. Structurally this works for the never-advancing case too — a
  `journal_article` in `submitted version` state is a valid long-lived
  record, and COAR export already emits `preprint` for it. The empirical
  question is whether researchers actually return to the record to update
  `publication_version` when the article eventually publishes, or whether
  the submitted-version state becomes a silent default that the system
  never corrects. Same re-engagement friction as the `report`
  document-iteration case (Fields to be defined → A note on `report`
  and document iterations). If user testing shows researchers do not
  return, the fix is a curator-side review prompt or an automated
  DOI-based check, not a type promotion. ⚠️ TBD — empirical, not
  structural; revisit after deposit-flow user testing.

- **Commentary as a sub-question on `journal_article`:** A *commentary*
  is an in-depth analytical piece about an existing work, distinct from
  `review_article` (literature synthesis) and `review` (review of one
  specific work). COAR (`D97F-VB57`) defines it as "a more in-depth
  analysis written to draw attention to a work already published." The
  2024 vocabulary review captured it as distinct.

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

- **DataCite minting authority at UGent.** Who mints DataCite DOIs at UGent
  for each Biblio `kind`? Candidates: Biblio itself (for datasets via the
  legacy minting flow, dissertations, software); FAIRVault (datasets per
  UB2030 §3.2.1 — the FAIRVault collaboration is explicitly about
  inter-university dataset infrastructure); per-service decisions (e.g.
  Boekentoren for erfgoed collections; domain-specific repositories for
  domain-specific outputs). The Export targets table currently shows
  DataCite mappings on every row; this open question is about the
  *minting authority*, not the resource-type mapping itself, which stays
  valid regardless of who mints. ⚠️ TBD — confirm with the backend developer
  and the FAIRVault team.

#### Needs developer check

- **Software and VABB:** Software is not VABB-eligible. Confirm that `software` type
  records are excluded from VABB validation queries without manual intervention.

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
- **Public lecture vs. conference presentation:** Resolved — see Resolved
  decisions § "`public_lecture` collapsed into `conference_presentation`"
  (partially superseded) and § "`lecture` split off from
  `conference_presentation`" (the current shape). Public-venue lectures
  now route to `lecture` with `lecture_audience = public`; academic
  lectures outside a conference route to `lecture` with `lecture_audience
  = academic`; conference-floor talks stay on `conference_presentation`.
- **OpenAlex column and export scope:** Resolved — see Resolved decisions
  § "OpenAlex as an indirect downstream, not a direct export target".
  Import-direction only; no direct export pipeline; collapse decisions
  for `preprint`, `letter`, `reference-entry`, etc. preserve the original
  OpenAlex type as import-provenance metadata.
- **CrossRef export scope:** Resolved — see Resolved decisions
  § "CrossRef and WoS as indirect downstreams; openjournals.ugent.be mints CrossRef DOIs".
  Biblio does not mint CrossRef DOIs; openjournals.ugent.be mints for UGent's
  diamond OA journals, commercial publishers mint for traditional journals.
- **WoS export scope:** Resolved — see same § as above. WoS is an indexing
  service reached transitively via CrossRef and OAI-PMH; no Biblio → WoS
  export pipeline.
- **EOSC Observatory and EU monitoring:** Resolved — see Resolved decisions
  § "EOSC Observatory and EU monitoring are not a separate Biblio layer".
  External reporting frameworks do not drive new Biblio types; "newer"
  EOSC-tracked categories are absorbed by existing kinds and become
  "just another deposit."
- **CSL rendering for reference entries:** Resolved — see Resolved decisions
  § "`reference_entry` split off from `book_chapter`". The CSL imprecision
  was load-bearing enough on its own to drive promotion; `reference_entry`
  is now a v1 type and renders as CSL `entry`.

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

**Current v1 type count: 18.** Six further candidates are ⚠️ TBD. The
resolved decisions below record changes as relative deltas (`+1 type`,
`–1 type`); the absolute count is stated here once so future demotions or
promotions don't require updating each historical entry.

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

### Editorial material collapses into `journal_article`

Editorial material — strict editorials, invited perspectives, journal-news
items, book-review prefaces, in-memoriam pieces, biographical sketches that
happen to appear in a journal — collapses into `journal_article` with the
original source-system tag preserved as import-provenance metadata. Same
family as letter and note (see § "`journal-letter` and `journal-note`
dropped"); same pattern as correction and erratum.

**Reasoning.** Principle 3 test 1 fails cleanly — editorial material is
schema-identical to a journal article (peer-reviewed or editorial-board
journal, DOI via CrossRef, authors, journal name, issue/volume, page range).
Test 2 partially passes: COAR has `editorial` (`c_b239`) and OpenAlex has
`editorial` as distinct terms, but CrossRef does not distinguish (it's
`journal_article`), DataCite collapses, CSL has no specific term, FRIS / FWO
collapse. The split passes only on the COAR / OpenAlex side, which is exactly
the condition the doc's rules say resolves with a field-or-provenance, not a
type.

**WoS "Editorial Material" is broader than the strict term.** WoS lumps
editorials, invited perspectives, journal-news items, book-review prefaces,
and biographical sketches together under one document type. The heterogeneity
inside Editorial Material is below Biblio's type granularity, and that's
fine — all of them are journal-article-shaped at the schema level. Curators
or reporting consumers who care about the WoS-level distinction can read it
from the import-provenance audit field.

**The journal-collapse family.** Five source-system tags (some also
present as legacy keys) collapse into `journal_article` on the same
logic, all preserving the original tag as import-provenance:

- `letter` (WoS, PubMed, CrossRef — also a legacy key via
  `journal_article_types.letterNote`) — see § "`journal-letter` and
  `journal-note` dropped".
- `note` (WoS — also a legacy key via `journal_article_types.letterNote`)
  — same section.
- `editorial` / `editorialMaterial` (WoS, OpenAlex — also a legacy key
  via `miscellaneous_types.editorialMaterial`) — this section.
- `correction` (legacy key `miscellaneous_types.correction` plus import
  sources) — see migration matrix.
- `erratum` (OpenAlex import only — no legacy key; preservation rule
  comes from § "OpenAlex as an indirect downstream", not from a legacy
  migration row).

The broader question of whether *every* imported source-system type that
doesn't map one-to-one to a Biblio kind is preserved as audit metadata
remains open — see Open questions § "Source-system type preservation scope".
This section commits to the preservation pattern for the five-member family
above; the open question is about extension beyond it.

**Consequences.**
- WoS imports tagged "Editorial Material", PubMed imports tagged "Editorial",
  CrossRef imports (no distinct tag — they arrive as `journal_article`), and
  OpenAlex imports tagged `editorial` all become `journal_article` records.
  Original source-system tag preserved as import-provenance metadata only.
- COAR export emits `research article` rather than the specific `editorial`
  term. Acceptable loss — same pattern as letter/note export.
- VABB / FWO unaffected. Neither distinguishes editorial material as a
  separate eligibility category.

**Boundary cases that do not arrive as "Editorial Material" from external
sources.**
- A foreword or introduction in an edited book → `book_chapter`. Same
  intellectual activity (framing content), different venue.
- A standalone op-ed in a newspaper or magazine → `popular_article`. The
  "editorial" framing is a magazine/newspaper convention, distinct from a
  journal editorial.
- A series-editor standards document → `report`. Rare; doesn't arrive tagged
  "Editorial Material" by any feed.

**Reopening criteria.** Same as letter/note: if curators routinely query
"show me all editorials in the queue" as a standard operational task — not
"we could in principle" but "we do this every week" — the
import-provenance-only approach is insufficient. Confirm with the curator
team.

### `research_communication` split into four medium-specific types

**Status**: superseded in part. The four-way split established in this
decision was partially walked back when `online_publication` was folded
back into `popular_article`. See § "`online_publication` collapsed into
`popular_article`" for the current shape (three types). The reasoning
below remains the original record for the move from one bucket to four;
it is left intact for historical traceability.

An earlier draft used a single `research_communication` type with a
free-text `medium` field, applying generic CSL `article-magazine` citation
regardless of medium. The current design uses four top-level types:
`popular_article`, `online_publication`, `broadcast_appearance`,
`popular_book`. (Originally split into five; `public_lecture` was later
collapsed into `conference_presentation` — see § "`public_lecture`
collapsed into `conference_presentation`".)

**Reasoning.** Principle 3 requires both tests to pass for a type split. An
earlier draft claimed test 1 (schema) failed because all media share `title +
author + date + venue/medium name`. On review against the 2024 vocabulary
findings, the schemas DO differ meaningfully — ISBN/publisher/edition
for a popular book; URL/site name for an online publication;
channel/programme/air date for a broadcast appearance; publication
name/page for a popular article. Test 1 passes. Test 2 also passes
(COAR / CSL / DataCite distinguish each). Per Principle 3, granular types
are the rule-consistent answer.

**Consequences.**
- Type list grows by three (the new medium-specific types replace the
  single `research_communication` bucket).
- Each new type cites with the correct medium-specific CSL type
  (`article-magazine`, `post-weblog`, `broadcast`, `book`).
- COAR export becomes more accurate: `online_publication` exports as
  `blog post` (`c_6947`); the rest still approximate to `≈ other`.
- Migration matrix updates: `blogPost` → `online_publication`;
  `magazinePiece`, `newsArticle`, `newspaperPiece` → `popular_article`.
- The `medium` free-text field is deprecated; each new type carries its own
  structured fields.

**Reopening criteria.** If user testing shows researchers consistently
misclassify across the four new types — picking `popular_article` for
podcasts or `online_publication` for printed magazine pieces, etc. — the
fallback is a single `popular_communication` parent type with required
medium fields. That fallback is documented but not currently planned.

### `online_publication` collapsed into `popular_article`

The four-way popular-bucket split (above) folded the
web-native subset into its own type, `online_publication`. The current
design retires `online_publication` and routes blog posts, online
magazine articles, and other web-native popular pieces to
`popular_article` with an internal `venue_form` discriminator
(`print` / `web`). –1 v1 type.

**Reasoning — Principle 1 (activity, not medium) is decisive.** A magazine
piece and a blog post are the same intellectual activity: a researcher
writing a short prose piece for a general audience about their work. The
only difference is whether the venue prints it or hosts it on a CMS.
Print-vs-web is exactly the substrate distinction Principle 1 says is a
field, not a type. The four-way split had treated the substrate as if it
were the activity, which on closer reading is the same misjudgment
Principle 1 was written to prevent.

**Reasoning — Principle 3 test 1 fails on closer inspection.** The
required fields for the former `popular_article` were `publication_name`
plus optional page reference; for `online_publication` they were `url`
plus `site_name`. These are the same field with different names. A
magazine piece increasingly has a URL too; a blog post has a site name
that functions identically to a publication name. The schema
"difference" was cosmetic. Principle 3 test 1 (substantially different
metadata schema) does not actually pass between these two.

**Reasoning — Principle 4 (durable) reinforces the collapse.** "Online
publication" is a euphemism that papers over the fact that the category
is defined by *not being printed*. Print-first periodicals (The
Conversation, Eos, De Standaard) increasingly publish simultaneously to
print and web; The Conversation is web-first; many magazines are
web-only without identifying as blogs. In ten years the print/web
boundary will be archaeological. A type defined by which side of that
boundary a piece is on will look vestigial.

**Why the print/web distinction is preserved internally.** The
`venue_form` discriminator on `popular_article` keeps the print/web
information as structured data on every record, available to the
mapping layer at export time. CSL renders `article-magazine` when
`print` and `post-weblog` when `web`. COAR exports `≈ other (text)`
when `print` and `✅ blog post` (`c_6947`) when `web`. The 2024
vocabulary review kept Newsclipping, MagazineArticle, and blog as
distinct concepts; any future consumer that cares about the split can
read it from the field without records needing to be reclassified.
The split the earlier design surfaced at type level still exists — it
is now field-shaped.

**Why `broadcast_appearance` does not collapse with it.** A radio
interview, a podcast episode, or a TV appearance is a different
intellectual *activity* from writing an article — oral, frequently
dialogic, usually elicited by a host or interviewer, often unscripted.
Principle 1 separates activities; it does not separate substrates of
the same activity. `broadcast_appearance` keeps its required fields
(channel/platform, programme name, air date) that have no counterpart
in a written piece. Same logic for `popular_book`: a book-length
research-derived work for a general audience has a different
bibliographic shape (ISBN, publisher, edition) and is a different
intellectual undertaking from a magazine piece.

**Why the workshop has not seen this.** The four-way split was
recorded in v0.4 of this document but had not been communicated to
the broader workshop group before this revision. The collapse
therefore happens without political cost — there is no decision to
revisit with anyone outside the document's drafting context. The
collapse should still be mentioned in the next workshop pass so the
group sees the current shape on its first encounter with this
territory.

**Consequences.**
- –1 v1 type.
- Deposit picker shows three popular options: article, broadcast, book.
- `popular_article` carries a required `venue_form` field with values
  `print` and `web`. Field shape — see Open questions for raven for
  the raven-side representation choice.
- CSL and COAR exports become render-time derivations on
  `popular_article`: `article-magazine` / `≈ other (text)` when
  `venue_form = print`, `post-weblog` / `✅ blog post` when
  `venue_form = web`. This is the second entry in the
  derivation-rule budget (Mapping architecture → Export derivation-rule
  budget) — see there for the budget policy.
- Migration matrix update: `miscellaneous_types.blogPost` flips from
  → `online_publication` to → `popular_article` with `venue_form = web`.
  Existing `magazinePiece`, `newsArticle`, `newspaperPiece` continue to
  route to `popular_article` with `venue_form = print`. No records are
  orphaned.
- The `online_publication` type identifier is retired entirely. No
  in-flight records to migrate at this point in the design — the type
  has not shipped.
- The 2024 mapping table's preserved distinction between
  Newsclipping / MagazineArticle / blog is no longer expressed as a
  type split. It survives as a field-driven distinction (`venue_form`),
  recoverable at export time and at filter time.

**Future split is possible without record changes — with a caveat.** When this
decision shipped, the recoverability argument was strong: every record carried
`venue_form`, so reverting to two types would be a deterministic remap
(`popular_article` records with `venue_form = web` → `online_publication`;
`popular_article` records with `venue_form = print` → stay as
`popular_article`). This safety net has since been retired — see
§ "`venue_form` dropped from `popular_article`". For new records, no
structured print/web signal is stored. For legacy records, the migration key
is preserved as import-provenance, which carries the same information for the
backlog. Recoverability for new records would now rely on heuristics
(`page_reference` presence as a strong but not definitional signal for print)
rather than a clean field-driven remap.

**Reopening criteria.**
- If researchers consistently struggle with the popular-vs-scholarly
  boundary at deposit (per the trash-bucket test on the type itself),
  revisit the type definitions. The `venue_form`-specific reopening
  criteria are retired — see § "`venue_form` dropped from `popular_article`".
- If user testing shows researchers misclassify across
  `popular_article` / `broadcast_appearance` / `popular_book` at
  meaningful rates, the fallback is a single `popular_communication`
  parent type with required medium fields. Not currently planned.

### `venue_form` dropped from `popular_article`

The `venue_form` discriminator introduced when `online_publication` was
collapsed into `popular_article` (see § "`online_publication` collapsed
into `popular_article`") has been retired entirely. `popular_article`
no longer carries a `venue_form` field. The print/web distinction is
not surfaced as structured data on new records.

**Reasoning — cognitive load on a required field is not a low cost.** Every
required field at deposit is friction, validation surface, curator-review
surface, and a permanent maintenance commitment. `venue_form` was justified
on the basis that it was "just one toggle", but framing field additions as
low-cost is exactly the small-step-large-debt pattern the hard rules exist
to prevent. The bar for a required field is not "defensible"; it is
"load-bearing for something concrete."

**Reasoning — nothing concrete loaded on it.** `popular_article` is
not VABB-eligible, not FWO-mandatory, not a FRIS top-level category.
The whole popular-bucket trio sits outside the funding-driven reporting
layer by design. The only consumers `venue_form` served were the CSL
and COAR derivation rules (`article-magazine` vs `post-weblog`; `≈ other
(text)` vs `✅ blog post`). No UGent-specific consumer was demanding
either. The 2024 vocabulary review kept the distinction because source
vocabularies do, not because anyone downstream asked for it.

**Reasoning — the signal is already in the data.** When a piece is
printed, it has pages. `page_reference` is populated for print venues
and absent for web-native ones. `url` is populated for web venues and
often absent for print-only ones. The print/web distinction is
derivable from fields that exist for independent reasons (citation
rendering needs pages; web venues need URLs). `venue_form` was
duplicating information that page presence and URL presence already
carry.

**Reasoning — derivation budget headroom.** The export derivation-rule
budget (Mapping architecture → Export derivation-rule budget) was at
2 of an effective ceiling of 2: any third proposed rule would have
triggered the budget alarm. Dropping `venue_form` reclaims a slot.
The next field-driven export distinction (whichever Open Question lands
first: data papers, commentary, policy report) no longer has to fight
the budget on arrival.

**Reasoning — Principle 4 reinforces.** "Online publication" was already
identified as a euphemism for *not printed*, and the print/web boundary
as archaeologically thin in ten years. The same Principle 4 argument
that retired the `online_publication` type also undermines the case
for preserving the distinction at field level. If the boundary is
going to look vestigial, the structured-data carrier for it should
not persist either.

**Where pages do matter for funding** is on the VABB-eligible types,
where page count and page range are independently required for
bibliographic completeness and VABB classification — `journal_article`
(A1/A2: 4+ pages), `book_chapter` (B2 citation completeness),
`conference_paper` (C1 proceedings), `report` (R1 series). On those
types, `page_reference` does real funding work for reasons that have
nothing to do with print/web framing on `popular_article`. The two
are unrelated; dropping `venue_form` does not affect them.

**Consequences.**
- `popular_article` carries no `venue_form` field at deposit. Required
  fields drop from two (`venue_form`, `venue_name`) to one (`venue_name`).
- CSL export emits `article-magazine` for all `popular_article` records.
  Blog posts cite as magazine articles. Acceptable loss — most citation
  styles render the two compatibly.
- COAR export emits `≈ other (text)` for all `popular_article` records.
  The clean `✅ blog post` (`c_6947`) mapping is retired.
- DataCite, OpenAIRE, BibTeX exports unchanged — they did not depend on
  `venue_form`.
- Derivation-rule budget drops from 2 to 1. The budget rule narrows the
  trigger for revisiting type promotion from a third rule to a second.
- Migration matrix: all four legacy keys (`blogPost`, `magazinePiece`,
  `newsArticle`, `newspaperPiece`) collapse to plain `popular_article`,
  with the original legacy key preserved as import-provenance metadata.
  Same pattern as the letter / note / editorial-material family. No
  records are orphaned; the legacy print/web signal survives in
  provenance for the backlog.
- The `online_publication` collapse's recoverability safety net is
  retired for new records — see the updated "Future split is possible"
  paragraph on that decision. Recoverability now relies on
  `page_reference` / `url` heuristics for new records and on
  import-provenance for legacy records.
- The 2024 vocabulary review's preserved distinction between
  Newsclipping / MagazineArticle / blog is no longer expressed as a
  field-driven distinction either. It survives only on legacy records,
  via import-provenance.

**Reopening criteria.**
- A specific downstream consumer at UGent (not a hypothetical external
  schema) starts requiring a structured print/web distinction on
  `popular_article` records that `page_reference` / `url` heuristics
  cannot satisfy.
- UB2030 § 3.1 outreach reporting starts treating print vs. web popular
  pieces as a tracked split for institutional ranking or visibility.
- A new external schema we adopt makes the print/web distinction
  load-bearing for export. (Note: the COAR `blog post` term existing
  is not by itself this trigger — no current consumer is demanding it.)
- If any of these reopen, the field can be reintroduced. Restoring
  `venue_form` retrospectively would rely on import-provenance for
  legacy records and on `page_reference` / `url` heuristics for records
  deposited in the interim. Neither is as clean as a structured field
  was, but both are workable.

### `annotation_collection` collapsed

An earlier draft had `annotation_collection` as a separate top-level
type, citing the W3C Web Annotation Data Model. The current design retires
it. Annotation grouping is handled in two ways instead:

- For an annotation that belongs to a named collection or scheme (when
  `annotation` itself ships): a `collection_indicator` (yes/no) field on
  `annotation`, parallel to `series_indicator` on `book`, with optional
  `collection_name` and `collection_identifier` follow-on fields. The
  `annotation` type is currently ⚠️ TBD — see "To be discussed" — so this
  field-based path is parked alongside the type.
- For a *published* collection of annotations as a deliverable (e.g. a
  TEI-encoded annotated corpus with its own DOI): `dataset` with
  `annotation_scheme` as metadata. This destination is independent of
  whether `annotation` itself ships.

**Reasoning.** A single annotation and a collection of annotations do not
have meaningfully different metadata schemas — the collection is
structurally just multiple annotations linked by membership. The
book-and-series pattern handles this without a type proliferation.
`annotation_collection` was unsourced in the 2024 vocabulary review
(it appears in W3C Web Annotation but not in COAR or CERIF), and the earlier
definition leaned on "both Principle 3 tests pass" without demonstrating
test 1 against an actual schema difference. The collapse fixes that.

**Status note: the `annotation` parent type is now ⚠️ TBD.** This collapse
decision predates the `annotation` demotion. It still holds for the
collection-as-deliverable side (route to `dataset` regardless), but the
`collection_indicator` field-based path for single annotations only applies
if `annotation` itself eventually ships. If the workshop concludes
`annotation` should not ship, this collapse decision becomes moot for the
single-annotation side, and any future re-introduction of
`annotation_collection` would be a fresh question rather than a reversal of
this decision.

**Consequences.**
- One fewer v1 candidate type — `annotation_collection` does not return
  regardless of how the `annotation` TBD resolves.
- W3C Web Annotation `AnnotationCollection` semantics are preserved by the
  field-and-relationship model when `annotation` ships, and by routing to
  `dataset` when the collection is a published deliverable.
- Migration: any legacy records identified as annotation collections (none
  in the current legacy list) would route to `dataset` immediately;
  per-annotation legacy records, if any, are held pending the `annotation`
  TBD resolution.

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
- –1 v1 type.
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

### `public_lecture` collapsed into `conference_presentation`

**Status:** partially superseded. Public-venue lectures no longer ride on
`conference_presentation`; they move to the new `lecture` type with
`lecture_audience = public`. See § "`lecture` split off from
`conference_presentation`" below for the revision. The core reasoning of
this decision (venue-as-discriminator is unreliable; the popular/scholarly
framing belongs in a field rather than a type) is preserved — the
`lecture_audience` field is that field.

An earlier draft had `public_lecture` (popular venue) and
`conference_presentation` (scholarly venue) as two distinct types, with
the venue category as the distinguishing field. The current design folds
`public_lecture` into `conference_presentation` and drops the venue-based
type split.

**Reasoning.** Principle 3 fails for the split. Test 1 (substantially
different metadata schema): the schemas are identical — venue + date for
both. Test 2 (external world treats them as distinct): COAR has a
distinct `lecture` term (`c_8544`), but the current export already
approximated `public_lecture` to `≈ other`, so there is no clean COAR
gain to lose; CSL maps both to `speech`. Funding systems do not
distinguish: VABB does not recognise either as eligible, FWO does not
pull either automatically (both are supplementary, manually reported in
the FWO portal), FRIS routes both to the broad publications category.

The distinguishing field — popular venue vs. scholarly venue — is also
unreliable in practice. The same researcher giving a talk at the
Boekentoren might be addressing heritage librarians (scholarly framing)
or Open Monumentendag visitors (popular framing); same building, same
researcher, different framing. Asking the researcher to make this call
at deposit is friction without a payoff. Deriving from a venue lookup
works for clean cases (university, conference centre, museum) but fails
on the boundary cases that matter (research-meets-festival, public
library research talk, Boekentoren). Curator-routing is also off the
table — see the hard rule on curator workload.

UB2030 §3.1 reporting on outreach activity is field-shaped, not
type-shaped: an audience or context field on `conference_presentation`
captures the public-engagement framing without forcing a type split.

**Consequences.**
- One fewer v1 type (now four medium-specific popular types, not five).
- `conference_presentation` broadens to cover academic and public-venue
  talks — the activity is the same (presenting research orally), the
  venue is metadata.
- COAR export becomes imprecise for public-venue talks: all
  `conference_presentation` records export as COAR `conference
  presentation`, which is technically incorrect for public-venue cases
  (COAR has a distinct `lecture` term, `c_8544`). The imprecision is
  accepted as the cost of the simplification. If COAR-level accuracy
  proves to matter for downstream consumers, the fix is a render-time
  derivation rule based on an audience or context field. That would
  be the third entry in the derivation-rule budget (Mapping
  architecture → Export derivation-rule budget), which is the trigger
  for revisiting type promotion rather than growing the budget.
- Migration: at this stage, legacy `lectureSpeech` records all route to
  `conference_presentation` mechanically. The standalone-academic-lecture
  sub-case was tracked as an open question. Both have since been
  revised — see § "`lecture` split off from `conference_presentation`"
  below — with `lectureSpeech` routing now per-record across
  `conference_presentation` and `lecture` (with audience field) via
  curator review.

**Reopening criteria.** If venue-based distinction proves load-bearing
for UB2030 reporting and a context field cannot carry the weight (e.g.
researchers do not consistently fill it in, or downstream queries treat
the field as unreliable), revisit whether `public_lecture` should
return as a distinct type.

### `lecture` split off from `conference_presentation`

`lecture` is added as a distinct v1 type. `conference_presentation` is
narrowed in scope to oral presentations at scholarly conferences only;
standalone academic lectures and public-venue lectures move to the new
`lecture` type, with a required `lecture_audience` field (`academic` /
`public`) carrying the popular-vs-scholarly distinction. +1 v1 type.

This partially supersedes § "`public_lecture` collapsed into
`conference_presentation`" — public-venue lectures no longer ride on
`conference_presentation`; they move to `lecture` with `audience =
public`. That earlier decision's core argument (venue-as-discriminator
unreliable; popular/scholarly framing belongs in a field rather than a
type) still holds and is preserved — the `lecture_audience` field is
exactly that field.

**Reasoning.** Two problems with the all-in-one `conference_presentation`:

First, the popular-vs-scholarly split that the rest of the design carries
cleanly for written, recorded, and book output (`popular_article` vs
`journal_article`; `popular_book` vs `book`; `broadcast_appearance` as its
own type) was the only medium without a parallel structure for oral
output. Oral output is no longer the exception — the conference / lecture
split lines up with the conference-vs-non-conference shape, and the
audience field on `lecture` carries the popular split where it belongs.

Second, the single-type COAR export emitted `conference presentation` for
public-venue talks too, which is incorrect data flowing into OpenAIRE and
OpenAlex — not just imprecise. Splitting routes academic and public-venue
lectures to COAR `lecture` (`c_8544`) cleanly.

A rename of `conference_presentation` to a non-conference-prefixed kind
was considered and rejected: once the scope is narrowed to conferences
only, the existing name fits, matches COAR's own term, and avoids
retiring a kind. The original naming objection ("scope is not limited
to conferences") was load-bearing for the all-in-one type, not for the
narrowed one.

Principle 3 check:
- `conference_presentation` (narrowed) vs `lecture`: Test 1 passes
  (conference-context fields vs host-institution fields). Test 2 passes
  (COAR distinguishes `conference presentation` from `lecture` `c_8544`).
  Activity differs (conference participation vs invited standalone
  lecture). Split holds.
- `lecture` with `audience = academic` vs `audience = public`: Test 2
  fails (COAR collapses both into `lecture`; CSL collapses into
  `speech`). Field, not a type.

**Consequences.**
- +1 v1 type.
- `conference_presentation` keeps its kind and its COAR mapping; its
  definition narrows to scholarly conferences only. The "scope is not
  limited to conferences" framing is retired.
- COAR export becomes correct for the conference vs. lecture distinction.
  Public-venue lectures export as COAR `lecture` (not a finer
  popular-vs-academic split) — `lecture_audience` stays internal.
- Migration matrix update: `miscellaneous_types.lectureSpeech` moves
  from Mechanical (default `→ conference_presentation`) to Curator-review
  (per-record routing across `conference_presentation`, `lecture` +
  `academic`, or `lecture` + `public`).
- Open question § "Lecture VS `conference_presentation`" is resolved.
- Derivation-rule budget unchanged — `lecture_audience` does not drive
  any export derivation since COAR doesn't distinguish.

**Reopening criteria.**
- If researchers consistently misclassify `conference_presentation` vs
  `lecture` at deposit (e.g. picking `lecture` for an invited keynote at
  a conference), revisit whether the split is too fine.
- If COAR adds a `public lecture` term or DataCite gains a `Presentation`
  resourceTypeGeneral that distinguishes academic from public,
  `lecture_audience` becomes a derivation candidate (would be the third
  entry in the derivation-rule budget — see budget policy).

### `reference_entry` split off from `book_chapter`

Dictionary entries, encyclopedia entries, and lemmata were initially
collapsed into `book_chapter` per Principle 3 test 1 — the schemas are
near-identical (contribution to an edited reference work with ISBN,
parent title, page range, contributor). They are now a distinct v1 type.

**The trigger.** Bibliographic display. When a researcher's bibliography
shows their reference entries side-by-side with their actual book
chapters, the conflation reads wrong. CSL has dedicated terms (`entry`,
`entry-dictionary`, `entry-encyclopedia`); CSL `chapter` does not. This
is the user-visible cost flagged by the earlier CSL rendering open
question, and it is load-bearing enough on its own to drive promotion.

**Principle 3 nuance.** Test 1 still fails (schemas are near-identical).
Test 2 partially passes — CSL, OpenAlex, and CrossRef distinguish;
DataCite and COAR collapse. Promotion is driven by user-visible output
difference, not schema divergence. This expands the read of Principle 3:
where external-world distinction creates a user-visible output
difference that an internal collapse cannot reproduce cleanly,
promotion is warranted even when schemas are identical.

The alternative — adding a CSL derivation rule on `book_chapter` based
on a context or entry-term field — would have grown the derivation-rule
budget (Mapping architecture → Export derivation-rule budget). The
doc's budget policy treats each added rule as escalating scrutiny on
the next, and at the time of this promotion the rule count was one
(preprint only). We honoured the policy: we promoted instead of
deriving. The count has since grown to two (the `popular_article`
venue-form derivation), and the policy continues to hold for any
third proposal.

**Consequences.**
- +1 v1 type.
- Migration matrix: `miscellaneous_types.dictionaryEntry`,
  `miscellaneous_types.encyclopediaEntry`, and `miscellaneous_types.lemma`
  flip from → `book_chapter` to → `reference_entry`.
- CSL export: `reference_entry` → `entry` (the safe generic). Finer
  distinction (`entry-dictionary` vs `entry-encyclopedia`) can be
  carried by a future field if it proves load-bearing — not added in v1.
- COAR / DataCite / OpenAIRE: still collapse to `book part` /
  `BookChapter` / `part of book`. Reference entries are visible as a
  distinct kind internally but indistinguishable to these consumers
  externally. Acceptable — the consumers that matter for the
  citation-correctness use case (CSL, OpenAlex, CrossRef) do
  distinguish.
- VABB / FRIS / FWO / BOF: unchanged. Publisher-list-driven,
  curator-validated; B2 eligibility identical to `book_chapter`.
- Deposit picker: one more type.
- OpenAlex `reference-entry` now maps directly to `reference_entry`
  rather than collapsing-with-provenance — see § "OpenAlex as an
  indirect downstream" updated mapping.

**Parallel implications.** This strengthens the case for `data_paper`
and `software_paper` (currently in Tentative resolutions → collapse to
`journal_article`). Same shape: schema near-identical, external world
partially distinguishes, user-visible difference. Worth revisiting
those at the next workshop pass on the same reasoning — though VABB and
counting consequences make those harder than `reference_entry` was.

**Reopening criteria.** If researchers consistently misclassify
`reference_entry` vs `book_chapter` at deposit (per the trash-bucket
test), or if downstream consumers prove not to care about the CSL
distinction, collapse back.

### OpenAlex as an indirect downstream, not a direct export target

OpenAlex is an aggregator, not a registrar. UGent does not push records
to it directly — OpenAlex picks Biblio data up indirectly via CrossRef
DOIs, DataCite DOIs, and OpenAIRE/COAR feeds. There is no Biblio →
OpenAlex export pipeline to define: if the CrossRef, DataCite, and COAR
exports are correct, OpenAlex will be correct.

The earlier framing of this question ("OpenAlex missing from import and
export tables") was overstated on the export side.

**Direction.** Import only. OpenAlex is recorded as a future harvest
source in the Import sources table; the column documents how Biblio
would interpret OpenAlex work-types when ingesting for candidate matching
or APC reconciliation. It is not currently wired up — see the
import-table preface for current vs. aspirational source status.

**Mapping rules — direct.** Where OpenAlex types match Biblio kinds
without ambiguity, the mapping is mechanical:
- `article` → `journal_article`
- `book` → `book`
- `book-chapter` → `book_chapter`
- `dataset` → `dataset`
- `dissertation` → `dissertation`
- `report` → `report`
- `review` → `review_article` — OpenAlex's `review` is the
  literature-synthesis sense, matching Biblio's `review_article`, not the
  single-work `review` type.
- `reference-entry` → `reference_entry` — direct match since the
  `reference_entry` v1 type was promoted from `book_chapter`. See
  Resolved decisions § "`reference_entry` split off from `book_chapter`".

**Mapping rules — collapsed with import-provenance preservation.** Where
OpenAlex distinguishes a type that Biblio collapses, the original OpenAlex
type value is preserved as import-provenance metadata only, following the
letter / note pattern (see § "`journal-letter` and `journal-note` dropped"):
- `letter` → `journal_article`.
- `preprint` → `journal_article` with `publication_version = submitted version`
  (per the preprint state design in Fields to be defined).
- `editorial` → `journal_article` (same pattern as
  `miscellaneous_types.editorialMaterial`).
- `erratum` → `journal_article` (same pattern as `miscellaneous_types.correction`).
- `standard` → `report` (same pattern as `miscellaneous_types.technicalStandard`).

**Mapping rules — not adopted as Biblio records.**
- `paratext` — structural / container (front matter, indexes,
  bibliographies-as-section), not a research output.
- `grant` — out of scope per "Out of scope" (funder portals and GISMO
  handle grants).
- `supplementary-materials` — attachment on parent, not a record, per
  "What is not a type."
- `peer-review` — not a type per "What is not a type."

**Implicit broadening of source-system type preservation.** Adopting this
resolution implicitly broadens the open question on source-system type
preservation scope to cover OpenAlex's `letter`, `preprint`, `editorial`,
`erratum`, and `standard` values. The broader
principle — whether every imported source-system type that doesn't map
one-to-one to a Biblio kind is preserved as audit metadata — remains an
open question.

**Reopening criteria.**
- If OpenAlex-driven reporting at UGent starts treating preprints or
  letters as distinct categories for ranking, visibility, or APC
  tracking, that is grounds to revisit the relevant resolved decisions.

### CrossRef and WoS as indirect downstreams; openjournals.ugent.be mints CrossRef DOIs

Biblio does not mint CrossRef DOIs. UGent's diamond OA journals are
hosted on openjournals.ugent.be, which is the canonical CrossRef minting
authority for those journals — see https://openjournals.ugent.be/site/about/.
For commercial-publisher journals, the publisher mints. CrossRef DOIs on
UGent records are *captured* by Biblio in the identifier field, never
*minted* by Biblio.

WoS is an indexing service, not a registrar. UGent does not push records
to WoS directly; WoS picks Biblio data up transitively via CrossRef and
OAI-PMH/COAR feeds — same indirect-aggregator pattern as OpenAlex (see
§ "OpenAlex as an indirect downstream, not a direct export target").

**Consequences.**
- No CrossRef export column in the Export targets table. CrossRef DOIs
  are upstream metadata (captured at import or at point-of-publication
  by the publisher); they are not a Biblio output.
- No WoS export column in the Export targets table. WoS-shaped reporting,
  if it becomes load-bearing internally, is a reporting concern handled
  downstream — not a Biblio export pipeline.
- Both CrossRef and WoS remain in the Import sources table as harvest
  channels (and CrossRef DOIs as identifier captures).
- The earlier loose phrasing about CrossRef and preprints (corrected in
  Fields to be defined → Publication version → Export consequence) is
  consistent with this: Biblio never had a CrossRef minting story.

**Open follow-up: DataCite minting authority.** Who mints DataCite DOIs
at UGent for each Biblio `kind` is a separate question not addressed by
this resolution. Candidates include Biblio itself (for datasets via the
legacy minting flow, dissertations, software), FAIRVault (datasets per
UB2030 §3.2.1), and per-service decisions. The Export targets table's
DataCite mappings remain valid as resource-type mappings regardless of
who mints. Flagged as an open question — see Open questions § "DataCite
minting authority at UGent".

### EOSC Observatory and EU monitoring are not a separate Biblio layer

EOSC Observatory and EU-level research monitoring frameworks track
publications, datasets, software, and various newer output forms
(workflows, training materials, data management plans, etc.) as
distinct reporting categories. The explicit design choice is not to
mirror that category layer in Biblio.

**The principle.** External reporting frameworks do not drive new
Biblio types. Whatever EOSC or EU monitoring frameworks track is
absorbed by existing Biblio kinds, even when the reporting framework
frames the category as "newer." Over time, what looks novel from a
reporting perspective becomes just another deposit from Biblio's
perspective.

This sits alongside the existing hard rule on types vs. classifications
(VABB A1/A2/B1/B2/C1 is curator-owned, not a type) and Principle 5
(Recognisable — types are understood independent of any single
reporting framework). Reporting-layer distinctions live in the mapping
layer or in curator-owned fields, not in the type system.

**Existing alignment.** Biblio's separation of `dataset`, `software`,
and the publication family already maps cleanly to EOSC's top-level
categories — see the FRIS / FWO column in the Export targets table for
how each kind reports as `publication` or `dataset`. FAIRVault
(UB2030 §3.2.1) is the strategic anchor for the dataset side of this
alignment.

**Direction.** Neither import nor export. EOSC reads via OAI-PMH/OpenAIRE
feeds — same indirect-aggregator pattern as OpenAlex and WoS. No EOSC
column in either mapping table.

**Reopening criteria.**
- A specific EOSC-tracked output category at UGent reaches volume that
  makes it hard to find via existing kinds (the "trash-bucket test"
  fails for some new category, per Principle 6).
- EU mandates a Biblio-pushable reporting feed in a format that the
  current OAI-PMH/COAR export cannot satisfy.
- A "newer" reporting category genuinely fails Principle 3 collapse
  testing — researchers actively misclassify it because its schema is
  shaped differently from existing types. This is the same trigger
  that would force `workflow` (currently TBD) to be promoted from
  `software`.

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

**Curator-review volume is the calibration constraint.** The curator team
is too small to review hundreds of thousands of legacy records one by one
— that is the "Curators are not a migration mechanism" hard rule. The
migration design accepts this honestly:

- Mechanical rows are the primary path. Everything that can be migrated
  by script is, even where the script makes a defensible default that a
  human might have refined.
- Curator-review rows are the irreducible residual — cases where no
  script default is defensible because the legacy type alone genuinely
  doesn't encode enough to choose. The rule is that this set must stay
  small enough for the curator team to work through in a bounded
  timeframe, alongside their normal queue.
- The dry-run is the calibration step. Until the migration script
  produces real numbers (how many records hit each curator-review row
  for the live UGent corpus), the "small enough" claim is provisional.
  If the dry-run shows a curator-review row swallowing thousands of
  records, the row itself has to be re-examined — not by adding
  curator capacity, but by finding a more aggressive mechanical
  default and accepting the precision loss it implies.
- Concessions are explicit. Some mechanical rows pick a defensible
  default that will be wrong for a minority of records (e.g.
  `conference_types.other → conference_presentation`, marked
  "lossy by definition"). These are noted in the row's Notes column
  rather than escalated to curator review. The trade-off is
  documented; the precision cost is accepted as the price of
  finishing the migration.

⚠️ This matrix needs validation by the curator / reviewer team before any migration
script is run. The mechanical rows are reasonably confident; the
curator-review rows are uncertain by design and need the dry-run to size.

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
| `miscellaneous_types.editorialMaterial` | `journal_article` | Same logic as letter / note — published in a journal, schema identical to `journal_article`. WoS "Editorial Material" is a wastebasket category covering strict editorials, invited perspectives, journal-news items, book-review prefaces, in-memoriam pieces, and biographical sketches; all collapse here, with the original source-system tag preserved as import-provenance metadata. See Resolved decisions § "Editorial material collapses into `journal_article`". |
| `miscellaneous_types.dictionaryEntry` | `reference_entry` | Reference entries split off from `book_chapter` for clean bibliographic display — see Resolved decisions § "`reference_entry` split off from `book_chapter`". |
| `miscellaneous_types.encyclopediaEntry` | `reference_entry` | Same logic. |
| `miscellaneous_types.lemma` | `reference_entry` | Same logic. |
| `miscellaneous_types.blogPost` | `popular_article` | Site/blog name captured in `venue_name`; URL captured. The legacy key `blogPost` is preserved as import-provenance metadata for backward lookup of the print/web origin. See Resolved decisions § "`venue_form` dropped from `popular_article`". |
| `miscellaneous_types.magazinePiece` | `popular_article` | Magazine name captured in `venue_name`. Legacy key preserved as import-provenance. |
| `miscellaneous_types.newsArticle` | `popular_article` | Publication name captured in `venue_name`. Legacy key preserved as import-provenance. |
| `miscellaneous_types.newspaperPiece` | `popular_article` | Newspaper name captured in `venue_name`. Legacy key preserved as import-provenance. |

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
type — the 2024 vocabulary review treated these as a coherent family,
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
| `miscellaneous_types.musicEdition` | `book` (published score), or eventually `musical_notation` / `critical_edition` if those TBD types land | If the TBD types land, re-classify; otherwise default to `book` when ISBN is present. |
| `miscellaneous_types.textEdition` | `book` (published edition), or eventually `critical_edition` (TBD) | Same logic. |
| `miscellaneous_types.textTranslation` | `book` (standalone published translation) or `journal_article` (translation embedded in an article) | Form. Note: translation is the work, not a separate type. |
| `miscellaneous_types.lectureSpeech` | `conference_presentation` (talk at a scholarly conference), `lecture` with `lecture_audience = academic` (invited institutional lecture, named lecture, masterclass), or `lecture` with `lecture_audience = public` (museum, festival, community lecture) | Whether the legacy record is a conference-floor talk, an invited academic lecture, or a public-venue lecture. The legacy type alone does not encode the conference / non-conference and academic / public distinctions. If dry-run volume exceeds curator capacity, the fallback is mechanical `→ lecture` with `lecture_audience = public` as the conservative default (most legacy `lectureSpeech` records are public-venue based on UB content review — confirm in dry-run). See Resolved decisions § "`lecture` split off from `conference_presentation`". |
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

## Rollout, testing, and timeline

These items are TBD. They are deferred to a separate planning pass once
the type list and mapping table are validated with the lead developer.
They are flagged here because a reviewer will reasonably ask, and the
honest answer is: not yet decided.

**Phasing / timeline — ⚠️ TBD.** Type-list freeze, mapping-table
validation, raven implementation, migration dry-run, curator review of
the dry-run output, and production cutover are sequenced steps with
dependencies; the sequence and dates are not set. The Migration matrix
dry-run is the calibration gate before any production migration is
scheduled (see Migration matrix § "Curator-review volume is the
calibration constraint").

**Testing strategy — ⚠️ TBD.** The Mapping architecture section is
flagged unvalidated against live schemas. Test strategy needs to cover
at least: (1) round-trip of every legacy `kind` through the migration
script against a representative sample of the live UGent corpus; (2)
export correctness for COAR, DataCite, CSL, BibTeX, and the FRIS/GISMO
feed across every v1 type and every derivation rule in the budget; (3)
the import side for each named source where mapping rows are
aspirational (WoS, CrossRef, PubMed, OpenAIRE, OpenAlex, BibTeX). Owner
and tooling TBD with raven.

**System-level backward-compatibility — ⚠️ TBD.** Record-level
backward-compatibility is covered by the Migration matrix and the
import-provenance pattern. The impact on consumers of Biblio's current
`kind` field is not. A consumer inventory is needed at minimum,
covering: biblio.ugent.be's own search facets and saved-search URLs;
the public API and any clients depending on legacy `kind` values;
internal curator dashboards and UGent-internal reporting; OAI-PMH
harvesters (OpenAIRE primarily) that will see records appear or
disappear from filtered queries when COAR export labels shift (e.g.
letter / note / editorial collapsing to `research article`); URL
permalinks if any embed the kind; embargoed or locked records the
migration script should not touch; and the rollback path if migration
produces wrong results in production. To scope with raven and the
biblio.ugent.be operators.

**Rollout plan — ⚠️ TBD.** Options include: feature-flag the new type
picker behind a deposit-flow toggle; ship the new types in parallel
with the legacy picker for a transition window; or hard-cutover at a
documented date. The choice depends on dry-run volume, on whether
new-type and legacy-type records can coexist in production, and on
what curators need to triage in-flight deposits during the transition.
To decide with raven.

---

## To be discussed

These types from other systems were considered and not rejected, but require further
investigation before a decision can be made. They are explicitly out of scope for v1.

A number of earlier candidates have moved out of this section: `peer_review`,
`image`, `video`, `website` are now in "What is not a type" (attachments /
media); `data_management_plan`, `project_deliverable`, `project_milestone`,
`proposal`, sub-doctoral `thesis` are in "Out of scope (handled by
other systems)"; `lecture` shipped as a v1 type — see Resolved decisions
§ "`lecture` split off from `conference_presentation`"; `commentary`
remains an open question on `journal_article`. `policy_report` and
`annotation` are recent demotions — they were v1 candidates in earlier
revisions and have been moved here pending workshop confirmation of
volume of use (`policy_report`) and of taxonomy placement (`annotation`).
`patent` is a recent promotion in the opposite direction — it was in
"Out of scope" but has been moved here because researchers sometimes add
patents to Biblio in practice, and we may want to allow it formally.
Seven standalone TBDs remain.

**`policy_report`** (Evidence-based document for decision-makers)
An evidence-based document addressed to decision-makers — government bodies,
regulators, or public institutions — with the explicit purpose of informing
a decision or policy. Examples: policy brief; advisory report; government
commission report; regulatory submission.

**Why this is TBD.** The reviewer raised the volume-of-use question: it is
not clear whether enough UGent records would carry this type to justify the
deposit-picker cost and curator training overhead. The structural case for
the split is also weak by Principle 3 (test 1 fails — same schema as `report`
bar a target-audience field; test 2 partially passes — only COAR distinguishes
cleanly). See Open questions § "Policy report and report as separate types
vs. combined" for the full pro / con analysis and the three resolutions on
the table.

**Current v1 behaviour while TBD.** Policy-facing reports route to `report`,
with the policy framing optionally captured via the context field. COAR
export emits `report` for these (not `policy report`). VABB and FWO are
unaffected either way — neither recognises policy reports as eligible.

**Reopening criteria.** Workshop confirmation of meaningful UGent volume in
policy-facing output (the trigger for this demotion). Quantitative input
welcome from anyone tracking UGent's societal-impact reporting under UB2030
§ 3.1. If volume confirms, Resolution 2 in the Open question (merge into
`report` with a structured audience field) is the recommended landing.

**`annotation`** (Single citable annotation on an existing resource)
A single, citable annotation applied to a specific existing resource —
text, image, dataset, or other primary source. Examples: a TEI annotation
on a manuscript line; a scholarly note attached to a corpus sentence.

**Why this is TBD.** Reviewer feedback flagged that the taxonomy placement
of annotations is unclear: it was not clear where a single annotation
belongs vs. an annotated corpus (which collapses to `dataset` per the
`annotation_collection` resolved decision), vs. inline commentary in a book
chapter or journal article. The collection-vs.-single split, currently
handled by the proposed `collection_indicator` field, did not resolve the
ambiguity for the reviewer — which is itself diagnostic.

**Sub-questions to settle before deciding.**
- Is a single annotation a citable Biblio research output at UGent volume,
  or is the intellectual contribution always carried by the parent dataset
  or work, with annotations as attached files?
- If `annotation` ships, does the `collection_indicator` field-based
  pattern correctly route the collection-as-deliverable boundary with
  `dataset`, or does the boundary need to be re-drawn?
- Are TEI / Web Annotation / CATMA the right vocabulary starting points
  for `annotation_scheme`, or does UGent humanities practice surface a
  different set?
- Where do reviewer-style scholarly notes that are not single-target
  annotations (e.g. running commentary on a manuscript that comments on
  many lines) route? If the answer is "as a `book_chapter` or
  `journal_article` with `annotation` linked via `related_identifier`,"
  the boundary needs explicit documentation.

**Current v1 behaviour while TBD.** No `annotation` deposit type ships. The
annotation-collection collapse to `dataset` (Resolved decisions §
"`annotation_collection` collapsed") stands regardless — a TEI-encoded
annotated corpus with its own DOI is a `dataset` whether or not `annotation`
itself ships. Single annotations have no v1 destination type pending
workshop resolution.

**Reopening criteria.** Workshop input from letteren-bibliothecarissen and
the Ghent Centre for Digital Humanities on volume and on the taxonomy
placement. Annotation as a citable artefact is primarily a digital-humanities
concern; their judgement on whether this is a deposit type or an attachment
on a parent record is load-bearing.

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

**`patent`** (Granted or applied-for patent on research-derived IP)
A patent application or granted patent covering a research-derived
invention — a process, composition, device, or method arising from
research activity at UGent.

**Status today.** Patents are formally out of scope for v1 — the UGent
Tech Transfer Office (TTO) is the canonical system of record for IP and
remains so. But the empirical picture is messier: researchers sometimes
add patents to Biblio anyway, presumably to keep their personal output
list complete and visible. The current behaviour is informal and
uncontrolled — there is no `patent` type, so these records land in
whatever type the researcher picks (usually `journal_article` or
`miscellaneous`-ish legacy slots), which corrupts type-based reporting.

**Why this might ship.**
- *Researcher behaviour already happens.* Researchers act as if patents
  belong in their personal Biblio output list. Refusing the type doesn't
  stop the deposit; it just routes it to a wrong type. A `patent` type
  with TTO-derived metadata is cleaner than the status quo.
- *External world treats patents as distinct.* COAR has `patent`
  (`c_15cd`). DataCite has `Patent` as a `resourceTypeGeneral` (since 4.4).
  CSL 1.0.2 has `patent`. FRIS distinguishes patents as a top-level
  reporting category. Both Principle 3 tests pass cleanly — schema is
  meaningfully different (patent number, jurisdiction, application/grant
  dates, assignee, status) and the external world treats patents as a
  distinct category.
- *UB2030 §3.1 societal-impact reporting.* Patents are a visible signal
  of research-derived innovation. Surfacing them as a Biblio type makes
  them queryable alongside other research outputs.

**Why this might stay out of scope.**
- *TTO already handles it.* Duplicating a canonical system of record is
  exactly the pattern "Out of scope" exists to prevent (compare DMPs in
  DMPonline, project deliverables in GISMO). The data flow question —
  can TTO feed Biblio? — is separate from whether Biblio needs a
  deposit type for it.
- *IP-sensitive metadata.* Patent records carry sensitive fields
  (assignment, jurisdiction, application status before grant) that have
  different access-rule needs than scholarly publications. The default
  open-access framing of Biblio doesn't fit cleanly.
- *Curator workload.* Patent classification (granted vs. pending,
  jurisdiction handling, assignee resolution) is its own discipline.
  Adding it to the curator queue without a TTO feed making the metadata
  authoritative is exactly the kind of curator-as-completer pattern the
  hard rules forbid.

**Sub-questions to settle before deciding.**
- *Volume.* How many patents do UGent researchers add to Biblio per year
  today (under whatever wrong type they land in)? Below approximately
  20–30 per year, the deposit-picker cost is not justified — even if
  the type would be "correct", the picker confusion for the other 99%
  of depositors is the worse trade.
- *Source of truth.* If `patent` ships, is TTO the upstream and Biblio
  the read-only mirror (preferred, matches UB2030 §3.2.1 sovereignty
  framing), or is Biblio a separate deposit channel? If the latter,
  reconciling Biblio records with TTO records becomes its own problem.
- *FRIS routing.* If `patent` ships, does FRIS reporting come via Biblio
  or stay via TTO? Both routing simultaneously is incorrect (double-count).
  This is a coordination question with TTO and the FRIS team.
- *Access rules.* What is the default access for a `patent` Biblio
  record? Public on grant, restricted before? Always metadata-only? This
  needs an explicit decision before the type ships.
- *Deposit boundary.* What counts as a patent for Biblio purposes —
  granted patents only, or also applications? Provisional applications?
  Continuations and divisionals? This is a TTO-domain question.

**Current v1 behaviour while TBD.** No `patent` deposit type ships.
Patents that researchers nonetheless add to Biblio continue to land in
whatever type they choose, which is wrong and corrupts type-based
reporting. The migration matrix does not currently single these out.
If the workshop concludes `patent` should ship, a follow-up pass on the
migration matrix will need to recover historically-misclassified
patent records by other signals (title containing "patent", presence of
a patent number in identifiers, etc.).

**Reopening criteria.**
- Conversation with TTO about whether a Biblio-TTO data flow makes sense
  (and which direction).
- Quantitative input on UGent patent volume per year and on how often
  researchers currently add patents to Biblio under wrong types.
- Workshop confirmation that the type would be used enough to justify
  the deposit-picker cost.

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

A prior vocabulary-standardisation pass in 2024 (`docs/os-standardization_terminology/`)
produced a three-way alignment table linking FaBiO ↔ CERIF ↔ COAR
concept-by-concept, alongside the source vocabularies themselves (COAR
Resource Types, EuroCRIS CERIF Output Types, FaBiO, OpenAIRE Guidelines,
Crossref schema). The 2024 table is *less opinionated* than this design —
it preserves every distinction the source vocabularies make. The places
where the current design collapses, retires, or extends are deviations
from that synthesis, not just from raw COAR / CERIF.

The table below records the divergences. Resolved decisions and Open
questions carry the full reasoning where it matters; the entries here
are the index.

| 2024 distinction | Current treatment | Why |
|---|---|---|
| `letter` / `Letter to Editor` (CERIF `LettertoEditor` + COAR `c_545b`; CERIF `Letter` + COAR `c_0857`) | Both fold into `journal_article`. Source-system type preserved as import-provenance. | Principle 4 (durable); print-era format in decline. See Resolved decisions § "`journal-letter` and `journal-note` dropped". Reopen if curators query letters as standard weekly work. |
| `preprint` (COAR `c_816b`) | State of `journal_article` (`publication_version = submitted version`), not a type. COAR export derives `preprint` at render time. | Principle: types are not states. See Fields to be defined → Publication version. |
| `data paper` / `software paper` (COAR `c_beb9` / `c_7bab`) | Both route to `journal_article`; relationship to described dataset/software via `related_identifier`. | ⚠️ Tentative — contested by activity-not-format argument. See Open questions → Tentative resolutions → Data papers and software papers. |
| Multi-level theses (COAR bachelor `c_7a1f`, master `c_bdcc`, doctoral `c_db06`, parent `c_46ec`) | `dissertation` covers doctoral + master. Sub-doctoral theses out of scope (separate institutional software). | Structural simplification. See Out of scope § Sub-doctoral theses. |
| Report family (COAR has six distinct types: `c_93fc`, `c_18ww`, `c_18ws`, `c_18hj`, `c_18gh`, `c_18wq`) | Single `report` type with a context field. | Principle 3 test 1 fails for the splits — schemas are near-identical. |
| `peer_review` (COAR `H9BQ-739P`, DataCite `PeerReview`, CrossRef `peer-review`) | Not a type — attachment to the reviewed work. | See "What is not a type". |
| `workflow` (COAR `c_393c`, FaBiO Workflow) | Candidate v1+ type. | ⚠️ TBD. See "To be discussed". |
| `lecture` (COAR `c_8544`) | v1 type. Distinct from `conference_presentation`; carries `lecture_audience` field for the academic-vs-public distinction (COAR collapses both into `lecture`, so the field stays internal). | See Resolved decisions § "`lecture` split off from `conference_presentation`". |
| `commentary` (COAR `D97F-VB57`) | Open question on `journal_article`. | See Open questions → Commentary as a sub-question on `journal_article`. |
| `image`, `video`, `website` (COAR `c_c513`, `c_12ce`, `c_7ad9`) | Not types — media or attachments. | See "What is not a type". |
| `patent` (COAR `c_15cd`) | Candidate v1+ type. Researchers sometimes add patents to Biblio in practice. | ⚠️ TBD. See "To be discussed". |
| Containers (Magazine, Newspaper, Periodical, Journal, Journal Issue, Encyclopedia) | Rejected as types — containers of works, not works. | Principle 3 conflation. |
| Subtype-style CERIF concepts (`JournalArticleAbstract`, `JournalArticleReview`, `BookChapterAbstract`, `BookChapterReview`, `ConferenceProceedingsArticle`) | Rejected — these are the subtype-fields-as-types pattern this redesign exists to remove. | Hard rule: no subtypes. |
| `policy_report` | Candidate top-level type. Not in the 2024 table as distinct from `report`. | ⚠️ TBD. See "To be discussed". |
| Granular `Newsclipping`, `MagazineArticle`, `Radio/TVProgram` | Surfaced as three medium-specific top-level types (`popular_article`, `broadcast_appearance`, `popular_book`). Print/web variation inside `popular_article` is not structured — carried only as import-provenance on legacy records. | See Resolved decisions → `research_communication` split / `online_publication` collapsed / `venue_form` dropped. |
| `annotation_collection` (W3C Web Annotation; absent from COAR/CERIF) | Retired. Annotation grouping handled by `collection_indicator` field; published collections route to `dataset`. | See Resolved decisions § "`annotation_collection` collapsed". |
| `research_communication` (Biblio v0.3 single bucket; absent from external vocabularies) | Retired. Replaced by three medium-specific types. | See Resolved decisions § "`research_communication` split into four medium-specific types". |

### Curator uncertainty in the 2024 table that this design resolves

The 2024 table contained comment-column flags where the reviewer was
uncertain. This design takes positions on each:

- *"same as book part?"* (Chapter in Book vs Inbook vs book part) — all
  collapse to `book_chapter`. Aligned with CrossRef and DataCite.
- *"article vs paper"* (ConferenceProceedingsArticle vs conference paper)
  — both `conference_paper`. Pure naming difference.
- *"PhD thesis also exists in cerif, not clear if there is a difference"*
  — `dissertation` covers both. CERIF redundancy eliminated.
- *"not sure whether mapping between cerif and coar is ok"*
  (MagazineArticle vs periodical) — magazine pieces → `popular_article`;
  periodical is a container, not a work. Print origin is preserved on
  legacy records via import-provenance, not as a structured field.
- *"not sure whether mapping between cerif and coar is ok"*
  (ResearchReportForExternalBody vs report to funding agency) — both
  → `report`; the funder relationship is captured by `funding_reference`,
  not by type.

### Field-shape findings that belong in a separate document

The 2024 review also gathered metadata-element schemas (Crossref,
OpenAIRE Guidelines for publications and datasets). These surface
field-level requirements that are out of scope for type design but need
to be answered before deposit forms can be specified. Flagged here for
the per-type fields workshop:

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
- `docs/os-standardization_terminology/` — Source vocabularies and the 2024 three-way mapping table; informs the Findings section above.
- **Per-type fields document** (TBD filename, separate workshop) — Will define
  the per-type metadata field requirements (deposit-required, MA, recommended,
  optional), controlled vocabularies (COAR Access Rights, COAR Version, etc.),
  field shapes, and per-type form behaviour. The items flagged in the Findings
  section above and in "Fields to be defined" deferred specifications go to
  this document, not to WORK-TYPES.md.
