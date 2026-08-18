# Phase 2 — OR rule groups

*Designed now so phase 1's layout leaves room; built later, and only on the evidence in §4.
Bet: [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md) · design detail:
[`QUERY-BUILDER-DESIGN.md`](QUERY-BUILDER-DESIGN.md) · cases:
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) · drawn as the `phase-2` state of
the `advanced-group` state of `templates/partials/search-advanced-conditions.html`, shared by
the builder's two renderings — `templates/biblio-public/public-search-advanced.html` (page) and
the dialog in `templates/biblio-public/public-works.html`.*

Scope: one feature. **OR rule groups** — AND-first: the top level stays AND-joined rows, a row
can be an "any of these" group, one level deep.

---

## 1. The interaction

**A row becomes a group in place.** Every condition row carries an "Or…" action next to its
remove button. Pressing it keeps the row's field, operator and value as the first alternative,
adds an empty second alternative below it, and wraps both in a bordered block labelled **Any of
these**. Nothing moves in the outer list: the group occupies the row's slot, so a group and a
plain row are interchangeable at the top level. Inside the group, alternatives are separated by
the word **or**; at the top level, rows stay separated by **and**. One level deep — an
alternative is always a single condition, never another group.

The group's own header carries **Remove group**; its footer carries **Add an alternative**.

**It reads as one sentence.** The preview renders a group as `either A or B`, and the top level
keeps joining with `and`:

> Either host publication is **Nature Photonics** or publisher is **Springer**, and publication
> year is **2020**.

`either … or …` rather than parentheses: it is the same plain language the rows use, and it
scopes the alternatives without teaching operator precedence. Three or more alternatives read
`either A, B, or C`. A shared condition is stated once at the top level and never duplicated
into the branches — that is the reason for AND-first (the OR-first alternative duplicates the
shared conditions across groups, and was rejected in the design doc).

**It collapses when one condition is left.** Removing alternatives until one remains turns the
group back into a plain row: the border, the "Any of these" label and the "or" separator go, the
surviving condition keeps its field, operator and value, and the row keeps its slot. So a group
is a state of a row, not a different kind of thing — there is no empty group to reason about and
no way to leave one behind.

**Deleting.** Three scopes, each next to what it deletes: an alternative's × removes that
alternative (and collapses the group at one left); the group header's **Remove group** removes
the whole group and its slot; a plain row's × removes the row. Removing the last row of all
leaves the builder in its empty state, where the count reads "all research outputs" — the same
place a first visit starts.

