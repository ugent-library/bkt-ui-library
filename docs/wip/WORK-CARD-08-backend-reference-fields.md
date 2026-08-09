---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Work fields the card's reference line needs"
labels: backend
---

<!-- Child of the public work-card epic. Backend. -->

## Why

Five reference lines in 02 carry a field this issue settles. Four are fields old
Biblio shows today, and the card keeps them; the fifth, the dataset publisher, old
Biblio showed only in the backoffice — the public line now composes it too (the
repository is the venue, per the spec doc). The question, per field: does raven model
it — and where it does not, is it built or dropped? Dropping a field loses that part
of the line for that type: a reference entry without its encyclopedia, a newspaper
article without its page, software without its version.

Which types and which fields, marked ⚑ in the spec:
`docs/wip/WORK-CARD-REFERENCE-STYLES.md` → "⚑ Remaining — raven gaps to raise".

## What

Per field: establish whether raven models it; where it does not, decide build or
drop; what is built feeds the line in 02.

- [ ] **Reference entry** — the container title (the encyclopedia or dictionary),
      the publisher, and the pages. Old Biblio carried all three under
      `misc`
- [ ] **Magazine article** and **newspaper article** — pages
- [ ] **Software** — version
- [ ] **Dataset** — the publisher the public line composes and the backoffice scan
      shows

## Acceptance

- [ ] Each ⚑ field carries a decision: modelled already, built, or dropped from the
      line
- [ ] Each built field renders its line in 02 from real data, not placeholder text
- [ ] No type is given a field it should not carry
- [ ] `make test` passes

## Dependencies

Blocks the ⚑ types in **02**. The other 18 types do not wait for this.

## Open questions

- **Per field: build it, or drop it from the line?** Asked only where raven does
  not already model the field. Building a field keeps that type's line at parity
  with old Biblio; dropping it loses that part of the line for that type. The
  design intent is to build all four (kept from old Biblio) — the encyclopedia
  title is what makes a reference entry's line readable at all. The dev team
  confirms per field, with M (design).
- **Dataset publisher: which raven doc holds?** The migration map carries old
  Biblio's dataset publisher into raven's `publisher` field; that field's per-type
  applicability list leaves datasets out. Options: (a) datasets carry a publisher
  and the line reads "(2026) Zenodo." — the design intent, per "the repository is
  the venue"; (b) they carry none and the dataset line is the year alone. The dev
  team answers.

> No screenshot — backend. The lines these fields feed are shown in 02.
