---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[epic] Public work card — grammar, reference line, access badge"
---

## Why

The public card on biblio.ugent.be today:
- type badge
- classification code on articles and conference papers
- a download arrow or padlock
- title
- up to ten authors
- one reference line shared by every type:
  `(year) parent title. In series volume(issue). p.first-last`.

In raven it is the same card with a defined grammar: five regions — metadata row,
actions, title, contributors, reference line — inside one list wrapper, wherever
works are listed. Everything today's card shows is kept, but:

- cards carry no subtype and no classification badge, on either surface;
- the reference line is composed per work type instead of one line for all
  (`docs/wip/WORK-CARD-REFERENCE-STYLES.md`);
- access is a badge naming the state in words, replacing the icons arrow and padlock;
- the year, project and container are filter links on every card, landing on the
  works overview with that filter applied; on the overview itself and in backoffice
  lists the click narrows the list in view. The container link matches the title
  string, as public Biblio does today (09).

### Notes on the target groups

Sue Kerr (academic reader) lands on one record from Google, judges it in seconds
and cites it. Pia Practice (practitioner) reads the same card from outside
academia, where the classification code "A1" and the file-version label "AAM" mean
nothing.

> **Screenshot:** the works feed (`public-works.html`) — one card per work type

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [works feed](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html) and the
[work card pattern](https://bkt-ui.vercel.app/patterns/work-card.html).

## Children

- [ ] **01 — Card grammar and markup contract.** Ships first; the others fill
      regions it defines. Shared with the backoffice epic, which depends on it.
- [ ] **02 — Public reference line.** One composition per work type, across the 23.
      Depends on 01, and on 08 for five of them.
- [ ] **03 — Access badge.** Open, restricted, embargo, closed, and the card that
      carries none. Depends on 01.
- [ ] **08 — `backend` Work fields the reference line needs.**
- [ ] **09 — `backend` Filter works by container.**

Every dependency is a child here or a cited raven issue.

## Out of scope

- **The backoffice card** — sibling epic, depends on 01.
- **Retraction** — a retracted work stays public, citable and marked on both
  surfaces, never hidden: the correction is part of the scholarly record (12).
  The mark waits on raven modelling retraction (10); both sit in the backoffice
  epic.
- **The public action row** — raven#141. **Access CTAs on cards** — raven#153.
- **Which works qualify as open access** — raven#164.
- **The Diamond OA badge, certification etc.** — not in scope, needs to be decided
  by policy what our focus will be for the next years.
- **Soft-delete and replaced-by display** — undesigned, and public work too: a
  deleted or replaced record's URL still gets readers.
- The **candidate card** — not prototyped; backoffice epic.

## How this lands in raven

Checked against open issues

- raven#155 (public search) puts "work-card + toolbar actions" out of its scope —
  the gap this epic fills. Its children own the year facet (#157), the
  organisation / project / keyword filters (#159) and URL state (#156), so 09 is
  narrowed to the container.
- raven#141 owns the public action row; raven#164 the open-access definition;
  raven#167 the lists pages; raven#125 the match card (amend, don't replace).
- raven#125 and #141 point at `bkt-ui-library/AGENT.md`; the file is `AGENTS.md`
  and the checklist is `docs/ACCESSIBILITY.md`.

## Prototype defects to fix on port — do not reproduce

- `public-project-detail.html` (`KNOWN BROKEN`): a year group without its `<h3>`,
  so a card title jumps h2 → h4, and cards outside the list wrapper.
- All `hx-*` URLs on cards are stubs.

## Open questions

One, in its child:

- **Is the per-type reference line worth building?** (02) Ten of the 23 types render
  a bare "(year)" under today's single template, and nine more lose their
  identifying middle. The price is per-type rendering instead of one template. The
  counts, the options and the case are in 02. You lose context. Dev team can evaluate
  whether this is too high of a cost.
