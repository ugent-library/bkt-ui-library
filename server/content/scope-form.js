const renderScopeList = require('./scope-list');

module.exports = function renderScopeForm({ scoped = true, names = ['Faculty of Sciences', 'Faculty of Engineering'] } = {}) {
  const summary = scoped
    ? `
  <div class="bg-white rounded-3 bt-border mb-4 p-4 d-flex align-items-start gap-3">
    <i class="if if-check-circle text-success mt-1 flex-shrink-0" aria-hidden="true"></i>
    <div class="min-w-0">
      <p class="fw-semibold mb-2 small">Your current scope</p>
      <div class="d-flex flex-wrap gap-1 align-items-center">
        ${names.map(name => `<span class="badge text-bg-light border fw-normal">${name}</span>`).join('')}
        <span class="text-muted small px-1" aria-hidden="true">·</span>
        <span class="badge text-bg-primary">Dataset</span>
        <span class="badge text-bg-primary">Dissertation</span>
      </div>
    </div>
    <button type="button" class="btn btn-ghost btn-sm ms-auto text-muted flex-shrink-0"
      aria-label="Clear all scope settings"
      hx-delete="/settings/scope"
      hx-target="#scope-form"
      hx-swap="outerHTML"
      hx-confirm="Remove your scope? You'll see all records your grants allow.">
      Clear scope
    </button>
  </div>`
    : `
  <div class="bg-white rounded-3 bt-border mb-4 p-4 d-flex align-items-start gap-3">
    <i class="if if-info-circle text-muted mt-1 flex-shrink-0" aria-hidden="true"></i>
    <div>
      <p class="fw-semibold mb-1 small">No scope set</p>
      <p class="text-muted small mb-0">
        You're currently seeing everything your access rights allow.
        Configure scope below to narrow your default view.
      </p>
    </div>
  </div>`;

  return `
<form method="post" action="/settings/scope" id="scope-form">
  ${summary}
  <section aria-labelledby="org-scope-heading" class="bg-white rounded-3 bt-border mb-4">
    <div class="px-4 py-3 border-bottom">
      <h2 id="org-scope-heading" class="h6 fw-semibold mb-0">Organisations</h2>
      <p class="text-muted small mb-0 mt-1">
        Add one or more faculties, departments, or research groups.
      </p>
    </div>
    ${renderScopeList(names)}
    <div class="px-4 py-3">
      <label for="org-search" class="form-label small">Add an organisation</label>
      <div class="position-relative">
        <input
          type="search"
          id="org-search"
          class="form-control"
          placeholder="Search by faculty, department, or research group&hellip;"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="org-suggest"
          aria-expanded="false"
          hx-get="/orgs/suggest"
          hx-trigger="keyup changed delay:200ms"
          hx-target="#org-suggest"
          hx-swap="innerHTML"
          hx-indicator="#org-suggest-indicator">
        <div id="org-suggest"
          class="position-absolute start-0 end-0 top-100 bg-white border rounded-3 shadow mt-1 overflow-hidden"
          role="listbox"
          aria-label="Organisation suggestions"
          hx-on::after-swap="this.hidden = this.textContent.trim().length === 0; document.getElementById('org-search')?.setAttribute('aria-expanded', this.hidden ? 'false' : 'true')"
          hidden></div>
      </div>
      <span id="org-suggest-indicator" class="htmx-indicator text-muted small mt-1 d-block" aria-live="polite">
        Searching organisations&hellip;
      </span>
    </div>
  </section>
  <div class="d-flex justify-content-end">
    <button type="submit" class="btn btn-primary">Save scope</button>
  </div>
</form>`;
};
