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
 * Row routing — "type decides":
 *   Every row navigates via its href. People → profile, Works → detail,
 *   Org/Project/Keyword → filtered search (/search?…). Applied filters appear
 *   in the server-rendered chip row above the results, not added from here.
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

}());
