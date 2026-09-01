# Product bet — one query builder for power search

*Evidence: [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md) · Field
contract: [`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md)*

## Problem

Advanced search omits fields, operators and combinations. Expert search supports
them but requires query language. One visual builder should replace both without
removing any accepted legacy query or breaking its URL.

The public builder serves:

- Wim Webb (researcher with a site), who embeds group output;
- Ans Rapport (faculty communications officer), who builds faculty sets and checks
  their count;
- Quinn Query (external analyst), who pastes identifiers and exports results;
- Cody Crawley (machine reader), who follows the addresses they publish.

The backoffice can reuse the pattern with its own field set for Marie Curator
(bibliographic reviewer) and Rhea View (review coordinator).

Humans author about 19 power queries a day. Power search represents 2.1% of human
searches, while its URLs carry 63% of Biblio traffic in the 2026-H1 evidence.

## Solution

The builder opens over the results. Each condition is a plain-language field,
operator and value. Rows join with AND; groups express OR across fields. The selected
field sets the operators and input. An approximate count helps people refine the set.

Phase 1 replaces both tiers in one release. Shipping without OR groups would support
less than Expert search does today.

**Phase 1 — first useful release**

- condition rows for the public field contract;
- multi-value paste and OR groups;
- entity pickers for people, organizations and projects;
- year ranges and negation;
- approximate count;
- Share as Link, Embed, API or Feed;
- Save search for signed-in people;
- measurements required by the success criteria.

Everything except Save search remains anonymous. More complex query authoring stays
with the API.

## Rabbit holes

- Existing embeds depend on the citation-style and info-block parameters.
- Durable addresses must preserve OR, negation and observed identifier batches of up
  to 763 values.
- Request classification must remain comparable with the current form, link, direct
  and bot baseline.
- The legacy translator is a separate development workstream.

## No-gos

- Simple search and results-list redesign
- Curator analysis, cross-tabs or bulk operations
- A new query language or URL grammar defined in the prototype
- Mass-user features; people enter power search deliberately

## How we know it works

1. Every golden-set subset B case passes. Every subset A case is authorable or has an
   accepted exception.
2. Power search keeps its 2.1% share of human searches, compared year over year on
   matching academic periods.

Copies and saves are diagnostic, not success measures; checking the count without
copying can still be success.

## The ask

**Go or no-go on phase 1.** What is wrong or impossible?

## Open questions

**Blockers**

1. Can Raven give every supported query a durable public address, including OR,
   negation and long batches? Raven may answer that a supported shape is impossible.
2. Does the public and backoffice field selection in the field contract stand?

**Later**

1. Interviews must identify what the current tiers do well; logs show actions, not
   unmet needs.
2. Should future bets add builders for people, organizations or projects? Current
   power-search evidence covers research output only.
