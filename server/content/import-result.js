module.exports = function renderImportResult(label) {
  return `
<article class="border rounded bg-white p-3 mt-5">
  <div class="d-flex align-items-center gap-2 mb-2">
    <span class="badge text-bg-primary">Journal article</span>
    <span class="badge text-bg-secondary">${label}</span>
  </div>
  <h3 class="h6 mb-1">Urban forests as essential infrastructure for climate resilience and biodiversity: a call to policymakers</h3>
  <p class="text-muted small mb-3">Esperon-Rodriguez, M. · De Pauw, K. · 2026</p>
  <a href="deposit-1-1-find.html" class="btn btn-primary btn-sm text-white">Use this record</a>
</article>`;
};
