---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Work fields the card's reference line needs"
labels: backend
---

<!-- Child of the public work-card epic. Backend. -->

## Why

Four reference lines in 02 carry a field raven's registry does not place yet. Raven
keeps every field old Biblio already carries, so all four need a home in the
registry: the reference entry's encyclopedia, publisher and pages sit under `misc`
in old Biblio today, magazine and newspaper articles carry their pages, and a
dataset's publisher is its repository.

Which types and which fields, marked ⚑ in the spec:
`docs/wip/WORK-CARD-REFERENCE-STYLES.md` → "⚑ Remaining — raven gaps to raise".

## What

Per field: place it in raven's registry, and feed the line in 02 from the stored
value.

- [ ] **Reference entry** — the container title (the encyclopedia or dictionary),
      the publisher, and the pages. Old Biblio carried all three under
      `misc`
- [ ] **Magazine article** and **newspaper article** — pages
- [ ] **Dataset** — the publisher. A dataset's publisher is its repository, the
      name the old backoffice already stores; the public line prints it where a
      journal title sits and reads "(2026) Zenodo.", and the backoffice scan shows
      the same field. Raven's own docs disagree on whether a dataset may carry it —
      its migration map brings old Biblio's dataset publisher across, its per-type
      applicability list leaves datasets out — and reconciling those two is this
      issue's work

## Acceptance

- [ ] Each ⚑ field has a place in raven's registry, or a recorded decision not to
      model it
- [ ] A dataset renders "(2026) Zenodo." from its stored publisher, on the public
      line and the backoffice scan
- [ ] Each built field renders its line in 02 from real data, not placeholder text
- [ ] No type is given a field it should not carry
- [ ] `make test` passes

## Dependencies

Blocks the ⚑ types in **02**. The other 18 types do not wait for this.

## Open questions

None.

> No screenshot — backend. The lines these fields feed are shown in 02.
