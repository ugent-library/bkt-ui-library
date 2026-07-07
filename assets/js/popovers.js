/**
 * popovers.js
 * Initialises Bootstrap popovers, including inside HTMX-swapped fragments.
 *
 * Pattern:
 *   <i class="if if-orcid" data-bs-toggle="popover" data-bs-trigger="hover"
 *      data-bs-container="body" data-bs-content="ORCID: 0000-0002-1234-5678"
 *      aria-hidden="true"></i>
 *
 * data-bs-container="body" is required on triggers inside links — otherwise
 * the popover is injected into the <a> and becomes part of the click target.
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
