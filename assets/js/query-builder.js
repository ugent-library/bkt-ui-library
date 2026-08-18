// Advanced search — rows, OR groups, the chooser, and the approximate count.
// See docs/JAVASCRIPT.md. Row grammar and states: patterns/query-builder.html.

// The dialog is a URL state, so reload keeps it open, Back closes it instead of leaving the
// page, and a pasted link resolves to the page rendering. Production pushes the URL
// server-side with hx-push-url; the kit is static, so this stands in for that.
document.addEventListener('DOMContentLoaded', function () {
  const dialog = document.getElementById('advanced-search-modal');
  if (!dialog) return;

  const modal = bootstrap.Modal.getOrCreateInstance(dialog);
  const isOpen = () => new URLSearchParams(location.search).has('advanced');
  const withOpen = open => {
    const url = new URL(location.href);
    if (open) url.searchParams.set('advanced', '1');
    else url.searchParams.delete('advanced');
    return url;
  };

  if (isOpen()) modal.show();

  dialog.addEventListener('show.bs.modal', () => {
    if (!isOpen()) history.pushState({ advanced: true }, '', withOpen(true));
  });
  // Guarded, so closing in response to Back doesn't push a third entry
  dialog.addEventListener('hide.bs.modal', () => {
    if (isOpen()) history.pushState({}, '', withOpen(false));
  });
  window.addEventListener('popstate', () => (isOpen() ? modal.show() : modal.hide()));
});

