/**
 * directory-search.js — scoped typeahead for one directory page.
 * Prototype: filters an inline JSON dataset client-side and renders
 * suggestion rows; does not filter the page's result list.
 * Production: replace with GET /{directory}/suggest?q=&hellip; returning rows.
 */

(function () {
  'use strict';

  const MAX_RESULTS = 7;

  document.querySelectorAll('[data-directory-search]').forEach(init);

  function init(wrapper) {
    const input  = wrapper.querySelector('input[type="search"]');
    const panel  = wrapper.querySelector('.bt-suggest-panel');
    const source = wrapper.querySelector('script[data-suggest-source]');
    if (!input || !panel || !source) return;

    let data = [];
    try {
      data = JSON.parse(source.textContent);
    } catch (e) {
      return;
    }

    const scope = wrapper.getAttribute('data-directory-search') || 'entries';

    // ── Show / hide ──────────────────────────────────────────────────────────

    function show() {
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function hide() {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }

    // ── Matching + rendering ───────────────────────────────────────────────────

    function update() {
      const q = input.value.trim().toLowerCase();
      if (!q) { hide(); return; }

      // Match against both the label and the meta line, so a name, a
      // department, or an identifier all surface the right row.
      const matches = data
        .filter(item =>
          item.label.toLowerCase().includes(q) ||
          (item.meta && item.meta.toLowerCase().includes(q)))
        .slice(0, MAX_RESULTS);

      if (!matches.length) {
        panel.innerHTML =
          '<p class="p-4 text-muted small text-center mb-0">' +
          'No ' + esc(scope) + ' match “' + esc(input.value.trim()) + '”' +
          '</p>';
        show();
        return;
      }

      const rows = matches.map(item => `
        <li>
          <a href="${esc(item.href)}"
            class="d-flex align-items-start gap-3 py-2 px-2 rounded text-decoration-none text-body"
            role="option">
            <i class="if ${esc(item.icon || 'if-search')} if--sm text-muted flex-shrink-0 mt-1" aria-hidden="true"></i>
            <div class="min-w-0">
              <div>${highlight(item.label, q)}</div>
              ${item.meta ? `<div class="small text-muted">${esc(item.meta)}</div>` : ''}
            </div>
            <i class="if if-arrow-right if--xs ms-auto text-muted align-self-center" aria-hidden="true"></i>
          </a>
        </li>`).join('');

      panel.innerHTML = `
        <div class="bt-suggest-panel__body">
          <ul class="list-unstyled mb-0 p-2">${rows}</ul>
        </div>`;
      show();
    }

    // ── Events ─────────────────────────────────────────────────────────────────

    input.addEventListener('input', update);
    input.addEventListener('focus', () => {
      if (input.value.trim().length > 0) update();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hide();
      } else if (e.key === 'ArrowDown' && !panel.hidden) {
        e.preventDefault();
        const first = panel.querySelector('a[role="option"]');
        if (first) first.focus();
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
        hide();
        input.focus();
      }
    });

    // Hide on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) hide();
    });

    // Production: the form would navigate to the directory.
    const form = input.closest('form');
    if (form) form.addEventListener('submit', hide);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Escape the label, then wrap the first case-insensitive match of the query
  // in <mark>. Operates on the already-escaped string so the query (also
  // escaped) lines up with what is rendered.
  function highlight(label, query) {
    const safeLabel = esc(label);
    const safeQuery = esc(query);
    const at = safeLabel.toLowerCase().indexOf(safeQuery.toLowerCase());
    if (at === -1) return safeLabel;
    return (
      safeLabel.slice(0, at) +
      '<mark>' + safeLabel.slice(at, at + safeQuery.length) + '</mark>' +
      safeLabel.slice(at + safeQuery.length)
    );
  }
}());
