# The rendered HTML contract

How a consuming app (raven, pre-ingest, &hellip;) relates to Booktower's prototypes, and what "the prototype is the source of truth" means once real template languages, data, and permissions are involved.

The core rule:

> Booktower defines what the browser receives. A consuming app defines how its server produces that output from application data.

Booktower's prototype templates carry placeholder data and stub `hx-*` URLs — they are reference implementations of browser output, not files to copy verbatim into production. A consumer's template source will therefore never stay byte-identical to the prototype. Conformance is judged on the **rendered HTML**, never on source-file equality.

This contract is template-language neutral: each consumer renders in its own stack, and Booktower does not prefer one. Examples below are written as pseudocode — adapt them to the app's language.

## Canonical examples

Every pattern has a **canonical example**: the kit page and/or prototype template that defines its contract — for the work card, `patterns/work-card.html`. The canonical example is what a consumer copies from and what every consumer's rendered output is judged against.

This is why editing a prototype has weight: **changing a canonical example changes what every consuming app must render.** A prototype edit that looks cosmetic in this repo can be a contract change for raven, pre-ingest, and every future consumer.

---

## Ownership

**Booktower owns** — a consumer changes these only by changing Booktower first:

- required elements and nesting of each component
- Booktower and Bootstrap class composition
- `data-surface` declarations and surface semantics
- data attributes and JavaScript hooks
- icon usage
- accessible names and relationships (labels, `aria-*`, live regions)
- documented component variants and their meaning
- the compiled assets: `booktower.css`, icon fonts, component JavaScript

**The consuming app owns:**

- data retrieval and domain-model mapping
- loops and conditional rendering
- permission decisions
- routes, form actions, and real HTMX endpoints (the prototype's are stubs)
- localization
- page composition outside the reusable component contract
- its own app-specific CSS, layered on top of the copied assets (never edits to `booktower.css` itself)
- its server-side template language

---

## First implementation of a pattern

1. Open the pattern's canonical example (per the safe workflow in `CONSUMING-BOOKTOWER.md`).
2. Copy the rendered structure.
3. Replace placeholder data with the app's template expressions.
4. Add app-owned loops, conditions, permissions, URLs, and endpoints.
5. Preserve Booktower-owned structure, classes, attributes, hooks, and accessibility relationships.

Copy the structure, never reconstruct it from memory or from a verbal description.

This template source is allowed — and its rendered output must still satisfy the work-card contract:

```
# app-owned loop, in the app's own template language
for each work in works:
    render the work-card pattern with this work's data
```

## Ownership comment

Give each adapted component template a short ownership comment, so an agent opening it sees the boundary — in whatever comment syntax the app's template language uses:

```
Booktower component: work-card
Canonical example: patterns/work-card.html
App-owned: data mapping, URLs, permissions, control flow.
Booktower-owned: rendered structure, classes, hooks, accessibility.
```

---

## Later Booktower updates

An adapted template is an implementation of the contract — never overwrite it with prototype HTML during an update.

1. Copy the changed Booktower-owned assets exactly (`booktower.css`, fonts, JS — the file set in `CONSUMING-BOOKTOWER.md`).
2. Check whether the rendered contract of the affected components changed.
3. Preserve the app's data binding and control logic.
4. Apply only the structural or behavioural differences the new contract requires.

Scope follows the change: a CSS-only change rewrites no templates; a JS-only change rewrites no control logic; a markup-contract change produces a targeted template diff.

---

## What a consumer may vary, and what it may not

**May vary:** text and localized content · URLs and form actions · IDs (relationships stay valid) · list lengths · presence of documented optional regions · server-side syntax · permission-based inclusion of documented actions · choice among documented variants.

**May not vary independently:** required class names · required nesting · required JS hooks · required accessible relationships · surface rules · icon conventions · the meaning of a documented variant.

## Missing variants

A needed variation the current component can't express is Booktower work: describe it as reusable browser output, then draft a PR or create an issue in Booktower; once it lands — implemented and on its kit page — apply it in the consumer. A local approximation in one consumer becomes a fork the other consumers can't see. Only a genuinely app-specific difference stays in the app — kept narrow and explained.

## What the consumer remains responsible for

The ownership split does not lift the consumer's duties. Booktower defines the accessible structure; the consumer keeps it accessible once real data flows through it:

- accessible names and relationships stay valid with real data, translations, and generated IDs — a correct `aria-labelledby` in the prototype breaks silently when the app generates different IDs
- labels, counts, and live-region text are translated, not just the visible copy
- app-owned composition (pages built around the patterns) meets the same accessibility baseline
- rendered output is verified with the consumer's own checks — for Biblio's public site, Rubric is the auditor

## Drift

Two kinds, detected differently:

- **Asset drift** — the copied `booktower.css`, fonts, and JS can be compared byte-for-byte against a fresh Booktower build. The `/*! Booktower <commit>/<date> */` stamp in the CSS header names the source commit a copy came from.
- **Rendered-markup drift** — adapted templates can't be diffed against prototypes. Check the rendered output instead: documented classes only, no retired classes, required nesting and attributes, `data-surface` present, accessible relationships intact, JS hooks present.

Drift found is a flag, not an automatic verdict: it usually means the kit is missing something, or one side has a real problem. Investigate, then resolve in the kit so every consumer gets the fix — don't silently align to either side.

---

Booktower owns the browser output; the app owns how that output is produced.