(function () {
  const list = document.getElementById('qb-conditions');
  if (!list) return;

  let seq = 0;
  // What the next chooser pick does: add a condition, replace this row's field, or add an
  // alternative to this group.
  let pending = { mode: 'append' };

  const items = () =>
    Array.from(list.querySelectorAll(':scope > [data-qb-row], :scope > [data-qb-group]'));
  const alts = group => Array.from(group.querySelectorAll('[data-qb-alts] > [data-qb-row]'));
  const isSeparator = el => Boolean(el) && el.nodeType === 1 &&
    el.hasAttribute('data-qb-sep');

  function separator(label = 'and') {
    const p = document.createElement('p');
    p.className = 'visually-hidden';
    p.setAttribute('data-qb-sep', '');

    const span = document.createElement('span');
    span.textContent = label;
    p.append(span);

    return p;
  }

  // ── Reading a row back ──────────────────────────────────────────────────────

  function valueOf(row) {
    const cell = row.querySelector('[data-qb-value]');
    if (!cell) return '';
    const tokens = Array.from(cell.querySelectorAll('[data-qb-token]'))
      .map(token => token.textContent.trim());
    if (tokens.length) return tokens.join(', ');
    return Array.from(cell.querySelectorAll('input:not([type="search"]), select, textarea'))
      .map(el => el.tagName === 'SELECT'
        ? el.options[el.selectedIndex].text
        : (el.value || '').trim())
      .filter(Boolean)
      .join(' and ');
  }
  const filled = row => Boolean(valueOf(row));

  function conditionName(row) {
    const field = row.querySelector('[data-qb-change-field]');
    const op = row.querySelector('[data-qb-op]');
    let value = valueOf(row);
    if (value.length > 60) value = value.slice(0, 57) + '…';
    return [
      field ? field.textContent.trim() : 'condition',
      op && op.selectedIndex >= 0 ? op.options[op.selectedIndex].text : '',
      value,
    ].filter(Boolean).join(' ');
  }

  // The row's actions must always name the condition they act on — a screen reader user has to
  // know which row a control removes. Rewritten on every sync, since the value changes.
  function nameRow(row) {
    const name = conditionName(row);
    const more = row.querySelector('[data-qb-actions] [data-bs-toggle="dropdown"]');
    if (more) more.setAttribute('aria-label', 'More actions for ' + name);
    const remove = row.querySelector('[data-qb-remove]');
    if (remove) remove.setAttribute('aria-label', 'Remove ' + name);
  }

  // ── Adding a row ────────────────────────────────────────────────────────────

  // A pick names the template that carries its shape and the label to write into it. No row
  // markup and no field vocabulary lives here — see docs/JAVASCRIPT.md.
  function addRow(choice) {
    const template = document.getElementById(choice.dataset.qbTemplate);
    if (!template) return;
    const row = template.content.firstElementChild.cloneNode(true);
    const label = row.querySelector('[data-qb-change-field]');
    if (label) label.textContent = choice.dataset.qbLabel;
    identify(row);

    if (pending.mode === 'replace') pending.row.replaceWith(row);
    else if (pending.mode === 'alt') pending.group.querySelector('[data-qb-alts]').append(row);
    else list.append(row);
    pending = { mode: 'append' };

    const blank = list.querySelector('[data-qb-blank]');
    if (blank) blank.remove();
    sync();
    count();
    const first = row.querySelector('input, textarea, select');
    if (first) {
      first.focus();
      first.scrollIntoView({ block: 'center' });
    }
  }

  function restoreBlank() {
    if (items().length || list.querySelector('[data-qb-blank]')) return;
    const template = document.getElementById('qb-blank');
    if (!template || !template.content.firstElementChild) return;
    const blank = template.content.firstElementChild.cloneNode(true);
    identify(blank);
    list.append(blank);
    wireSearch(blank);
  }

  // ── Groups ──────────────────────────────────────────────────────────────────

  // A template's controls carry no id, and a clone would repeat one. Pair each control with
  // its label here, once, at the moment the row enters the document.
  function identify(scope) {
    scope.querySelectorAll('[id]').forEach(control => {
      const old = control.id;
      const label = scope.querySelector('label[for="' + old + '"]');
      const labelledby = scope.querySelector('[aria-labelledby="' + old + '"]');
      seq += 1;
      control.id = 'qbn-' + seq;
      if (label) label.setAttribute('for', control.id);
      if (labelledby) labelledby.setAttribute('aria-labelledby', control.id);
    });
  }

  function emptyCopy(row) {
    const copy = row.cloneNode(true);
    // The copy starts with its panels unopened — a filled slot cloned along would repeat every
    // id inside it. Each control fills its own slot on first open anyway.
    copy.querySelectorAll('[data-qb-chooser-slot], [data-qb-person-slot]')
      .forEach(slot => slot.replaceChildren());
    seq += 1;
    copy.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
      const label = copy.querySelector('label[for="' + el.id + '"]');
      const helped = copy.querySelector('[aria-describedby="' + el.id + '-help"]');
      const help = copy.querySelector('#' + el.id + '-help');
      const next = el.id.replace(/-c\d+$/, '') + '-c' + seq;
      if (label) label.setAttribute('for', next);
      if (helped) helped.setAttribute('aria-describedby', next + '-help');
      if (help) help.id = next + '-help';
      el.id = next;
    });
    copy.querySelectorAll('input, textarea').forEach(el => { el.value = ''; });
    copy.querySelectorAll('[data-qb-token]').forEach(el => el.remove());
    return copy;
  }

  // A row becomes a group in place: it keeps its slot in the AND list and becomes the first
  // alternative, so a group and a row are interchangeable at the top level.
  function toGroup(row) {
    const group = document.getElementById('qb-group').content.firstElementChild.cloneNode(true);
    row.replaceWith(group);
    group.querySelector('[data-qb-alts]').append(row, emptyCopy(row));
  }

  function unwrap(group) {
    alts(group).forEach(row => group.before(row));
    group.remove();
  }

  // ── Keeping the whole thing consistent ──────────────────────────────────────

  function sync() {
    // Remove all separators and rebuild them from the current document structure: OR only runs
    // between alternatives within a group; AND only runs between top-level rows outside groups.
    list.querySelectorAll('[data-qb-sep]').forEach(el => el.remove());

    items().forEach(item => {
      if (item.hasAttribute('data-qb-group')) {
        alts(item).forEach((row, j) => {
          row.classList.add('bt-query-builder__row--alt');
          if (j && !isSeparator(row.previousElementSibling)) row.before(separator('or'));
          // With remove promoted out of the menu, "Add an 'or'" is all it holds — and a row
          // already inside a group has no use for it, so the whole menu hides.
          const or = row.querySelector('[data-qb-or]');
          if (or) or.closest('.dropdown').hidden = true;
          nameRow(row);
        });
        return;
      }

      item.classList.remove('bt-query-builder__row--alt');
      const prev = item.previousElementSibling;
      if (prev && prev.matches('.bt-query-builder__row') && !isSeparator(prev)) {
        item.before(separator('and'));
      }
      const or = item.querySelector('[data-qb-or]');
      if (or) or.closest('.dropdown').hidden = false;
      nameRow(item);
    });

    restoreBlank();
  }

  // Bootstrap positions the panel against the control that opened it, so a panel shared by many
  // controls lives in a template and is cloned into that control's own slot the first time it
  // opens: the field chooser, and the person picker the works filter bar opens too.
  document.addEventListener('show.bs.dropdown', event => {
    const people = event.target.parentElement?.querySelector('[data-qb-person-slot]');
    if (people) {
      if (!people.children.length) {
        const picker = document.getElementById('qb-person-picker').content.cloneNode(true);
        identify(picker);
        people.append(picker);
      }
      return;
    }

    const slot = event.target.parentElement?.querySelector('[data-qb-chooser-slot]');
    if (!slot) return;
    if (!slot.children.length) {
      const chooser = document.getElementById('qb-chooser').content.cloneNode(true);
      identify(chooser);
      slot.append(chooser);
      wireSearch(slot);
    }
    const row = event.target.closest('[data-qb-row]');
    const group = event.target.closest('[data-qb-group]');
    if (event.target.hasAttribute('data-qb-change-field')) pending = { mode: 'replace', row: row };
    else if (event.target.hasAttribute('data-qb-add-alt')) pending = { mode: 'alt', group: group };
    else pending = { mode: 'append' };
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !list.contains(button)) return;

    if (button.hasAttribute('data-qb-person-add')) {
      addPeople(button.closest('[data-qb-row]'), button.closest('[data-qb-person-slot]'));
      closeDropdown(button);
    } else if (button.hasAttribute('data-qb-person-cancel')) {
      closeDropdown(button);
    } else if (button.closest('[data-qb-token]')) {
      button.closest('[data-qb-token]').remove();
    } else if (button.hasAttribute('data-qb-or')) {
      toGroup(button.closest('[data-qb-row]'));
    } else if (button.hasAttribute('data-qb-remove-group')) {
      unwrap(button.closest('[data-qb-group]'));
    } else if (button.hasAttribute('data-qb-remove')) {
      const group = button.closest('[data-qb-group]');
      button.closest('[data-qb-row]').remove();
      // one alternative left is not a group any more: it collapses back to a plain row
      if (group && alts(group).length < 2) unwrap(group);
    } else {
      return;
    }
    sync();
    count();
  });

  const clear = document.querySelector('[data-qb-clear]');
  if (clear) clear.addEventListener('click', () => {
    items().forEach(item => item.remove());
    sync();
    count();
  });

  // ── The chooser: one click adds the row ─────────────────────────────────────

  // The blank state's cards and list, and the Add-a-condition panel, are the same content in
  // two containers, so one handler serves both.
  document.addEventListener('click', event => {
    const choice = event.target.closest('[data-qb-choice]');
    if (!choice) return;
    addRow(choice);
    closeDropdown(choice);
    if (pending.mode !== 'append') pending = { mode: 'append' };
  });

  function closeDropdown(inside) {
    const toggle = inside.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]');
    if (toggle && window.bootstrap) bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
  }

  function wireSearch(scope) {
    const search = scope.querySelector('[data-qb-choice-search]');
    if (!search) return;
    search.addEventListener('input', () => {
      const needle = search.value.trim().toLowerCase();
      scope.querySelectorAll('[data-qb-choice]').forEach(choice => {
        choice.hidden = Boolean(needle) &&
          !(choice.dataset.qbLabel + ' ' + choice.textContent).toLowerCase().includes(needle);
      });
      scope.querySelectorAll('[data-qb-choice-group]').forEach(group => {
        group.hidden = !group.querySelector('[data-qb-choice]:not([hidden])');
      });
    });
  }

  document.querySelectorAll('[data-qb-blank]').forEach(wireSearch);

  // ── The person picker ───────────────────────────────────────────────────────

  // The panel is the input, the tokens in the row are the value: what is ticked joins the row
  // and the boxes clear, so the two never disagree. A name already in the row is not repeated.
  function addPeople(row, panel) {
    const cell = row.querySelector('[data-qb-value]');
    const present = Array.from(row.querySelectorAll('[data-qb-token]'))
      .map(el => el.textContent.trim());
    panel.querySelectorAll('input[type="checkbox"]:checked').forEach(box => {
      if (!present.includes(box.value)) cell.insertBefore(token(box.value), panel.parentElement);
      box.checked = false;
    });
  }

  function token(name) {
    const node = document.getElementById('qb-person-token')
      .content.firstElementChild.cloneNode(true);
    node.querySelector('[data-qb-token-name]').textContent = name;
    node.querySelector('button').setAttribute('aria-label', 'Remove ' + name);
    return node;
  }

  // Search-within, as the same panel does in the works filter bar
  list.addEventListener('input', event => {
    const search = event.target.closest('[data-qb-person-search]');
    if (!search) return;
    const needle = search.value.trim().toLowerCase();
    search.closest('[data-qb-person-slot]').querySelectorAll('.form-check').forEach(option => {
      option.hidden = Boolean(needle) &&
        !option.querySelector('label').textContent.toLowerCase().includes(needle);
    });
  });

  // ── The approximate count ───────────────────────────────────────────────────

  // Invented numbers: the prototype has no index behind it. What is being shown is the shape
  // — "About N", debounced, in the builder's one live region. Where the real number comes
  // from is open question 10 in QUERY-BUILDER-FIELD-CONTRACT.md.
  const TOTAL = 312000;
  let debounce = null;

  function write(text) {
    const el = document.querySelector('[data-qb-count]');
    if (el) el.textContent = text;
  }

  function count() {
    const conditions = items().reduce((n, item) => n + (item.hasAttribute('data-qb-group')
      ? (alts(item).some(filled) ? 1 : 0)
      : (filled(item) ? 1 : 0)), 0);

    if (!conditions) {
      write('About ' + TOTAL.toLocaleString('en') + ' research outputs — add a condition to narrow');
      return;
    }
    const estimate = Math.max(10, Math.round(TOTAL / Math.pow(4, conditions) / 10) * 10);
    write('About ' + estimate.toLocaleString('en') + ' research outputs match');
  }

  list.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(count, 400);
  });
  list.addEventListener('change', sync);

  // ── Pasted identifier lists ─────────────────────────────────────────────────

  // field-sizing does the growing and the shrinking where it exists (.bt-textarea-auto); this is
  // the fallback everywhere else
  const autogrow = CSS.supports('field-sizing', 'content') ? null : box => {
    box.style.height = 'auto';
    box.style.height = box.scrollHeight + 'px';
  };

  if (autogrow) {
    list.addEventListener('input', event => {
      const box = event.target.closest('.bt-textarea-auto');
      if (box) autogrow(box);
    });
    list.querySelectorAll('.bt-textarea-auto').forEach(autogrow);
  }

  sync();
})();
