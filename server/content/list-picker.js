/**
 * The picker's list body: rows matching ?q=, a create row when nothing matches,
 * or with `created`, the new list as one ticked row.
 * Membership is stateless — "Reading list" is always the member, so a tick made
 * in the browser is lost on re-render.
 */

const slugify = require('./slugify');

const LISTS = [
  { slug: 'reading', name: 'Reading list', member: true },
  { slug: 'quantum', name: 'Quantum computing refs' },
  { slug: 'review', name: 'To cite in review' },
];

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escape = value => String(value).replace(/[&<>"]/g, ch => ESCAPES[ch]);

function renderRow(prefix, slug, name, member) {
  const method = member ? `hx-delete="/lists/${slug}"` : `hx-put="/lists/${slug}"`;
  return `
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="${prefix}-${slug}"${member ? ' checked' : ''}
    ${method} hx-swap="none" hx-indicator="#${prefix}-saving">
  <label class="form-check-label" for="${prefix}-${slug}">${escape(name)}</label>
</div>`;
}

module.exports = function renderListPicker(prefix, q = '', created = false) {
  const query = q.trim();

  if (created) return renderRow(prefix, slugify(query), query, true);

  const matches = LISTS.filter(list => list.name.toLowerCase().includes(query.toLowerCase()));
  if (matches.length) {
    return matches.map(list => renderRow(prefix, list.slug, list.name, list.member)).join('');
  }

  return `
<form hx-post="/lists" hx-target="#${prefix}-lists" hx-swap="innerHTML" hx-indicator="#${prefix}-saving">
  <input type="hidden" name="name" value="${escape(query)}">
  <button type="submit" class="dropdown-item">
    <i class="if if-add if--xs me-2" aria-hidden="true"></i> Create &ldquo;${escape(query)}&rdquo;
  </button>
</form>`;
};
