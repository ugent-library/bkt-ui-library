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
   other card, plus one added row for keywords. Not a bespoke component and not a
   `--compact` variant: the reader is scanning works, and a second card shape to
   learn buys nothing. A compact variant may arise for the backoffice later; this
   section is not it.
2. **Card titles sit one level below the section's heading.** The panel owns the
   heading; each card title goes under it, per 01's outline rule.
3. **Resolve the keyword contradiction.** #125's *What* says "Click on a keyword:
   go to search page", and its *Out of scope* says "Keywords themselves clickable,
   but a decent UI pattern is needed". The prototype renders each keyword as a link
   badge, shared ones highlighted. Keep the What, drop the Out of scope line — or
   say which one holds.
4. **Keep the shared-keyword rule as written.** Highlighted for shared, quiet for
   the rest, with a visually-hidden text equivalent so the reason a card is in the
   list survives without sight of it. #125 already requires this; 01 does not
   override it.
5. **Keep #125's empty and sparse rules as written** — show two if there are two,
   omit the section when there are none, omit the "more" link below three. The
   prototype does not contradict them.
6. **The "more related research" link** needs a keyword filter to exist, and needs
   #125's own open question about OR semantics answered. The keyword filter is
   raven#159.

> **Screenshot:** the related research panel on the work detail page
> (`public-work-detail.html`)

## Pending, and not mine to change

#125 carries the lazy-load framing in three places: the *Why* ("the section loads
lazily when scrolled into view"), the *What* ("loads on reveal, not at page load"),
and an acceptance criterion ("section is not fetched until scrolled into view").
That framing no longer matches how the public surface works: public information
belongs in the served HTML, and only interaction-only widgets — an add-to-list
panel's contents, a cite dialog's internals — may load on demand. **M (design) updates
those three places.** Named here so this amendment is not read as silently contradicting
them.

The similarity query's cost is the other half of that change: rendered with the
page, the shared-keyword match is computed on every render unless it is cached or
precomputed. #125 already calls the query expensive, which is why it was lazy —
recorded here as an input to that raven discussion, not a proposal.

## Also worth fixing while in there

#125's acceptance criteria point at `bkt-ui-library/AGENT.md` for the pre-flight
checklist. The file is `AGENTS.md`, and the checklist itself lives in
`docs/ACCESSIBILITY.md`. raven#141 carries the same wrong path.

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/templates/biblio-public/public-work-detail.html` and
`localhost:3111/templates/biblio-public/public-work-detail-dataset.html`.
