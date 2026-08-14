# Query builder — wireframe handover

2026-08-14. Source: `Query Builder Wireframes.dc.html` in this design project, turn 5
(frames 5a–5h). Everything below was reviewed and picked by M across turns 1–5.

## Files in this folder

| file | replaces | notes |
|---|---|---|
| `search-advanced-conditions.html` | `templates/partials/search-advanced-conditions.html` | new row grammar + states; handoff rail and readback removed |
| `search-advanced-actions.html` | `templates/partials/search-advanced-actions.html` | approximate count, sticky exit bar, zero state |
| `_query-builder.scss` | `assets/scss/patterns/_query-builder.scss` | full replacement |

Template states renamed/added: `advanced-empty` (now the flat chooser), `built`,
`advanced-group`, plus new `advanced-prefilled` and `advanced-zero`. Host pages
(`public-search-advanced.html`, `public-works.html`) need their `@states` lists updated.

## Decisions (frame → decision)

- **Row grammar (2a/5c):** visible field label + operator select + value control on a
  fixed grid (12rem / 8rem / 1fr / actions). Value dominant, mechanics quiet. No row
  numbers, no boxed rows — hairline separators.
- **Blank state (4a→5a):** the chooser laid flat — search, 5 Common conditions with a
  one-line meaning, All fields as a quiet list, three dashed "Or start from" examples.
  No big typeahead (the 3a/2c typeahead direction was dropped: too close to the works
  search box).
- **Adding mid-session (B3→5d):** "Add a condition" opens the same content as a
  one-click panel. No detail pane, no Continue.
- **Prefilled arrival (3b/5b):** entity scope and active facets arrive as ordinary rows;
  a "From … → Refine in search" line above the builder is the only provenance.
- **Count (2a/5c):** in a sticky bottom exit bar with the single Show results exit.
  Always "About N" — the count is an approximation; exact set is the results page's job.
- **Paste (5c, replaces 4b and the collapsed A4 summary):** paste lives IN an Identifier
  "is any of" row as a growing textarea (`field-sizing: content` + JS fallback).
  Recognition summary under it; unrecognised lines reported, never dropped.
- **"or…" (4c/5f):** a row action with permanently reserved space, visible on row hover
  / focus-within, always in tab order. Clicking wraps the row into the OR group; one
  alternative left → collapses back to a plain row. Group = tinted region on the same
  grid, "Ungroup" quiet in the group foot.
- **Value search (2d/5e):** entity typeahead with crest + faculty; picked = token inside
  a `people-input` that keeps a live "Add another person…" input; no match = explicit
  fallback to ONE "Name as written" string field (not split name parts).
- **Zero results (A6/5g):** message in the exit bar, last-changed row marked, Show
  results disabled, nothing auto-dropped. Per-condition pass/fail deliberately not shown
  (QUERY-BUILDER-DESIGN.md item 4).
- **Facet held (S3/5h):** unchanged from the existing pattern.
- **Field list:** public phase-1 only — Words or topic, Title, Abstract, Keyword,
  Contributor, Affiliation, Project, Publication type, Publication year, Host
  publication, Publisher, Full text access, Identifier, Language. Classification and
  Research discipline removed from the chooser (rule 5).
- **Names:** person pills and suggestions read first-name-first ("Jan Coppens"). M
  flagged the "Last, First" pattern as a DS-level fix to make elsewhere.

## Work this creates outside these files

- `patterns/query-builder.html` — rewrite the sections that describe the handoff rail,
  the readback, the four-column chooser, and the actions bar. The container section
  ("dialog vs page vs full-bleed mode") is decided — see Decisions taken while
  implementing, below.
- `assets/js/query-builder.js` — chooser one-click add; "or…" wrap/collapse; textarea
  autogrow fallback; paste scheme-recognition + unrecognised-lines report (stub);
  debounced approximate count. Register changes in `docs/JAVASCRIPT.md`.
- `docs/CLASSES.md` regenerates via `npm run build`; new classes: `__row-op`,
  `__row-value`, `__row--last-changed`, `__row--alt`, `__or-toggle`, `__group-label`,
  `__group-foot`, `__blank`, `__blank-columns`, `__field-links`, `__starts`, `__start`,
  `__value-select`, `__exit`. Removed: `__main`, `__handoff*`, `__readback`, `__phrase`,
  `__row-number`, `__recent*`, `__chooser-body`, `__chooser-grid`, `__chooser-foot`,
  `__choice-detail`, `__name-parts`, `__empty`, `__code`. `npm run check:classes` will
  name any I missed.
- `_colors.scss` — `_query-builder.scss` references `--bt-red-100`/`--bt-red-700` with
  fallbacks; swap for the real danger tokens.
- `docs/CLASS-USAGE.md` — note: never mix `form-control` (38px) with `form-select-sm`
  (32px) on one line; the builder rows use base height for both.
- `QUERY-BUILDER-FIELD-CONTRACT.md` open questions, add two: (9) facet params must
  round-trip into condition rows losslessly (prefilled arrival); (10) can "is not" be
  honoured on a name-as-written text condition, and where does the approximate count
  come from (index `total` with `track_total_hits` cap is the obvious source).
- `TOPLAN.md` / `QUERY-BUILDER-DESIGN.md` — record these decisions; the superseded
  pieces are the handoff rail (moved to results toolbar 2026-08-10, now confirmed) and
  the readback sentence.

## Decisions taken while implementing (2026-08-14, M)

Five, made against the drawing rather than in it. Each is open to veto in the design review
after the build.

- **Container:** the builder renders twice. A `modal-xl` dialog over the works page is the
  low-entry route from a result list; a plain request for `/works?…&advanced=1` returns the
  page rendering, so a copied link survives. `HX-Request` tells the two apart. On small screens
  the page rendering is full-bleed and `modal-xl` is a full-screen sheet. Supersedes the
  full-bleed-only call of 2026-08-10: the paste input now grows inside a scrolling row, and the
  exit bar keeps the count on screen, so neither objection stands. Recorded in
  `notes/TOPLAN.md`.
- **Group label:** "…where any of these **conditions** is true". A row's "is any of" is OR
  between values of one field, a group is OR between conditions, and without the word both read
  the same. Recorded in `QUERY-BUILDER-DESIGN.md` item 2.
- **Row actions:** an always-visible ghost `⋯` per row, holding "or… — add an alternative".
  Replaces the hover reveal, which no touch device can find. Costs a second click on the rarer
  of the two OR routes.
- **Count copy:** a short form below the `lg` breakpoint — "About 312,000 — add a condition".
  The long string wrapped to three lines at 390px inside a bar already spending scarce vertical
  space. All builder copy is reviewed after the build.
- **Change field stays out of the row.** The `change` link on a Contributor row narrows the
  role, not the field. Changing a row's field rebuilds its operators and its value widget from
  raven's field registry, which the prototype cannot answer, so no row offers it — a field is
  chosen once, in the chooser.

## Before merge

- `npm test` (check:classes both directions, check:partials, check:html, check:a11y).
- Accessibility pre-flight (`docs/ACCESSIBILITY.md`): every control labelled per row;
  one aria-live (the count); or-toggle reveal is visual only, control stays in tab
  order; zero state honours all conditions. Screen reader testing after HTMX swaps and
  the 400% zoom check remain human work.
- All `hx-*`/URLs are stubs; raven owns the URL grammar (negation, ranges, value lists,
  long-list permalink, facet round-trip) — blocked questions listed in the field
  contract.
