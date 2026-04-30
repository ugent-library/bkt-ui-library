# STRATEGY.md
# Biblio product strategy — UB2030 context

This file translates the UB2030 transition plan and Booktower product strategy into
product principles and constraints that should inform every design and build decision.
Read this before making product decisions. It is not a feature list — it is the "why".

For implementation decisions, see `PRODUCT.md`.
For domain vocabulary, see `DOMAIN.md`.
For who is responsible for which fields and workflow steps, see `RESPONSIBILITY.md`.

---

## What Biblio must become

> A sovereign, integrated, auto-importing knowledge infrastructure where researchers
> do minimal input and librarians curate records into high-quality, interconnected outputs.

Biblio is not a form. It is the authoritative map of UGent's research output — the one
no commercial system will maintain for UGent.

---

## Strategic pillars

### 1. Sovereign infrastructure

UGent has deliberately chosen to manage its own research output infrastructure,
independent of external commercial systems (Clarivate, Elsevier, etc.).

**What this means for product decisions:**
- Own the identifiers, metadata, and storage layer
- Build for interoperability (OAI-PMH, DataCite, schema.org), not lock-in
- Ingestion pipelines can pragmatically use OpenAlex, Crossref, DataCite as spine —
  but the curation and storage layer must remain under UGent control
- Resilience matters: when commercial API conditions change, our curation flow must
  hold. Design with fallback strategies in mind.
- Data must still be legible in 50 years. Every format, identifier, and schema choice
  is a long-term commitment.

**On external identifiers:** `bbl` determines what we replicate and what we reuse.
ORCID person identifiers are used as-is. UGent LDAP identifiers are used for internal
linking. We do not build parallel identity infrastructure where an external source
already does the job adequately — but we own the mapping between external identifiers
and UGent records.

### 2. Biblio as an editorial system, not an input system

The registration process shifts: library staff move from data entry to **editorial review
of auto-imported data**. Manual input remains but is no longer the primary flow for
most output types.

**Coverage reality (important for prioritisation):**
- DOI-based journal articles, preprints, DataCite datasets: ~70% auto-import coverage achievable
- Long tail (book chapters from small publishers, conference papers without DOIs,
  artistic output, software, policy reports, theses, performances): 0–30% coverage
  for the next 5+ years. These are exactly the output types UGent most cares about
  for evaluation and open science reporting.

**What this means for product decisions:**
- Build ingestion pipelines (DOI, ORCID, APIs) — this is product work, not infra work
- Build confidence scoring so curators know what was auto-imported vs human-entered
- Build curator review interfaces as a first-class feature, not an afterthought
- Optimise form UX for the long tail — the categories auto-import will never catch
- Forms remain permanent infrastructure even when auto-import coverage improves

### 3. Biblio as a system node, not an isolated tool

Biblio is where data converges, not where work starts.

**Pull from:** publishers, ORCID, internal UGent systems (LDAP, HR, GISMO, project registries)
**Push to:** reporting systems, researcher profiles, external platforms, APIs

**What this means for product decisions:**
- APIs and machine interfaces are as important as the UI — citation managers, CRIS
  systems, government reporting tools, and research evaluators consume Biblio
  programmatically
- The public UI is the human-readable proof that the data is good; it is not the only consumer
- Persistent identifiers on everything (works, people, organisations, projects)
- Strong, first-class linking between entities (work → dataset → software → thesis)

### 4. Accept imperfect data — quality is downstream

Researchers provide the minimum necessary for machines and curators to achieve quality.
Input is allowed to be messy. Quality is achieved via curation cycles.

**Risk to manage:** if the researcher UI is too minimal, curators inherit a data problem
instead of a data improvement workflow. The submission bar must be low, but not so
low that curators must reconstruct missing information from scratch.

**What this means for product decisions:**
- Non-blocking submission: researchers can submit without all fields complete
- Stateful records with full audit trail — who changed what, when, and from which source
- Clear state vocabulary: `draft → submitted → public`, with `returned` as a valid
  curation state. Do not collapse or hide these states in the UI.
- Versioning matters: a record that has been through editorial review is a different
  quality signal than a raw import. A record can have multiple sources,
  which means we will make trade-offs and choose which one is more valuable
  or more likely to be correct. Make this visible.

### 5. Two completely different UX layers

If both researchers and curators use the same interface, the design has failed.

| Researcher UX | Curator UX |
|---------------|------------|
| Focused interaction, minimal required input | Heavy interaction, batch-oriented |
| Guided toward open access | High-density information |
| Quantity: get it registered | Quality: get it right |
| Simple, forgiving, explains itself | Powerful, efficient, assumes expertise |

