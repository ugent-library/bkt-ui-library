module.exports = function renderExpandedAuthors() {
  return `
    <a href="/templates/biblio-public/public-researcher-detail.html"><i class="if if-orcid" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="ORCID: 0000-0002-1234-5678" aria-hidden="true"></i><i class="if if-ghent-university" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="UGent ID: 802001234567" aria-hidden="true"></i>Karen De Pauw<span class="visually-hidden"> (ORCID 0000-0002-1234-5678, UGent ID 802001234567)</span></a>,
    <a href="/templates/biblio-public/public-researcher-detail.html"><i class="if if-orcid" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="ORCID: 0000-0001-8765-4321" aria-hidden="true"></i>Manuel Esperon‑Rodriguez<span class="visually-hidden"> (ORCID 0000-0001-8765-4321)</span></a>,
    <a href="/templates/biblio-public/public-works.html?q=Stefan%20K.%20Arndt">Stefan K. Arndt</a>,
    <a href="/templates/biblio-public/public-works.html?q=Sofie%20L.%20Curie">Sofie L. Curie</a>,
    <a href="/templates/biblio-public/public-works.html?q=Anna%20Van%20den%20Berg">Anna Van den Berg</a>,
    <a href="/templates/biblio-public/public-works.html?q=Bart%20Vandeurzen">Bart Vandeurzen</a>,
    <a href="/templates/biblio-public/public-works.html?q=Charlotte%20Van%20de%20Walle">Charlotte Van de Walle</a>,
    <a href="/templates/biblio-public/public-works.html?q=Dries%20Vanput">Dries Vanput</a>,
    <a href="/templates/biblio-public/public-works.html?q=Els%20Putzeys">Els Putzeys</a>,
    <a href="/templates/biblio-public/public-works.html?q=Fien%20Pourry%20Montgomery">Fien Pourry Montgomery</a>
    <span id="authors-loading" class="htmx-indicator">Loading&hellip;</span>
    <button type="button" class="btn btn-ghost btn-xs">
      Show less
    </button>
  `;
};
