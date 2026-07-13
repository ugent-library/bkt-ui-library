---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[area] "
---

<!--
Title: [area] verb + deliverable + scope, e.g.
"[public] Align work detail page with Booktower prototype: Journal Article"

Anti-rot rules:
- Point, don't paste. Link to prototype files and docs; never copy code
  or markup into the issue.
- The prototype is the spec. If the issue text and the prototype
  disagree, the prototype wins. Screenshots are snapshots at filing time.
- No file paths beyond the source-of-truth ones below. Whoever picks
  this up verifies current state on disk before editing.
- Stable conventions live in the repo agent docs, not here:
  raven conventions in CLAUDE.md/AGENTS.md, design system conventions
  in bkt-ui-library/AGENT.md.
-->

## Why

<!-- 2–4 terse, self-contained sentences: the design intent — what the
     region does for the user. Lead with that, never with a backend gap.
     Whether raven models the data yet is a question to resolve while
     finishing the issue (log it under Open questions), not the framing.
     Link a docs/ decision record if one exists. Add one overview
     screenshot of the prototype below the text when filing. -->

## What

<!-- Checkbox breakdown of the page/component regions, nested bullets
     per region. Mark deferred regions inline with `out of scope`. -->

- [ ] Region
  - part
  - part
- [ ] Region
- `out of scope` Region

<!-- If the prototype covers one primary case, scope it: -->

The prototype covers the **<type> happy path**. Other cases follow the
same layout and may fall short for now. We iterate on top. Flag ambiguity.

<!-- One bullet per behavior or decision that isn't visible in the
     markup. Inline screenshot per bullet when filing. Honest notes for
     unsolved patterns ("no pattern yet. Later.") beat silence. -->

_The prototype governs the visible page and markup. Machine-facing
output (`citation_*` tags, Signposting, `?format=` alternates, crawl
semantics) is governed by `docs/public-site-semantics.md` — preserve
as-is. JS follows raven's frontend standards (`data-` components, no
inline handlers). Prototype `hx-*` URLs are stubs. UI copy goes through
the translation files._
<!-- Backoffice issue: delete the machine-facing sentence, keep the rest. -->

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/<template path>`

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Visual and UI copy review by the product manager before merge
- [ ] Passes the pre-flight checklist in `bkt-ui-library/AGENT.md`,
      plus these component-specific concerns:
- [ ] `make build` passes

## Out of scope

<!-- Explicit. Deferred regions and decisions land here with a one-line
     pointer so they aren't lost, e.g.
     "Related research — own issue (top 3 keyword matches + 'look for
     more' link)". -->

## Dependencies

<!-- Blocked by / blocks: #issue links. Delete if none. -->

## Open questions

<!-- Questions to resolve while doing the issue — including "does raven
     model this, and if not do we build it or drop it?". Log the question
     and the options; the answer comes from a conversation, not from
     inventing a rule. Anything strategic goes to docs/. Delete if none. -->
