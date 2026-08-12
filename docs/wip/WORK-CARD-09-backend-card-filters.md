---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Filter works by container — the venue a card links to"
labels: backend
---

<!-- Child of the public work-card epic. Backend. Narrow on purpose: this issue
     only covers the missing container filter. Year and URL state already have
     homes, listed under Dependencies. -->

## Why

A card can link parts of its metadata line to filtered work lists.

- On a detail page, the link opens the works overview with that filter applied.
- In a filterable list, the link narrows the current list and updates the URL.

Year is already covered by the sidebar facet in raven#157, and URL state by
raven#156. Project and keyword filtering belong to raven#159. **Container is the
missing filter**:

- it is the journal, proceedings volume, magazine, newspaper or book; the venue a
  lecture, media appearance or online post appeared in; and the publisher where it is
  the container itself (preprint, dataset, software: bioRxiv, Zenodo);
- it is the middle of every public reference line, and the part curators recognise a
  record by on the backoffice scan line;
- without it the journal, repository, book or venue name is text, which is not
  feature parity with the old Biblio.

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

- [ ] Add a **container** filter for the journal, proceedings, magazine, newspaper
      or book the work appeared in; the venue for public-engagement types (lecture,
      media appearance, online post); and the publisher where the publisher is the
      container (preprint, dataset, software)
- [ ] Match the container title as stored
- [ ] The filter is available on the public surface and in the backoffice lists
- [ ] The link carries the same URL shape as the rest of the search state

## Acceptance

- [ ] Clicking the journal on a card in a filterable list narrows that list to that
      venue
- [ ] Every container filters on its title, whether or not it carries an ISSN or
      ISBN — a seminar venue filters like a journal
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
- **Project** is raven#159. Public cards do not show project links; backoffice
  cards use project links in **04**.
- **Keyword** is also raven#159. The related-works panel's "more related research"
  link (07) needs it, including the OR/AND rule for several shared keywords.
- The URL state contract is raven#156. The prototype's `?year=` and `?container=`
  parameters are placeholders, not a proposal.

> No screenshot — backend. The links it enables are shown in 01, 02, 04 and 07.
