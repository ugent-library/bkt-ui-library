# Product bet — <one-line name>

*Draft for the <team> · Evidence: [`REPORT-….md`](…) · Design detail: [`DESIGN-….md`](…)*

<!-- House rules: docs/SPEC-WRITING.md — do not invent, personas, open questions,
     what-not-how. Calibration and anti-patterns: the product-bet-writer skill.
     One to two pages. Save as notes/BET-<topic>.md.
     Delete these comments as you fill them in. -->

## Problem

<!-- Who is hurting, at what, how we know. Name personas, one line each on what this
     bet gives them. Say why not doing this is not an option, if that is true.
     Verified numbers only; link the evidence document rather than reciting it.
     Then, only when something existing may not break: the constraints that hold
     throughout — an existing contract, permalinks, a usage level that may not drop.
     A greenfield bet has none. -->

## Appetite

<!-- How much this is worth, in time, not scope. If the team sets it, say so and mark
     it a proposal. Phase 1 is the bet; later phases are future bets. -->

## Solution

<!-- The shape, in prose, a few sentences: what the user sees and does. Concrete enough
     to weigh against the appetite; not so detailed it becomes a spec. Link the sketch. -->

**Phase 1 — definition of done for the first live release.**

<!-- The smallest release genuinely useful on its own, plus parity with whatever the old
     system already did. Overflow moves to phase 2. -->

- <capability>
- <capability>

**Phase 2 — <what it adds>:** …

**Phase 3 — <what it adds>:** …

## Rabbit holes

<!-- Irreversible decisions, things easy to get wrong, things already investigated so
     nobody repeats the work. Not a task list for the developers. -->

1. …

## No-gos

- <explicitly out of scope, and why in half a sentence>

## How we know it works

<!-- Two or three measures, no more. Each: what it is, the baseline (how is it today),
     the threshold (what counts as success), and how it stays comparable over time.
     Where a baseline or threshold is not knowable without guessing, say so.
     Phrase them the way notes/PLAN-measurement.md does. What we measure is ours to
     state; how it is measured is engineering's — do not prescribe it here. -->

1. …

<!-- Then one sentence: what is instrumented but deliberately not scored, and why. -->

## The ask

**Go / no-go on phase 1.** Then: where is this wrong or impossible, and can the phase 1
list stand as the definition of done? Timing and approach belong to the implementers.

## Open questions

**Blockers for phase 1** — must be answered before work starts:

1. <question, who answers it, how>

**Later** — does not hold up phase 1:

1. <question, and the evidence route>
