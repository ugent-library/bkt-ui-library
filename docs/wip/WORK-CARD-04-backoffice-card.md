---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice] Work card: deposit status, visibility, and the metadata scan line"
---

## Why

The old backoffice card carries a status badge reading "Biblio public" / "Biblio
draft" / "Biblio withdrawn" (the red one is what a *returned* record wears; other
statuses render no badge), `Type: classification` — "Dissertation: U" on most
non-article records — an access line from the single main file ("Public access -
Open access"), three authors, department codes, VABB, timestamps and a curator-only
links row.

In raven the card says state on the two axes raven models. **Deposit status is the
badge**: draft, submitted, returned, reviewed. **Record visibility sits inside that
badge**, as an icon plus a visible label — "Reviewed · Public", "Draft · Not
public". All four statuses render on cards, returned included, in the researcher's
list and the curator's alike.

The two axes are independent: submitting makes a record public, review happens
after that, and a record can end up reviewed yet not public.

**File access is a plain metadata item**, never a badge — the badge slot belongs to
the status. The reference line is the **metadata scan** — today's field-list format,
kept. The rest of today's payload stays too: departments, projects, VABB, the Biblio
ID, the audit stamps and the links row.

Marie Curator (reviewer) says the status names are too long and "withdrawn" is
overloaded to the point of breaking her flow; she triages by markers before
opening anything. Claire Searcher (researcher) wants one list of everything under
her name, drafts included.

Forms and vocabulary: `docs/DOMAIN-VOCABULARY.md` → "Work status — two axes". Scan
line: `docs/wip/WORK-CARD-REFERENCE-STYLES.md` → "The backoffice line — metadata
scan".

> **Screenshot:** the curator list (`curate.html`) — four statuses down one column

> **Screenshot:** the researcher's own list (`search-researcher.html`) with a draft
> and a returned record

## What

- [ ] Deposit status badge with record visibility inside it
  - four statuses, one colour each; visibility as icon plus visible label
  - institution-only visibility renders as "Not public" — there is no third
    rendering
- [ ] All four statuses render, in both lists
- [ ] File access as a plain metadata item: "Open access", "Restricted access",
      "Embargo until \<date\>"
- [ ] Room beside the status badge for the retracted badge — the badge itself is 12
- [ ] The metadata scan line, per the spec doc
- [ ] Curator card
  - departments as muted badges; projects as a stacked sub-list with funder
    references; VABB
  - who submitted it or which import it came from, and how long ago
  - footer: the Biblio ID with its copy action, the audit stamps — who created the
    metadata and when, who last changed it and when, the last system change and
    when (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI") — and the links row
- [ ] Researcher card — own departments, no projects, no VABB
- [ ] Year, journal and project are filter links in these lists (01)
- `out of scope` Message blocks — 05. Action buttons — 06. The table view. A
  backoffice work detail view — card titles have no destination yet.

The prototype covers the **journal-article happy path** on both cards, plus a
dataset draft, a returned record and a retracted one. We iterate on top. Flag
ambiguity.

- The public card carries no deposit status and no record visibility — deliberate;
  it must not leak workflow.
- Two embargo wordings coexist in the templates; `DOMAIN-VOCABULARY` governs —
  "Embargo until \<date\>". Treat the others as drift.
- The evaluation classification stays off the card on both surfaces.

_The prototype governs the visible page and markup. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-team/curate.html](https://bkt-ui.vercel.app/templates/biblio-team/curate.html),
[templates/biblio-researcher/search-researcher.html](https://bkt-ui.vercel.app/templates/biblio-researcher/search-researcher.html), and the
[patterns/work-card.html](https://bkt-ui.vercel.app/patterns/work-card.html) (roles and views).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] Each of the four statuses renders, in both lists
- [ ] Visibility never renders as a bare icon
- [ ] Access is never a badge on a backoffice card
- [ ] Every date on the card uses the backoffice format
      (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI")
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Status and visibility are legible without colour
  - [ ] Card titles are not headings on these list pages
  - [ ] The copy action reports success to a screen reader
- [ ] `make build` passes

## Dependencies

- Blocked by **01**, which lands with the public epic.
- Year and project links narrow on raven#157 and raven#159; the journal link needs
  **09**.
- raven#51 is the existing placeholder for the researcher's list page; this is its
  card half.

## Open questions

- **Does returning a record change its visibility?** The two axes are independent,
  so returning leaves a record as public as it was, and a returned record would read
  "Returned · Public". The prototype shows "Not public", which assumes a flip.
  Options: (a) returning leaves visibility untouched; (b) returning takes the record
  off the public site. Policy — Open Science Policy with the curation lead. It
  changes what the researcher and the reader see.
