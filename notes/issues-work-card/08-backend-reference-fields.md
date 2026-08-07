---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Work fields the card's reference line needs"
labels: backend
---

<!-- Child of the public work-card epic. Backend. -->

## Why

Four reference lines in 02 carry a field old Biblio shows today, and the card keeps
them. The question this issue settles, per field: does raven model
it — and where it does not, is it built or dropped? Dropping one costs that type its
parity: an encyclopedia entry without its encyclopedia, a newspaper article without
its page, software without its version.

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
- [ ] **Dataset** — the publisher the backoffice scan line shows (the migration map
      carries the old dataset publisher across, while the imprint's applies-to list
      leaves datasets out; the two disagree — which holds?)

## Acceptance

- [ ] Each ⚑ field carries a decision: modelled already, built, or dropped from the
      line
- [ ] Each built field renders its line in 02 from real data, not placeholder text
- [ ] No type is given a field it should not carry
- [ ] `make test` passes

## Dependencies

Blocks the ⚑ types in **02**. The other 19 types do not wait for this.

## Open questions

- **Per field: build it, or drop it from the line?** Four small decisions, not one,
  and each is asked only where raven does not already model the field. Options per
  field: (a) build it and the card keeps parity with old Biblio, or (b) leave it out
  and the line loses that part for that type. Worth deciding per field rather than
  as a batch — the encyclopedia container is what makes a reference entry legible at
  all, while software version is arguably the detail page's business. Dev with M.

> No screenshot — backend. The lines these fields feed are shown in 02.
