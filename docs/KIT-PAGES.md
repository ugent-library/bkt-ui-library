# UI kit page conventions

How to build a documentation page in `foundations/`, `elements/`, or `patterns/`. Before creating a new page, read at least two existing pages and match their structure exactly.

```html
<!-- Page header — data-surface="public" for display heading style -->
<header class="ds-page-header col-6" data-surface="public">
  <p class="ds-eyebrow">Patterns</p>
  <h1 class="display-1">Page title</h1>
  <p class="lead">Introduction.</p>
</header>

<!-- Section -->
<section class="ds-section">
  <h2 class="h4 mb-3">Section heading</h2>

  <!-- Demo block -->
  <div class="ds-demo">
    <h3 class="ds-demo-label">Variant label</h3>
    <div class="ds-demo-body">
      <!-- live component HTML here -->
    </div>
  </div>

  <!-- Code block -->
  <div class="ds-code">
    <div class="ds-code-bar">
      <span class="ds-code-lang">html</span>
      <button class="ds-code-copy">Copy</button>
    </div>
    <pre>&hellip;</pre>
  </div>
</section>
```

Rules:

- `<header>` not `<div>` for the page header
- `<section>` not `<div>` for each content section
- Section headings: `<h2 class="h4 mb-3">`
- Demo labels: `<h3 class="ds-demo-label">` not `<div>`
- No `<style>` blocks — all styles go in SCSS
- No `style=` attributes unless the value is genuinely dynamic
- `ds-demo-body` wraps live demos; `ds-code` wraps code examples — never mix them
- **Static `ds-code` blocks are only justified when they show something the "Show HTML" toggle cannot** — for example, a structural skeleton with explanatory comments, a JS snippet, or a usage pattern that differs from the live demo. If a `ds-code` block duplicates what the toggle would generate, delete it. If the code block is *more complete* than the demo, update the demo to match — then delete the block.
