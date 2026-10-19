# Product bet — a smaller Advanced search query builder

*V1 scope proposal · Boundary: [DD-006](../decisions/DD-006-query-builder-v1-replaces-power-search.md) ·
Standard search: [DD-008](../decisions/DD-008-public-search-and-builder-separate-design-scopes.md) ·
Evidence: [query log](QUERY-BUILDER-EVIDENCE.md)*

## Problem

People building public research sets need to define, check and reuse them. Today's Advanced
form lacks useful fields; Expert requires query language.

Clause totals overstate demand: 645 DOI clauses come from 19 submissions in 5 sessions.
Person or organization with year or type appears in 461 submissions across 190 sessions.
Heavy link replay supports compatibility.

## Solution

One builder replaces the Advanced and Expert screens. It opens in the
[accepted dialog](../decisions/DD-001-advanced-search-dialog.md) and leaves through
**Show results**; the results page shows the count. Old links and embeds keep their
meaning. When an old link holds a query V1 cannot edit, the builder says so, and starting
a new search is a deliberate step.

V1 serves these tasks:

| Task | Why the builder |
|---|---|
| Work by a person or organization, in a period, of a type | Combines filters; preserves scope from entity pages |
| Recent, openly available work on a topic | Test whether people prefer revising this through filters or the builder |
| Work co-authored by two people | Two Person rows mean both people; the filter means either |
| Words in the title, or a named journal or host | General search can't limit text to one field |

| Fields | Why |
|---|---|
| Person, Organization, Project, Keywords, Identifier, Access, Type, Year, Language | Every ordinary public filter. A filter set in search must reappear in the builder as an editable row |
| Title, Appeared in, a role on Person | Tasks filters cannot do: words in the title, a named journal or host, author versus editor |

The [field contract](QUERY-BUILDER-FIELD-CONTRACT.md) specifies operators per field.
A public row takes at most five values, including Identifier.

**Open full text or dataset** means Biblio offers the content for download or the record
links to where it is stored. A metadata record alone does not count.

**Future directions:** additional fields, live counts, OR groups and spelling feedback
remain in labelled prototype states, separate from V1 and without release commitments.

**Backoffice:** assume its route for pasted ID batches and curator tasks will be
available when public V1 replaces the old screens, as directed by product. Its scope
belongs to #295; the prototype shows it on
[curate](../../templates/biblio-team/curate.html) and
[search-researcher](../../templates/biblio-researcher/search-researcher.html).

Saved searches and sharing formats are separate parity work.

## No-gos

- No live count, OR groups or spelling suggestions in V1.
- No query language.
- No separate has-file condition, because it would hide content stored elsewhere.

## How we know it works

People can build the set they need, understand what it includes and reuse it.
Live use shows where V1 prevents a necessary task.

Test plan: TBD, in a separate document later.

Existing links keep their meaning; the [golden set](QUERY-BUILDER-GOLDEN-SET.md)
subset B must pass before launch. Measurement ships with V1 (Raven #224).
