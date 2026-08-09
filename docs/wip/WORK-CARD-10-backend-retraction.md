---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Retraction as a state a work can be in"
labels: backend
---

<!-- Child of the backoffice work-card epic. Backend. -->

## Why

Old Biblio has retraction as one of three reasons a record leaves the site
(`withdrawn`, `retracted`, `takedown`). A retraction is an editorial statement about
the research, not a removal: the work stays public and citable, marked.

Retraction will be built in raven; only the timing is open. No open
raven issue covers it, and whether the work model already carries such a mark is
this issue's first question. This is the backend half — a work can be marked, the
mark travels with it wherever the work is listed, and the act is recoverable. The
card side is 12.

Marie Curator (reviewer) learns of a retraction from the publisher or the
researcher and needs one place to record it that shows up wherever the work
appears.

## What

- [ ] A work can be marked as retracted, and stays public when it is
- [ ] The mark is available wherever the work is listed, not only on its own page
- [ ] The mark records who made it and when, and can be undone later
- [ ] Retraction is distinct from deletion, from a tombstone, and from author
      withdrawal

## Acceptance

- [ ] A retracted work still resolves at its own URL and still appears in result
      lists
- [ ] Every card in a result list shows the mark
- [ ] `make test` passes

## Dependencies

Blocks **12**, the retracted badge on both cards. Related: the display designs for
soft delete and replaced-by are out of scope for the work card and pending with
M (design).

## Open questions

- **Does a retraction carry its own notice text, and who writes it?** The card
  carries the mark; the detail page carries a notice. Options: (a) the notice is
  free text a curator writes; (b) the notice is a link to the publisher's
  retraction statement; (c) both, with one required. This decides what the detail
  page can show and whether curators need a field. Policy — Open Science Policy
  with the curation lead.
- **Is a retracted work excluded from anything?** Exports, harvesting sets, a
  researcher's own publication list. Options: included everywhere with the mark, or
  excluded from selected outputs. Raven's decision — the dev team answers.

> No screenshot — backend. The badge is shown in 12.
