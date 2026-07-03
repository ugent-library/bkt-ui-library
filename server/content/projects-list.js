// Project cards carry the field set documented in public-projects.html:
// title, description, period, "Read more on GISMO" link, Project ID,
// IWETO ID, GISMO ID, other IDs (none for these examples), and a link to
// the project detail page. Kept identical to the static fallback in
// public-organisation-detail.html so the card is the same before/after swap.
// PLACEHOLDER: GISMO IDs and the gismo.ugent.be URLs are invented — not
// sourced from the directory. Project 1's description is taken from
// public-project-detail.html; project 2's description is a placeholder.
module.exports = function renderProjectsList() {
  return `
<ul class="list-unstyled d-flex flex-column gap-3">
  <li class="card">
    <div class="card-body">
      <div class="d-flex align-items-start gap-3 mb-2">
        <a href="/projects/fwo-g001234n" class="flex-grow-1 fw-semibold text-decoration-none">Urban green infrastructure and climate adaptation in Flemish cities</a>
        <span class="badge text-bg-success flex-shrink-0">Active</span>
      </div>
      <p class="mb-3">Urban trees and green spaces are increasingly recognised as essential infrastructure for adapting cities to climate change. This project investigates how green infrastructure can be planned and managed to maximise climate adaptation benefits across Flemish cities.</p>
      <ul class="list-unstyled d-flex flex-wrap gap-3 mb-3 small text-muted" aria-label="Project metadata">
        <li>Period <time datetime="2023-01-01">2023</time>–<time datetime="2027-12-31">2027</time></li>
        <li>Project ID <code>G001234N</code></li>
        <li>IWETO ID <code>G001234N</code></li>
        <li>GISMO ID <code>000123456</code></li>
      </ul>
      <div class="d-flex flex-wrap gap-3 small">
        <a href="https://gismo.ugent.be/project/fwo-g001234n" rel="noopener noreferrer" class="text-decoration-none">Read more on GISMO <i class="if if-external-link if--xs" aria-hidden="true"></i></a>
      </div>
    </div>
  </li>
  <li class="card">
    <div class="card-body">
      <div class="d-flex align-items-start gap-3 mb-2">
        <a href="/projects/h2020-101012345" class="flex-grow-1 fw-semibold text-decoration-none">Sustainable biorefinery valorisation of agricultural side streams</a>
        <span class="badge text-bg-secondary flex-shrink-0">Ended</span>
      </div>
      <p class="mb-3">Agricultural processing generates large volumes of side streams that remain underused. This project develops biorefinery routes to valorise these streams into food ingredients, biomaterials and energy carriers.</p>
      <ul class="list-unstyled d-flex flex-wrap gap-3 mb-3 small text-muted" aria-label="Project metadata">
        <li>Period <time datetime="2021-01-01">2021</time>–<time datetime="2025-12-31">2025</time></li>
        <li>Project ID <code>101012345</code></li>
        <li>IWETO ID <code>101012345</code></li>
        <li>GISMO ID <code>000654321</code></li>
      </ul>
      <div class="d-flex flex-wrap gap-3 small">
        <a href="https://gismo.ugent.be/project/h2020-101012345" rel="noopener noreferrer" class="text-decoration-none">Read more on GISMO <i class="if if-external-link if--xs" aria-hidden="true"></i></a>
      </div>
    </div>
  </li>
</ul>`;
};
