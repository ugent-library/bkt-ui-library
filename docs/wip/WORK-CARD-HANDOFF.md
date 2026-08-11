# Handoff — work-card issues

Paste into a new session:

```
Read AGENTS.md in the booktower-ui-library repo root and follow the session start
instructions. Then read docs/wip/WORK-CARD-HANDOFF.md and continue from it.
Task: <state the task>.
```

## State

Fifteen documents in `docs/wip/` besides this one, named `WORK-CARD-*` — two epics,
eleven children, one amendment (07), plus `WORK-CARD-REFERENCE-STYLES.md`:

- `WORK-CARD-00-EPIC-public.md` — children 01 grammar, 02 reference line, 03 access
  badge, 08 backend fields, 09 backend container filter. **Ready to file.** M files
  them.
- `WORK-CARD-00-EPIC-backoffice.md` — children 04 card, 05 messages, 06 actions, 12
  retracted badge, 10 backend retraction, 11 backend missing-metadata. **Ready to
  file once 04's policy question is answered**; the public epic goes first, because
  01 blocks 04.
- `WORK-CARD-07-match-card-amendment.md` — edits to raven#125, not a new issue.

## Decisions this round — prototype swept against the public epic

A review of the filed public issues against the prototype produced these. All are
applied to `docs/wip/` and the prototype; **the filed issues #180–#185 still carry
the old wording** and are M's to update.

- **Every contributor name is a link.** A contributor raven holds a page for goes to
  that page; every other name — an external co-author, an organisation, free text —
  runs a works search on itself (`?q=`), as old Biblio does. It is a **search, not an
  author filter**: a name with a namesake returns both. The muted unlinked
  contributor is gone from the card, the kit page, `docs/CLASS-USAGE.md` and
  `docs/SEARCH-AND-FILTERING.md` (Rule 3 and Scoped links).
- **Public cards carry no project part.** Projects live on the detail pages and in
  backoffice cards. Year, container and publisher-as-container are the public card's filter
  links; project is struck from 01, the public epic, the search doc and the kit prose.
- **Ten names on both surfaces**, then the count; the public card puts `et al.`
  before it. The backoffice's three-name truncation is dropped, and the
  related-research panel follows the public rule. Supervisors stay on the backoffice
  card.
- **The publisher-as-container takes `<cite>` and the filter link** — Zenodo and
  bioRxiv render like any other container name.
- **Closed access should not be shown on the public page.** A public card's access
  vocabulary is open, restricted and embargo; a work whose files are all closed carries
  no access element on the public page, the way no file and a private file already do.
  Closed or private renders on a backoffice record page's file rows with `if-forbid`
  and in the backoffice cards.
- **The card's CSS left the issue.** The border variant and the opt-in separator are
  styling, documented in `docs/CLASS-USAGE.md`; 01 states neither.
- **raven#141 was retitled and rescoped** to "Access CTA v1 — no direct file access".
  It composes the public row; **raven#166 owns the Add to list panel** and already
  settles the anonymous case; **Cite has no issue yet**. Every doc that said #141
  owns Add to list is corrected.

## Decisions — the identifier icon says where a name goes

- **A page needs an ID.** Raven gives a person page to the contributors it holds a
  person record for, and to no one else: two "Jan Janssens" without an ID cannot be
  told apart. Profiles for people outside the institution are a later bridge.
- **So the icon is the marker, and no new style is needed.** A name carrying the crest
  or ORCID links to that person's page; a name carrying neither runs a works search on
  itself. Applied in `search-result-cards.js` — `author()` now derives the destination
  from the icons, so a crest without a page, or a page without a crest, cannot be
  written.
- **The public crest and the backoffice crest have to mean the same thing.** Today the
  public card reads it as affiliation (it covers UZGent and GUK), the backoffice as
  "has an internal person record" — `docs/analysis/WORK-CARD-CURRENT-STATE.md` flags
  the split. The rule above collapses them.
- **Placeholder roster made consistent.** Stefan K. Arndt is external everywhere, Jonas
  Maes and Pieter Vangansbeke are UGent everywhere; before this each was both,
  depending on the card.

## Decisions — the contributor line reads as prose

- **One name form on both surfaces**: first name, middle name initials, then surname,
  "Mark B. De Moor".
