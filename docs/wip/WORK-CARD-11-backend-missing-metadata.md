---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] What a record is missing, per record, in a list"
labels: backend
---

<!-- Child of the backoffice work-card epic. Backend. -->

## Why

The message blocks in 05 open with a line naming what a record is missing — one list
for the researcher, one for the curator. Nobody types it. The question this issue
settles: does raven model completeness per record, ready for fifty cards on a
curator's screen at once — and if not, do we build it, or do 05's missing-items
lines go?

The two lists are fixed in `docs/DOMAIN-VOCABULARY.md` → "Messages on backoffice
cards": the researcher's covers what only they can supply, the curator's covers
bibliographic work.

Marie Curator (reviewer) asked for the list to show completeness — a complete
record is not necessarily a correct one, and she needs to see which is which
before opening anything. It also catches the confident guesses of Guy Guest
(proxy): a record he called finished shows its gaps on its card.

## What

- [ ] The researcher list, per record, per `docs/DOMAIN-VOCABULARY.md` → "Messages
      on backoffice cards": full text, DOI or WoS identifier, title, abstract,
      authors, keywords, projects
- [ ] The curator list, per record, same source: journal, publisher, year, ISSN,
      volume, issue, pages
- [ ] A field the work type does not carry is never counted as missing
- [ ] Both answers available for every card in a result list
- [ ] "Missing X" is filterable in the backoffice lists — the curator sidebar's
      counts (records missing a licence, missing a full text) rest on it. Nothing
      about completeness reaches the public surface
- [ ] The documented priority order preserved, so the line reads in that order

## Acceptance

- [ ] A list of fifty cards renders both lines
- [ ] A dataset is never reported as missing an ISSN, and a lecture is never
      reported as missing a full text
- [ ] One definition of missing, not two — these lists and the workflow's
      required-field checks never disagree
- [ ] `make test` passes

## Dependencies

Blocks **05**.

## Open questions

None. The filterability requirement lives in the What.

> No screenshot — backend. The lines it feeds are shown in 05.
