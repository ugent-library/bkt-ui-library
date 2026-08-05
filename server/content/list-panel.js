/**
 * The add-to-list panel (patterns/panel.html), lazy-loaded per record.
 * The id prefix keeps open panels from colliding; the form scopes `q` and gives
 * Enter a submit path.
 * Real impl: with no session this returns the login prompt body instead.
 */

const renderListPicker = require('./list-picker');

module.exports = function renderListPanel(prefix) {
  return `
<p class="bt-panel__title">Add this work to a list</p>
<div class="bt-panel__body">
  <form class="w-100" action="/lists" method="get"
    hx-get="/lists" hx-target="#${prefix}-lists" hx-swap="innerHTML" hx-indicator="#${prefix}-searching">
    <label class="visually-hidden" for="${prefix}-search">Search your lists</label>
    <input type="search" class="form-control form-control-sm" id="${prefix}-search" name="q"
      placeholder="Search your lists&hellip;" autocomplete="off"
      hx-get="/lists" hx-trigger="input changed delay:200ms, search"
      hx-target="#${prefix}-lists" hx-swap="innerHTML" hx-indicator="#${prefix}-searching">
    <span id="${prefix}-searching" class="htmx-indicator text-muted small" aria-live="polite">Searching&hellip;</span>
    <span id="${prefix}-saving" class="htmx-indicator text-muted small" aria-live="polite">Saving&hellip;</span>
    <button type="submit" class="visually-hidden">Search lists</button>
  </form>
</div>
<div class="bt-panel__body bt-panel__body--checklist" role="group" aria-label="Your lists" id="${prefix}-lists">${renderListPicker(prefix)}</div>`;
};
