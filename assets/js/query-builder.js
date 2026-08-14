// Advanced search — rows, OR groups, the chooser, and the approximate count.
// See docs/JAVASCRIPT.md. Row grammar and states: docs/handover/CHANGES.md.

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
  const isSeparator = el => Boolean(el) && el.classList &&
    (el.classList.contains('bt-query-builder__and') ||
     el.classList.contains('bt-query-builder__or'));

  function separator(word) {
    const p = document.createElement('p');
    p.className = word === 'or' ? 'bt-query-builder__or' : 'bt-query-builder__and';
    p.setAttribute('data-qb-sep', '');
    p.textContent = word;
    return p;
  }

  // ── Reading a row back ──────────────────────────────────────────────────────

  function valueOf(row) {
    const cell = row.querySelector('.bt-query-builder__row-value');
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
    const op = row.querySelector('.bt-query-builder__row-op select');
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
    const more = row.querySelector('.bt-query-builder__row-actions [data-bs-toggle="dropdown"]');
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

    const blank = list.querySelector('.bt-query-builder__blank');
    if (blank) blank.remove();
    sync();
    count();
    const first = row.querySelector('input, textarea, select');
    if (first) first.focus();
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
    seq += 1;
    const labelId = 'qb-group-c' + seq;
    group.querySelector('.bt-query-builder__group-label').id = labelId;
    group.setAttribute('aria-labelledby', labelId);
    row.replaceWith(group);
    group.querySelector('[data-qb-alts]').append(row, emptyCopy(row));
  }

  function unwrap(group) {
    const left = alts(group);
    left.forEach((row, i) => {
      group.before(row);
      if (i < left.length - 1) group.before(separator('and'));
    });
    group.remove();
  }

  // ── Keeping the whole thing consistent ──────────────────────────────────────

  function sync() {
    list.querySelectorAll('[data-qb-sep]').forEach(el => el.remove());

    items().forEach((item, i) => {
      // A hand-written separator can carry copy the JS has no business replacing
      if (i && !isSeparator(item.previousElementSibling)) item.before(separator('and'));

      if (item.hasAttribute('data-qb-group')) {
        alts(item).forEach((row, j) => {
          row.classList.add('bt-query-builder__row--alt');
          if (j && !isSeparator(row.previousElementSibling)) row.before(separator('or'));
          const or = row.querySelector('[data-qb-or]');
          if (or) or.closest('li').remove();
          nameRow(row);
        });
      } else {
        item.classList.remove('bt-query-builder__row--alt');
        nameRow(item);
      }
    });
  }

  // Bootstrap positions the panel against the control that opened it, so the chooser lives in
  // a template and is cloned into that control's own slot the first time it opens.
  document.addEventListener('show.bs.dropdown', event => {
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

    if (button.hasAttribute('data-qb-change-role')) {
      const picker = document.getElementById('qb-roles').content.firstElementChild.cloneNode(true);
      button.replaceWith(picker);
      identify(picker);
      const select = picker.querySelector('select');
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'bt-query-builder__role';
        back.setAttribute('data-qb-change-role', '');
        back.textContent = select.options[select.selectedIndex].text;
        picker.replaceWith(back);
      };
      select.addEventListener('change', settle);
      select.addEventListener('blur', settle);
      select.focus();
      return;
    }
    if (button.hasAttribute('data-qb-or')) {
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
    const toggle = choice.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]');
    if (toggle && window.bootstrap) bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
    if (pending.mode !== 'append') pending = { mode: 'append' };
  });

  function wireSearch(scope) {
    const search = scope.querySelector('[data-qb-choice-search]');
    if (!search) return;
    search.addEventListener('input', () => {
      const needle = search.value.trim().toLowerCase();
      scope.querySelectorAll('[data-qb-choice]').forEach(choice => {
        choice.hidden = Boolean(needle) &&
          !(choice.dataset.qbLabel + ' ' + choice.textContent).toLowerCase().includes(needle);
      });
      scope.querySelectorAll('.bt-query-builder__choice-group').forEach(group => {
        group.hidden = !group.querySelector('[data-qb-choice]:not([hidden])');
      });
    });
  }

  document.querySelectorAll('.bt-query-builder__blank').forEach(wireSearch);

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

  // field-sizing does the growing where it exists; this is the fallback everywhere else
  const autogrow = CSS.supports('field-sizing', 'content') ? null : box => {
    box.style.height = 'auto';
    box.style.height = box.scrollHeight + 'px';
  };

  if (autogrow) {
    list.addEventListener('input', event => {
      const box = event.target.closest('.bt-query-builder__batch');
      if (box) autogrow(box);
    });
    list.querySelectorAll('.bt-query-builder__batch').forEach(autogrow);
  }

  sync();
})();
