module.exports = function renderUploadList() {
  return `
<div class="bg-white border rounded p-3 d-flex align-items-center gap-3">
  <i class="if if-file-pdf text-muted" aria-hidden="true"></i>
  <div class="flex-grow-1">
    <div class="small fw-semibold">publisher-version.pdf</div>
    <div class="text-muted small">2.1 MB · uploaded just now</div>
  </div>
  <button type="button" class="btn btn-ghost btn-sm">Remove</button>
</div>`;
};
