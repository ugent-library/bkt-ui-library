---
name: Amendment
about: Changes to an existing raven issue — not a new issue
title: "Amendment to raven#125 — related-works match card"
---

> **Not a new issue.** raven#125 ("[feedback needed] [public] Add related research
> section to work detail page") already owns this section. Read against its current
> text (read 2026-08-06); everything below is a change to it.

## Amend

1. **The match card is the standard work card.** #125 describes it as "title,
   truncated author list, type · year, keyword badges". Replace that with the card
   grammar in **01** — the same five regions and the same list wrapper as every
   other card, plus one added row for keywords. The reader is scanning works, so this
   section uses the card they already know — not a bespoke component, not a
   `--compact` variant. If the backoffice needs a compact variant later, design it
   there.
2. **Card titles sit one level below the section heading.** The panel carries the
   section heading, and each card title nests one level under it, per the outline
   rule in 01.
3. **Resolve the keyword contradiction.** #125's *What* says "Click on a keyword:
   go to search page", and its *Out of scope* says "Keywords themselves clickable,
   but a decent UI pattern is needed". The prototype renders each keyword as a link
   badge, shared ones highlighted. Keep the What, drop the Out of scope line — or
   say which one holds.
4. **Keep the shared-keyword rule as written.** Highlighted for shared, quiet for
   the rest, with a visually-hidden text equivalent so the reason a card is in the
   list survives without sight of it. #125 already requires it, and nothing in 01 changes it.
5. **Keep #125's empty and sparse rules as written** — show two if there are two,
   omit the section when there are none, omit the "more" link below three. The
   prototype does not contradict them.
6. **The "more related research" link** is blocked twice over: the keyword filter it
   points at is raven#159 and still has to be built, and #125's own open question
   about OR semantics has to be answered.

> **Screenshot:** the related research panel on the work detail page
> (`public-work-detail.html`)

## Pending on #125 itself

#125 carries the lazy-load framing in three places: the *Why* ("the section loads
lazily when scrolled into view"), the *What* ("loads on reveal, not at page load"),
and an acceptance criterion ("section is not fetched until scrolled into view").
That framing no longer matches how the public surface works: public information
belongs in the served HTML, and only interaction-only widgets — an add-to-list
panel's contents, a cite dialog's internals — may load on demand. **Those three
places need correcting.** Listed here so nobody reads this amendment as quietly
contradicting #125.

Serving the section with the page has a cost: the shared-keyword match is then
computed on every render, unless it is cached or precomputed. #125 already calls the
query expensive, which is why it was lazy. Recorded as an input to that discussion,
not a proposal.

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [templates/biblio-public/public-work-detail.html](https://bkt-ui.vercel.app/templates/biblio-public/public-work-detail.html) and
[templates/biblio-public/public-work-detail-dataset.html](https://bkt-ui.vercel.app/templates/biblio-public/public-work-detail-dataset.html).