**What this means for product decisions:**
- Design every backoffice feature for curators first, then ask what a researcher version
  would look like (simpler, scoped to their own work)
- Do not reuse the same template for both contexts — they have different information
  needs, different action sets, and different mental models
- The sub-sidebar navigation differs between researcher view ("My work") and curator
  view (institution-wide). Never conflate them.

### 6. Open science as a design principle, not a checkbox

Open access is the institutional default. Diamond OA (no cost to author or reader) is
preferred over pay-to-publish. The system should be as open as possible and as closed
as necessary — but "as closed as necessary" is determined by legal and contractual
constraints, not by making restricted the easier path.

**Critically: determining what is legally permissible is the system's job, not the
researcher's.** The deposit form guides researchers toward the most open option that
is legally available for their specific work. Researchers should not be expected to know
publisher embargo policies or licence conditions — the system should surface that
information and present the appropriate options.

**In the deposit form:**
- Open access is the default selection when legally permissible — not one of three equal options
- Embargo is available and clearly marked when relevant, but secondary in visual weight
- Restricted requires a deliberate choice — it must not be the path of least resistance

**In search and discovery:**
- OA status is a prominent, early filter — not buried
- `badge-oa` is visually positive, not neutral
- Works without full-text access do not look broken — but open access should feel like the norm

### 7. Public surface is strategically primary

The public surface is how UGent fulfils its open science mission. It is not the less
important half of the system.

**Consequences:**
- Public search and detail pages deserve the same design rigour as the backoffice
- Structured data (`application/ld+json`) is not optional polish — it is how
  citation managers, crawlers, and accessibility overlays consume the data
- Performance and mobile usability matter on the public surface
- Anonymous access is the norm, not an edge case

---

## What only Biblio can provide

These are the capabilities that justify building and maintaining sovereign infrastructure
rather than outsourcing to OpenAlex, Crossref, or a commercial CRIS.

1. **UGent affiliation history** — which department, which faculty, at the time of the
   work. No external source carries this reliably.
2. **Project links** — connecting outputs to funded research (FWO, BOF, EU grants).
   Essential for grant reporting; invisible in external systems.
3. **Curated quality signals** — a record that passed editorial review carries more
   weight than a raw harvest. That is the institutional stamp.
4. **Cross-type connections** — dataset behind the article, software behind the dataset,
   thesis behind the conference paper. External systems silo by type. Biblio sees the
   full research chain because it has the curator context to build it.

---

## Prioritisation principles

When choosing what to build next, use these filters:

1. **Does it reduce curator burden on records that auto-import will never catch?**
   → High priority. This is the long-tail problem that defines Biblio's real value.

2. **Does it improve data quality signals visible to downstream consumers?**
   → High priority. APIs and reporting matter as much as the UI.

3. **Does it make open access the default, easier path — within legal constraints?**
   → High priority. This is a declared institutional mission, not a preference.

4. **Does it expose data that no external system maintains?**
   (affiliation history, project links, cross-type connections)
   → High priority. This is Biblio's unique value.

5. **Does it improve the public discovery surface?**
   → Medium-high priority. The public UI is proof the data is good.

6. **Does it replicate something OpenAlex / Crossref / ORCID / GISMO already does adequately?**
   → Low priority unless there is a specific UGent reason that justifies the maintenance cost.

---

## UB2030 by the numbers (context for scope decisions)

| Metric | Value |
|--------|-------|
| Total research output records in Biblio | 380,617 |
| Records entered / reviewed per year | ~17,100 |
| Online visitors to UBGent platforms | 3.5M / year |
| Downloads of UGent research output | 1.7M / year |
| Digitised heritage items (Boekentoren) | 187,000 |
| Google-digitised books | 225,000 |
| Heritage item views (all platforms) | ~4M / year |

The scale means: a 10% reduction in curator time per record saves ~1,700 hours/year.
A broken public search page affects 3.5M visitors.

---

## The heritage context

The Boekentoren is an officially recognised Erfgoedbibliotheek (heritage library) in
Flanders. Heritage objects are part of Biblio — they share the Work data model and
live in the same system. They are not a separate product.

Heritage objects have distinct display needs that standard research output pages do not cover:
- High-resolution image viewing (IIIF)
- Physical location and shelf mark
- Digitisation status
- Loan request for museum exhibitions
- Provenance and ownership history

Heritage display is a primary public mission, not an edge case. At ~4M annual views
via Google Books alone, it is one of the highest-traffic features of the system.
