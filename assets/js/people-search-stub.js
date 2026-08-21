/** Prototype people-search endpoint. Remove its script tag when the endpoint exists. */

(function () {
  'use strict';

  const PEOPLE = [
    // UGent staff
    { id: 'p1',    name: 'Marianne Testarosso', affiliation: 'Sciences',                  dept: 'TW09',  years: '2020–current', orcid: '0000-0001-6123-2992', ugentId: '000161232992' },
    { id: 'p2',    name: 'Pietro Testa',          affiliation: 'UGent Memorialis',          years: '1902–1910' },
    { id: 'p3',    name: 'Lea Testut',             affiliation: 'UGent Alumni',              years: '2020–2024', orcid: '0000-0002-6384-8725' },
    { id: 'p5',    name: 'Jan Kiewiet',            affiliation: 'Sciences',                  dept: 'FW12',  years: '2018–current', orcid: '0000-0003-1234-5678', ugentId: '000234561234' },
    { id: 'p6',    name: 'Sarah De Wolf',          affiliation: 'Engineering',               dept: 'ENG03', years: '2015–current', ugentId: '000112233445' },
    { id: 'p7',    name: 'Thomas Van Damme',       affiliation: 'Sciences',                  dept: 'FW12',  years: '2019–current', orcid: '0000-0001-9876-5432' },
    // Faculty of Performing Arts — Burlesque & Variety Studies
    { id: 'p-jd1', name: 'John Doe',              affiliation: 'Faculty of Performing Arts', dept: 'Burlesque & Variety Studies', years: '2019–current', orcid: '0000-0002-1234-5678', ugentId: '000198274651' },
    { id: 'p-jd2', name: 'Jane Doe',              affiliation: 'Faculty of Performing Arts', dept: 'Stagecraft & Neo-Burlesque',  years: '2021–current', orcid: '0000-0003-8765-4321' },
    // External
    { id: 'p-jb1', name: 'Josephine Baker',       affiliation: 'External', years: 'Folies Bergère, 1925–1956',          orcid: '0000-0001-9876-0001' },
    { id: 'p-gr1', name: 'Gypsy Rose Lee',         affiliation: 'External', years: "Minsky's Burlesque, 1929–1937" },
    { id: 'p-dv1', name: 'Dita Von Teese',         affiliation: 'External', years: 'Neo-Burlesque Revival, 1992–current', orcid: '0000-0004-5555-9999' },
  ];

  function highlight(name, q) {
    return name.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
  }

  function renderRow(p, q) {
    // Identifiers take the first line, so they sit in the same place on every row.
    const ids = [
      p.orcid       && `<span class="bt-meta-list__item">
                          <i class="if if-orcid if--xs" aria-hidden="true"></i>${p.orcid}
                        </span>`,
      p.ugentId     && `<span class="bt-meta-list__item">${p.ugentId}</span>`,
    ].filter(Boolean).join('');

    const meta = [
      p.affiliation && `<span class="bt-meta-list__item">
                          <i class="if if-building if--xs" aria-hidden="true"></i>${p.affiliation}
                        </span>`,
      p.dept        && `<span class="bt-meta-list__item">
                          <i class="if if-building if--xs" aria-hidden="true"></i>${p.dept}
                        </span>`,
      p.years       && `<span class="bt-meta-list__item">${p.years}</span>`,
    ].filter(Boolean).join('');

    return `<div class="bt-result" role="option" tabindex="0" data-ps-row
      data-id="${p.id}"
      data-name="${p.name}"
      data-affiliation="${p.affiliation || ''}"
      aria-label="${p.name}${p.affiliation ? ', ' + p.affiliation : ''}">
      <span class="bt-result__icon" aria-hidden="true">
        <i class="if if-user if--sm"></i>
      </span>
      <div>
        <div class="bt-result__name">${highlight(p.name, q)}</div>
        ${ids ? `<div class="bt-meta-list bt-meta-list--xs">${ids}</div>` : ''}
        ${meta ? `<div class="bt-meta-list bt-meta-list--xs">${meta}</div>` : ''}
      </div>
    </div>`;
  }

  let timer;

  document.addEventListener('input', e => {
    const input = e.target;
    const container = input.closest('[data-people-search]');
    if (!container || !input.matches('[data-ps-input]')) return;

    const results = container.querySelector('[data-ps-results]');
    const hint    = container.querySelector('[data-ps-hint]');
    if (!results) return;

    clearTimeout(timer);
    const q = input.value.trim().toLowerCase();

    if (q.length < 2) {
      results.innerHTML = '';
      results.hidden = true;
      if (hint) hint.textContent = 'Type a name to search across UGent people and external authors.';
      return;
    }

    if (hint) hint.textContent = 'Searching…';

    timer = setTimeout(() => {
      const matches = PEOPLE.filter(p =>
        p.name.toLowerCase().includes(q) || (p.orcid && p.orcid.includes(q))
      );

      results.innerHTML = matches.map(p => renderRow(p, q)).join('');

      // Fire the event HTMX would fire (detail.target like real HTMX) —
      // people-search.js's afterSwap handler owns visibility and the hint.
      results.dispatchEvent(new CustomEvent('htmx:afterSwap', {
        bubbles: true,
        detail: { target: results }
      }));
    }, 300);
  });

}());
