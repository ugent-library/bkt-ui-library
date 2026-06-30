module.exports = function renderAuthorList(name = 'Baker, Josephine') {
  return `
<div class="d-flex align-items-center gap-3 p-3 bg-white border rounded">
  <span class="bt-avatar bt-avatar--small" aria-hidden="true">ER</span>
  <div class="flex-grow-1">
    <div class="small fw-semibold">Esperon-Rodriguez, Manuel</div>
    <div class="text-muted small">External</div>
  </div>
  <button type="button" class="btn btn-ghost btn-sm p-1" aria-label="Remove Esperon-Rodriguez, Manuel from authors">
    <i class="if if-delete if--sm" aria-hidden="true"></i>
  </button>
</div>
<div class="d-flex align-items-center gap-3 p-3 bg-white border rounded">
  <span class="bt-avatar bt-avatar--small" aria-hidden="true">KD</span>
  <div class="flex-grow-1">
    <div class="small fw-semibold">De Pauw, Karen</div>
    <div class="text-muted small">UGent — Department of Environment</div>
  </div>
  <button type="button" class="btn btn-ghost btn-sm p-1" aria-label="Remove De Pauw, Karen from authors">
    <i class="if if-delete if--sm" aria-hidden="true"></i>
  </button>
</div>
<div class="d-flex align-items-center gap-3 p-3 bg-white border rounded border-success-subtle">
  <span class="bt-avatar bt-avatar--small" aria-hidden="true">JB</span>
  <div class="flex-grow-1">
    <div class="small fw-semibold">${name}</div>
    <div class="text-muted small">Added just now</div>
  </div>
  <span class="badge bg-success-subtle text-success-emphasis">New</span>
</div>`;
};
