module.exports = function renderRelatedWorks() {
  return `
<div class="d-flex flex-column gap-3">
  <article class="card">
    <div class="card-body">
      <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Cooling co-benefits of urban tree networks in compact European cities</a>
      <p class="small text-muted">Journal article · 2025</p>
      <div class="d-flex flex-wrap gap-1">
        <a href="#" class="badge bg-primary-light text-decoration-none">Green infrastructure</a>
        <a href="#" class="badge bg-secondary text-decoration-none">Trees</a>
      </div>
    </div>
  </article>
  <article class="card">
    <div class="card-body">
      <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Planning biodiversity corridors through urban green infrastructure</a>
      <p class="small text-muted">Journal article · 2024</p>
      <div class="d-flex flex-wrap gap-1">
        <a href="#" class="badge bg-secondary text-decoration-none">Biodiversity</a>
        <a href="#" class="badge bg-primary-light text-decoration-none">Urban climate</a>
      </div>
    </div>
  </article>
</div>`;
};
