---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice] Work card: actions per role and state"
---

> The **public** card's action row is specified in raven#141 — Cite and Add to list,
> quiet, no access CTA. This issue is the backoffice half, which no issue covers.
> Add to list shows for every visitor, and an anonymous click routes through login
> and back — kept from today's behaviour, and what `patterns/panel.html` documents.
> That rule belongs on raven#141; M (design) carries it there.

## Why

The old backoffice card carries a View button plus a dropdown mixing navigation with
tools — publication, files, DOI, Web of Science, PubMed for curators, Altmetric for
everyone else, delete where permitted. The action the record's state calls for is
not among them: a review cannot start from the list, and a returned record offers
its owner no way back in.

In raven the row answers one question — what is there to do with this record, now,
by me — so it follows role and state:

- curator, **submitted** → Review (primary) + Edit as a quiet icon
- curator, **returned** → View; the record is the researcher's turn
- researcher, **draft** → Continue + Edit
- researcher, **returned** → Edit & resubmit; the label names both steps, because
  editing without resubmitting leaves the record where it was
- researcher, **submitted** or **reviewed** → Edit, plus View public page where the
  record is public

One primary per card at most. Every action names the record in its accessible name,
so the fifth "Edit" in a list is not ambiguous. Actions that navigate are links —
the rule raven#141 sets for the public row.

Marie Curator (reviewer) wants fewer things on the card and the review to start
where she already is. Claire Searcher (researcher) and Otto Thor (researcher) want
to correct their own records rather than ask someone to.

> **Screenshot:** the five rows — curator submitted, curator returned, researcher
> draft, researcher returned, researcher reviewed (`curate.html`,
> `search-researcher.html`)

## What

- [ ] Backoffice actions per role and state, as listed above
- [ ] One primary per card at most
- [ ] Each action's accessible name carries the record's title
- [ ] Icon-only actions are fully named to assistive technology
- [ ] Actions that navigate are links; actions that act on the page are buttons
- `out of scope` The public action row — raven#141. Access CTAs — raven#153.
- `out of scope` The curator quick-links row — part of 04
- `out of scope` Delete, Altmetric, Send to ORCID, batch actions

The prototype covers **every row listed**. The proxy role comes later. We iterate
on top. Flag ambiguity.

- An action a user cannot perform is absent, not disabled.

_The prototype governs the visible page and markup. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/templates/biblio-team/curate.html` and
`.../biblio-researcher/search-researcher.html`; the roles and views matrix is at
`localhost:3111/patterns/work-card.html`.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] Every state renders its row; no row carries two primaries
- [ ] The action names alone identify the record each acts on
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Keyboard reaches every action in list order
  - [ ] Icon-only actions meet the minimum target size
- [ ] `make build` passes

## Dependencies

- Blocked by **01** and **04**.
- Review, Continue, Edit and Edit & resubmit each need a destination; where a flow
  does not exist yet the action waits rather than shipping as a dead link.

## Open questions

None.
