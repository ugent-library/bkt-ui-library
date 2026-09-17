# [backoffice][01] Work detail

## Why

A card title has a destination on both surfaces: `curate-detail` for Marie Curator
(reviewer), `work-detail` for the researcher. The draft state, the edit form the
actions point at and the aside that holds the curator notes are not designed. Raven
fills the gaps in `raven.css`.

## What

- [ ] [#39](https://github.com/ugent-library/bkt-ui-library/issues/39) Define the page-level two-pane layout for contextual asides — on branch
- [ ] [#40](https://github.com/ugent-library/bkt-ui-library/issues/40) Define the curator record-notes component contract — after #39; the notes sit in that aside
- [ ] [#27](https://github.com/ugent-library/bkt-ui-library/issues/27) Confirmation dialog with a computed preview: change a work's type
- [ ] Draft state on the researcher page
- [ ] Edit form the actions point at; `work-edit` has returned and accepted
- [ ] Returned-record message binds to raven's event comment; no separate store
- `later` Fast lane: complete a record — the CTA opens the edit form until it exists
- `later` Proxy view — epic 10

**Prototype:** [curator](http://localhost:3111/templates/biblio-team/curate-detail.html),
[researcher](http://localhost:3111/templates/biblio-researcher/work-detail.html?state=returned),
[edit](http://localhost:3111/templates/biblio-team/work-edit.html?state=returned)

Closed #38 (heading and status contract) is the base.
