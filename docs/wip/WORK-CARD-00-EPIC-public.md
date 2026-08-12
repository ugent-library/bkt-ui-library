---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[epic] Public work card — grammar, reference line, access badge"
---

> **Filed as #185.**

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
- access is a badge naming the state in words, replacing the icons arrow and padlock.
  Open, restricted and embargo are the card's whole vocabulary; closed belongs to
  the backoffice.
- the year and the container are filter links. From a detail page they open the
  works overview with the filter applied. From a filterable list they narrow the
  current list and update the URL. The container link matches the title string, as
  public Biblio does today (#182).

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

- [ ] **#180 — Card grammar and markup contract.** Ships first; the others fill
      regions it defines. Shared with the backoffice epic, which depends on it.
- [ ] **#184 — Public reference line.** One composition per work type, across the 23.
      Depends on #180, and on #181 for five of them.
- [ ] **#183 — Access badge.** Open, restricted, embargo, closed, and the card that
      carries none. Depends on #180.
- [ ] **#181 — `backend` Work fields the reference line needs.**
- [ ] **#182 — `backend` Filter works by container.**

Every dependency is a child here or a cited raven issue.

## Out of scope

- **What the backoffice card shows** — status, messages, actions and the scan line
  belong to the backoffice epic, not here. Both surfaces render the same card, and
  its regions are defined once, in #180, for public and backoffice together. The
  backoffice fills those regions with its own content instead of building a second
  card. Where the backoffice needs a region that does not exist yet, add it in #180
  so both surfaces get it.
- **Retraction** — a retracted work stays public, citable and marked on both
  surfaces, never hidden: the correction is part of the scholarly record (#193).
  The mark waits on raven modelling retraction (#192); both sit in the backoffice
  epic.
- **The public action row** — #141.
- **Which works qualify as open access** — #164.
- **The Diamond OA badge, certification etc.** — not in scope, needs to be decided
  by policy what our focus will be for the next years.
- **Soft-delete and replaced-by display** — undesigned, and public work too: a
  deleted or replaced record's URL still gets readers.
- The **candidate card** — not prototyped; backoffice epic.

## Which surfaces this changes

Every raven view that lists works with a card:

- the public works overview;
- the embedded lists on the researcher, organisation and project pages;
- the related-research panel on a record page.

They are separate templates today; #180 makes them one.

## Done when

- Every public work card renders the five regions from one template.
- Each of the 23 work types renders a reference line, and none renders a stray
  separator or a dangling `In`.
- The three access states render, and a work with no reachable file — none, closed or
  private — carries no badge.
- The year and the container link on the cards that carry them, and each lands on the
  works overview with that filter applied.
- #180, #184, #183, #181 and #182 are closed.

## How this lands in raven

Checked against open issues

- #155 (public search) puts "work-card + toolbar actions" out of its scope —
  the gap this epic fills. Its children own the year facet (#157), the
  organisation / keyword filters (#159) and URL state (#156), so #182 is
  narrowed to the container. Projects sit on the detail pages, not on cards.
- #141 owns the public action row; #164 the open-access definition;
  #167 the lists pages; #196 for the related research output
  section on public work detail pages.

## Prototype defects to fix on port — do not reproduce

- All `hx-*` URLs on cards are stubs.

## Open questions

One, in its child:

- **Is the per-type reference line worth building?** (#184) Ten of the 23 types render
  a bare "(year)" under today's single template, and nine more lose their
  identifying middle. The price is per-type rendering instead of one template. The
  counts, the options and the case are in #184. You lose context. Dev team can evaluate
  whether this is too high of a cost.
