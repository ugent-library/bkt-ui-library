---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice] Work card: message blocks for the researcher and for curators"
---

## Why

Backoffice cards show two message blocks, split by audience.

**For the researcher** is warning-toned and visible to researcher and curator. It
contains missing items, the Biblio message and the call to action.

**For curators** is quiet, curator-only and marked with the padlock. It contains
the bibliographic completeness list and the internal note.

On a returned record the Biblio message is the return reason: one text, one
field, no second place to store it. Nothing missing and no note means no block.

> **Screenshot:** the researcher's view, warning block only
> (`search-researcher.html`, the draft dataset)
> **Screenshot file:** `04-05-11--researcher-draft-card.png`

> **Screenshot:** a curator's view of the same kind of card, both blocks
> (`curate.html`, first card)
> **Screenshot file:** `04-05-06--curator-submitted-card.png`

> **Screenshot:** missing-access marker with responsibility blocks
> **Screenshot file:** `04-05-11--pattern-missing-access-card.png`

> **Screenshot:** returned record message
> **Screenshot file:** `05-06--researcher-returned-card.png`

## What

- [ ] "For the researcher" block — warning alert, researcher and curator
  - missing items from the researcher list, in the documented priority order
  - the Biblio message; on a returned record, the return reason from the record's
    history
  - the "Complete metadata" call to action, opening the record's edit form
- [ ] "For curators" block — quiet alert with the padlock, curators only
  - missing items from the curator list
  - the internal note
- [ ] Each block, and each line, renders only when it has content
- [ ] A field the work type does not carry is never reported as missing
- [ ] Blocks sit below the reference line, researcher block first
- [ ] When a missing value affects scanning, the card may also show a compact
      metadata-row marker such as "Missing access"; the block remains the place that
      lists the actionable bundle
- [ ] Primary identity fields, such as title, do not use the metadata-row missing
      marker pattern
- `out of scope` The fast lane behind "Complete metadata" — an edit view scoped to
  the missing fields is its own design, tracked in `notes/TOPLAN.md`
- `out of scope` Writing, editing or replying to messages from the card
- `out of scope` Message templates and assignment — own issue
- `out of scope` **Per-field add links.** Today's backoffice card turns an empty
  field into an inline link where the viewer may edit — "Add document type: full
  text", "Add department", "Add licence" — and plain text where they may not ("No
  department(s)"). TBD, currently replaced by the cards messages.

The prototype covers **a draft with items missing, a submitted record with both
blocks, a missing-access metadata marker, and a returned record whose only message
is the return reason**.

- The curator block is not hidden from researchers — it is absent from what they
  are served.
- Message text may contain URLs; the old card rendered them as links. Keep that,
  with the surrounding text escaped.

_The prototype governs the visible page and markup. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-team/curate.html](https://bkt-ui.vercel.app/templates/biblio-team/curate.html),
[templates/biblio-researcher/search-researcher.html](https://bkt-ui.vercel.app/templates/biblio-researcher/search-researcher.html), and the
[patterns/work-card.html](https://bkt-ui.vercel.app/patterns/work-card.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] A researcher's page never contains the curator block, in the served HTML
- [ ] A returned record's Biblio message is the return reason, with no second place
      to store it
- [ ] A complete record with no notes renders no block
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Each block is announced with its audience; the padlock is decorative
  - [ ] Lines stay stacked at a narrow pane width
- [ ] `make build` passes

## Dependencies

- Blocked by #189, and by #190 for the two missing-items lists.

## Open questions

None.
