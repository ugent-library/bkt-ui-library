---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[epic] Backoffice work card — status, messages, actions"
---

> **Not ready to file.** Drafted and grounded in prototype markup that exists, but
> the backoffice pass has not run: the fast lane behind "Complete metadata", the
> proxy role, and a backoffice detail view for a card title to open still need
> screens, and 04 carries an open policy question. File the public epic first.

## Why

The old backoffice card carries a status badge reading "Biblio public" / "Biblio
draft" / "Biblio withdrawn" — the red "Biblio withdrawn" badge is what a
*returned* record shows — plus
`Type: classification`, an access line from the single main file, three authors,
department codes, VABB, timestamps and a curator-only links row. Datasets run
through a separate component with their own access field and labels.

In raven it is the public card's grammar with a backoffice payload:

- **deposit status is the badge**, with record visibility inside it as an icon *and*
  a visible label — "Reviewed · Public", "Draft · Not public". One badge carries
  both axes, in words.
- **file access is a plain metadata item**, never a badge — the badge slot is the
  status's.
- **the reference line is the metadata scan** — today's field-list format, kept:
  curators scan fields, readers cite.
- **two message blocks, split by audience** — what the researcher must supply, and
  what curators say to each other.
- **the actions row follows role and state** — review, edit, continue, edit &
  resubmit, view public page.

One card covers every kind: raven has a single Work entity, so the separate dataset
component goes. What differs per type is which metadata it carries, never the layout
or the vocabulary.

This is the public card with more on it, not a second card. Same regions, same order,
same markup; the backoffice adds items and blocks, and switches two things — access
renders as text instead of a badge, and the reference line is the scan instead of the
citation. Build it by filling the public card's regions differently, not by forking
it.

Marie Curator (reviewer) triages by markers in a narrow split-screen pane and
asked for the list itself to show completeness. Claire Searcher (researcher)
wants one master list of everything under her name, drafts included — today she
cannot see her own.

Vocabulary and exact forms: `docs/DOMAIN-VOCABULARY.md` → "Work status — two axes"
and "Messages on backoffice cards".

> **Screenshot:** the curator list (`curate.html`) and the researcher's own list
> (`search-researcher.html`)

## Children

- [ ] **04 — Backoffice card.** Status, visibility, access as text, the scan line,
      the curator-only rows. Depends on 01.
- [ ] **05 — Card messages.** Depends on 04 and 11.
- [ ] **06 — Card actions per role and state.** Depends on 01 and 04.
- [ ] **12 — Retracted badge**, public and backoffice. Depends on 10.
- [ ] **10 — `backend` Retraction as a work state.**
- [ ] **11 — `backend` Missing-metadata lists per record.**

## Out of scope

- **The card grammar** — 01, in the public epic. A backoffice row that needs a
  new region changes 01, never this card alone.
- **The fast lane** behind "Complete metadata" — no screens yet, design pending
  with M (design).
- **Proxy role**, **a backoffice work detail view**, **the table view**.
- **Soft-delete and replaced-by display** — raven has tombstones and merge
  redirects, no display design yet. Pending with M (design).
- **Candidate / suggestion card** — not prototyped.
- **Per-field add links** — today's card turns an empty field into an inline link
  where the viewer may edit ("Add document type: full text", "Add department", "Add
  license"), and plain text where they may not. Parity work, not designed yet;
  named in 05.
- **The retraction notice** on the public detail page — 12 is the badge.
- **Writing or replying to messages** from the card, and message templates.

## How this lands in raven

Checked against open issues, 2026-08-06.

- **raven#51** is a one-line placeholder for the researcher's backoffice search
  page, self-assigned, pointing at the same prototype 04 does. Either 04 becomes its
  body or 04 is its child; #51's remaining text is the page, not the card.
- **raven#141** owns the public action row, so 06 is the backoffice half only.
- Nothing covers the curator list card, the message blocks, retraction, or
  missing-metadata. 04, 05, 10, 11 and 12 are new ground.

## Prototype defects to fix on port — do not reproduce

- Two wordings for an embargoed file coexist in the templates. `DOMAIN-VOCABULARY`
  governs: one item, "Embargo until \<date\>". 04 specifies it.
- All `hx-*` URLs on cards are stubs.

## Open questions

One, in its child:

- **Does returning a record change its visibility?** (04) Policy — Open Science
  Policy with the curation lead.
