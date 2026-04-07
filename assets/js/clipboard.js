/**
 * clipboard.js
 * Copies the Biblio ID to clipboard when the copy button is clicked.
 *
 * Pattern:
 *   <button class="btn ..." data-clipboard>
 *     <i class="if if-copy" aria-hidden="true"></i>
 *     <span class="btn-text">Biblio ID</span>
 *   </button>
 *   <code>01G3TZB614X7XXR52JYYGAND25</code>
 *
 * The [data-clipboard] attribute must be on the <button> itself.
 * The ID value is read from the next sibling <code> element.
 *
 * On success: button text changes to "Copied!" for 2 seconds, then resets.
 * On failure: silently ignores (clipboard API unavailable or denied).
 */

(function () {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-clipboard]');
    if (!button) return;

    const code = button.parentElement.querySelector('code');
    if (!code) return;

    const id = code.textContent.trim();
    if (!id) return;

    navigator.clipboard.writeText(id).then(function () {
      const label = button.querySelector('.btn-text');
      if (!label) return;

      const icon = button.querySelector('.if-copy');
      const original = label.textContent;

      label.textContent = 'Copied!';
      button.setAttribute('aria-label', 'Copied to clipboard');
      button.classList.replace('btn-outline-secondary', 'btn-outline-success');
      if (icon) { icon.classList.replace('if-copy', 'if-check'); }

      setTimeout(function () {
        label.textContent = original;
        button.removeAttribute('aria-label');
        button.classList.replace('btn-outline-success', 'btn-outline-secondary');
        if (icon) { icon.classList.replace('if-check', 'if-copy'); }
      }, 2000);
    }).catch(function () {
      // Clipboard write failed — do nothing. User can select the <code> manually.
    });
  });
})();
