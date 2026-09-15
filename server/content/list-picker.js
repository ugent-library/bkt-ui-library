const slugify = require('./slugify');

const LISTS = [
  { slug: 'reading', name: 'Reading list', member: true },
  { slug: 'quantum', name: 'Quantum computing refs' },
  { slug: 'review', name: 'To cite in review' },
];

const LIST_PAGE = '/templates/biblio-researcher/list-detail.html';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escape = value => String(value).replace(/[&<>"]/g, ch => ESCAPES[ch]);

function renderRow(prefix, slug, name, member) {
  const method = member ? `hx-delete="/lists/${slug}"` : `hx-put="/lists/${slug}"`;
  // htmx-routes.js reads the prefix back out of this id.
  const rowId = `${prefix}-${slug}-row`;
  const open = member
    ? `
  <a href="${LIST_PAGE}" class="bt-link-more" aria-label="Open ${escape(name)}">Open <i class="if if-arrow-right if--xs" aria-hidden="true"></i></a>`
    : '';
  return `
<div class="form-check" id="${rowId}">
  <input class="form-check-input" type="checkbox" id="${prefix}-${slug}"${member ? ' checked' : ''}
    ${method} hx-target="#${rowId}" hx-swap="outerHTML" hx-indicator="#${prefix}-saving">
  <label class="form-check-label" for="${prefix}-${slug}">${escape(name)}</label>${open}
</div>`;
}

const listName = slug => (LISTS.find(list => list.slug === slug) || { name: slug.replace(/-/g, ' ') }).name;

function renderListPicker(prefix, q = '', created = false) {
  const query = q.trim();

  if (created) return renderRow(prefix, slugify(query), query, true);

  const needle = query.toLowerCase();
  const matches = LISTS.filter(list => list.name.toLowerCase().includes(needle));
  const rows = matches.map(list => renderRow(prefix, list.slug, list.name, list.member)).join('');

  if (!query || LISTS.some(list => list.name.toLowerCase() === needle)) return rows;

  return rows + `
<form hx-post="/lists" hx-target="#${prefix}-lists" hx-swap="innerHTML" hx-indicator="#${prefix}-saving">
  <input type="hidden" name="name" value="${escape(query)}">
  <button type="submit" class="dropdown-item">
    <i class="if if-add if--xs me-2" aria-hidden="true"></i> Create &ldquo;${escape(query)}&rdquo;
  </button>
</form>`;
}

renderListPicker.renderRow = (prefix, slug, member) => renderRow(prefix, slug, listName(slug), member);

module.exports = renderListPicker;
