// Copy button — see docs/JAVASCRIPT.md
(function () {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-clipboard]');
    if (!button) return;

    const targetSel = button.getAttribute('data-clipboard-target');
    const source = targetSel
      ? document.querySelector(targetSel)
      : button.parentElement.querySelector('code');
    if (!source) return;

    const value = source.textContent.trim();
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
        // restore, don't remove: icon-only buttons rely on it for their name
        if (originalAria !== null) button.setAttribute('aria-label', originalAria);
        else button.removeAttribute('aria-label');
        button.classList.replace('btn-outline-success', 'btn-outline-secondary');
        if (icon) icon.classList.replace('if-check', 'if-copy');
      }, 2000);
    }).catch(function () {});
  });
})();
