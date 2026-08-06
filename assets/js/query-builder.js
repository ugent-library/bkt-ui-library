// Advanced search, phase 2 — row ⇄ OR group + the readable sentence. See docs/JAVASCRIPT.md
(function () {
  const list = document.getElementById('qb-conditions');
  const preview = document.querySelector('[data-qb-preview]');
  if (!list || !preview) return;

  let seq = 0;

  const items = () => Array.from(list.querySelectorAll(':scope > [data-qb-item]'));
  const alts = g => Array.from(g.querySelectorAll('[data-qb-alts] > [data-qb-row]'));

  const esc = s => String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const NOUNS = { field: 'Field', op: 'Operator', value: 'Value' };

  function part(row, key) {
    return row.querySelector('[data-qb-' + key + ']');
  }
  function chosen(row, key) {
    const el = part(row, key);
    return el ? el.options[el.selectedIndex].text : '';
  }
  function fieldText(row) {
    return chosen(row, 'field').replace(/\s*\(.*\)$/, '').toLowerCase();
  }
  function value(row) {
    const el = part(row, 'value');
    return el ? (el.value || '').trim() : '';
  }
  function plain(row) {
    return [fieldText(row), chosen(row, 'op'), value(row) || '…'].join(' ');
  }
  function rich(row) {
    return esc(fieldText(row)) + ' ' + esc(chosen(row, 'op')) +
      ' <span class="badge text-bg-primary-light">' + esc(value(row) || '…') + '</span>';
  }

  function sep(word) {
    const p = document.createElement('p');
    p.className = 'small text-muted my-2';
    p.setAttribute('data-qb-sep', '');
    p.textContent = word;
    return p;
  }

  function actions(row, mode) {
    const remove = '<button type="button" class="btn btn-ghost btn-sm" data-qb-remove-' +
      (mode === 'alternative' ? 'alt' : 'row') + ' aria-label="Remove ' + mode + ': ' +
      esc(plain(row)) + '">' +
      '<i class="if if-close if--xs" aria-hidden="true"></i></button>';
    if (mode === 'alternative') return remove;
    return '<button type="button" class="btn btn-ghost btn-sm" data-qb-make-group ' +
      'aria-label="Add an alternative to condition: ' + esc(plain(row)) + '">' +
      '<i class="if if-add if--xs" aria-hidden="true"></i> Add an alternative</button>' + remove;
  }

  function dress(row, mode, n) {
    const cell = row.querySelector('[data-qb-actions]');
    if (cell) cell.innerHTML = actions(row, mode);
    Object.keys(NOUNS).forEach(key => {
      const el = part(row, key);
      const label = el && row.querySelector('label[for="' + el.id + '"]');
      if (label) label.textContent = NOUNS[key] + ', ' + mode + ' ' + n;
    });
  }

  function renumber(row) {
    seq += 1;
    row.querySelectorAll('[id]').forEach(el => {
      const label = row.querySelector('label[for="' + el.id + '"]');
      el.id = el.id.replace(/-c\d+$/, '') + '-c' + seq;
      if (label) label.setAttribute('for', el.id);
    });
  }

  function copyOf(row) {
    const copy = row.cloneNode(true);
    renumber(copy);
    const v = part(copy, 'value');
    if (v) v.value = '';
    return copy;
  }

  // A row becomes a group in place: it keeps its slot in the AND list and becomes the
  // first alternative, so a group and a row are interchangeable at the top level.
  function toGroup(row) {
    seq += 1;
    const labelId = 'qb-group-' + seq;
    const g = document.createElement('div');
    g.className = 'border rounded-3 p-3 bt-bg-alt';
    g.setAttribute('role', 'group');
    g.setAttribute('aria-labelledby', labelId);
    g.setAttribute('data-qb-item', '');
    g.setAttribute('data-qb-group', '');
    g.innerHTML =
      '<div class="d-flex flex-wrap align-items-center gap-2 mb-3">' +
        '<p class="h6 mb-0" id="' + labelId + '">Any of these</p>' +
        '<button type="button" class="btn btn-ghost btn-sm ms-auto" data-qb-remove-group>' +
          '<i class="if if-close if--xs" aria-hidden="true"></i> Remove group</button>' +
      '</div>' +
      '<div data-qb-alts></div>' +
      '<div class="mt-3"><button type="button" class="btn btn-ghost btn-sm" data-qb-add-alt>' +
        '<i class="if if-add if--xs" aria-hidden="true"></i> Add an alternative</button></div>';
    row.replaceWith(g);
    const holder = g.querySelector('[data-qb-alts]');
    row.removeAttribute('data-qb-item');
    holder.append(row, copyOf(row));
  }

  function sync() {
    list.querySelectorAll('[data-qb-sep]').forEach(el => el.remove());
    const top = items();

    top.forEach((item, i) => {
      if (i) item.before(sep('and'));
      if (item.hasAttribute('data-qb-group')) {
        alts(item).forEach((a, j) => {
          if (j) a.before(sep('or'));
          dress(a, 'alternative', j + 1);
        });
      } else {
        dress(item, 'condition', i + 1);
      }
    });

    if (!top.length) {
      preview.textContent = 'All publications.';
      return;
    }
    const sentence = top.map(item => item.hasAttribute('data-qb-group')
      ? 'either ' + alts(item).map(rich).join(' or ')
      : rich(item)).join(', and ');
    preview.innerHTML = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !list.contains(button)) return;

    if (button.hasAttribute('data-qb-make-group')) {
      toGroup(button.closest('[data-qb-item]'));
    } else if (button.hasAttribute('data-qb-add-alt')) {
      const g = button.closest('[data-qb-group]');
      g.querySelector('[data-qb-alts]').append(copyOf(alts(g).slice(-1)[0]));
    } else if (button.hasAttribute('data-qb-remove-alt')) {
      const g = button.closest('[data-qb-group]');
      button.closest('[data-qb-row]').remove();
      const left = alts(g);
      // one alternative left is not a group any more: it collapses back to a plain row
      if (left.length === 1) {
        left[0].setAttribute('data-qb-item', '');
        g.replaceWith(left[0]);
      } else if (!left.length) {
        g.remove();
      }
    } else if (button.hasAttribute('data-qb-remove-group') ||
               button.hasAttribute('data-qb-remove-row')) {
      button.closest('[data-qb-item]').remove();
    } else {
      return;
    }
    sync();
  });

  const addCondition = document.querySelector('[data-qb-add-condition]');
  if (addCondition) {
    addCondition.addEventListener('click', () => {
      // A real new row starts fieldless — picking the field is what builds the operator
      // list and the value widget. Cloning an existing row is the prototype's stand-in.
      const source = list.querySelector('[data-qb-row]');
      if (!source) return;
      const copy = copyOf(source);
      copy.setAttribute('data-qb-item', '');
      list.append(copy);
      sync();
    });
  }

  list.addEventListener('input', sync);
  list.addEventListener('change', sync);

  sync();
})();
