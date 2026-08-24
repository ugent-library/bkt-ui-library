# Golden query set — draft

*Generated from the full frontend query log (2025-12-31 → 2026-07-09, 101,940,897 lines) by
`notes/_powerquery/build_set.py`. Evidence: [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md).*

**All values are fixtures** (`PERSON_1`, `DOI_1`, `ID_1`, …) — no logged value, name or
identifier appears in this file. The frequencies are real: occurrences in human form traffic
(C1–C5, C7) or hits in machine traffic (C6, C8).

## Two subsets, two contracts

| subset | source | contract | owner | gate |
|---|---|---|---|---|
| **A — builder expressibility** | human `form` queries (advanced + expert, n=3,589) | the builder can author this query | **prototype** | every case is either authorable, or signed off as *field not exposed* |
| **B — translator fidelity** | all of A **plus** machine `direct`/`link` traffic and legacy embed parameters | the legacy query keeps resolving to the right new query | raven | 100%, no exceptions — this is the "100% keeps working" constraint |

B is strictly larger than A, and it is **not prototype scope**: it is the translator
workstream's requirements list, recorded here because this is where the evidence lives. The
prototype is judged on A only.

Automation: `_powerquery/golden-queries.json` carries the same cases machine-readably (case
id, structure, fixture query, subset, scope, observed frequency) so a test runner can iterate
them instead of a human reading a table.

## Selection rule (so the set is reproducible)

Reduce every logged query to a **structural signature**: the multiset of (field, operator)
pairs + the boolean shape + a value-count bucket (1 / 2–9 / 10–49 / 50+). Deduplicate on
signature; per signature keep the highest-frequency example, and additionally the longest
example where value count matters. Deterministic, re-runnable when the log grows, and
reviewable — each case carries its signature and its observed frequency. Empty field ×
operator cells are out of scope by evidence, recorded as such.

## What "passes" means

Assert on the **produced query object / URL**, never on result counts: the translator's
output must equal the expected `QueryFilter` (or public URL), and the builder must round-trip
URL → builder state → URL unchanged. Counts depend on index state and would make the gate
flaky. Semantic equivalence against a small fixture index is a useful extra, not the gate.

## Care

Cases contain personal data (names, person IDs, and in the direct head, real bookmarked
URLs). Values get anonymized against fixture records per the DPO rules before the set is
shared or committed; the structure is what is being tested, not the people.

## The cases

