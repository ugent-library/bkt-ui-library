// View toggle — see docs/JAVASCRIPT.md
(function () {
  const toggles = document.querySelectorAll('[data-view-toggle]');
  if (!toggles.length) return;
  const panels = document.querySelectorAll('[data-view-panel]');
  const store = document.querySelector('[data-view-store]')?.dataset.viewStore;

  function setView(view) {
    panels.forEach(p => { p.hidden = p.dataset.viewPanel !== view; });
    toggles.forEach(t => { t.checked = t.dataset.viewToggle === view; });
    if (store) { try { localStorage.setItem(store, view); } catch (e) {} }
  }

  toggles.forEach(t => t.addEventListener('change', () => setView(t.dataset.viewToggle)));
  if (store) { try { const v = localStorage.getItem(store); if (v) setView(v); } catch (e) {} }
})();
