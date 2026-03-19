/**
 * suggest-panel.js
 * Show/hide and keyboard behaviour for the autocomplete suggestion panel.
 *
 * Requires in the host page:
 *   #q                — the search input
 *   #suggest-panel    — the panel wrapper (must exist in DOM at page load)
 *   #suggest-wrapper  — the container (used for outside-click detection)
 *
 * The panel inner content is swapped by HTMX on every keyup.
 * This script handles only the visibility state and keyboard navigation.
 *
 * Connection to filter-editor.js:
 *   Org, Project, and Keyword suggestion rows carry data-filter-* attributes.
 *   On click this script dispatches biblio:filter-add, which filter-editor.js
 *   listens for to add a chip — no editor panel opens.
 *
 *   Rows that trigger a chip addition:
 *     data-filter-id    — matches a key in FILTERS in filter-editor.js
 *     data-filter-value — the raw value
 *     data-filter-label — the display label shown in the chip
 */

(function () {
  'use strict';

  const input   = document.getElementById('q');
  const panel   = document.getElementById('suggest-panel');
  const wrapper = document.getElementById('suggest-wrapper');

  if (!input || !panel) return;

  // ── Show / hide ────────────────────────────────────────────────────────────

  function showPanel() {
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function hidePanel() {
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  }

  // Show when focused with a value
  input.addEventListener('focus', () => {
    if (input.value.trim().length > 0) showPanel();
  });

  // Show on keyup whenever the input has content
  // (covers the case where HTMX has no real endpoint in the prototype)
  input.addEventListener('keyup', () => {
    if (input.value.trim().length > 0) showPanel();
    else hidePanel();
  });

  // Show after HTMX swap if input still has a value
  document.body.addEventListener('htmx:afterSwap', (e) => {
    if (e.detail.target === panel && input.value.trim().length > 0) showPanel();
  });

  // Hide on outside click
  document.addEventListener('click', (e) => {
    if (wrapper && !wrapper.contains(e.target)) hidePanel();
  });

  // Hide on form submit
  const form = input.closest('form');
  if (form) form.addEventListener('submit', hidePanel);

  // ── Keyboard navigation ────────────────────────────────────────────────────

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hidePanel();
      return;
    }
    if (e.key === 'ArrowDown' && !panel.hidden) {
      e.preventDefault();
      const rows = [...panel.querySelectorAll('a[role="option"]')];
      if (rows.length) rows[0].focus();
    }
  });

  panel.addEventListener('keydown', (e) => {
    const rows    = [...panel.querySelectorAll('a[role="option"]')];
    const current = document.activeElement;
    const idx     = rows.indexOf(current);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < rows.length - 1) rows[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx > 0 ? rows[idx - 1].focus() : input.focus();
    } else if (e.key === 'Escape') {
      hidePanel();
      input.focus();
    }
  });

  // ── biblio:filter-add — Org / Project / Keyword rows ──────────────────────
  // Rows that should add a filter chip (rather than navigate) carry:
  //   data-filter-id, data-filter-value, data-filter-label
  // On click: dispatch the event for filter-editor.js, then hide the panel.
  // The href on the row still works as a fallback if JS is absent.

  panel.addEventListener('click', (e) => {
    const row = e.target.closest('a[role="option"][data-filter-id]');
    if (!row) return;

    const filterId    = row.dataset.filterId;
    const filterValue = row.dataset.filterValue;
    const filterLabel = row.dataset.filterLabel;

    if (filterId && filterValue) {
      // Only prevent default if filter-editor.js is present to handle it
      if (typeof window !== 'undefined' && document.getElementById('active-chips')) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('biblio:filter-add', {
          detail: {
            filterId,
            displayValue: filterLabel || filterValue,
            rawValue:     filterValue,
          }
        }));
        hidePanel();
        input.focus();
      }
      // If no chip container — let the href navigate normally
    }
  });

}());
