// Cards mirror the public-researchers.html examples (identifiers, activity
// counts, research-topic badges) but omit the affiliations/organisations
// block — the organisation is implied by this page. Card names are <h3>
// because they sit under the letter-group <h2>; see AGENT.md rule A1.
module.exports = function renderPeopleList() {
  return `
<div class="mb-4">
  <h2 class="h6 text-uppercase text-muted border-bottom pb-2 mb-3">D</h2>
  <ol class="list-unstyled mb-0">

    <li>
      <article class="card mb-3" aria-labelledby="person-kd">
        <div class="card-body p-4">
          <h3 class="h5 mb-1">
            <a href="/persons/01K9XTVXD41Z" id="person-kd" class="text-decoration-none">De Pauw, Karen</a>
          </h3>

          <ul class="list-unstyled d-flex flex-wrap gap-3 mb-4 small" aria-label="Identifiers for Karen De Pauw">
            <li>
              <i class="if if-ghent-university"></i>
              <span>802001234567</span>
            </li>
            <li>
              <a href="https://orcid.org/0000-0002-1234-5678"
                class="d-inline-flex align-items-center gap-1 text-decoration-none"
                rel="noopener noreferrer" target="_blank" aria-label="ORCID: 0000-0002-1234-5678">
                <i class="if if-orcid" aria-hidden="true"></i>
                <span>0000-0002-1234-5678</span>
              </a>
            </li>
          </ul>

          <ul class="list-unstyled d-flex gap-4 mb-3" aria-label="Activity for Karen De Pauw">
            <li>
              <span class="fw-bold">147</span>
              <span class="text-muted">research output</span>
            </li>
            <li>
              <span class="fw-bold">4</span>
              <span class="text-muted">projects</span>
            </li>
          </ul>

          <div class="d-flex flex-wrap gap-1" aria-label="Research topics">
            <a href="/search?q=urban+forests" class="badge bg-primary text-decoration-none">Urban forests</a>
            <a href="/search?q=climate+resilience" class="badge bg-primary text-decoration-none">Climate resilience</a>
            <a href="/search?q=green+infrastructure" class="badge bg-primary text-decoration-none">Green infrastructure</a>
            <a href="/search?q=biodiversity" class="badge bg-primary text-decoration-none">Biodiversity</a>
          </div>
        </div>
      </article>
    </li>

    <li>
      <article class="card mb-3" aria-labelledby="person-ld">
        <div class="card-body p-4">
          <h3 class="h5 mb-1">
            <a href="/persons/01K9XTVXD42A" id="person-ld" class="text-decoration-none">Desmet, Lore</a>
          </h3>

          <ul class="list-unstyled d-flex flex-wrap gap-3 mb-4 small" aria-label="Identifiers for Lore Desmet">
            <li>
              <i class="if if-ghent-university"></i>
              <span>002101887766</span>
            </li>
            <li>
              <a href="https://orcid.org/0000-0001-5566-7788"
                class="d-inline-flex align-items-center gap-1 text-decoration-none"
                rel="noopener noreferrer" target="_blank" aria-label="ORCID: 0000-0001-5566-7788">
                <i class="if if-orcid" aria-hidden="true"></i>
                <span>0000-0001-5566-7788</span>
              </a>
            </li>
          </ul>

          <ul class="list-unstyled d-flex gap-4 mb-3" aria-label="Activity for Lore Desmet">
            <li>
              <span class="fw-bold">12</span>
              <span class="text-muted">research output</span>
            </li>
            <li>
              <span class="fw-bold">2</span>
              <span class="text-muted">projects</span>
            </li>
          </ul>

          <div class="d-flex flex-wrap gap-1" aria-label="Research topics">
            <a href="/search?q=food+technology" class="badge bg-primary text-decoration-none">Food technology</a>
            <a href="/search?q=fermentation" class="badge bg-primary text-decoration-none">Fermentation</a>
          </div>
        </div>
      </article>
    </li>

  </ol>
</div>
<div class="mb-4">
  <h2 class="h6 text-uppercase text-muted border-bottom pb-2 mb-3">R</h2>
  <ol class="list-unstyled mb-0">

    <li>
      <article class="card mb-3" aria-labelledby="person-kr">
        <div class="card-body p-4">
          <h3 class="h5 mb-1">
            <a href="/persons/01K9XTVXD43B" id="person-kr" class="text-decoration-none">Raes, Katleen</a>
          </h3>

          <ul class="list-unstyled d-flex flex-wrap gap-3 mb-4 small" aria-label="Identifiers for Katleen Raes">
            <li>
              <i class="if if-ghent-university"></i>
              <span>801998123456</span>
            </li>
            <li>
              <a href="https://orcid.org/0000-0002-9988-7766"
                class="d-inline-flex align-items-center gap-1 text-decoration-none"
                rel="noopener noreferrer" target="_blank" aria-label="ORCID: 0000-0002-9988-7766">
                <i class="if if-orcid" aria-hidden="true"></i>
                <span>0000-0002-9988-7766</span>
              </a>
            </li>
          </ul>

          <ul class="list-unstyled d-flex gap-4 mb-3" aria-label="Activity for Katleen Raes">
            <li>
              <span class="fw-bold">96</span>
              <span class="text-muted">research output</span>
            </li>
            <li>
              <span class="fw-bold">7</span>
              <span class="text-muted">projects</span>
            </li>
          </ul>

          <div class="d-flex flex-wrap gap-1" aria-label="Research topics">
            <a href="/search?q=food+chemistry" class="badge bg-primary text-decoration-none">Food chemistry</a>
            <a href="/search?q=antioxidants" class="badge bg-primary text-decoration-none">Antioxidants</a>
            <a href="/search?q=lipid+oxidation" class="badge bg-primary text-decoration-none">Lipid oxidation</a>
          </div>
        </div>
      </article>
    </li>

  </ol>
</div>`;
};
