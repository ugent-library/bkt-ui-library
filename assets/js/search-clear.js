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

      // A field whose box filters a list in place clears with a button: there is
      // no address to navigate to, so the click does the clearing, and the list
      // it filters re-reads the box from the same event a keystroke would send.
      if (clear.tagName === 'BUTTON') {
        clear.addEventListener('click', function () {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        });
      }
    });
  });
})();
