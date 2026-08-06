# Contributing

For anyone changing this repo — humans and AI agents alike. [README.md](README.md) covers setup and commands; [AGENTS.md](AGENTS.md) routes to the working rules (CSS authoring, accessibility, JavaScript). Read both before your first change.

## How work flows

This repo moves fast — it is where the right thing to build gets discovered.

- **Prototyping is the default mode.** Build directly, commit in coherent chunks, no ceremony. Prototypes come first; issues are written *from* them, not the other way around (`docs/ISSUE-TEMPLATE.md` + the `biblio-issue-writer` skill).
- **Implementation lands in raven** and follows raven's issue → branch → commit → PR chain — see raven's `AGENTS.md`.
- **Design-system changes raven is waiting on** (a missing class, icon, or component) get an issue-backed branch and PR here, so the dependency is traceable from the raven side.

When more people start committing here regularly, revisit this file and tighten the workflow.

## What gates a change

- `npm test` passes — see the [README](README.md#tests) for what each check catches.
- Templates pass the accessibility pre-flight checklist in [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).
- Every class name exists in `docs/CLASSES.md`. Missing style? Add it to the right SCSS partial — never invent a class or patch inline.
- A component change updates its kit page and docs in the same change.

## Decisions and open questions

Design decisions — look, interaction, layout — land in this repo. Domain rules (what a status means, which fields exist) are raven's to define: record an open question instead of inventing an answer here. Demand and priority live in ProductBoard and are also discovered here, through prototyping. The full ownership map is in [AGENTS.md](AGENTS.md).

## Consuming Booktower

Raven and other apps copy the compiled artifacts — see [docs/CONSUMING-BOOKTOWER.md](docs/CONSUMING-BOOKTOWER.md). A styling gap in a consumer is fixed here first, then re-copied. Consumer-side patches to `booktower.css` don't happen.
