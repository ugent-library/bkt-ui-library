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

## The surface test

A feature is public when **all four** hold:

1. **Persona** — a public persona needs it (Sue Kerr, Pia Practice, Carrie Curious,
   Cody Crawley): an anonymous human or a machine consuming knowledge. The moment the
   task requires knowing who the user is ("my output", "my group", "my to-do"), it is
   backoffice — even when the result ends up somewhere public, such as a researcher's
   own website.
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
current Biblio and is deliberately cut from the new public surface (curator vocabulary
— fails test 4; settled in `docs/SEARCH-AND-FILTERING.md`). The reverse also holds:
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
Persona: fails — "my group's output" requires identity. Vocabulary: fails — "WoS" is
expert. Not in current public Biblio either (verified: `biblio/views/hits_facets.tt`
has no source facet). **Backoffice export**, on the researcher's own-output views;
advanced search and the API are the future exception paths.

The public export (see `notes/PLAN-public-export.md`) stays: visitors export what
public facets express — type, year, access.

## Declaring the surface

Every layout container carries `data-surface="public"` or `data-surface="backoffice"` on `<body>` or the outermost layout element. The attribute activates the surface tokens (typography, density, visual weight — see `docs/UI-LAYER.md` → The surface system; `foundation/_surfaces.scss` is the implementation and wins on disagreement). Surfaces mix within a page: every `[data-surface]` boundary applies its own tokens.

In the UI kit, pages without any surface declaration get `data-surface="backoffice"` injected on `<body>` automatically by the server. To override this for a specific page, add `<!-- @surface: public -->` at the top of the file.
