# Writing rules

These rules apply to docs, READMEs, kit prose, plans, issues, PR text and handovers.
Code comments use [`CODE-COMMENTS.md`](CODE-COMMENTS.md). Specs also follow
[Spec content](#spec-content).

## Output contract

- Lead with the result or claim. Skip the preamble.
- Use the same term for the same thing throughout.
- Give each paragraph one job. Most sentences carry one claim.
- Use a list only when readers will scan or compare its items.
- Stop when the work is handed over. Do not add a closing recap.
- Edit silently. Do not report that a prose pass ran or list every sentence changed.

These are default ceilings for authored prose. Headings, front matter, tables, code
and fixed template text do not count. A user may set a different ceiling.

| Document | Words |
|---|---:|
| Backend issue | 175 |
| User-facing issue | 275 |
| Epic | 325 |
| Evidence or method note | 300 |
| Field ledger or contract | 400 |
| Design note | 500 |
| Product bet | 800 |

The ceiling is a limit, not a target. Shorter is better when no fact is lost.

## Core rules

### Write only supported claims

Check numbers, audiences, decisions, fields, constraints, capabilities and rationales.
Read the code before claiming what a system does. Attribute another team's decision
to that team.

Move detail that belongs to an implementer or another team to its owning artifact, or
link to that owner. Do not erase the only record of a requirement or open question. If
an unanswered point changes the work, either ask the author or record concrete options
and the external decision-maker. Never fill a gap with a plausible rule.

### Use plain language

Put the subject before the verb. Prefer concrete verbs to abstract nouns. Write the
effect a reader sees, not a tour of the mechanism. Keep necessary technical names;
remove jargon made only to compress a sentence.

Write “The selected field sets the row's operator and input,” not “The row anatomy
derives its control surface from field selection.”

### Keep the conclusion, not the journey

State what is true and what happens next. Routine drafting history and superseded
wording belong in git. An alternative that determined an accepted choice and may need
defending belongs in the design decision. Keep unsettled alternatives in WIP material,
or in a concise source-local prototype note when the nearby markup owns them.
A handover names only decisions the reader may veto, changed numbers and questions
that need answers.

### Give each fact one home

Link to values, catalogs, code and contracts instead of copying them. State behavior
where the reader needs it; a link is not a substitute for the product promise.

Before deleting prose, classify it as a current contract, requirement, decision,
rationale, warning, open question or history. Preserve the first six in their owner,
relocating them before deletion when necessary. Delete duplicates, obsolete claims
and routine history. Do not create a document merely to restate a source-local
prototype comment.

Do not describe a prototype's visible layout in an issue. Link it and specify what a
picture cannot show: announcements, reload behavior, persistence, failure states and
contract boundaries.

Delete an introduction that repeats the list below it. Delete empty sections and
sentences whose removal changes no decision or action.

## Spec content

Specs cover the problem, the evidence, what the user sees, what the product promises
and what is out of scope. Raven owns the domain model and implementation mechanism.

### Evidence and people

Sync ProductBoard demand with `npm run sync:demand`. Record findings in
`notes/demand/FINDINGS.md` and cite note IDs in the spec. A need without a note is an
assumption and must read as one.

Name a documented persona with its type, such as “Sue Kerr (academic reader).” State
what they need and why. If no persona fits, name a concrete role and flag the research
gap.

### Requirements

- Name the public or backoffice surface for every example.
- Number issue titles and files together; the epic is `[00]`.
- Describe outcomes and observable behavior. Leave out framework calls, field names,
  index design, endpoints and event shapes.
- Express a backend gap as a dependency or open question, not an asserted capability.
- Keep only open questions that change the design or product promise. Give concrete
  options. Do not assign team questions to “design” or “development.”

## Examples

<example>
Before: “The document then walks through the three options before arriving at the
recommended path.”

After: “Use the existing picker.”
</example>

<example>
Before: “I ran the writing pass, removed repeated material, simplified seven
sentences and brought the issue under its target.”

After: “The issue is ready. One policy question remains: can incomplete records be
public, or must they wait for review?”
</example>

<example>
Before: “The prototype shows a modal with a title, rows, controls and a footer.”

After: “Reloading the builder restores every condition and returns focus to the
control that opened it when closed.”
</example>

## Final cut

Before delivery:

1. Inventory requirements, decisions, rationale, warnings and open questions; none
   disappears without an owner.
2. Check the word ceiling.
3. Delete repeated facts, process narration and closing summaries.
4. Replace vague nouns with the actor and action.
5. Check every claim and open question.
6. Read the result once aloud. Fix only what blocks a first reading.

## Maintaining this guide

Do not append a rule after one poor output. Keep a failing example. Add or change a
rule only when the same failure appears across several tasks. A new rule replaces
overlapping text and must keep this file below the ceiling enforced by
`npm run check:prose`.
