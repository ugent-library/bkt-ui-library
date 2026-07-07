module.exports = function renderExpandedAuthors() {
  return `
    <a href="/templates/biblio-public/public-researcher-detail.html"><i class="if if-orcid" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="ORCID: 0000-0002-1234-5678" aria-hidden="true"></i><i class="if if-ghent-university" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="UGent ID: 802001234567" aria-hidden="true"></i>Karen De Pauw<span class="visually-hidden"> (ORCID 0000-0002-1234-5678, UGent ID 802001234567)</span></a>,
    <a href="/templates/biblio-public/public-researcher-detail.html"><i class="if if-orcid" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="ORCID: 0000-0001-8765-4321" aria-hidden="true"></i>Manuel Esperon‑Rodriguez<span class="visually-hidden"> (ORCID 0000-0001-8765-4321)</span></a>,
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
