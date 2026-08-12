---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public] Work card: the reference line, per work type"
---

## Why

One line serves all nine types on biblio.ugent.be today:
`(year) parent title. In series volume(issue). p.first-last`. What that costs:

- pages render only when the first and the last page are both stored; a first page
  alone renders nothing;
- publisher, place, conference, ISBN, ISSN, DOI, edition and genre never appear.

In raven the line reads as a citation, composed per work type:

- its punctuation is written down rather than left per slot — the spec doc states it,
  and the kit page shows it. A Harvard style was the starting point for the examples,
  not the authority;
- it opens with the year — the authors, the title and the access route are the card's
  other regions, so the line carries where the work appeared and where inside it;
- every type renders one shared order, filling only the slots its fields cover; a
  type with nothing mapped yet renders the year alone;
- genre words stay ("PhD thesis.", "Report RPT-42.", "[Preprint]") — each explains
  the field after it;
- container titles render in `<cite>`, italic, and are filter links on every card
  (#180).

The gain sits in the non-article types. Ten of the 23 render a bare "(year)" under
today's template, and nine more keep a line but lose its identifying middle — a
conference paper's conference, a report's number and publisher, a magazine
article's date; the per-type table in the spec doc names them. For journal articles
— the bulk of the records — the old and new lines are nearly identical, so nothing
is lost where today's line works. The cost is more rendering logic than one
template, though the spec is one shared order plus four exceptions, not a rule per
type. The line is the card's only statement of where a work appeared,
and on ten types it says nothing today.

Compositions, rendered examples and the decisions behind them:
`docs/wip/WORK-CARD-REFERENCE-STYLES.md`.

### Notes on the target groups

Sue Kerr (academic reader) reads the venue and the year to decide whether to open
a hit, and copies the line to cite it. Pia Practice (practitioner) reads the same
line for the same decision, from outside academia: she judges by the institution,
the date and the kind of work, not by a venue's reputation, so the line has to say
"PhD thesis.", "Report RPT-42." and "Ghent University." in words she already knows.

> **Screenshot:** the works feed with one card per work type (`public-works.html`)

## What

- [ ] The line opens with the year; authors, work title and access route stay out
- [ ] Per-type composition for the 23 types — one order, four exceptions, per the
      spec doc
- [ ] `other`, and any type before its fields are mapped, renders the one order
      with whatever it carries
- [ ] Date precision follows the stored date; a work with no date renders the line
      without a year, and the public card never says a field is missing (the
      backoffice scan does — #189)
- [ ] Container titles in `<cite>`, italic
- [ ] Year and container are filter links on every card, landing on the works
      overview with the filter applied (#180)
- `out of scope` The backoffice metadata scan line — #189
- `out of scope` Today's `?style=` URL feature on biblio.ugent.be, which swaps
  every card in a result list for one pre-rendered citation string (APA, MLA, …) —
  whether raven keeps it is a later decision, pending a discussion and a check of
  whether the feature is actually used
- `out of scope` What the Cite action opens — #141 puts the trigger on the card

The prototype covers **all 23 types** with placeholder data. Lines marked ⚑ in the
spec carry a field that #181 must settle, and wait for it. Dataset and software
compose one line, so #181 settles them together. We iterate on top.
Flag ambiguity.

- The spec doc's examples are the shape of each line; how the line is produced is the
  implementer's call, the punctuation is not.

_The prototype governs the visible page and markup. Machine-facing output
(`citation_*` tags, Signposting, `?format=` alternates, crawl semantics) is governed
by `docs/public-site-semantics.md` — preserve as-is. Prototype URLs are
placeholders. UI copy goes through the translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-public/public-works.html](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html); spec in
`docs/wip/WORK-CARD-REFERENCE-STYLES.md`.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] All 23 types render a line; none renders a stray separator or a dangling `In`
- [ ] Each type's line carries its composition from the spec doc, in order
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] The year is a machine-readable time element
  - [ ] Link text inside the line is meaningful on its own
- [ ] `make build` passes

## Dependencies

- Blocked by #180; by #181 for reference entry, magazine article, newspaper
  article, dataset and software.
- Year links narrow on #157, container on #182, URL state is #156. The
  prototype's `?year=` and `?container=` parameters are placeholders, not a proposal —
  #182 matches the container title as stored.

## Open questions

- **Is the per-type line worth building?** Today one template serves every type, so
  a PhD thesis renders as "(2024)" — the awarding institution has no slot — while
  composed per type it reads "(2024) PhD thesis. Ghent University."

  Ten of the 23 types render such a bare "(year)" under today's template: thesis,
  conference abstract, conference poster, conference presentation, preprint,
  dataset, software, lecture, media appearance and online post. Nine more keep a
  line but lose its identifying middle — a conference paper's conference, a
  report's number and publisher, a magazine article's date. The journal-shaped
  types barely change.

  The price is per-type rendering instead of one template, bounded by one shared
  order plus four exceptions. Options: (a) compose per type, per the spec doc;
  (b) keep one line for every type, as today. Needs a team decision.

What raven does about the ⚑ fields is #181.
