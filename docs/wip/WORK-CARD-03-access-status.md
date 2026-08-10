---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[public] Work card: the access badge"
---

## Why

Access on today's public card is an icon:

- a green arrow with "open access" when a file is open
- the same arrow without the words when the reader's IP sits in a configured campus
  range and the file is restricted
- a grey padlock when it is restricted and they are outside it

Embargo is not surfaced, and private files render nothing.

In raven it is one badge naming the state in words, the same for every reader:
**Open access**, **Restricted access**, **Embargo until \<date\>**, **Closed
access**.

- which state a work is in follows the documented open-access definition —
  raven#164 owns that; this issue owns how the answer looks;
- only open access carries colour;
- restricted and embargo are correct outcomes rather than warnings, so both render
  neutral and are told apart by their icons;
- closed access renders as text alone — the padlock belongs to restricted.

Colour, icon and class per state are fixed in `bkt-ui-library/docs/CLASS-USAGE.md` →
Badges, and shown on the kit page.

**A card may carry no access badge.** Eight of the 23 types routinely have no file,
and a private file must leave no public trace — no badge, no count, not even the
fact that a file exists. Showing nothing is the design; a card without an open,
restricted or embargoed file simply has no access element.

### Notes on the target groups

Carrie Curious (curious public) and Pia Practice (practitioner) both read
"restricted" as broken unless the card says otherwise, and neither knows what an
embargo is unless it names the date. Sue Kerr (academic reader) scans for the
works she can open — colour only where the answer is yes.

> **Screenshot:** the four states on the kit page (`patterns/work-card.html`, the
> `__meta` demo)

> **Screenshot:** a feed card with no access badge (a lecture or conference
> presentation in `public-works.html`)

## What

- [ ] Access badge on the public card, in the metadata row before the work type
  - Open access — coloured, open-access icon
  - Restricted access — neutral, lock icon
  - Embargo until \<date\> — neutral, time icon, badge names the date
  - Closed access — neutral, text only, no icon
- [ ] One badge per work, per the definition in raven#164 — not one per file
- [ ] No access element when the work has no files, or only private ones
- [ ] Every state renders identically logged in, logged out, on and off the UGent
      network — the badge states what the file is, not who the reader is
- `out of scope` Access as plain text on backoffice cards — 04
- `out of scope` Which works qualify as open access — raven#164
- `out of scope` Access CTAs on cards — raven#153
- `out of scope` The retracted badge — 12, same row, waits on raven modelling
  retraction
- `out of scope` Diamond OA and heritage badges — no design yet
- `out of scope` Withdrawal and takedown — deletion states, not badges; design
  pending, named in the backoffice epic

The prototype covers **all four states plus the empty case**. We iterate on top.
Flag ambiguity.

- Access badges use exactly the classes in that recipe; treat `text-bg-warning` on
  any older template as drift to replace.
- Icons are decorative; the badge text carries the meaning.

_The prototype governs the visible page and markup. Machine-facing output
(`citation_*` tags, Signposting, `?format=` alternates, crawl semantics) is governed
by `docs/public-site-semantics.md` — preserve as-is. UI copy goes through the
translation files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/templates/biblio-public/public-works.html` and
`localhost:3111/patterns/work-card.html`.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] A work with only private files renders exactly like one with no files — in the
      HTML, not only on screen
- [ ] The embargo badge carries the release date in the public date format
      (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI")
- [ ] The same record renders the same badge anonymously, logged in, and from the
      campus network
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Access state never rests on colour or icon alone
  - [ ] Badge contrast holds in both surface themes
- [ ] `make build` passes

## Dependencies

- Blocked by **01**. Nothing else.
- raven#164 decides which works qualify as open access; raven#141 settles the file
  and access metadata the badge reads. Do not restate either.

## Open questions

None.
