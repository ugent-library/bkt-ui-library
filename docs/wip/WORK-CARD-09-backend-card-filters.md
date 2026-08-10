---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Filter works by container — the venue a card links to"
labels: backend
---

<!-- Child of the public work-card epic. Backend. Narrow on purpose: the other
     filters the card links to already have homes, listed under Dependencies. -->

## Why

The public site today links the year and the parent title on every card into a
search. In raven the card's filter links — year, journal, project — land on the works
overview with the filter applied, on every card; on the overview itself and in
backoffice lists the click narrows the list in view (01).

Year, project and keyword are owned by open raven issues (Dependencies). **The
container** is covered by none:

- it is the journal, proceedings volume, magazine or book, and the publisher where it
  is the container itself (preprint, dataset, software: bioRxiv, Zenodo);
- it is the middle of every public reference line, and the part curators recognise a
  record by on the backoffice scan line;
- whether raven's search already offers it is this issue's first question. Without
  it the journal name is text and the most obvious click on the card does nothing.

The filter matches the container title as stored, the way public Biblio does today
(`parent exact "<title>"`):

- every container filters, whether or not it carries an identifier;
- two spellings of one journal are two result sets, and a journal that changed name
  is two venues — both accepted, and both true of the site today;
- a backoffice link matches what the scan line shows — the short title when the
  record carries one, otherwise the full title, keeping the old backoffice's
  behaviour;
- one journal is two result sets across the two surfaces — accepted.

### Notes on the target groups

Marie Curator (reviewer) shares result sets as bookmarked URLs, so the link has
to produce a state that survives copying. Sue Kerr (academic reader) follows the
same link to browse, and never needs to know it is a filter.

## What

- [ ] Filter works by **container** — the journal, proceedings, magazine, newspaper
      or book the work appeared in, and the publisher where it is the container
      (preprint, dataset, software) — matched on the container title as stored
- [ ] The filter is available on the public surface and in the backoffice lists
- [ ] The link carries the same URL shape as the rest of the search state

## Acceptance

- [ ] Clicking the journal on a card in a filterable list narrows that list to that
      venue
- [ ] A container without an ISSN or ISBN filters like any other
- [ ] A backoffice link matches the displayed string — short title if available,
      otherwise the full title
- [ ] The resulting URL can be copied, shared and reloaded to the same result set
- [ ] On a card on a detail page the same link lands on the works overview,
      filtered to that venue
- [ ] `make test` passes

## Dependencies

- Blocks the journal link in **01** and **02**, and in **04** when the backoffice
  epic runs.
- **Year** is a sidebar facet in raven#157; the card's year link narrows on it
  rather than on anything new.
- **Project** and **keyword** are raven#159. The related-works panel's "more
  related research" link (07) needs the keyword one, and raven#125's open question
  about matching several keywords with OR semantics is its precondition.
- The URL state contract is raven#156. The prototype's `?year=` and `?container=`
  parameters are placeholders, not a proposal.

> No screenshot — backend. The links it enables are shown in 01, 02, 04 and 07.
