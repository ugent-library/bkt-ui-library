# [both][05] Work cards

## Why

One card, same regions, same order on both surfaces. The public vs backoffice content
model is not defined, so five pilot types × access × status × contributor shape ×
completeness have no sample set. Public is not a finished record: the card must not
imply completeness, leak workflow state or imply "verified".

## What

- [ ] Content model, then sample cards in `public-works` and `curate`
- [ ] `docs/LIST-GOALS.md`: what the two lists are for, in which order a person reads a row. Blocks every structural card decision
- [ ] Meta-line polish (`bt-meta-list`), mobile first
- [ ] Diamond OA badge — no class exists; not parity, needed
- [ ] `rel="alternate"` feed link on the public list
- [ ] Review lifts, CSS-only, after parity: quiet action buttons, muted affiliation glyphs, hairline rows, reading measure, status order integrity → availability → kind, `tc-refine`
- [ ] [#24](https://github.com/ugent-library/bkt-ui-library/issues/24) Thumbnails brainstorm
- `after ship` Peer-review indicator — no slot now
- `someone else` Plain-language qualifier next to "Restricted access"; relevance as sort default under a query
- `closed` Status row stays on line 1

**Prototype:** [pattern](http://localhost:3111/patterns/work-card.html),
[public](http://localhost:3111/templates/biblio-public/public-works.html?state=results),
[curate](http://localhost:3111/templates/biblio-team/curate.html)

Decisions so far: [`WORK-CARD-HANDOFF.md`](../WORK-CARD-HANDOFF.md).
