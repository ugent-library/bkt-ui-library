# Report — golden query set extraction

*Full pass over the frontend query log (2025-12-31 → 2026-07-09, 101,940,897 lines, 15.7 GB), 2026-08-04. Feeds `QUERY-BUILDER-GOLDEN-SET.md` (208 draft cases) and `QUERY-BUILDER-DESIGN.md` § Golden query set. Same privacy rules as the earlier reports: aggregates and structures only, no names, no raw queries, no session ids.*

## The one paragraph

The acceptance set is buildable and small. The **human** side is 3,589 authored queries using **40 distinct fields** and 9 operators, of which one — `<>` "is not" — was previously miscounted as a range. The **machine** side is 72.9M replays whose entire contract fits in **25 query structures (98.9% of hits)**. Two things the earlier report could not see change design decisions: real batch sizes go up to **763 values / 9,336 characters**, which no query-string permalink can carry; and the fields humans never authored are almost all fields the old UI never offered — `doi` is authored 644× in expert search and **1×** in advanced, which is defection, not disinterest.

## Method

| step | what |
|---|---|
| human queries | all `[advanced/form]` + `[expert/form]` lines extracted in full: 3,589 (3,107 + 482) — counts match `QUERY-BUILDER-EVIDENCE.md`, so coverage is complete |
| machine queries | all `[advanced|expert]/[direct|link]` lines, **72,901,450** (expert/direct 34,419,052 · advanced/direct 29,964,857 · advanced/link 4,558,518 · expert/link 3,959,023 — matches the earlier report's tier totals) |
| counting | values normalized in-stream (quoted strings and any token containing a digit → `v`), then exact counts per masked structure. 11,925 distinct machine structures. No sampling |
| embed parameters | 5.4 GB sample (34% of the log), 1,998 matching lines — the only sampled number in this report |
| runtime | parallel byte-range chunks, 8 × 500 MB per call ≈ 250 MB/s aggregate. Background jobs are killed between calls; a single foreground pass exceeds the tool timeout. Documented in `PROMPT-golden-query-extraction.md` |

**Caveat on "distinct structures":** structures are values-normalized, so 11,925 is not a count of distinct URLs. The head-coverage claim below is about query *shapes*, which is what the translator has to implement — not about how many distinct permalinks exist (that is 51% of direct traffic, per the main report).

## Corrections to `QUERY-BUILDER-EVIDENCE.md`

1. **`<>` is "is not", not a range.** 178 queries (5.0%) use it: `file.access` 82+2, `classification <> A1` 50, `affiliation` 61 across values, `type` 17, `field` 10, `subject` 9, `vabb_approved` 8, `year` 1. The earlier pass matched `veld (=|<|>|exact|any|all)` and counted these among its "195 range queries". True ranges: **`year`** (132 `>=`, 25 `<=`, 25 `>`, 17 `<`) and **`datecreated`** (10 `>=`, 9 `<=`); 54 queries are two-sided.
2. **~16 fields → 40 fields.** The published lists were top-15. The tail is real: `language` 57, `articletype` 44, `publisher` 34, `keyword` 32, `embargo` 32, `subject` 30, `vabb_approved` 29, `misctype` 29, `editor` 27, `datecreated` 19, `accesslevel` 15, `conferencetype` 10, plus one-offs and three parse artifacts (`for`, `of`, `field`).
3. **"Max 10 conditions" is the advanced-form maximum, not the ceiling.** Condition counts: 1 → 2,046, 2 → 838, 3 → 215 (86% at three or fewer), then a tail to **85 terms**. The tail is not complex boolean logic: it is longhand `author exact X OR author exact Y OR …` because no list input exists.
4. **Batch sizes are much larger than "100+".** `id`: n=235, median 18, **max 763**, 58 queries ≥50 values. `identifier` max 200, `project` max 189, `author` max 99, `affiliation` max 41. Query length: p50 41 chars, p90 168, p95 425, p99 1,923, **max 9,336**; 34 queries above 2,000 characters.

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

| top N structures | share of 72.9M hits |
|---:|---:|
| 10 | 87.5% |
| 25 | 98.9% |
| 50 | 99.7% |
| 100 | 99.9% |

Hit-weighted field usage: `author` 64.1M · `type` 38.5M · `editor` 38.5M · `keyword` 23.7M · `parent` 5.4M · `subject` 1.85M · `issn` 1.27M · `affiliation` 645K · `publisher` 518K · `classification` 172K · `promoter` 149K · `project.id` 133K · `year` 43K · `jcr.category` 34K · `external` 18K.

Three fields appear in machine traffic and **never** in an authored query: `issn` (1.27M hits), `promoter` (149K), `jcr.category` (34K). That is the entire "machine-only" list — and for the first two, the reason they were never authored is that no UI offered them (see the exposure list below).

The four biggest single structures:

| hits | share | structure |
|---:|---:|---|
| 19.1M | 26.2% | the author/editor idiom (`author=X or (type any "bookEditor issueEditor" and editor=X)`) |
| 11.0M | 15.1% | `keyword exact V` — the subject permalink |
| 10.2M | 14.0% | `author exact X AND author exact Y` — the co-author permalink |
| 9.3M | 12.7% | author/editor idiom **AND** `keyword exact V` |

The co-author permalink is worth naming: two person conditions, AND-joined, 10.2M replays. The builder's person rows cover it, but the *URL grammar* has to keep expressing two same-field conditions distinctly — a single "any of" list would silently change the meaning from AND to OR.

## Legacy embed parameters

Exactly two exist in the wild, both attached to author-scoped queries: **`;hide_info=1`** (1,411 in the sample) and **`;style=apa`** (583). `style=apa` is a **citation style**, not a sort order — the embed tab in the design has a sort choice but no style choice, and this parameter must keep working. That is a design gap the bet's rabbit hole 2 only hinted at.

## Also observed

- **Degenerate input:** 85 queries with no parseable condition (bare text submitted to a power form), empty right-hand sides (`file.access <>` 18, `subject <>` 9), duplicate AND-joined conditions on the same field (22).
- **Hostile input:** injected HTML/JS appears in the log (`<meta http-equiv=…`, `alert(…)`). The parser must fail closed, and the golden set has a case for it.
- **717 distinct human query structures** after value normalization — which is why the set covers frequent structures plus extremes (208 cases), not everything. Stated, not hidden.

## Per-field exposure list (for M to walk)

| field | authored by humans? | machine hits | recommendation |
|---|---|---:|---|
| `issn` | never | 1.27M | **expose** — journal-scoped lists are a bibliographer's core task; never offered, so never authored |
| `promoter` | never | 149K | **expose as a contributor role**, not a field — it disappears into the person condition ("as supervisor") |
| `keyword` / `subject` | 32 / 30 | 23.7M / 1.85M | expose — the single biggest machine field is a human-meaningful one |
| `publisher` | 34 | 518K | expose |
| `doi` | 645 | — | expose, with paste-a-list |
| `external` | 257 | 18K | expose — external research output is already public on biblio and researchers record it themselves; needs a plain-language label |
| `jcr.category` | never | 34K | expose if raven carries the field — journal metrics are in active use, so "never authored" is again a UI artifact |
| `jcr.impact_factor` | 1 | — | **backoffice** (2026-08-18) — the backoffice reuses the builder with more fields; the public page drops it |
| `field`, `for`, `of` | parse artifacts | — | translator must not crash; not builder fields |

## What this log cannot answer

- **Intent and outcome.** No result counts are logged, so zero-result queries are invisible — this is exactly what non-negotiable 3 in the design doc buys.
- **Whether an authored query satisfied the author.** Only that it was submitted.
- **Which distinct permalinks matter most.** We counted shapes, not URLs (deliberately: privacy and memory). Ranking literal URLs needs a separate pass with a retention rule.
- **URL-level context.** The log carries the query, not the full request URL, so embed parameters only surface where they were glued into the query string. Fuller embed evidence needs webserver access logs.
- **Anything about people.** By construction.
