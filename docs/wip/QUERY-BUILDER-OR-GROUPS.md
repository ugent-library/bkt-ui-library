# OR rule groups

*How a condition row becomes an alternative, and which queries need it. Bet:
[`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md) · cases:
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) · drawn as the `advanced-group` state
of `templates/partials/search-advanced-conditions.html`, shared by the builder's two renderings —
`templates/biblio-public/public-search-advanced.html` (page) and the dialog in
`templates/biblio-public/public-works.html`.*

Scope: one feature. **OR rule groups** — AND-first: the top level stays AND-joined rows, a row
can be an "any of these" group, one level deep.

---

## 1. The interaction

**A row becomes a group in place.** Every condition row's ⋯ menu holds one action, **Add an
'or'**. Picking it keeps the row's field, operator and value as the first alternative, opens
the field chooser for the second, and wraps both in a bordered `<fieldset>` whose legend reads
**…where *any* of these conditions is true**. Nothing moves in the outer list: the group
occupies the row's slot, so a group and a plain row are interchangeable at the top level. One
level deep — an alternative is always a single condition, never another group.

The group's footer carries **Add an alternative** and **Split into 'and' rows**.

**The rows are the readback.** The legend scopes the alternatives without teaching operator
precedence; a visually-hidden **or** separates them for a listener, and the top level carries
no repeated **and** — the heading above the list states it once. A row's own "is any of" is OR
between *values* of one field; the group is OR between *conditions* — the word *conditions* in
the legend is what keeps the two offers apart. A shared condition is stated once at the top
level and never duplicated into the branches — the reason for AND-first.

**It collapses when one condition is left.** Removing alternatives until one remains turns the
group back into a plain row: the border, the legend and the "or" separator go, the surviving
condition keeps its field, operator and value, and the row keeps its slot. So a group is a
state of a row — there is no empty group to reason about and no way to leave one behind.

**Deleting.** An alternative's × removes that alternative (and collapses the group at one
left); **Split into 'and' rows** lifts the remaining alternatives back into the top-level list,
where each has to match, and removes the border — the label says so because the click turns "either
of these" into "both of these" and usually empties the set; a plain row's × removes the row.
Removing the last row of all restores the blank state — the same place a first visit starts.

**Keyboard and AT.** The `<fieldset>`'s legend announces the grouping, not just draws it. Each
control keeps its own label naming its alternative ("Field, alternative 2"), each action names
its target ("Remove alternative 2: publisher is Springer"), and a row inside a group hides its
⋯ menu — with remove promoted out, "Add an 'or'" is all it held.

---

## 2. Which golden cases this expresses

The group's job is the composite shapes in [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) § C3. Read
against the new data model, that list is much shorter than its labels suggest.

**Expressed by the group — the whole genuine demand, 4 signatures, ~9 observed occurrences:**

| case | shape | observed |
|---|---|---:|
| C3.09 | `(parent OR publisher) AND year` — two different fields, OR'd, narrowed by a third | 5 |
| C3.53 | `title AND (author any OR type exact)` — same shape, other fields | 1 |
| C3.28 | `datecreated range AND type <> A or B` — a negation and an alternative in one query | 2 |
| C3.51 | `(basic OR basic OR basic) AND author` — one text field, three phrases | 1 |

C3.28 is ambiguous in the legacy syntax (is it `type is not A` OR `type is B`, or `type is
neither A nor B`?). Both readings are expressible: the first as a group holding a negated
condition, the second as two AND-joined `is not` rows. Which one the legacy query *meant* is the
translator's problem (subset B), not the builder's.

**Deliberately not expressed by the group, because a single row already does it.** These carry
an unbuildable label in the draft set, an artifact of signature bucketing rather than a gap:

- **One field, many values** (C3.03, 04, 07, 08, 10–13, 15–19, 24–27, 29–31, 34, 37, 48, 52,
  54, 55, and the author chains in C3.01, 02, 05, 20, 21, 32, 33): `is any of` with paste. The
  longhand `author exact X OR author exact Y OR …` chains up to 85 terms exist *because* no list
  input existed; C5.02 makes the round-trip requirement explicit — a pasted or imported legacy
  chain must render as one list row, not 85 rows.
- **The author/editor idiom** (C3.06, 14, 23, 35, 36, 39, 42–47 — and 26% of all machine hits):
  `author exact X or (type any "bookEditor issueEditor" and editor exact X)` is one contributor
  condition, "contributor is X in any role". The idiom disappears into raven's unified
  contributors list.
- **Plain AND queries** (C3.22, 38, 40, 41, 49, 50): no OR at all.

Four signatures therefore need the group. Everything else in § C3 is a row doing its own job.

A text row takes one value. Two phrases on one text field are two conditions in a group, so
`contains any of` was dropped from the text rows: fifteen queries carry the shape, and "published in
Nature Communications, or in Nature Photonics" reads as two conditions. A closed-vocabulary row is
the opposite case. 22% of authored queries on those fields carry several values, so `is any of` stays
there, ticked in a list.

**Does any shape argue against AND-first?** One does, and it dissolves. The author/editor idiom
is an OR whose branch is itself an AND (`type any … and editor exact …`) — two levels deep,
which a one-level group cannot hold. It never needs to: the contributor condition absorbs it,
and it is the only observed shape of that shape. So AND-first holds on the evidence. The trigger
to revisit is a *new* shape that needs an AND inside a branch and is not a contributor query —
cheaper to revise the model now than after launch, so this is worth re-checking against the
first months of request logs, not treated as settled forever.

**Also missing, deliberately:** `is none of` (a negated value list). Repeated `is not` rows on
the same field say the same thing and cost one extra row. Add the shorthand if the request log
shows the shape often; it is an operator, not a redesign.

---

## 3. What the group needs from raven

**A group that any field can join, and a URL that carries it** (bet, open question 1). raven's
internal `QueryFilter` expresses a conjunction of clauses where a clause can be an OR group, a NOT or
a range, so the model holds all of it. The public works URL already carries one OR group: a year list
or a year range, hardcoded to the year dimension. So:

- **The group needs to leave that dimension.** Any field can become an alternative in the builder,
  and a query a reader cannot copy is a query a page about sharing cannot hold.
- **Negation needs a serialisation of its own.** No public param has ever carried a NOT, and `is not`
  has 178 authored queries behind it. raven designs AND rows, negation and groups in one pass,
  because the grammar can never change afterwards. That is one decision, which is why the group ships
  in the same release.
- **Round-trip is the gate**: URL → builder state → URL, unchanged. A group that serialises but does
  not parse back leaves the builder unable to open its own links.

Nothing else here is new backend work: the count runs on the query model the rows already need.

---

## 4. Per-condition evaluation — moved out of scope

Checking a built query against a known record, condition by condition, was drafted here as a user
feature. It is not one: the audience for that answer is us, verifying the builder against the
golden set, not a researcher building a list. It stays a QA tool. If support ever needs it for
curators, it belongs in the backoffice, not on public Advanced search.

---

## Coverage check — what the drawn layout cannot express

Run against subset A of [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) (the builder's contract;
subset B is raven's translator work).

**Buildable in the public drawing:** every C1 cell on the twenty-one public fields, every C2
paste batch, every C4 range on `year`, C5's stress cases, and C8's embed parameters (citation
style and info-block toggle, on the Share panel's Embed tab). C3 splits as §2 above: 4
signatures need the group, the rest are single rows.

**Waiting on the ledger, not on layout:** C1 cells on fields the ledger keeps off the public
surface — classification, date created, impact factor, journal category. Subset A
carries these as *backoffice* / *not exposed* with sign-off, per
[`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md). `datecreated` means C4's two
`datecreated` cases follow the backoffice Date row.

**Not buildable anywhere:** C1.52, C1.60, C1.78, C1.82 (`field`, `for`, `of`) — parse
artifacts of the legacy form. Translator-only (subset B); the builder has no field to offer.

**Two operator families beyond the field ledger's widget column.** Numeric — only
`jcr.impact_factor > 5` (C1.79), a backoffice field, so the public page needs no numeric
widget; the backoffice builder does, reading *is more than* / *is less than*, because an
impact factor is a quantity and a year is a point in time. Boolean — `external exact 0` and
`vabb_approved exact 1` need no boolean widget at all: the first reads as Affiliation *is* or
*is not* Ghent University, the second as a Classification value in the backoffice.
