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
 */

const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');

const PORT    = 3111;
const WS_PORT = 3001;
const ROOT    = __dirname;
const DEFAULT_CSS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  '/assets/booktower.css',
];
const DEFAULT_HEAD_SCRIPTS = [
  'https://unpkg.com/htmx.org@1.9.12',
];
const DEFAULT_FOOTER_SCRIPTS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
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
  { dir: 'foundations', label: 'Foundations' },
  { dir: 'elements',    label: 'Elements'    },
  { dir: 'patterns',    label: 'Patterns'    },
  { dir: 'templates',   label: 'Templates'   },
  { dir: 'base',        label: 'base'        },
];

// ─── Build nav from filesystem ────────────────────────────────────────────────
function buildNav() {
  return SECTIONS.reduce((acc, section) => {
    const dirPath = path.join(ROOT, section.dir);
    if (!fs.existsSync(dirPath)) return acc;

    if (section.dir === 'templates') {
      // Each subdirectory (excluding partials) becomes a named collapsible group (one group = one app).
      // Top-level .html files in templates/ are listed before any groups.
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      const topFiles = entries
        .filter(e => !e.isDirectory() && e.name.endsWith('.html'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(e => ({
          name:       slugToLabel(e.name.replace('.html', '')),
          path:       `/templates/${e.name}`,
          isTemplate: true,
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
            })),
        }))
        .filter(g => g.files.length);

      if (topFiles.length || groups.length) {
        acc.push({ ...section, files: topFiles, groups });
      }
      return acc;
    }

    // All other sections: flat file list
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
    // Stop parsing meta directives when we hit an @include — leave it in the body
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
  return { meta, body };
}

function resolveIncludes(body, filePath) {
  return body.replace(/<!--\s*@include:\s*([^\s]+)\s*-->/g, (match, includePath) => {
    const abs = path.join(ROOT, includePath.trim());
    if (!fs.existsSync(abs)) {
      return `<!-- @include not found: ${includePath} -->`;
    }
    // Strip meta comments from included file — include only the body fragment
    const raw = fs.readFileSync(abs, 'utf8');
    const { body: fragment } = parseMetaAndBody(raw, abs);
    return fragment;
  });
}

function renderBodyTemplate(raw, filePath) {
  const { meta, body: rawBody } = parseMetaAndBody(raw, filePath);
  const body = resolveIncludes(rawBody, filePath);
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

// ─── Nav link renderer ────────────────────────────────────────────────────────
function renderNavLink(f, currentPath) {
  const active = currentPath === f.path;
  if (f.isTemplate) {
    return `
          <div class="bt-nav-template-item${active ? ' active' : ''}">
            <a href="${f.path}" class="bt-nav-link${active ? ' active' : ''}">${f.name}</a>
            <span class="bt-nav-template-actions">
              <a href="${f.path}" class="bt-nav-action" title="View template">⊙</a>
              <a href="${f.path}?view=html" class="bt-nav-action" title="Show HTML">&lt;/&gt;</a>
            </span>
          </div>`;
  }
  return `<a href="${f.path}" class="bt-nav-link${active ? ' active' : ''}">${f.name}</a>`;
}

// ─── Shell injection ──────────────────────────────────────────────────────────
function injectShell(filePath, html, currentPath) {
  if (html.includes('data-bare')) return html; // opt-out for templates in prototype mode

  const nav     = buildNav();
  const navHtml = nav.map(section => `
    <div class="bt-nav-section">
      <p class="bt-nav-section-label">${section.label}</p>
      ${(section.files || []).map(f => renderNavLink(f, currentPath)).join('\n')}
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
          ${group.files.map(f => renderNavLink(f, currentPath)).join('\n')}
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
      <kbd title="Toggle sidebar">⌘M</kbd> sidebar &nbsp;·&nbsp; <kbd title="Focus search">⌘K</kbd> search
    </div>
  </nav>
  <main id="bt-content" class="bt-content" tabindex="-1">`;

  const shellClose = `
  </main>
</div>`;

  // UI Library pages that declare no surface get backoffice density (they are
  // working tools). Templates that already declare data-surface keep their own.
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
        this.textContent = 'Copied!';
        setTimeout(() => this.textContent = 'Copy HTML', 1800);
      });
    });
  </script>
</body>
</html>`;
}

// ─── HTTP server ──────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const [urlPath, queryString = ''] = req.url.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString));

  // Demo delay — HTMX partial requests to /elements/partials/ get a 1.5 s artificial delay
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

  let html = fs.readFileSync(filePath, 'utf8');
  const isFullDocument = /<\s*html\b/i.test(html);
  const parsedTemplate = isFullDocument ? null : renderBodyTemplate(html, filePath);

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

  html = injectShell(filePath, html, urlPath);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log('\n  ◎ Booktower UI Library');
  console.log('  ──────────────────────────────────────');
  console.log(`  http://localhost:${PORT}`);
  console.log('\n  Drop .html files into:');
  console.log('    foundations/  elements/  patterns/  templates/<app-name>/');
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
const WATCH = ['shell', 'assets', 'foundations', 'elements', 'patterns', 'templates'];

for (const dir of WATCH) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  fs.watch(abs, { recursive: true }, (event, filename) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      process.stdout.write(`  ↺  ${dir}/${filename}\n`);
      broadcast();
    }, 80);
  });
}
