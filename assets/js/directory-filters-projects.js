/**
 * directory-filters-projects.js — chip + editor filter bar for the project
 * directory. Same interaction as directory-filters.js, but the filter set is
 * scoped to PROJECTS (host faculty, status, period) and adds a year-range
 * editor for the period. Bound to the pdir-* ids in
 * result-filter-bar-projects.html.
 * Prototype-only: chips are client-side and do not refilter the list yet.
 */

(function () {
  'use strict';

  // Stub: faculty list and project status/period values are backend concerns.
  const FILTERS = {
    faculty: {
      label: 'Host faculty', type: 'checklist',
      values: [
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
      ]
    },
    status: { label: 'Status', type: 'boolean', yesLabel: 'Active', noLabel: 'Completed' },
    period: { label: 'Period', type: 'year-range' },
  };

  const activeChips  = document.getElementById('pdir-active-chips');
  const filterEditor = document.getElementById('pdir-filter-editor');
  const clearAllBtn  = document.getElementById('pdir-clear-all');

  if (!activeChips || !filterEditor || !clearAllBtn) return;

  let activeFilters = {};
  let editingFilter = null;

  document.querySelectorAll('#pdir-filter-picker-list button[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      hideDropdown();
      openEditor(btn.dataset.filter, activeFilters[btn.dataset.filter] || null);
    });
  });

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
    const title = `<p class="filter-editor__title" id="pdir-filter-editor-title">${def.label}</p>`;
    let body = '';

    if (def.type === 'checklist') {
      const checked = existing?.rawValue || [];
      body = `<div class="filter-editor__body filter-editor__body--checklist" role="group" aria-label="Select ${def.label}">` +
        def.values.map(v => `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="pdir-fv-${v.value}" name="pdir-fv" value="${v.value}" ${checked.includes(v.value) ? 'checked' : ''}>
            <label class="form-check-label" for="pdir-fv-${v.value}">${v.label}</label>
          </div>`).join('') + `</div>`;
    } else if (def.type === 'boolean') {
      const cur = existing?.rawValue;
      body = `<div class="filter-editor__body filter-editor__body--boolean" role="group" aria-label="${def.label}">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="pdir-bool" id="pdir-bool-true" value="true" ${cur === 'true' ? 'checked' : ''}>
          <label class="form-check-label" for="pdir-bool-true">${def.yesLabel}</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="pdir-bool" id="pdir-bool-false" value="false" ${cur === 'false' ? 'checked' : ''}>
          <label class="form-check-label" for="pdir-bool-false">${def.noLabel}</label>
        </div>
      </div>`;
    } else if (def.type === 'year-range') {
      const from = existing?.rawValue?.from || '';
      const to   = existing?.rawValue?.to   || '';
      body = `<div class="filter-editor__body filter-editor__body--year">
        <label for="pdir-year-from" class="visually-hidden">From year</label>
        <input type="number" id="pdir-year-from" class="form-control filter-year__input" placeholder="From" min="1900" max="2100" value="${from}">
        <span class="text-muted small">to</span>
        <label for="pdir-year-to" class="visually-hidden">To year</label>
        <input type="number" id="pdir-year-to" class="form-control filter-year__input" placeholder="To" min="1900" max="2100" value="${to}">
      </div>`;
    }

    const removeBtn = activeFilters[editingFilter]
      ? `<button type="button" class="btn btn-ghost btn-sm text-danger ms-auto" id="pdir-editor-remove">Remove filter</button>`
      : '';

    return title + body + `<div class="filter-editor__actions">
      <button type="button" class="btn btn-primary btn-sm" id="pdir-editor-apply">Apply</button>
      <button type="button" class="btn btn-ghost btn-sm" id="pdir-editor-cancel">Cancel</button>
      ${removeBtn}
    </div>`;
  }

  function attachEditorEvents(filterId, def) {
    document.getElementById('pdir-editor-apply')?.addEventListener('click', () => applyEditor(filterId, def));
    document.getElementById('pdir-editor-cancel')?.addEventListener('click', closeEditor);
    document.getElementById('pdir-editor-remove')?.addEventListener('click', () => { removeFilter(filterId); closeEditor(); });
    filterEditor.addEventListener('keydown', e => { if (e.key === 'Escape') closeEditor(); });
  }

  function applyEditor(filterId, def) {
    let displayValue, rawValue;

    if (def.type === 'checklist') {
      const checked = [...filterEditor.querySelectorAll('input[name="pdir-fv"]:checked')]
        .map(cb => ({ value: cb.value, label: filterEditor.querySelector(`label[for="pdir-fv-${cb.value}"]`).textContent.trim() }));
      if (!checked.length) { closeEditor(); return; }
      rawValue = checked.map(c => c.value);
      displayValue = checked.length === 1 ? checked[0].label : `${checked[0].label} +${checked.length - 1}`;
    } else if (def.type === 'boolean') {
      const sel = filterEditor.querySelector('input[name="pdir-bool"]:checked');
      if (!sel) { closeEditor(); return; }
      rawValue = sel.value;
      displayValue = sel.value === 'true' ? def.yesLabel : def.noLabel;
    } else if (def.type === 'year-range') {
      const from = document.getElementById('pdir-year-from')?.value;
      const to   = document.getElementById('pdir-year-to')?.value;
      if (!from && !to) { closeEditor(); return; }
      rawValue = { from, to };
      displayValue = from && to ? `${from}–${to}` : from ? `from ${from}` : `to ${to}`;
    }

    activeFilters[filterId] = { label: def.label, displayValue, rawValue };
    renderChips();
    closeEditor();
  }

  function removeFilter(filterId) { delete activeFilters[filterId]; renderChips(); }

  function renderChips() {
    activeChips.innerHTML = Object.entries(activeFilters).map(([id, f]) => `
      <div class="filter-tag-group">
        <button type="button" class="filter-tag filter-tag--editable"
          aria-label="Edit filter: ${f.label} is ${f.displayValue}" data-filter-id="${id}">
          ${f.label}: <span class="fw-bold">${f.displayValue}</span>
        </button>
        <button type="button" class="filter-tag__remove"
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
    document.querySelectorAll('#pdir-filter-picker-list button[data-filter]').forEach(btn => {
      const selected = !!activeFilters[btn.dataset.filter] || editingFilter === btn.dataset.filter;
      btn.classList.toggle('active', selected);
      if (selected) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
      let check = btn.querySelector('.bt-filter-picker__check');
      if (selected && !check) {
        check = document.createElement('i');
        check.className = 'if if-check if--xs ms-auto bt-filter-picker__check';
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
    bootstrap.Dropdown.getInstance(document.getElementById('pdir-add-filter-btn'))?.hide();
  }

  clearAllBtn.addEventListener('click', () => { activeFilters = {}; renderChips(); closeEditor(); });

  document.addEventListener('click', e => {
    if (!filterEditor.hidden &&
        !filterEditor.contains(e.target) &&
        !e.target.closest('[data-filter-id]') &&
        !e.target.closest('#pdir-add-filter-dropdown')) {
      closeEditor();
    }
  });

}());
