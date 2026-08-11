---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public][backoffice] Work card: one markup grammar for every surface"
---

## Why

Today's cards are built per page:
- a Perl template on the public site
- a templ component in the backoffice
- a third for datasets there

None of the three names its regions, so the same visual row is composed differently
wherever it appears.

In raven one grammar serves every work card, and the payload is what varies:

- **the metadata row** — a row of items. On the public card the header row holds
  access and type, and that is all it holds. The backoffice fills the same construct
  more often: departments, projects and VABB are each their own metadata row, and the
  provenance footer holds two more — the Biblio ID with its audit trail, and the
  curator quick links (04).
- **the actions row** — sits in the card header, opposite the metadata row.
- **the title** — always a link, and the text a screen reader announces the card by.
- **the contributor line** — prose. First name, middle are printed as initials,
  then surname ("Mark B. De Moor") on both surfaces, separated by plain commas,
  and each name is a link.
  Both surfaces show up to ten names, then the count of what
  is left ("+3 more authors"); the public card puts `et al.` before that count, the
  academic form a reader expects in a citation.

  Old Biblio truncates at ten on the public card and at three in the backoffice —
  we now truncate on ten everywhere, and the count on the public card, are the new parts.
  Identifier icons sit next to the name: inside its span, outside its link.
  What each icon shows is repeated as visually-hidden text inside the link.

  **Every name is a link, and the identifier icon says where it goes.** A person page
  needs an identified person, so raven holds a page for exactly the contributors it
  holds a person record for — the same set the crest already marks:

  - a name carrying an identifier icon — that person's page;
  - a name carrying none — an external co-author, an organisation, free text — a works
    search on the name as text (`?q=`), on both surfaces.

  The second is a **search, not a filter**: the result is what the string matches, so
  two people of one name return one result set. That is the reason the page does not
  exist, not a shortcoming of the link. Old Biblio links them the same way.

  This makes the icon load-bearing on both surfaces, which today it is not: the public
  card uses the crest as an *affiliation* label (it covers UZGent and GUK), the
  backoffice uses it for *has an internal person record*. Those two readings have to
  become one, and the rule above is that one. If we have no ID, we can not give a page
  (this is a decision deferred, not taken).

  **The role that fills the line is per type**: authors, and editors for `edited_book`
  and `journal_issue`. The per-type table in
  `docs/wip/WORK-CARD-REFERENCE-STYLES.md` names it per line. Supervisors stay off the
  public card, as they stay out of a citation of a thesis; the backoffice card shows
  them as "supervised by".
- **the reference line** — one line, composed per surface and per work type
  (see issue 02).

Three further rules apply:

- **the title element follows the page outline** — `h2` on public results, `p` on
  backoffice lists, deeper where the outline requires; the class is visual and
  carries no level. This is important for screen readers.
- **result cards are a list** — an ordered list, one card per item, so the count and
  position are announced.
- **card filter links land on the surface's works overview** — the year, the container
  (journal, host title, proceedings, magazine, newspaper, venue) and the publisher where
  it is the container. Each part is a link wherever the card carries it, and the click
  lands on the surface's works overview with that filter applied;
  on the overview itself and in backoffice lists it narrows the list in view.
  Container and publisher links are string searches on the name; a card link never
  carries an ISSN/ISBN — identifier filtering is applied manually in the filter bar
  (`docs/SEARCH-AND-FILTERING.md` Rule 3, Scoped links).
  The card carries no project part: projects live on the detail pages.

### Notes on the target groups

Marie Curator (reviewer) scans result lists all day in a narrow split-screen
pane; Sue Kerr (academic reader) gets seconds per card. Both need the same
information in the same place on every card. Neither ever sees the grammar.

### How it ships

Ships first, with the public card. **Every region is fillable, never hardcoded to the
public card's contents.**

- The backoffice card is this same card with more on it — extra items and blocks,
  two regions rendered differently.
