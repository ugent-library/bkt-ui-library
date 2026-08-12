/**
 * sidebar-toggle.js — backoffice sidebar collapse/expand toggle.
 * See docs/JAVASCRIPT.md.
 *
 * Also initialises Bootstrap tooltips on sidebar nav links so they stay
 * discoverable in slim (icon-only) mode.
 */
(function () {
  if (window.btSidebarToggleInitialised) return;
  window.btSidebarToggleInitialised = true;

  var narrowSidebarQuery = window.matchMedia('(max-width: 1199.98px)');

  function updateToggleState(button, sidebar, isSlim) {
    sidebar.classList.toggle('bt-sidebar--slim', isSlim);
    button.setAttribute('aria-expanded', String(!isSlim));
    button.setAttribute('aria-label', isSlim ? 'Expand sidebar' : 'Collapse sidebar');
  }

  function applyInitialState() {
    var sidebar = document.getElementById('bt-sidebar');
    if (!sidebar) return;

    var button = document.querySelector('.bt-sidebar__toggle button[aria-controls="bt-sidebar"]');
    if (!button) return;

    updateToggleState(button, sidebar, narrowSidebarQuery.matches);
  }

  function syncWithViewport() {
    var sidebar = document.getElementById('bt-sidebar');
    if (!sidebar) return;

    var button = document.querySelector('.bt-sidebar__toggle button[aria-controls="bt-sidebar"]');
    if (!button) return;

    updateToggleState(button, sidebar, narrowSidebarQuery.matches);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.bt-sidebar__toggle button');
    if (!button) return;

    var controlsId = button.getAttribute('aria-controls');
    if (!controlsId) return;

    var sidebar = document.getElementById(controlsId);
    if (!sidebar) return;

    var willBeSlim = !sidebar.classList.contains('bt-sidebar--slim');
    updateToggleState(button, sidebar, willBeSlim);
  });

  // Runs after DOMContentLoaded so Bootstrap is guaranteed to be available.
  document.addEventListener('DOMContentLoaded', function () {
    applyInitialState();
    narrowSidebarQuery.addEventListener('change', syncWithViewport);

    var tooltipEls = document.querySelectorAll('.bt-sidebar a.nav-link[data-bs-toggle="tooltip"]');
    tooltipEls.forEach(function (el) {
      new bootstrap.Tooltip(el, { placement: 'right' });
    });
  });
})();
