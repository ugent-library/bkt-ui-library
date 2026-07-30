module.exports = function renderSearchResultCards() {
  return `
<ol class="list-unstyled mb-0">
  <li><article class="bt-work-card bt-work-card--border-bottom" aria-labelledby="search-result-1">
    <div class="card-header">
      <div class="bt-meta-list pt-1">
        <span class="badge text-bg-success">Open access</span>
        <span class="bt-meta-list__item-bordered">Journal article</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-ghost btn-sm" aria-label="Cite: Urban forests as essential infrastructure for climate resilience and biodiversity">
          <i class="if if-double-quotes" aria-hidden="true"></i> Cite
        </button>
        <button type="button" class="btn btn-ghost btn-sm" aria-label="Add to list: Urban forests as essential infrastructure for climate resilience and biodiversity">
          <i class="if if-bookmark-line" aria-hidden="true"></i> Add to list
        </button>
        <a href="#" download class="btn btn-primary btn-sm" aria-label="Download: Urban forests as essential infrastructure for climate resilience and biodiversity">
          <i class="if if-download" aria-hidden="true"></i> Download
        </a>
      </div>
    </div>
    <div class="card-body">
      <h2 id="search-result-1" class="bt-work-card__title">
        <a href="/templates/biblio-public/public-work-detail.html">Urban forests as essential infrastructure for climate resilience and biodiversity</a>
      </h2>
      <p class="bt-work-card__authors">Karen De Pauw, Manuel Esperon-Rodriguez, Stefan K. Arndt <span class="text-muted">et al.</span></p>
      <p class="bt-work-card__pub"><time datetime="2026">2026</time><span class="text-muted mx-1" aria-hidden="true">·</span><a href="#">Plants People Planet</a></p>
    </div>
  </article></li>
  <li><article class="bt-work-card bt-work-card--border-bottom" aria-labelledby="search-result-2">
    <div class="card-header">
      <div class="bt-meta-list pt-1">
        <span class="badge text-bg-success">Open access</span>
        <span class="bt-meta-list__item-bordered">Dataset</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-ghost btn-sm" aria-label="Cite: Urban tree canopy cover measurements Belgium 2020–2025">
          <i class="if if-double-quotes" aria-hidden="true"></i> Cite
        </button>
        <button type="button" class="btn btn-ghost btn-sm" aria-label="Add to list: Urban tree canopy cover measurements Belgium 2020–2025">
          <i class="if if-bookmark-line" aria-hidden="true"></i> Add to list
        </button>
        <a href="#" class="btn btn-primary btn-sm" aria-label="Access dataset at Zenodo: Urban tree canopy cover measurements Belgium 2020–2025">
          <i class="if if-external-link" aria-hidden="true"></i> Access at Zenodo
        </a>
      </div>
    </div>
    <div class="card-body">
      <h2 id="search-result-2" class="bt-work-card__title">
        <a href="/templates/biblio-public/public-work-detail.html">Urban tree canopy cover measurements Belgium 2020–2025</a>
      </h2>
      <p class="bt-work-card__authors">Karen De Pauw, Jonas Maes</p>
      <p class="bt-work-card__pub"><time datetime="2026">2026</time><span class="text-muted mx-1" aria-hidden="true">·</span><a href="#">Zenodo</a></p>
    </div>
  </article></li>
</ol>`;
};
