# Writing rules

House rules for everything we write for people: docs, READMEs, kit pages, plans, issue and PR
text, chat explanations. Bets, issues and design docs also follow [Specs only](#specs-only).
Comments in code follow [`CODE-COMMENTS.md`](CODE-COMMENTS.md). Skills and templates point here
instead of restating. The register rules are shared with raven's, so a change to one is worth
carrying to the other.

## All writing

### Do not invent

Never make up a number, an audience, a decision, a field name, a constraint, a capability, a
threshold or a rationale. Confidence is not evidence: check the source, or say you did not. It
bites hardest on numbers (trace them; a sample statistic is not a population one), on what a
system has and has not got (read the code), and on other teams' decisions (name them as theirs).

Before sourcing a claim, check that it is ours to make. Precision belonging to the implementer or
to another team gets deleted, not evidenced — the cheapest way to not invent something is to not
claim it.

Something with no answer gets one of two treatments, never a third:

1. **Flagged** as an open question that names the concrete options and who decides.
2. **Asked**, when the answer is the author's to give — appetite, scope, naming, priorities.

An honest gap gets resolved. A plausible fabrication gets built.

### Anything decided in a meeting and left unwritten does not exist

### Write the way you talk

Use plain verbs instead of abstract nouns, and lead with what happened instead of a noun-y
summary. Never coin a compound noun phrase — say what you mean.

- "I read these docs against the code", not "Reconciled the metadata docs against the code."
- "Most of it is already right", not "Most of the exchange-surface scope here is already correct."
- "The code went another way", not "the implemented and chosen model is."

This is register, not content. Keep the technical substance and the structure, and say it
naturally.

### One statement per sentence, subject first

A sentence names who or what acts, and what changes. Lead with the subject, keep the verb next to
it, and put a modifier ahead of what it modifies. No inversions, no delayed verbs, no chained
possessives, no passive that hides the actor. Multi-word names read forward too: `other_license`,
not `license_other`.

Read it aloud. If it does not sound like an instruction to a person, rewrite it. Compression
sounds authoritative and costs the reader a second pass.

### Say what a thing is, not what it isn't

Lead with the affirmative statement. Save negation for a real constraint, where naming the
rejected alternative is the point ("the query is not a chip").

### Describe the effect, not the mechanism

State what is true for the reader — the guarantee, the payoff — not the internals. Write "a
redirect always points at the current record, never at another redirect", not "earlier redirects
pointing at the merged record re-point at the target". Keep function names, step lists and
enumerated moves out of explanatory sentences. Field and table names stay welcome in titles,
tables and schema callouts.

### The result, not the journey

A document says what is true and what to do now. How the team got there — options weighed, drafts
discarded, meetings — goes to the planning notes or nowhere. The reader inherits the conclusion,
not the corridor.

### Enumerations become lists; reasoning stays prose

A sentence listing three or more things becomes a list, and so does a paragraph stacking three or
more rules. One item per line, with the lead sentence carrying the claim they share. "Today's card
carries a type badge, a classification code, an arrow or padlock, a title, ten authors and one
reference line" makes the reader count instead of read.

The list replaces the prose that anticipated it: where the paragraph above already walked through
the items one by one, delete the walk.

Reasoning stays prose. A list of arguments reads as a checklist of settled facts, and a Why has to
argue — the gain, the cost, and why the trade is worth taking belong in sentences that carry each
other. A long open question splits into paragraphs: the example, the counts, the price, the
options.

A table earns its place only where the cells are fragments. Full-sentence cells are prose in a
table, harder to read than the paragraph they came from.

### Point, don't paste

Every fact has one home, and everywhere else points at it. Link prototype paths and docs: pasted
markup, tables and code rot.

The rule runs inside a document too. Where a sentence says what the list four lines below says,
the sentence goes. Two homes for one fact means both drift, and the reader reads it twice.

### Cut to the aim for its type

Every type of document has a length aim, and a draft gets cut to it. Go over the aim only where
cutting starts costing meaning. Go under it wherever superfluous text is left — an aim is a
target, not a floor. Whoever asks for a document may name a different length, and then that one
stands.

| Document | Aim, in words |
|---|---:|
| Reading-order README | 120 |
| Issue, backend only | 175 |
| Field ledger or contract | 200 |
| Evidence or method report | 250 |
| Issue, user-facing | 275 |
| Epic | 325 |
| Design doc, a bet's companion | 400 |
| Product bet | 800 |

One aim is measured: the bet we accepted runs to 800 words. The rest are decisions, set at roughly
20 words a point on what each type has to carry, and set tight on purpose. A document that lands
under its aim and still reads resets the aim for its type — the ratchet turns one way.

Only the words you chose count. Table rows, fenced code, headings, front matter and a template's
fixed lines do not: a ledger's length is its rows, and nobody authored the scaffolding.

Working guides carry the how, so they have no aim: AGENTS.md and this file are as long as the
number of rules in them.

Cutting is a walk through the sentences with one question each: **if this sentence goes, where
does its fact live?** A sentence with an answer — a companion doc, the list below it, the personas
file — gets deleted. A sentence with no answer is this document's own content and stays. Shortening
a sentence instead buys words and keeps the duplication.

Four passes, in this order, because each finds a different kind of fat:

1. Flourish — a sentence that argues where it could state.
2. Prose that duplicates a list under it.
3. A second explanation of a point the section already made.
4. A point whose absence changes no decision the reader has to make.

Pass 4 is the one that reaches an aim: the first three buy words, dropping a point buys paragraphs.
Stop when the cuts stop having destinations. Past that line the next cut takes evidence — a
persona's need, a caveat, a baseline — and a document that lost its evidence is weaker, not
shorter.

### Machine tells

Symptoms, not rules: each row points at a rule above. Generated text produces these at volume and
human drafts grow them too, so delete on sight, then fix against the named rule.

| Tell | Rule it signals |
|------|-----------------|
| A coined compound noun phrase — "exchange-surface scope" | Write the way you talk |
| A noun-y summary standing in for what happened | Write the way you talk |
| A passive verb hiding the actor — "it was decided", "is expected to" | One statement per sentence |
| A document doing the acting, or two references to resolve before the verb lands | One statement per sentence |
| Two or three clauses stitched with dashes or semicolons into one sentence | One statement per sentence |
| Throat-clearing — "it's worth noting", "importantly", "note that" | One statement per sentence |
| Step-by-step internals inside an explanatory sentence | Describe the effect, not the mechanism |
| Certainty dressing — "clearly", "simply", "obviously", "robust", "comprehensive", "seamless" | Do not invent |
| One concept under three names for variety | Do not invent — vocabulary is a contract ([`DOMAIN-VOCABULARY.md`](DOMAIN-VOCABULARY.md)) |
| The journey in body text — "we then explored", "after discussion it emerged" | The result, not the journey |
| A document describing itself — "this section covers…" | The result, not the journey |
| A second pass at a point already made — a closing re-list, or a second explanation | The result, not the journey |
| Three list items where the facts count two or four — rhythm padding the truth | Enumerations become lists |
| A paragraph walking through the list that follows it | Enumerations become lists |
| A route sentence growing a second clause that summarises its target | Point, don't paste |
| A fact stated in full in two documents | Point, don't paste |

## Specs only

These rules govern bets, issues and design docs.

### Cite the demand

ProductBoard holds the notes: helpdesk mail, interview quotes, requests. Two files in
`notes/demand/` carry them into a spec — generated `INDEX.md` and hand-written `FINDINGS.md`.
`notes/` is local, so sync before drafting.

- `npm run sync:demand` regenerates `INDEX.md`: one line per note (id, date, tags, linked title),
  grouped by month, with a tag tally at the end.
- `npm run sync:demand -- --bodies` also writes the note text to a temporary folder outside the
  repo. Read it there, then delete it.
- `INDEX.md` marks a note read once its id appears in `FINDINGS.md`. Write each conclusion there
  in your own words, with the ids it rests on.

A bet or an issue cites those ids: "researchers cannot find their own record (n-001, n-014)". The
reader opens the note and checks the reading.

The index carries the need, not the person: id, date, tags and title, and the sync replaces any
address in a note body with `[email]`. Who reported it stays in ProductBoard behind the note link.
Make corrections, tags and feature links there too, and the next sync picks them up. A need with
no note behind it is an assumption and reads as one.

### Name the persona, not "users"

Name the documented personas ([`RESEARCH-PERSONAS.md`](RESEARCH-PERSONAS.md)): who they are, what
they are trying to accomplish, why it matters to them. A persona name is a pseudonym, so write it
with the type it represents — Sue Kerr (academic reader), Marie Curator (reviewer) — and it reads
without opening the personas file. Say which design element a documented need produced. Personas
are researched evidence; a list of job titles is not. If none fits, name a concrete role and flag
the missing research.

### Open questions carry options

Log the question with its concrete options. Name an owner only when the answer sits outside the
team: Open Science Policy, the curation lead, another team's roadmap. We are one team, so an issue
never hands a question to "design" or to "the dev team". Never settle a policy question by
inventing a rule.

Before delivering, collect every open question across every document and put each one, with its
options, to the user. An answer becomes body text and the question goes; it never stands with the
answer beside it. Only what genuinely needs someone else survives: curator or reviewer policy,
calls belonging to another team, things the implementer settles while building.

A question that could have been answered in the room is a defect.

### Every claim names its surface

In a contract shared by public and backoffice, an unlabelled list of backoffice fields reads as a
public card showing them all. Name the surface each example comes from: "on the public card the
header row holds access and type; the backoffice fills the same construct more often".

### The what, never the how

Describe the effect, not the mechanism, applied to a spec: state the outcome and the behaviour,
and leave out framework idioms, library calls, data hooks, field names, index state, query
mechanics, endpoints and event shapes. The prototype and the repo agent docs carry the mechanism,
which the implementer owns. Express a backend gap as a gap, never as an asserted capability.

This inverts for repo docs. A README or a working guide exists to carry the how.
