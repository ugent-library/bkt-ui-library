# Product bet — one query builder for the power tier

*Draft for the raven team · Evidence: [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md), [`QUERY-BUILDER-GOLDEN-SET-METHOD.md`](QUERY-BUILDER-GOLDEN-SET-METHOD.md) · Design detail: [`QUERY-BUILDER-DESIGN.md`](QUERY-BUILDER-DESIGN.md)*

## The bet

**We believe one visual query builder can replace both Advanced search and Expert search without reducing what power users rely on** — every query the old tiers could express stays expressible, and every URL they ever produced keeps working.

## Problem

Advanced and expert search are two separately maintained UIs that fail the same audience differently: advanced search does not offer every field, operator or combination; expert search offers everything but you must already know the query language.

That audience is our documented personas (`docs/RESEARCH-PERSONAS.md`), and the fit is exact: **Marie Curator** (reviewer) lives in filters, asks for year ranges and combined search, and *shares her filters as bookmarked URLs* — she is why the permalink is the product. **Paula Proksy** (proxy) registers for a whole institute from WoS/EndNote lists: the paste-a-batch user. **Rhea View** (review coordinator) needs overview per record type per department to divide work: the saved search. **Claire Searcher** (researcher) wants one master list of everything under her name: the embed and export tabs. **Cody Crawley**, the machine reader, consumes the API contract. Few, and load-bearing: not replacing this surface is not an option.

> **Evidence, in three numbers.** Humans author ~19 power queries a day. Those queries produce the URLs that carry **63%** of all Biblio traffic. The power tiers are **2.1%** of human searches (2026-H1). The rest is in the two reports.

## Appetite

*[To be set by the team.]* Phase 1 is the bet: it ships and is evaluated before phase 2 or 3 is committed.

## Capability

**A user can express every common power query without writing query language, and hand the result to someone else as a URL, an embed or an API call.**

One page, **Advanced search**, replacing both tiers. It always shows the builder, the query in readable form, the URL, the live count and Save this search. Conditions are rows — field + operator + value in plain language, where the field's type drives the operators and the widget. Free text is an ordinary row. Any list-capable field takes a pasted batch. A person condition matches any contributor role, optionally narrowed, and several person rows can be AND-joined — the co-author query.

**Definition of done for the first live release** — the smallest useful release, plus parity with what the old tiers already did:

- condition rows for works, including the free-text row and "is not" (TODO)
- "is any of" with paste support
- person conditions across roles, several AND-joined, kept distinct from a value list
- year range
- live result count and readable query preview
- URL / Embed / API tabs; embed with sort, citation style and info-block toggle
- Save this search (login); everything else works anonymously
- the measurement the success measures need (design doc)

**Phase 2** completes expression parity: OR rule groups, AND-first. **Phase 3** opens new territory: record type as first choice — people, organizations, projects.

## Constraints

- 100% of existing embeds and queries keep working.
- The power-tier share of human searches stays at least level against the 2.1% baseline.

## Risks and open design decisions

1. **The URL grammar is a permalink contract, and it may block phase 1.** Raven's `QueryFilter` already expresses everything here; the public URL params do not — no OR-group, NOT or range serialization. Whatever grammar raven designs is authored once and can never change. It also has to answer for length: real batches run to hundreds of identifiers, past what a query string carries, so the contract needs a second form (saved search, a server-side list id, or a documented ceiling). **This is the one question in the whole track whose answer can be "impossible", so it gets asked as soon as the prototype exists** — the prototype shows raven what the URL must carry, and changing model is still free at that point. Waiting until implementation issues are written is the most expensive moment to find out.
2. **Legacy embed parameters must survive:** `;hide_info=1` and `;style=apa`. The second is a citation style, which is why the embed tab carries one.
3. **Measurement continuity.** Raven's request logging must reproduce the legacy method taxonomy (form / link / direct / bot), or the baseline comparison silently breaks.
4. **The legacy translator is a separate workstream**, with a ready-made requirements list: subset B of the golden query set. It does not gate the builder's design; it does gate launch.

## No-gos

- No changes to the simple search box or results page (owned by `PLAN-search-query-state.md`).
- No curator analysis features — workflow status, cross-tabs, bulk operations stay backoffice/BI.
- No new query language, no URL grammar invented in the prototype.
- No mass-user features: this page is reached deliberately.

## How we know it works

Two measures, no more:

1. **The golden query set passes.** Baseline: no such gate exists today. Threshold: 100% of subset B (what the translator must translate) and every subset A case either authorable in the builder or explicitly signed off as phase 2 / not-exposed. Cases come from the real logged queries — every field, operator, OR shape, paste batch and range humans used, plus the machine structures carrying 98.9% of replayed traffic. A test gate before launch, not a dashboard; it is how "100% keeps working" gets verified. Draft: [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md), 208 cases.
2. **Power-tier share of human searches.** Baseline: 2.1% of human searches (~19/day, 2026-H1). Threshold: not lower, year-over-year on matching academic periods. A slow trend at this volume, never a weekly number — and no growth target, because we have no basis for one.

Copy and save are measured but are not success measures: a session that only checks the live count is a success with zero copies, and manual URL selection is invisible.

## The ask

**Go / no-go on phase 1.** Then: read the capability as the goal and tell us what is wrong or impossible, and whether the definition of done can stand for the first live release. Timing and approach are yours.

## Open questions

**Blockers for phase 1:**

1. **Field selection** against raven's field registry — the rule is: any field raven exposes publicly, the builder offers. Without the mapping the condition rows have no vocabulary. Mapping in the design doc.
2. **Query-length ceiling** — see risk 1; a decision is needed before the builder can promise Paula's paste batches.

**Later:**

3. Verify with users what the current tiers do well and what they don't — the log shows what people did, not what they failed to do.
