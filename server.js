/**
 * Booktower UI Library — Dev Server
 * Pure Node.js, zero external dependencies.
 *
 * - Serves static files from project root
 * - Scans folder structure → builds nav automatically
 * - Templates are grouped by subdirectory (one subdir = one app), collapsible
 * - Injects shell chrome into every HTML page
 * - Live reload via minimal WebSocket implementation
 * - HTMX partial responses: ?partial=true strips shell
 * - Template HTML view: ?view=html shows source with copy button
 * - Template states: @states meta + <!-- @state: name --> blocks + ?state= param
 *
 * HTMX endpoint map + mock content live in server/ :
 *   server/htmx-routes.js   URL → fragment routing for the prototype
 *   server/content.js       the injected research output, researchers, etc.
 *
 * Ports are configurable via env vars (defaults preserve the original
 * behaviour when unset):
 *   PORT       HTTP port            (default 3111)
 *   WS_PORT    live-reload socket   (default 3001; when PORT is set it
 *                                    defaults to PORT+1 so a second instance
 *                                    can run alongside the first without a
 *                                    socket clash). This lets tooling launch
 *                                    a parallel instance on a free port.
 */

const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');

const { handleTemplateHtmx } = require('./server/htmx-routes');

const PORT    = process.env.PORT || 3111;
const WS_PORT = process.env.WS_PORT || (process.env.PORT ? Number(PORT) + 1 : 3001);
const ROOT    = __dirname;

// ─── Bootstrap delivery: jsDelivr CDN, pinned to 5.3.3 ───────────────────────
//
// IMPORTANT, read before "harmonising" with Raven:
//   booktower-ui-library is a static prototype environment with no bundler.
//   Bootstrap is loaded from jsDelivr, pinned to a specific version in the URL.
//   Pinning gives us reproducibility; CDN gives us zero-machinery delivery.
//
//   Raven uses a pinned npm package (bootstrap@5.3.3, --save-exact) resolved
//   by esbuild from node_modules. That is the correct choice there because
//   Raven already has a bundler and ships production app code.
//
//   The two repos solve the same problem (pinned Bootstrap, no drift) with
//   different mechanisms because they have different runtime shapes. Do not
//   try to unify them by adding npm-Bootstrap here without first agreeing on
//   how it would be served (static-mount of node_modules? postinstall copy
//   into assets/vendor/?) and why the added machinery is worth it.
//
// To update Bootstrap: bump the version in BOTH URLs below (CSS + JS bundle).
const DEFAULT_CSS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  '/assets/booktower.css',
];
const DEFAULT_HEAD_SCRIPTS = [
  'https://unpkg.com/htmx.org@1.9.12',
];
const DEFAULT_FOOTER_SCRIPTS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  '/assets/js/clipboard.js',
];

// ─── MIME ─────────────────────────────────────────────────────────────────────
const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.css':   'text/css',
  '.js':    'application/javascript',
  '.json':  'application/json',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
};

// ─── Nav sections — order matters ─────────────────────────────────────────────
const SECTIONS = [
  { dir: 'getting-started', label: 'Getting started' },
  { dir: 'foundations', label: 'Foundations' },
  { dir: 'elements',    label: 'Elements'    },
  { dir: 'patterns',    label: 'Patterns'    },
  { dir: 'templates',   label: 'Templates'   },
  { dir: 'base',        label: 'base'        },
  { dir: 'product',     label: 'product'     },
];

