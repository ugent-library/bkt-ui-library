---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backoffice] Work card: message blocks for the researcher and for curators"
---

## Why

The old backoffice card carries one message: the Biblio message, an info alert with
the curator's note to the researcher, shown to everyone who sees the card. What the
record is missing is not on it — a curator opens the record to find out, and chases
by email or helpdesk ticket.

In raven the card carries two blocks, split by audience. **"For the researcher"** —
warning-toned, visible to researcher *and* curator — holds three lines in a fixed
order: what is automatically missing from the researcher's own list, the Biblio
message, and the call to action. **"For curators"** — quiet, marked with a padlock,
curators only — holds the bibliographic completeness list and the internal note
curators write to each other. The padlock marks the block as
curator-only without needing a sentence. Lines stack, never columns: the card sits in a narrow
split-screen pane. Nothing missing and no note means no block.

On a returned record the Biblio message is the return reason: one text, one
field, no second place to store it.

Both field lists are fixed in `docs/DOMAIN-VOCABULARY.md` → "Messages on backoffice
cards": the researcher's covers what only they can supply, the curator's covers
bibliographic work.

Marie Curator (reviewer) asked for the list to show completeness — a complete
record is not necessarily a correct one, and she needs to see which is which
before opening anything. Otto
Thor (researcher) and Stan Standish (proxy) want to fix their own records rather
than wait for a message and a reply.

> **Screenshot:** the researcher's view, warning block only
> (`search-researcher.html`, the draft dataset)

> **Screenshot:** a curator's view of the same kind of card, both blocks
> (`curate.html`, first card)

## What

- [ ] "For the researcher" block — warning alert, researcher and curator
  - missing items from the researcher list, in the documented priority order
  - the Biblio message; on a returned record, the return reason from the record's
    history
  - the "Complete metadata" call to action. Until the fast lane exists it opens the
    record's edit form, keeping its wording
- [ ] "For curators" block — quiet alert with the padlock, curators only
  - missing items from the curator list
  - the internal note
- [ ] Each block, and each line, renders only when it has content
- [ ] A field the work type does not carry is never reported as missing
- [ ] Blocks sit below the reference line, researcher block first
- `out of scope` The fast lane behind "Complete metadata" — no screens yet
- `out of scope` Writing, editing or replying to messages from the card
- `out of scope` Message templates and assignment — own issue
- `out of scope` **Per-field add links.** Today's backoffice card turns an empty
  field into an inline link where the viewer may edit — "Add document type: full
  text", "Add department", "Add license" — and plain text where they may not ("No
  department(s)"). Parity work, not designed yet: the missing-items line names what
  is missing, the add links are how you fix one from the card. Design with the
  backoffice pass.

The prototype covers **a draft with items missing, a submitted record with both
blocks, and a returned record whose only message is the return reason**. We iterate
on top. Flag ambiguity.

- The curator block is not hidden from researchers — it is absent from what they
  are served.
- Message text may contain URLs; the old card rendered them as links. Keep that,
  with the surrounding text escaped.

_The prototype governs the visible page and markup. JS follows raven's frontend
standards. Prototype URLs are placeholders. UI copy goes through the translation
files._

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/templates/biblio-team/curate.html`,
`.../biblio-researcher/search-researcher.html`, and
`localhost:3111/patterns/work-card.html`.

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth paths
- [ ] A researcher's page never contains the curator block, in the served HTML
- [ ] A returned record's Biblio message is the return reason, with no second place
      to store it
- [ ] A complete record with no notes renders no block
- [ ] Passes the pre-flight checklist in `bkt-ui-library/docs/ACCESSIBILITY.md`, plus:
  - [ ] Each block is announced with its audience; the padlock is decorative
  - [ ] Lines stay stacked at a narrow pane width
- [ ] `make build` passes

## Dependencies

- Blocked by **04**, and by **11** for the two missing-items lists.

## Open questions

None.
