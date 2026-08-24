// View toggle — see docs/JAVASCRIPT.md
(function () {
  const toggles = document.querySelectorAll('[data-view-toggle]');
  if (!toggles.length) return;
  const panels = document.querySelectorAll('[data-view-panel]');

  toggles.forEach(t => t.addEventListener('change', () => {
    panels.forEach(p => { p.hidden = p.dataset.viewPanel !== t.dataset.viewToggle; });
  }));
})();
