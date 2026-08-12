---
name: Implement design
about: Port a booktower-ui-library prototype into raven
title: "[backend] Missing metadata by responsibility, per record"
labels: backend
---

<!-- Child of the backoffice work-card epic. Backend. -->

## Why

The message blocks in #191 open with a line naming what a record is missing,
grouped by who needs to act on it. Nobody types that line. Raven needs to model
completeness per record, ready for fifty cards on a curator's screen at once.

The groups are responsibility-shaped. The card needs missing items that reflect the
active work profile, validation rules and the domain vocabulary's backoffice-message
rules. The issue does not freeze a permanent field-by-field map.

Marie Curator (reviewer) asked for the list to show completeness — a complete
record is not necessarily a correct one, and she needs to see which is which
before opening anything. When a depositor or proxy cannot answer a question, the
deposit flow should let them leave it open deliberately. The card shows that open
choice as work still to resolve.

## What

- [ ] Return missing metadata per record, grouped by responsibility and audience:
      researcher-facing and Biblio-team-facing
- [ ] The lists reflect the active work profile, the required/completeness rules and
      the responsibility split below; Raven decides how to produce them
- [ ] Researcher-facing missing items, when required for the work: file or external
      object; file version; access-risk answers; abstract; contributors; keywords;
      projects; licence
- [ ] Biblio-team-facing missing items, when required for the work: container;
      publisher; date/year; ISSN/ISBN; volume; issue; pages; policy-rule outcomes
- [ ] Imported/source-backed fields are not asked of a person when the source can
      supply them; missing means Raven has no accepted value after source data,
      accepted user input and validation rules have been applied
- [ ] A field the work type does not carry is never counted as missing
- [ ] Both groups are available for every card in a result list
- [ ] Nothing about completeness reaches the public surface
- [ ] The documented priority order preserved, so the line reads in that order
- [ ] The response lets the card distinguish missing values that may be shown as
      compact metadata-row markers, such as access or year, from primary identity
      fields that must not render as "Missing title"
- `out of scope` Backoffice filters, facets and counts for "Missing X"; those can
  use the same missing-metadata signal later

## Acceptance

- [ ] A list of fifty cards can render both missing-items lines when both groups have
      content
- [ ] A dataset is never reported as missing an ISSN, and a work kind whose profile
      does not require a hosted file is never reported as missing one
- [ ] One definition of missing, not two — these lists and the workflow's
      required-field checks never disagree
- [ ] Responsibility grouping matches `docs/DOMAIN-VOCABULARY.md`
- [ ] `make test` passes

## Dependencies

Blocks #191.

Uses the profile system and the backoffice-message rules in
`docs/DOMAIN-VOCABULARY.md`.

## Open questions

None.

> No backend screenshot. Card output is shown in the missing-access and message
> screenshots.
> **Screenshot files:** `04-05-11--pattern-missing-access-card.png`,
> `04-05-11--curator-missing-access-card.png`
