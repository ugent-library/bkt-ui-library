/**
 * filter-stubs.js
 * Prototype stub data for filter fields that would use server autocomplete
 * in production. Intercepts the input event on filter editor text fields
 * and shows inline suggestions from local arrays.
 *
 * Fields covered:
 *   venue          — journals and conference series
 *   affiliation    — faculties and departments
 *   research_group — research groups
 *   project        — funded projects
 *   tags           — librarian tags
 *
 * How it works:
 *   filter-editor.js renders a plain <input id="text-val"> for text filter types.
 *   This stub listens for input events on that field (when the editor is open),
 *   renders a small suggestion list below it, and on click sets the input value.
 *   The user then presses Apply and gets a chip — same flow as typing manually.
 *
 * Remove this file when the real /suggest endpoints exist.
 */

(function () {
  'use strict';

  // ── Stub datasets ─────────────────────────────────────────────────────────

  const STUBS = {
    venue: [
      'Nature',
      'Nature Communications',
      'Science',
      'PLOS ONE',
      'Physical Review B',
      'Physical Review Letters',
      'Journal of Chemical Physics',
      'Laser & Photonics Reviews',
      'npj Quantum Information',
      'Advanced Materials',
      'Bioinformatics',
      'Nucleic Acids Research',
      'Journal of Ecology',
      'Urban Forestry & Urban Greening',
      'Plants People Planet',
      'Chemical Engineering Journal',
      'IEEE Transactions on Neural Networks',
      'Proceedings of the National Academy of Sciences',
      'Annual Review of Genetics',
      'International Conference on Machine Learning (ICML)',
      'NeurIPS',
      'ACM SIGCHI',
    ],
    affiliation: [
      'Faculty of Sciences',
      'Faculty of Engineering',
      'Faculty of Medicine and Health Sciences',
      'Faculty of Bioscience Engineering',
      'Faculty of Pharmaceutical Sciences',
      'Faculty of Arts and Philosophy',
      'Faculty of Law and Criminology',
      'Faculty of Economics and Business Administration',
      'Faculty of Social Sciences',
      'Faculty of Psychology and Educational Sciences',
      'Faculty of Veterinary Medicine',
      'Faculty of Architecture and Urban Planning',
      'Department of Physics and Astronomy',
      'Department of Biology',
      'Department of Chemistry',
      'Department of Applied Mathematics, Computer Science and Statistics',
      'Department of Information Technology',
      'Department of Civil Engineering',
      'Department of Environment',
      'Department of Food Technology, Safety and Health',
    ],
    research_group: [
      'Ghent University Centre for Local Politics',
      'Centre for Environmental Sciences',
      'BioMMedA — Biophysics and Biomedical Physics',
      'IDLab — Internet Technology and Data Science Lab',
      'IMEC — Ghent University',
      'VIB-UGent Center for Medical Biotechnology',
      'Ghent Institute for Functional and Metabolic Genomics',
      'Expertise Centre for Digital Media',
      'Research Group on Plant Biotechnology',
      'Centre for Sustainable Chemistry',
      'Language & Translation Technology Team',
      'Quantum Physics group',
      'Urban Ecology Research Group',
      'Centre for Research on Peace and Development',
    ],
    project: [
      'FWO G001234N — Urban green infrastructure and climate adaptation',
      'FWO G009823N — Quantum computing benchmarks for molecular systems',
      'FWO G012023N — AI-assisted genomics for rare disease diagnosis',
      'BOF 01D04124 — Tree species diversity and urban ecosystem services',
      'BOF 01F01223 — Variational quantum algorithms for optimisation',
      'Horizon 2020 101012345 — Sustainable biorefinery valorisation',
      'Horizon Europe 101057437 — Open science infrastructure for humanities',
      'ERC Starting Grant 950678 — Neural correlates of language acquisition',
      'ERC Advanced Grant 885672 — Long-range quantum entanglement',
      'FWO SBO S001323N — Digital heritage for Flemish manuscripts',
      'BELSPO BR/165/A1/BRAIN-be — Belgian Research Action through Interdisciplinary Networks',
    ],
    tags: [
      'needs-fulltext',
      'oa-pending',
      'embargo-check',
      'duplicate-candidate',
      'heritage-item',
      'retraction-watch',
      'datacite-pending',
      'reviewed',
      'priority',
      'wos-imported',
      'orcid-synced',
      'missing-doi',
      'preprint-version',
      'phd-thesis',
    ],
  };

  // ── Inject autocomplete on text-val input when a matching filter is open ──

  let currentSuggestList = null;

  function removeSuggestList() {
    if (currentSuggestList) {
      currentSuggestList.remove();
      currentSuggestList = null;
    }
  }

  document.addEventListener('input', e => {
    const input = e.target;
    if (input.id !== 'text-val') return;

    // Find which filter is currently open by reading the editor title
    const title = document.getElementById('filter-editor-title')?.textContent?.trim();
    const fieldMap = {
      'Journal / venue':         'venue',
      'Affiliation / faculty':   'affiliation',
      'Research group':          'research_group',
      'Project / funding':       'project',
      'Tags':                    'tags',
    };
    const field = fieldMap[title];
    if (!field) return;

    const q = input.value.trim().toLowerCase();
    removeSuggestList();
    if (q.length < 1) return;

    const matches = STUBS[field].filter(s => s.toLowerCase().includes(q)).slice(0, 6);
    if (!matches.length) return;

    const list = document.createElement('ul');
    list.className = 'list-unstyled border rounded bg-white shadow-sm mt-1 mb-0';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', `${title} suggestions`);
    list.style.cssText = 'position:absolute;z-index:1050;max-width:360px;';

    matches.forEach(match => {
      const li = document.createElement('li');
      const hl = match.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
      li.innerHTML = `<button type="button" class="dropdown-item py-2 px-3 small"
        style="white-space:normal;text-align:left">${hl}</button>`;
      li.querySelector('button').addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = match;
        removeSuggestList();
        input.focus();
      });
      list.appendChild(li);
    });

    input.insertAdjacentElement('afterend', list);
    currentSuggestList = list;
  });

  // Clean up when the editor closes or focus leaves
  document.addEventListener('click', e => {
    if (!e.target.closest('#filter-editor') && !e.target.closest('#add-filter-dropdown')) {
      removeSuggestList();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') removeSuggestList();
  });

}());
