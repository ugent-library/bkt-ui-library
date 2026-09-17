# [backoffice][08] Merge, source, candidate

## Why

The most important backoffice surface: the curator's view onto reconciliation.
Candidates has a bet, breadboard and prototype (Found for you). Source view, reject
and duplicate merge have nothing. A live duplicate cluster blocks Review and publishing
until a curator resolves it.

## What

- [ ] Candidates: design acceptance of the rebuilt prototype, then raven issues — [`CANDIDATES-BET.md`](../CANDIDATES-BET.md)
- [ ] Source view: per-field claims by source (Crossref, ORCID, feeds vs the institution's own edits), source priority, where a user edit forked the record
- [ ] Reject: one source, or the whole record. Distinct from merge
- [ ] Duplicate clusters and merge: move sources across, then delete a pre-public duplicate or stamp replaced-by (epic 07 draws that)
- [ ] Mints that landed amid two-plus key holders, surfaced for a decision

**Prototype:** [Found for you](http://localhost:3111/templates/biblio-researcher/candidate-review.html),
[focused review](http://localhost:3111/templates/biblio-researcher/candidate-focused-review.html)

Raven's `docs/architecture-overview.md` owns the model.
