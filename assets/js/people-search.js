/**
 * people-search.js
 * Shared behaviour for all people-search widget instances.
 *
 * Usage:
 *   Add data-people-search to any container that holds the following
 *   data-ps-* elements. The widget wires them up automatically.
 *
 *   Required:
 *     [data-ps-input]    <input type="search"> — the search field
 *     [data-ps-results]  <div role="listbox">  — results / selected state
 *
 *   Optional:
 *     [data-ps-hint]               <p>          — status / hint text
 *     [data-ps-id]                 <input hidden> — selected person's ID
 *     [data-ps-name]               <input hidden> — selected person's display name
 *     [data-ps-selected]           <div hidden>   — confirmation slot (host template)
 *     [data-ps-selected-name]      inside above   — filled with person name
 *     [data-ps-selected-affiliation] inside above — filled with affiliation
 *     [data-ps-clear]              <button>       — clears the current selection
 *
 * Events:
 *   The container dispatches "people-search:select" (bubbles) when a person
 *   is chosen. event.detail = { id, name, affiliation }.
 *   Host contexts listen for this to store state or advance the form.
 *
 * In production:
 *   hx-get="/people/search" on the input returns people-search-results.html.
 *   This script handles click/keyboard selection on those results via event
 *   delegation — it works after every HTMX swap.
 *
 * In prototypes:
 *   Include people-search-stub.js after this file. It intercepts the input
 *   event and populates the results from a local PEOPLE array instead of
 *   calling the server. Nothing in this file changes.
 */

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
      const row = e.target.closest('.people-result');
      if (row) selectPerson(row.dataset);
    });

    results.addEventListener('keydown', e => {
      const rows = [...results.querySelectorAll('.people-result')];
      const idx  = rows.indexOf(document.activeElement);

      if (e.key === 'Enter' || e.key === ' ') {
        const row = e.target.closest('.people-result');
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

    // ArrowDown from input moves focus into the list
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        results.querySelector('.people-result')?.focus();
      }
    });

    // ── Show / hide results after HTMX swap ─────────────────────────────────
    results.addEventListener('htmx:afterSwap', () => {
      const count = results.querySelectorAll('.people-result').length;
      results.hidden = count === 0;
      if (hint) hint.textContent = count ? `${count} result${count !== 1 ? 's' : ''}` : '';
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
        // Host template has its own confirmation slot — use it
        const nameEl = selectedSlot.querySelector('[data-ps-selected-name]');
        const affEl  = selectedSlot.querySelector('[data-ps-selected-affiliation]');
        if (nameEl) nameEl.textContent = name;
        if (affEl)  affEl.textContent  = affiliation || 'External';
        selectedSlot.hidden = false;
        results.innerHTML   = '';
        results.hidden      = true;
      } else {
        // No slot — collapse list to the selected row
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
        ? `<div class="people-result__meta">
             <span class="people-result__meta-item">${person.affiliation}</span>
           </div>`
        : '';
      return `<div class="people-result is-selected" role="option" tabindex="0"
          data-id="${person.id}"
          data-name="${person.name}"
          data-affiliation="${person.affiliation}"
          aria-label="${person.name}${person.affiliation ? ', ' + person.affiliation : ''}"
          aria-selected="true">
          <span class="people-result__icon" aria-hidden="true">
            <i class="if if-user if--sm"></i>
          </span>
          <div>
            <div class="people-result__name">${person.name}</div>
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
    if (e.detail.target.matches?.('[data-people-search]')) {
      initWidget(e.detail.target);
    }
    e.detail.target.querySelectorAll?.('[data-people-search]').forEach(initWidget);
  });

  window.PeopleSearch = { init: initWidget, initAll };

}());
