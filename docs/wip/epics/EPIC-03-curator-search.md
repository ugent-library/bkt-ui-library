# [backoffice][03] Curator search

## Why

Curators use public Advanced search because nothing else exists. Their dimensions
(review status, locked, faculty, classification, missing fields) fail the public
surface test. Raven runs a navbar search overlay through `[data-search-overlay]` in
`raven.css` meanwhile. Marie Curator works split-screen; every full-bleed mode gets
re-judged at that width.

## What

- [ ] Scope the curator search surface first; nothing below starts before it
- [ ] [#42](https://github.com/ugent-library/bkt-ui-library/issues/42) Define the backoffice global-search suggestion-panel contract — same markup as the public panel, or a documented modifier: M decides
- [ ] [#23](https://github.com/ugent-library/bkt-ui-library/issues/23) Search count per result item — where am I in the set
- [ ] Extended query builder: the public builder plus the seven rule-backed drops, Journal impact factor and the curator dimensions
- [ ] Full-text version facet — raven does not index it yet; dependency
- `idea` Dual-action suggestion row: navigate, or add as filter. Needs a keyboard model before it is scheduled

**Prototype:** [curate](http://localhost:3111/templates/biblio-team/curate.html)

Queued behind public. Depends on the public builder's field list settling.
