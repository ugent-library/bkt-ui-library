# Product bet — a smaller Advanced search query builder

*V1 scope proposal · Boundary: [DD-006](../decisions/DD-006-query-builder-v1-replaces-power-search.md) ·
Standard search: [DD-008](../decisions/DD-008-public-search-and-builder-separate-design-scopes.md) ·
Evidence: [query log](QUERY-BUILDER-EVIDENCE.md)*

## Problem

People who build a public research set need to define, check and reuse it without query
syntax. Today they choose between an Advanced form that lacks useful fields and an Expert
form that needs query language.

Clause totals in the query log overstate demand. The 645 DOI clauses come from 19 submissions in 5 sessions. Person or organization combined with year
or type appears in 461 submissions across 190 sessions. Old links are replayed heavily,
which argues for keeping them working, not for building more authoring.

## Solution

One builder replaces the Advanced and Expert screens. It opens in the
[accepted dialog](../decisions/DD-001-advanced-search-dialog.md) and leaves through
**Show results**; the results page shows the count. Old links and embeds keep their
meaning. When an old link holds a query V1 cannot edit, the builder says so, and starting
a new search is a deliberate step.

V1 serves these tasks:

| Task | Why the builder |
|---|---|
| Work by a person or organization, in a period, of a type | Combines several filters into one set; arrives from an entity page with the scope filled in |
| Recent, openly available work on a topic | Live use shows whether people revise this set in the builder or with filters |
| Work co-authored by two people | Two Person rows mean both people; the filter means either |
| Words in the title, or a named journal or host | General search can't limit text to one field |

The tasks need two kinds of fields:

| Fields | Why |
|---|---|
| Person, Organization, Project, Keywords, Identifier, Access, Type, Year, Language | Every ordinary public filter. A filter set in search must reappear in the builder as an editable row |
| Title, Appeared in, a role on Person | Tasks filters cannot do: words in the title, a named journal or host, author versus editor |

Rows offer only **is** and **is not**, plus **is between** on Year. Several values in one
row match any of them; no separate *is any of* appears. Field designs are in the
[field contract](QUERY-BUILDER-FIELD-CONTRACT.md).

**Open full text or dataset** means Biblio offers the content for download or the record
links to where it is stored. A metadata record alone does not count.

**Later:** the backoffice V1 (#295) for pasted ID batches, Classification and curator
review sets; more public fields when live use asks for them. Saved searches and sharing formats are separate
parity work.

## No-gos

- No live count, OR groups or spelling suggestions. The prototype keeps them, marked as
  outside V1.
- No query language.
- No separate has-file condition, because it would hide content stored elsewhere.

## How we know it works

V1 goes live, and live use is the test. Before launch, the legacy cases in
[golden set](QUERY-BUILDER-GOLDEN-SET.md) subset B pass. The baseline is about 19 authored
queries a day. Compare each month with the same month a year earlier, because use follows
the academic year.

After launch, look for three signals:

- builder queries end in a copied link, embed, export or saved search;
- empty result sets stay rare;
- use concentrates in the fields V1 offers;
- few people use **Missing a field? Tell us** in the builder, and no single field gets
  repeated requests.

Count authored queries separately from replayed links. Measure on the server, never
people: no cookies, user identifiers, third-party trackers or client-side tracking. Raven
#224 builds the measurement, and it ships with V1. Session IDs and query text
are personal data, so aggregation and retention need DPO review.

## The ask

Go or no-go on this V1 scope.

## Open questions

- **Where does V1 fail?** Set the limits before launch: the share of builder queries
  that find nothing, and the number of requests for one missing field.

Next: the prototype shows entry, return and an old link V1 cannot edit; then Raven
#223–#230 are rescoped.
