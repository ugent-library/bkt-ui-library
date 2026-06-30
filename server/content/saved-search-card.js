module.exports = function renderSavedSearchCard(id, title, tags) {
  return `
<div class="d-flex align-items-start gap-3 border rounded p-3">
  <div class="flex-grow-1">
    <p class="fw-semibold mb-1 small">${title}</p>
    <p class="text-muted small mb-1">${tags.map(tag => `<span class="filter-tag--static${tag.startsWith('ms-') ? '' : ' ms-1'}">${tag}</span>`).join(' ')}</p>
  </div>
  <div class="d-flex gap-2 flex-shrink-0">
    <a href="backoffice-search.html" class="btn btn-ghost btn-sm" aria-label="Run saved search">
      <i class="if if-search if--sm" aria-hidden="true"></i> Run
    </a>
    <button type="button" class="btn btn-ghost btn-sm" hx-get="/search/saved/${id}/load" hx-target="#condition-list" hx-swap="innerHTML" aria-label="Load saved search into builder">
      <i class="if if-edit if--sm" aria-hidden="true"></i> Edit
    </button>
    <button type="button" class="btn btn-ghost btn-sm text-danger" hx-delete="/search/saved/${id}" hx-target="closest div.border" hx-swap="outerHTML" aria-label="Delete saved search">
      <i class="if if-delete if--sm" aria-hidden="true"></i>
    </button>
  </div>
</div>`;
};
