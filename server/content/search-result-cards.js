// Public search-result cards — one card per raven work type (23).
// Actions: v1 per raven#141 — Cite + Add to list, no access CTA.
// Add to list picker: patterns/panel.html.
// Reference line: docs/wip/WORK-CARD-REFERENCE-STYLES.md, composed per work type.
// All names, titles, dates: placeholder data.

function card({ id, badges, title, authors, line }) {
  return `
  <li><article class="bt-work-card bt-work-card--border-bottom" aria-labelledby="${id}">
    <div class="card-header">
      <div class="bt-work-card__meta">
        ${badges}
      </div>
      <div class="bt-work-card__actions">
        <button type="button" class="btn btn-ghost btn-sm" aria-label="Cite: ${title}">
          <i class="if if-double-quotes" aria-hidden="true"></i> Cite
        </button>
        <div class="dropdown">
          <button type="button" class="btn btn-ghost btn-sm dropdown-toggle"
            data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"
            aria-label="Add to list: ${title}"
            hx-get="/lists/panel?work=${id}" hx-trigger="click once"
            hx-target="#atl-${id}-panel" hx-swap="innerHTML" hx-indicator="#atl-${id}-loading">
            <i class="if if-bookmark-line" aria-hidden="true"></i> Add to list
          </button>
          <div class="dropdown-menu dropdown-menu-end p-0 bt-panel bt-panel--wide" id="atl-${id}-panel" role="dialog" aria-label="Add to list">
            <p class="htmx-indicator p-3 mb-0 text-muted small" id="atl-${id}-loading" aria-live="polite">Loading your lists&hellip;</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <h2 id="${id}" class="bt-work-card__title">
        <a href="/templates/biblio-public/public-work-detail.html">${title}</a>
      </h2>
      <p class="bt-work-card__authors">${authors}</p>
      <p class="bt-work-card__pub">${line}</p>
    </div>
  </article></li>`;
}

const oa = '<span class="badge text-bg-success"><i class="if if-open-access" aria-hidden="true"></i> Open access</span>';
const embargo = '<span class="badge text-bg-secondary"><i class="if if-time" aria-hidden="true"></i> Embargo until 01/05/2027</span>';
const type = (label) => `<span class="bt-work-card__meta-item">${label}</span>`;
const restricted = '<span class="badge text-bg-secondary"><i class="if if-lock" aria-hidden="true"></i> Restricted access</span>';

const year = (y) => `(<a href="public-works.html?year=${y}"><time datetime="${y}">${y}</time></a>)`;
const researcher = '/templates/biblio-public/public-researcher-detail.html';

// Icons sit outside the <a>: hover underline covers the name only; icon
// spacing comes from .bt-work-card__author .if in SCSS.
function author(name, { ugent = false, orcid = '' } = {}) {
  let icons = '';
  if (ugent) icons += '<i class="if if-ghent-university" aria-hidden="true"></i>';
  if (orcid) icons += `<i class="if if-orcid" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="popover--sm popover--dark" data-bs-container="body" data-bs-content="ORCID: ${orcid}" aria-hidden="true"></i>`;
  const labels = [ugent && 'UGent', orcid && `ORCID ${orcid}`].filter(Boolean);
  const vh = labels.length ? `<span class="visually-hidden"> (${labels.join(', ')})</span>` : '';
  return `<span class="bt-work-card__author">${icons}<a href="${researcher}">${name}${vh}</a></span>`;
}

const dePauw = () => author('Karen De Pauw', { ugent: true, orcid: '0000-0002-1234-5678' });

