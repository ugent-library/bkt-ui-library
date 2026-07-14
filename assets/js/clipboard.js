/**
 * clipboard.js
 * Copy button: copies the <code> sitting next to a [data-clipboard] button.
 *
 *   <button class="btn ..." data-clipboard aria-label="Copy link">
 *     <i class="if if-copy" aria-hidden="true"></i>
 *     <span class="btn-text">Biblio ID</span>   <!-- optional -->
 *   </button>
 *   <code>01G3TZB614X7XXR52JYYGAND25</code>
 *
 * Copies the sibling <code>, so what's shown and what's copied can't drift apart.
 * Button and <code> can be in either order inside the shared parent.
 *
 * Confirms for 2s: icon swaps to a check; a .btn-text label also swaps to
 * "Copied!". Icon-only buttons get a temporary aria-label, and their original
 * one is restored after — without it they'd lose their accessible name.
 */

(function () {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-clipboard]');
    if (!button) return;

    const code = button.parentElement.querySelector('code');
    if (!code) return;

    const value = code.textContent.trim();
    if (!value) return;

    navigator.clipboard.writeText(value).then(function () {
      const label = button.querySelector('.btn-text');
      const icon = button.querySelector('.if-copy');
      const originalText = label ? label.textContent : null;
      const originalAria = button.getAttribute('aria-label');

      if (label) label.textContent = 'Copied!';
      else button.setAttribute('aria-label', 'Copied to clipboard');
      button.classList.replace('btn-outline-secondary', 'btn-outline-success');
      if (icon) icon.classList.replace('if-copy', 'if-check');

      setTimeout(function () {
        if (label) label.textContent = originalText;
        if (originalAria !== null) button.setAttribute('aria-label', originalAria);
        else button.removeAttribute('aria-label');
        button.classList.replace('btn-outline-success', 'btn-outline-secondary');
        if (icon) icon.classList.replace('if-check', 'if-copy');
      }, 2000);
    }).catch(function () {
      // clipboard unavailable or denied — user can still select the code manually
    });
  });
})();
