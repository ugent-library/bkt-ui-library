# Handoff — work-card issues (2026-08-07)

Paste into a new session:

```
Read AGENTS.md in the booktower-ui-library repo root and follow the session start
instructions. Then read notes/issues-work-card/HANDOFF.md and continue from it.
Task: <state the task>.
```

## State

13 drafts in `notes/issues-work-card/`:

- `00-EPIC-public.md` — children 01 grammar, 02 reference line, 03 access badge,
  08 backend fields, 09 backend container filter. **Ready to file.** M files them.
- `00-EPIC-backoffice.md` — children 04 card, 05 messages, 06 actions, 12 retracted
  badge, 10 backend retraction, 11 backend missing-metadata. **Held**: the
  backoffice pass has not run — no fast-lane screens, no proxy axis, no backoffice
  detail view for a card title to open.
- `07-match-card-amendment.md` — edits to raven#125, not a new issue.

## Decisions this round — all applied to the drafts and docs

- **Three sources, three weights.** The prototype is the spec; raven GitHub issues
  are decisions, cited (#141, #164, #155/#156/#157/#159, #125, #167, #51, #153);
  raven's code is neither — never cited, never a benchmark, never "drift". Backend
  children 08–11 are phrased as the template's question: "does raven model this,
  and if not do we build it or drop it?", with concrete options.
- **The reference line spec** (`docs/wip/WORK-CARD-REFERENCE-STYLES.md`) is one
  order + five exceptions; the per-type table is derived examples. There is no
  fallback rule: the order is the rule.
- **Punctuation and line production are the dev team's.** The CSL render is
  provenance for the examples — one line in Sources. Same for the scan line's
  part rendering (`p. 58`-level detail is gone on purpose).
- **Dates** (`docs/DOMAIN-VOCABULARY.md` → "Dates in the UI"):
  public is human-readable ("5 August 2026"), no metadata timestamps on public
  work cards; backoffice is `dd/mm/yyyy hh:mm`; the backoffice card logs who
  created the metadata and when, who last changed it and when, and the last
  system change and when.
- **No decision stamps in docs** — state the rule; git holds when. Name an
  authority only where a specific owner adjudicated. Derived rules cite the
  derivation ("kept from old biblio", "per raven#164") — most decisions are
  continuity with the existing product, not personal rulings.
- **Point, don't paste**: What bullets link the spec doc instead of restating its
  rows. Performance conventions (N+1) live in raven's AGENTS.md, never in issues.
- `docs/SPEC-WRITING.md` gained: before sourcing a claim, check it is ours to
  make — precision that belongs to the implementer is deleted, not evidenced.

## Open questions standing — all external, each in its issue

Subtype/classification on cards (public epic); visibility on return (04, OSP with
the curation lead); anonymous Add to list (06 — belongs on raven#141); one each in
08, 09, 11; two in 10 (notice text — OSP; export exclusion — raven dev team).

## M's raven edits, still to do

- **raven#125** — draft 07 is the amendment: lazy-load framing in three places is
  M's to update; keyword contradiction needs one side picked; `AGENT.md` →
  `AGENTS.md` path fix.
- **raven#141** — same wrong `AGENT.md` path; the anonymous Add-to-list question
  belongs on it.
- **raven#51** — decide whether 04 becomes its body or its child.

## Verify

`npm test` — the check-a11y pagination findings are the known pre-v2.11 baseline.
The `public-project-detail.html` KNOWN BROKEN defect stands; issues name it as a
defect not to reproduce.
