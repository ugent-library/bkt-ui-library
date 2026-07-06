module.exports = function renderExpandedAuthors() {
  return `
    <a href="/templates/biblio-public/public-researcher-detail.html"><i class="if if-orcid" aria-hidden="true"></i><i class="if if-ghent-university" aria-hidden="true"></i>Karen De Pauw<span class="visually-hidden"> (ORCID, UGent)</span></a>,
    <a href="/templates/biblio-public/public-researcher-detail.html"><i class="if if-orcid" aria-hidden="true"></i>Manuel Esperon‑Rodriguez<span class="visually-hidden"> (ORCID)</span></a>,
    <a href="/templates/biblio-public/public-researcher-detail.html">Stefan K. Arndt</a>,
    <a href="/templates/biblio-public/public-researcher-detail.html">Sofie L. Curie</a>,
    <span>Anna Van den Berg</span>,
    <span>Bart Vandeurzen</span>,
    <span>Charlotte Van de Walle</span>,
    <span>Dries Vanput</span>,
    <span>Els Putzeys</span>,
    <span>Fien Pourry Montgomery</span>
    <span id="authors-loading" class="htmx-indicator">Loading&hellip;</span>
    <button type="button" class="btn btn-ghost btn-xs">
      Show less
    </button>
  `;
};
