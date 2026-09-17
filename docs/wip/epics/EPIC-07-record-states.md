# [both][07] Record states: retracted, deleted, replaced, pending

## Why

Raven has soft delete (tombstone) and `replaced_by` (merge redirect); neither has a
display. Retraction will be built in raven, timing open (M, 2026-07-30); a retracted
work stays public with a notice. A pending request (a proposed change to a reviewed
record) has no raven model at all. Design leads, raven follows.

## What

- [ ] Retraction notice: public detail page and card
- [ ] Backoffice rendering of retracted, soft-deleted and replaced-by
- [ ] What the public permalink does beyond the 302 for replaced-by
- [ ] Pending request: proposed values per field, accept / decline / clarify, a message rides it, public keeps the last accepted value. Raven models it; we draw it
- `later` Pending requests in the curator queue and on cards

**Prototype:** [public record](http://localhost:3111/templates/biblio-public/public-work-detail.html?state=restricted),
[curator](http://localhost:3111/templates/biblio-team/curate-detail.html)

Vocabulary: `docs/DOMAIN-VOCABULARY.md`, "Accepted value and pending request".
