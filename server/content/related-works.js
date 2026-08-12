// Related research match cards (#125) — standard work-card grammar,
// keywords row below the reference line. Shared keywords are highlighted
// with a visually-hidden text equivalent (never colour alone).

// Container link: a string search on the title, as live biblio runs it (09).
const container = (title) =>
  `<a href="/templates/biblio-public/public-works.html?container=${encodeURIComponent(title)}"><cite>${title}</cite></a>`;

function matchCard({ id, type, title, year, line, keywords }) {
  const kw = keywords
    .map(({ label, shared }) => shared
      ? `<a href="#" class="badge text-bg-primary-light text-decoration-none">${label} <span class="visually-hidden">(shared keyword)</span></a>`
      : `<a href="#" class="badge text-bg-secondary text-decoration-none">${label}</a>`)
    .join('\n        ');
  return `
  <li><article class="bt-work-card" aria-labelledby="${id}">
    <div class="bt-work-card__header">
      <div class="bt-work-card__meta">
        <span class="bt-work-card__meta-item">${type}</span>
      </div>
    </div>
    <div class="bt-work-card__body">
      <h3 id="${id}" class="bt-work-card__title"><a href="/templates/biblio-public/public-work-detail.html">${title}</a></h3>
      <p class="bt-work-card__authors">
        <span class="bt-work-card__author"><i class="if if-ghent-university" aria-hidden="true"></i><a href="#">Karen De Pauw<span class="visually-hidden"> (UGent)</span></a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=Manuel%20Esperon-Rodriguez">Manuel Esperon&#8209;Rodriguez</a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=Stefan%20K.%20Arndt">Stefan K. Arndt</a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=Ren%C3%A9e%20Prokopavicius">Renée Prokopavicius</a></span>,
        <span class="bt-work-card__author"><i class="if if-ghent-university" aria-hidden="true"></i><a href="#">Jonas Maes<span class="visually-hidden"> (UGent)</span></a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=Sally%20A.%20Power">Sally A. Power</a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=David%20S.%20Ellsworth">David S. Ellsworth</a></span>,
        <span class="bt-work-card__author"><i class="if if-ghent-university" aria-hidden="true"></i><a href="#">Eline Lauwers<span class="visually-hidden"> (UGent)</span></a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=Camille%20Vervoort">Camille Vervoort</a></span>,
        <span class="bt-work-card__author"><a href="/templates/biblio-public/public-works.html?q=Mark%20G.%20Tjoelker">Mark G. Tjoelker</a></span>
        <span class="text-muted">et al. +6 more authors</span>
      </p>
      <p class="bt-work-card__pub">(<a href="/templates/biblio-public/public-works.html?year=${year}"><time datetime="${year}">${year}</time></a>) ${line}</p>
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
    line: `${container('Landscape and Urban Planning')}, 240, 104912.`,
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
    line: `${container('Urban Ecosystems')}, 27(3), pp. 455&ndash;470.`,
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
    line: `in ${container('Handbook of urban ecology')}. London: Routledge, pp. 210&ndash;228.`,
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
