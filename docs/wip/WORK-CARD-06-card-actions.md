---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice] Work card: actions per role and state"
---

> The **public** card's action row is outside this issue: Add to list is #166,
> access CTAs are #153, and Cite still needs its own issue. This issue is the
> backoffice half, which no issue covers.

## Why

The card action answers one question: what can this user do with this record now?

- curator, **submitted** → Review; editing happens inside the review mode when a
  curator needs to intervene
- curator, **returned** → View, not primary; the record is done; curators can still
  intervene after opening the work
- curator, **draft** → View
- curator, **reviewed** → View, not primary; the record is done
- researcher, **draft** → Continue, with Delete draft in the more menu for their
  own draft
- researcher, **returned** → Edit & resubmit; the label names both steps, because
  editing without resubmitting leaves the record where it was
- researcher, **submitted** → Edit; the record is awaiting review, but the owner can
  still change it
- researcher, **reviewed** → Request changes, plus View public page where the record
  is public; View Altmetric sits in the more menu when an Altmetric link exists

A researcher edits their own record in two ways. When in draft, submitted or returned:
they edit it directly, whatever the record's visibility.
Once it is reviewed, they suggest a change, which becomes a pending request.

One primary per card at most. Navigating actions are links. Every action name
identifies the record.

> **Screenshot:** role/state action matrix
> **Screenshot file:** `06--role-state-actions-matrix.png`

> **Screenshot:** curator Review action and researcher submitted Edit action
> **Screenshot files:** `04-05-06--curator-submitted-card.png`,
> `06--researcher-submitted-edit-card.png`

> **Screenshot:** researcher reviewed more menu with Altmetric
> **Screenshot file:** `06--researcher-altmetric-more-menu.png`

## What

- [ ] Backoffice actions per role and state, as listed above
- [ ] Draft delete appears for the user's own draft. Raven grants `delete_draft`
      on own draft works only; non-draft records and other users' drafts do not
      show the action
- [ ] Researcher draft actions render as one action group: more-actions menu for
      Delete draft, then primary Continue
- [ ] Researcher cards with an Altmetric link expose "View Altmetric" in the
      more-actions menu
- [ ] One primary per card at most
- [ ] Each action's accessible name carries the record's title
- [ ] Icon-only actions are fully named to assistive technology
- [ ] Actions that navigate are links; actions that act on the page are buttons
- `out of scope` The public action row. Add to list is #166; access CTAs are
  #153; Cite still needs its own issue.
- `out of scope` The curator quick-links row — part of #189
- `out of scope` Non-draft delete, soft-delete restore, Send to ORCID, batch actions

The prototype covers **every row listed** in the matrix, plus representative card
examples. The proxy role comes later.

- An action a user cannot perform is absent, not disabled.
- The Altmetric link is UGent deployment configuration, not core raven; the action
  renders when the deployment provides the link.

_The prototype governs the visible page and markup. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-team/curate.html](https://bkt-ui.vercel.app/templates/biblio-team/curate.html) and
[templates/biblio-researcher/search-researcher.html](https://bkt-ui.vercel.app/templates/biblio-researcher/search-researcher.html); the roles and views matrix is on the
[patterns/work-card.html](https://bkt-ui.vercel.app/patterns/work-card.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] Every state renders its row; no row carries two primaries
- [ ] The action names alone identify the record each acts on
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Keyboard reaches every action in list order
  - [ ] Icon-only actions have accessible names
- [ ] `make build` passes

## Dependencies

- Blocked by #180 and #189.
- Review, Continue, Edit & resubmit, Request changes and View public page each need
  a destination; where a flow does not exist yet the action waits rather than
  shipping as a dead link.
- Request changes creates a pending request
  (`bkt-ui-library/docs/DOMAIN-VOCABULARY.md` → "Accepted value and pending
  request"): the record keeps its accepted values on the public site while the
  request waits, and a message rides the request. Raven does not model pending
  requests yet, design is also under review.
- The reviewer "next record" flow is a separate workflow issue. This issue only
  makes the action available from the card.

## Open questions

- **Can a researcher edit their own submitted record directly according to Raven?**
  The design intends it — the two-way rule above. In raven today, an owner edits
  their own drafts and returned records; only curators edit submitted records.
  To clear out on the raven side; until then the Edit action on a researcher's
  submitted card waits.
