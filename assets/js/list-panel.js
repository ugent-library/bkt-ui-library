/** list-panel.js — see docs/JAVASCRIPT.md. */

(function () {
  const PANEL = '.dropdown-menu[data-search-first]';

  function focusSearch(panel) {
    if (!panel || !panel.classList.contains('show')) return;
    const box = panel.querySelector('input[type="search"]');
    if (box) box.focus();
  }

  document.addEventListener('shown.bs.dropdown', function (event) {
    focusSearch(event.target.closest('.dropdown')?.querySelector(PANEL));
  });

  document.body.addEventListener('htmx:afterSwap', function (event) {
    if (event.detail.target.matches?.(PANEL)) focusSearch(event.detail.target);
  });
})();