- **The icon binds to its own name.** `.bt-work-card__author` is `white-space:
  nowrap`, and a left margin sits between consecutive spans. Without it the word
  space after the comma (~3.5px at `--bt-text-sm`) matched the icon's own
  `margin-right` (4px), so a crest floated between two names. CSS only.
- **Considered and not taken**: a second typographic style for names that only run a
  search, icons trailing the name, and dropping ORCID from the card. The link's
  destination is not a distinction the reader can act on, and two link treatments
  inside one name list cost more than they explain.

## Decisions 2026-08-10 — the backoffice epic's three blockers

The epic was held on three missing screens. Two are out of scope, one is built.

- **The fast lane is out of scope for the epic.** "Complete metadata" opens the
  record's edit form; the scoped edit view stays a design of its own in
  `notes/TOPLAN.md`. 05 and `DOMAIN-VOCABULARY` say so now, without the "until the
  fast lane exists" hedge.
- **The proxy role is out of scope for the epic.** Every action row in 06 belongs to
  a researcher or a curator. Add a proxy variant once the role is designed;
  `patterns/work-card.html` already names it as later, and `templates/biblio-proxy/`
  is empty.
- **Card titles have a destination.** A curator's title opens `curate-detail.html`,
  the review console that already existed. A researcher's opens the new
  `templates/biblio-researcher/work-detail.html` — a read view with edit entry
  points, two states (returned, reviewed), card content per 04, the researcher message
  block per 05, actions per 06. Both list views and both table views are wired.
- **Session scope in `AGENTS.md`** now reads "scope a session to what one review can
  absorb" instead of one page or feature per session (commit a398dc8).
- **A retracted work is excluded from nothing** — result lists, exports, harvesting
  sets and a researcher's own list all keep it, carrying the mark. How the mark
  reaches each output is raven's to work out. 10's second question is closed and the
  rule is in its What.
- **Workflows and visibility have not been settled** — read from raven's source
  once the checkout was connected, correcting a wrong claim in `DOMAIN-VOCABULARY`.
  A record is created `private`; `Submit`, `Return` and `Review` each write
  `deposit_status` and nothing else; visibility moves only through `SetVisibility`.
  The axes meet in one place, the backoffice `set_to_reviewed` action, which reviews
  and then applies the `reviewed_visibility` the curator picked — a choice, not a
  consequence. The doc had said submit flips visibility to public on a UGent
  decision; nothing in raven does that.

## Decisions 2026-08-07 — applied to the drafts

- **No subtypes on cards.** The public epic's question is closed, and its Why now
  states the rule.
- **08 reference fields**: all four ⚑ fields are built — raven keeps every field
  old Biblio carries. The dataset publisher's docs conflict is 08's work; the
  software version is dropped, raven defers the field past v1 and no records land in
  the type.
- **09 container filter**: matches the container title string, as public Biblio
  does (`parent exact`); every container filters, publisher-as-venue names (Zenodo,
  bioRxiv) included, so the identifier-coverage question is gone. Identifier
  filtering (ISSN/ISBN) stays in the manual filter bar, never behind a card link.
  A backoffice link matches the displayed string — short title if available,
  otherwise the full title, keeping the old backoffice's behaviour. Closed in 09.
- **Card filter links land on the works overview, on every card** — detail pages
  included; on the overview itself and in backoffice lists the click narrows the
  list in view. Year, container, project and publisher-as-venue names all link; the
  year link is feature parity with live. Applied in `docs/SEARCH-AND-FILTERING.md` (Rule 3
  table, Scoped links, Identifier picker), 01, 02, 09, the public epic and the
  work-card kit prose. Templates aligned: card links carry the `?container=`
  placeholder; publisher-as-venue names (Zenodo, bioRxiv) link on public and
  backoffice cards. Reading-list cards (`list-detail.html`) link the same way — year,
  container and publisher point at the public works overview, since a personal list has
  no result space of its own to narrow, exactly as on a detail page. An unlinked variant
  was considered and dropped: it would make the work card conditional for one page.
  Closed.
- **Unlinking container titles was tried and reverted, same day.** Every
  `?issn=`/`?isbn=` link was stripped from the prototype, 09 was dropped, and the
  search doc's Rule 3 was rewritten — then all of it restored. Live biblio *does*
  link the journal title on every card, and the resulting filter is
  `cql: parent exact "<title>"`; the log report measures ~204k of those
  link-follows over seven months. Don't reintroduce the removal. The screenshots
  settled something else instead: **live matches the parent title string, not an
  identifier**. Decided: 09 keeps the title string, as public Biblio does. Every
  container filters, so the identifier-coverage question is gone. The two-strings
  follow-up (backoffice abbreviation vs public full title) is closed too: each
  link matches what it displays.
