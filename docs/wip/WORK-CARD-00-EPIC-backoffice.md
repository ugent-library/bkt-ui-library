---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[epic] Backoffice work card — status, messages, actions"
---

> **Ready to file.** The card's loose ends are closed enough for implementation:
> researcher titles open their backoffice detail view, curator/reviewer titles stay
> plain text for copying, and actions open the relevant work view. The fast lane and
> proxy role are out of scope for this epic. File the public epic first if 01 is not
> already filed; 01 blocks 04.

## Why

The old backoffice card carries a status badge reading "Biblio public" / "Biblio
draft" / "Biblio withdrawn" — the red "Biblio withdrawn" badge is what a
*returned* record shows — plus
`Type: classification`, an access line from the single main file, three authors,
department codes, VABB, timestamps and a curator-only links row. Datasets run
through a separate component with their own access field and labels.

In raven it is the public card's grammar with a backoffice payload:

- **deposit status is a badge**, and **record visibility is a separate neutral
  badge** beside it — "Reviewed" and "Public", "Draft" and "Private".
- **file access is a plain metadata item**, never a badge — the badge slot is the
  status's.
- **the reference line is the metadata scan** — today's field-list format, kept:
  curators scan fields, readers cite.
- **two message blocks, split by audience** — what the researcher must supply, and
  what curators say to each other.
- **the actions row follows role and state** — review, view, edit, continue, edit &
  resubmit, request changes, view public page, and delete draft when allowed.

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

> **Screenshot:** the richer curator list (`curate.html`)
> **Screenshot file:** `epic-backoffice-04-05-06-11--curate-cards.png`

> **Screenshot:** the researcher's own list (`search-researcher.html`)
> **Screenshot file:** `epic-backoffice-04-06--researcher-cards.png`

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [curator list](https://bkt-ui.vercel.app/templates/biblio-team/curate.html), the
[researcher's own list](https://bkt-ui.vercel.app/templates/biblio-researcher/search-researcher.html) and the
[work card pattern](https://bkt-ui.vercel.app/patterns/work-card.html).

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
- **The fast lane** behind "Complete metadata" — the CTA opens the record's edit
  form. The scoped edit view is a separate design, tracked in `notes/TOPLAN.md`.
- **The proxy role.** Every row in 06 is a researcher's or a curator's. What a proxy
  sees and may do is its own design, and the card gains its axis when that lands.
- **The table view.**
- **Soft-delete and replaced-by display** — raven has tombstones and merge
  redirects, no display design yet.
- **Candidate / suggestion card** — not prototyped.
- **Per-field add links** — today's card turns an empty field into an inline link
  where the viewer may edit ("Add document type: full text", "Add department", "Add
  licence"), and plain text where they may not. Parity work, not designed yet;
  named in 05.
- **The full retraction notice** on the public detail page — 12 covers the card
  indicator and public card warning.
- **Related research / match cards** — 07 replaces raven#125 for the public detail
  page. It is useful card cleanup, but not required for backoffice parity.
- **Writing or replying to messages** from the card, and message templates.

## How this lands in raven

Checked against open issues, 2026-08-06.

- **raven#51** is a one-line placeholder for the researcher's backoffice search
  page, self-assigned, pointing at the same prototype 04 does. Either 04 becomes its
  body or 04 is its child; #51's remaining text is the page, not the card.
- **raven#125** was never picked up. 07 replaces it as a public-detail follow-up
  outside this backoffice epic.
- The public action row is outside this epic, so 06 is the backoffice half only.
- Nothing covers the curator list card, the message blocks, retraction, or
  missing-metadata. 04, 05, 10, 11 and 12 are new ground.

## Prototype defects to fix on port — do not reproduce

- Two wordings for an embargoed file coexist in the templates. 04 governs the
  backoffice form: one item, "Embargo \<start date\> – \<end date\> · Private
  → Open" when both dates and both access levels are available. Duration is out of
  scope for this epic.
- All `hx-*` URLs on cards are stubs.

## Open questions

One, in its child:

- **Does a retraction carry its own notice text, and who writes it?** (10) Policy —
  Open Science Policy with the curation lead.
