/**
 * filter-bar.js — generic chip + editor filter bar (the filter picker pattern,
 * patterns/filter-picker.html). One engine, one config per bar; it self-discovers
 * which bars are on the page by their id prefix and wires each independently.
 *
 * Bars: works (wf-), researchers (rdir-), projects (pdir-).
 * Prototype-only: chips are client-side and do not refilter the list yet.
 * Organisation (tree search), project, and keyword filters are backend-dependent;
 * the journal is reached through the Identifier filter (ISSN), not a venue search.
 */

(function () {
  'use strict';

  // Stub option lists — real values come from raven; these let the search +
  // multi-select be prototyped.
  const ORG = [
    { value: 'ugent', label: 'Ghent University' },
    { value: 'fac-ea', label: 'Faculty of Engineering and Architecture' },
    { value: 'fac-bw', label: 'Faculty of Bioscience Engineering' },
    { value: 'fac-we', label: 'Faculty of Sciences' },
    { value: 'fac-la', label: 'Faculty of Arts and Philosophy' },
    { value: 'fac-re', label: 'Faculty of Law and Criminology' },
    { value: 'fac-ge', label: 'Faculty of Medicine and Health Sciences' },
    { value: 'fac-pp', label: 'Faculty of Psychology and Educational Sciences' },
    { value: 'fac-eb', label: 'Faculty of Economics and Business Administration' },
    { value: 'fac-di', label: 'Faculty of Veterinary Medicine' },
    { value: 'fac-fw', label: 'Faculty of Pharmaceutical Sciences' },
    { value: 'fac-ps', label: 'Faculty of Political and Social Sciences' },
    { value: 'dept-we02', label: 'Dept of Physics and Astronomy — WE' },
    { value: 'dept-we10', label: 'Dept of Applied Maths, CS & Statistics — WE' },
    { value: 'dept-ea18', label: 'Dept of Electronics and Information Systems — EA' },
    { value: 'dept-ge33', label: 'Dept of Human Structure and Repair — GE' },
    { value: 'dept-lw06', label: 'Dept of Linguistics — LW' },
    { value: 'rg-idlab', label: 'IDLab (research group) — EA' },
    { value: 'rg-cmgg', label: 'Center for Medical Genetics — GE' },
    { value: 'rg-synbioc', label: 'SynBioC (research group) — BW' },
  ];
  const AUTHORS = [
    { value: 'jane-doe', label: 'Jane Doe' },
    { value: 'pieter-de-vries', label: 'Pieter De Vries' },
    { value: 'sofia-rossi', label: 'Sofia Rossi' },
    { value: 'kwame-mensah', label: 'Kwame Mensah' },
    { value: 'yuki-tanaka', label: 'Yuki Tanaka' },
    { value: 'anna-nowak', label: 'Anna Nowak' },
    { value: 'lucas-martin', label: 'Lucas Martin' },
    { value: 'fatima-el-amrani', label: 'Fatima El Amrani' },
    { value: 'david-cohen', label: 'David Cohen' },
    { value: 'mei-chen', label: 'Mei Chen' },
    { value: 'omar-haddad', label: 'Omar Haddad' },
    { value: 'elena-petrova', label: 'Elena Petrova' },
  ];
  const PROJECTS = [
    { value: 'fwo-g012', label: 'FWO G0.12N' },
    { value: 'horizon-openair', label: 'Horizon Europe — OpenAIR' },
    { value: 'bof-starting', label: 'BOF Starting Grant' },
    { value: 'era-net', label: 'ERA-NET Cofund' },
    { value: 'vlaio-tetra', label: 'VLAIO TETRA' },
    { value: 'iof-valorisation', label: 'IOF Valorisation' },
    { value: 'fwo-sb', label: 'FWO SB PhD' },
    { value: 'ugent-goa', label: 'UGent GOA' },
    { value: 'marie-curie', label: 'Marie Skłodowska-Curie' },
  ];
  const KEYWORDS = [
    { value: 'climate-change', label: 'Climate change' },
    { value: 'machine-learning', label: 'Machine learning' },
    { value: 'open-access', label: 'Open access' },
    { value: 'crispr', label: 'CRISPR' },
    { value: 'microbiome', label: 'Microbiome' },
    { value: 'quantum-computing', label: 'Quantum computing' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'neural-networks', label: 'Neural networks' },
    { value: 'biodiversity', label: 'Biodiversity' },
    { value: 'public-health', label: 'Public health' },
    { value: 'materials-science', label: 'Materials science' },
    { value: 'linguistics', label: 'Linguistics' },
  ];

  // One config per bar, keyed by the id prefix used in its markup.
  const CONFIGS = {
    'wf-': {
      author:       { label: 'Author', type: 'checklist', values: AUTHORS },
      organisation: { label: 'Organisation', type: 'checklist', values: ORG },
      project:      { label: 'Project', type: 'checklist', values: PROJECTS },
      keywords:    { label: 'Keywords / subject', type: 'checklist', values: KEYWORDS },
      identifier:  { label: 'Identifier', type: 'text', placeholder: 'DOI, ISSN, ISBN, arXiv, or handle…' },
    },
    'rdir-': {
      organisation: { label: 'Organisation', type: 'checklist', values: ORG },
      status:       { label: 'Current or alumni', type: 'boolean', yesLabel: 'Current members', noLabel: 'Alumni' },
    },
    'pdir-': {
      organisation: { label: 'Organisation', type: 'checklist', values: ORG },
      status:       { label: 'Status', type: 'boolean', yesLabel: 'Active', noLabel: 'Completed' },
      year:         { label: 'Year', type: 'year-range' },
    },
  };

  // Filters pre-applied on load, so a bar can show chips from the start.
  const INITIAL = {
    'wf-': {
      author:   { label: 'Author', displayValue: 'Jane Doe', rawValue: ['jane-doe'] },
      keywords: { label: 'Keywords / subject', displayValue: 'Climate change', rawValue: ['climate-change'] },
    },
  };

  Object.keys(CONFIGS).forEach(prefix => initBar(prefix, CONFIGS[prefix], INITIAL[prefix]));

  function initBar(prefix, FILTERS, initial) {
    const activeChips  = document.getElementById(prefix + 'active-chips');
    const filterEditor = document.getElementById(prefix + 'filter-editor');
    const clearAllBtn  = document.getElementById(prefix + 'clear-all');
    if (!activeChips || !filterEditor || !clearAllBtn) return;   // bar not on this page

    const pickerSel = `#${prefix}filter-picker-list button[data-filter]`;
    const addFilterDropdown = document.getElementById(prefix + 'add-filter-dropdown');
    let activeFilters = initial ? JSON.parse(JSON.stringify(initial)) : {};
    let editingFilter = null;

    document.querySelectorAll(pickerSel).forEach(btn => {
      btn.addEventListener('click', () => {
        hideDropdown();
        openEditor(btn.dataset.filter, activeFilters[btn.dataset.filter] || null, addFilterDropdown);
      });
    });

    clearAllBtn.addEventListener('click', () => { activeFilters = {}; renderChips(); closeEditor(); });

    document.getElementById(prefix + 'add-filter-btn')?.addEventListener('click', closeEditor);

    document.addEventListener('click', e => {
      if (!filterEditor.hidden &&
          !filterEditor.contains(e.target) &&
          !e.target.closest('[data-filter-id]') &&
          !e.target.closest('[data-filter]') &&
          !e.target.closest('#' + prefix + 'add-filter-dropdown')) {
        closeEditor();
      }
    });

    renderChips();   // paint any pre-applied (initial) filters

    function openEditor(filterId, existing, anchorEl) {
      const def = FILTERS[filterId];
      if (!def) return;
      editingFilter = filterId;
      filterEditor.hidden = false;
      filterEditor.innerHTML = renderEditor(def, existing);
      positionEditor(anchorEl);
      filterEditor.querySelector('input')?.focus();
      attachEditorEvents(filterId, def);
      renderChips();
    }

    // Drop the panel under whatever opened it (Add-filter button or the chip).
    function positionEditor(anchorEl) {
      const parent = filterEditor.offsetParent;
      if (!anchorEl || !parent) return;
      const left = anchorEl.getBoundingClientRect().left - parent.getBoundingClientRect().left;
      const maxLeft = Math.max(0, parent.clientWidth - filterEditor.offsetWidth);
      filterEditor.style.left = Math.min(Math.max(0, left), maxLeft) + 'px';
    }

    function renderEditor(def, existing) {
      const title = `<p class="bt-panel__title" id="${prefix}filter-editor-title">${def.label}</p>`;
      let body = '';

      if (def.type === 'checklist') {
        const checked = existing?.rawValue || [];
        const search = def.values.length > 8
          ? `<div class="bt-panel__body">
              <label class="visually-hidden" for="${prefix}fv-search">Search ${def.label}</label>
              <input type="search" class="form-control form-control-sm" id="${prefix}fv-search"
                data-checklist-search placeholder="Search ${def.label.toLowerCase()}…" autocomplete="off">
            </div>`
          : '';
        body = search + `<div class="bt-panel__body bt-panel__body--checklist" role="group" aria-label="Select ${def.label}">` +
          def.values.map(v => `
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="${prefix}fv-${v.value}" name="${prefix}fv" value="${v.value}" ${checked.includes(v.value) ? 'checked' : ''}>
              <label class="form-check-label" for="${prefix}fv-${v.value}">${v.label}</label>
            </div>`).join('') + `</div>`;
      } else if (def.type === 'boolean') {
        const cur = existing?.rawValue;
        body = `<div class="bt-panel__body bt-panel__body--boolean" role="group" aria-label="${def.label}">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${prefix}bool" id="${prefix}bool-true" value="true" ${cur === 'true' ? 'checked' : ''}>
            <label class="form-check-label" for="${prefix}bool-true">${def.yesLabel}</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${prefix}bool" id="${prefix}bool-false" value="false" ${cur === 'false' ? 'checked' : ''}>
            <label class="form-check-label" for="${prefix}bool-false">${def.noLabel}</label>
          </div>
        </div>`;
      } else if (def.type === 'year-range') {
        const from = existing?.rawValue?.from || '';
        const to   = existing?.rawValue?.to   || '';
        body = `<div class="bt-panel__body bt-panel__body--year">
          <label for="${prefix}year-from" class="visually-hidden">From year</label>
          <input type="number" id="${prefix}year-from" class="form-control bt-panel__year-input" placeholder="From" min="1900" max="2100" value="${from}">
          <span class="text-muted small">to</span>
          <label for="${prefix}year-to" class="visually-hidden">To year</label>
          <input type="number" id="${prefix}year-to" class="form-control bt-panel__year-input" placeholder="To" min="1900" max="2100" value="${to}">
        </div>`;
      } else if (def.type === 'text') {
        const val = existing?.rawValue || '';
        body = `<div class="bt-panel__body">
          <label for="${prefix}text-val" class="visually-hidden">${def.label}</label>
          <input type="text" id="${prefix}text-val" class="form-control form-control-sm" placeholder="${def.placeholder || ''}" value="${val}" autocomplete="off">
        </div>`;
      }

      const removeBtn = activeFilters[editingFilter]
        ? `<button type="button" class="btn btn-ghost btn-sm text-danger ms-auto" id="${prefix}editor-remove">Remove filter</button>`
        : '';

      return title + body + `<div class="bt-panel__actions">
        <button type="button" class="btn btn-primary btn-sm" id="${prefix}editor-apply">Apply</button>
        <button type="button" class="btn btn-ghost btn-sm" id="${prefix}editor-cancel">Cancel</button>
        ${removeBtn}
      </div>`;
    }

    function attachEditorEvents(filterId, def) {
      document.getElementById(prefix + 'editor-apply')?.addEventListener('click', () => applyEditor(filterId, def));
      document.getElementById(prefix + 'editor-cancel')?.addEventListener('click', closeEditor);
      document.getElementById(prefix + 'editor-remove')?.addEventListener('click', () => { removeFilter(filterId); closeEditor(); });
      filterEditor.addEventListener('keydown', e => { if (e.key === 'Escape') closeEditor(); });

      const searchInput = filterEditor.querySelector('[data-checklist-search]');
      searchInput?.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        filterEditor.querySelectorAll('.bt-panel__body--checklist .form-check').forEach(row => {
          row.hidden = q !== '' && !row.querySelector('label').textContent.toLowerCase().includes(q);
        });
      });
    }

    function applyEditor(filterId, def) {
      let displayValue, rawValue;

      if (def.type === 'checklist') {
        const checked = [...filterEditor.querySelectorAll(`input[name="${prefix}fv"]:checked`)]
          .map(cb => ({ value: cb.value, label: filterEditor.querySelector(`label[for="${prefix}fv-${cb.value}"]`).textContent.trim() }));
        if (!checked.length) { closeEditor(); return; }
        rawValue = checked.map(c => c.value);
        displayValue = checked.length === 1 ? checked[0].label : `${checked[0].label} +${checked.length - 1}`;
      } else if (def.type === 'boolean') {
        const sel = filterEditor.querySelector(`input[name="${prefix}bool"]:checked`);
        if (!sel) { closeEditor(); return; }
        rawValue = sel.value;
        displayValue = sel.value === 'true' ? def.yesLabel : def.noLabel;
      } else if (def.type === 'year-range') {
        const from = document.getElementById(prefix + 'year-from')?.value;
        const to   = document.getElementById(prefix + 'year-to')?.value;
        if (!from && !to) { closeEditor(); return; }
        rawValue = { from, to };
        displayValue = from && to ? `${from}–${to}` : from ? `from ${from}` : `to ${to}`;
      } else if (def.type === 'text') {
        const val = (document.getElementById(prefix + 'text-val')?.value || '').trim();
        if (!val) { closeEditor(); return; }
        rawValue = val;
        displayValue = val;
      }

      activeFilters[filterId] = { label: def.label, displayValue, rawValue };
      renderChips();
      closeEditor();
    }

    function removeFilter(filterId) { delete activeFilters[filterId]; renderChips(); }

    function renderChips() {
      activeChips.innerHTML = Object.entries(activeFilters).map(([id, f]) => {
        const editing = editingFilter === id;
        const cls = editing ? 'badge badge--outline active' : 'badge badge--outline';
        return `
        <div class="filter-chip-group">
          <button type="button" class="${cls}"${editing ? ' aria-current="true"' : ''}
            aria-label="Edit filter: ${f.label} is ${f.displayValue}" data-filter-id="${id}">
            <span class="fw-light">${f.label}:</span> ${f.displayValue}
          </button>
          <button type="button" class="${cls}"
            aria-label="Remove filter: ${f.label} is ${f.displayValue}" data-remove-id="${id}">
            <i class="if if-close if--xs" aria-hidden="true"></i>
          </button>
        </div>`;
      }).join('');

      activeChips.querySelectorAll('[data-filter-id]').forEach(btn => {
        btn.addEventListener('click', () => openEditor(btn.dataset.filterId, activeFilters[btn.dataset.filterId], btn.closest('.filter-chip-group')));
      });
      activeChips.querySelectorAll('[data-remove-id]').forEach(btn => {
        btn.addEventListener('click', () => { removeFilter(btn.dataset.removeId); if (editingFilter === btn.dataset.removeId) closeEditor(); });
      });
      clearAllBtn.hidden = Object.keys(activeFilters).length === 0;
      syncPickerState();
    }

    function syncPickerState() {
      document.querySelectorAll(pickerSel).forEach(btn => {
        const selected = !!activeFilters[btn.dataset.filter] || editingFilter === btn.dataset.filter;
        btn.classList.toggle('active', selected);
        if (selected) btn.setAttribute('aria-current', 'true');
        else btn.removeAttribute('aria-current');
        let check = btn.querySelector('[data-picker-check]');
        if (selected && !check) {
          check = document.createElement('i');
          check.className = 'if if-check if--xs ms-auto';
          check.dataset.pickerCheck = '';
          check.setAttribute('aria-hidden', 'true');
          btn.appendChild(check);
        } else if (!selected && check) {
          check.remove();
        }
      });
    }

    function closeEditor() {
      filterEditor.hidden = true;
      filterEditor.innerHTML = '';
      editingFilter = null;
      renderChips();
    }

    function hideDropdown() {
      bootstrap.Dropdown.getInstance(document.getElementById(prefix + 'add-filter-btn'))?.hide();
    }
  }

}());