// ─── Read @states from top of a template file (cheap, first few lines only) ──
function getStateList(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').slice(0, 10).join('\n');
    const m = lines.match(/<!--\s*@states\s*:\s*([^\-]+?)\s*-->/);
    if (!m) return [];
    return m[1].split(',').map(s => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

// ─── Nav cache — rebuilt only when files change ───────────────────────────────
let _navCache = null;

function invalidateNav() {
  _navCache = null;
}

function buildNav() {
  if (_navCache) return _navCache;

  _navCache = SECTIONS.reduce((acc, section) => {
    const dirPath = path.join(ROOT, section.dir);
    if (!fs.existsSync(dirPath)) return acc;

    if (section.dir === 'templates') {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      const topFiles = entries
        .filter(e => !e.isDirectory() && e.name.endsWith('.html'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(e => ({
          name:       slugToLabel(e.name.replace('.html', '')),
          path:       `/templates/${e.name}`,
          isTemplate: true,
          stateList:  getStateList(path.join(dirPath, e.name)),
        }));

      const groups = entries
        .filter(e => e.isDirectory() && e.name !== 'partials')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(subDir => ({
          class:      'bt-nav-group',
          id:    `btn-nav-group-${subDir.name}`,
          label: slugToLabel(subDir.name),
          files: fs.readdirSync(path.join(dirPath, subDir.name))
            .filter(f => f.endsWith('.html'))
            .sort()
            .map(f => ({
              name:       slugToLabel(f.replace('.html', '')),
              path:       `/templates/${subDir.name}/${f}`,
              isTemplate: true,
              stateList:  getStateList(path.join(dirPath, subDir.name, f)),
            })),
        }))
        .filter(g => g.files.length);

      if (topFiles.length || groups.length) {
        acc.push({ ...section, files: topFiles, groups });
      }
      return acc;
    }

    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.html'))
      .sort()
      .map(f => ({
        name:       slugToLabel(f.replace('.html', '')),
        path:       `/${section.dir}/${f}`,
        isTemplate: false,
      }));
    if (files.length) acc.push({ ...section, files });
    return acc;
  }, []);

  return _navCache;
}

function slugToLabel(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function parseMetaAndBody(raw, filePath) {
  const lines = raw.split('\n');
  const meta = {};
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^\s*<!--\s*@([\w-]+)\s*:\s*(.*?)\s*-->\s*$/);
    if (!m) break;
    if (m[1].toLowerCase() === 'include') break;
    meta[m[1].toLowerCase()] = m[2];
    i += 1;
  }
  const body = lines.slice(i).join('\n').trimStart();
  if (!meta.title) {
    meta.title = path.basename(filePath, '.html')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  // Parse comma-separated @states into an array
  if (meta.states) {
    meta.stateList = meta.states.split(',').map(s => s.trim()).filter(Boolean);
  }
  return { meta, body };
}

// ─── State filtering ──────────────────────────────────────────────────────────
// Strips <!-- @state: name --> ... <!-- @/state --> blocks that don't match
// the active state. Blocks for the active state have the wrapper comments
// removed and their content kept. If no activeState, all blocks are shown.
function filterStateContent(html, activeState) {
  if (!activeState) return html;
  return html.replace(
    /<!--\s*@state:\s*([\w][\w\s-]*?)\s*-->[\s\S]*?<!--\s*@\/?state\s*-->/g,
    (match, stateNames) => {
      const states = stateNames.trim().split(/\s+/);
      if (states.includes(activeState)) {
        // Strip the wrapper comments, keep content
        return match
          .replace(/^<!--\s*@state:\s*[\w][\w\s-]*?\s*-->\s*/, '')
          .replace(/\s*<!--\s*@\/?state\s*-->$/, '');
      }
      return '';
    }
  );
}

function applySidebarActive(fragment, activeKey) {
  if (!activeKey) return fragment;

  return fragment.replace(/<a\b([^>]*?)>/g, (tag, attrs) => {
    const keyMatch = attrs.match(/\sdata-nav-key="([^"]+)"/);
    if (!keyMatch) return tag;

    const isActive = keyMatch[1] === activeKey;
    let next = tag.replace(/\saria-current="page"/g, '');

    next = next.replace(/\sclass="([^"]*)"/, (classMatch, classValue) => {
      const classes = classValue.split(/\s+/).filter(c => c && c !== 'active');
      if (isActive) classes.push('active');
      return ` class="${classes.join(' ')}"`;
    });

    if (isActive) {
      next = next.replace(/>$/, ' aria-current="page">');
    }

    return next;
  });
}

function resolveIncludes(body, filePath) {
  return body.replace(/<!--\s*@include:\s*([^\s]+)\s*-->[ \t]*(?:\r?\n[ \t]*<!--\s*@active:\s*([\w-]+)\s*-->)?/g, (match, includePath, activeKey) => {
    const abs = path.join(ROOT, includePath.trim());
    if (!fs.existsSync(abs)) {
      return `<!-- @include not found: ${includePath} -->`;
    }
    const raw = fs.readFileSync(abs, 'utf8');
    const { body: fragment } = parseMetaAndBody(raw, abs);
    return applySidebarActive(fragment, activeKey);
  });
}

