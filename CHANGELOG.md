# Booktower UI Kit — Changelog

A record of what changed between the OLD system and v2, and the migration
status of every class. Use this to answer: "Can I use this class from the old
system, or do I reach for something new?"

---

## One picker panel per entity (v2.28, 2026-08-21)

Organization and Project pick records now, like Person: each entity has one panel partial
(`people-picker-panel.html`, `organization-picker-panel.html`, `project-picker-panel.html`) that
the works filter bar and the query builder both clone, so a panel fix lands on both surfaces at
once. The panel hooks generalized from `data-person-*` to `data-picker-*`; the filter editor's
`people` type became one `picker` type whose button names its panel (`data-filter-panel`); the
query builder's borrowed people widget (`qb-row-person`) died with its CSS. The crestless token is
the default and the crest the exception, marking a UGent person record (`data-person-ugent`).
Search vocabulary aligned with the field contract: Person, Organization, Keywords and Published in
carry one name each across the filter bar, the builder and the contract.

| Removed | Use instead |
|---------|-------------|
| `bt-query-builder__people-field` | the entity row's picker slot (`qb-row-entity`) |
| `bt-query-builder__people-input` | — |
| `bt-query-builder__people-search` | — |

## A search result row, not a person row (v2.27, 2026-08-20)

The picker row was named for people, and nothing in it is about people: it holds an icon, a name
and metadata lines, which is what an organisation or a project row holds too. It was also the last
standalone component with no `bt-` prefix. Four classes take the name of what they are.

| Removed | Use instead |
|---------|-------------|
| `people-results` | `bt-results` |
| `people-result` | `bt-result` |
| `people-result__icon` | `bt-result__icon` |
| `people-result__name` | `bt-result__name` |

`is-selected` is unchanged, and `bt-result__name` stays a class rather than a font-weight utility:
it names the row's display name, which is where the `<mark>` for a query highlight lands.
`assets/scss/patterns/_booktower-people-results.scss` is `_booktower-results.scss`, and it drops
its "simplify, too many specifics" marker — the specific it carried was the people name.

**The row is read through `data-ps-row`.** `people-search.js` selected rows by `.people-result` in
six places, so a restyle could have cost the widget its click handling, its arrow keys and its
result count. Every row inside a `[data-ps-results]` listbox now carries `data-ps-row` and the
script reads that, which is the rule the query builder's rows already follow.

The people search itself keeps its name: `people-search.js`, the `data-ps-*` contract and
`patterns/people-search.html` are about people, and the row is not.

---

## One metadata line, and identifiers first (v2.26, 2026-08-20)

A person row carried its own metadata classes, duplicating the line `bt-meta-list` already draws
and colouring it with a raw palette step, so it was the one metadata line that ignored the surface.
The rows now use the shared line, and two classes retire with them.

| Removed | Use instead |
|---------|-------------|
| `people-result__meta` | `bt-meta-list bt-meta-list--xs` |
| `people-result__meta-item` | `bt-meta-list__item` |
| `bt-meta-list__item-bordered` | `bt-work-card__meta-item`, which now draws the separator |
| `bt-meta-text` | Bootstrap `small text-muted` |

`bt-meta-list--xs` is the dense variant: xs type, a tighter wrap gap, and a top margin so two of
them stack under one name. `bt-meta-list__item` pairs an icon with its text and is not
people-specific — an organisation or project picker uses the same one.

**Identifiers come first.** An ORCID used to land wherever the affiliation stopped wrapping, so it
sat in a different place on every row and a UGent ID could end up alone on a line. Identifiers now
take the first line under the name, the affiliation and years follow on the second, and a person
with no identifier has no first line. This changed the shared picker, both people-search demos and
`renderRow()` in `people-search-stub.js`.

**Card metadata values are divided by a rule.** `CLASS-USAGE.md` had said `bt-work-card__meta-item`
was the opt-in for a separator since the class was written, and no rule drew one. Consecutive text
values now are; a badge breaks the adjacency, so no divider follows a badge and none trails the last
value. Every other metadata line separates by spacing instead — that difference is deliberate and
the usage notes say so, because a card row interleaves badges with text where the others do not.

`bt-work-card__pub` also stops using a raw grey: the reference line reads the surface-aware muted
token like every other metadata line. The floating results list drops from 280px to 240px, matching
the panel checklist — one number for one idea.

---

## The filter bar stops writing its own markup and vocabulary (v2.25, 2026-08-20)

`filter-bar.js` built the chip and all four editor bodies as template literals, and carried the
filter set and every option list in a `CONFIGS` object. Both move into the markup:

- `templates/partials/filter-editor-templates.html` holds every node the engine clones — the panel
  shell, the checklist / boolean / year-range / text bodies, a checklist row, the chip, the picker
  tick. Values are written with `textContent`, so a typed filter value can no longer become markup.
- `templates/partials/filter-option-lists.html` holds the stub option lists, keyed by the name a
  picker button gives in `data-filter-options`. The organization list is shared by all three bars.
- A picker button now carries its own definition (`data-filter-label`, `data-filter-type`, plus
  `data-filter-options` / `-placeholder` / `-yes` / `-no`), so the picker list *is* the filter set.
- A bar announces itself with `data-filter-bar="<prefix>"`, so the engine no longer holds a list of
  which bars exist.

Three things the split turned up and fixed. `CONFIGS` defined a Current-or-alumni filter for the
researcher bar and an Organization filter for the project bar that neither picker list offers —
dead entries, now gone. The year inputs rendered without `form-control-sm`, which the kit page has
documented since the pattern was written; they now match. And `aria-labelledby` on all three editor
containers pointed at an id that only existed inside a template literal — it resolves to the title
in the partial now, and the prefix comes off (`filter-editor-title`), because a page carries one bar.

The organization stub also loses its one internal contradiction: Arts and Philosophy was `fac-la`
while its department was `dept-lw06`. It is `fac-lw` now. These identifiers are invented for the
prototype and are not raven's.

`filter-sheet.js` follows the editor's buttons by `[data-editor-*]` rather than by generated id.

**Remove filter is always drawn.** It used to render only when the filter was already applied, so
the same panel had two footer shapes depending on state the reader cannot see — and on the two
directory pages, where nothing starts applied, a first open never showed it at all. It is now part
of the shell template like Apply and Cancel. Clicking it on a filter that was never applied removes
nothing and closes the panel, which is what Cancel does. The kit's boolean, year-range and text
demos drew only Apply and Cancel and now match; `patterns/filter-picker.html` states the rule.

**The card/table toggle stops persisting to `localStorage`.** `curate.html` carried a
`data-view-store` key, so a reader could open the template and meet a rendering the file does not
show. Same answer as the sidebar: the server never sees `localStorage`, a consuming app persists the
choice in a cookie it can read at first paint, and the prototype has no server-side state to read
one in. It resets per load.

---

## Advanced search is one dialog, and the page is retired (v2.24, 2026-08-19)

`public-search-advanced.html` goes. The builder renders once, as a dialog over
`public-works.html` at `?advanced=1`, and an empty query is a legal state: the dialog opens over the
unfiltered list, so someone arriving cold still lands in the builder. The two partials,
`search-advanced-conditions.html` and `search-advanced-actions.html`, stay as they are.

The five builder states merge into the works template's state set and are renamed to say which axis
they belong to and what they show: `builder-full-query`, `builder-empty`, `builder-one-condition`,
`builder-or-group`, `builder-no-results`. Two works states are renamed with them — `query-empty`
becomes `no-query`, so it stops reading as a sibling of `builder-empty`, and `advanced-condition`
becomes `facet-set-in-builder`, which is what it shows. Every kit link that pointed at a state on the
retired page points at `public-works.html` instead.

The dialog's chrome moves to `search-advanced-dialog.html`. The works page holds two wrappers around
that one include — `modal fade` for the five list states, `modal fade show` for the five builder
states — so shut and shown cannot drift. `?advanced=1` is still what the browser pushes and what
production reads; the prototype server renders the open dialog from `?state=` instead.

A builder state reuses the list regions of the state behind it, which is three state-list edits and no
duplicated markup: `builder-empty` sits over the unfiltered list, the other four over the result list.
`facet-set-in-builder` joins those lists too, and stops rendering as a page with no search box, no
cards and no toolbar.

What decided it: 990 of the 1,601 sessions that used the power tier in six months already had a
result list on screen, and keeping that list is what the dialog is for. Evidence:
`docs/wip/QUERY-BUILDER-EVIDENCE.md`. This supersedes the two-renderings entry below (v2.16).

