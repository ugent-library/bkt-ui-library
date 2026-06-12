# REPORTING-COMPLIANCE.md [DRAFT]
# External reporting authorities — field requirements per work type

Version 0.1 — draft

This document records **which metadata fields each external reporting/funding
authority requires, for which work type, in which format**. It exists because
funding allocation depends on it: a record that is valid in Biblio but missing a
field an authority needs is silently uncounted, which costs UGent money.

Two sources are verified primary schemas and are quoted directly below:

- **FRIS Vademecum v4.0** (timestamp 46003 / FRISTO 31-03-25). The authoritative
  business-rule layer for what UGent pushes to the Flemish Research Information
  Space. Entity-and-attribute model based on CERIF.
- **VABB-SHW Begeleidende nota v15** (June 2025, ECOOM-Antwerpen / Gezaghebbend
  Panel). The authoritative inclusion-logic layer for the SSH bibliometric
  parameter of the BOF key.

Everything attributed to those two documents is verified against the file. Every
other claim is marked **[needs verification]** with the source to check. Do not
promote a marked claim to fact without obtaining the named source.

For the **internal** field-to-work-type mapping (Biblio's own deposit forms),
see `WORK-TYPE-FIELDS.md`. This document is the complementary *external* view:
what the consumers downstream of Biblio demand. The two should be read together.

For strategic framing (sovereign infrastructure, Biblio as a system node that
pushes to reporting systems), see `STRATEGY.md` §3.

---

## How the authorities relate

The mistake to avoid is treating five authorities as five independent pipelines.
They are not. There are **two technical targets** and three downstream consumers
that read from them.

**Technical targets (Biblio pushes data here):**

- **FRIS** — CERIF push via REST/SOAP services, incremental. The schema below.
- **VABB-SHW** — annual delivery to ECOOM (deadline 1 May of year t-2 for
  publication year t-3, plus any not-yet-delivered t-4/t-5/t-6). This is a
  channel-and-publication assessment, not a per-field push — see the VABB
  section for why that distinction matters.

**Downstream consumers (read from the targets; Biblio does not feed them
directly):**

- **BOF-sleutel** — has **no submission schema of its own**. Its bibliometric
  parameters are computed from Web of Science (Clarivate) and from VABB-SHW.
  ECOOM computes the BOF/IOF validation labels, BOF weights, and CSS scores and
  **delivers them to the universities annually, who forward them to FRIS**
  (verified: FRIS Vademecum, "Bedrijfsregels voor … die meetellen voor de
  BOF/IOF-publicatieparameter … ECOOM levert deze informatie jaarlijks aan de
  universiteiten en hogescholen die dit vervolgens doorsturen naar FRIS").
  Biblio's obligation is pass-through, not authoring.
- **FWO** — consumes FRIS. v4.0 added explicit columns marking which attributes
  FWO uses for selection and which it displays in the FWO-onderzoeksverslag. The
  conditional OA/publisher requirements below *are* the FWO conditions. A1
  classification is derived from the journal's ISSN peer-review status, not a
  field Biblio sets.
- **Web of Science (Clarivate)** — not a consumer of Biblio. It is an upstream
  index Biblio reconciles against (WoS ID carried as a PID). Its relevance is
  that BOF parameter B1 and VABB category 1 depend on WoS coverage.

So: get FRIS and VABB right and the downstream layers mostly follow. The
exceptions are the international schemas (DataCite, OpenAIRE/Plan S) that apply
only to specific subsets — see the last section.

---

## Type taxonomy: mapping Biblio types to authority types

Neither authority uses Biblio's internal type list unchanged. The mappings
matter because a wrong mapping routes a record to the wrong rubric or drops it.

**FRIS** has no `conference_paper` type. Publication output is modelled as three
entities: **Journal Contribution**, **Book**, **Book Contribution**, plus
**Dataset** and **Octrooi** (patent) as separate entities. Conference output
must map to Journal Contribution (with an associated event) or Book Contribution.
`doctoral_thesis` is **not** a FRIS type — it is **Book, subtype "Dissertatie"**,
with extra mandatory fields (see below).

**VABB-SHW** category 2 recognises exactly **five publication types**, each with
a fixed weight from the BOF-besluit:

| VABB type | Weight | Biblio counterpart |
|---|---|---|
| artikel in tijdschrift | 1 | `journal_article` |
| boek als auteur | 4 | `book` (author role) |
| boek als editor | 1 | `book` (editor role) — **not a Biblio type; a role** |
| artikel/deel in boek | 1 | `book_chapter` |
| proceedings-artikel† | 0,5 | `conference_paper` |

† proceedings that are not journal special issues or edited books.

**The "boek als editor" row is a mapping hazard.** VABB counts book editorship
as a distinct countable type (weight 1). Biblio deliberately does **not** have
`book_editor`/`issue_editor` as output types (see `WORK-TYPES.md`) — editorship
is a contributor role on a `book`. The role must be preserved through to the
VABB delivery so this output stays countable. This is an open mapping question
(see [Open questions](#open-questions)).

VABB category 1 (WoS-indexed) is assessed by Clarivate, not the GP — Biblio does
not influence it beyond carrying the WoS ID.

Datasets are **out of scope for VABB-SHW** entirely.

---

## FRIS v4.0 — required fields per type

All fields below are verified against the Vademecum. "Required" = *Verplicht*;
"Conditional" = *Verplicht onder voorwaarden* with the condition stated.

### Universal (every publication entity)

Present on Journal Contribution, Book, and Book Contribution alike:

- **Instellingseigen identifier** (internal record ID) — Required. The Biblio
  record's unique persistent ID; used for updates/tombstones.
- **Titel** — Required, with a language tag.
- **Datum publicatie** — Required; year at minimum.
- **Type** (subtype) — Required; determines the FWO report rubric (A1, A2, …).
- **Deelnemers** (participants/authors) — Required; at least one internal person
  or org-unit, delivered as a ternary person-publication-organisation relation
  carrying all three internal persistent identifiers. An unlinked external
  author is a binary relation and valid.
- **Zichtbaarheid** (visibility) — defaults to public.

### journal_article (Journal Contribution)

| Field | Status | Format / condition |
|---|---|---|
| PID | Conditional | ≥1 external ID required if published ≥ 1/1/2019. DOI/WoS ID/VABB ID always supplied when they exist. DOI as `https://doi.org/10…`; WoS ID ~15 digits, no prefix. |
| Linked Journal + **Journal ISSN** | Conditional | ISSN required when it exists. Format `NNNN-NNNX`. Drives peer-review determination and A1 status (peer-review info pulled from ORBi). Not applicable to publication platforms. |
| Journal Titel | Required | Title of the journal/platform. |
| Volume / Issue | Conditional | Required *except* when not yet available (early/online-only) or types "Book review" and "preprint". |
| Pages / page count / article number (one of) | Conditional | Required *except* types "Book review" and "preprint". |
| Linked project | Conditional | Required if ≥2019 AND output of Flemish public funding (BOF/IOF/FWO/VLAIO). |
| Research Output Open Access Label | Conditional | Required if ≥2019 AND Flemish public funding. For preprints FRIS defaults to "open". |
| Embargodatum | Conditional | Required when OA Label = "Embargoed". |
| Peer-reviewed status | **Optional** | FRIS derives it from the journal ISSN. For preprints defaults to "Non-Peer Reviewed". |

### book (Book)

| Field | Status | Format / condition |
|---|---|---|
| PID | Conditional | ≥1 external ID if ≥2019. |
| **ISBN** | Conditional | Required **when it exists** (not flatly mandatory). |
| Uitgever (publisher) | Conditional | Required for subtype "boek" that is FWO-reportable. |
| Research Output OA Label | Conditional | Required for all FWO-reportable books. |
| Embargodatum | Conditional | Required when OA Label = "Embargoed". |
| Abstract | Conditional | Required for subtype "dissertatie"; strongly recommended for FWO-reportable reports. |
| Volume / pages / publisher (otherwise) | Optional | — |

### book_chapter (Book Contribution)

| Field | Status | Format / condition |
|---|---|---|
| **Titel Boek** (host book title) | Required | Or a link to the Book it is part of. |
| **Pages / page count / article number** | Required | Stricter than Book — required at the rule level, not "if available". |
| PID | Conditional | ≥1 external ID if ≥2019. |
| Uitgever | Conditional | Required if FWO-reportable. |
| Research Output OA Label | Conditional | Required if FWO-reportable. |
| Embargodatum | Conditional | Required when OA Label = "Embargoed". |

### doctoral_thesis → Book / subtype "Dissertatie"

Note the naming: Biblio docs use `doctoral_thesis`, Biblio **code** uses
`dissertation` (see `WORK-TYPE-FIELDS.md`), FRIS uses Book-subtype-Dissertatie.
On top of the Book fields, the Dissertatie business rules add:

| Field | Status | Format / condition |
|---|---|---|
| **Handle** | Required | A Handle specifically is required as PID (not just any PID). ISBN may follow later if available. |
| **Abstract** | Required | — |
| **Author + promotor, both with ORCID** | Required | Promovendus and promotor mandatory; co-promotors optional. |
| **Verdedigingsdatum** (defence date) | Required | Delivered as the start date on the Dissertatie type. |
| Linked doctoral project | Conditional | Required where it exists. |

### dataset (Dataset — native FRIS entity)

| Field | Status | Format / condition |
|---|---|---|
| Instellingseigen identifier | Required | Internal record ID. |
| **Titel** | Required | Original language (with language tag); English preferred. |
| **PID** | Required | ≥1, marked as main-source, type DOI/Handle/ARK/PURL/URN/URL. Concept DOI preferred over version DOI. First delivered = "main", rest = "alternative". |
| **Creator** | Required | ≥1 internal person (delivered as affiliation). |
| **Publicatiejaar** | Required | — |
| **Trefwoorden** (keywords) | Required | ≥1 English keyword, written out. Dutch recommended. |
| **Formaten** | Required (universities) | Free text, lower-case, no punctuation (xml, json, csv…). |
| **Toegangsrechten** (access rights) | Required | open / embargo / restricted / closed. |
| **Licentie** | Required (from 2022) | SPDX-based list; openness checked via opendefinition.org. |
| **FAIR label** | Required (but TBD) | In schema as required; not operational until the EU measurement framework exists. **[needs verification: operational in 2026?]** |
| Abstract | Conditional | Required when there is no linked project or publication. |
| Uitgever | Conditional | Required when a publisher exists. |
| Embargodatum | Conditional | Required when status = "Embargoed". |
| Linked project | Conditional | Required for datasets ≥2019 from Flemish public funding. |
| Linked output | Conditional | Required for datasets behind peer-reviewed FWO-funded articles ≥2021. |

### ORCID (person entity, cross-cutting)

Required for any person active ≥2021, or ≥2019 if involved in BOF/IOF/FWO-funded
research. Mandatory for dissertation author and promotor. Format
`0000-0000-0000-000X` (last char 0–9 or X; dashes required).

---

## VABB-SHW v15 — inclusion logic (not a field push)

**The critical structural point:** VABB does not validate record *fields* the
way FRIS does. The GP assesses **publication channels** (journals, publishers,
series, proceedings) against the BOF-besluit lower-bound criteria, over a
retrospective 10-year window (for budget year 2026: publications 2014–2023). A
Biblio record counts when (a) its channel is approved and (b) the record meets
the formal criteria. Peer-review is determined at channel level, not per record.

So this document gives the **inclusion logic**, which determines what Biblio must
capture to *be countable* — but the field-level delivery format (the columns of
the annual flat-file to ECOOM) is **not in the nota** and remains to obtain (see
Open questions).

**Lower-bound criteria (BOF-besluit Art. 4), verified:**

- Publicly accessible.
- Unambiguously identifiable via **ISSN or ISBN**.
- Contributes to new insight or its application.
- Assessed before publication in a **demonstrable peer-review process** with
  input external to the research group and independent of the authors; not
  organised by the author.
- **At least four pages long.** This is a hard inclusion criterion, verified in
  the nota and repeated for proceedings. Page information is therefore not an
  administrative nicety — a record under 4 pages is ineligible. (This corrects an
  earlier assumption that the 4-page rule might be apocryphal; it is real.)

Open access publications are explicitly eligible. Predatory journals (Cabells
severe violations, unless in DOAJ) are excluded — a channel-level decision, not
something Biblio controls per record.

**Per-type specifics:**

- **Journal articles** — channel (journal) must be GP-approved or WoS-indexed.
- **Books** — selected via the VABB publisher list (all titles accepted), via
  approved series, via the GPRC label (GEWU publishers), or individually through
  the appeal procedure with peer-review evidence. The GP stopped assessing
  individual non-GPRC titles from v5 onward.
- **Proceedings** — included if they have an ISSN **or** are published by a
  VABB-list publisher, **and** are at least four pages. Appeal procedure can
  waive the first two conditions for locally-managed quality proceedings with an
  ISBN.

**Timing (annual cycle):** delivery to ECOOM by 1 May (t-2); ECOOM channel lists
to GP by 1 Aug (t-2); updated lists by 1 Mar (t-1); VABB-SHW published 30 Jun
(t-1). v15 is current; **v16 expected ~June 2026** — obtain it for budget year
2027.

---

## International schemas (subset-applicable)

These apply only to specific output subsets, not the whole corpus. All
**[needs verification]** against their published schemas — not contradicted by
anything above, but not in the two verified files either.

- **DataCite Metadata Schema** — applies when minting dataset DOIs. Mandatory
  properties: Identifier, Creator, Title, Publisher, PublicationYear,
  ResourceType (= Dataset). Whether UGent is the minting party (directly bound)
  or downstream is an open question — see `WORK-TYPES.md` dataset notes.
- **OpenAIRE Guidelines (Literature / Data Repository Managers)** — applies if
  EU/Horizon-funded output is harvested. Funding stream as
  `info:eu-repo/grantAgreement/…`.
- **Plan S / cOAlition-S** — FWO is a member, so its OA conditions are Plan S in
  practice: machine-readable item-level licence (e.g. CC BY 4.0), embargo rules,
  version. These surface in Biblio via the OA Label / licence / embargo fields
  already required by FRIS for FWO-reportable output.

---

## Open questions

These block treating the mapping as complete. Resolve and move to a resolved
section with reasoning when answered (per the team's decision-record practice).

1. **VABB flat-file delivery schema.** The nota gives inclusion logic, not the
   column structure/format of the 1-May delivery to ECOOM. Obtain from the
   Biblio data manager (likely faster internally than from ECOOM).
2. **Editorship capture.** How does Biblio record `book` editor role so that
   VABB "boek als editor" (weight 1) stays countable, given editorship is a role
   and not an output type? Affects the VABB export mapping.
3. **Conference output routing to FRIS.** FRIS has no conference type. Confirm
   Biblio's existing mapping: journal_article-with-event vs book_contribution.
4. **FAIR label.** Schema-required but TBD. Is it operational/enforced in 2026?
   Check with the FRIS Integration Desk.
5. **Dataset licence from 2022.** Confirm whether the licence requirement is
   enforced for the back-catalogue or forward-only.
6. **ECOOM pass-through timing.** When each year does ECOOM deliver
   Validations/BOF-weight/CSS, and how does Biblio currently forward them to
   FRIS? (Internal — Biblio devs.)
7. **DataCite minting authority at UGent.** Minting party (directly bound by the
   DataCite schema) or downstream consumer? Determines whether DataCite is a hard
   deposit-time constraint on datasets.
8. **DOI format on the wire.** FRIS wants the full `https://doi.org/…` URI form.
   Confirm Biblio stores/emits it that way, not as a bare DOI.
9. **FRIS XSD.** This Vademecum is the business-rule layer. Obtain the raw CERIF
   XML profile (.xsd) from the FRIS Integration Desk to confirm exact element
   names and cardinalities before coding the templ mapping.
10. **BOF-besluit currency.** Nota cites the besluit last amended 26/01/2024.
    Check codex.vlaanderen.be (DID=1022807) for any later amendment to the
    publication parameters.

---

## Sources

| Source | Status | Where to get it |
|---|---|---|
| FRIS Vademecum v4.0 | **Verified** (in hand) | researchportal.be / FRIS Integration Desk |
| FRIS CERIF XML profile (.xsd) | Not yet obtained | FRIS Integration Desk |
| VABB-SHW Begeleidende nota v15 | **Verified** (in hand) | ecoom.be/vabb |
| VABB flat-file delivery spec | Not yet obtained | Biblio data manager (internal) / ECOOM UAntwerpen |
| BOF-besluit (regelgeving) | Referenced, not read | codex.vlaanderen.be DID=1022807 |
| DataCite Metadata Schema | Not yet obtained | datacite.org (published, versioned) |
| OpenAIRE Guidelines | Not yet obtained | guidelines.openaire.eu |
| Plan S / RRS | Not yet obtained | coalition-s.org |
