module.exports = function renderTokenResults() {
  return `
<div class="d-flex flex-column gap-3">
  <article class="border rounded bg-white p-3">
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="badge bg-primary">Journal article</span>
      <span class="badge bg-success">Has file</span>
    </div>
    <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Urban forests as essential infrastructure for climate resilience and biodiversity</a>
    <p class="small text-muted mb-0">Matched tokens: <code>type:journal_article</code> <code>affiliation:sciences</code> <code>has_file:true</code></p>
  </article>
  <article class="border rounded bg-white p-3">
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="badge bg-primary">Journal article</span>
      <span class="badge bg-success">Open access</span>
    </div>
    <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Hybrid classical–quantum algorithms for combinatorial optimisation in logistics</a>
    <p class="small text-muted mb-0">Matched tokens: <code>type:journal_article</code> <code>affiliation:sciences</code></p>
  </article>
</div>`;
};
