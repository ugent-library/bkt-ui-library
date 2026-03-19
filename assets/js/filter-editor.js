/**
 * filter-editor.js
 * Filter chip interaction for all search pages.
 *
 * Requires in the page:
 *   #active-chips          — container where chips are rendered
 *   #filter-editor         — panel where the editor renders (hidden by default)
 *   #clear-all-btn         — "Clear all" button (hidden by default)
 *   #filter-search         — search input inside the filter picker
 *   #filter-picker-list    — list of buttons with data-filter="<id>"
 *   #add-filter-btn        — the Bootstrap dropdown trigger
 *   #add-filter-dropdown   — the Bootstrap dropdown wrapper
 *
 * Cooperates with people-search.js for the people-search editor type.
 * Load people-search.js before this file.
 * In prototypes also load people-search-stub.js.
 */

(function () {
  'use strict';

  // ── Filter definitions ────────────────────────────────────────────────────
  const FILTERS = {
    type: {
      label: 'Type', type: 'checklist',
      values: [
        { value: 'journal_article', label: 'Journal article' },
        { value: 'book',            label: 'Book' },
        { value: 'book_chapter',    label: 'Book chapter' },
        { value: 'dataset',         label: 'Dataset' },
        { value: 'dissertation',    label: 'Dissertation' },
        { value: 'conference',      label: 'Conference' },
        { value: 'miscellaneous',   label: 'Miscellaneous' },
      ]
    },
    subtype: {
      label: 'Subtype', type: 'checklist',
      values: [
        { value: 'original',    label: 'Original article' },
        { value: 'review',      label: 'Review article' },
        { value: 'letterNote',  label: 'Letter / note' },
        { value: 'proceedings', label: 'Proceedings paper' },
      ]
    },
    author:          { label: 'Author',                   type: 'people-search' },
    affiliation:     { label: 'Affiliation / faculty',    type: 'text',      placeholder: 'Faculty or organisation name…' },
    research_group:  { label: 'Research group',           type: 'text',      placeholder: 'Research group or department…' },
    year:            { label: 'Publication year',         type: 'year-range' },
    created_since:   { label: 'Created since',            type: 'date' },
    updated_since:   { label: 'Updated since',            type: 'date' },
    open_access:     { label: 'Open access',              type: 'boolean',   yesLabel: 'Yes — open access only',      noLabel: 'No — restricted only' },
    has_file:        { label: 'Has file',                 type: 'boolean',   yesLabel: 'Yes — has attached file',     noLabel: 'No — no file attached' },
    status: {
      label: 'Biblio status', type: 'checklist',
      values: [
        { value: 'public',    label: 'Published' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'draft',     label: 'Draft' },
      ]
    },
    pub_status: {
      label: 'Publication status', type: 'checklist',
      values: [
        { value: 'published', label: 'Published' },
        { value: 'accepted',  label: 'Accepted / in press' },
        { value: 'epub',      label: 'Online first' },
        { value: 'inprep',    label: 'In preparation' },
      ]
    },
    tags:       { label: 'Tags',              type: 'text', placeholder: 'Librarian tag…' },
    venue:      { label: 'Journal / venue',   type: 'text', placeholder: 'Journal title, publisher, or conference…' },
    project:    { label: 'Project / funding', type: 'text', placeholder: 'Project name or grant ID…' },
    identifier: { label: 'Identifier',        type: 'text', placeholder: 'DOI, handle, ISBN, record ID…' },
    language:   { label: 'Language',          type: 'text', placeholder: 'e.g. English, Dutch…' },
    keywords:   { label: 'Keywords',          type: 'text', placeholder: 'Subject or keyword…' },
  };

  // ── State ─────────────────────────────────────────────────────────────────
  let activeFilters      = {};
  let editingFilter      = null;
  let editorPendingValue = null;

  // ── DOM refs — must exist in the page ─────────────────────────────────────
  const activeChips  = document.getElementById('active-chips');
  const filterEditor = document.getElementById('filter-editor');
  const clearAllBtn  = document.getElementById('clear-all-btn');
  const filterSearch = document.getElementById('filter-search');

  if (!activeChips || !filterEditor || !clearAllBtn || !filterSearch) return;

  // ── Filter picker: search ─────────────────────────────────────────────────
  filterSearch.addEventListener('input', () => {
    const q = filterSearch.value.toLowerCase();
    document.querySelectorAll('#filter-picker-list button[data-filter]').forEach(btn => {
      btn.hidden = q && !btn.textContent.toLowerCase().includes(q);
    });
    document.querySelectorAll('#filter-picker-list p').forEach(p => {
      let next = p.nextElementSibling;
      let allHidden = true;
      while (next && next.tagName !== 'P' && !next.classList.contains('dropdown-divider')) {
        if (next.tagName === 'BUTTON' && !next.hidden) allHidden = false;
        next = next.nextElementSibling;
      }
      p.hidden = allHidden;
    });
  });

  // ── Filter picker: select ─────────────────────────────────────────────────
  document.querySelectorAll('#filter-picker-list button[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filterId = btn.dataset.filter;
      bootstrap.Dropdown.getInstance(document.getElementById('add-filter-btn'))?.hide();
      filterSearch.value = '';
      document.querySelectorAll('#filter-picker-list button[data-filter]').forEach(b => b.hidden = false);
      openEditor(filterId, null);
    });
  });

  // ── Open editor ───────────────────────────────────────────────────────────
  function openEditor(filterId, existingValue) {
    editingFilter      = filterId;
    editorPendingValue = existingValue ? { ...existingValue } : null;

    const def = FILTERS[filterId];
    if (!def) return;

    filterEditor.innerHTML = renderEditor(filterId, def, existingValue);
    filterEditor.hidden    = false;

    // Init any people-search widget that just landed in the editor
    if (window.PeopleSearch) window.PeopleSearch.initAll();

    filterEditor.querySelector('input, button.filter-boolean__option')?.focus();
    attachEditorEvents(filterId, def);
  }

  // ── Render editor ─────────────────────────────────────────────────────────
  function renderEditor(filterId, def, existing) {
    const title = `<p class="filter-editor__title" id="filter-editor-title">${def.label}</p>`;
    let body = '';

    switch (def.type) {

      case 'checklist': {
        const checked = existing?.rawValue || [];
        body = `<div class="filter-checklist" role="group" aria-label="Select ${def.label}">` +
          def.values.map(v => `
            <div class="form-check">
              <input class="form-check-input" type="checkbox"
                id="fv-${v.value}" name="fv" value="${v.value}"
                ${checked.includes(v.value) ? 'checked' : ''}>
              <label class="form-check-label" for="fv-${v.value}">${v.label}</label>
            </div>`).join('') + `</div>`;
        break;
      }

      case 'boolean': {
        const cur = existing?.rawValue;
        body = `<div class="filter-boolean" role="group" aria-label="${def.label}">
          <button type="button" class="filter-boolean__option ${cur === 'true'  ? 'is-selected' : ''}" data-bool="true">${def.yesLabel}</button>
          <button type="button" class="filter-boolean__option ${cur === 'false' ? 'is-selected' : ''}" data-bool="false">${def.noLabel}</button>
        </div>`;
        break;
      }

      case 'year-range': {
        const from = existing?.rawValue?.from || '';
        const to   = existing?.rawValue?.to   || '';
        body = `<div class="filter-year">
          <label for="year-from" class="visually-hidden">From year</label>
          <input type="number" id="year-from" class="form-control filter-year__input" placeholder="From" value="${from}">
          <span class="text-muted small">to</span>
          <label for="year-to" class="visually-hidden">To year</label>
          <input type="number" id="year-to" class="form-control filter-year__input" placeholder="To" value="${to}">
        </div>`;
        break;
      }

      case 'date': {
        const val = existing?.rawValue || '';
        body = `<div>
          <label for="date-val" class="visually-hidden">${def.label}</label>
          <input type="date" id="date-val" class="form-control form-control-sm" value="${val}">
        </div>`;
        break;
      }

      case 'text': {
        const val = existing?.rawValue || '';
        body = `<div>
          <label for="text-val" class="visually-hidden">${def.label}</label>
          <input type="text" id="text-val" class="form-control form-control-sm"
            placeholder="${def.placeholder || ''}" value="${val}" autocomplete="off">
        </div>`;
        break;
      }

      case 'people-search': {
        const sel = existing?.rawValue;
        body = `<div data-people-search>
          <label for="people-search-input" class="visually-hidden">Search by name or ORCID</label>
          <input type="search" id="people-search-input" data-ps-input
            class="form-control form-control-sm"
            placeholder="Search by name or ORCID…"
            autocomplete="off"
            value="${sel?.name || ''}"
            hx-get="/people/search"
            hx-trigger="keyup changed delay:300ms"
            hx-target="next [data-ps-results]"
            hx-indicator="next [data-ps-hint]">
          <div data-ps-results class="people-results" role="listbox"
            aria-label="People matching your search" ${sel ? '' : 'hidden'}>
            ${sel ? renderPersonSelected(sel) : ''}
          </div>
          <p data-ps-hint class="text-muted small mt-2 mb-0">
            Type a name to search across UGent people and external authors.
          </p>
        </div>`;
        break;
      }
    }

    const removeBtn = editingFilter && activeFilters[editingFilter]
      ? `<button type="button" class="btn btn-ghost btn-sm text-danger ms-auto" id="editor-remove">Remove filter</button>`
      : '';

    return title + body + `<div class="filter-editor__actions">
      <button type="button" class="btn btn-primary btn-sm" id="editor-apply">Apply</button>
      <button type="button" class="btn btn-ghost btn-sm" id="editor-cancel">Cancel</button>
      ${removeBtn}
    </div>`;
  }

  // ── Attach editor events ──────────────────────────────────────────────────
  function attachEditorEvents(filterId, def) {
    document.getElementById('editor-apply')?.addEventListener('click', () => applyEditor(filterId, def));
    document.getElementById('editor-cancel')?.addEventListener('click', closeEditor);
    document.getElementById('editor-remove')?.addEventListener('click', () => { removeFilter(filterId); closeEditor(); });

    filterEditor.querySelectorAll('.filter-boolean__option').forEach(btn => {
      btn.addEventListener('click', () => {
        filterEditor.querySelectorAll('.filter-boolean__option').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
      });
    });

    if (def.type === 'people-search') {
      // Use a named handler so it can be removed on close (prevents accumulation)
      const onPersonSelect = e => { editorPendingValue = e.detail; };
      filterEditor.addEventListener('people-search:select', onPersonSelect);
      // Also listen on document as a fallback — the event bubbles from the
      // [data-people-search] container inside filterEditor, but the container
      // is replaced on each openEditor() call so bubbling may miss the listener
      // if the event fires during the same tick as initWidget.
      const onPersonSelectDoc = e => { editorPendingValue = e.detail; };
      document.addEventListener('people-search:select', onPersonSelectDoc);
      // Store cleanup on the editor element for closeEditor()
      filterEditor._cleanupPeopleSelect = () => {
        filterEditor.removeEventListener('people-search:select', onPersonSelect);
        document.removeEventListener('people-search:select', onPersonSelectDoc);
      };
    }

    filterEditor.addEventListener('keydown', e => { if (e.key === 'Escape') closeEditor(); });
  }

  // ── Render selected person (pre-populate when re-editing) ─────────────────
  function renderPersonSelected(person) {
    return `<div class="people-result is-selected" role="option" tabindex="0"
      data-id="${person.id}" data-name="${person.name}"
      data-affiliation="${person.affiliation || ''}"
      aria-selected="true">
      <span class="people-result__icon" aria-hidden="true"><i class="if if-user if--sm"></i></span>
      <div>
        <div class="people-result__name">${person.name}</div>
        ${person.affiliation ? `<div class="people-result__meta"><span class="people-result__meta-item">${person.affiliation}</span></div>` : ''}
      </div>
      <i class="if if-check ms-auto text-success" aria-hidden="true"></i>
    </div>`;
  }

  // ── Apply editor ──────────────────────────────────────────────────────────
  function applyEditor(filterId, def) {
    let displayValue, rawValue;

    switch (def.type) {
      case 'checklist': {
        const checked = [...filterEditor.querySelectorAll('input[name="fv"]:checked')]
          .map(cb => ({ value: cb.value, label: filterEditor.querySelector(`label[for="fv-${cb.value}"]`).textContent.trim() }));
        if (!checked.length) { closeEditor(); return; }
        rawValue     = checked.map(c => c.value);
        displayValue = checked.length === 1 ? checked[0].label : `${checked[0].label} +${checked.length - 1}`;
        break;
      }
      case 'boolean': {
        const sel = filterEditor.querySelector('.filter-boolean__option.is-selected');
        if (!sel) { closeEditor(); return; }
        rawValue = sel.dataset.bool; displayValue = rawValue === 'true' ? 'Yes' : 'No';
        break;
      }
      case 'year-range': {
        const from = document.getElementById('year-from')?.value;
        const to   = document.getElementById('year-to')?.value;
        if (!from && !to) { closeEditor(); return; }
        rawValue = { from, to };
        displayValue = from && to ? `${from}–${to}` : from ? `from ${from}` : `to ${to}`;
        break;
      }
      case 'date': {
        const val = document.getElementById('date-val')?.value;
        if (!val) { closeEditor(); return; }
        rawValue = val; displayValue = val; break;
      }
      case 'text': {
        const val = document.getElementById('text-val')?.value.trim();
        if (!val) { closeEditor(); return; }
        rawValue = val; displayValue = val; break;
      }
      case 'people-search': {
        if (!editorPendingValue) { closeEditor(); return; }
        rawValue = editorPendingValue; displayValue = editorPendingValue.name; break;
      }
    }

    addFilter(filterId, { label: def.label, displayValue, rawValue });
    closeEditor();
  }

  // ── Filter state ──────────────────────────────────────────────────────────
  function addFilter(filterId, value) { activeFilters[filterId] = value; renderChips(); }
  function removeFilter(filterId)     { delete activeFilters[filterId]; renderChips(); }

  function renderChips() {
    activeChips.innerHTML = Object.entries(activeFilters).map(([id, f]) => `
      <div class="d-inline-flex align-items-center">
        <button type="button" class="filter-tag filter-tag--editable"
          aria-label="Edit filter: ${f.label} is ${f.displayValue}"
          data-filter-id="${id}">
          <span class="text-muted small me-1">${f.label}:</span>${f.displayValue}
        </button>
        <button type="button" class="filter-tag__remove"
          aria-label="Remove filter: ${f.label} is ${f.displayValue}"
          data-remove-id="${id}">
          <i class="if if-close if--xs" aria-hidden="true"></i>
        </button>
      </div>`).join('');

    activeChips.querySelectorAll('[data-filter-id]').forEach(btn => {
      btn.addEventListener('click', () => openEditor(btn.dataset.filterId, activeFilters[btn.dataset.filterId]));
    });
    activeChips.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFilter(btn.dataset.removeId);
        if (editingFilter === btn.dataset.removeId) closeEditor();
      });
    });

    clearAllBtn.hidden = Object.keys(activeFilters).length === 0;
  }

  // ── Close editor ──────────────────────────────────────────────────────────
  function closeEditor() {
    if (filterEditor._cleanupPeopleSelect) {
      filterEditor._cleanupPeopleSelect();
      delete filterEditor._cleanupPeopleSelect;
    }
    filterEditor.hidden    = true;
    filterEditor.innerHTML = '';
    editingFilter          = null;
    editorPendingValue     = null;
  }

  clearAllBtn.addEventListener('click', () => { activeFilters = {}; renderChips(); closeEditor(); });

  document.addEventListener('click', e => {
    if (!filterEditor.hidden &&
        !filterEditor.contains(e.target) &&
        !e.target.closest('[data-filter-id]') &&
        !e.target.closest('#add-filter-dropdown')) {
      closeEditor();
    }
  });

  // ── biblio:filter-add — autocomplete → chip, no editor ───────────────────
  // Fired by: suggest panel rows (Org, Project, Keyword, Librarian tag).
  // In production this would also trigger a search update.
  // In the prototype it just adds the chip — no network call.
  document.addEventListener('biblio:filter-add', e => {
    const { filterId, displayValue, rawValue } = e.detail || {};
    if (!filterId || !FILTERS[filterId]) return;
    addFilter(filterId, {
      label: FILTERS[filterId].label,
      displayValue,
      rawValue,
    });
  });

}());
