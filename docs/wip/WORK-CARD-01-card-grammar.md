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
  curator quick links (04). An item can opt in to a separator; the separator only
  appears between two consecutive items in the same row.
- **the actions row** — sits in the card header, opposite the metadata row.
- **the title** — always a link, and the text a screen reader announces the card by.
- **the contributor line** — prose. Names are separated by plain commas, up to
  ten names, then `et al.`. Each name is a link. Identifier icons sit next to
  the name: inside its span, outside its link. What each icon shows is repeated
  as visually-hidden text inside the link.
- **the reference line** — one line, composed per surface and per work type
  (see issue #02).

Three further rules apply:

- **the title element follows the page outline** — `h2` on public results, `p` on
  backoffice lists, deeper where the outline requires; the class is visual and
  carries no level. This is important for screen readers.
- **result cards are a list** — an ordered list, one card per item, so the count and
  position are announced.
- **card filter links land on the works overview** — the year, journal, project and
  publisher parts link on every card, and the click lands on the works overview with
  that filter applied; on the overview itself and in backoffice lists it narrows the
  list in view. Container and publisher links are string searches on the name; a card
  link never carries an ISSN/ISBN — identifier filtering is applied manually in the
  filter bar (`docs/SEARCH-AND-FILTERING.md` Rule 3, Scoped links).

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
      `bt-work-card__body` and `bt-work-card__footer` are the structural wrappers;
      the border variant for result lists
  - the body also takes block content below the reference line — the backoffice
    message blocks (05). The five regions define the grammar; the body can hold
    more
- [ ] Metadata row — every metadata row on the card, with the opt-in separator
- [ ] Actions row — contents per 06 and raven#141
- [ ] Title — link, accessible name, element per page outline
- [ ] Contributor line — ten names then `et al.`, every name linked, icons outside
      the link, visually-hidden identifier text inside it, "supervised by" on the
      backoffice
- [ ] Reference line — composition per 02 (public) and 04 (backoffice)
- [ ] List wrapper — result cards in an ordered list, one per item
- [ ] Card filter links — year, journal, project and publisher linked on every card,
      landing on the works overview with the filter applied; narrowing in place in
      filterable lists
- `out of scope` The card's CSS — it ships in the design system's stylesheet

The prototype covers the **journal-article happy path** most fully; other types
carry fewer regions. We iterate on top. Flag ambiguity.

- The generated class reference is the contract: the wrappers are
  `bt-work-card__header`, `__body` and `__footer`; `bt-work-card--researcher`
  looks plausible but does not exist in it.
- Icons are the UGent icon font, and decorative — text carries the meaning.
- `public-project-detail.html` breaks two of these rules; the broken lines are
  marked `KNOWN BROKEN`. Port the corrected structure.

_The prototype governs the visible page and markup. Machine-facing output
(`citation_*` tags, Signposting, `?format=` alternates, crawl semantics) is governed
by `docs/public-site-semantics.md` — preserve as-is. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/patterns/work-card.html`, and the surfaces it governs:
`.../templates/biblio-public/public-works.html`, `.../templates/biblio-team/curate.html`.

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
- Filter links: year is raven#157, project and keyword raven#159, URL state
  raven#156, container **09**. Until one lands, render that part as text.

## Open questions

None.
