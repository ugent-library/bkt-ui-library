// org-tree.js — expand/collapse all for the public organisation tree (prototype).
(function () {
  if (window.btOrgTreeInitialised) return;
  window.btOrgTreeInitialised = true;

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('org-tree-toggle-all');
    var tree = document.querySelector('[aria-label="Organisation tree"]');
    if (!btn || !tree) return;

    var label = btn.querySelector('[data-toggle-label]') || btn;

    btn.addEventListener('click', function () {
      var expand = btn.getAttribute('aria-expanded') !== 'true';
      tree.querySelectorAll('.collapse').forEach(function (el) {
        var instance = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
        if (expand) { instance.show(); } else { instance.hide(); }
      });
      btn.setAttribute('aria-expanded', String(expand));
      label.textContent = expand ? 'Collapse all departments' : 'Expand all departments';
    });
  });
})();
