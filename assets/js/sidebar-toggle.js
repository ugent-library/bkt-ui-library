/**
 * sidebar-toggle.js
 * Backoffice sidebar collapse/expand toggle.
 *
 * The toggle button controls the nav referenced by aria-controls and keeps
 * aria-expanded / aria-label in sync with the visual slim state.
 */
(function () {
  function updateToggleState(button, sidebar, isSlim) {
    sidebar.classList.toggle('bt-sidebar--slim', isSlim);
    button.setAttribute('aria-expanded', String(!isSlim));
    button.setAttribute('aria-label', isSlim ? 'Expand sidebar' : 'Collapse sidebar');
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.bt-sidebar__toggle');
    if (!button) return;

    var controlsId = button.getAttribute('aria-controls');
    if (!controlsId) return;

    var sidebar = document.getElementById(controlsId);
    if (!sidebar) return;

    var willBeSlim = !sidebar.classList.contains('bt-sidebar--slim');
    updateToggleState(button, sidebar, willBeSlim);
  });
})();
