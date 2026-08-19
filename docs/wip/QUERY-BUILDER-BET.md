# Product bet — one query builder for the power tier

## The bet

One visual query builder replaces Advanced and Expert search. Every query anyone authored on the old tiers stays expressible, on the fields each surface offers, and every URL they ever produced keeps working.

## Problem

Advanced search does not offer every field, operator or combination. Expert search offers everything, but requires knowing the query language.

On the public site the builder serves the people who build a set out of the bibliography, plus the machines that read what those people publish ([`RESEARCH-PERSONAS.md`](../RESEARCH-PERSONAS.md)):

- Wim Webb (researcher with a site of his own) embeds his group's output elsewhere. `;style=apa` and `;hide_info=1` are his use.
- Ans Rapport (faculty communications officer) embeds organization + year + type on a faculty page, and checks the count.
- Quinn Query (analyst outside the application) pastes an identifier batch and exports a file.
- Cody Crawley (machine reader) consumes the addresses the other three produce.

The backoffice reuses the builder with more fields exposed, for Marie Curator (bibliographic reviewer) and Rhea View (review coordinator).

> Humans author ~19 power queries a day. Their URLs carry 63% of Biblio traffic. The power tiers are 2.1% of human searches (2026-H1). Evidence: [`EVIDENCE`](QUERY-BUILDER-EVIDENCE.md).

## Appetite

To be set by the team. One release: the builder replaces both tiers or neither, because a release without OR rule groups expresses less than expert search does today.

## Capability

**A user expresses a power query without writing query language, and hands the result on as a URL, an embed or an API call.**

Advanced search replaces both tiers with one dialog over the results list, at one address, built from two partials. A condition is a row — field, operator and value in plain language — and the field's type decides the operators and the widget. Top-level rows AND-join, so two person rows are the co-author query. Detail: [`FIELD-CONTRACT`](QUERY-BUILDER-FIELD-CONTRACT.md) for fields and operators, [`OR-GROUPS`](QUERY-BUILDER-OR-GROUPS.md) for the group, `patterns/query-builder.html` for the drawn layout. More complex searches are deferred to API access.

The release:

- condition rows, including free text and `is not`
- `is any of` with paste support, and OR rule groups for alternatives across fields
- person rows that name the role they count, several AND-joined for the co-contributor query
- year range (covers most other year cases)
- approximate count on the submit (TBC)
- Share: Link, Embed, API, Feed; embed with sort, citation style and info-block toggle
- Save this search for logged-in users; everything else anonymous
- the measurement the success measures need ([`MEASUREMENT`](QUERY-BUILDER-MEASUREMENT.md))

## Constraints

Existing embeds, queries and saved searches keep working. The power-tier share of human searches stays level with the 2.1% baseline.

## Risks

1. Request logging must reproduce the legacy method taxonomy (form / link / direct / bot), or the baseline comparison breaks silently. Answered before the release ships, since it sets the baseline.
2. `;hide_info=1` and `;style=apa` must survive.
3. The legacy translator is a separate workstream, defined by the development team.

## No-gos

- The simple search box and the results page.
- Curator analysis: workflow status, cross-tabs and bulk operations stay in the backoffice.
- A new query language, or a URL grammar invented in the prototype.
- Mass-user features. This page is reached deliberately.

## How we know it works

1. **The golden query set passes** — 100% of subset B, every subset A case authorable or signed off as not exposed. No such gate exists today. A gate before launch, not a dashboard: [`GOLDEN-SET`](QUERY-BUILDER-GOLDEN-SET.md), 194 cases.
2. **The power-tier share of human searches holds** — baseline 2.1% (2026-H1), year over year on matching academic periods. No growth target: there is no basis for one.

Copies and saves are measured and not scored: a session that only reads the count succeeds with zero copies.

## The ask

Go or no-go. Then say what is wrong or impossible in the capability, and whether it stands as one release.

## Open questions

Blocking the release:

1. **Does the public URL grammar need to change, and how far?** raven's internal `QueryFilter` expresses AND rows, OR groups, negation and ranges. The public works URL carries less: a year range, plus one OR group that combines a list of years with a range. No public param has carried a negation, and `is not` has 178 authored queries behind it. raven settles three things:

   - whether an OR group can hold any field, not only the year
   - what a negated condition looks like in a URL
   - how long a URL may be, when real batches reach 763 identifiers and 9,336 characters

   The grammar is written once and can never change, so we ask as soon as the prototype exists, while the model can still change cheaply. The answer can be "impossible".
2. **Field selection** — twenty-one public fields and the backoffice set: [`FIELD-CONTRACT`](QUERY-BUILDER-FIELD-CONTRACT.md).

Later:

3. **What do the current tiers do well?** The log shows what people did, not what they failed to do. Answering it needs users.
4. **Does Advanced search ever query the people, organization or project catalogs?** The old tiers offered nothing else, so the log shows no demand either way, and each catalog would need its own field list and result page. Keep it on research output, extend it on evidenced demand, or make it a bet of its own.
