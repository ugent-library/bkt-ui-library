---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[epic] Public work card — grammar, reference line, access badge"
---

## Why

Parity is the floor: everything the public card on biblio.ugent.be shows today
shows up again in raven, recomposed into a defined grammar — five regions inside
one list wrapper, wherever works are listed. Every departure is decided, and reads
off the last column.

| Region | Biblio public today | Raven (checked 2026-08-07) | Expected |
|---|---|---|---|
| Card and list | One row for all nine types, built per page | A plain result on `/works`; a card of its own on the person page | One grammar, cards in one list wrapper, wherever works are listed (**01**) |
| Work type | Type badge; classification code (A1…) on articles and conference papers | Type badge | Type badge; classification dropped; subtype is the open question below |
| Access | Green arrow or grey padlock, chosen partly by the reader's network; embargo and private render nothing | "Open access" badge on the person page | One badge naming the state in words — Open, Restricted, Embargo until \<date\>, Closed — or none at all (**03**) |
| Title | Linked title | Linked title | Linked title, the card's accessible name, element per page outline (**01**) |
| Contributors | Up to ten authors, then `et al.`; UGent names marked | Names as plain text | Prose line, ten names then `et al.`, every name linked, identifiers readable as text (**01**) |
| Reference line | One line for every type: `(year) parent title. In series volume(issue). p.first-last` | The year and the container title | Composed per work type, across the 23 (**02**, `docs/wip/WORK-CARD-REFERENCE-STYLES.md`) |
| Filter links | Year and parent title link to searches, everywhere | Plain text | Year, journal and project filter in a filterable overview; text in a plain list (**01**, **09**) |
| Actions | Add to list; Send to ORCID on person pages | Placeholder Cite and Add to list on the person page | The region is **01**'s; its contents are raven#141 — out of scope here |

Sue Kerr (academic reader) lands on one record from Google, judges it in seconds
and cites it. Pia Practice (practitioner) reads the same card from outside
academia, where "A1" and "AAM" mean nothing.

> **Screenshot:** the works feed (`public-works.html`) — one card per work type

## Children

- [ ] **01 — Card grammar and markup contract.** Ships first; the others fill
      regions it defines. Shared with the backoffice epic, which depends on it.
- [ ] **02 — Public reference line.** One composition per work type, across the 23.
      Depends on 01, and on 08 for four of them.
- [ ] **03 — Access badge.** Open, restricted, embargo, closed, and the card that
      carries none. Depends on 01.
- [ ] **08 — `backend` Work fields the reference line needs.**
- [ ] **09 — `backend` Filter works by container.**

Every dependency is a child here or a cited raven issue.

## Out of scope

- **The backoffice card** — sibling epic, depends on 01.
- **The retracted badge** and retraction — both surfaces, no raven model yet;
  backoffice epic.
- **The public action row** — raven#141. **Access CTAs on cards** — raven#153.
- **Which works qualify as open access** — raven#164.
- **Peer-review indicator** (not before ship) and the **Diamond OA
  badge** (wanted, no design yet).
- **Soft-delete and replaced-by display**, **candidate card** — undesigned, named
  in the backoffice epic.

## How this lands in raven

Checked against open issues, 2026-08-06.

- raven#155 (public search) puts "work-card + toolbar actions" out of its scope —
  the seam this epic sits on. Its children own the year facet (#157), the
  organisation / project / keyword filters (#159) and URL state (#156), so 09 is
  narrowed to the container.
- raven#141 owns the public action row; raven#164 the open-access definition;
  raven#167 the lists pages; raven#125 the match card (amend, don't replace).
- raven#125 and #141 point at `bkt-ui-library/AGENT.md`; the file is `AGENTS.md`
  and the checklist is `docs/ACCESSIBILITY.md`.

## Prototype defects to fix on port — do not reproduce

- `public-project-detail.html` (`KNOWN BROKEN`): a year group without its `<h3>`,
  so a card title jumps h2 → h4, and cards outside the list wrapper.
- Placeholder drift: the same work is `pp. 12–29` on feed cards, `pp. 14–19` on the
  detail page.
- All `hx-*` URLs on cards are stubs.

## Open questions

- **Subtype and classification on cards.** No card shows a subtype today, and the
  public classification badge is deliberately dropped. Options: no subtype; subtype
  inside the type item ("Journal article — review"); subtype as its own item. Open
  for raven's work-type catalogue and, for classification, Open Science Policy.
  Nothing here depends on the answer.
