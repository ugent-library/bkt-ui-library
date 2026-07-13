module.exports = function renderSearchResultCards() {
  return `
<article class="bt-work-card bt-work-card--border-bottom" aria-labelledby="search-result-1">
  <div class="card-header">
    <div class="bt-meta-list pt-1">
      <span class="bt-meta-list__item-bordered">Journal article</span>
      <span class="badge text-bg-success">Open access</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <button type="button" class="btn btn-ghost btn-xs" aria-label="Cite: Urban forests as essential infrastructure">
        <i class="if if-double-quotes" aria-hidden="true"></i> Cite
      </button>
      <button type="button" class="btn btn-ghost btn-xs" aria-label="Save: Urban forests as essential infrastructure">
        <i class="if if-bookmark-line" aria-hidden="true"></i> Save
      </button>
      <a href="/templates/biblio-public/public-work-detail.html" class="btn btn-primary btn-xs">
        <i class="if if-book" aria-hidden="true"></i> View
      </a>
    </div>
  </div>
  <div class="card-body">
    <h3 id="search-result-1" class="bt-work-card__title">
      <a href="/templates/biblio-public/public-work-detail.html">Urban forests as essential infrastructure for climate resilience and biodiversity</a>
    </h3>
    <p class="bt-work-card__authors">Karen De Pauw, Manuel Esperon-Rodriguez, Stefan K. Arndt <span class="text-muted">et al.</span></p>
    <p class="bt-work-card__pub"><span>2026</span><span class="text-muted mx-1">·</span><a href="#">Plants People Planet</a></p>
  </div>
</article>
<article class="bt-work-card bt-work-card--border-bottom" aria-labelledby="search-result-2">
  <div class="card-header">
    <div class="bt-meta-list pt-1">
      <span class="bt-meta-list__item">Dataset</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <button type="button" class="btn btn-ghost btn-xs" aria-label="Cite: Urban tree canopy cover measurements Belgium 2020–2025">
        <i class="if if-double-quotes" aria-hidden="true"></i> Cite
      </button>
      <button type="button" class="btn btn-ghost btn-xs" aria-label="Save: Urban tree canopy cover measurements Belgium 2020–2025">
        <i class="if if-bookmark-line" aria-hidden="true"></i> Save
      </button>
      <a href="/templates/biblio-public/public-work-detail.html" class="btn btn-primary btn-xs" aria-label="View: Urban tree canopy cover measurements Belgium 2020–2025">
        <i class="if if-book" aria-hidden="true"></i> View
      </a>
    </div>
  </div>
  <div class="card-body">
    <h3 id="search-result-2" class="bt-work-card__title">
      <a href="/templates/biblio-public/public-work-detail.html">Urban tree canopy cover measurements Belgium 2020–2025</a>
    </h3>
    <p class="bt-work-card__authors">Karen De Pauw, Jonas Maes</p>
    <p class="bt-work-card__pub"><span>2026</span><span class="text-muted mx-1">·</span><a href="#">Zenodo</a></p>
  </div>
</article>`;
};
