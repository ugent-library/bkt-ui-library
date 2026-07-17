/**
 * filter-sheet.js — mobile: fold the works filter-bar into the Filters offcanvas.
 *
 * At <lg it relocates the picker list, editor, and clear-all into the sheet, turns the
 * record dimensions into a drill-in list (each row shows its applied value + a chevron),
 * and makes tapping a row swap the sheet to that filter's editor with a back button;
 * Apply or back returns to the list. Desktop keeps the toolbar picker/editor untouched.
 *
 * One filter-bar.js instance, one state — moving the nodes preserves its handlers.
 * Prototype-only; rides on filter-bar.js (wf-).
 */
(function () {
  'use strict';

  const pickerList = document.getElementById('wf-filter-picker-list');
  const editor     = document.getElementById('wf-filter-editor');
  const clearAll   = document.getElementById('wf-clear-all');
  const refine     = document.getElementById('wf-sheet-refine');
  const editorSlot = document.getElementById('wf-editor-slot');
  const mainView   = document.getElementById('wf-sheet-main');
  const detailView = document.getElementById('wf-sheet-detail');
  const clearSlot  = document.getElementById('wf-clear-slot');
  const chips      = document.getElementById('wf-active-chips');
  const headList   = document.getElementById('wf-head-list');
  const headBack   = document.getElementById('wf-head-back');
  const headTitle  = document.getElementById('wf-head-title');
  const footList   = document.getElementById('wf-foot-list');
  const footDetail = document.getElementById('wf-foot-detail');
  const footApply  = document.getElementById('wf-foot-apply');
  const footRemove = document.getElementById('wf-foot-remove');
  if (!pickerList || !editor || !clearAll || !refine || !editorSlot ||
      !mainView || !detailView || !headBack || !footDetail || !clearSlot) return;

  const pickerHome = pickerList.parentNode;
  const editorHome = editor.parentNode;
  const clearHome  = clearAll.parentNode;
  // On desktop the editor is a floating panel; in the sheet it flows inline full-width
  // (dropping bt-panel also sheds the min-width that would overflow a narrow sheet).
  const OVERLAY = ['position-absolute', 'top-100', 'bt-panel', 'bt-panel--wide', 'mt-2'];
  const mq = window.matchMedia('(max-width: 991.98px)');
  const scroller = document.querySelector('#filters-offcanvas .offcanvas-body');
  let listScroll = 0;

  function chipValues() {
    const map = {};
    chips?.querySelectorAll('[data-filter-id]').forEach(b => {
      map[b.dataset.filterId] = b.textContent.replace(/^[^:]*:\s*/, '').trim();
    });
    return map;
  }

  // Each record row: label · applied value · chevron. Replaces filter-bar's floating tick
  // so the indicator sits in one place. Re-run at finite moments (open / editor close /
  // clear-all), never on a live observer.
  function decorateRows() {
    const vals = chipValues();
    pickerList.querySelectorAll('.dropdown-header').forEach(h => h.classList.add('d-none'));
    pickerList.querySelectorAll('button[data-filter]').forEach(b => {
      // py-2: the dropdown-item padding vars only live inside .dropdown-menu, so relocating
      // out of it drops the padding — restore it so rows aren't squished in the sheet.
      b.classList.add('d-flex', 'align-items-center', 'py-2');
      b.querySelector('.if-check')?.remove();
      let end = b.querySelector('[data-end]');
      if (!end) {
        end = document.createElement('span');
        end.dataset.end = '';
        end.className = 'ms-auto ps-2 d-flex align-items-center gap-2';
        end.innerHTML = '<span class="small text-secondary" data-val></span>' +
          '<i class="if if-chevron-right if--xs text-muted" aria-hidden="true"></i>';
        b.appendChild(end);
      }
      end.querySelector('[data-val]').textContent = vals[b.dataset.filter] || '';
    });
  }

  function undecorateRows() {
    pickerList.querySelectorAll('.dropdown-header').forEach(h => h.classList.remove('d-none'));
    pickerList.querySelectorAll('button[data-filter]').forEach(b => {
      b.classList.remove('d-flex', 'align-items-center', 'py-2');
      b.querySelector('[data-end]')?.remove();
    });
  }

  function toSheet() {
    refine.append(pickerList);
    editorSlot.append(editor);
    clearSlot.append(clearAll);
    editor.classList.remove(...OVERLAY);
    decorateRows();
  }

  function toToolbar() {
    undecorateRows();
    pickerHome.append(pickerList);
    editorHome.append(editor);
    clearHome.append(clearAll);
    editor.classList.add(...OVERLAY);
    showMain();
  }

  // Detail: header shows back + filter name, footer shows the filter's own actions.
  // The editor's in-body title and actions are hidden (avoid duplicates).
  function showDetail() {
    const title = editor.querySelector('.bt-panel__title');
    headTitle.textContent = title ? title.textContent : 'Filter';
    title?.classList.add('d-none');
    editor.querySelector('.bt-panel__actions')?.classList.add('d-none');
    footRemove.hidden = !editor.querySelector('#wf-editor-remove');
    headList.hidden = true;  headBack.hidden = false;
    hideFlex(footList);      showFlex(footDetail);
    mainView.hidden = true;  detailView.hidden = false;
    if (scroller) { listScroll = scroller.scrollTop; scroller.scrollTop = 0; }
    (editor.querySelector('[data-checklist-search]') ||
     editor.querySelector('input, select, textarea'))?.focus();
  }
  function showMain() {
    headBack.hidden = true;   headList.hidden = false;
    showFlex(footList);       hideFlex(footDetail);
    detailView.hidden = true; mainView.hidden = false;
    if (scroller) scroller.scrollTop = listScroll;
  }
  // .d-flex uses !important so it beats [hidden]; toggle the display class directly.
  function showFlex(el) { el.classList.add('d-flex'); el.classList.remove('d-none'); }
  function hideFlex(el) { el.classList.add('d-none'); el.classList.remove('d-flex'); }

  // Drill in when the editor opens; on close, return to the list and refresh values.
  new MutationObserver(() => {
    if (!mq.matches) return;
    if (editor.hidden) { showMain(); decorateRows(); }
    else showDetail();
  }).observe(editor, { attributes: true, attributeFilter: ['hidden'] });

  // Detail footer/back proxy the editor's own buttons (Apply returns to the list).
  headBack.addEventListener('click', () => document.getElementById('wf-editor-cancel')?.click());
  footApply.addEventListener('click', () => document.getElementById('wf-editor-apply')?.click());
  footRemove.addEventListener('click', () => document.getElementById('wf-editor-remove')?.click());
  clearAll.addEventListener('click', () => { if (mq.matches) setTimeout(decorateRows, 0); });

  const apply = e => (e.matches ? toSheet() : toToolbar());
  apply(mq);
  mq.addEventListener('change', apply);
}());
