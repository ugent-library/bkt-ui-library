# SURFACES.md — what is public, what is backoffice

The test for deciding which surface a feature belongs to. Applies to features of any
kind — pages, filters, exports, actions, help content — where
`docs/SEARCH-AND-FILTERING.md` Rule 5 already settles filter *dimensions*, this doc
names the general rule those decisions follow.

## The two surfaces

| Surface | Subject | Users (personas) |
|---|---|---|
| **Public** | Knowledge — the research itself | Sue Kerr (academic reader), Pia Practice (practitioner), Carrie Curious (curious public), Cody Crawley (machine) |
| **Backoffice** | Work — records as objects of labour | Everyone identified: Claire Searcher and Otto Thor (researchers), Paula Proksy, Stan Standish and Guy Guest (proxies), Marie Curator (reviewer), Rhea View (review coordinator) |

Personas are defined in `docs/RESEARCH-PERSONAS.md`.

## Surface goals

The surface test decides where a feature belongs. The goals decide what better means
inside each surface.

### Public surface goals

**Goal 1 — make UGent research usable by people who do not work here.**
The surface exists for readers outside the institution: Sue Kerr (academic reader),
Pia Practice (practitioner), Carrie Curious (curious public), and Cody Crawley
(machine). Success is a reader with no connection to UGent reaching and using the
content.

*Losing condition:* the surface only works for someone who already knows the
repository, its vocabulary, or its structure.

**Goal 2 — move knowledge onward.**
The record page is a hub, not a destination. Citation managers, indexes, reference
tools and assistants are first-class consumers alongside human readers. Success is
the record leaving Biblio intact.

*Losing condition:* a value a machine needs exists only inside rendered prose.

**Goal 3 — carry the institution's credibility.**
The page states what is known and never implies a check that has not happened.
Principle 05 holds the rule; the goal is that a reader can trust the page without
knowing our workflow.

*Losing condition:* a reader cannot tell what has been verified and by whom.

The public surface deliberately gives up completeness of the record, visibility of
workflow, and expert precision. It shows less on purpose. A pending backoffice change
never reaches the public surface; public pages show the last accepted record value.

The public surface is not a shop window for institutional productivity, and it is not
an interface staff also use. Both pressures are real and both are refused by Goal 1.

### Backoffice surface goals

**Goal 1 — reach a complete, correct record at the lowest total human cost.**
Cost is placed on whoever it is cheapest for. This goal names Biblio's core problem:
administrative overhead.

*Losing condition:* effort is reduced for one entity by moving it to another, with no
drop in the total.

**Goal 2 — give each entity work that is theirs, visible and bounded.**
A person sees what is theirs to answer, what is waiting, and what changed. Nobody
carries the whole record. Submit/review and Biblio-team review are separate UX layers
inside the backoffice.

*Losing condition:* one screen serves every entity, so every entity sees every field.

That split sits inside the backoffice. It is a second axis, not a redraw of the
public/backoffice line this document's test decides. Use **Biblio team** unless a
specific workflow needs the curator/reviewer distinction; the split is internal, not
a researcher's mental model.

**Goal 3 — let anyone who needs an answer get it without asking a person.**
The backoffice is the workplace of everyone with a stake in the data, not the Biblio
team's alone. Administration, policy monitoring and reporting each need a route to
their own answers.

*Losing condition:* a stakeholder's question arrives as a task for the Biblio team or
as a demand for a new field.

The backoffice deliberately gives up legibility to outsiders and the vocabulary test.
Expert language, density and desktop-first are correct here.

Internal boundaries must not become first-level user choices. Researchers deposit and
manage research output. The system may route articles, books, datasets, software,
theses and future output types to different rules after it has recognized the output,
but the researcher should not carry the historical publication/dataset split or a
growing type catalog as the first task. For accountability rules, see
`docs/RESPONSIBILITIES.md`.

## The surface test

A feature is public when **all four** hold:

