/**
 * filter-bar.js — chip + editor filter bar (patterns/filter-picker.html).
 * See docs/JAVASCRIPT.md.
 *
 * Bars: works (wf-), researchers (rdir-), projects (pdir-).
 * Prototype-only: chips are client-side and do not refilter the list yet.
 * Organization (tree search), project, and keyword filters are backend-dependent;
 * the journal is reached through the Identifier filter (ISSN), not a venue search.
 *
 * No filter vocabulary and no markup live here. A bar announces itself with
 * data-filter-bar carrying its id prefix; each picker button carries its own
 * definition (data-filter-label / -type / -options / -placeholder / -yes / -no /
 * -panel); the option lists come from templates/partials/filter-option-lists.html;
 * and every node is cloned from templates/partials/filter-editor-templates.html or,
 * for a picker filter, from the panel template its button names.
 */

(function () {
  'use strict';

  const optionsEl = document.querySelector('[data-filter-option-lists]');
  const OPTIONS = optionsEl ? JSON.parse(optionsEl.textContent) : {};

  const clone = id => document.getElementById(id).content.cloneNode(true);

  document.querySelectorAll('[data-filter-bar]')
    .forEach(bar => initBar(bar.dataset.filterBar));

  // Ids stay the handle rather than the bar element: filter-sheet.js moves the picker,
  // the editor and clear-all into the mobile offcanvas, out of the bar they started in.
  function initBar(prefix) {
    const activeChips  = document.getElementById(prefix + 'active-chips');
    const filterEditor = document.getElementById(prefix + 'filter-editor');
    const clearAllBtn  = document.getElementById(prefix + 'clear-all');
    if (!activeChips || !filterEditor || !clearAllBtn) return;   // bar not on this page

    const pickerSel = `#${prefix}filter-picker-list button[data-filter]`;
    const addFilterDropdown = document.getElementById(prefix + 'add-filter-dropdown');
    let activeFilters = JSON.parse(activeChips.dataset.initialFilters || '{}');
    let editingFilter = null;

    const FILTERS = {};
    document.querySelectorAll(pickerSel).forEach(btn => {
      const d = btn.dataset;
      FILTERS[d.filter] = {
        label: d.filterLabel,
        type: d.filterType,
        values: OPTIONS[d.filterOptions] || [],
        panel: d.filterPanel,
        placeholder: d.filterPlaceholder,
        yesLabel: d.filterYes,
        noLabel: d.filterNo,
      };
      btn.addEventListener('click', () => {
        hideDropdown();
        openEditor(d.filter, activeFilters[d.filter] || null, addFilterDropdown);
      });
    });

    clearAllBtn.addEventListener('click', () => { activeFilters = {}; renderChips(); closeEditor(); });

    document.getElementById(prefix + 'add-filter-btn')?.addEventListener('click', closeEditor);

    filterEditor.addEventListener('keydown', e => { if (e.key === 'Escape') closeEditor(); });

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
      filterEditor.replaceChildren(renderEditor(def, existing));
      positionEditor(anchorEl);
      filterEditor.querySelector('input')?.focus();
      attachEditorEvents(filterId, def);
      renderChips();
    }

    // Drop the panel under whatever opened it (Add-filter button or the chip). Clamped to the
    // viewport, not the bar: a squeezed layout can leave the bar less room than the panel needs,
    // and a bar-width clamp then pushes the panel off-screen. 16px matches the panel's own
    // 100vw - 2rem cap.
    function positionEditor(anchorEl) {
      const parent = filterEditor.offsetParent;
      if (!anchorEl || !parent) return;
      const parentLeft = parent.getBoundingClientRect().left;
      const maxLeft = document.documentElement.clientWidth - 16 - filterEditor.offsetWidth;
      const left = Math.min(anchorEl.getBoundingClientRect().left, Math.max(16, maxLeft));
      filterEditor.style.left = (left - parentLeft) + 'px';
    }

    function renderEditor(def, existing) {
      const shell = clone('filter-editor-shell');
      shell.querySelector('[data-editor-title]').textContent = def.label;
      const body = editorBody(def, existing);
      if (body) shell.insertBefore(body, shell.querySelector('.bt-panel__actions'));
      return shell;
    }

    function editorBody(def, existing) {
      if (def.type === 'checklist')  return checklistBody(def, existing?.rawValue || []);
      if (def.type === 'picker')     return pickerBody(def, existing?.rawValue || []);
      if (def.type === 'boolean')    return booleanBody(def, existing?.rawValue);
      if (def.type === 'year-range') return yearBody(existing?.rawValue || {});
      if (def.type === 'text')       return textBody(def, existing?.rawValue || '');
      return null;
    }

    function checklistBody(def, checked) {
      const frag = clone('filter-editor-checklist');
      const options = frag.querySelector('[data-editor-options]');
      options.setAttribute('aria-label', 'Select ' + def.label);

      // A short list is scannable; past eight, searching beats scrolling.
      if (def.values.length > 8) {
        frag.querySelector('[data-editor-search-label]').textContent = 'Search ' + def.label;
        frag.querySelector('[data-checklist-search]').placeholder =
          'Search ' + def.label.toLowerCase() + '…';
      } else {
        frag.querySelector('[data-editor-search]').remove();
      }

      def.values.forEach(v => {
        const row = clone('filter-checklist-row');
        const input = row.querySelector('input');
        const label = row.querySelector('label');
        input.id = prefix + 'fv-' + v.value;
        input.name = prefix + 'fv';
        input.value = v.value;
        input.checked = checked.includes(v.value);
        label.htmlFor = input.id;
        label.textContent = v.label;
        options.append(row);
      });
      return frag;
    }

    // The picker panel the button names, minus the title and footer this editor supplies itself.
    function pickerBody(def, selected) {
      const frag = clone(def.panel);
      frag.querySelector('[data-picker-title]').remove();
      frag.querySelector('[data-picker-actions]').remove();

      const search = frag.querySelector('[data-picker-search]');
      const searchLabel = frag.querySelector(`label[for="${search.id}"]`);
      search.id = prefix + search.id;
      searchLabel.htmlFor = search.id;
      search.placeholder = 'Search ' + def.label.toLowerCase() + '…';

      const rows = frag.querySelector('[data-picker-rows]');
      rows.setAttribute('aria-label', 'Select ' + def.label);
      const picked = selected.map(p => p.id);
      rows.querySelectorAll('.form-check').forEach(row => {
        const input = row.querySelector('input');
        const label = row.querySelector('label');
        input.id = prefix + input.id;
        input.name = prefix + 'picker';
        input.checked = picked.includes(input.dataset.id);
        label.htmlFor = input.id;
      });
      return frag;
    }

    function booleanBody(def, current) {
      const frag = clone('filter-editor-boolean');
      frag.querySelector('[data-editor-boolean]').setAttribute('aria-label', def.label);
      frag.querySelector('[data-editor-bool-yes]').textContent = def.yesLabel;
      frag.querySelector('[data-editor-bool-no]').textContent = def.noLabel;
      frag.querySelectorAll('[data-editor-bool]').forEach(radio => {
        radio.name = prefix + 'bool';
        radio.checked = radio.value === current;
      });
      return frag;
    }

    function yearBody(range) {
      const frag = clone('filter-editor-year');
      frag.querySelector('[data-year-from]').value = range.from || '';
      frag.querySelector('[data-year-to]').value = range.to || '';
      return frag;
    }

    function textBody(def, value) {
      const frag = clone('filter-editor-text');
      const input = frag.querySelector('[data-editor-text]');
      frag.querySelector('[data-editor-text-label]').textContent = def.label;
      if (def.placeholder) input.placeholder = def.placeholder;
      input.value = value;
      return frag;
    }

    function attachEditorEvents(filterId, def) {
      filterEditor.querySelector('[data-editor-apply]')
        ?.addEventListener('click', () => applyEditor(filterId, def));
      filterEditor.querySelector('[data-editor-cancel]')
        ?.addEventListener('click', closeEditor);
      filterEditor.querySelector('[data-editor-remove]')
        ?.addEventListener('click', () => { removeFilter(filterId); closeEditor(); });

      // Matching the whole row, not just its name, is what lets a people search find an ORCID
      // or a department.
      const searchInput = filterEditor.querySelector('[data-checklist-search], [data-picker-search]');
      searchInput?.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        filterEditor.querySelectorAll('.bt-panel__body .form-check').forEach(row => {
          row.hidden = q !== '' && !row.textContent.toLowerCase().includes(q);
        });
      });
    }

    function applyEditor(filterId, def) {
      let displayValue, rawValue;

      if (def.type === 'checklist') {
        const checked = [...filterEditor.querySelectorAll('[data-editor-options] input:checked')]
          .map(cb => ({ value: cb.value, label: cb.nextElementSibling.textContent.trim() }));
        if (!checked.length) { closeEditor(); return; }
        rawValue = checked.map(c => c.value);
        displayValue = checked.length === 1 ? checked[0].label : `${checked[0].label} +${checked.length - 1}`;
      } else if (def.type === 'picker') {
        // A row is kept by id: two rows can share a label, so the label is display only.
        const picked = [...filterEditor.querySelectorAll('[data-picker-rows] input:checked')]
          .map(cb => ({
            id: cb.dataset.id,
            label: cb.closest('.form-check').querySelector('[data-picker-name]').textContent.trim(),
          }));
        if (!picked.length) { closeEditor(); return; }
        rawValue = picked;
        displayValue = picked.length === 1 ? picked[0].label : `${picked[0].label} +${picked.length - 1}`;
      } else if (def.type === 'boolean') {
        const sel = filterEditor.querySelector('[data-editor-bool]:checked');
        if (!sel) { closeEditor(); return; }
        rawValue = sel.value;
        displayValue = sel.value === 'true' ? def.yesLabel : def.noLabel;
      } else if (def.type === 'year-range') {
        const from = filterEditor.querySelector('[data-year-from]')?.value;
        const to   = filterEditor.querySelector('[data-year-to]')?.value;
        if (!from && !to) { closeEditor(); return; }
        rawValue = { from, to };
        displayValue = from && to ? `${from}–${to}` : from ? `from ${from}` : `to ${to}`;
      } else if (def.type === 'text') {
        const val = (filterEditor.querySelector('[data-editor-text]')?.value || '').trim();
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
      activeChips.replaceChildren();

      Object.entries(activeFilters).forEach(([id, f]) => {
        const chip = clone('filter-chip');
        const edit = chip.querySelector('[data-filter-id]');
        const remove = chip.querySelector('[data-remove-id]');

        edit.dataset.filterId = id;
        remove.dataset.removeId = id;
        edit.querySelector('[data-chip-label]').textContent = f.label + ':';
        edit.append(' ' + f.displayValue);
        edit.setAttribute('aria-label', `Edit filter: ${f.label} is ${f.displayValue}`);
        remove.setAttribute('aria-label', `Remove filter: ${f.label} is ${f.displayValue}`);

        if (editingFilter === id) {
          edit.classList.add('active');
          remove.classList.add('active');
          edit.setAttribute('aria-current', 'true');
        }

        edit.addEventListener('click', () =>
          openEditor(id, activeFilters[id], edit.closest('.filter-chip-group')));
        remove.addEventListener('click', () => {
          removeFilter(id);
          if (editingFilter === id) closeEditor();
        });

        activeChips.append(chip);
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
        const check = btn.querySelector('[data-picker-check]');
        if (selected && !check) btn.append(clone('filter-picker-check'));
        else if (!selected && check) check.remove();
      });
    }

    function closeEditor() {
      filterEditor.hidden = true;
      filterEditor.replaceChildren();
      editingFilter = null;
      renderChips();
    }

    function hideDropdown() {
      bootstrap.Dropdown.getInstance(document.getElementById(prefix + 'add-filter-btn'))?.hide();
    }
  }

}());
