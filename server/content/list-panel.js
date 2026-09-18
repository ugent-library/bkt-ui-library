const renderListPicker = require('./list-picker');

module.exports = function renderListPanel(prefix) {
  return `
<p class="bt-panel__title">Add this work to a list</p>
<div class="bt-panel__body">
  <form class="w-100" action="/lists" method="get"
    hx-get="/lists" hx-target="#${prefix}-lists" hx-swap="innerHTML" hx-indicator="#${prefix}-lists">
    <label class="visually-hidden" for="${prefix}-search">Search your lists</label>
    <input type="search" class="form-control form-control-sm" id="${prefix}-search" name="q"
      placeholder="Search your lists&hellip;" autocomplete="off"
      hx-get="/lists" hx-trigger="input changed delay:200ms, search"
      hx-target="#${prefix}-lists" hx-swap="innerHTML" hx-indicator="#${prefix}-lists">
  </form>
</div>
<div class="bt-panel__body bt-panel__body--checklist" role="group" aria-label="Your lists" id="${prefix}-lists">${renderListPicker(prefix)}</div>
<div class="bt-panel__actions">
  <a href="/templates/biblio-researcher/lists.html" class="btn btn-ghost btn-sm">
    My lists <i class="if if-arrow-right if--sm" aria-hidden="true"></i>
  </a>
</div>`;
};
