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
they are trying to accomplish, why it matters to them. A persona name is a
pseudonym; write it with the type it represents — Sue Kerr (academic reader),
Marie Curator (reviewer) — so it reads without opening the personas doc.
Personas are researched evidence; a list of job titles is not. Where a documented need maps onto a design
element, say so. If no persona fits, name a concrete role and flag that the
research is missing.

## Open questions carry options

Log the question with its concrete options. Name an owner only when the answer sits
outside the team: Open Science Policy, the curation lead, another team's roadmap.
Every other question needs a team decision. We are one team, so an issue never hands
a question to "design" or to "the dev team". Never resolve a
policy question by inventing a rule. Before delivering, collect every open question
across every document, put each one with its options to the user, and ask. Answers
become body text and the question is deleted — not left standing with the answer
beside it. Only what genuinely needs someone else survives: curator or reviewer
policy, calls belonging to another team, things the implementer settles while
building.

A question that could have been answered in the room is a defect.

## Clear instructions beat storytelling

Where text lists what something does, write instructions: one statement per
sentence, subject first. A sentence someone acts on reads once.

## Enumerations become lists; reasoning stays prose

A sentence listing three or more things becomes a list, and so does a paragraph
stacking three or more independent rules. One item per line, the lead sentence
carrying the claim they share. "Today's card carries a type badge, a classification
code, an arrow or padlock, a title, ten authors and one reference line" makes the
reader count instead of read.

Reasoning stays prose. A list of arguments reads as a checklist of settled facts,
and a Why has to argue: the gain, the cost, and why the trade is worth taking belong
in sentences that carry each other. A long open question splits into paragraphs — the
example, the counts, the price and the options.

A table earns a place only where its cells are fragments. Full-sentence cells are
prose in a table, harder to read than the paragraph they came from.

## Every claim names its surface

In a contract shared by public and backoffice, an unlabelled list of backoffice
fields reads as a public card that shows them all. Name the surface each example
comes from: "on the public card the header row holds access and type; the backoffice
fills the same construct more often".

## The what, never the how

State the outcome and the behaviour. No framework idioms, library calls, data
hooks, field names, index state, query mechanics, endpoints, or event shapes. The
prototype and the repo agent docs carry the mechanism; the implementer owns it.
Express a backend gap as a gap, never as an asserted capability.

## Point, don't paste

Link prototype paths and docs. Pasted markup, tables, and code rot.
