// Advanced search — rows, OR groups and the chooser.
// See docs/JAVASCRIPT.md. Row grammar and states: patterns/query-builder.html.

// The dialog is shut in the markup, because a @state block cannot wrap the include that builds it
// (docs/SERVER.md). Production renders it open at its address; here the address and the builder
// states each say to open it.
document.addEventListener('DOMContentLoaded', function () {
  const dialog = document.getElementById('advanced-search-modal');
  const open = new URLSearchParams(location.search).has('advanced') ||
    document.querySelector('[data-qb-open]');
  if (dialog && open) bootstrap.Modal.getOrCreateInstance(dialog).show();
});

(function () {
  const list = document.getElementById('qb-conditions');
  if (!list) return;

  // The dialog's body scrolls (modal-dialog-scrollable), and a scroll container clips an
  // absolutely-positioned panel at its edge, whatever Popper does inside it. Fixed positioning
  // escapes to the viewport, which then bounds the panel. The config attribute has to be on the
  // toggle before Bootstrap's own click handler creates the instance, so this runs in the
  // capture phase; it covers cloned rows too, which get their instance on first open.
  const host = list.closest('.modal');
  if (host) {
    const escapeToViewport = event => {
      const toggle = event.target.closest('[data-bs-toggle="dropdown"]');
      if (toggle && host.contains(toggle) && !toggle.hasAttribute('data-bs-popper-config')) {
        toggle.setAttribute('data-bs-popper-config', '{"strategy":"fixed"}');
      }
    };
    document.addEventListener('click', escapeToViewport, true);
    document.addEventListener('keydown', escapeToViewport, true);
  }

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
      .filter(el => !el.hidden)
      .map(el => el.tagName === 'SELECT'
        ? el.options[el.selectedIndex].text
        : (el.value || '').trim())
      .filter(Boolean)
      .join(' and ');
  }

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
    // A template carries the union of its fields' operators; a choice that names a subset
    // (data-qb-ops) keeps only those, so the operator vocabulary stays in the markup and the
    // field contract.
    if (choice.dataset.qbOps) {
      const keep = choice.dataset.qbOps.split(',');
      row.querySelectorAll('[data-qb-op] option').forEach(option => {
        if (!keep.includes(option.textContent)) option.remove();
      });
    }
    // A choice carries its select's values where the contract fixes them (data-qb-values); a
    // field whose values live in a raven catalog names none and keeps the placeholder.
    if (choice.dataset.qbValues) {
      const select = row.querySelector('[data-qb-value] select');
      choice.dataset.qbValues.split(',').forEach(v => select.add(new Option(v)));
    }
    // An entity choice also names the panel its slot clones and the Add-button copy.
    if (choice.dataset.qbPanel) {
      const slot = row.querySelector('[data-qb-picker-slot]');
      slot.dataset.qbPickerSlot = choice.dataset.qbPanel;
      slot.setAttribute('aria-label', choice.dataset.qbAdd);
      row.querySelector('[data-qb-add-label]').textContent = choice.dataset.qbAdd;
    }
    identify(row);

    if (pending.mode === 'replace') pending.row.replaceWith(row);
    else if (pending.mode === 'alt') pending.group.querySelector('[data-qb-alts]').append(row);
    else list.append(row);
    pending = { mode: 'append' };

    const blank = list.querySelector('[data-qb-blank]');
    if (blank) blank.remove();
    sync();
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
    copy.querySelectorAll('[data-qb-chooser-slot], [data-qb-picker-slot]')
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

    list.querySelectorAll('[data-qb-sep]').forEach(el => el.remove());

    items().forEach(item => {
      if (item.hasAttribute('data-qb-group')) {
        alts(item).forEach((row, j) => {
          row.classList.add('bt-query-builder__row--alt');
          if (j && !isSeparator(row.previousElementSibling)) row.before(separator('or'));
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
  // opens: the field chooser, and the picker panels the works filter bar clones too. A picker
  // slot names its panel template, so one mechanism serves person, organization and project.
  // The checklist panel arrives empty: its rows are one #filter-checklist-row clone per option
  // of the row's own select, so the vocabulary stays in the markup. Search only earns its place
  // past eight rows.
  function fillChecklist(panel, row) {
    const rows = panel.querySelector('[data-picker-rows]');
    const select = row.querySelector('.bt-query-builder__value-select');
    const title = panel.querySelector('[data-picker-title]');
    if (title) title.textContent =
      row.querySelector('[data-qb-change-field]')?.textContent.trim() || title.textContent;
    Array.from(select.options)
      .filter(option => !option.hasAttribute('data-qb-placeholder'))
      .forEach(option => {
        const check = document.getElementById('filter-checklist-row')
          .content.firstElementChild.cloneNode(true);
        check.querySelector('input').dataset.id = option.text;
        check.querySelector('label').textContent = option.text;
        rows.append(check);
      });
    panel.querySelector('[data-picker-search]')
      .closest('.bt-panel__body').hidden = rows.children.length <= 8;
  }

  document.addEventListener('show.bs.dropdown', event => {
    const pickerSlot = event.target.parentElement?.querySelector('[data-qb-picker-slot]');
    if (pickerSlot) {
      const row = event.target.closest('[data-qb-row]');
      if (!pickerSlot.children.length) {
        const picker = document.getElementById(pickerSlot.dataset.qbPickerSlot)
          .content.cloneNode(true);
        pickerSlot.append(picker);
        if (pickerSlot.dataset.qbPickerSlot === 'qb-checklist-panel') {
          fillChecklist(pickerSlot, row);
        }
        identify(pickerSlot);
      }
      // A tick means selected in both hosts, so the panel opens mirroring the row's tokens.
      const present = Array.from(row.querySelectorAll('[data-qb-token]'))
        .map(el => el.dataset.id);
      pickerSlot.querySelectorAll('[data-picker-rows] input').forEach(box => {
        box.checked = present.includes(box.dataset.id);
      });
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

  document.addEventListener('shown.bs.dropdown', event => {
    event.target.parentElement
      ?.querySelector('[data-qb-picker-slot] [data-picker-search]')?.focus();
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !list.contains(button)) return;

    if (button.hasAttribute('data-picker-apply')) {
      applyPicked(button.closest('[data-qb-row]'), button.closest('[data-qb-picker-slot]'));
      closeDropdown(button)?.focus();
    } else if (button.hasAttribute('data-picker-cancel')) {
      closeDropdown(button)?.focus();
    } else if (button.hasAttribute('data-picker-clear')) {
      button.closest('[data-qb-picker-slot]')
        .querySelectorAll('[data-picker-rows] input:checked').forEach(box => {
          box.checked = false;
        });
    } else if (button.closest('[data-qb-token]')) {
      button.closest('[data-qb-token]').remove();
    } else if (button.hasAttribute('data-qb-or')) {
      toGroup(button.closest('[data-qb-row]'));
    } else if (button.hasAttribute('data-qb-remove-group')) {
      unwrap(button.closest('[data-qb-group]'));
    } else if (button.hasAttribute('data-qb-remove')) {
      const group = button.closest('[data-qb-group]');
      button.closest('[data-qb-row]').remove();
      if (group && alts(group).length < 2) unwrap(group);
    } else {
      return;
    }
    sync();
  });

  const clear = document.querySelector('[data-qb-clear]');
  if (clear) clear.addEventListener('click', () => {
    items().forEach(item => item.remove());
    sync();
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
    return toggle;
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

  // ── The picker panels ───────────────────────────────────────────────────────

  // The ticks mirror tokens
  function applyPicked(row, panel) {
    const cell = row.querySelector('[data-qb-value]');
    panel.querySelectorAll('[data-picker-rows] input[type="checkbox"]').forEach(box => {
      const existing = row.querySelector(`[data-qb-token][data-id="${box.dataset.id}"]`);
      if (box.checked && !existing) cell.insertBefore(token(box), panel.parentElement);
      if (!box.checked && existing) existing.remove();
    });
  }

  // Crestless is the default token; a checklist row's name is its label, a rich row names
  // itself with [data-picker-name].
  function token(box) {
    const check = box.closest('.form-check');
    const name = (check.querySelector('[data-picker-name]') || check.querySelector('label'))
      .textContent.trim();
    return makeToken(box.dataset.id, name, box.hasAttribute('data-person-ugent'));
  }

  function makeToken(id, name, crested) {
    const node = document.getElementById(crested ? 'qb-person-token' : 'qb-token')
      .content.firstElementChild.cloneNode(true);
    node.dataset.id = id;
    node.querySelector('[data-qb-token-name]').textContent = name;
    node.querySelector('button').setAttribute('aria-label', 'Remove ' + name);
    return node;
  }

  // Search-within, as the same panels do in the works filter bar
  list.addEventListener('input', event => {
    const search = event.target.closest('[data-picker-search]');
    if (!search) return;
    const needle = search.value.trim().toLowerCase();
    search.closest('[data-qb-picker-slot]')
      .querySelectorAll('[data-picker-rows] .form-check').forEach(option => {
        option.hidden = Boolean(needle) &&
          !option.querySelector('label').textContent.toLowerCase().includes(needle);
      });
  });

  // The operator decides the value's shape; docs/JAVASCRIPT.md names the shapes and hooks.
  function syncValueShape(row) {
    const op = row.querySelector('[data-qb-op]');
    const chosen = op.selectedIndex >= 0 && op.options[op.selectedIndex];

    const listEls = row.querySelectorAll('[data-qb-list]');
    const wantsListBox = listEls.length > 0 &&
      Boolean(chosen && chosen.hasAttribute('data-qb-list-op'));
    listEls.forEach(el => { el.hidden = !wantsListBox; });
    row.querySelectorAll('[data-qb-single]').forEach(el => { el.hidden = wantsListBox; });

    const pair = row.querySelectorAll('[data-qb-pair]');
    if (pair.length) {
      const wantsPair = !wantsListBox && Boolean(chosen && chosen.hasAttribute('data-qb-pair-op'));
      pair.forEach(el => { el.hidden = !wantsPair; });
    }

    const multi = row.querySelector('[data-qb-multi]');
    if (!multi) return;
    const select = row.querySelector('.bt-query-builder__value-select');
    const wantsList = chosen && chosen.hasAttribute('data-qb-multi-op');
    if (wantsList === !multi.hidden) return;
    multi.hidden = !wantsList;
    select.hidden = wantsList;
    const tokens = Array.from(row.querySelectorAll('[data-qb-value] [data-qb-token]'));
    if (wantsList) {
      const chosen = select.options[select.selectedIndex];
      if (chosen && !chosen.hasAttribute('data-qb-placeholder') && !tokens.length) {
        multi.before(makeToken(chosen.text, chosen.text, false));
      }
    } else {
      const first = tokens[0]?.querySelector('[data-qb-token-name]')?.textContent.trim();
      const option = first && Array.from(select.options).find(o => o.text === first);
      if (option) option.selected = true;
      tokens.forEach(el => el.remove());
    }
  }

  list.addEventListener('change', event => {
    const row = event.target.closest('[data-qb-row]');
    if (row && event.target.hasAttribute('data-qb-op')) syncValueShape(row);
    sync();
  });

  // ── Pasted identifier lists ─────────────────────────────────────────────────

  // field-sizing fallback
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
