/** Shared people-picker behavior. Host contract and event: docs/JAVASCRIPT.md. */

(function () {
  'use strict';

  function initWidget(container) {
    const input       = container.querySelector('[data-ps-input]');
    const results     = container.querySelector('[data-ps-results]');
    const hint        = container.querySelector('[data-ps-hint]');
    const hiddenId    = container.querySelector('[data-ps-id]');
    const hiddenName  = container.querySelector('[data-ps-name]');
    const selectedSlot = container.querySelector('[data-ps-selected]');
    const clearBtn    = container.querySelector('[data-ps-clear]');

    if (!input || !results) return;

    // ── Selection — event delegation works after every HTMX swap ───────────
    results.addEventListener('click', e => {
      const row = e.target.closest('[data-ps-row]');
      if (row) selectPerson(row.dataset);
    });

    results.addEventListener('keydown', e => {
      const rows = [...results.querySelectorAll('[data-ps-row]')];
      const idx  = rows.indexOf(document.activeElement);

      if (e.key === 'Enter' || e.key === ' ') {
        const row = e.target.closest('[data-ps-row]');
        if (row) { e.preventDefault(); selectPerson(row.dataset); }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        (rows[idx + 1] ?? rows[0])?.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        idx > 0 ? rows[idx - 1].focus() : input.focus();
      }
      if (e.key === 'Escape') {
        input.focus();
      }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        results.querySelector('[data-ps-row]')?.focus();
      }
    });

    // ── Show / hide results after HTMX swap ─────────────────────────────────
    results.addEventListener('htmx:afterSwap', () => {
      const count = results.querySelectorAll('[data-ps-row]').length;
      results.hidden = count === 0;
      // No-results lives in the hint (the live region), never inside the listbox.
      if (hint) hint.textContent = count
        ? `${count} result${count !== 1 ? 's' : ''}`
        : `No people found for "${input.value}"`;
    });

    // ── Clear ────────────────────────────────────────────────────────────────
    if (clearBtn) {
      clearBtn.addEventListener('click', () => { clearSelection(); input.focus(); });
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    function selectPerson(data) {
      const id          = data.id          || '';
      const name        = data.name        || '';
      const affiliation = data.affiliation || '';

      if (hiddenId)   hiddenId.value   = id;
      if (hiddenName) hiddenName.value = name;
      input.value = name;

      if (selectedSlot) {
        const nameEl = selectedSlot.querySelector('[data-ps-selected-name]');
        const affEl  = selectedSlot.querySelector('[data-ps-selected-affiliation]');
        if (nameEl) nameEl.textContent = name;
        if (affEl)  affEl.textContent  = affiliation || 'External';
        selectedSlot.hidden = false;
        results.innerHTML   = '';
        results.hidden      = true;
      } else {
        results.innerHTML = renderSelected({ id, name, affiliation });
        results.hidden    = false;
      }

      if (hint) hint.textContent = '';

      container.dispatchEvent(new CustomEvent('people-search:select', {
        bubbles: true,
        detail: { id, name, affiliation }
      }));
    }

    function clearSelection() {
      if (hiddenId)   hiddenId.value   = '';
      if (hiddenName) hiddenName.value = '';
      input.value   = '';
      results.innerHTML = '';
      results.hidden    = true;
      if (selectedSlot) selectedSlot.hidden = true;
      if (hint) hint.textContent = 'Type a name to search across UGent people and external authors.';
    }

    function renderSelected(person) {
      const affMeta = person.affiliation
        ? `<div class="bt-meta-list bt-meta-list--xs">
             <span class="bt-meta-list__item">${person.affiliation}</span>
           </div>`
        : '';
      return `<div class="bt-result is-selected" role="option" tabindex="0" data-ps-row
          data-id="${person.id}"
          data-name="${person.name}"
          data-affiliation="${person.affiliation}"
          aria-label="${person.name}${person.affiliation ? ', ' + person.affiliation : ''}"
          aria-selected="true">
          <span class="bt-result__icon" aria-hidden="true">
            <i class="if if-user if--sm"></i>
          </span>
          <div>
            <div class="bt-result__name">${person.name}</div>
            ${affMeta}
          </div>
          <i class="if if-check ms-auto text-success" aria-hidden="true"></i>
        </div>`;
    }
  }

  // ── Auto-init ────────────────────────────────────────────────────────────
  function initAll() {
    document.querySelectorAll('[data-people-search]').forEach(initWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Re-init widgets that arrive via HTMX swap
  document.addEventListener('htmx:afterSwap', e => {
    const target = e.detail?.target;
    if (!target) return;
    if (target.matches?.('[data-people-search]')) {
      initWidget(target);
    }
    target.querySelectorAll?.('[data-people-search]').forEach(initWidget);
  });

  window.PeopleSearch = { init: initWidget, initAll };

}());
