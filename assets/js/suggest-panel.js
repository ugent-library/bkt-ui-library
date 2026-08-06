/**
 * suggest-panel.js — show/hide and keyboard behaviour for the autocomplete panel.
 * See docs/JAVASCRIPT.md.
 *
 * Requires in the host page:
 *   #q                — the search input
 *   #suggest-panel    — the panel wrapper (must exist in DOM at page load)
 *   #suggest-wrapper  — the container (used for outside-click detection)
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

  let suppressFocusOpen = false;

  function markDismissed() {
    input.dataset.suggestDismissedValue = input.value;
  }

  function isDismissed() {
    return input.dataset.suggestDismissedValue === input.value;
  }

  function clearDismissed() {
    delete input.dataset.suggestDismissedValue;
  }

  function dismissPanel() {
    hidePanel();
    markDismissed();
    suppressFocusOpen = true;
    input.focus();
    requestAnimationFrame(() => {
      suppressFocusOpen = false;
    });
  }

  // ── Type filtering ────────────────────────────────────────────────────────

  function initTypeFilter() {
    const nav = panel.querySelector('#suggest-tabs');
    const body = panel.querySelector('#suggest-result-list');
    if (!nav || !body || body.dataset.suggestFilterBound) return;

    const buttons = [...nav.querySelectorAll('[data-suggest-filter]')];
    if (!buttons.length) return;
    body.dataset.suggestFilterBound = 'true';

    function selectType(group) {
      buttons.forEach((button) => {
        const current = button.dataset.suggestFilter === group;
        button.classList.toggle('active', current);
        button.tabIndex = current ? 0 : -1;
        button.setAttribute('aria-selected', String(current));
        if (current) body.setAttribute('aria-labelledby', button.id);
      });

      body.querySelectorAll('[data-suggest-section]').forEach((section) => {
        section.hidden = group !== 'all' && section.dataset.suggestSection !== group;
      });
      body.querySelectorAll('[data-suggest-all-only]').forEach((section) => {
        if (!section.dataset.suggestAllHidden) {
          section.dataset.suggestAllHidden = String(section.hidden);
        }
        section.hidden = group !== 'all' || section.dataset.suggestAllHidden === 'true';
      });
      body.scrollTop = 0;
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => selectType(button.dataset.suggestFilter));
      button.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          next = (index + 1) % buttons.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          next = (index - 1 + buttons.length) % buttons.length;
        } else if (event.key === 'Home') {
          next = 0;
        } else if (event.key === 'End') {
          next = buttons.length - 1;
        } else if (event.key === 'Escape') {
          dismissPanel();
          return;
        } else {
          return;
        }

        event.preventDefault();
        selectType(buttons[next].dataset.suggestFilter);
        buttons[next].focus();
      });
    });

    const initial = buttons.find((button) => button.getAttribute('aria-selected') === 'true');
    selectType(initial?.dataset.suggestFilter || 'all');
  }

  // Show when focused with a value
  input.addEventListener('focus', () => {
    if (suppressFocusOpen) return;
    if (isDismissed()) return;
    if (input.value.trim().length > 0) showPanel();
  });

  // Show on keyup whenever the input has content
  // (covers the case where HTMX has no real endpoint in the prototype)
  input.addEventListener('keyup', (event) => {
    // When Escape moves focus here from a suggestion row, the keyup targets
    // the input. Keep the panel closed instead of treating that keyup as text.
    if (event.key === 'Escape') {
      markDismissed();
      hidePanel();
      return;
    }
    clearDismissed();
    if (input.value.trim().length > 0) showPanel();
    else hidePanel();
  });

  // Show after HTMX swap if input still has a value
  document.body.addEventListener('htmx:afterSwap', (e) => {
    if (e.detail.target === panel) {
      initTypeFilter();
      if (input.value.trim().length > 0 && !isDismissed()) showPanel();
      else hidePanel();
    }
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
      markDismissed();
      hidePanel();
      return;
    }
    if (e.key === 'ArrowDown' && !panel.hidden) {
      e.preventDefault();
      const rows = [...panel.querySelectorAll('a[role="option"]')]
        .filter((row) => !row.closest('[hidden]'));
      if (rows.length) rows[0].focus();
    }
  });

  panel.addEventListener('keydown', (e) => {
    if (e.target.closest('[data-suggest-filter]')) return;

    const rows = [...panel.querySelectorAll('a[role="option"]')]
      .filter((row) => !row.closest('[hidden]'));
    const current = document.activeElement;
    const idx     = rows.indexOf(current);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < rows.length - 1) rows[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx > 0 ? rows[idx - 1].focus() : input.focus();
    } else if (e.key === 'Escape') {
      dismissPanel();
    }
  });

  initTypeFilter();

}());
