// Bulk select — see docs/JAVASCRIPT.md
(function () {
  const bar = document.querySelector('[data-bulk-bar]');
  if (!bar) return;
  const all = document.querySelector('[data-bulk-all]');
  const rows = () => document.querySelectorAll('[data-bulk-row]');

  function update() {
    const boxes = [...rows()];
    const checked = boxes.filter(b => b.checked).length;
    bar.hidden = checked === 0;
    if (!all) return;
    all.checked = checked === boxes.length && boxes.length > 0;
    all.indeterminate = checked > 0 && checked < boxes.length;
    all.setAttribute('aria-label',
      all.indeterminate ? 'Some records selected — click to select all'
      : all.checked ? 'All records selected — click to deselect all'
      : 'Select all records on this page');
  }

  rows().forEach(b => b.addEventListener('change', update));
  if (all) all.addEventListener('change', () => {
    rows().forEach(b => { b.checked = all.checked; });
    update();
  });
})();
