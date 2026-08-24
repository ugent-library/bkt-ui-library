(() => {
  const actions = document.querySelector('[data-result-actions]');
  if (!actions) return;

  const toggle = actions.querySelector('[data-result-actions-toggle]');

  document.addEventListener('hidden.bs.modal', (event) => {
    if (!event.target.matches('[data-result-actions-modal]')) return;
    toggle.focus();
  });
})();
