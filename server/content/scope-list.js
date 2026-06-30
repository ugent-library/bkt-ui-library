const slugify = require('./slugify');

module.exports = function renderScopeList(names) {
  return `
<div class="px-4 py-3 border-bottom" id="org-scope-list" aria-label="Selected organisations" aria-live="polite">
  <div class="d-flex flex-wrap gap-2">
    ${names.map(name => `
      <span class="d-inline-flex align-items-center gap-1 badge bg-light text-dark border fw-normal py-2 px-3">
        ${name}
        <button type="button" class="btn-close btn-sm ms-1" aria-label="Remove ${name} from scope" hx-delete="/settings/scope/org/${slugify(name)}" hx-target="#org-scope-list" hx-swap="outerHTML"></button>
      </span>`).join('')}
  </div>
</div>`;
};
