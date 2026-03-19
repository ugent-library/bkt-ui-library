/**
 * people-search-stub.js
 * Prototype-only substitute for the /people/search HTMX endpoint.
 *
 * Include this AFTER people-search.js in prototype pages only.
 * It intercepts the search input event on any [data-people-search] widget
 * and populates the results from a local PEOPLE array, bypassing HTMX.
 *
 * Remove this file (or its <script> tag) when wiring up the real endpoint.
 * Nothing in people-search.js or the templates needs to change.
 */

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
    const meta = [
      p.affiliation && `<span class="people-result__meta-item">
                          <i class="if if-building if--xs" aria-hidden="true"></i>${p.affiliation}
                        </span>`,
      p.dept        && `<span class="people-result__meta-item">
                          <i class="if if-building if--xs" aria-hidden="true"></i>${p.dept}
                        </span>`,
      p.years       && `<span class="people-result__meta-item">${p.years}</span>`,
      p.orcid       && `<span class="people-result__meta-item">
                          <i class="if if-orcid if--xs" aria-hidden="true"></i>${p.orcid}
                        </span>`,
      p.ugentId     && `<span class="people-result__meta-item">${p.ugentId}</span>`,
    ].filter(Boolean).join('');

    return `<div class="people-result" role="option" tabindex="0"
      data-id="${p.id}"
      data-name="${p.name}"
      data-affiliation="${p.affiliation || ''}"
      aria-label="${p.name}${p.affiliation ? ', ' + p.affiliation : ''}">
      <span class="people-result__icon" aria-hidden="true">
        <i class="if if-user if--sm"></i>
      </span>
      <div>
        <div class="people-result__name">${highlight(p.name, q)}</div>
        ${meta ? `<div class="people-result__meta">${meta}</div>` : ''}
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

      results.innerHTML = matches.length
        ? matches.map(p => renderRow(p, q)).join('')
        : `<div class="p-3 text-muted small">No people found for "${input.value}"</div>`;

      results.hidden = false;

      if (hint) hint.textContent = matches.length
        ? `${matches.length} result${matches.length !== 1 ? 's' : ''}`
        : '';

      // Fire the same event HTMX would fire so people-search.js can react
      results.dispatchEvent(new Event('htmx:afterSwap', { bubbles: true }));
    }, 300);
  });

}());
