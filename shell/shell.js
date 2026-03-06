/**
 * Booktower Design System — Shell JS
 * Keyboard nav, search, prototype mode, code copy.
 * No framework. No build step.
 */

(function () {
  'use strict';

  const shell    = document.getElementById('bt-shell');
  const search   = document.getElementById('bt-search');
  const navBody  = document.getElementById('bt-nav-body');

  // ─── Prototype mode (Cmd/Ctrl + M) ──────────────────────────────────────────
  const PROTO_KEY = 'bt-prototype-mode';

  function setProtoMode(on) {
    shell.classList.toggle('prototype-mode', on);
    sessionStorage.setItem(PROTO_KEY, on ? '1' : '');
    showBadge(on);
  }

  // Restore state on load
  if (sessionStorage.getItem(PROTO_KEY)) {
    shell.classList.add('prototype-mode');
  }

  // ─── Search (Cmd/Ctrl + K) ──────────────────────────────────────────────────
  function filterNav(query) {
    const q = query.trim().toLowerCase();
    navBody.querySelectorAll('.bt-nav-section').forEach(section => {
      let anyVisible = false;
      section.querySelectorAll('.bt-nav-link, .bt-nav-template-item').forEach(item => {
        const link = item.classList.contains('bt-nav-link') ? item
          : item.querySelector('.bt-nav-link');
        const text  = link?.textContent.toLowerCase() || '';
        const match = !q || text.includes(q);
        item.classList.toggle('hidden', !match);
        if (match) anyVisible = true;
      });
      section.classList.toggle('hidden', !anyVisible);
    });
  }

  if (search) {
    search.addEventListener('input', e => filterNav(e.target.value));
    search.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        search.value = '';
        filterNav('');
        search.blur();
      }
    });
  }

  // ─── Per-demo HTML toggle (Elements + Patterns) ────────────────────────────
  function setupDemoSourceToggles() {
    const path = window.location.pathname;
    if (!/^\/(elements|patterns|foundations)\//.test(path)) return;

    function normalizeHtml(raw) {
      const lines = raw.replace(/\t/g, '  ').split('\n');
      while (lines.length && !lines[0].trim()) lines.shift();
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      const indents = lines
        .filter(line => line.trim())
        .map(line => (line.match(/^ */) || [''])[0].length);
      const minIndent = indents.length ? Math.min(...indents) : 0;
      return lines.map(line => line.slice(Math.min(minIndent, line.length))).join('\n');
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    document.querySelectorAll('.ds-demo').forEach((demo, index) => {
      const label = demo.querySelector('.ds-demo-label');
      const body = demo.querySelector('.ds-demo-body');
      if (!label || !body) return;

      const source = normalizeHtml(body.innerHTML);
      if (!source.trim()) return;

      const panelId = `bt-demo-html-${index + 1}`;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'bt-demo-toggle';
      toggle.textContent = 'Show HTML';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', panelId);
      label.appendChild(toggle);

      const panel = document.createElement('div');
      panel.className = 'ds-code bt-demo-code';
      panel.id = panelId;
      panel.hidden = true;
      panel.innerHTML = `
        <div class="ds-code-bar">
          <span class="ds-code-lang">HTML</span>
          <button type="button" class="ds-code-copy">Copy</button>
        </div>
        <pre>${escapeHtml(source)}</pre>
      `;
      demo.insertAdjacentElement('afterend', panel);

      toggle.addEventListener('click', () => {
        const open = panel.hidden;
        panel.hidden = !open;
        toggle.textContent = open ? 'Hide HTML' : 'Show HTML';
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      const copyBtn = panel.querySelector('.ds-code-copy');
      const pre = panel.querySelector('pre');
      if (!copyBtn || !pre) return;

      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pre.textContent || '').then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 1800);
        });
      });
    });
  }

  setupDemoSourceToggles();

  // ─── Keyboard shortcuts ──────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    const mod = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl + M — toggle prototype mode
    if (mod && e.key === 'm') {
      e.preventDefault();
      setProtoMode(!shell.classList.contains('prototype-mode'));
    }

    // Cmd/Ctrl + K — focus search
    if (mod && e.key === 'k') {
      e.preventDefault();
      if (search) {
        search.focus();
        search.select();
      }
    }
  });

  // ─── Code block copy buttons ─────────────────────────────────────────────────
  document.querySelectorAll('.ds-code').forEach(block => {
    const pre  = block.querySelector('pre');
    const btn  = block.querySelector('.ds-code-copy');
    if (!pre || !btn) return;

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1800);
      });
    });
  });

  // ─── Active nav item scroll into view ────────────────────────────────────────
  const activeLink = navBody?.querySelector('.bt-nav-link.active');
  if (activeLink) {
    activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

})();
