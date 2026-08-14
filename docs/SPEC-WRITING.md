# Writing rules

House rules for writing. Every document — READMEs, guides, kit doc pages, plans —
follows [All writing](#all-writing). Bets, issues, and design docs also follow
[Specs only](#specs-only). Skills and templates reference this file rather than
restating it.

## All writing

### Do not invent

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

### Anything decided in a meeting and left unwritten does not exist

### Say what a thing is, not what it isn't

Frame information active and positive. Lead with the affirmative statement.
Reserve negation for genuine constraints where naming the rejected alternative is
the point (e.g. "the query is not a chip").

### The result, not the journey

A document states what is true and what to do now. How the team arrived there —
options weighed, drafts discarded, meetings — goes to the planning notes or
nowhere. The reader inherits the conclusion, not the corridor.

### Clear instructions beat storytelling

Where text lists what something does, write instructions: one statement per
sentence, subject first. A sentence someone acts on reads once.

### No riddles

A rule names who or what acts, and what changes. Two tells that it does not:

- a document does the acting — "01 gains it", "a region the backoffice needs and 01
  lacks changes 01";
- the reader resolves two references before the verb makes sense.

Rewrite until the sentence reads aloud as an instruction to a person. Compression
sounds authoritative and costs the reader a second pass.

### Enumerations become lists; reasoning stays prose

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

### Point, don't paste

Link prototype paths and docs. Pasted markup, tables, and code rot.

### Machine tells

Symptoms, not rules — each row points at a rule this file already states.
Generated text produces these at volume; human drafts grow them too. Delete on
sight, then fix against the named rule.

| Tell | Rule it signals |
|------|-----------------|
| A route sentence growing a second clause that summarises its target | Point, don't paste |
| A passive verb hiding the actor — "it was decided", "is expected to" | No riddles |
| Certainty dressing — "clearly", "simply", "obviously", "robust", "comprehensive", "seamless" | Do not invent |
| The journey in body text — "we then explored", "after discussion it emerged" | The result, not the journey |
| A document describing itself — "this section covers…" | The result, not the journey |
| Two or three clauses stitched with dashes or semicolons into one sentence | Clear instructions beat storytelling |
| Three list items where the facts count two or four — rhythm padding the truth | Enumerations become lists |
| One concept under three names for variety | Do not invent — vocabulary is a contract (`docs/DOMAIN-VOCABULARY.md`) |
| A closing paragraph re-listing what the section just said | The result, not the journey |
| Throat-clearing — "it's worth noting", "importantly", "note that" | The sentence starts at its subject |

## Specs only

The rules below govern bets, issues, and design docs.

### Cite the demand

ProductBoard holds the notes: helpdesk mail, interview quotes, requests. Two files in
`notes/demand/` carry them into a spec — generated `INDEX.md` and hand-written
`FINDINGS.md`. `notes/` is local, so sync before drafting.

- `npm run sync:demand` regenerates `INDEX.md`. Each note takes one line: id, date, tags,
  linked title. Months group the lines, and a tag tally closes the file.
- `npm run sync:demand -- --bodies` also writes the note text to a temporary folder
  outside the repo. Read it there, then delete it.
- `INDEX.md` marks a note read once its id appears in `FINDINGS.md`. Write each conclusion
  there in your own words, with the ids it rests on.

A bet or an issue cites those ids: "researchers cannot find their own record (n-001,
n-014)". The reader opens the note and checks the reading. Keep the conclusion in the
document and the note text in ProductBoard.

The index carries the need, not the person: id, date, tags and title, and the sync replaces
any address in a note body with `[email]`. Who reported something stays in ProductBoard,
behind the note link.

Make corrections, tags and feature links in ProductBoard; the next sync picks them up. A
need with no note behind it is an assumption and reads as one — record it in ProductBoard
first.

### Name the persona, not "users"

Where personas are documented (`docs/RESEARCH-PERSONAS.md`), name them: who, what
they are trying to accomplish, why it matters to them. A persona name is a
pseudonym; write it with the type it represents — Sue Kerr (academic reader),
Marie Curator (reviewer) — so it reads without opening the personas doc.
Personas are researched evidence; a list of job titles is not. Where a documented need maps onto a design
element, say so. If no persona fits, name a concrete role and flag that the
research is missing.

### Open questions carry options

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

### Every claim names its surface

In a contract shared by public and backoffice, an unlabelled list of backoffice
fields reads as a public card that shows them all. Name the surface each example
comes from: "on the public card the header row holds access and type; the backoffice
fills the same construct more often".

### The what, never the how

State the outcome and the behaviour. No framework idioms, library calls, data
hooks, field names, index state, query mechanics, endpoints, or event shapes. The
prototype and the repo agent docs carry the mechanism; the implementer owns it.
Express a backend gap as a gap, never as an asserted capability.

This rule inverts for repo docs: a README or working guide exists to carry the how.
