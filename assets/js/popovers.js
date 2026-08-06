/**
 * popovers.js — Bootstrap popovers, including inside HTMX-swapped fragments.
 * See docs/JAVASCRIPT.md.
 *
 * Triggers inside links need data-bs-container="body", or the popover is
 * injected into the <a> and becomes part of the click target.
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
