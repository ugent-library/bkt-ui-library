# Evidence — the power-query log

*Full pass over the frontend query log (2025-12-31 → 2026-07-09, 101,940,897 lines, 15.7 GB),
2026-08-04. The numbers behind [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md), the exposure
statuses in [`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md) and the cases in
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md). How the extraction was run:
`notes/PROMPT-golden-query-extraction.md`. Privacy: aggregates and structures only, no names, no
raw queries, no session ids.*

## The one paragraph

The acceptance set is buildable and small. The **human** side is 3,589 authored queries using
**40 distinct fields** and 9 operators. The **machine** side is 72.9M replays whose entire contract
fits in **25 query structures (98.9% of hits)**. Two findings change design decisions: real batch
sizes reach **763 values / 9,336 characters**, which no query-string permalink carries; and the
fields humans never authored are almost all fields the old UI never offered — `doi` is authored
644× in expert search and **1×** in advanced, which is defection, not disinterest.

## What humans authored

3,589 form queries in six months, about 19 a day: 3,107 on the advanced form, 482 in expert search.

- **Conditions per query** (advanced/form): 64% one, 26% two, 10% three or more. The advanced form
  stops at ten, and the tail beyond it is longhand `author exact X OR author exact Y …` chains
  reaching 85 terms, written that way because no list input exists.
- **Fields, advanced/form top:** author 887 · basic 676 · year 393 · title 377 · type 355 ·
  publication 274 · parent 274 · id 234 · affiliation 214 · external 199 · classification 190.
- **Fields, expert/form top:** author 1,163 · doi 644 · file.access 263 · year 239 ·
  affiliation 230 · classification 202 · type 142.
- **The tail** — 40 distinct fields in all: language 57 · articletype 44 · publisher 34 ·
  keyword 32 · embargo 32 · subject 30 · vabb_approved 29 · misctype 29 · editor 27 ·
  datecreated 19 · accesslevel 15 · conferencetype 10, plus one-offs and three parse artifacts
  (`for`, `of`, `field`).
- **Negation** — `<>` in 178 queries (5.0%): `file.access` 84 · `affiliation` 61 ·
  `classification` 50 · `type` 17 · `field` 10 · `subject` 9 · `vabb_approved` 8 · `year` 1.
- **True ranges** — `year` (132 `>=`, 25 `<=`, 25 `>`, 17 `<`) and `datecreated` (10 `>=`,
  9 `<=`); 54 queries bound both ends.
- **OR usage** — 181 of 3,589 (5.0%): 136 a value list within one field (75%), 45 mixed-field,
  mostly the author/editor idiom (18.4M direct hits, 54% of expert/direct).
- **Batch sizes** — `id`: n=235, median 18, max **763**, and 58 queries at 50 values or more.
  `identifier` max 200, `project` max 189, `author` max 99, `affiliation` max 41.
- **Query length** — p50 41 characters, p90 168, p95 425, p99 1,923, max **9,336**; 34 queries
  above 2,000.
- **717 distinct structures** after values are normalised, which is why the set covers the frequent
  shapes plus the extremes rather than everything.
- **Direct-traffic uniqueness** — 51% of direct queries are unique (full-data figure from the main
  report; the 1:1009 sample structurally overestimates it).

## What the deltas between the two tiers show

Absence from the authored log is not evidence of no need — the old advanced UI only offered the fields it offered. The tier delta makes the gap visible:

| field | advanced/form | expert/form | reading |
|---|---:|---:|---|
| `doi` | 1 | 644 | people learned the query language to look up DOIs |
| `file.access` | 63 | 263 | open-access filtering pushed to expert |
| `publication_status` | 0 (61 as `publicationstatus`) | 73 | naming difference, same need |
| `subject` | 0 | 30 | not offered in advanced at all |
| `embargo` | 1 | 31 | idem |
| `datecreated` | 1 | 18 | idem |
| `basic` / `title` | 676 / 377 | 4 / 1 | the reverse: free text is an advanced-form habit |

This is the unmet-need evidence the bet says the log cannot show. It can — in the difference between the two tiers.

## The machine contract is 25 structures

72,901,450 replayed queries: expert/direct 34,419,052 · advanced/direct 29,964,857 · advanced/link 4,558,518 · expert/link 3,959,023.

| top N structures, counted per tier | share of 72.9M hits |
|---:|---:|
| 10 | 87.5% |
| 25 | 98.9% |
| 50 | 99.7% |
| 100 | 99.9% |

Structures are values-normalised, so the 11,925 distinct ones are not distinct URLs. The head-coverage claim is about query *shapes*, which is what the translator has to implement, not about how many permalinks exist.

Hit-weighted field usage: `author` 64.1M · `type` 38.5M · `editor` 38.5M · `keyword` 23.7M · `parent` 5.4M · `subject` 1.85M · `issn` 1.27M · `affiliation` 645K · `publisher` 518K · `classification` 172K · `promoter` 149K · `project.id` 133K · `year` 43K · `jcr.category` 34K · `external` 18K.

Three fields appear in machine traffic and **never** in an authored query: `issn` (1.27M hits), `promoter` (149K), `jcr.category` (34K). That is the entire machine-only list, and for the first two the reason they were never authored is that no UI offered them.

The four biggest single structures:

| hits | share | structure |
|---:|---:|---|
| 19.1M | 26.2% | the author/editor idiom (`author=X or (type any "bookEditor issueEditor" and editor=X)`) |
| 11.0M | 15.1% | `keyword exact V` — the subject permalink |
| 10.2M | 14.0% | `author exact X AND author exact Y` — the co-author permalink |
| 9.3M | 12.7% | author/editor idiom **AND** `keyword exact V` |

The co-author permalink is worth naming: two person conditions, AND-joined, 10.2M replays. The builder's person rows cover it, and the URL has to keep expressing two same-field conditions distinctly — one "any of" list would silently change the meaning from AND to OR.

## Legacy embed parameters

Two exist in the wild, both attached to author-scoped queries: **`;hide_info=1`** (1,411 in a 34% sample of the log) and **`;style=apa`** (583). `style=apa` is a **citation style**, not a sort order.

## Per-field evidence behind the exposure decisions

Statuses are decided in `QUERY-BUILDER-FIELD-CONTRACT.md`; this table is the evidence they
rested on.

| field | authored by humans? | machine hits | recommendation |
|---|---|---:|---|
| `issn` | never | 1.27M | **expose** — journal-scoped lists are a bibliographer's core task; never offered, so never authored |
| `promoter` | never | 149K | **expose as a contributor role**, not a field — it disappears into the person condition ("as supervisor") |
| `keyword` / `subject` | 32 / 30 | 23.7M / 1.85M | expose — the single biggest machine field is a human-meaningful one |
| `publisher` | 34 | 518K | expose |
| `doi` | 645 | — | expose, with paste-a-list |
| `external` | 257 | 18K | **expose through Affiliation**, not as a field — an organization filter returns the unit and its subtree, so *is* or *is not* Ghent University says it |
| `jcr.category` | never | 34K | journal metrics are in active use, so "never authored" is again a UI artifact; exposing it also needs a licensing answer |
| `jcr.impact_factor` | 1 | — | **backoffice** (2026-08-18) — the backoffice reuses the builder with more fields; the public page drops it |
| `publication_status` | 134 | 1.2K | expose — a fact about the work rather than about the deposit, and the most-authored field the ledger had kept off the public page |
| `file.publicationversion` | 5 | — | expose — thin evidence, exposed on the same reading as `publication_status` |
| `soleauthor`, `firstauthor`, `lastauthor` | none in this log | 75 | **expose as roles on the Person row.** The 75 hits are saved URLs someone built before this log began; each also filters a classification code, and the backoffice builder offers both |
| `file.kind`, `project.euframeworkprogramme` | never | — | expose — a team decision, not a log finding: neither was ever offered, so the log says nothing either way |
| `conference` | 4 | — | expose — a poster or a talk has no proceedings volume, so its conference name is the only way to find it |
| `license` | never | — | expose — biblio and raven both show a licence, and neither lets anyone search one; a developer should say what indexing it takes |
| `copyrightstatement` | 2 | 2 | undecided — the backoffice renders this sentence from the licence and stores nothing (`frontoffice/record.go`), so a row would filter a rendered value; both queries are licence queries |
| `field`, `for`, `of` | parse artifacts | — | the translator must not crash; not builder fields |

## What this log cannot answer

- **Intent and outcome.** The log records nothing about what a query returned, so a query that found nothing is invisible. Recording that one fact alongside the query is what buys it.
- **Whether an authored query satisfied the author.** Only that it was submitted.
- **Which distinct permalinks matter most.** We counted shapes, not URLs (deliberately: privacy and memory). Ranking literal URLs needs a separate pass with a retention rule.
- **URL-level context.** The log carries the query, not the full request URL, so embed parameters only surface where they were glued into the query string. Fuller embed evidence needs webserver access logs.
- **Anything about people.** By construction.