1. **Persona** — a public persona needs it (Sue Kerr, Pia Practice, Carrie Curious,
   Wim Webb, Ans Rapport, Quinn Query, Cody Crawley): an anonymous human or a machine
   consuming knowledge. The moment the task requires knowing who the user is ("my drafts",
   "my to-do", "records I still have to fix"), it is backoffice — even when the result ends
   up somewhere public. What decides it is the data, not the motive: a query whose criteria
   and results are all public work is public, whoever it is for and wherever it gets
   published. A query that needs unpublished records, or curation and evaluation fields,
   belongs to the backoffice builder instead.
2. **Subject** — it answers "what does this research say — can I read, cite, reuse
   it?". A feature answering "is my record correct, complete, compliant?" is backoffice.
3. **Anonymous** — it works logged out, off the UGent network, and is crawlable.
   Help content consumed before or without login (license explanations, access-level
   guidance, policy pages) must pass this test, wherever the UI that links to it lives.
4. **Vocabulary** — legible to Carrie Curious, the persona with zero domain and
   repository vocabulary. "Open access", "peer reviewed", "journal article" pass;
   "WoS", "A1", "AAM", "deposit status" are expert vocabulary and fail.

Failing any test sends the feature to the backoffice (or to advanced/expert search —
see exceptions).

## Authentication is not a surface boundary

Logging in does not move a user to the backoffice. Downloading a UGent-only
(`restricted`) file happens on the public surface: the page renders identically for
everyone; the file's access gate answers "who are you" per resource. This is access
control on public content, matching raven's `visibility` model.

There is no owner layer on the public surface: a researcher viewing
their own person page sees exactly what every visitor sees. Anything "mine" — drafts,
subset exports, corrections — lives in the backoffice.

## Current Biblio is not a grandfather clause

A feature being public on biblio.ugent.be today does not carry it into the new public
surface; it re-takes the test. Precedent: classification (A1/A2) is a public facet in
current Biblio and is cut from the new public surface, keeping only a backoffice home (curator
vocabulary — fails test 4; settled in `docs/SEARCH-AND-FILTERING.md`). The reverse also holds:
absence from current Biblio is evidence, not a veto.

## Exceptions — deliberate, named, not the default

- **Advanced/expert search** may expose expert dimensions (source, classification,
  version) to unauthenticated expert users in the future. A separate surface with its
  own rules, TBD — a feature failing the public test parks there as a candidate, it
  does not leak into public discovery.
- **The API / machine formats** (Cody Crawley) may carry expert fields that the human
  public UI hides — machines don't need the vocabulary test. Decided per field in
  raven's representations, not here.

## Worked example — Wim's publication list (2026-07)

A professor exports his group's "WoS journal papers only" for his own website.
Persona: passes — "contributor is X" and "organization is Y" are public facts anyone can
query, and where the result gets published is not the test. Vocabulary: fails — "WoS" is
expert, and where a record came from is a curation attribute. Not in current public Biblio
either (verified: `biblio/views/hits_facets.tt` has no source facet). **Backoffice**, on
the strength of that one criterion: drop the WoS filter and the same query is public, which
is exactly what Wim Webb does in `docs/RESEARCH-PERSONAS.md`. Re-read 2026-08-10, when the
test moved from motive to data.

The public export stays: visitors export what public facets express — type, year,
access. The export itself still needs to be designed.

## Declaring the surface

Every layout container carries `data-surface="public"` or `data-surface="backoffice"` on `<body>` or the outermost layout element. The attribute activates the surface tokens (typography, density, visual weight — see `docs/UI-LAYER.md` → The surface system; `foundation/_surfaces.scss` is the implementation and wins on disagreement). Surfaces mix within a page: every `[data-surface]` boundary applies its own tokens.

In the UI kit, pages without any surface declaration get `data-surface="backoffice"` injected on `<body>` automatically by the server. To override this for a specific page, add `<!-- @surface: public -->` at the top of the file.
