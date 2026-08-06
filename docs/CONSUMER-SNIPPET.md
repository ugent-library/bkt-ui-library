# Booktower section for consuming repos

Canonical text for the `## Design system` section of a consuming app's `AGENTS.md` (raven, pre-ingest, &hellip;). Copy it, fill the `<placeholders>`, and keep app-specific additions below the copied block. When this text changes, re-sync the consumers.

---

## Design system

This app consumes `booktower-ui-library` as its design-system source. The
compiled `booktower.css` and icon fonts are copied into `<asset path>`; this
app does not own Booktower component CSS.

Before template or CSS work, read `bkt-ui-library/AGENTS.md` in the sibling
checkout, then the Booktower docs it routes consumers to — especially
`docs/CONSUMING-BOOKTOWER.md` and `docs/RENDERED-HTML-CONTRACT.md`. Use only
documented Bootstrap, `bt-*`, and `u-*` classes. Do not invent plausible
class names.

Booktower defines what the browser receives; this app defines how its server
produces that output from application data. Adapted templates carry app-owned
loops, permissions, URLs, and localization — conformance is judged on rendered
HTML, never on source equality. Give each adapted component template an
ownership comment naming its canonical Booktower source.

Booktower requests come in three shapes — classify by intent, whatever the
wording:

- **Consuming a pattern** (build a page, apply a component, make it look like
  the prototype): copy the rendered structure from the pattern's canonical
  example, adapt it to this app's template language, preserve Booktower-owned
  structure, classes, hooks, and accessibility.
- **Re-syncing the assets** (bring this app up to date with Booktower): copy
  the changed compiled assets exactly; never overwrite adapted templates with
  prototype HTML; apply only the markup differences the changed contract
  requires, preserving app logic.
- **Changing the design system** (the reusable pattern itself is wrong or
  missing): that is work in `bkt-ui-library` — issue-backed branch and PR
  there, build, then copy the compiled assets here. Do not implement a
  reusable design-system change as a local patch; if only this repo is in
  scope, report the upstream gap instead.

This app can carry its own CSS in `<app stylesheet>`, layered on top of
`booktower.css`, for genuinely app-specific styling. Anything reusable belongs
in `bkt-ui-library` — draft a PR or create an issue there. Never patch the
copied `booktower.css` itself.
