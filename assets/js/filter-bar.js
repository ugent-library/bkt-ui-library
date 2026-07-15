/**
 * filter-bar.js — generic chip + editor filter bar (the filter picker pattern,
 * patterns/filter-picker.html). One engine, one config per bar; it self-discovers
 * which bars are on the page by their id prefix and wires each independently.
 *
 * Bars: works (wf-), researchers (rdir-), projects (pdir-).
 * Prototype-only: chips are client-side and do not refilter the list yet
 * (faculty/venue/project/keyword values and the public-output rollup are stubs;
 * organisation / venue / project / keyword facets are backend-dependent).
 */

(function () {
  'use strict';

  const FACULTIES = [
    { value: 'ea', label: 'Engineering and Architecture' },
    { value: 'bw', label: 'Bioscience Engineering' },
    { value: 'we', label: 'Sciences' },
    { value: 'la', label: 'Arts and Philosophy' },
    { value: 're', label: 'Law and Criminology' },
    { value: 'ge', label: 'Medicine and Health Sciences' },
    { value: 'pp', label: 'Psychology and Educational Sciences' },
    { value: 'eb', label: 'Economics and Business Administration' },
    { value: 'di', label: 'Veterinary Medicine' },
    { value: 'fw', label: 'Pharmaceutical Sciences' },
    { value: 'ps', label: 'Political and Social Sciences' },
  ];

  // One config per bar, keyed by the id prefix used in its markup.
  const CONFIGS = {
    'wf-': {
      author:      { label: 'Author', type: 'text', placeholder: 'Search by name or ORCID…' },
      affiliation: { label: 'Organisation / affiliation', type: 'text', placeholder: 'Faculty, department, or organisation…' },
      venue:       { label: 'Journal / venue', type: 'text', placeholder: 'Journal, publisher, or conference…' },
      project:     { label: 'Project', type: 'text', placeholder: 'Project title or ID…' },
      keywords:    { label: 'Keywords / subject', type: 'text', placeholder: 'Keyword or subject…' },
      identifier:  { label: 'Identifier', type: 'text', placeholder: 'DOI, ISSN, ISBN, or handle…' },
    },
    'rdir-': {
      faculty:    { label: 'Faculty or department', type: 'checklist', values: FACULTIES },
      status:     { label: 'Current or alumni', type: 'boolean', yesLabel: 'Current members', noLabel: 'Alumni' },
      has_output: { label: 'Has public research output', type: 'boolean', yesLabel: 'Has public output', noLabel: 'No public output' },
    },
    'pdir-': {
      faculty: { label: 'Host faculty', type: 'checklist', values: FACULTIES },
      status:  { label: 'Status', type: 'boolean', yesLabel: 'Active', noLabel: 'Completed' },
      period:  { label: 'Period', type: 'year-range' },
    },
  };

  // Filters pre-applied on load, so a bar can show chips from the start.
  const INITIAL = {
    'wf-': {
      author: { label: 'Author', displayValue: 'Jane Doe', rawValue: 'Jane Doe' },
      venue:  { label: 'Journal / venue', displayValue: 'Nature Climate Change', rawValue: 'Nature Climate Change' },
    },
  };

  Object.keys(CONFIGS).forEach(prefix => initBar(prefix, CONFIGS[prefix], INITIAL[prefix]));

  function initBar(prefix, FILTERS, initial) {
    const activeChips  = document.getElementById(prefix + 'active-chips');
    const filterEditor = document.getElementById(prefix + 'filter-editor');
    const clearAllBtn  = document.getElementById(prefix + 'clear-all');
    if (!activeChips || !filterEditor || !clearAllBtn) return;   // bar not on this page

    const pickerSel = `#${prefix}filter-picker-list button[data-filter]`;
    let activeFilters = initial ? JSON.parse(JSON.stringify(initial)) : {};
    let editingFilter = null;

    document.querySelectorAll(pickerSel).forEach(btn => {
      btn.addEventListener('click', () => {
        hideDropdown();
        openEditor(btn.dataset.filter, activeFilters[btn.dataset.filter] || null);
      });
    });

    clearAllBtn.addEventListener('click', () => { activeFilters = {}; renderChips(); closeEditor(); });

    document.addEventListener('click', e => {
      if (!filterEditor.hidden &&
          !filterEditor.contains(e.target) &&
          !e.target.closest('[data-filter-id]') &&
          !e.target.closest('#' + prefix + 'add-filter-dropdown')) {
        closeEditor();
      }
    });

    renderChips();   // paint any pre-applied (initial) filters

    function openEditor(filterId, existing) {
      const def = FILTERS[filterId];
      if (!def) return;
      editingFilter = filterId;
      filterEditor.hidden = false;
      filterEditor.innerHTML = renderEditor(def, existing);
      filterEditor.querySelector('input')?.focus();
      attachEditorEvents(filterId, def);
      syncPickerState();
    }

    function renderEditor(def, existing) {
      const title = `<p class="bt-panel__title" id="${prefix}filter-editor-title">${def.label}</p>`;
      let body = '';

      if (def.type === 'checklist') {
        const checked = existing?.rawValue || [];
        body = `<div class="bt-panel__body bt-panel__body--checklist" role="group" aria-label="Select ${def.label}">` +
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
      activeChips.innerHTML = Object.entries(activeFilters).map(([id, f]) => `
        <div class="filter-chip-group">
          <button type="button" class="badge badge--outline"
            aria-label="Edit filter: ${f.label} is ${f.displayValue}" data-filter-id="${id}">
            ${f.label}: <span class="fw-bold">${f.displayValue}</span>
          </button>
          <button type="button" class="badge badge--outline"
            aria-label="Remove filter: ${f.label} is ${f.displayValue}" data-remove-id="${id}">
            <i class="if if-close if--xs" aria-hidden="true"></i>
          </button>
        </div>`).join('');

      activeChips.querySelectorAll('[data-filter-id]').forEach(btn => {
        btn.addEventListener('click', () => openEditor(btn.dataset.filterId, activeFilters[btn.dataset.filterId]));
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
      syncPickerState();
    }

    function hideDropdown() {
      bootstrap.Dropdown.getInstance(document.getElementById(prefix + 'add-filter-btn'))?.hide();
    }
  }

}());