module.exports = function renderSearchResultCards() {
  return `
<ol class="list-unstyled mb-0">
${card({
    id: 'card-feed-01',
    badges: oa + type('Journal article'),
    title: 'Urban forests as essential infrastructure for climate resilience and biodiversity',
    // 10 authors, then et al. — the public truncation rule
    authors: [
      dePauw(),
      author('Manuel Esperon-Rodriguez'),
      author('Stefan K. Arndt', { ugent: true }),
      author('Renée Prokopavicius'),
      author('Jonas Maes', { ugent: true }),
      author('Sally A. Power'),
      author('David S. Ellsworth'),
      author('Eline Lauwers', { ugent: true }),
      author('Camille Vervoort'),
      author('Mark G. Tjoelker')
    ].join(',\n        ') + ' <span class="text-muted">et al.</span>',
    line: `${year(2026)} <a href="public-works.html?issn=2572-2611"><cite>Plants People Planet</cite></a>, 8(1), pp. 14&ndash;19.`
  })}
${card({
    id: 'card-feed-02',
    badges: restricted + type('Book'),
    title: 'Urban forests: a field guide to the trees of Flemish cities',
    authors: dePauw(),
    line: `${year(2024)} 2nd edn. Ghent: Academia Press.`
  })}
${card({
    id: 'card-feed-03',
    badges: oa + type('Edited book'),
    title: 'Handbook of urban ecology',
    authors: [author('Stefan K. Arndt'), dePauw()].join(',\n        '),
    line: `${year(2024)} London: Routledge.`
  })}
${card({
    id: 'card-feed-04',
    badges: restricted + type('Book chapter'),
    title: 'Canopy cover in Flanders: patterns and policy',
    authors: [dePauw(), author('Jonas Maes')].join(', '),
    line: `${year(2024)} in <a href="public-works.html?isbn=978-0-415-88700-1"><cite>Handbook of urban ecology</cite></a>. London: Routledge, pp. 100&ndash;120.`
  })}
${card({
    id: 'card-feed-05',
    badges: oa + type('Book review'),
    title: 'Review of: Urban forests: a field guide to the trees of Flemish cities',
    authors: author('An Willems', { ugent: true }),
    line: `${year(2025)} <a href="public-works.html?issn=1365-2745"><cite>Journal of Ecology Reviews</cite></a>, 12(2), pp. 301&ndash;303.`
  })}
${card({
    id: 'card-feed-06',
    badges: type('Reference entry'),
    title: 'Photosynthesis',
    authors: author('Tom Green'),
    line: `${year(2023)} <cite>Encyclopedia of plant science</cite>. Amsterdam: Elsevier, pp. 455&ndash;460.`
  })}
${card({
    id: 'card-feed-07',
    badges: type('Journal issue'),
    title: 'Special issue: match-fixing and integrity in European football',
    authors: [
      author('Tom Vander Beken', { ugent: true, orcid: '0000-0003-2222-8888' }),
      author('An Vermeersch', { ugent: true })
    ].join(',\n        '),
    line: `${year(2024)} <a href="public-works.html?issn=0928-9569"><cite>European Journal of Crime, Criminal Law and Criminal Justice</cite></a>, 32(1).`
  })}
${card({
    id: 'card-feed-08',
    badges: oa + type('Conference paper'),
    title: 'Frequency-domain parameter tracking of single-actuated multi-body mechanisms',
    authors: [author('Foeke Vanbecelaere', { ugent: true }), author('Kurt Stockman')].join(', '),
    line: `${year(2024)} <cite>Proceedings of the 12th IFToMM World Congress</cite>. IFToMM World Congress, Tokyo, pp. 1&ndash;8.`
  })}
${card({
    id: 'card-feed-09',
    badges: type('Conference abstract'),
    title: 'Postural sway under dual-task conditions in older adults',
    authors: author('Els Vanderhaeghen', { ugent: true }),
    line: `${year(2024)} ISPGR World Congress, Brisbane.`
  })}
${card({
    id: 'card-feed-10',
    badges: oa + type('Conference poster'),
    title: 'High-resolution soil moisture mapping with distributed sensors',
    authors: author('Wouter Maes', { ugent: true }),
    line: `${year(2025)} EGU General Assembly, Vienna.`
  })}
${card({
    id: 'card-feed-11',
    badges: type('Conference presentation'),
    title: 'Linked data for library collections: five years of lessons',
    authors: author('Dries Moreels', { ugent: true }),
    line: `${year(2025)} DH Benelux, Leuven.`
  })}
${card({
    id: 'card-feed-12',
    badges: oa + type('Preprint'),
    title: 'Canopy microclimate buffering across European forests: a continental synthesis',
    authors: [dePauw(), author('Pieter Vangansbeke')].join(', '),
    line: `${year(2026)} bioRxiv [Preprint].`
  })}
${card({
    id: 'card-feed-13',
    badges: oa + type('Working paper'),
    title: 'The cost structure of diamond open access publishing in Flanders',
    authors: author('Evelien Smets', { ugent: true }),
    line: `${year(2025)} Ghent: Ghent University Faculty of Economics and Business Administration (FEB Working Paper Series).`
  })}
${card({
    id: 'card-feed-14',
    badges: oa + type('Report'),
    title: 'State of the urban forest in Flanders 2025',
    authors: [dePauw(), author('Lien Poelmans')].join(', '),
    line: `${year(2025)} Report RPT-42. Brussels: Agentschap Natuur en Bos.`
  })}
${card({
    id: 'card-feed-15',
    badges: embargo + type('Doctoral thesis'),
    title: 'Parameter tracking of single-actuated multi-body mechanisms using frequency-domain techniques',
    authors: author('Foeke Vanbecelaere', { ugent: true, orcid: '0000-0001-9876-5432' }),
    line: `${year(2024)} PhD thesis. Ghent University.`
  })}
${card({
    id: 'card-feed-16',
    badges: type('Magazine article'),
    title: 'De stad die zichzelf plant',
    authors: dePauw(),
    line: `${year(2025)} <cite>Eos Wetenschap</cite>, 14 June, pp. 22&ndash;27.`
  })}
${card({
    id: 'card-feed-17',
    badges: restricted + type('Newspaper article'),
    title: 'Universiteit plant stadsbos aan rand van Gent',
    authors: dePauw(),
    line: `${year(2025)} <cite>De Standaard</cite>, 2 March, p. 7.`
  })}
${card({
    id: 'card-feed-18',
    badges: oa + type('Online post'),
    title: 'Why repositories should love preprints',
    authors: author('Evelien Smets', { ugent: true }),
    line: `${year(2025)} <cite>Open Access Belgium</cite>, 1 September.`
  })}
${card({
    id: 'card-feed-19',
    badges: type('Media appearance'),
    title: 'Waarom de Boekentoren een schatkamer is',
    authors: author('Dries Moreels', { ugent: true }),
    line: `${year(2025)} <cite>Universiteit van Vlaanderen</cite>, 5 November.`
  })}
${card({
    id: 'card-feed-20',
    badges: type('Lecture'),
    title: 'Open science at scale: infrastructure for a university',
    authors: author('Evelien Smets', { ugent: true }),
    line: `${year(2025)} UGent Data Stewards seminar, Ghent, 20 October.`
  })}
${card({
    id: 'card-feed-21',
    badges: oa + type('Dataset'),
    title: 'Urban tree canopy cover measurements Belgium 2020–2025',
    authors: [dePauw(), author('Jonas Maes')].join(', '),
    line: `${year(2026)}`
  })}
${card({
    id: 'card-feed-22',
    badges: oa + type('Software'),
    title: 'canopyR: canopy cover estimation toolkit',
    authors: author('Jonas Maes', { ugent: true }),
    line: `${year(2026)}`
  })}
${card({
    id: 'card-feed-23',
    badges: type('Other'),
    title: 'Boekentoren restoration: photographic record 2012–2023',
    authors: author('Sylvia Van Peteghem', { ugent: true }),
    line: `${year(2024)}`
  })}
</ol>`;
};
