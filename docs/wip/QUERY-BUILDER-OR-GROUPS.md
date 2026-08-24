# OR rule groups

Design companion to the [query builder bet](QUERY-BUILDER-BET.md). Cases come from the
[golden set](QUERY-BUILDER-GOLDEN-SET.md); the interaction appears in the `builder-or-group`
state of `templates/partials/search-advanced-conditions.html`.

## Decision

The builder is AND-first. Top-level rows must all match. Any row can become an **any of these
conditions** group, one level deep.

- **Add an 'or'** converts a row in place, preserves its value as the first alternative and
  opens the field chooser for the second.
- A bordered `<fieldset>` and legend group the alternatives. Screen-reader labels identify
  the alternative and the target of each remove action.
- **Add an alternative** appends one condition. Alternatives cannot contain another group.
- **Split into 'and' rows** returns the alternatives to the top level.
- Removing an alternative leaves the other values intact. A group with one alternative
  collapses to a plain row; removing the final top-level row restores the blank state.
- A row's **is any of** joins values of one field. A group joins separate conditions. The UI
  uses those labels consistently.

Shared conditions stay outside the group. This avoids repeating them in each branch and keeps
the URL model shallow.

## Evidence

Four observed signatures require a condition group:

| case | shape | observed |
|---|---|---:|
| C3.09 | `(parent OR publisher) AND year` | 5 |
| C3.53 | `title AND (author any OR type exact)` | 1 |
| C3.28 | range, negation and an alternative | 2 |
| C3.51 | three text phrases OR'd, then narrowed by author | 1 |

The remaining C3 cases do not require this feature:

- Multiple values for one closed-vocabulary field use **is any of**. Imported author chains
  must return as one list row, not dozens of conditions.
- The legacy author/editor idiom becomes one contributor condition through Raven's unified
  contributors list.
- Plain conjunctions remain top-level rows.

Text fields take one phrase per row. Two alternative phrases therefore become two conditions
in a group. Closed-vocabulary fields retain **is any of** because multi-value queries are
common there.

The only observed nested shape is the author/editor idiom, which the contributor condition
absorbs. Revisit the one-level limit if request logs reveal another AND-inside-OR shape.
Repeated **is not** rows cover a negated value list; add **is none of** only if demand warrants
the shorthand.

## Raven contract

Raven must provide durable URL serialization for AND rows, field-independent OR groups and
negation in one grammar. The release gate is an unchanged URL → builder state → URL round trip.
C3.28's legacy syntax has two possible meanings; resolving imported ambiguity belongs to the
translator, not the builder.

Counting uses the same query model. Per-condition evaluation remains a QA tool rather than a
public feature.

## Coverage

Subset A of the golden set is covered as follows:

- Public: all C1 cases on the 21 public fields, C2 paste batches, the public year ranges, C5
  stress cases, C8 embed parameters and the four grouped C3 signatures.
- Backoffice or not exposed: classification, date created, impact factor and journal category,
  subject to the [field contract](QUERY-BUILDER-FIELD-CONTRACT.md).
- Translator-only: the legacy parse artifacts `field`, `for` and `of`.
- Backoffice widgets: numeric comparison for impact factor. Boolean legacy values map to named
  Affiliation or Classification choices, so they do not need a generic boolean widget.
