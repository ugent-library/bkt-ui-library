/**
 * popovers.js — Bootstrap popovers, including inside HTMX-swapped fragments.
 * See docs/JAVASCRIPT.md.
 */

(function () {
  function init(root) {
    root.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
      bootstrap.Popover.getOrCreateInstance(el);
    });
  }

  init(document);
  document.body.addEventListener('htmx:afterSwap', function (event) {
    init(event.target);
  });
})();
