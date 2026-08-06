---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[area] "
---

<!--
Title: [area] verb + deliverable + scope, e.g.
"[public] Align work detail page with Booktower prototype: Journal Article"

House rules: docs/WRITING-RULES.md — do not invent, personas, open
questions, what-not-how, point don't paste. Template-specific:

- The prototype is the spec. If the issue text and the prototype
  disagree, the prototype wins. Screenshots are snapshots at filing time.
- No file paths beyond the source-of-truth ones below. Whoever picks
  this up verifies current state on disk before editing.
- Stable conventions live in the repo agent docs, not here:
  raven conventions in CLAUDE.md/AGENTS.md, design system conventions
  in AGENT.md.
- Express a backend gap as a `backend` child + a dependency, never as an
  asserted "X is indexed" note.
- Screenshot markers. Mark each distinct view with `> **Screenshot:** <what to
  capture>`, placed next to what it shows — one per view. The image is pasted in at
  filing. A backend issue with nothing to show says so: `> No screenshot — backend`.
-->

## Why

<!-- Three things, terse, in this order:
     1. The starting point, and where it is observed. Exists in old
        Biblio or the old backoffice? Describe those actual steps —
        concrete, not "cumbersome" — then either what's wrong with them
        or how the new approach differs. Not everything we change was
        broken. New feature? State what the user can't do today, no
        walkthrough. Never describe a current Raven flow: Raven is being
        rebuilt and isn't live, so it is not a benchmark.
     2. The target pattern, described. What the user sees, what they
        click, what happens, and which properties make it work. List
        inspiration and links underneath as references — never as the
        description. "Like GitHub" describes nothing: the reference
        drifts and the dev may not know it.
     3. Who wants what, and why. Name the user (persona from
        docs/RESEARCH-PERSONAS.md), what they're trying to accomplish,
        and why it matters to them. That sentence is the tiebreaker for
        everything this issue leaves open.
     Lead with the user, never with a backend gap. Whether raven models
     the data yet goes under Open questions, not here. Link a docs/
     decision record if one exists. Add one overview screenshot of the
     prototype below the text when filing. -->

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
as-is. JS follows raven's frontend standards. Prototype URLs are
placeholders, not real endpoints. UI copy goes through the translation files._
<!-- Backoffice issue: delete the machine-facing sentence, keep the rest. -->

**Source of truth:** [bkt-ui-library](https://github.com/ugent-library/bkt-ui-library).
View at `localhost:3111/<template path>`

## Acceptance criteria

- [ ] Matches the prototype at the source-of-truth path
- [ ] Passes the pre-flight checklist in `AGENT.md`,
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

<!-- Per docs/WRITING-RULES.md: only what genuinely needs someone else —
     curator or reviewer policy, calls belonging to another team, what the
     dev settles while implementing, and "does raven model this, and if not
     do we build it or drop it?". Log the question with its concrete
     options. Anything strategic goes to docs/. Delete if none. -->
