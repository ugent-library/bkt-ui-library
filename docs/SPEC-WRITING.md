# Writing rules

House rules for bets, issues, and design docs. Skills and templates reference this
file rather than restating it.

## Do not invent

Never fabricate a number, an audience, a decision, a field name, a constraint, a
capability, a threshold, or a rationale. Confidence is not evidence: check the
source, or say you did not. Applies with double force to numbers (trace them; a
sample statistic is not a population one), claims about what a system does or does
not have (read the code), and other teams' decisions (name them as theirs).

Before sourcing a claim, check it is ours to make. Precision that belongs to the
implementer or another team is deleted, not evidenced — the cheapest way to not
invent something is to not claim it. Evidence-gathering is for claims the document
cannot drop.

Something with no answer gets one of two treatments, never a third:

1. **Flagged** as an open question naming the concrete options and who decides.
2. **Asked**, when the answer is the author's to give — appetite, scope, naming,
   priorities.

An honest gap gets resolved; a plausible fabrication gets built.

## Anything decided in a meeting and left unwritten does not exist

## Name the persona, not "users"

Where personas are documented (`docs/RESEARCH-PERSONAS.md`), name them: who, what
they are trying to accomplish, why it matters to them. Personas are researched
evidence; a list of job titles is not. Where a documented need maps onto a design
element, say so. If no persona fits, name a concrete role and flag that the
research is missing.

## Open questions carry options and an owner

Log the question with its concrete options and who answers it. Never resolve a
policy question by inventing a rule. Before delivering, collect every open question
across every document, put each one with its options to the user, and ask. Answers
become body text and the question is deleted — not left standing with the answer
beside it. Only what genuinely needs someone else survives: curator or reviewer
policy, calls belonging to another team, things the implementer settles while
building.

A question that could have been answered in the room is a defect.

## The what, never the how

State the outcome and the behaviour. No framework idioms, library calls, data
hooks, field names, index state, query mechanics, endpoints, or event shapes. The
prototype and the repo agent docs carry the mechanism; the implementer owns it.
Express a backend gap as a gap, never as an asserted capability.

## Point, don't paste

Link prototype paths and docs. Pasted markup, tables, and code rot.
