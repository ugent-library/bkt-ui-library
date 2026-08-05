// Related research match cards (raven#125) — standard work-card grammar,
// keywords row below the reference line. Shared keywords are highlighted
// with a visually-hidden text equivalent (never colour alone).

function matchCard({ id, type, title, year, keywords }) {
  const kw = keywords
    .map(({ label, shared }) => shared
      ? `<a href="#" class="badge text-bg-primary-light text-decoration-none">${label} <span class="visually-hidden">(shared keyword)</span></a>`
      : `<a href="#" class="badge text-bg-secondary text-decoration-none">${label}</a>`)
    .join('\n        ');
  return `
  <li><article class="bt-work-card bt-work-card--border-bottom" aria-labelledby="${id}">
    <div class="card-header">
      <div class="bt-work-card__meta">
        <span class="bt-work-card__meta-item">${type}</span>
      </div>
    </div>
    <div class="card-body">
      <h3 id="${id}" class="bt-work-card__title"><a href="#">${title}</a></h3>
      <p class="bt-work-card__authors">
        <span class="bt-work-card__author"><a href="#">Karen De Pauw</a></span>,
        <span class="bt-work-card__author"><a href="#">Manuel Esperon&#8209;Rodriguez</a></span>,
        <span class="bt-work-card__author"><a href="#">Stefan K. Arndt</a></span>
        <span class="text-muted">+ 6 more</span>
      </p>
      <p class="bt-work-card__pub">(<a href="#"><time datetime="${year}">${year}</time></a>)</p>
      <div class="d-flex flex-wrap gap-1">
        ${kw}
      </div>
    </div>
  </article></li>`;
}

module.exports = function renderRelatedWorks() {
  return `
<ol class="list-unstyled mb-0">
${matchCard({
    id: 'related-work-01',
    type: 'Journal article',
    title: 'Cooling co-benefits of urban tree networks in compact European cities',
    year: 2025,
    keywords: [
      { label: 'Green infrastructure', shared: true },
      { label: 'Trees', shared: false }
    ]
  })}
${matchCard({
    id: 'related-work-02',
    type: 'Journal article',
    title: 'Planning biodiversity corridors through urban green infrastructure',
    year: 2024,
    keywords: [
      { label: 'Biodiversity', shared: false },
      { label: 'Urban climate', shared: true }
    ]
  })}
${matchCard({
    id: 'related-work-03',
    type: 'Book chapter',
    title: 'Community-led climate adaptation in Flemish mid-sized cities',
    year: 2023,
    keywords: [
      { label: 'Resilience', shared: true },
      { label: 'Ghent', shared: true },
      { label: 'Climate adaptation', shared: false }
    ]
  })}
</ol>
<!-- stub — intended target: works search pre-filtered on this work's keywords
     e.g. /works?keyword=Urban+climate&keyword=Resilience&keyword=Green+infrastructure&keyword=Ghent -->
<a href="#" class="btn btn-ghost">
  <i class="if if-arrow-right" aria-hidden="true"></i>
  More related research, by keyword
</a>`;
};
