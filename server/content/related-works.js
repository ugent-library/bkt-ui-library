module.exports = function renderRelatedWorks() {
  return `
<div class="d-flex flex-column gap-3">
  <article class="card">
    <div class="card-body">
      <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Cooling co-benefits of urban tree networks in compact European cities</a>
      <p class="small text-muted mb-0">
        <span>Karen De Pauw</span>,
        <span>Manuel Esperon‑Rodriguez</span>,
        <span>Stefan K. Arndt</span>,
        <span>+ 6 more</span>
      </p>
      <p class="small text-muted">Journal article · 2025</p>
      <div class="d-flex flex-wrap gap-1">
        <a href="#" class="badge text-bg-primary-light text-decoration-none">Green infrastructure <span class="visually-hidden">(shared keyword)</span></a>
        <a href="#" class="badge text-bg-secondary text-decoration-none">Trees</a>
      </div>
    </div>
  </article>
  <article class="card">
    <div class="card-body">
      <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Planning biodiversity corridors through urban green infrastructure</a>
      <p class="small text-muted mb-0">
        <span>Karen De Pauw</span>,
        <span>Manuel Esperon‑Rodriguez</span>,
        <span>Stefan K. Arndt</span>,
        <span>+ 6 more</span>
      </p>
      <p class="small text-muted">Journal article · 2024</p>
      <div class="d-flex flex-wrap gap-1">
        <a href="#" class="badge text-bg-secondary text-decoration-none">Biodiversity</a>
        <a href="#" class="badge text-bg-primary-light text-decoration-none">Urban climate <span class="visually-hidden">(shared keyword)</span></a>
      </div>
    </div>
  </article>
  <article class="card">
    <div class="card-body">
      <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Community-led climate adaptation in Flemish mid-sized cities</a>
      <p class="small text-muted mb-0">
        <span>Karen De Pauw</span>,
        <span>Manuel Esperon‑Rodriguez</span>,
        <span>Stefan K. Arndt</span>,
        <span>+ 6 more</span>
      </p>
      <p class="small text-muted">Book chapter · 2023</p>
      <div class="d-flex flex-wrap gap-1">
        <a href="#" class="badge text-bg-primary-light text-decoration-none">Resilience <span class="visually-hidden">(shared keyword)</span></a>
        <a href="#" class="badge text-bg-primary-light text-decoration-none">Ghent <span class="visually-hidden">(shared keyword)</span></a>
        <a href="#" class="badge text-bg-secondary text-decoration-none">Climate adaptation</a>
      </div>
    </div>
  </article>
  <!-- stub — intended target: works search pre-filtered on this work's keywords
       e.g. /works?keyword=Urban+climate&keyword=Resilience&keyword=Green+infrastructure&keyword=Ghent -->
  <a href="#" class="btn btn-ghost">
    <i class="if if-arrow-right" aria-hidden="true"></i>
    More related research, by keyword
  </a>
</div>`;
};
