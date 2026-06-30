module.exports = function renderQueryPreview() {
  return `
<div class="bg-light border rounded p-3 mb-3 font-monospace small" id="query-summary" aria-label="Current query conditions">
  <span class="text-muted">type</span>
  <span class="fw-semibold text-dark ms-1 me-1">is</span>
  <span class="badge bg-primary fw-normal">Journal article</span>
  <span class="text-muted ms-2 me-2">AND</span>
  <span class="text-muted">year</span>
  <span class="fw-semibold text-dark ms-1 me-1">is</span>
  <span class="badge bg-primary fw-normal">2024</span>
</div>
<div class="bg-white border rounded p-3">
  <p class="text-muted small mb-2">Search URL</p>
  <code class="small">https://biblio.ugent.be/search?type=journal_article&amp;year=2024</code>
</div>`;
};
