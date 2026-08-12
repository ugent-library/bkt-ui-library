---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice] Work card: deposit status, visibility, and the metadata scan line"
---

## Why

Backoffice cards extend the public card with workflow, visibility and administrative
metadata. They replace old Biblio status labels with Raven vocabulary.

The card shows **deposit status** and **record visibility** side by side. Deposit
status is draft, submitted, returned or reviewed. Visibility is Public or Private
with a visible label. All four statuses render in researcher and curator lists.

The two axes are independent: deposit status and visibility render separately and can
change separately. In UGent's deposit flow, submit also makes the record public, while
a record can still end up reviewed yet private.

File access is a plain metadata item, never a badge. The backoffice reference line
is the metadata scan. Departments, projects, VABB, Biblio ID, audit stamps and quick
links stay on the card.

Forms and vocabulary: `docs/DOMAIN-VOCABULARY.md` → "Work status — two axes". Scan
line: `docs/wip/WORK-CARD-REFERENCE-STYLES.md` → "The backoffice line — metadata
scan".

> **Screenshot:** curator submitted card with full backoffice payload
> **Screenshot file:** `04-05-06--curator-submitted-card.png`

> **Screenshot:** curator missing-access card
> **Screenshot file:** `04-05-11--curator-missing-access-card.png`

> **Screenshot:** the researcher's own list (`search-researcher.html`) with a draft
> and a returned record
> **Screenshot file:** `04-05-11--researcher-draft-card.png`

> **Screenshot:** dataset golden type example
> **Screenshot file:** `04--dataset-golden-card.png`

## What

Missing-information blocks are scoped in 05 and 11; this issue reserves the card
region they occupy.

- [ ] Deposit status and record visibility badges
  - four statuses; visibility has a visible label
  - the two axes render separately. In UGent's deposit flow, submit also makes the
    record public; later visibility changes still move independently
- [ ] All four statuses render, in both lists
- [ ] File access as a plain metadata item, in the backoffice's shorter wording:
      "Open", "Restricted", "Embargo \<start date\> – \<end date\> ·
      Private → Open".
      The public card spells out "Restricted access" (03); a curator scanning a
      column does not need the noun. Embargo duration is out of scope for this issue
- [ ] Missing metadata that affects scanning can appear in the same row as a compact
      marker, for example "Missing access"; the message blocks carry the full
      responsibility list
- [ ] Room beside the status and visibility badges for the retracted indicator — the
      indicator itself is 12
- [ ] The metadata scan line, per the spec doc
- [ ] A work with no date reads as missing on the scan line; the public line omits
      the year (02). Primary identity fields such as title do not use this missing
      marker pattern
- [ ] Curator card
  - departments; project names with project references; VABB
  - who submitted it or which import it came from, and how long ago
  - footer: the Biblio ID with its copy action, the audit stamps — who created the
    metadata and when, who last changed it and when, the last system change and
    when (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI") — and the links row
- [ ] Researcher card — own departments and project names, no VABB
- [ ] Year, journal and project are filter links in these lists (01)
- [ ] Contributor names are links, as on the public card (01)
- [ ] Three contributors, then the count alone ("+10 more authors") — the public
      card's ten names and `et al.` are the reader's form, not the curator's (01)
- [ ] Card title behavior follows role
  - researcher title is a link to the researcher's own record page
  - curator/reviewer title is plain text so parts of it can be copied; the action
    opens the work view or review flow
- `out of scope` Message blocks — 05. Action buttons — 06. The table view.

The prototype covers the **journal-article happy path** on both cards, the action
matrix, a missing-access example, a dataset golden example, a software candidate
example, and a retracted card.

- The public card carries no deposit status and no record visibility — deliberate;
  it must not leak workflow.
- The evaluation classification stays off the card on both surfaces.

_The prototype governs the visible page and markup. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-team/curate.html](https://bkt-ui.vercel.app/templates/biblio-team/curate.html),
[templates/biblio-researcher/search-researcher.html](https://bkt-ui.vercel.app/templates/biblio-researcher/search-researcher.html), and the
[patterns/work-card.html](https://bkt-ui.vercel.app/patterns/work-card.html) (roles and views).
Actions land on [templates/biblio-team/curate-detail.html](https://bkt-ui.vercel.app/templates/biblio-team/curate-detail.html);
researcher title links land on [templates/biblio-researcher/work-detail.html](https://bkt-ui.vercel.app/templates/biblio-researcher/work-detail.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] Each of the four statuses renders, in both lists
- [ ] Visibility never renders as a bare icon
- [ ] Status and visibility both render in the card metadata row
- [ ] Curator/reviewer card titles are not links
- [ ] Access is never a badge on a backoffice card
- [ ] Every date on the card uses the backoffice format
      (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI")
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Card titles are not headings on these list pages
  - [ ] The copy action reports success to a screen reader
- [ ] `make build` passes

## Dependencies

- Blocked by **01**, which lands with the public epic.
- Year links narrow on raven#157; container links need **09**. Project links use
  raven#159 and the same URL state contract as the rest of the backoffice search.
- raven#51 is the existing placeholder for the researcher's list page; this is its
  card half.

## Open questions

None.
