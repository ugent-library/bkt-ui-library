# Work types – Criteria

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

Important! We will never throw out work or metadata.
This will describe the future.
This comes with tradeoffs:

- It is possible that we will no longer be able to be as granular as we were before,
  due to a complex list we already had.
  e.g. Theatre & music review will become "Review"
- It is possible we are introducing new types that do not map on old types
  e.g. If we introduce "Software" some "Datasets" might be outdated,
  since they contain Software.

## Hard rules

These are non-negotiable constraints. They apply to every decision about the type system.
Decided during the workshop.

**All research output types are equal**
e.g. Report in misc
e.g. Datasets in aparte tyle

**No subtypes.** The type list is flat. There is no mandatory second step.
Distinctions that matter for mapping or reporting are shown as first-class type
choices — not hidden in secondary metadata fields. What we show to a researcher can
differ from what we export to external systems. The mapping layer handles translation.

**Types are not classifications.** A classification (A1, A2, B1, B2, C1) is a
curator-owned field applied after deposit. It is not a type. A type describes what
the output is. A classification describes how an external system values it.
Do not conflate them.

**Biblio is a primary source.** Type decisions have long-term consequences. External
systems (OpenAlex, WoS, FRIS, DataCite) index from Biblio. Getting type wrong means
wrong data in every downstream system, permanently, until someone corrects it record
by record. This also means deriving data from unstructured fields to create structured
data is not durable. We can not invent reliable information.
** Responsibility towards other sources

**Academically scoped**
*Part of the research life cycle*
Every type must represent output that reports, applies,
communicates, or documents research activity that the depositing researcher was
personally involved in. If the connection to a specific research activity cannot be
stated in one sentence, it does not belong in Biblio.

This excludes purely institutional output (a university annual report, a press
release written by communications staff) and purely personal output (a novel written
for pleasure, a private blog unrelated to research). The link to research activity
is what separates those from output that belongs here.

---

## Design principles

Decided during the workshop.

These constraints help us decide, but are inherently negotiable as they sometimes
suggest opposing things.

### 1. Describes an activity, not a medium

The type captures what the researcher produced intellectually. A recorded lecture, a
written transcript of that lecture, and a slide deck of that lecture are three media
for the same activity. Medium is a metadata field, not a type distinction.
e.g. A video on YouTube is a medium, a media appearance on the VRT pocdast is an activity,
which can result into a YouTube video.

A podcast is not a new type. It is `broadcast_appearance` (radio,
television, or podcast); the type's structured fields — channel or platform,
programme name, air date — capture what's specific to the medium. Whatever
comes after podcasts in the broadcast space will fit the same shape. The
type list does not track trends.

### 2. Recognisable in the academic community

General enough that researchers can self-classify without hesitation.
Understood without a tooltip by any researcher at any university, in any discipline,
in any country.

1. TBD
   The metadata schema is substantially different — the fields required to describe
   it are meaningfully different in structure, not just in content.
   **A type must create added value to the academic community.**
   (the public... TBD)

The external world treats them as distinct.


### 3. Compatible with standards

Compatible enough that external mapping does not require taking meanlingless detours.
e.g. Example of when we keep one: Letters might not be recognised by an external partner,
but we preserve the past, so we map it to articles.

The external world treats them as distinct — different identifier systems,
different reporting obligations, or different access models.

**A type must create added value to both the institution and its partners.**

A distinction becomes a type when a researcher can answer "which one am I?" without
ambiguity and without needing to read a tooltip. "Did you write a review article or
an original article?" — a researcher knows immediately. That is the practical test.

Prefer alignment with COAR, CrossRef, DataCite, and OpenAIRE
vocabularies. Deviations require explicit justification.

The external world treats them as distinct.  — different identifier systems,
different reporting obligations, or different access models.

TBDDDDD

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

Specific enough that meaningful distinctions are preserved.

The type list must not need to be reopened every time a new format or practice
emerges in academia. Types are stable containers. Controlled vocabularies inside
them — medium, context — absorb novelty.
