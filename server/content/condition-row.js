module.exports = function renderConditionRow(id) {
  return `
<div class="d-flex gap-2 align-items-center mb-2" id="cond-${id}">
  <select name="field[${id}]" class="form-select w-50">
    <option value="year" selected>Publication year</option>
    <option value="type">Type</option>
    <option value="author">Author</option>
  </select>
  <select name="operator[${id}]" class="form-select w-auto">
    <option value="is" selected>is</option>
    <option value="contains">contains</option>
  </select>
  <input type="text" name="value[${id}]" class="form-control" value="2024">
  <button type="button" class="btn btn-ghost btn-sm" hx-delete="/search/conditions/${id}" hx-target="#cond-${id}" hx-swap="outerHTML" aria-label="Remove condition">
    <i class="if if-delete if--sm" aria-hidden="true"></i>
  </button>
</div>`;
};