**Keyboard and AT.** The group is a `role="group"` labelled by its "Any of these" heading, so
the grouping is announced, not just drawn. Each control keeps its own label naming its
alternative ("Field, alternative 2"), and each action names its target ("Remove alternative 2:
publisher is Springer").

---

## 2. Which golden cases this expresses

Phase 2's job is the composite shapes in [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) § C3. Read
against the new data model, that list is much shorter than its phase labels suggest.

**Expressed by the group — the whole genuine demand, 3 signatures, ~8 observed occurrences:**

| case | shape | observed |
|---|---|---:|
| C3.09 | `(parent OR publisher) AND year` — two different fields, OR'd, narrowed by a third | 5 |
| C3.53 | `title AND (author any OR type exact)` — same shape, other fields | 1 |
| C3.28 | `datecreated range AND type <> A or B` — a negation and an alternative in one query | 2 |

C3.28 is ambiguous in the legacy syntax (is it `type is not A` OR `type is B`, or `type is
neither A nor B`?). Both readings are expressible: the first as a group holding a negated
condition, the second as two AND-joined `is not` rows. Which one the legacy query *meant* is the
translator's problem (subset B), not the builder's.

**Deliberately not expressed by the group, because phase 1 already does it.** These carry
*phase 2* labels in the draft set, and under this design they are phase 1 — the label is an
artifact of signature bucketing, not a gap:

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
- **OR'd free-text phrases** (C3.51): `contains any of` on a text field. Added to phase 1's text
  operators for exactly this case.

**Recommendation for the set:** relabel those rows *phase 1*. Only three signatures then carry
the phase-2 gate, which is the honest size of the bet.

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

## 3. What phase 2 needs from raven that phase 1 does not

**OR-group serialisation in the public URL grammar** (bet, rabbit hole 1). raven's internal
`QueryFilter` already expresses a conjunction of clauses where a clause can be an OR group or a
NOT — the model is there. The *public* URL params carry free text plus terms filters and nothing
else. So:

- **A group is unshareable until the grammar carries it.** Phase 2's URL tab says so and offers
  the saved search as the shareable artifact. That is an honest state, not a broken one, but it
  is a visible hole in a page whose whole point is producing shareable queries.
- **`is not` needs the same thing, in phase 1.** Negation is a phase 1 operator (178 real
  queries) and today's public params express it no better than OR groups do. Phase 1 therefore
  already forces part of this decision; phase 2 only adds the group. Worth stating plainly to
  the raven team: the grammar has to be designed once, for AND rows, negation *and* groups,
  because it can never change afterwards.
- **Round-trip is the gate**, per the design doc: URL → builder state → URL, unchanged. A group
  that serialises but does not parse back leaves the builder unable to open its own links.

Nothing else in phase 2 is new backend work: the count, the preview and the per-condition
evaluation all run on the query model that phase 1 already needs.

---

## 4. Go / no-go evidence

**Phase 2 is justified by observed OR-group usage, and by nothing else.** The measurement that
produces it is non-negotiable 3 in the design doc: **raven's request log with the result count as
one field.** From that, OR-group usage, zero-result queries, paste-list sizes and field/operator
usage all come free, server-side, surviving any frontend rewrite.

Decision rule: after the phase 1 release, count how often built queries carry a group, and how
often a group query returns results a phase 1 query could not have produced. Slow trend, monthly
at best — the whole authoring population is ~19 queries a day.

**If that field never lands, the decision falls back to the 2026-H1 log alone**, and that log
says: three composite signatures, ~8 occurrences in 3,589 human queries. On its own that is a
thin case for the group as a *feature*, and the argument shifts to parity — the expert tier can
express these queries today, so shipping without the group is a regression for the people who
wrote those eight queries. Either way the decision is made on this evidence and stated, not
substituted with client-side events (the design doc rules that out explicitly).

---

## 5. Per-condition evaluation — moved out of scope

Checking a built query against a known record, condition by condition, was drafted here as a user
feature. It is not one: the audience for that answer is us, verifying the builder against the
golden set, not a researcher building a list. It stays a QA tool. If support ever needs it for
curators, it belongs in the backoffice, not on public Advanced search.

---

## Coverage check — what the drawn layout cannot express

Run against subset A of [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md) (the builder's contract;
subset B is raven's translator work).

**Buildable:** every C1 field × operator cell but C1.79, every C2 paste batch, every C4 range, C5's stress
cases, and C8's embed parameters (citation style and info-block toggle are both on the Embed
tab). C3 splits as §2 above: 3 signatures in the phase-2 state, the rest in phase 1.

**Not buildable, and why:** **C1.52, C1.60, C1.78, C1.82 (`field`, `for`, `of`)** — parse
artifacts of the legacy form. Translator-only (subset B); the builder has no field to offer.
**C1.79 `jcr.impact_factor > 5`** — the journal impact factor is a backoffice field
(2026-08-18), so the public page drops it and the backoffice builder carries it. No other
subset A case needs a sign-off exception.

**Mapping questions the prototype cannot settle** (they are raven-registry decisions, per the
design doc's field-selection section):

1. **`author.affiliation` vs `affiliation`** (C1.73, 1 occurrence) — one field or two? The
   drawn list offers one **Organisation** field. If a contributor's own affiliation is a distinct
   index field, the person condition needs it as a narrowing, the way role narrowing works.
2. **`file <> FILE_1`** (C1.77, 1 occurrence) — the drawn list offers **Has full text** as a
   yes/no. Negating a specific file identifier looks like a translator-only shape; confirm.
3. **`vabb_approved`** (C1.44/56, 29 occurrences) is drawn as a field. It is a
   research-evaluation attribute, and the public/backoffice line for classifications is an open
   domain decision (`TOPLAN.md`). Exposure decision, not a layout one.

**Two operator families the design doc's widget list does not name** (design item 1 lists text,
select, person/record typeahead, year range, paste-a-list). The boolean one is drawn as fields
already; the numeric one follows the impact factor to the backoffice:

4. **Numeric** — the only numeric case is `jcr.impact_factor > 5` (C1.79), now a backoffice
   field, so the public page needs no numeric widget. The backoffice builder does, and it reads
   *is more than* / *is less than*, not the year row's *is after* / *is before*: a year is a
   point in time and an impact factor is a quantity.
5. **Boolean** — `external exact 0` (C1.10, 257 occurrences), `embargo exact 0`,
   `vabb_approved exact 1`, `file` presence. These read *is yes* / *is no*, which is what design
   item 5's "`has file`, not `has_file is yes`" implies without naming the family.