- 02, 03 and 09 fill regions now; 04–06 and 12 fill the rest later, without forking
  the card.
- A backoffice row that needs a region this contract lacks means changing this
  contract, never adding a one-off region on the backoffice card.

> **Screenshot:** the grammar section of the kit page (`patterns/work-card.html`)

## What

- [ ] Card container: an `<article>` named by its title; `bt-work-card__header`,
      `bt-work-card__body` and `bt-work-card__footer` are the structural wrappers
  - the body also takes block content below the reference line — the backoffice
    message blocks (05). The five regions define the grammar; the body can hold
    more
- [ ] Metadata row — every metadata row on the card
- [ ] Actions row — contents per 06, raven#141
- [ ] Title — link, accessible name, element per page outline
- [ ] Contributor line — ten names on both surfaces, then the count; the public card
      puts `et al.` before it. Icons outside the link, visually-hidden identifier text
      inside it, "supervised by" on the backoffice card only
- [ ] Contributor links — person page where raven holds one, a works search on the
      name (`?q=`) for every other name, on both surfaces. No unlinked contributor
- [ ] Reference line — composition per 02 (public) and 04 (backoffice)
- [ ] List wrapper — result cards in an ordered list, one per item
- [ ] Card filter links — year, container and publisher-as-container, each linked
      wherever the card carries that part, landing on the surface's works overview
      with the filter applied; narrowing in place in filterable lists
- `out of scope` The card's CSS — it ships in the design system's stylesheet

**Which surfaces this changes** — every raven view that lists works with a card:

- the public works overview;
- the embedded lists on the researcher, organisation and project pages;
- the related-research panel on a record page;
- the backoffice lists.

They are separate templates today; this contract makes them one. The card keeps the
actions it has — Cite and Add to list on the public card, review and edit on the
backoffice — and 06, raven#141 owns its contents.

**The markup is shared; the backoffice payload is not.** The public epic puts the
backoffice card out of scope because status, messages and actions are the sibling
epic's. Build every region fillable and the backoffice fills them differently, without
forking the card.

The prototype covers the **journal-article happy path** most fully; other types
carry fewer regions. We iterate on top. Flag ambiguity.

- The generated class reference is the contract: the wrappers are
  `bt-work-card__header`, `__body` and `__footer`; `bt-work-card--researcher`
  looks plausible but does not exist in it.
- Icons are the UGent icon font, and decorative — text carries the meaning.

_The prototype governs the visible page and markup. Machine-facing output
(`citation_*` tags, Signposting, `?format=` alternates, crawl semantics) is governed
by `docs/public-site-semantics.md` — preserve as-is. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library), deployed at [bkt-ui.vercel.app](https://bkt-ui.vercel.app).
Run it locally with `npm start` and the same paths on `localhost:3111`.

View the [patterns/work-card.html](https://bkt-ui.vercel.app/patterns/work-card.html), and the surfaces it governs:
[templates/biblio-public/public-works.html](https://bkt-ui.vercel.app/templates/biblio-public/public-works.html), [templates/biblio-team/curate.html](https://bkt-ui.vercel.app/templates/biblio-team/curate.html).

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Every result list is a list, and its cards are its items
  - [ ] No heading level is skipped on any page that renders cards
  - [ ] Each card carries its own accessible name
  - [ ] Identifier information reaches a screen reader as text
- [ ] Every class used exists in the generated class reference
- [ ] `make build` passes

## Dependencies

- Blocks 02 and 03 here, and 04, 05, 06 and 12 in the backoffice epic.
- Filter links: year is raven#157, URL state raven#156, container **09**. Until one
  lands, render that part as text.
- **Crawler treatment of those links** — `rel="nofollow"`, and whether the works
  overview needs protecting from a faceted crawl trap — belongs to raven's
  `docs/public-site-semantics.md`, audited by Rubric. Decide it there; this issue
  invents no rule.

## Open questions

None.
