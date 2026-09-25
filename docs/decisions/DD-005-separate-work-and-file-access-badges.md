# DD-005 — Separate work and file access badges

Status: Accepted
Date: 2026-09-25
Scope: Public

## Decision

The access badge on a work card or detail heading is prominent. Each file row uses a
quieter badge for its own access. Both levels keep the same access meanings and icons.
Only open access carries colour; restricted and embargoed files stay neutral.

## Because

The work badge summarizes the best available full-text access. A file badge describes
one item in a list that may contain different access levels. Equal visual weight makes
the file badges compete with the work summary and blurs which level each badge describes.

## Trade-off

Individual file access is less prominent. The label, icon, release date and Download
action must still make each file's current availability clear without relying on colour.

## Revisit when

Reader testing shows that people miss a file's access level or mistake the work summary
for a promise that every file is downloadable.

## References

- [`docs/DOMAIN-VOCABULARY.md`](../DOMAIN-VOCABULARY.md)
- [`elements/badges.html`](../../elements/badges.html)
- [`templates/biblio-public/public-work-detail.html`](../../templates/biblio-public/public-work-detail.html)
