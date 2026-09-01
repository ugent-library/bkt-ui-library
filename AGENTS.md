# Booktower UI Library working guide

Booktower is the design system and prototype environment for Ghent University Library
applications. Its main consumer is Raven, which powers `biblio.ugent.be`. The kit is
HTMX-first, Bootstrap-based, server-rendered, progressively enhanced and accessible.

Public pages present research-output metadata to the wider public.
Backoffice pages are where that metadata is entered and managed. The product layer
decides the surface; user role, subject matter and interface density do not.

## Ownership

| Place | Owns | Decides |
|---|---|---|
| ProductBoard | User demand and priority | Product |
| This repo | Prototype, layout, interaction and design-system code | Design |
| Raven | Domain model, fields, statuses and backend behavior | Development |
| Raven issues | Implementation scope and acceptance criteria | Development |

Demand becomes a prototype here. Raven models the domain. Implementation issues start
from the prototype and live in Raven. Design decides how it looks, development decides
how it is built, and product decides when.

When sources disagree, trust them in this order:

1. SCSS, JavaScript and prototype HTML
2. Generated inventories: `docs/CLASSES.md` and `_icon-font.scss`
3. Contracts: accessibility, rendered HTML and Raven public semantics
4. Canonical kit examples
5. Guides
6. Historical audits and `CHANGELOG.md`

`docs/wip/` contains drafts, not contracts. `docs/FEATURE-WORKFLOW.md` governs their
removal at issue handoff.
`docs/decisions/` records why accepted design choices were made. Current behavior still
lives in code, contracts and guides.

## Consumers

Booktower defines what the browser receives. A consuming app defines how its server
produces it.

- First integration: `docs/CONSUMING-BOOKTOWER.md`
- Updating adapted HTML: `docs/RENDERED-HTML-CONTRACT.md`
- Classes and composition: `docs/CLASSES.md`, then `docs/CLASS-USAGE.md`
- Icons: `assets/scss/icons/_icon-font.scss`; use `i.if.if-[name]`
- Surfaces and shells: `docs/SURFACES.md`, then `docs/UI-LAYER.md`
- Consumer agent instructions: `docs/CONSUMER-SNIPPET.md`

Fix reusable styling here, then copy the compiled assets again. Never patch a copied
`booktower.css`.

## Builders

### Read only what the task needs

| Task | Read first |
|---|---|
| Make a design or wording decision | `foundations/design-principles.html` |
| Defend, record or revisit a design decision | `docs/decisions/README.md` |
| Start or resume a product feature | `docs/FEATURE-WORKFLOW.md` and the `biblio-feature-workflow` skill |
| Product flow | `docs/FLOW-TEMPLATE.md` |
| HTML wireframe brief | `docs/WIREFRAME-BRIEF-TEMPLATE.md`, `docs/KIT-PAGES.md` |
| New page or feature | `docs/SURFACES.md` |
| Audience or legibility | `docs/RESEARCH-PERSONAS.md` |
| Domain meaning or workflow | `docs/DOMAIN-VOCABULARY.md`, `docs/DOMAIN-CONTEXT.md` |
| Accountability, policy risk or AI suggestions | `docs/RESPONSIBILITIES.md` |
| Template | `docs/UI-LAYER.md`, `docs/CONSUMING-BOOKTOWER.md`, `docs/ACCESSIBILITY.md` |
| CSS or SCSS | `docs/CSS-ARCHITECTURE.md` |
| Search or filtering | `docs/SEARCH-AND-FILTERING.md` |
| JavaScript | `docs/JAVASCRIPT.md` |
| Kit server | `docs/SERVER.md` |
| Kit documentation page | `docs/KIT-PAGES.md` |
| Prose | `docs/SPEC-WRITING.md`; code comments use `docs/CODE-COMMENTS.md` |
| Raven implementation issue | `docs/ISSUE-TEMPLATE.md` and the `biblio-issue-writer` skill |
| Product bet | `docs/PRODUCT-BET-TEMPLATE.md` and the `product-bet-writer` skill |
| New field, status or entity | Raven's relevant `docs/metadata-*.md` catalog |
| Public record semantics | Raven's `docs/public-site-semantics.md` |

Read the selected docs in full. Locate relevant code with search and read the matching
span. Do not load unrelated guides.

Before writing HTML:

1. Choose `data-surface="public"` or `data-surface="backoffice"` using
   `docs/SURFACES.md`.
2. Answer the layout questions in `docs/CONSUMING-BOOKTOWER.md`.
3. Check every class in `docs/CLASSES.md` and its use in `docs/CLASS-USAGE.md`.
4. Run the accessibility pre-flight in `docs/ACCESSIBILITY.md` before handover.

### Non-negotiables

- The six design principles are **01 Structure is the style**, **02 Opinions over options**,
  **03 The past and the future share the same grid**, **04 Knowledge wants to move**,
  **05 Trust is placed deliberately** and **06 Quality is reached in cycles**. Their tests live
  only in `foundations/design-principles.html`.
- Every layout container declares its surface.
- Use only the UGent icon font. Check icon names; do not invent them.
- Use only classes present in `docs/CLASSES.md`. Bootstrap comes before custom CSS.
- Author CSS rules in `assets/scss/`. Inline styles or JavaScript style mutation are
  limited to values genuinely unknown until runtime; see `docs/CSS-ARCHITECTURE.md`.
- Real pages have no inline scripts. Register every `assets/js/` file in
  `docs/JAVASCRIPT.md`.
- Prefer separate prototype states to JavaScript when the transition itself is not
  under design. JavaScript clones markup from `<template>`; it does not build HTML
  strings.
- Meet WCAG 2.1 AA. Static checks do not replace human screen-reader testing after
  HTMX swaps.
- Prototype `hx-*` URLs are stubs. A form needs a real submit path or the documented
  prototype exception.
- Keep data-dependent variants as states in one template. See `docs/SERVER.md`.
- Public record pages include the structured data required by
  `docs/ACCESSIBILITY.md` H4.
- Kit pages use Booktower classes. A missing demo style is a design-system gap, not a
  reason for page-specific CSS.

### Uncertainty

Do not invent policy, domain fields, class names, icons or runtime behavior.

- Check Raven before introducing a field, status or entity.
- Record unresolved policy as a question with concrete options and the external
  decision-maker when one exists.
- Add a missing class to the right SCSS partial; use a flagged placeholder for a
  missing icon.
- Describe intended HTMX behavior and mark the endpoint as a stub.
- State that screen-reader testing was not performed when it was not performed.

Placeholder data must be labelled. Source claims about real funders, classifications
or behavior, or mark them as assumptions.

## Working practice

Build the obvious reviewable version. Ask only when different answers would change
the result materially. Keep one session to one coherent review.

Use the smallest implementation that works. Do not add helpers, configuration,
comments or abstractions for hypothetical use. Planning notes are local and record
only decisions or open questions that a later session needs.

Comments explain silent or non-local traps. Prototype HTML may also keep a concise,
source-local `Prototype note:` for design in flux. See `docs/CODE-COMMENTS.md`.

When a CSS, HTML or accessibility disagreement needs an external source, open it
before citing it. Prefer MDN, then WHATWG or W3C for specifications. Label inference
as inference.

When an internal source changes, search its dependents and re-sync them.

Run `npm test` after template, JavaScript or SCSS changes. Check the browser for visual
changes. Report the outcome, remaining decisions and tests; omit the work diary.