194 cases. Field exposure statuses live in
[`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md): a case on a field the
ledger keeps off the public surface resolves to *backoffice* / *not exposed* for subset A,
whatever its proposed label reads.

## C1 — field × operator matrix (form traffic) — 85 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C1.01 | `author = PERSON_1` | 1,033 | A+B | in scope |  |
| C1.02 | `author exact PERSON_1` | 979 | A+B | in scope |  |
| C1.03 | `basic = TEXT` | 680 | A+B | in scope |  |
| C1.04 | `doi = DOI_1` | 645 | A+B | in scope |  |
| C1.05 | `title = TEXT` | 369 | A+B | in scope |  |
| C1.06 | `type any "journalArticle"` | 366 | A+B | in scope |  |
| C1.07 | `publication exact JOURNAL_1` | 282 | A+B | in scope |  |
| C1.08 | `classification any "A1"` | 263 | A+B | in scope |  |
| C1.09 | `year exact 2020` | 258 | A+B | in scope |  |
| C1.10 | `external exact 0` | 257 | A+B | in scope |  |
| C1.11 | `parent = JOURNAL_1` | 257 | A+B | in scope |  |
| C1.12 | `id any "ID_1"` | 235 | A+B | in scope |  |
| C1.13 | `affiliation any "ORG_1"` | 201 | A+B | in scope |  |
| C1.14 | `year >= 2020` | 132 | A+B | in scope |  |
| C1.15 | `affiliation exact ORG_1` | 105 | A+B | in scope |  |
| C1.16 | `file.access <> open` | 103 | A+B | in scope |  |
| C1.17 | `file.access exact open` | 99 | A+B | in scope |  |
| C1.18 | `year = 2020` | 90 | A+B | in scope |  |
| C1.19 | `year any "2020"` | 85 | A+B | in scope |  |
| C1.20 | `affiliation <> ORG_1` | 79 | A+B | in scope |  |
| C1.21 | `project.id exact PROJECT_1` | 73 | A+B | in scope |  |
| C1.22 | `publication_status exact published` | 73 | A+B | in scope |  |
| C1.23 | `project = PROJECT_1` | 70 | A+B | in scope |  |
| C1.24 | `file.access any "open"` | 67 | A+B | in scope |  |
| C1.25 | `abstract = TEXT` | 66 | A+B | in scope |  |
| C1.26 | `type exact journalArticle` | 65 | A+B | in scope |  |
| C1.27 | `publicationstatus any "published"` | 61 | A+B | in scope |  |
| C1.28 | `affiliation = ORG_1` | 59 | A+B | in scope |  |
| C1.29 | `parent exact JOURNAL_1` | 58 | A+B | in scope |  |
| C1.30 | `file.access = open` | 57 | A+B | in scope |  |
| C1.31 | `language any "eng"` | 56 | A+B | in scope |  |
| C1.32 | `classification = A1` | 55 | A+B | in scope |  |
| C1.33 | `classification <> A1` | 51 | A+B | in scope |  |
| C1.34 | `type = journalArticle` | 47 | A+B | in scope |  |
| C1.35 | `articletype any "original"` | 44 | A+B | in scope |  |
| C1.36 | `author any "PERSON_1"` | 37 | A+B | in scope |  |
| C1.37 | `keyword exact KEYWORD_1` | 32 | A+B | in scope |  |
| C1.38 | `embargo exact 0` | 29 | A+B | in scope |  |
| C1.39 | `misctype any "report"` | 28 | A+B | in scope |  |
| C1.40 | `publisher = PUBLISHER_1` | 26 | A+B | in scope |  |
| C1.41 | `year <= 2020` | 25 | A+B | in scope |  |
| C1.42 | `year > 2020` | 25 | A+B | in scope |  |
| C1.43 | `classification exact A1` | 23 | A+B | in scope |  |
| C1.44 | `vabb_approved exact 1` | 21 | A+B | in scope |  |
| C1.45 | `editor exact PERSON_1` | 20 | A+B | in scope |  |
| C1.46 | `subject = KEYWORD_1` | 19 | A+B | in scope |  |
| C1.47 | `type <> journalArticle` | 19 | A+B | in scope |  |
| C1.48 | `year < 2020` | 16 | A+B | in scope |  |
| C1.49 | `id = ID_1` | 11 | A+B | in scope |  |
| C1.50 | `conferencetype any "proceedingsPaper"` | 10 | A+B | in scope |  |
| C1.51 | `datecreated >= 2024` | 10 | A+B | in scope |  |
| C1.52 | `field <> FIELD_1` | 10 | B | translator-only | parse artifact — must not crash |
| C1.53 | `subject <> KEYWORD_1` | 10 | A+B | in scope |  |
| C1.54 | `datecreated <= 2024` | 9 | A+B | in scope |  |
| C1.55 | `title exact TEXT` | 8 | A+B | in scope |  |
| C1.56 | `vabb_approved <> 1` | 8 | A+B | in scope |  |
| C1.57 | `accesslevel exact open` | 7 | A+B | in scope |  |
| C1.58 | `project any "PROJECT_1"` | 7 | A+B | in scope |  |
| C1.59 | `editor = PERSON_1` | 6 | A+B | in scope |  |
| C1.60 | `field exact FIELD_1` | 6 | B | translator-only | parse artifact — must not crash |
| C1.61 | `publisher exact PUBLISHER_1` | 6 | A+B | in scope |  |
| C1.62 | `accesslevel = open` | 5 | A+B | in scope |  |
| C1.63 | `conference = CONF_1` | 4 | A+B | in scope |  |
| C1.64 | `identifier any "ID_1"` | 4 | A+B | in scope |  |
| C1.65 | `embargo = 0` | 3 | A+B | in scope |  |
| C1.66 | `file.publicationversion exact publishedVersion` | 3 | A+B | in scope |  |
| C1.67 | `abstract all "TEXT"` | 2 | A+B | in scope |  |
| C1.68 | `accesslevel any "open"` | 2 | A+B | in scope |  |
| C1.69 | `file.publicationversion any "publishedVersion"` | 2 | A+B | in scope |  |
| C1.70 | `publisher any "PUBLISHER_1"` | 2 | A+B | in scope |  |
| C1.71 | `accesslevel all "open"` | 1 | A+B | in scope |  |
| C1.72 | `author all "PERSON_1"` | 1 | A+B | in scope |  |
| C1.73 | `author.affiliation any "ORG_1"` | 1 | A+B | in scope |  |
| C1.74 | `copyrightstatement <> STATEMENT_1` | 1 | A+B | in scope |  |
| C1.75 | `copyrightstatement any "STATEMENT_1"` | 1 | A+B | in scope |  |
| C1.76 | `editor any "PERSON_1"` | 1 | A+B | in scope |  |
| C1.77 | `file <> FILE_1` | 1 | A+B | in scope |  |
| C1.78 | `for all "TEXT"` | 1 | B | translator-only | parse artifact — must not crash |
| C1.79 | `jcr.impact_factor > 5` | 1 | A+B | not exposed | backoffice field — the public builder drops it |
| C1.80 | `language <> eng` | 1 | A+B | in scope |  |
| C1.81 | `misctype exact report` | 1 | A+B | in scope |  |
| C1.82 | `of all "TEXT"` | 1 | B | translator-only | parse artifact — must not crash |
| C1.83 | `subject exact KEYWORD_1` | 1 | A+B | in scope |  |
| C1.84 | `title any "TEXT"` | 1 | A+B | in scope |  |
| C1.85 | `year <> 2020` | 1 | A+B | in scope |  |

## C2 — value lists / paste batches — 12 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C2.01 | `id any "ID_1 … _763"` | 1 | A+B | in scope | longest observed batch: 763 values |
| C2.02 | `id any "ID_1 … _18"` | 235 | A+B | in scope | median batch: 18 values (n=235) |
| C2.03 | `identifier any "ID_1 … _200"` | 1 | A+B | in scope | longest observed batch: 200 values |
| C2.04 | `identifier any "ID_1 … _27"` | 4 | A+B | in scope | median batch: 27 values (n=4) |
| C2.05 | `project any "PROJECT_1 … _189"` | 3 | A+B | in scope | longest observed batch: 189 values |
| C2.06 | `project any "PROJECT_1 … _99"` | 7 | A+B | in scope | median batch: 99 values (n=7) |
| C2.07 | `author any "PERSON_1 … _99"` | 1 | A+B | in scope | longest observed batch: 99 values |
| C2.08 | `author any "PERSON_1 … _17"` | 37 | A+B | in scope | median batch: 17 values (n=37) |
| C2.09 | `affiliation any "ORG_1 … _41"` | 1 | A+B | in scope | longest observed batch: 41 values |
| C2.10 | `editor any "PERSON_1 … _20"` | 1 | A+B | in scope | longest and median batch: 20 values (n=1) |
| C2.11 | `year any "2020_1 … _13"` | 1 | A+B | in scope | longest observed batch: 13 values |
| C2.12 | `year any "2020_1 … _9"` | 85 | A+B | in scope | median batch: 9 values (n=85) |

## C3 — OR shapes — 55 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C3.01 | `PERSON_1 OR author exact PERSON_1 or … or author exact PERSON_1  (13 terms) AND year any "2020" AND affiliation exact ORG_1 AND external exact 0` | 29 | A+B | in scope | composite, 5-20 OR terms |
| C3.02 | `PERSON_1 OR author exact PERSON_1 or … or author exact PERSON_1  (21 terms) AND year any "2020" AND affiliation exact ORG_1 AND external exact 0` | 16 | A+B | in scope | composite, 21+ OR terms |
| C3.03 | `doi = DOI_1 or … or DOI_50` | 13 | A+B | in scope | single-field value list, 21+ OR terms |
| C3.04 | `PERSON_1 or PERSON_1` | 8 | A+B | in scope | single-field value list, 1 OR term |
| C3.05 | `author = PERSON_1 or … or PERSON_1  (10 terms) AND year exact 2020 AND type any "journalArticle"` | 7 | A+B | in scope | composite, 5-20 OR terms |
| C3.06 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) AND accesslevel exact open` | 6 | A+B | in scope | composite, 1 OR term |
| C3.07 | `author = PERSON_1 OR author = PERSON_1` | 5 | A+B | in scope | single-field value list, 1 OR term |
| C3.08 | `id = ID_1 or … or ID_20` | 5 | A+B | in scope | single-field value list, 5-20 OR terms |
| C3.09 | `(parent = JOURNAL_1 OR publisher = PUBLISHER_1) AND year any "2020"` | 5 | A+B | in scope | composite, 1 OR term |
| C3.10 | `project = PROJECT_1` | 4 | A+B | in scope | single-field value list, 1 OR term |
| C3.11 | `author = PERSON_1 or … or PERSON_11` | 4 | A+B | in scope | single-field value list, 5-20 OR terms |
| C3.12 | `PERSON_1 or … or PERSON_1  (5 terms)` | 4 | A+B | in scope | single-field value list, 2-4 OR terms |
| C3.13 | `id = ID_1 or … or ID_105` | 4 | A+B | in scope | single-field value list, 21+ OR terms |
| C3.14 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) AND accesslevel = open` | 3 | A+B | in scope | composite, 1 OR term |
| C3.15 | `author = PERSON_1 or … or PERSON_44` | 3 | A+B | in scope | single-field value list, 21+ OR terms |
| C3.16 | `publication exact JOURNAL_1 or JOURNAL_1` | 3 | A+B | in scope | single-field value list, 1 OR term |
| C3.17 | `doi = DOI_1 or doi = DOI_1` | 3 | A+B | in scope | single-field value list, 1 OR term |
| C3.18 | `author = PERSON_1 or … or PERSON_15` | 3 | A+B | in scope | single-field value list, 5-20 OR terms |
| C3.19 | `doi = DOI_1 or … or DOI_18` | 3 | A+B | in scope | single-field value list, 5-20 OR terms |
| C3.20 | `PERSON_1 OR author exact PERSON_1 or … or author exact PERSON_1  (4 terms) AND year any "2020" AND affiliation exact ORG_1 AND external exact 0` | 2 | A+B | in scope | composite, 2-4 OR terms |
| C3.21 | `author = PERSON_1 or … or PERSON_1  (7 terms) AND year exact 2020` | 2 | A+B | in scope | composite, 5-20 OR terms |
| C3.22 | `author = PERSON_1 AND type any "journalArticle" AND affiliation any "ORG_1"` | 2 | A+B | in scope | composite, 1 OR term |
| C3.23 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) AND accesslevel any "open"` | 2 | A+B | in scope | composite, 1 OR term |
| C3.24 | `abstract = TEXT` | 2 | A+B | in scope | single-field value list, 1 OR term |
| C3.25 | `parent = JOURNAL_1` | 2 | A+B | in scope | single-field value list, 1 OR term |
| C3.26 | `publication = JOURNAL_1 or … or JOURNAL_20` | 2 | A+B | in scope | single-field value list, 5-20 OR terms |
| C3.27 | `id = ID_1(ID_1 or … or ID_1  (3 terms) )` | 2 | A+B | in scope | single-field value list, 2-4 OR terms |
| C3.28 | `datecreated >= 2024 and datecreated <= 2024 and type <> journalArticle or researchData` | 2 | A+B | in scope | composite, 1 OR term |
| C3.29 | `(type = journalArticle) OR (type = journalArticle)` | 2 | A+B | in scope | single-field value list, 1 OR term |
| C3.30 | `classification = A1 OR classification = A1` | 2 | A+B | in scope | single-field value list, 1 OR term |
| C3.31 | `author = PERSON_1 or … or author = PERSON_1  (3 terms)` | 2 | A+B | in scope | single-field value list, 2-4 OR terms |
| C3.32 | `2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 OR 2020 AND year any "2020" AND affiliation exact ORG_1 AND external exact 0` | 2 | A+B | in scope | composite, 5-20 OR terms |
| C3.33 | `PERSON_1 OR author exact PERSON_1 or … or author exact PERSON_1  (20 terms) AND year any "2020" AND affiliation exact ORG_1` | 2 | A+B | in scope | composite, 5-20 OR terms |
| C3.34 | `publication exact JOURNAL_1 or … or JOURNAL_1  (3 terms)` | 2 | A+B | in scope | single-field value list, 2-4 OR terms |
| C3.35 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1))` | 2 | A+B | in scope | single-field value list, 1 OR term, author/editor idiom |
| C3.36 | `author = PERSON_1 or (type any "bookEditor issueEditor" and editor = PERSON_1) or author = PERSON_1` | 2 | A+B | in scope | single-field value list, 2-4 OR terms, author/editor idiom |
| C3.37 | `(author exact PERSON_1) or (author exact PERSON_1) or (author exact PERSON_1)` | 1 | A+B | in scope | single-field value list, 2-4 OR terms |
| C3.38 | `title = TEXT AND language any "eng"` | 1 | A+B | in scope | composite, 1 OR term |
| C3.39 | `author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1) AND type exact journalArticle` | 1 | A+B | in scope | single-field value list, 1 OR term, author/editor idiom |
| C3.40 | `author exact PERSON_1 AND type any "journalArticle" AND affiliation any "ORG_1"` | 1 | A+B | in scope | composite, 1 OR term |
| C3.41 | `basic = TEXT AND affiliation any "ORG_1"` | 1 | A+B | in scope | composite, 1 OR term |
| C3.42 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) AND accesslevel all "open"` | 1 | A+B | in scope | composite, 1 OR term |
| C3.43 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) and file.access <> open AND field <> FIELD_1 AND classification any "A1" AND publication_status exact published and external exact 0` | 1 | A+B | in scope | composite, 1 OR term |
| C3.44 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) and external exact 0 and file.access exact open and embargo exact 0` | 1 | A+B | in scope | composite, 1 OR term |
| C3.45 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) and external exact 0 and file.access exact open and embargo exact 0 AND classification any "A1" AND publication_status exact published` | 1 | A+B | in scope | composite, 1 OR term |
| C3.46 | `author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1) AND file.access exact restricted and file.access <> open and external exact 0` | 1 | A+B | in scope | composite, 1 OR term |
| C3.47 | `(author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)) AND vabb_approved exact 1` | 1 | A+B | in scope | composite, 1 OR term |
| C3.48 | `title = TEXT` | 1 | A+B | in scope | single-field value list, 1 OR term |
| C3.49 | `author = PERSON_1 AND year >= 2020 AND type any "journalArticle" AND classification any "A1" AND affiliation any "ORG_1" AND publicationstatus any "published"` | 1 | A+B | in scope | composite, 1 OR term |
| C3.50 | `basic = TEXT AND year >= 2020 AND type any "journalArticle" AND publicationstatus any "published" AND articletype any "original"` | 1 | A+B | in scope | composite, 1 OR term |
| C3.51 | `(basic = TEXT or … or basic = TEXT  (3 terms)) AND author = PERSON_1` | 1 | A+B | in scope | needs `contains any of` on a text row — field contract open question 4 |
| C3.52 | `basic = TEXT` | 1 | A+B | in scope | single-field value list, 1 OR term |
| C3.53 | `title any "TEXT" and (author any "PERSON_1" or type exact journalArticle)` | 1 | A+B | in scope | composite, 1 OR term |
| C3.54 | `publisher = PUBLISHER_1 or … or publisher = PUBLISHER_1  (3 terms)` | 1 | A+B | in scope | single-field value list, 2-4 OR terms |
| C3.55 | `(type exact journalArticle) OR (type exact journalArticle)` | 1 | A+B | in scope | single-field value list, 1 OR term |

## C4 — ranges — 7 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C4.01 | `year >= 2015` | 132 | A+B | in scope |  |
| C4.02 | `year >= 2015 AND year <= 2020` | 54 | A+B | in scope |  |
| C4.03 | `year <= 2020` | 25 | A+B | in scope |  |
| C4.04 | `year > 2015` | 25 | A+B | in scope |  |
| C4.05 | `year < 2020` | 17 | A+B | in scope |  |
| C4.06 | `datecreated >= 2024` | 10 | A+B | in scope |  |
| C4.07 | `datecreated <= 2024` | 9 | A+B | in scope |  |

## C5 — complexity stress — 3 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C5.01 | `id any "ID_1 … _763"` | 1 | A+B | in scope | 763 values / 9,336 chars — the URL ceiling case |
| C5.02 | `author exact PERSON_1 OR … OR author exact PERSON_85` | 1 | A+B | in scope | longhand chain must collapse into one list row |
| C5.03 | `author = PERSON_1 AND year >= 2015 AND classification any "A1" AND external exact 0` | 57 | A+B | in scope | most common multi-condition shape |

## C6 — machine contract (the head of machine traffic, 99.5% of 72.9M hits) — 24 cases

One case per query structure. A structure replayed on more than one tier is one case, because the
tier it arrived on does not change how it translates. `observed` is the total; the note keeps each
tier's own hits and share. [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md) ranks the same
traffic per tier, so its percentages are smaller for the same query.

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C6.01 | `author = PERSON_1 or (type any "bookEditor issueEditor" and editor = PERSON_1)` | 21,671,399 | B | translator-only | expert/direct 19,068,041 (26.16%) + expert/link 2,603,358 (3.57%) |
| C6.02 | `keyword exact KEYWORD_1` | 12,807,940 | B | translator-only | advanced/direct 11,018,548 (15.11%) + advanced/link 1,789,392 (2.45%) |
| C6.03 | `author exact PERSON_1 AND author exact PERSON_1` | 11,582,070 | B | translator-only | advanced/direct 10,212,663 (14.01%) + advanced/link 1,369,407 (1.88%) |
| C6.04 | `author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1) AND keyword exact KEYWORD_1` | 10,274,666 | B | translator-only | expert/direct 9,270,238 (12.72%) + expert/link 1,004,428 (1.38%) |
| C6.05 | `parent exact JOURNAL_1` | 5,377,886 | B | translator-only | advanced/direct 4,622,655 (6.34%) + advanced/link 755,231 (1.04%) |
| C6.06 | `author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1)` | 1,938,853 | B | translator-only | expert/direct 1,792,382 (2.46%) + expert/link 146,471 (0.20%) |
| C6.07 | `author = PERSON_1 or (type exact bookEditor and editor = PERSON_1)` | 1,877,999 | B | translator-only | expert/direct 1,877,999 (2.58%) |
| C6.08 | `author exact PERSON_1 or (type any "bookEditor issueEditor" and editor exact PERSON_1) AND subject exact KEYWORD_1` | 1,736,585 | B | translator-only | expert/direct 1,533,438 (2.10%) + expert/link 203,147 (0.28%) |
| C6.09 | `author exact PERSON_1` | 1,735,775 | B | translator-only | advanced/direct 1,469,259 (2.02%) + advanced/link 266,516 (0.37%) |
| C6.10 | `issn exact ISSN_1` | 1,267,055 | B | translator-only | advanced/direct 1,093,618 (1.50%) + advanced/link 173,437 (0.24%) |
| C6.11 | `keyword exact KEYWORD_1 AND author exact PERSON_1 or (type exact bookEditor and editor exact PERSON_1)` | 627,749 | B | translator-only | expert/direct 627,749 (0.86%) |
| C6.12 | `publisher exact PUBLISHER_1` | 518,292 | B | translator-only | advanced/direct 432,610 (0.59%) + advanced/link 85,682 (0.12%) |
| C6.13 | `affiliation exact ORG_1 AND author exact PERSON_1` | 469,725 | B | translator-only | advanced/direct 411,602 (0.56%) + advanced/link 58,123 (0.08%) |
| C6.14 | `project.id exact PROJECT_1` | 121,734 | B | translator-only | advanced/direct 121,734 (0.17%) |
| C6.15 | `classification exact A1 AND promoter exact PERSON_1` | 116,953 | B | translator-only | advanced/direct 99,343 (0.14%) + advanced/link 17,610 (0.02%) |
| C6.16 | `PERSON_1` | 101,864 | B | translator-only | advanced/direct 101,864 (0.14%) |
| C6.17 | `subject exact KEYWORD_1 AND author exact PERSON_1 or (type exact bookEditor and editor exact PERSON_1)` | 95,933 | B | translator-only | expert/direct 95,933 (0.13%) |
| C6.18 | `author exact PERSON_1 or (type exact bookEditor and editor exact PERSON_1)` | 56,119 | B | translator-only | expert/direct 56,119 (0.08%) |
| C6.19 | `PERSON_1 AND PERSON_1` | 38,393 | B | translator-only | advanced/direct 38,393 (0.05%) |
| C6.20 | `affiliation exact ORG_1` | 37,245 | B | translator-only | advanced/direct 37,245 (0.05%) |
| C6.21 | `jcr.category exact CATEGORY_1` | 31,501 | B | translator-only | advanced/direct 31,501 (0.04%) |
| C6.22 | `year exact 2020` | 27,665 | B | translator-only | advanced/direct 27,665 (0.04%) |
| C6.23 | `promoter exact PERSON_1` | 23,465 | B | translator-only | advanced/direct 23,465 (0.03%) |
| C6.24 | `author = PERSON_1` | 12,932 | B | translator-only | advanced/direct 12,932 (0.02%) |

## C7 — degenerate and hostile input — 6 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C7.01 | `(bare text submitted to a power form)` | 85 | B | must not crash | no parseable condition |
| C7.02 | `file.access <>` | 18 | B | must not crash | empty right-hand side |
| C7.03 | `subject <>` | 9 | B | must not crash | empty right-hand side |
| C7.04 | `author = PERSON_1 AND author = PERSON_2` | 22 | B | must not crash | duplicate field, AND-joined |
| C7.05 | `for all "TEXT"` | 1 | B | must not crash | stray token parsed as a field name |
| C7.06 | `<meta http-equiv=… / alert(…)` | 2 | B | must not crash | hostile input observed in the log |

## C8 — legacy embed parameters — 2 cases

| case | query | observed | subset | scope | note |
|---|---|---:|---|---|---|
| C8.01 | `author any "PERSON_1 PERSON_2" ;hide_info=1` | 1,411 | B | in scope | count from a 34% sample of the log |
| C8.02 | `author = PERSON_1 or author = PERSON_2 ;style=apa` | 583 | B | in scope | citation style — distinct from the sort choice |