## Picking a person is one pattern, and its list floats (v2.23, 2026-08-18)

The people-search pattern page now owns both selection shapes: click-to-select
rich rows in a form (deposit add-author, curate detail) and checkable rich rows
in a panel checklist (the query builder's person picker; the works author filter
adopts the same panel next). The row anatomy is the same everywhere — name with
`<mark>`, affiliation, department, active years, ORCID, UGent ID — because two
people with one name must be tellable apart before you pick one.

- `.people-results` is an overlay: absolutely positioned inside its
  `[data-people-search]` wrapper, white, shadowed, on the panel z-index. Results
  appearing or clearing never reflow the form below the input.
- Panel chrome is compact everywhere: the title fuses with the body directly
  under it — no border under the title, dividers only between bodies — and the
  title, body and actions paddings tightened one step.
- A panel checklist row's label may carry the rich people-row content
  (checkbox in place of the user icon); rows align flex-start so the box sits
  on the label's first line.
- `[hidden] { display: none !important; }` guards the hidden attribute against
  authored display rules (`bt-toolbar`'s flex silently defeated it). Display
  utilities still win — never put `d-*` on an element JS toggles with `hidden`;
  the add-author confirmation slot moved its `d-flex` to an inner div for
  exactly this reason.
- The widget's `[data-ps-hint]` is the live region: the result count, the
  searching state, and the no-results message announce there. Nothing but
  `.people-result` rows goes inside the `[data-ps-results]` listbox.
- The query builder's person picker rows carry `data-id`; submitting tokens by
  id instead of display name is the next step. The stub's synthetic
  `htmx:afterSwap` now carries `detail.target` like real HTMX, and
  "Searching…" is a character, not an entity written through `textContent`.
- The dev server sends `Cache-Control: no-store` on static assets, so a rebuilt
  `booktower.css` shows without a hard refresh.

**Consumers:** re-copy `assets/booktower.css`, `assets/js/people-search.js` and
`assets/js/people-search-stub.js`, and re-sync `add-author-form.html`,
`people-search-widget.html` and `search-advanced-conditions.html`.

---

## The query builder sheds what was never its own (v2.22, 2026-08-18)

The dotted in-place-edit affordance is now `bt-btn-inline-edit` in
`elements/_buttons.scss`. It is the system's convention for a value edited in
place, and an element-level class is where a second pattern can find it. The
rest of the pass deletes query-builder rules that restated the base styles or
styled elements that never render.

- The "or" separator is `visually-hidden` in every template state and in what
  `query-builder.js` builds, so its pill styling never rendered. The styling and
  the class are gone; the JS hook stays `data-qb-sep`.
- The group's OR legend carries `form-label h6 mb-2`, the same markup as every
  other legend in the system.
- Form controls inside a group take their background from
  `_bootstrap-components.scss` like every other control. The group's own white
  restated it and overrode the `:disabled` grey.
- The operator selects drop their muted colour — a one-off look, not a system
  variant.
- The two `!important`s on the batch row are gone; the modifier already wins by
  source order.

| Removed | Replaced by |
|---------|-------------|
| `bt-query-builder__field` | `bt-btn-inline-edit` |
| `bt-query-builder__batch` | nothing — the textarea already fills its value cell |
| `bt-query-builder__sep` | `visually-hidden`; the JS hook stays `data-qb-sep` |
| `bt-query-builder__group-label` | `form-label h6 mb-2` on the legend |

**Consumers:** re-copy `assets/booktower.css` and `assets/js/query-builder.js`, and
re-sync `search-advanced-conditions.html` against the class changes above.

---

## Slim sidebar keeps its labels, and its tooltips wait for slim (v2.21, 2026-08-14)

An icon-only sidebar link now carries its own name. In `bt-sidebar--slim` the link
and button text is hidden from view and stays in the accessibility tree, so a screen
reader reads the same label a sighted user reads in the expanded rail. Tooltips
follow the same state: `sidebar-toggle.js` enables them in slim mode and disables
them while the sidebar is expanded, where they repeated a label already on screen.

- `.bt-sidebar__label` and `.btn-text` are visually hidden inside
  `.bt-sidebar--slim` rather than `display: none`. That span names the link in both
  states.
- A sidebar link takes no `aria-label`. Bootstrap moves `title` to
  `data-bs-original-title` when it initialises a tooltip, so `title` never becomes
  the accessible name, and an `aria-label` would replace the visible text with a
  second string to keep in sync.
- Each sidebar `title` repeats its visible label word for word.
- Slim mode styles count badges only: every badge on a sidebar link is a count
  badge, so `.badge:not(.badge--total)` left the stylesheet.
- The CSS build runs autoprefixer from a repo script against `.browserslistrc`, so
  the compiled file carries vendor prefixes the previous build omitted.
  `shell/shell.css` now carries the same build stamp as `assets/booktower.css`.

| Removed | Replaced by |
|---------|-------------|
| `bt-navbar__nav` | nothing — the class was unused |
| `aria-label` on a sidebar nav link | `.bt-sidebar__label`, which slim mode keeps in the accessibility tree |

**Consumers:** re-copy `assets/booktower.css`; the icon fonts are unchanged since
v2.20. Delete any `aria-label` you added to a sidebar link, and read each link's
`title` against its visible label. Where you mirror `sidebar-toggle.js`, enable the
tooltips with the slim state instead of at page load.

---

## Experimental Advanced search builder shared rendering (v2.20, 2026-08-12)

The public advanced-search flow now has a shared builder implementation that can
render either as a full page or as a wide dialog over the results list. This builder itself is expermiental.

- The advanced-search builder is implemented from the same condition and action
  partials in both renderings, so the page and the overlay do not drift apart.
- The builder cards and a dedicated query-builder pattern were added around the
  public search flow, with the conditions/actions split made explicit for
  consumer implementations.
- The shell is now also documented to include partials cleanly, which keeps the
  advanced-search variants consistent with the rest of the design-system layout
  patterns.

**Consumers:** re-copy `assets/booktower.css` after the CSS rebuild and update any
advanced-search implementation to use the shared condition/action partials rather
than maintaining two separate copies. This is a prototype contract change for the
public search flow; there is no legacy migration from a prior builder markup to
preserve.

---

## Backoffice shell + work-card contract alignment (v2.19, 2026-08-12)

The latest batch adds one backoffice shell pattern and tightens the consumer-facing
sidebars and work-card references that apps should mirror.

- The app shell now supports a filter-drawer layout via
  `u-main__body--filter-drawer` and the companion `u-main__sidebar` drawer
  behaviour, so backoffice list screens can keep a narrow filter panel without
  breaking the surrounding shell structure.
- Sidebar count badges now stay visible in the expanded app sidebar and collapse
  cleanly into the slim-dot state when `bt-sidebar--slim` is active. The main
  sidebar markup was simplified so reusable links no longer rely on helper wrappers
  like `d-inline-flex flex-shrink-0`.
- Public work-card references were aligned across the kit templates and sample
  result content so titles, access metadata, and related-work links match the
  current card contract. No new CSS classes were introduced, but the markup and
  route expectations now match the public work-card pattern.

**Consumers:** re-copy `assets/booktower.css` after the CSS rebuild. The classes
most directly affected are `bt-sidebar`, `bt-sidebar--slim`, and
`badge--total`; if you mirror the main sidebar or work-card examples, remove the
old helper wrappers and match the current contract instead of patching the output
by hand.

---

## Sidebar badge layout fix and pattern sync (v2.18, 2026-08-12)

Sidebar count badges now stay visible in the expanded app sidebar and collapse cleanly
into the slim-dot state when `bt-sidebar--slim` is active. The main sidebar markup
was simplified so reusable links no longer require helper wrappers like
`d-inline-flex flex-shrink-0`.

Documentation in `patterns/sidebar.html` was aligned with the actual
`templates/partials/main-sidebar.html` partial, and a new issue draft was added to
`docs/wip/SIDEBAR-TOGGLE-BACKOFFICE.md`.

**Consumers:** re-copy `assets/booktower.css` after the CSS rebuild. The only
classes affected are `bt-sidebar`, `bt-sidebar--slim`, and `badge--total`.

## Work card contributor links and access vocabulary settle (v2.17, 2026-08-11)

One CSS rule changed and the public/backoffice prototype cards were swept to match
the work-card contract.

Contributor names now follow one rule on both surfaces: every name is a link, and
the identifier icon says where it goes. A name with the UGent crest or ORCID links
to the researcher page; a name with neither runs a works search on itself (`?q=`).
The muted, unlinked contributor form is retired. Names print as First name,
middle name initials then surname (`Mark B. De Moor`) on public cards,
researcher cards, curator cards, deposit
summaries and table fallbacks.

`bt-work-card__author` now keeps each contributor together with
`white-space: nowrap`, and adjacent contributors get a small left margin so a crest
visually belongs to the following name rather than floating between two
comma-separated names.

Access badges on cards now have a three-state vocabulary only:

| Work-card access state | Badge |
|---|---|
| Open access | `badge text-bg-success` + `if-open-access` |
| Restricted access | `badge text-bg-secondary` + `if-lock` |
| Embargo | `badge text-bg-secondary` + `if-time`, naming the date |
| Embargo | `badge text-bg-transparent` + `if-forbid` |

Closed access is backoffice only.

The card-link contract also narrows: cards link year and
container/publisher-as-container to the works overview, but projects live on detail
pages. Publisher-as-container names such as Zenodo and bioRxiv render in `<cite>`
like the other containers.

Documentation updates in `docs/wip/` close three decisions: no workflow transition
changes visibility; retracted works remain in result lists, exports, harvesting
sets and researcher lists with the mark carried along; the per-type reference line
is kept.

**Consumers: re-copy `assets/booktower.css` and update work-card contributor
markup.** There are no added or removed classes, but old muted/unlinked contributor
markup no longer matches the contract.

## Advanced search becomes one builder in two renderings (v2.16, 2026-08-10)

`public-search-advanced.html` keeps its address and loses its markup: the builder now
lives in two partials, `search-advanced-conditions.html` and
`search-advanced-actions.html`, rendered twice — as that page, and as a dialog over
`public-works.html`. Both dead `/advanced-search` hrefs resolve.

One class added: `modal-dialog--wide`, feeding `--bs-modal-width`. Usage note in
`CLASS-USAGE.md`.

Removed, with where each thing went:

| Removed | Replaced by |
|---|---|
| The URL / Embed / API tab strip and the Save section inside the builder | The works toolbar actions group: Save search, Share, Export |
| `#cite-modal` on `public-work-detail.html` | A Cite panel on the same button, matching Add to list beside it |
| The unlabelled `⋯` dropdown on the works toolbar | Three labelled buttons |
| Subscribe to feed as a menu item | The Feed tab inside Share |
| The builder's `phase-1` / `phase-1-empty` / `phase-2` / `phase-2-empty` states | `built`, `advanced-empty`, `advanced-group`; `public-works.html` adds `advanced-condition` |

Eleven fields left the public field list — seven that `SEARCH-AND-FILTERING.md` rule 5
already places off the public surface, four awaiting an exposure decision. Pattern page:
`patterns/query-builder.html`.

---

## Token search retires; unused classes fail the gate (v2.15, 2026-08-10)

Seventeen classes removed: the `token-bar` and `token-suggestions` families,
`bt-code-block`, `bt-scroll-frame`. All of them dressed the two advanced-search
explorations deleted in 789ae7f; `public-search-advanced.html` with
`query-builder.js` is the surviving direction. `server/content/token-results.js`
and its `/search` HTMX target go with them.

`check:classes` now **exits 1** on a class defined in `booktower.css` and used
nowhere, matching the direction it already enforced for undefined classes. A
class kept on purpose goes in the `intentional` list in
`scripts/check-classes.js` with a reason — so "used nowhere: 0" is an invariant
the gate holds rather than a number someone reads.

**Consumers: re-copy `assets/booktower.css`.**

## Design principles move into the kit — and into the gates (v2.14, 2026-08-07)

No class or CSS changes. Three URLs change.

| Old URL | v2.14 |
|---|---|
| `/base/ai-guidelines.html` | removed — `AGENTS.md` is the working guide |
| `/base/integration.html` | removed — `docs/CONSUMING-BOOKTOWER.md` is the integration contract |
| `/base/design-principles.html` | `/foundations/design-principles.html` |

`base/` is gone. Two of its pages predated the AGENTS.md restructure and
duplicated docs that are now the source of truth. The third moved to
`foundations/`, where the checks can see it: `check:classes`, `check:a11y` and
`check:html` all glob `templates elements patterns foundations
getting-started`, so HTML outside those five directories is validated by
nothing. `base/` never was — the principles page carried `font-serif`, a class
defined in no stylesheet, undetected for the page's whole life.

The page now holds six principles rather than four. **05 Trust is placed
deliberately** and **06 Quality is reached in cycles** come from the Biblio
2030 working strategy: metadata increasingly arrives from outside, imported
values may publish without anyone here reading them while anything we generate
ourselves waits for a person, and deposit is non-blocking with quality reached
through curation cycles. **02** gained the public/backoffice
surface split and the limit in both directions — invented complexity is ours to
remove, responsibility is not. **03** gained the long tail, **04** machines as
readers. Each principle carries a pass/fail test; the conflicts section resolves
eight standing tensions and names one open question for Open Science Policy.

`AGENTS.md` names all six inline, and `check:doc-refs` fails when the guide and
the page disagree — the page stays the only copy of their content.

**Consumers: nothing to re-copy.** Update any link to `/base/*`.

## Work card — BEM wrappers, and the block absorbs its only modifier (v2.13, 2026-08-07)

Three classes added, four names retired. Supersedes v2.8's "Bootstrap structural
regions stay": without a `.card` ancestor, every declaration Bootstrap ships for
these classes resolves against undefined `--bs-card-*` variables, and
`_booktower-work-card.scss` overrode the rest — the wrappers were Bootstrap in
name only.

| Old markup (selectors deleted) | v2.13 |
|---|---|
| `div.card-header` (inside `bt-work-card`) | `div.bt-work-card__header` |
| `div.card-body` (inside `bt-work-card`) | `div.bt-work-card__body` |
| `div.card-footer` (inside `bt-work-card`) | `div.bt-work-card__footer` |
| `bt-work-card bt-work-card--border-bottom` | `bt-work-card` |

`bt-work-card--border-bottom` is retired because every card carried it: a
modifier no card ever omits is the block. Its declarations (`border-bottom`,
vertical padding) moved to `.bt-work-card`, which the rename had otherwise left
with no rule of its own. Same specificity, same source order, same rendering.

The wrappers also dropped four declarations that only cancelled Bootstrap —
`background: transparent` and `border-bottom: none` on `__header`,
`background: transparent` and `border-top: none` on `__footer`, plus
`margin-bottom: 0`. All are the initial value on a `<div>` with no `card-*`
class, so nothing moves. Every other declaration is unchanged.

Real Bootstrap `.card` components everywhere else keep `card-*`.

**Consumers: one contract change, one diff.** Re-copy `booktower.css`, rename
the three wrappers, and drop `bt-work-card--border-bottom`. The old
`.bt-work-card .card-*` and `.bt-work-card--border-bottom` selectors are gone
from the compiled CSS, so old markup with new CSS loses the card's
header/body/footer layout and the rule between cards.

## Modal ARIA — Bootstrap owns the runtime attributes (v2.12, 2026-08-06)

No class changes; visually inert except the two delete-list confirmations, whose footer
buttons lost `btn-sm` to match the other eight modals.

An accessible-relationship change, so it is a contract change for consumers even though
no class moved. All ten modal openers across `templates/` now carry only `class`, `id`,
`tabindex="-1"` and `aria-labelledby`:

- **`role="dialog"` / `aria-modal="true"` removed from static markup.** Bootstrap's modal
  JS sets both on show and removes them on hide (5.3.3 `modal.js`, `_showElement` /
  `_hideModal`), so markup values only duplicated runtime state. A closed `.modal` is
  `display: none` and outside the accessibility tree either way — nothing was announced
  before, nothing is lost now.
- **`aria-hidden="true"` is not the replacement.** Bootstrap's documented static markup
  includes it, but it fails `check:html`'s `hidden-focusable` rule — a modal contains
  focusable children. Carry none of the three.
- **`aria-describedby` added to the three confirmations** (`delete-list-modal`,
  `return-modal`, `pickup-modal`), pointing at the sentence that states the consequence,
  never at `.modal-body` — a body-level description makes a screen reader announce every
  control in it. `export-modal` and `cite-modal` get none: their bodies are a form and a
  tab set, and their titles carry the meaning.
- **`role="alertdialog"` is unavailable.** The APG pattern for destructive confirmations,
  but Bootstrap overwrites `role` with `dialog` on every show.

Rule: `docs/ACCESSIBILITY.md` E6 · consumer duty: `docs/CONSUMING-BOOKTOWER.md`
accessibility baseline · reference example: `templates/biblio-researcher/lists.html`.

## Pagination pattern — the results bar (v2.11, 2026-08-06)

The pagination bar is pinned in the new kit page `patterns/pagination.html` (pagination and
result count left, page size / sort / more actions right, each control in its own
`bt-toolbar__item`) and in `docs/CLASS-USAGE.md`.

**Consumers: re-copy `booktower.css`.** No class was added or removed — one existing rule
changed: `bt-toolbar__right` is now `flex-wrap: wrap` and shrinkable (it was
`flex-shrink: 0`, no wrap). A row of controls that did not fit — page size + sort + a
menu button, below roughly 600px — overflowed the viewport horizontally; it now stacks.
Nothing changes at widths where the row already fitted. The icon fonts are unchanged.

### ⚠️ Pagination markup changed — recheck any page with a result count

Because no class changed, `check:classes` stays silent: a page left on the old markup keeps
rendering, just with the accessibility bugs below. Consumers mirroring a Booktower list bar
(raven templates included) should apply these:

| What | Was | Now | Why |
|---|---|---|---|
| Screen-reader prefix | `<span class="d-none d-md-inline-block visually-hidden">Showing </span>` | plain visible text: `Showing 1–50 of 879 results` | `visually-hidden` carries no `display`, so `d-none` won below `md` and dropped the word from the accessibility tree there while hiding it from everyone above it. One string, every width, every reader. |
| Result count | inside `<nav aria-label="Results pagination">` | sibling of the `<nav>`, in `bt-toolbar__left` | A count is a status, not navigation. Removes the `nav.d-flex.gap-3` wrapper too — `bt-toolbar__left` already gaps. |
| Inert page item | `<a class="page-link" href="#" aria-disabled="true">` | `<span class="page-link">` in `li.page-item.disabled` | `aria-disabled` is a label, not a behaviour: the link stayed focusable and clickable. Applies to end arrows, `…` gaps, and letters with no entries. |
| Arrows | `‹` / `›` text glyphs | `<i class="if if-chevron-left">` / `if-chevron-right`, `aria-hidden`, size inherited | One icon system. The link keeps `aria-label="Previous page"` / `"Next page"` — several sites had an arrow with no accessible name at all. |
| Live region | `aria-live="polite"` on both bars, or neither | exactly one count per list carries it — the bar at the head | A repeated bottom bar announced the same change twice. |
| Spacing | `mb-0` on `ul.pagination`, `ms-3` on the count | neither | `base/_reset.scss` zeroes list margins; the toolbar owns the gap. |
| Toolbar children | controls sometimes bare in `bt-toolbar__left`/`__right` | every child in its own `bt-toolbar__item` | Confirmed as the pattern for consuming apps. It is also load-bearing for `form-select`: as a direct flex child, `width: 100%` makes every select shrink to one shared width and the longest label truncates (visible on `public-works` today as “Year (new to…”). |

`check:a11y` now enforces the five rules above (P1–P5): `visually-hidden` beside a display
utility, an `<a>` inside `li.page-item.disabled`, a text glyph in a `page-link`, text inside
a pagination `<nav>`, `mb-0` on `ul.pagination`. Nine files known to be on the old markup are
listed in `PAGINATION_DRIFT` in `scripts/check-a11y.js` so the build stays green while they
are aligned; any new occurrence fails, and an entry that stops drifting fails too. Run
`npm run check:pagination` for the worklist with line numbers.

**`public-projects.html` is the first template on the new pattern** — read it, or the kit
page, as the reference. It had a bare result count and no pagination; it now carries the
full bar top and bottom (page size + sort right, `Projects pagination (top)` / `(bottom)`),
with the counts standing in for a full directory (84 projects, 5 pages) while only 4 of the
cards are written out. The other nine files still carry the old markup — alignment is tracked
in `notes/PLAN-kit-gaps-from-templates.md`, Tier 2 item 6.

---

## Backoffice status model + card completion (v2.10, 2026-07-30)

No class changes. The backoffice aligns to raven's state model and the cards fill out:

- **Two-axis status**: deposit status (draft/submitted/returned/reviewed) is the one
  badge; record visibility rides inside it as `if-eye`/`if-eye-off` + visually-hidden
  text. "Published"/"Biblio public" wording is gone. File access is never a badge on
  backoffice cards — plain `bt-work-card__meta-item` ("Open access", "Embargo until
  <date>"). DOMAIN-VOCABULARY rewritten accordingly (two axes, deletion/tombstones,
  raven event model; retraction: will be built in raven, timing open).
- **Facets**: Status = the four deposit statuses (list pages + backoffice facet
  partial); Visibility is its own facet on both list pages.
- **One list page per role**: search-my-research and search-filter-first deleted;
  filter-first's condensation concepts noted in curate.html.
- **Cards**: automated missing-metadata alert (role-specific lists) in the Biblio
  message slot; org badges muted (`text-bg-light`); projects clickable; year links
  to the year filter in filterable views; a Returned+embargo example card added.
- **Kit**: work-card page restructured — on-page nav; order grammar → roles &
  views → public → researcher → curator; duplicate demo cards removed; researcher
  demo re-labelled (was "Curator card"); public demo aligned to v1 actions (no
  Download CTA per #141). "One card across roles and views" matrix section;
  add-to-list recipe renders open in flow. The Biblio message pattern = automated
  missing-metadata check + CTA + optional personalised curator note.
- **Access badges changed** — see the table below; check any page you are working on that
  shows access status.
- **Cards use one row concept**: `bt-meta-list` is gone from inside work cards —
  departments, projects, VABB and the provenance footer are `bt-work-card__meta` rows with
  `bt-work-card__meta-item` items, same as the header row. The separator is now scoped to
  direct children of a row (`__meta > __meta-item + __meta-item`), so stacked sub-lists draw
  none; `.bt-work-card__meta-item .if` glues an icon to its item. `bt-meta-list` stays as
  the off-card metadata line (detail-page file rows, typography demos) and moved to
  `patterns/_booktower-components.scss`; its dead `__item` element was removed.
- **Public title links**: every public card title opens
  `templates/biblio-public/public-work-detail.html` (was `#`, and one raven-shaped
  `/research/<id>`); backoffice titles stay `#` — no backoffice detail view yet.
- **Search pages**: results-search hx stubs removed (raven owns search behaviour);
  `@states: default, no-results` on both list pages with a bt-blank-slate zero-results
  state; "did you mean" deliberately not built (raven search-quality epic).

### ⚠️ Access badges changed (v2.10) — recheck any page showing access status

The badge markup for access status is different. No class was added or removed, so
`check:classes` stays silent — a page left on the old markup keeps rendering, just wrong.

| Access state | v2.9 and earlier | v2.10 |
|---|---|---|
| Open access | `badge text-bg-success` | `badge text-bg-success` + `if-open-access` |
| Restricted access | `badge text-bg-warning` | `badge text-bg-secondary` + `if-lock` |
| Embargo | `badge text-bg-warning` + `if-time` | `badge text-bg-secondary` + `if-time` (badge names the date) |
| Closed access | `badge text-bg-secondary` | unchanged — and it never takes an icon |

**Only open access carries colour.** Restricted and embargo are correct outcomes, not
warnings: the orange read as an error and competed with open access. `text-bg-warning` on
an access badge is now wrong everywhere. Icons are decorative (`aria-hidden="true"`) — the
badge text carries the meaning.

Swept in this release: `public-works.html`, `public-work-detail.html`,
`public-work-detail-dataset.html`, `public-project-detail.html`,
`public-researcher-detail.html`, `public-organisation-detail.html`,
`deposit-4-review.html`, `search-advanced-builder.html`,
`partials/search-suggest-panel.html`, `server/content/search-result-cards.js`,
`server/content/token-results.js`, and the kit pages `patterns/work-card.html`,
`patterns/work-actions.html`, `patterns/hero.html`, `elements/badges.html`.

**Backoffice cards are unaffected**: access there is plain `bt-work-card__meta-item` text,
never a badge. If you are adding an access badge to a backoffice card, that is the bug.

## Work card grammar — backoffice cards + add-to-list recipe (v2.9, 2026-07-30)

No class changes. The backoffice cards (curate.html, search-researcher,
search-my-research, search-filter-first, search-advanced-token, and the kit
page's curator/researcher sections) migrated to the v2.8 grammar: `__meta` /
`__meta-item` / `__actions`, access always a badge (fixed the double-class
`bt-meta-list__item-bordered badge` element in the researcher search twins),
curator kit titles corrected `h2`→`p`, curator authors as `__author` spans with
comma separators. The backoffice `__pub` scan line keeps its `·` separators —
deliberately distinct from the public Harvard line. Backoffice-only blocks
(departments, projects, VABB, footer) stay on generic `bt-meta-list` markup;
naming them is an open decision. The add-to-list dropdown composition is now a
documented recipe on `patterns/panel.html`.

## Work card grammar — public surface (v2.8, 2026-07-30)

Four classes added, no removals. The card's inner rows get semantic elements;
Bootstrap structural regions (`.card-header`, `.card-body`) stay.

| Old markup (still valid CSS, migrate on touch) | v2.8 |
|---|---|
| `div.bt-meta-list.pt-1` (card badge row) | `div.bt-work-card__meta` |
| `span.bt-meta-list__item-bordered` (type, in cards) | `span.bt-work-card__meta-item` |
| `div.d-flex.align-items-center.gap-2` (card actions) | `div.bt-work-card__actions` |
| author `<a>` with icons + space inside | `span.bt-work-card__author` — icons outside the `<a>`, spacing via CSS |

Behaviour changes:

- `bt-meta-list__item-bordered` (and `bt-work-card__meta-item`): separator now
  renders only *between* consecutive items (sibling `border-left`), never after
  the last item.
- `bt-work-card__authors` dropped `display:flex`/`gap` — authors are prose with
  comma text nodes; flex made every comma a spaced flex item.
- `.bt-work-card.card` chrome-strip rule deleted; its one usage
  (search-advanced-builder embed preview) dropped `.card`.
- Access state on cards is always a badge (DOMAIN-VOCABULARY mapping); the
  bordered-item and bare-sentence renderings are gone from public cards.
- Public `__pub` line follows `docs/wip/WORK-CARD-REFERENCE-STYLES.md` (Harvard,
  `<cite>`, linked `<time>` year); `·` separator spans removed on public.

Swept: search-result-cards.js, public-works.html, public-project-detail.html,
work-card.html (public section), work-actions.html, search-advanced-builder.html.
Backoffice cards (curate.html, search-researcher/my-research/filter-first/token)
still carry the old markup — they migrate in the backoffice pass.

## HTML validity batch — check:html and check:a11y green (v2.7, 2026-07-30)

No class changes. All `npm run check:html` and `check:a11y` errors fixed across kit
pages, templates and partials, visually inert except curate-detail, which gained a
visible `h1.bt-toolbar__title` ("Curate record") — it had no h1 at all.

Conventions this locked in:

- **Stub forms:** prototypes carry no `<form>` without a working submit path; the spot
  is marked `<!-- real impl: form POST /… -->` (ACCESSIBILITY.md C6 prototype
  exception). Markers added across the deposit flow and add-author-form.
- **Wrapping labels keep `for`/`id`:** voice control doesn't recognise implicit
  association, so `no-redundant-for` is off in `.htmlvalidate.json`
  (ACCESSIBILITY.md §C1, TPGi citation). File-drop zones carry both.
- **`@state` vs checks:** ids unique across states; duplicate landmark names get an
  inline `html-validate-disable-next` directive (SERVER.md → Template states).
- **Duplicate pagination navs:** named "Results pagination (top)"/"(bottom)"
  (ACCESSIBILITY.md A5 table).
- Redundant `role="banner"`/`"contentinfo"` and invalid `width="auto"` removed
  everywhere; sidebar toggle's aria attributes moved from the styled div to the
  button (`sidebar-toggle.js` selector updated to match).
- All 19 backoffice templates (biblio-researcher + biblio-team: deposit, search,
  settings, dashboard, curation) now carry a WIP marker: backoffice is not
  settled, do not implement in raven yet.

## Filter engines consolidated into filter-bar.js (v2.6, 2026-07-15)

One class removed: `filter-group--backoffice-only` (and its `[data-surface]`
rule) — it only existed to hide backoffice groups in the deleted
`search-filter-bar.html` partial. Surface scoping is now per-bar config, not CSS.

`filter-editor.js`, `filter-stubs.js`, `directory-filters.js` and
`directory-filters-projects.js` are replaced by one config-driven
`assets/js/filter-bar.js`: one engine, one config per bar, self-discovered by id
prefix (`wf-` works, `rdir-` researchers, `pdir-` projects). Editor types:
checklist, boolean, year-range, text. The works page now uses the same live
chip bar as the directories (two chips pre-applied) instead of static markup.
Chips remain client-side prototype stubs. Registry: `docs/JAVASCRIPT.md`;
interaction model: `docs/SEARCH-AND-FILTERING.md`.

## Copy-to-clipboard pattern (v2.5, 2026-07-14)

No class changes. New kit page `patterns/copy-to-clipboard.html`. `clipboard.js` copies the
sibling `<code>` (or `data-clipboard-target` for dynamic sources) and drives icon-only
buttons. Public detail templates moved off inline `onclick` to `data-clipboard` (persistent
link + cite-modal Copy citation).

## Public search form + filter picker unified (v2.4, 2026-07-14)

No class removals — a markup + convention consolidation. Where to look when
building or porting search/filter UI.

**Public search form:** one canonical skeleton on every public listing header
(`public-works`, `public-researchers`, `public-organisations`,
`public-projects`): `<form role="search">` → `#suggest-wrapper` →
`.input-group.input-group-lg` (visually-hidden label + `type="search"` combobox
input + submit button) → `#suggest-panel.bt-suggest-panel`. Generic IDs (`q`,
`suggest-wrapper`, `suggest-panel`) on every page — the JS binds them. Only
scope varies: placeholder/`aria-label` copy, the form `action`, and the one
behaviour hook (`hx-*` omni-suggest on works vs `data-directory-search`
client-side typeahead on the directories). Documented on
`elements/search-bar.html` → **Listing / results-header search**.

**Filter picker:** one markup everywhere (`search-filter-bar`,
`result-filter-bar` + `-projects`/`-researchers`, `backoffice-facet-sidebar`,
and the `patterns/filter-picker.html` demos): `role="group"` +
`.dropdown-header` labels, plain `.dropdown-item` buttons. Removed the per-item
`py-2` and `d-flex align-items-center` utilities, the unused "Find a filter"
search input (and its `filter-editor.js` guard requirement), and the invalid
`aria-labelledby` on the menu `<div>`. Row padding now comes from Bootstrap's
own token — `--bs-dropdown-item-padding-y: 0.5rem` on `.dropdown-menu`, with
`.dropdown-header` reading the same token; rows are flex via
`.bt-dropdown-scroll .dropdown-item` so an applied item's trailing check
(`.ms-auto`) sits at the edge.

**Search-bar kit page:** documents three variants — hero pill
(`.input-group--hero`), canonical listing search, and compact/toolbar
(`.form-control-search`, backoffice).

---

## Access CTA rules + formatting conventions (v2.3, 2026-07-13)

No class changes. Behaviour and copy changes on the public surface;
decision record is #141.

**Access CTA (cards + detail header):** split into v1 (parity with
biblio.ugent.be) and v2 (extended). Templates show v1: full CTA on the
detail header, cards carry only Cite + Add to list — no access CTA, no
View button (title navigates). v2 (card mirrors the header: Download /
Access at ⟨host⟩ / Log in / Select file) is preserved as designs on the
kit page. Also removed: **Request access** (future, no process yet),
per-row "Log in to access" links in the Files section (login appears
once per page), the disabled **Under embargo** button (embargo renders
as text naming the post-embargo state), "Full Text at Publisher"
(external open full text out of scope), and every public trace of
`private` files — not even a count (patent risk, tech transfer).

**New kit page:** `patterns/work-actions.html` — CTA designs and
styling (icon + button variant per CTA). Rules deliberately live in
#141, not in the kit.

**New doc rules:** file selection for the access CTA
(`docs/DOMAIN-VOCABULARY.md`: full_text only, published > accepted >
rest, format irrelevant; restricted = login-scoped) and formatting
conventions (`docs/UI-LAYER.md`: dates dd/mm/yyyy, decimal comma,
meta line version · access · format · size).

---

## Bootstrap gap audit (v2.2, 2026-07-03)

The findings doc is retired (2026-08-13); this section is the record of what it found and fixed. The headlines:

**Fixed bugs:** `.form-select` caret restored (a `background:` shorthand had erased it); `bt-blank-slate` compiled again (its partial was never `@use`d); `--bs-info-rgb` matched to `--bt-blue`; disabled/toggled primary buttons no longer fall back to stock Bootstrap blue; slim-sidebar badge counts hide properly; reduced-motion no longer makes spinners blur.

**Removed:** see the migration map below for classes. Also removed: all no-op Bootstrap overrides, `patterns/research-card-backup.html`, `patterns/htmx-patterns.html` (rebuilds with the JS audit), and the duplicate `elements/toolbar.html`.

### Removed during v2 development — migration map

Classes that existed at some point in v2 (or were documented as if they did) and are gone. `npm test` fails on any use of an undefined class; this table answers "what do I use instead". The OLD→v2 tables below cover the old `bc-`/`c-` system; this covers v2's own churn.

| Removed | Use instead |
|---------|-------------|
| `bt-btn-toolbar`, `--wide-spacing`, `--vertical` | One `bt-toolbar__item` per action inside `bt-toolbar`; `d-flex align-items-center gap-2` elsewhere |
| `bt-facets`, `bt-facet-name`, `bt-facet-check`, `bt-facet-count`, `bt-facet-separator`, `bt-facet-sep` | `fieldset`/`legend` + `d-flex form-check` rows, count as `badge bg-transparent`, plain `<hr>` between groups |
| `bt-avatar--dark` | Base `bt-avatar` (already the dark chip) |
| `btn-outline-white` | Nothing — design a dark-surface button when one is needed |
| `sr-only` | Bootstrap's `visually-hidden` |
| `bt-navbar__mark` | `bt-navbar__brand` |
| `people-result__meta`, `people-result__meta-item` | `bt-meta-list bt-meta-list--xs`, `bt-meta-list__item` |
| `people-results`, `people-result`, `people-result__icon`, `people-result__name` | `bt-results`, `bt-result`, `bt-result__icon`, `bt-result__name` |
| `bt-meta-list__item-bordered` | `bt-work-card__meta-item` draws the separator now |
| `bt-meta-text` | Bootstrap `small text-muted` |
| `app-sidebar`, `app-sidebar-link`, `app-sidebar-label` | `bt-sidebar` and its elements |
| `bt-blank-slate-muted/-primary` (single dash) | `bt-blank-slate--muted/--primary` |
| `bt-table` | Bootstrap `.table .table-hover .align-middle` |
| `bt-filter-bar`, `bt-bulk-bar`, `bt-pagination-bar` | `bt-toolbar` |
| `bt-results-toolbar` | `bt-toolbar bt-toolbar--bordered` |
| `bt-results-col`, `bt-content-area`, `bt-facets-col` | `u-main__content` / `u-main__body--split` layout contract |
| `bt-sub-sidebar`, `--bordered`, `--slim` | `bt-sidebar` and its modifiers |
| `bt-stepper` family | Not part of this library |
| `card--work`, `card-research`, `card-meta`, `card-actions`, `card-title`, `card-authors`, `card-publication` | `bt-work-card` with Bootstrap `card-header`/`card-body`/`card-footer` |
| `is-selected` on `<tr>` | Bootstrap `.table-active` |
| `td-title`, `td-meta`, `td-actions`, `td-actions-inner`, `row-actions` | Bootstrap utilities directly |
| `u-scroll-wrapper`, `u-scroll-wrapper__body`, `u-maximize-height` | The `u-layout--app` / `u-main__*` shell |
| `.bt-toolbar.h-auto` state hook | `align-items-start` where needed |
| `filter-editor`, `__title`, `__body`, `__body--checklist`, `__actions` | `bt-panel` and its elements/modifiers (see `notes/ARCHIVE-PROPOSAL-panel-unification.md`) |
| `filter-tag` | Clickable badge: `<button>`/`<a>` with `badge badge--outline` |
| `filter-year__input` | `bt-panel__year-input` |

**New rules (see docs/CSS-ARCHITECTURE.md):** feed `--bs-*` component variables instead of fighting selectors; longhands, never shorthands across grouped selectors; raw colours only in `_colors.scss`/`_tokens.scss`/SVG; reduced-motion has one owner. Two guards enforce reality: `npm run check:partials` (in the build) and `npm run check:classes` (58 ghost classes → 0).

**Added:** `min-w-0`, `bg-success-light`, `--bt-*-rgb` triplet tokens; backoffice surface tokens now work on nested `[data-surface]` containers.

---

## Breaking change — unified `bt-` prefix (v2.1)

All component classes now use a single `bt-` prefix. The old `bc-` and `c-`
prefixes are retired. Find-and-replace the following across every template,
partial, and stylesheet:

| Old class | New class |
|-----------|-----------|
| `bc-navbar` | `bt-navbar` |
| `bc-navbar__brand` | `bt-navbar__brand` |
| `bc-navbar__sep` | `bt-navbar__sep` |
| `bc-navbar__nav` | `bt-navbar__nav` |
| `bc-navbar__link` | `bt-navbar__link` |
| `bc-toolbar` | `bt-toolbar` |
| `bc-toolbar__left` | `bt-toolbar__left` |
| `bc-toolbar__right` | `bt-toolbar__right` |
| `bc-toolbar__middle` | `bt-toolbar__middle` |
| `bc-toolbar__title` | `bt-toolbar__title` |
| `bc-toolbar__item` | `bt-toolbar__item` |
| `bc-toolbar--bordered` | `bt-toolbar--bordered` |
| `bc-avatar` | `bt-avatar` |
| `bc-avatar--small` | `bt-avatar--small` |
| `bc-avatar--large` | `bt-avatar--large` |
| `c-sidebar` | `bt-sidebar` |
| `c-sidebar--bordered` | `bt-sidebar--bordered` |
| `c-sub-sidebar` | `u-main__sidebar` |
| `c-sub-sidebar--bordered` | `u-main__sidebar--bordered` |
| `c-blank-slate` | `bt-blank-slate` || `c-blank-slate-muted` | `bt-blank-slate--muted` |
| `c-blank-slate-primary` | `bt-blank-slate--primary` |
| `c-radio-card` | `btn-check` (Bootstrap) |
| `c-radio-card__group` | `bt-btn-check__group` (Bootstrap extension for grouping btn-checks) |
| `c-radio-card__body` | Deprecated |
| `c-file-drop` | `bt-file-drop` |
| `c-file-drop__icon` | `bt-file-drop__icon` |
| `c-file-drop__text` | `bt-file-drop__text` |
| `c-file-drop__hint` | `bt-file-drop__hint` |
| `c-hero` | `bt-hero` |
| `c-hero__bg` | `bt-hero__bg` |
| `c-hero__content` | `bt-hero__content` |
| `c-button-toolbar` | `bt-btn-toolbar` |
| `c-button-toolbar--wide-spacing` | `bt-btn-toolbar--wide-spacing` |
| `c-button-toolbar--vertical` | `bt-btn-toolbar--vertical` |

**Rationale:** The split between `bc-` (Bootstrap Custom) and `c-` (Component)
was never meaningful in practice and caused constant confusion. Every Booktower
component class now uses `bt-`. The `u-` prefix for utilities and layout shells
is unchanged.

---

## Status key

**Note:** This changelog tracks migration from `docs/analysis/old-ui-kit-css/main.css` only. Classes that are new to v2 with no old-system equivalent are not listed here — they live in the generated `docs/CLASSES.md` (usage notes in `AGENTS.md`).

| Symbol | Meaning |
|--------|---------|
| ✅ Carried over | Same class name, same job, rewritten on new token stack |
| 🔄 Renamed | Same concept, new name — old name retired |
| 🔧 Revised | Same name, meaningfully changed behaviour or scope |
| ⏳ Planned | Exists in OLD, not yet written in v2 — do not use |
| ❌ Retired | Removed intentionally — see note |
| 🆕 New | Did not exist in OLD system |

---

## Foundation tokens

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| Sass variables (`$blue`, `$gray-100`, etc.) | CSS custom properties (`--bt-blue-600`, `--bt-gray-100`, etc.) | 🔄 Renamed | Moved from Sass compile-time to runtime CSS variables. Theming and surface switching now possible without recompile. |
| `$border-color` | `--bt-border-color` | 🔄 Renamed | |
| `$text`, `$text-muted` | `--bt-text`, `--bt-text-muted` | 🔄 Renamed | |
| `$header` (heading colour) | `--bt-gray-1000` | 🔄 Renamed | No longer a separate semantic token — headings use body text colour. |
| `$primary` | `--bt-blue-900` | 🔄 Renamed | Dark navy, not UGent blue. UGent blue is `--bt-blue-600`. |
| `font-size: 62.5%` on `html` (base 10 rem) | `font-size: 16px` on `html` (standard rem) | ❌ Retired | The base-10 trick is gone. All values in v2 use standard rem (16px base). OLD pixel values ÷ 10 × 0.625 to convert: e.g. `1.8rem` OLD = `1.125rem` v2. |
| `$box-shadow`, `$box-shadow-lg` | `--bt-shadow`, `--bt-shadow-md`, etc. | 🔄 Renamed | Full scale: `xs`, `sm`, (base), `md`, `modal`. |

---

## Typography

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `font-family: 'Source Sans Pro'` | `font-family: var(--bt-font-sans)` → system-UI stack | 🔄 Renamed | Font family changed. No web fonts loaded for sans-serif — uses OS native stack. |
| — | `var(--bt-font-mono)` → OS monospace stack | 🆕 New | Used for identifiers (DOI, Biblio ID, ISBN). No web font loaded — uses `SFMono-Regular`, `Consolas`, `Liberation Mono`, `Menlo`. |
| `h1`–`h4` coloured via `$header` | `h1`–`h6` coloured via `--s-heading-color` | 🔧 Revised | Heading colour is now `--bt-blue-800` (#132e53) on both surfaces via CSS variable. |
| `display-1` through `display-6` | Same | ✅ Carried over | Bootstrap display classes, now wired to surface tokens (`--s-heading-color`, `--s-display-weight`). |

---

## Layout

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `d-flex` + `u-scroll-wrapper` + `u-scroll-wrapper__body` (flex-stacked, `overflow: hidden` on `main`) | `u-layout--app` / `u-layout--public` | 🔄 Renamed | Grid shells replace the fragile flex approach. Sticky sidebars and split panes now work correctly. |
| `u-scroll-wrapper` | — | ❌ Retired | Not carried into v2. Use the layout shells and explicit scroll regions instead. |
| `u-scroll-wrapper__body` | — | ❌ Retired | Same as above. |
| `u-maximize-height` | Bootstrap `h-100` | ❌ Retired | Bootstrap utility covers this. |
| `u-inner-content` (`height: calc(100% - 3.2rem)`) | Not needed | ❌ Retired | Grid layout makes this unnecessary. |

---

## Navigation & topbar

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-navbar` | `bt-navbar` | ✅ Carried over | Active in `_booktower-navbar.scss`. |
| `bc-navbar--fixed` | `bt-navbar--fixed` | ⏳ Planned | Sticky variant. |
| `bc-navbar--white` | `bt-navbar--white` | ⏳ Planned | |
| `bc-navbar--large`, `--small` | ⏳ | ⏳ Planned | Size variants — review whether all are needed. |
| `nav.nav-main` | ⏳ | ⏳ Planned | Top-level navigation links inside navbar. |
| `bt-navbar__brand`, `__sep`, `__nav`, `__link` | Same | ✅ Carried over | BEM elements — all active. `__mark` does not exist; do not use. |
| `nav.nav-sidebar` | `bt-sidebar` | 🔄 Renamed | The old sidebar nav addon is replaced by the shell-level `bt-sidebar` component. |
| `nav.nav-tabs` | `nav.nav-tabs` | ✅ Carried over | Bootstrap nav-tabs with booktower overrides. Defined in `_bootstrap-components.scss` (currently commented). |
| `nav.nav-pills` | Bootstrap `nav-pills` | ✅ Carried over | Use Bootstrap directly. |

---

## Toolbar

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-toolbar` | `bt-toolbar` | ✅ Carried over | Active in `_booktower-toolbar.scss`. |
| `bc-toolbar-left` | `bt-toolbar__left` | 🔧 Revised | Corrected to BEM `__element` syntax. |
| `bc-toolbar-right` | `bt-toolbar__right` | 🔧 Revised | |
| `bc-toolbar-title` | `bt-toolbar__title` | 🔧 Revised | Surface-aware: light weight in public, sans 500 in backoffice. |
| `bc-toolbar-item` | `bt-toolbar__item` | ✅ Carried over | Spacing unit within toolbar halves. Active in `_booktower-toolbar.scss`. |
| `bc-toolbar-sm` | ⏳ | ⏳ Planned | Compact height variant. |
| `bc-toolbar--auto` | `align-items-start` | 🔄 Renamed | Use Bootstrap utility (the interim `.bt-toolbar.h-auto` hook was removed in v2.2). |
| `bc-toolbar--top` | Bootstrap `align-items-start` | 🔄 Renamed | Use Bootstrap utility. |
| `bc-toolbar-lg-responsive` etc. | ⏳ | ⏳ Planned | Responsive stack variants — may be handled differently in v2. |
| `c-button-toolbar` family | — | ❌ Retired (v2.2) | Briefly lived on as `bt-btn-toolbar`, removed 2026-07-03. One `bt-toolbar__item` per action inside toolbars; `d-flex gap-2` elsewhere. |

---

## Sidebars

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-sidebar` (narrow icon rail, blue bg) | `bt-sidebar` | 🔄 Renamed | This is the sidebar pattern retained in v2. |
| `c-sidebar--bordered` | `bt-sidebar—-bordered` | 🔄 Renamed | |
| `c-sidebar--dark-gray`, `--green` | — | ❌ Retired | |
| `c-sidebar` | `bt-sidebar` | 🔄 Renamed | This is the sidebar pattern retained in v2. |

| `c-sub-sidebar` (wide text nav) | `u-main__sidebar` | 🔄 Renamed | This is the second sidebar pattern retained in v2. |
| `c-sub-sidebar--bordered` | `u-main__sidebar--bordered` | 🔄 Renamed | |
| `c-sub-sidebar--medium`, `--large`, `--xlarge`, `--xxlarge`, `--xxxlarge`, `--small`, `--icons` | — | ❌ Retired | Width variants are not being carried into v2. |
| `c-sub-sidebar-responsive-wrapper` | — | ❌ Retired | Responsive behavior is handled by the layout shell, not a wrapper class. |

---

## Stepper (deposit flow)

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-stepper`, `c-stepper__*` | — | ❌ Retired | The stepper is intentionally not part of this UI library. Deposit flows now use the shared app shell and page-local structure only. |

---

## Facets

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-facets`, `c-facet-title`, `c-facet-check`, `c-facet-name`, `c-facet-count`, `c-facet-separator`, `c-facets-col`, `c-results-col`, `c-content-area` | — | ❌ Retired | The old facet grid and results column classes are not carried into v2. Use Bootstrap `fieldset`, `legend`, `form-check`, spacing utilities, and the `u-main__*` layout contract instead. |

---

## Buttons

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.btn` | `.btn` | ✅ Carried over | Active in `_buttons.scss`. System-UI, 500 weight. |
| `.btn-primary` | `.btn-primary` | ✅ Carried over | `--bt-blue-800` background, not UGent blue. |
| `.btn-secondary` | `.btn-secondary` | ✅ Carried over | Outlined, blue-navy border. |
| `.btn-danger` | `.btn-danger` | ✅ Carried over | Outlined danger. |
| `.btn-link` | `.btn-link` | ✅ Carried over | |
| `.btn-sm`, `.btn-lg` | `.btn-sm`, `.btn-lg` | ✅ Carried over | |
| `.btn-ghost` | `.btn-ghost` | ✅ Carried over | Active in `_buttons.scss`. |
| `.btn-outline-primary` | Bootstrap `btn-outline-primary` | 🔧 Revised | Use Bootstrap directly — v2 overrides to match token colours. Currently commented. |

---

## Forms & inputs

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.form-control` | `.form-control` | ✅ Carried over | Active. Standard rem sizing (not base-10). |
| `.form-select` | `.form-select` | ✅ Carried over | Active. |
| `.form-label` | `.form-label` | ✅ Carried over | Active. |
| `.form-text` | `.form-text` | ✅ Carried over | Active. |
| `.valid-feedback`, `.invalid-feedback` | Same | ✅ Carried over | Active. |
| `.is-valid`, `.is-invalid` | Same | ✅ Carried over | Active. |
| `.form-check-input` | `.form-check-input` | ✅ Carried over | Active. `accent-color` on v2. |
| `.form-control-search` | `.form-control-search` | ✅ Carried over | Active. Pill shape with embedded search icon. |
| `c-radio-card` | `bt-btn-check` | ✅ Carried over, adapted syntax | Active. Parent element: `bt-btn-check__group`. |
| `c-file-upload` / `c-file-drop` | `bt-file-drop` | ✅ Carried over | Active. Child elements: `bt-file-drop__icon`, `__text`, `__hint`. |
| `tagify` | ⏳ | ⏳ Planned | Tag input (third-party lib integration). |
| `flatpickr` | ⏳ | ⏳ Planned | Date picker (third-party lib integration). |

---

## Badges

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.badge` | `.badge` | ✅ Carried over | Active in `elements/_badges.scss`. Fixed size via `--bs-badge-font-size: var(--bt-text-xs)` (12px) — predictable regardless of parent font-size. |
| `.badge.bg-primary` + `text-*` | `.badge.text-bg-primary` (etc.) | 🔧 Revised | Colour a badge with Bootstrap's `text-bg-*` helper, not `bg-*` + `text-*`. Token colours (incl. new `text-bg-info` and the `text-bg-*-light` soft set) are remapped in `elements/_badges.scss` with `!important` to beat Bootstrap's helper. All variants clear WCAG AA. |

---

## Alerts

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.alert`, `.alert-primary`, `.alert-success`, `.alert-warning`, `.alert-danger`, `.alert-secondary` | Same | ✅ Carried over | Active in `components/_bootstrap-components.scss`. |
| `.alert-dismissible` + `.btn-close` | Same | ✅ Carried over | Bootstrap pattern, unchanged. |

---

## Cards

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.card`, `.card-body`, `.card-title`, `.card-footer` | Same | ✅ Carried over | Bootstrap cards remain available for boxed containers. The work card is not one of them — see the row below. |
| `card--work`, `card-research`, `card-meta`, `card-actions`, `card-title`, `card-authors`, `card-publication` | `bt-work-card` and `bt-work-card__*` | 🔄 Renamed | Domain research-output card lives in `_booktower-work-card.scss`. A border-separated list item, with its own `__header`/`__body`/`__footer` — it carries no `card-*` class (v2.13). |

---

## Tables

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.table`, `.table-hover` | Same | ✅ Carried over | Bootstrap tables remain available and get Booktower token overrides. |
| `.table-wrap` | ⏳ | ⏳ Planned | Bordered container with overflow handling. |

---

## Modals

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.modal`, `.modal-content`, `.modal-header`, `.modal-body`, `.modal-footer`, `.modal-title` | Same | ⏳ Planned | Not yet active in v2 (commented). Surface-aware title styling. |

---

## Avatars

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-avatar` | `bt-avatar` | ✅ Carried over | Active in `_booktower-components.scss`. |
| `bc-avatar--small`, `--large` | `bt-avatar--small`, `bt-avatar--large` | ✅ Carried over | |

---

## Empty states

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-blank-slate` | `bt-blank-slate` | ✅ Carried over | Active in `_booktower-components.scss`. |
| `c-blank-slate-muted`, `-primary` | `bt-blank-slate--muted`, `--primary` | 🔧 Revised | OLD used no double-dash — inconsistent with BEM. v2 corrects this. |

---

## Miscellaneous components

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-side-panel` (fixed overlay panel) | ⏳ | ⏳ Planned | Fixed right panel for detail overlays. |
| `c-activity-list` | ⏳ | ⏳ Planned | Activity / history feed. |
| `c-author` | ⏳ | ⏳ Planned | Author chip / inline author display. |
| `c-bullet` | ⏳ | ⏳ Planned | Inline bullet separator. |
| `c-comment` | ⏳ | ⏳ Planned | Message / comment block. |
| `c-counter` | ⏳ | ⏳ Planned | Numeric counter badge. |
| `c-divider` | ⏳ | ⏳ Planned | Labelled horizontal rule. |
| `c-dl` | ⏳ | ⏳ Planned | Grid-based definition list. |
| `c-meta-list` | ⏳ | ⏳ Planned | Compact metadata key-value list. |
| `c-or` | ⏳ | ⏳ Planned | "— or —" divider between form options. |
| `c-progress-bar` | ⏳ | ⏳ Planned | Custom progress bar. |
| `spinner-card-backdrop` | ⏳ | ⏳ Planned | Loading overlay on a card. |
| `c-thumbnail` | ⏳ | ⏳ Planned | File/image thumbnail. |
| `c-content` | ⏳ | ⏳ Planned | Prose content container (long-form text). |
| `c-abbr` | ⏳ | ⏳ Planned | Styled abbreviation with tooltip. |

---

## Utilities

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `u-scroll-wrapper` | — | ❌ Retired | |
| `u-scroll-wrapper__body` | — | ❌ Retired | |
| `u-maximize-height` | Bootstrap `h-100` | ❌ Retired | |
| `u-inner-content` | — | ❌ Retired | Grid layout makes this unnecessary. |
| `u-hidden` | Bootstrap `d-none` | ❌ Retired | |
| `u-horizontal-scroll` | ⏳ | ⏳ Planned | May be retained. |
| `u-max-lines` | ⏳ | ⏳ Planned | Line clamp utility — useful, worth keeping. |
| `u-no-transition` | ⏳ | ⏳ Planned | |
| `u-divide-x` | ⏳ | ⏳ Planned | |
| `u-min-w-0` | Bootstrap `mw-0` or custom | ⏳ Planned | Critical for flex/grid text truncation. |
| `u-smooth-scroll` | ⏳ | ⏳ Planned | |
| `u-mix-blend-multiply` | ⏳ | ⏳ Planned | |
| Specific widths (`u-min-w-750`, `u-max-w-720`, etc.) | — | ❌ Retired | Too specific. Use layout tokens or Bootstrap grid instead. |
| `u-section` (margin-top) | Bootstrap spacing utilities | ❌ Retired | |
| `u-z-reset` | ⏳ | ⏳ Planned | Probably worth keeping. |
| Background/text colour utilities (`bt-bg-*`, `bt-text-*`) | Same | 🆕 New | Did not exist in OLD. Full token-scale utilities. |

---

## HTMX

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| — | `htmx-indicator`, `htmx-request`, `htmx-swapping`, `htmx-settling` | 🆕 New | HTMX state classes. Defined in `_booktower-components.scss` (currently commented). |

---

## Bootstrap nav add-ons (OLD `bootstrap-additions/`)

These were Bootstrap overrides in the OLD system. In v2 they either use Bootstrap directly or are handled by the component layer.

| OLD class | v2 approach | Status |
|-----------|------------|--------|
| `nav.nav-main` | Part of `bt-navbar__nav` | ✅ Carried over |
| `nav.nav-sidebar` | Folded into `bt-sidebar` | 🔄 Renamed |
| `nav.nav-tabs` | Bootstrap + override in `_bootstrap-components.scss` | ⏳ Planned |
| `nav.nav-pills` | Bootstrap directly | ✅ Carried over |
| `nav-tabs-scrollable` | ⏳ | ⏳ Planned |

---

## What is genuinely new in v2

Things that did not exist at all in the OLD system:

- **Surface system** — `data-surface="public"` / `data-surface="backoffice"` switching typography, density, and colour via CSS variables
- **Two-surface type system** — public uses system-UI at weight 300 (refined, editorial); backoffice uses system-UI at weight 600 (dense, tool-like). Both share `--bt-blue-800` as the heading colour.
- **Selective heading weights** — `h4` and `h6` carry `font-weight: 300` regardless of surface; `h6` also gets uppercase + letter-spacing, making it a label element
- **Italic `.lead` on public surface** — scoped to `[data-surface="public"]`, not applied in backoffice
- **CSS custom property token stack** — runtime theming, no Sass recompile needed
- **`u-layout--app` / `u-layout--public`** — CSS grid layout shells (replace flex stacking)
- **Institutional blue as design signature** — `--bt-blue-800` on headings, displays, buttons, and ghost button hover across both surfaces
- **Full colour scale utilities** — `bt-bg-*`, `bt-text-*` for every token
- **`bt-toolbar` surface awareness** — title font changes with surface context
- **HTMX patterns** — documented and built into the system, not bolted on
- **`ds-page`, `ds-demo`, `ds-code`** — design system documentation chrome (shell only)