- **Retraction is not backoffice-only**: the public epic now says a retracted
  work stays public, citable and marked, never hidden.
- **Peer-review indicator removed** from the public epic — not sure it is wanted
  at all. Diamond OA badge stays (wanted, no design).
- **Soft-delete / replaced-by is public work too** — the epic says so; still
  undesigned.
- **Placeholder drift (`pp. 12–29`) verified fixed** in the templates; the stale
  defect note is deleted from the public epic.
- **Per-type line posed as a question** (02): the reasoning against today's
  single template is now in 02's Why; whether the composition is worth its
  rendering cost is 02's open question, and needs a team decision.
- **The spec doc's durable home is raven**: `docs/wip/WORK-CARD-REFERENCE-STYLES.md`
  is a WIP reference for critique and building. The doc moves to raven with 02, or
  the implementation's reading of it does. Noted at the top of the doc.
- **11 missing metadata**: filterable from the start, backoffice only; nothing
  about completeness reaches the public surface. Question closed.
- **06 / anonymous Add to list**: the button shows for every visitor; an anonymous
  click routes through login and back. raven#166 owns the panel and already states
  it, so nothing is pending — raven#141 composes the row, not the panel.

## Decisions this round — all applied to the drafts and docs

- **Three sources, three weights.** The prototype is the spec; raven GitHub issues
  are decisions, cited (#141, #164, #166, #155/#156/#157/#159, #125, #167, #51, #153);
  raven's code is neither spec nor decision — never cited, never a benchmark, never
  "drift". Backend
  children 08–11 are phrased as the template's question: "does raven model this,
  and if not do we build it or drop it?", with concrete options.
- **Comparison tables tried and rejected** — a three-column parity table
  (Biblio today | raven | expected) was added to the public epic, 01–03 and
  `docs/ISSUE-TEMPLATE.md`, then reverted everywhere: prose in a table, no gain.
  Don't reintroduce.
- **The publisher is the container on `dataset`, `software` and `preprint`** — all three compose
  `(year) publisher.`, matching `preprint`; old biblio's bare dataset line was a
  template accident. Spec doc and all prototype dataset/software cards updated;
  dataset joins the ⚑ set, so 02 depends on 08 for five types.
- **The reference line spec** (`docs/wip/WORK-CARD-REFERENCE-STYLES.md`) is one
  order + four exceptions; the per-type table is derived examples. There is no
  fallback rule: the order is the rule.
- **Punctuation and line production belong to the implementation.** The CSL render is
  provenance for the examples — one line in Sources. The scan line's part rendering is
  the same case; `p. 58`-level detail is left out on purpose.
- **Dates** (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI"):
  public is human-readable ("5 August 2026"), no metadata timestamps on public
  work cards; backoffice is `dd/mm/yyyy hh:mm`; the backoffice card logs who
  created the metadata and when, who last changed it and when, and the last
  system change and when.
- **No decision stamps in docs** — state the rule; git holds when. Name an owner
  only where the answer sits outside the team. Derived rules cite the derivation
  ("kept from old biblio", "per raven#164") — most decisions are continuity with the
  existing product, not personal rulings.
- **Point, don't paste**: What bullets link the spec doc instead of restating its
  rows. Performance conventions (N+1) live in raven's AGENTS.md, never in issues.
- `docs/SPEC-WRITING.md` now says: before sourcing a claim, check it is ours to
  make — precision that belongs to the implementer is deleted, not evidenced.

## Open questions standing, each in its issue

- **10** — the retraction notice's text and source: Open Science Policy with the
  curation lead.

08 has none: raven keeps every field old Biblio carries, and the software version is
dropped — raven defers the field past v1 and no records land in the type.

## M's raven edits, still to do

- **raven#125** — draft 07 is the amendment: lazy-load framing in three places is
  M's to update; keyword contradiction needs one side picked.
- **raven#51** — decide whether 04 becomes its body or its child.

## Verify

`npm test` — the check-a11y pagination findings are the known pre-v2.11 baseline.
The `public-project-detail.html` heading and list-wrapper defect is fixed: the 2026
group has its `<h3>` and both year groups are lists.
