---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Work fields the card's reference line needs"
labels: backend
---

<!-- Child of the public work-card epic. Backend. -->

## Why

Five reference lines in #184 carry a field raven's registry does not place yet. Raven
keeps every field old Biblio already carries, so all five need a home in the
registry: the reference entry's encyclopedia, publisher and pages sit under `misc`
in old Biblio today, magazine and newspaper articles carry their pages, and the
publisher of a dataset or a software record is its repository.

Which types and which fields, marked ⚑ in the spec:
`docs/wip/WORK-CARD-REFERENCE-STYLES.md` → "⚑ Remaining — raven gaps to raise".

## What

Per field: place it in raven's registry, and feed the line in #184 from the stored
value.

- [ ] **Reference entry** — the container title (the encyclopedia or dictionary),
      the publisher, and the pages. Old Biblio carried all three under
      `misc`
- [ ] **Magazine article** and **newspaper article** — pages
- [ ] **Dataset** and **software** — the publisher. Their publisher is the
      repository, the name the old backoffice already stores; the public line prints
      it where a journal title sits and reads "(2026) Zenodo.", and the backoffice
      scan shows the same field. Both types compose the same line, so whatever
      settles for dataset settles for software. Raven's own docs disagree on whether
      a dataset may carry it — its migration map brings old Biblio's dataset
      publisher across, its per-type applicability list leaves datasets out — and
      reconciling those two is this issue's work

## Acceptance

- [ ] Each ⚑ field has a place in raven's registry, or a recorded decision not to
      model it
- [ ] A dataset and a software record each render "(2026) Zenodo." from their stored
      publisher, on the public line and the backoffice scan
- [ ] Each built field renders its line in #184 from real data, not placeholder text
- [ ] No type is given a field it should not carry
- [ ] `make test` passes

## Dependencies

Blocks the ⚑ types in #184. The other 18 types do not wait for this.

## Open questions

None.

> No screenshot — backend. The lines these fields feed are shown in #184.