function stripHtmlComments(html) {
  return html.replace(/<!--(?!\s*\[if\b)([\s\S]*?)-->/g, '');
}

function renderBodyTemplate(raw, filePath, activeState) {
  const { meta, body: rawBody } = parseMetaAndBody(raw, filePath);
  // No explicit state → first declared @states value is the default.
  const state = activeState || meta.stateList?.[0] || null;
  const resolved = resolveIncludes(rawBody, filePath);
  const stateFiltered = filterStateContent(resolved, state);
  const body = stripHtmlComments(stateFiltered);
  const surface = meta.surface ? ` data-surface="${meta.surface}"` : '';
  const headCss = DEFAULT_CSS.map(href => `  <link rel="stylesheet" href="${href}">`).join('\n');
  const headScripts = DEFAULT_HEAD_SCRIPTS
    .map(src => `  <script src="${src}" defer></script>`)
    .join('\n');
  const footerScripts = DEFAULT_FOOTER_SCRIPTS
    .map(src => `  <script src="${src}"></script>`)
    .join('\n');

  return {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title}</title>
${headCss}
${headScripts}
</head>
<body${surface}>
${body}
${footerScripts}
</body>
</html>`,
    body,
  };
}

function loadFragment(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { body } = renderBodyTemplate(raw, filePath);
  return body;
}

// ─── Nav link renderer ────────────────────────────────────────────────────────
function renderNavLink(f, currentPath, activeState) {
  const active = currentPath === f.path;
  if (f.isTemplate) {
    const stateBtns = (f.stateList || []).map((s, idx) => {
      // Bare URL (no ?state) defaults to the first declared state.
      const isCurrent = active && (activeState === s || (!activeState && idx === 0));
      return `<a href="${f.path}?state=${encodeURIComponent(s)}" class="bt-nav-state-btn${isCurrent ? ' is-active' : ''}" title="State: ${s}">${s}</a>`;
    }).join('');
    const stateSection = (stateBtns && active) ? `<span class="bt-nav-state-list">${stateBtns}</span>` : '';
    return `
          <div class="bt-nav-template-item${active ? ' active' : ''}">
            <a href="${f.path}" class="bt-nav-link${active ? ' active' : ''}">${f.name}</a>
            <span class="bt-nav-template-actions">
              <a href="${f.path}" class="bt-nav-action" title="View template"><i class="if if-eye"></i></a>
              <a href="${f.path}?view=html" class="bt-nav-action" title="Show HTML">&lt;/&gt;</a>
            </span>
          </div>
          ${stateSection}`;
  }
  return `<a href="${f.path}" class="bt-nav-link${active ? ' active' : ''}">${f.name}</a>`;
}

// ─── Shell injection ──────────────────────────────────────────────────────────
function injectShell(filePath, html, currentPath, activeState) {
  if (html.includes('data-bare')) return html;

  const nav     = buildNav();
  const navHtml = nav.map(section => `
    <div class="bt-nav-section">
      <p class="bt-nav-section-label">${section.label}</p>
      ${(section.files || []).map(f => renderNavLink(f, currentPath, activeState)).join('\n')}
      ${(section.groups || []).map(group => {
        const hasActive = group.files.some(f => f.path === currentPath);
        return `
      <div class="bt-nav-group${hasActive ? ' has-active' : ''}" data-group="${group.id}">
        <button type="button" class="bt-nav-group-toggle" aria-expanded="false" aria-controls="${group.id}-items">
          <span>${group.label}</span>
          <svg class="bt-nav-group-chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="bt-nav-group-items" id="${group.id}-items">
          ${group.files.map(f => renderNavLink(f, currentPath, activeState)).join('\n')}
        </div>
      </div>`;
      }).join('\n')}
    </div>`).join('\n');

  const liveReload = `
  <script>
    (function() {
      let ws;
      function connect() {
        ws = new WebSocket('ws://localhost:${WS_PORT}');
        ws.onmessage = () => location.reload();
        ws.onclose   = () => setTimeout(connect, 1000);
        ws.onerror   = () => ws.close();
      }
      connect();
    })();
  </script>`;

  const shellOpen = `
<div id="bt-shell" class="bt-shell">
  <nav id="bt-nav" class="bt-nav" aria-label="UI Library navigation" data-surface="backoffice">
    <div class="bt-nav-header">
      <a href="/" class="bt-nav-logo" aria-label="Booktower UI Library home">
        <span class="bt-logo-mark" aria-hidden="true">◎</span>
        <span class="bt-logo-text">
          <span class="bt-logo-title">Booktower</span>
          <span class="bt-logo-sub">UI Library</span>
        </span>
      </a>
      <div class="bt-search-wrap" role="search">
        <label for="bt-search" class="visually-hidden">Search components</label>
        <input type="search" id="bt-search" class="bt-search" placeholder="Search…" autocomplete="off" aria-controls="bt-nav-body">
      </div>
    </div>
    <div class="bt-nav-body" id="bt-nav-body">
      ${navHtml}
    </div>
    <div class="bt-nav-footer" aria-label="Keyboard shortcuts">
      <kbd title="Toggle sidebar">⌘M</kbd> sidebar &nbsp;·&nbsp; <kbd title="Focus search">⌘K</kbd> search &nbsp;·&nbsp; <kbd title="Cycle states">⌘E</kbd> state
    </div>
  </nav>
  <main id="bt-content" class="bt-content" tabindex="-1">`;

  const shellClose = `
  </main>
</div>`;

  const hasSurface = html.includes('data-surface=');

  return html
    .replace('</head>',
      `  <link rel="stylesheet" href="/shell/shell.css">\n</head>`)
    .replace(/<body([^>]*)>/,
      hasSurface
        ? `<body$1>\n${shellOpen}`
        : `<body$1 data-surface="backoffice">\n${shellOpen}`)
    .replace('</body>',
      `${shellClose}\n  <script src="/shell/shell.js"></script>${liveReload}\n</body>`);
}

// ─── HTML source view ─────────────────────────────────────────────────────────
function sourceView(filePath, html) {
  const escaped = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HTML — ${path.basename(filePath)}</title>
  <link rel="stylesheet" href="/shell/shell.css">
</head>
<body>
  <div class="src-bar">
    <a href="${filePath.replace(ROOT, '').replace(/\\/g,'/')}">← Back to template</a>
    <button class="btn" id="copy-btn">Copy HTML</button>
  </div>
  <pre id="src">${escaped}</pre>
  <script>
    document.getElementById('copy-btn').addEventListener('click', function() {
      const raw = document.getElementById('src').textContent;
      navigator.clipboard.writeText(raw).then(() => {
        this.textContent = 'Copied';
        setTimeout(() => this.textContent = 'Copy HTML', 1800);
      });
    });
  </script>
</body>
</html>`;
}

// ─── HTTP server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const [urlPath, queryString = ''] = req.url.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString));

  // Demo delay — HTMX partial requests to /elements/partials/ get a 1 s artificial delay
  // so the spinner is visible in the design system demos.
  if (req.headers['hx-request'] && urlPath.startsWith('/elements/partials/')) {
    const partialPath = path.join(ROOT, urlPath);
    if (!fs.existsSync(partialPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 — Not found: ${urlPath}`);
      return;
    }
    setTimeout(() => {
      const content = fs.readFileSync(partialPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    }, 1000);
    return;
  }

  // Nav JSON — consumed by shell search
  if (urlPath === '/__nav') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(buildNav()));
    return;
  }

  // Root redirect
  if (urlPath === '/') {
    const nav  = buildNav();
    const dest = nav[0]?.files[0]?.path || '/foundations/tokens.html';
    res.writeHead(302, { Location: dest });
    res.end();
    return;
  }

  if (await handleTemplateHtmx(req, res, urlPath, params, { loadFragment })) {
    return;
  }

  let filePath = path.join(ROOT, urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 — Not found: ${urlPath}`);
    return;
  }

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  if (ext !== '.html') {
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
    return;
  }

  const activeState = params.state || null;

  let html = fs.readFileSync(filePath, 'utf8');
  const isFullDocument = /<\s*html\b/i.test(html);
  const parsedTemplate = isFullDocument ? null : renderBodyTemplate(html, filePath, activeState);

  // ?view=html — show source with includes resolved
  if (params.view === 'html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const resolvedHtml = parsedTemplate ? parsedTemplate.html : html;
    res.end(sourceView(filePath, resolvedHtml));
    return;
  }

  // ?partial=true — HTMX partial, no shell
  if (params.partial === 'true' || req.headers['hx-request']) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(parsedTemplate ? parsedTemplate.body : html);
    return;
  }

  if (parsedTemplate) {
    html = parsedTemplate.html;
  }

  html = injectShell(filePath, html, urlPath, activeState);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log('\n  ◎ Booktower UI Library');
  console.log('  ──────────────────────────────────────');
  console.log(`  http://localhost:${PORT}`);
  console.log('\n  Drop .html files into:');
  console.log('    foundations/  elements/  patterns/  templates/<app-name>/ product/');
  console.log('  Sidebar rebuilds automatically.\n');
});

// ─── WebSocket server (live reload, no deps) ──────────────────────────────────
const clients = new Set();

const wsServer = http.createServer();
wsServer.on('upgrade', (req, socket) => {
  const key    = req.headers['sec-websocket-key'];
  const accept = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );

  clients.add(socket);
  socket.on('close', () => clients.delete(socket));
  socket.on('error', () => { try { socket.destroy(); } catch {} clients.delete(socket); });
});

wsServer.listen(WS_PORT);

function broadcast() {
  const payload = Buffer.from('reload');
  const frame   = Buffer.alloc(2 + payload.length);
  frame[0] = 0x81;
  frame[1] = payload.length;
  payload.copy(frame, 2);
  for (const s of clients) {
    try { s.write(frame); } catch { clients.delete(s); }
  }
}

// ─── File watcher (built-in fs.watch, recursive) ──────────────────────────────
let debounce;
const WATCH = ['shell', 'assets', 'foundations', 'elements', 'patterns', 'templates', 'product'];

for (const dir of WATCH) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  fs.watch(abs, { recursive: true }, (event, filename) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      process.stdout.write(`  ↺  ${dir}/${filename}\n`);
      invalidateNav();
      broadcast();
    }, 80);
  });
}
