# UI kit pages

Pages in `foundations/`, `elements/` and `patterns/` help a person choose, inspect and verify the
design system. Read two nearby pages before adding one.

## Visible content

A kit page shows; it does not explain. Demos carry the variants and states. Prose earns its
place only as:

- purpose and when to choose the pattern;
- behavior a static example cannot show, including focus and keyboard behavior;
- accessibility requirements specific to the pattern;
- links to the owning partial, contract or implementation guide.

A trap that is dangerous to leave unstated earns a sentence; raise it before writing it. Move
cross-page rules, architecture and implementation contracts to `docs/`. Put unsettled work that
coordinates several
pages, people or repositories in `docs/wip/` or an issue. Do not create a document only to repeat a
source-local prototype note. Git owns routine iteration. If an alternative explains an accepted
choice that may need defending later, record it in `docs/decisions/`.

Do not show roadmap status, issue acceptance criteria, implementation plans, old behavior or a tour
of markup, JavaScript or SCSS. Do not copy or summarize a contract from `docs/`; link it.

`npm run check:prose` enforces the ceilings: explanatory prose stays below 250 words on an element
page and 500 on a pattern page. Demo labels, fixture content, reference tables, headings and code
do not count. A foundation page may run longer when its prose is the subject, as on Design
Principles.

## HTML comments

A fact has one home. Cross-page rules, contracts and durable rationale belong in their owning docs.
Do not mirror them in kit HTML. Comments may contain:

- server directives such as `@title`, `@surface`, `@state`, `@include` and `@active`;
- a concise `Prototype note:` about the nearby example, fixture, inert control or design choice
  still in flux;
- a short source-local `Warning:` where an edit would otherwise break another file silently.

Keep a `Prototype note:` with its single markup owner and under 40 words. Move it to `docs/wip/`, an
issue or a decision when it must be repeated, changes another contract, needs coordination or
contains rationale worth retaining. A warning links to its owning doc and does not duplicate the
explanation.

## Partials

Files under `elements/partials/` and `templates/partials/` are reusable fragments, not kit pages.
They have no page header, sections or shell chrome. Add `@example` so a blank partial links to the kit
page that renders it. Document the pattern in `patterns/` only when people need guidance beyond the
markup.

## Structure

```html
<header class="ds-page-header col-6" data-surface="public">
  <p class="ds-eyebrow">Patterns</p>
  <h1 class="display-1">Page title</h1>
  <p class="lead">Purpose and use.</p>
</header>

<section class="ds-section">
  <h2 class="h4 mb-3">Variant</h2>
  <div class="ds-demo">
    <h3 class="ds-demo-label">State</h3>
    <div class="ds-demo-body">
      <!-- live component HTML -->
    </div>
  </div>
  <div class="ds-demo-note">Notes</div>
</section>
```

- Use semantic `<header>`, `<section>` and heading elements.
- Section headings use `<h2 class="h4 mb-3">`.
- Demo labels use `<h3 class="ds-demo-label">` or the nested `ds-demo-title` form.
- `ds-demo-body` contains live examples. `ds-code` contains code; never mix them.
- Use no `<style>` block. Put styles in SCSS.
- Use no `style=` unless the value is genuinely dynamic.
- Add a static `ds-code` block only when Show HTML cannot show the example, such as JavaScript or a
  deliberately abbreviated structural skeleton. Delete code that duplicates the live demo.
