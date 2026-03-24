# Consuming Booktower in Another Project

This document is the integration contract for any other project, repository, or AI assistant that needs to use `booktower-ui-library` correctly.

Read this before copying templates, classes, or CSS into another codebase.

---

## What Booktower is

Booktower is best understood as:

- Bootstrap for utilities and common component mechanics
- Booktower for design tokens, layout shells, and domain components
- HTMX-first templates as reference implementations

Do not treat it as a second utility framework layered on top of Bootstrap.

---

## Non-negotiable rules

1. Use only documented classes.
   - `ASSISTANT.md` is the class reference.
   - `assets/booktower.css` is the final ground truth.
   - Do not invent plausible BEM names.

2. Choose the shell first.
   - `u-layout--public` = public pages with normal document flow
   - `u-layout--app` = backoffice pages with fixed shell and internal scroll regions

3. Copy patterns before composing your own.
   - Use `patterns/layout-shells.html` for shell structure
   - Use `templates/biblio-public/*.html` for public pages
   - Use `templates/biblio-backoffice/*.html` for app pages

4. Let Bootstrap own utility work.
   - spacing
   - grid/flex
   - display and sizing
   - most text/background/border utility cases

5. Let Booktower own structure and semantics.
   - surface tokens
   - layout shells
   - navbar/sidebar structure
   - domain components such as research cards and library-specific UI

6. Do not recreate removed patterns.
   - no steppers
   - no `u-scroll-wrapper`
   - no retired sidebar names
   - no parallel custom utility matrix

---

## Questions to answer before writing layout HTML

If you are new to this library, answer these in plain language first. Do this before choosing classes.

1. Is this page part of the public website, or part of the staff/admin interface?
2. Should the whole page scroll like a normal website page, or should the app frame stay fixed while only certain areas scroll?
3. Does the main content area have one column, or does it have a left filter/details column next to a main content column?
4. Is the left sidebar the main app navigation, or is it page-specific content such as filters?
5. Does this page need a fixed top area inside the content, such as tabs, actions, or search controls?
6. Does this page need a fixed bottom area inside the content, such as pagination or actions?
7. Is there an extra right-side panel for side tasks, editing, or contextual actions?
8. Should this page follow an existing example in `templates/` or `patterns/`, or is it intentionally a new pattern?

After answering those questions, map them to the library contract:

- public website page → `u-layout--public`
- staff/admin page → `u-layout--app`
- normal page scroll → public layout
- fixed app frame with internal scrolling areas → app layout
- page-specific left pane inside the main area → `u-main__body u-main__body--split` with `u-main__sidebar`
- main app navigation sidebar → `bt-sidebar`
- fixed top area inside the right pane → `u-main__content-header`
- fixed bottom area inside the right pane → `u-main__content-footer`
- extra shell-level right panel → `u-main__panel`

If you cannot answer these questions clearly, stop and inspect the nearest existing template before writing new markup.

---

## The two shells

### `u-layout--public`

Use for public search, landing, and detail pages.

Rules:

- page scrolls normally
- width comes from Bootstrap `.container` inside the regions
- `u-main__body` is plain unless the page genuinely has an internal pane layout

Minimal example:

```html
<div class="u-layout--public" data-surface="public">
  <header class="bt-navbar" role="banner">...</header>

  <main id="main-content">
    <div class="u-main__header">
      <div class="container">...</div>
    </div>

    <div class="u-main__body">
      <div class="container">...</div>
    </div>

    <div class="u-main__footer">
      <div class="container">...</div>
    </div>
  </main>
</div>
```

### `u-layout--app`

Use for backoffice list, detail, settings, and workflow pages.

Rules:

- shell owns sticky regions and scroll behavior
- `u-main__body` is the required middle row
- add `u-main__body--split` only when there is a left `u-main__sidebar`
- in split pages, `u-main__content-body` is the actual scrolling pane

Minimal split example:

```html
<div class="u-layout--app" data-surface="backoffice">
  <header class="bt-navbar" role="banner">...</header>
  <nav class="bt-sidebar" aria-label="Section navigation">...</nav>

  <main id="main-content">
    <div class="u-main__header">...</div>

    <div class="u-main__body u-main__body--split">
      <aside class="u-main__sidebar u-main__sidebar--border-right">...</aside>

      <section class="u-main__content">
        <div class="u-main__content-header">...</div>
        <div class="u-main__content-body">...</div>
        <div class="u-main__content-footer">...</div>
      </section>
    </div>

    <div class="u-main__footer">...</div>
  </main>

  <aside class="u-main__panel" aria-label="Contextual actions">...</aside>
</div>
```

Minimal single-column app example:

```html
<div class="u-layout--app" data-surface="backoffice">
  <header class="bt-navbar" role="banner">...</header>
  <nav class="bt-sidebar" aria-label="Section navigation">...</nav>

  <main id="main-content">
    <div class="u-main__header">...</div>

    <div class="u-main__body">
      <section class="u-main__content">
        <div class="u-main__content-body">...</div>
      </section>
    </div>
  </main>
</div>
```

---

## Scroll ownership

This is the easiest thing to get wrong.

Public pages:

- the document/page scrolls
- Bootstrap containers sit inside `u-main__header`, `u-main__body`, `u-main__footer`

App pages:

- the shell is fixed
- `bt-sidebar` scrolls as the shell nav
- when the body is split:
  - `u-main__sidebar` scrolls on the left
  - `u-main__content-body` scrolls on the right

Do not move scroll behavior into ad hoc wrappers unless you are intentionally changing the layout contract.

---

## How to use Bootstrap with Booktower

Preferred division of responsibility:

Bootstrap:

- spacing utilities
- containers, rows, columns
- flex/grid helpers
- display and visibility
- most text, border, and background utilities

Booktower:

- tokens
- surfaces
- shell regions
- component markup conventions
- domain-specific UI

Rule of thumb:

- If Bootstrap already has a good utility, use it.
- If Booktower already has a structural/component class, use that.
- Only add a new Booktower class when Bootstrap cannot express the design or when the class represents a reusable domain pattern.

---

## HTMX expectations

The prototypes are not production implementations, but their interaction contract matters.

When reproducing a prototype in another project:

- keep the same DOM structure when possible
- keep `hx-target` containers present in the initial DOM
- keep `hx-indicator` on interactive requests
- keep `aria-live` regions in the initial HTML
- preserve the visible behavior even if the server endpoints differ

The prototypes are level-2 behavior references: believable, testable, and structurally correct.

---

## Accessibility baseline

Every consuming project should preserve these:

- one `<h1>` per page
- `<main id="main-content">`
- labeled navigation landmarks
- labels for all form controls
- accessible names for icon-only buttons
- `aria-current="page"` on active navigation
- no visual-only state changes without accessible feedback

See `ASSISTANT.md` for the full checklist.

---

## Safe workflow for another AI assistant

If you are using this library inside another repository, do this in order:

1. Read `docs/CONSUMING-BOOKTOWER.md`
2. Read `docs/UI-LAYER.md`
3. Read `ASSISTANT.md`
4. Open `patterns/layout-shells.html`
5. Open the closest matching template in `templates/`
6. Copy the structure first, then adapt the content

Do not start by inventing markup from memory.
