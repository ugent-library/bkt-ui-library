# AGENTS.md — working guide for the Booktower UI Library

For everyone working in or with this repo — humans and AI agents, whatever the tool. This file routes; the rules live in `docs/`. (`CLAUDE.md` is a one-line import of this file.)

**Two audiences, two paths:**

- **Consuming Booktower from another app (raven, pre-ingest, …)?** Read [Consumers](#consumers). Stop there unless you're changing this repo.
- **Building in this repo — templates, components, specs, designs?** Read [Builders](#builders), starting with Session start.

---

## What this project is

A design system and prototype environment for Ghent University Library applications. The primary case is **biblio.ugent.be** — the university's research output repository, built as raven; **pre-ingest** is the second consumer, and more applications will follow. Features are brought to life here, specs (bets, issues, design docs) are written here, and designs are created here. The prototype serves user testing and interviews on one hand, and consuming applications such as Raven on the other — as style guide, UX guide, and source of truth for layout. It is also where development, design, and product discover the right thing to build.

The system serves two distinct user contexts that must never be conflated:

- **Public** — researchers, readers, the open web. Knowledge is the subject.
- **Backoffice** — curators, librarians, depot workers. Work is the subject.

The system is HTMX-first, Bootstrap-based, semantically correct HTML, progressively enhanced, accessible by default. It is not a React app. It is not a SPA. Server-side rendering, stable URLs, graceful degradation are not constraints — they are the architecture.

---

## What lives where — and who decides

Four tools, one lane each. Don't duplicate one in another.

| Tool | Owns | Decided by |
|------|------|------------|
| **ProductBoard** | Demand and priority — user needs and feedback, feature requests, the problem a page solves, roadmap status. The *why at the user-need level*. Demand is also discovered here, through prototyping. Synced into `notes/demand/` by `npm run sync:demand`, so specs can cite the notes they rest on; corrections are made in ProductBoard, never in the sync. | Product |
| **booktower-ui-library** (this repo) | The prototype and the design system — HTML, CSS classes, layout and interaction, the UI *how*. Concepts are prototyped here, not defined here. | Design |
| **Raven** | The backend and the source of truth for the domain model — schema, field registry, work/organization/project catalogs, subtypes. What a concept *is*. | Dev |
| **GitHub issues** (raven repo) | The build — implementation scope and acceptance criteria. Issues **start in this repo**: a prototype is scoped into issues (the `biblio-issue-writer` skill), then filed in the raven repo, where raven's issue → branch → commit → PR chain takes over. | Dev |

The flow: demand starts in ProductBoard or emerges from a prototype → gets prototyped here → domain concepts get modelled in Raven → issues start from the prototype and are tracked in the raven repo. See raven's `AGENTS.md` for the backend and git rules.

Cross-cutting disagreement: design decides how it looks, dev decides how it's built, product decides when.

The lanes say which parts of a document each of us owns. They never say who a document is addressed to. An issue describes what the user sees and leaves the mechanism to the people building it — no field names, query shapes or endpoints. It is addressed to the team as a whole, so a question inside it needs a team decision rather than an assignment to "design" or to "the dev team". Where the answer sits outside the team, name them: Open Science Policy, the curation lead, another team's roadmap. The wording rules follow from this and live in `docs/SPEC-WRITING.md`.

---

## Source precedence

When sources disagree, trust in this order:

1. The implementation — SCSS, JavaScript, and prototype HTML
2. Generated inventories — `docs/CLASSES.md`, `assets/scss/icons/_icon-font.scss`
3. The contracts — `docs/ACCESSIBILITY.md`, `docs/RENDERED-HTML-CONTRACT.md`, raven's `docs/public-site-semantics.md`
4. Kit pages and prototype templates as canonical examples
5. The guides — this file and the rest of `docs/`
6. Historical audits (`docs/analysis/`) and `CHANGELOG.md` — findings at a point in time, never the current contract. Shared drafts live in `docs/wip/` — visible, not yet contracts.

---

## Consumers

The prototype is the source of truth for layout and UX. When a consuming app's template and the prototype disagree, don't silently align to either side: flag the disagreement — it usually means the kit is missing something, or one side has a real problem — and resolve it in the kit, so every consumer gets the fix.

Reading is proportional to the task: implementing a pattern or page for the first time → the safe workflow in `docs/CONSUMING-BOOKTOWER.md`; changing an existing adapted template → the update rules in `docs/RENDERED-HTML-CONTRACT.md` plus the pattern's canonical example; re-syncing assets → the file table in `docs/CONSUMING-BOOKTOWER.md`.

- **Ownership boundary** — Booktower defines what the browser receives; the consuming app defines how its server produces that output from application data. Adapt-once workflow, update rules, drift, and ownership comments: `docs/RENDERED-HTML-CONTRACT.md`.
- **Integration contract** — which files to copy, where fonts go, Bootstrap as peer dependency, the surface attribute: `docs/CONSUMING-BOOKTOWER.md`.
- **Every CSS class that exists**: `docs/CLASSES.md` (generated by `npm run build`). A class not on that list does not exist — do not guess names. Composition rules, traps, and known-invented names: `docs/CLASS-USAGE.md`.
- **Icons**: one system only, the UGent icon font — `i.if.if-[name]`. Names are defined in `assets/scss/icons/_icon-font.scss`; that file is the ground truth.
- **Surfaces**: every layout container carries `data-surface="public"` or `data-surface="backoffice"` — the test is `docs/SURFACES.md`, the tokens are in `docs/UI-LAYER.md`.
- **Layout shells and UI architecture**: `docs/UI-LAYER.md`.
- **Consumer CSS** — a consuming app can carry its own CSS, layered on top of `booktower.css`, for genuinely app-specific styling. Anything reusable belongs here instead: draft a PR or create an issue in this repo, then re-copy the compiled assets once it lands. Never patch the copied `booktower.css` itself.
- **Public crawl semantics** (structured data, canonicality, render formats): the contract is raven's `docs/public-site-semantics.md`, audited by Rubric.
- **Setting up a new consumer's `AGENTS.md`**: copy the canonical Design system section from `docs/CONSUMER-SNIPPET.md`.

---

# Builders

## Session start — do this first, every time

When a new session begins on this project, execute these steps before writing any code or HTML:

1. **Read the docs the task needs** — reading is proportional to the task, per this map:

   | Task touches | Read first |
   |---|---|
   | Any design decision — layout, wording, what to show, which of two directions | `foundations/design-principles.html` — the six principles and their tests |
   | Scoping any new page or feature | `docs/SURFACES.md` — the public vs backoffice surface test |
   | Audience, personas, or legibility questions | `docs/RESEARCH-PERSONAS.md` — the public personas anchor the surface and vocabulary tests |
   | Domain meaning — entities, statuses, badges, review workflow | `docs/DOMAIN-VOCABULARY.md`, `docs/DOMAIN-CONTEXT.md` |
   | Who is accountable for a field, who may answer it, policy-risk values, review requests, or AI suggestions | `docs/RESPONSIBILITIES.md` — accountability, trust and pending-change routing |
   | Building or changing a template | `docs/UI-LAYER.md`, `docs/CONSUMING-BOOKTOWER.md`, `docs/ACCESSIBILITY.md` |
   | Any new or changed CSS, class, or SCSS partial | `docs/CSS-ARCHITECTURE.md` — Bootstrap-first, where styles live, naming, safe overrides |
   | Any search box, facet sidebar, or filter picker | `docs/SEARCH-AND-FILTERING.md` |
   | JavaScript | `docs/JAVASCRIPT.md` — rules, file registry, event contract, loading order |
   | Kit server behaviour — template states, mock endpoints | `docs/SERVER.md` |
   | Creating or changing a kit doc page (`foundations/`, `elements/`, `patterns/`) | `docs/KIT-PAGES.md` |
   | Writing a bet, issue, or design doc | `docs/SPEC-WRITING.md` — the house rules for all specs |
   | Drafting an implementation issue | `docs/ISSUE-TEMPLATE.md` + the `biblio-issue-writer` skill; raven's `AGENTS.md` owns the issue → branch → commit → PR chain |
   | Writing or reviewing a product bet | `docs/PRODUCT-BET-TEMPLATE.md` + the `product-bet-writer` skill |
   | A field, status, or entity that might need modelling | raven is the source of truth — check its schema and catalog docs (`docs/metadata-*.md` in the raven repo) before inventing a concept here. Read each catalog's scope paragraph before its field tables: the scope states what the catalog covers and what it deliberately leaves out, which usually settles whether a missing field is a gap at all |
   | Public record pages that crawlers or reference managers consume | raven's `docs/public-site-semantics.md` — the Rubric-audited contract |
   | Implementing or updating a prototype in a consuming app | `docs/RENDERED-HTML-CONTRACT.md`, `docs/CONSUMING-BOOKTOWER.md` |

2. **Check class names against `docs/CLASSES.md`** — the generated reference for every class that exists (rebuilt by `npm run build`). Do not guess names not on that list. Usage gotchas live in `docs/CLASS-USAGE.md` — read it whenever composing components.

3. **Identify the surface** — before writing the first line of HTML, confirm whether this is a `public` or `backoffice` page. If uncertain, apply the test in `docs/SURFACES.md`; if the test doesn't settle it, ask.

4. **Answer the plain-language layout questions** — before choosing layout classes, read the “Questions to answer before writing layout HTML” section in `docs/CONSUMING-BOOKTOWER.md`.

5. **Run the pre-flight checklist** — before finalising any template, run the accessibility checklist at the bottom of `docs/ACCESSIBILITY.md`.

### Recommended session-start prompt (paste this at the start of a new conversation)

```
Read AGENTS.md in the booktower-ui-library repo root and follow the
session start instructions, including reading the docs/ files listed in
step 1. You're working on the booktower-ui-library.
```

---

## Non-negotiables

The always-on rules. Each links to its full version — the pointer here is the reminder, the doc is the law.

**Design principles.** Six principles, each carrying a pass/fail test; the tests are what choose when two directions compete: **01 Structure is the style** · **02 Opinions over options** · **03 The past and the future share the same grid** · **04 Knowledge wants to move** · **05 Trust is placed deliberately** · **06 Quality is reached in cycles**. The page holds the tests, the Do/Don't lists, and the standing conflicts between principles: `foundations/design-principles.html`. It is the only copy — cite it, and read it before deciding.

**Surfaces.** Every layout container carries `data-surface="public"` or `data-surface="backoffice"` — it activates the surface tokens; skipping it produces inconsistent UIs. Which surface: `docs/SURFACES.md`. What the tokens do, and how the kit injects a default: `docs/UI-LAYER.md` and `docs/SURFACES.md` → Declaring the surface.

**Icons.** One icon system: the UGent icon font, `i.if.if-[name]`. Names in `assets/scss/icons/_icon-font.scss` are the ground truth — never invent one. New icons: SVG into `assets/icon-font-source/`, then `npm run build:icons`.

**CSS classes.** The most common agent mistake: plausible-looking class names produced with high confidence. Ground truth is the generated `docs/CLASSES.md`; a class not on that list does not exist. Composition rules and traps: `docs/CLASS-USAGE.md`. `npm test` enforces both directions (`check:classes`).

**CSS authoring.** All CSS lives in `assets/scss/` and compiles to `assets/booktower.css` — never in `<style>` blocks, `style=` attributes, or JS style mutation. New CSS starts with a scan for what exists: the kit pages for the pattern, `docs/CLASSES.md` for the class, Bootstrap for the use case. Naming, file placement, and safe-override rules: `docs/CSS-ARCHITECTURE.md`.

**JavaScript.** No inline `<script>` on real pages (kit pages may demonstrate, never provide behaviour). Every file in `assets/js/` is documented in `docs/JAVASCRIPT.md` — rules, registry, and event contract live there.

**Accessibility.** WCAG 2.1 AA minimum on every template. Agents produce correct static HTML but cannot test runtime behaviour after HTMX swaps; screen reader testing is a human responsibility. Full rules, the project-specific decisions, and the pre-flight checklist: `docs/ACCESSIBILITY.md`.

**HTML patterns.** Semantic structure per `docs/ACCESSIBILITY.md` §A, forms per §C, HTMX behaviour per §D. All `hx-*` URLs in prototypes are stubs — documentation of intent, not working code; no `<form>` without a marked real submit path (C6's prototype exception). Data-dependent template variants are states inside one file, never separate files — syntax in `docs/SERVER.md` → Template states. Public record pages carry schema.org structured data — minimum payload in `docs/ACCESSIBILITY.md` H4.

**Dogfooding.** The kit documents the design system with the design system's own CSS. If a component can't be demoed with its own classes, the gap is in `assets/scss/` — never an excuse for inline styles.

---

## What to do when uncertain

**About a domain or policy decision:** never invent a rule. Record it as an open question naming the concrete options. These decisions are made with business and development — who exactly (Open Science Policy, the Biblio team, another team's roadmap) depends on the question; don't assume the route. A prototype with an honest open question beats one with a plausible invented rule.

**About whether a concept should be modelled:** the prototype is not where domain concepts get defined — Raven is. Before inventing a field, status, or entity in a prototype, check whether Raven's schema, field registry, or catalogs already cover it. If it's genuinely new or ambiguous, flag it as an open question for a design discussion so it lands in Raven, not ad hoc in the prototype.

**About a class name:** check the generated `docs/CLASSES.md`, then Bootstrap. If you can't confirm it exists, say so and add it to the correct SCSS partial rather than guessing.

**About an icon name:** do not guess. Use a placeholder (`if-[placeholder]`) and flag it explicitly.

**About HTMX behaviour at runtime:** describe what should happen, mark the URL as a stub, and note that integration testing is required.

**About accessibility:** produce the correct static HTML, then explicitly state that screen reader testing has not been performed.

**About the surface of a new page:** check or ask which user this is for before writing the first line of HTML.

---

## How we work

### Citing sources when there is disagreement

When agent and developer disagree on a CSS, HTML, or accessibility approach, cite sources before defending or conceding a position. Authoritative sources for this project, in priority order:

1. **MDN Web Docs** (developer.mozilla.org) — specification-level reference for HTML, CSS, ARIA
2. **CSS-Tricks** (css-tricks.com) — practical CSS techniques and patterns
3. **A List Apart** (alistapart.com) — web standards, semantics, accessibility
4. **WHATWG / W3C specs** — when the question is about what the spec actually says
5. **Scott O'Hara / Adrian Roselli / Sara Soueidan** — accessibility-specific edge cases

Don't just assert a position — name which source supports it and why. If no source can be cited, say so and defer to the developer's judgment or look it up.

Never cite an unopened source. A citation is a promise that the source says what you claim. Before putting any external citation in a doc or issue, open the source and confirm it actually states the claim — a search-engine summary is **not** the source; it stitches together adjacent findings and citing it fabricates a citation. Cite only what the source states; anything reasoned or conventional is labelled as such, never dressed as research; if a source can't be read, don't attribute to it. When an internal source is corrected, grep its dependents and re-sync. A wrong citation in a durable doc is worse than no citation.

### Comments

Default to **no comment**; keep one only when a later change would break something silently or non-locally. Never history, never commented-out code, never a restatement of the declaration below. The full convention, with the categories that are *not* explanations (section banners, file headers, HTML directives): `docs/CODE-COMMENTS.md`. Enforced in part by `npm run check:comments`.

### Session scope and reading

Scope a session to what one review can absorb: several features go together when they share a spec, and unrelated work starts a fresh session with the session-start prompt. The planning notes are the bridge between sessions: record load-bearing decisions and open questions the moment they're made, so the next session starts from the notes instead of re-deriving the conversation.

Docs from the session-start map are read in full, per step 1. Code and template files: locate with Grep, read the matching span — full reads are for reviews.

### A note on confidence

Generated code sounds confident regardless of whether it is correct. Confidence is not a reliability signal. Before finalising any output, check:

1. Does this class name actually exist in SCSS?
2. Does this ARIA attribute belong on the right element?
3. Does this icon name match `_icon-font.scss`?
4. Does this HTMX pattern account for the empty, error, and loading states?
5. Does this template carry the correct `data-surface`?

Default to the dumbest version that works, when it's legible. Don't extract a helper for a single call site. Don't introduce a variable to avoid duplicating two lines. Don't add aria-describedby when sequential reading order suffices. If you find yourself thinking "this might be useful later," stop — write the current case only. For example: write plain html instead of a stub.

Justify, don't defend. For example: "Why does trustPillar exist?" is a better question than "is trustPillar necessary?" The first one forces you to name the reason out loud, so you can hear that it's weak. Read your own output skeptically.

Placeholder data must be announced as placeholder. Any claim about the real domain (funders, classifications, faculty behaviour) is sourced or flagged as a guess — never asserted.

### Writing in plans and docs

Frame information active and positive: say what a thing **is**, not what it isn't. Lead with the affirmative statement. Reserve negation for genuine constraints where naming the rejected alternative is the point (e.g. "the query is not a chip").

### Working mode: build-and-show

Default to **build-and-show, not ask-and-record.** Take the obvious option, implement it, and show the result for review — the user vetoes in review. Reserve questions for genuinely load-bearing forks.

This is an HTML prototype, so keep process light: planning notes stay local (they're gitignored) and are updated only when a load-bearing decision changes; commit in coherent chunks without ceremony; verify by confirming the files you touched add no new errors, plus a browser eyeball. Keep strict only what has real downstream cost — the accessibility pre-flight, no invented CSS classes, and flagging raven-dependent work.

When a task would run better another way — investigation via a subagent, a new topic in a fresh session — flag it before starting.
