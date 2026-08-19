// search-clear.js — the search box's inline × follows what the box holds.
(function () {
  if (window.btSearchClearInitialised) return;
  window.btSearchClearInitialised = true;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.bt-search-clear').forEach(function (clear) {
      var input = clear.previousElementSibling;
      if (!input || input.tagName !== 'INPUT') return;

      function sync() {
        clear.hidden = input.value.trim() === '';
      }

      input.addEventListener('input', sync);
      sync();
    });
  });
})();
