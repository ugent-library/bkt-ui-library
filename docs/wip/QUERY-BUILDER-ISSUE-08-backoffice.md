---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice][08] Advanced search: the backoffice field set"
---

<!-- Refile source for raven #295, the phase-2 placeholder. -->

## Why

Marie Curator (reviewer/curator) needs deposit status, classification and record dates
without leaving the works list.

## What

- [ ] The backoffice works lists open the public builder dialog unchanged
- [ ] The chooser adds the backoffice-only fields from the field contract
- [ ] Access level and Organization gain "is not" on this surface
- [ ] Every condition caps at twenty values on this surface
- [ ] The identifier box reports what it kept, what went over the cap and what it
      did not recognise
- [ ] The public chooser never offers a backoffice field or operator
- `out of scope` Public fields and controls — #225, #226

**Prototype:** the backoffice list dialogs (curation and researcher works), after the
reveal.

The prototype governs visible UI and markup. Prototype URLs are placeholders. UI copy
uses Raven's translation files.

## Acceptance criteria

- [ ] Matches the prototype
- [ ] Passes `docs/ACCESSIBILITY.md` pre-flight
- [ ] `make build` passes

## Dependencies

Blocked by #225 and #226. #284 decides JCR exposure. Raven names the record-history
id and the reviewed timestamp.

## Open questions

- Which backoffice fields ship? The contract's backoffice tables are the proposal.
- The Classification, VABB and JCR value lists are mock values; raven's catalogs
  confirm them.
