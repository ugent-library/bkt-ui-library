# [public][04] Public works search, remaining

## Why

The surface is modelled: URL is truth, search enters, filters narrow, the chip bar is
the readout. Left: parity leftovers, two positioning bugs and the advanced-search
gates. Sue Kerr (public discovery visitor), plus external visitors landing from
Research Explorer without context.

## What

Bugs, no decision needed:
- [ ] Filter editor drops by the toolbar's height, not the chip's — `filter-bar.js` takes `top` from the anchor; `top-100` comes off all three bars
- [ ] Field chooser overflows the dialog by 73px at 560px — the step-inside-the-dialog design the pattern page names, not a third positioning mechanism
- [ ] Two surfaces highlight less than they match (ORCID, meta) — low

Parity:
- [ ] Sort and per-page as URL params
- [ ] Extend facets and the Add-filter picker to the pilot's filter types; feeds mobile
- [ ] Identifier filter: unrecognised input feedback, multi-value paste
- [ ] Org picker: hierarchy, what ticking a parent means, per-faculty scoping (answer with the reporting owners)

Advanced search gates, in order:
- [ ] Ask raven the URL-grammar question now
- [ ] Golden set runs green
- [ ] Implementation issues — filed as raven #223–#230, rewrite in progress
- `test` Add-filter discoverability; fallback pre-registered: Author alone becomes a sidebar typeahead
- `later` Expert search boundary against Advanced

**Prototype:** [works](http://localhost:3111/templates/biblio-public/public-works.html?state=results),
[builder](http://localhost:3111/patterns/query-builder.html)
