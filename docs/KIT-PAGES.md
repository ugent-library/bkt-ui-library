# UI kit pages

Pages in `foundations/`, `elements/` and `patterns/` help a person choose, inspect and verify the
design system. Read two nearby pages before adding one.

## Visible content

A kit page may show:

- what the pattern is and when to use it;
- canonical variants and states;
- behavior a static example cannot show, including focus and keyboard behavior;
- accessibility requirements specific to the pattern;
- links to the owning partial, contract or implementation guide.

Keep rationale only when it helps a reader choose between patterns. Move cross-page rules,
architecture and implementation contracts to `docs/`. Put unsettled work in `docs/wip/` or an issue.
Git owns history and rejected alternatives.

Do not show roadmap status, issue acceptance criteria, implementation plans, old behavior or a tour
of JavaScript and SCSS. Do not copy a contract from `docs/`; link it.

As a review threshold, keep explanatory prose below 250 words on an element page and 500 on a
pattern page. Demo labels, fixture content and reference tables do not count. A foundation page may
run longer when its prose is the subject, as on Design Principles.

## HTML comments

AI context belongs in `docs/`, not hidden in kit HTML. Comments are limited to:

- server directives such as `@title`, `@surface`, `@state`, `@include` and `@active`;
- a short source-local warning where an edit would otherwise break another file silently.

A warning links to its owning doc. It never duplicates the explanation.

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
