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
  { dir: 'foundations', label: 'Foundations' },
  { dir: 'elements',    label: 'Elements'    },
  { dir: 'patterns',    label: 'Patterns'    },
  { dir: 'templates',   label: 'Templates'   },
  { dir: 'base',        label: 'base'        },
  { dir: 'product',     label: 'product'     },
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

function stripHtmlComments(html) {
  return html.replace(/<!--(?!\s*\[if\b)([\s\S]*?)-->/g, '');
}

function renderBodyTemplate(raw, filePath) {
  const { meta, body: rawBody } = parseMetaAndBody(raw, filePath);
  const body = stripHtmlComments(resolveIncludes(rawBody, filePath));
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

function parseRequestBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', () => resolve(''));
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendHtml(res, html, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function getHtmxTarget(req) {
  const target = req.headers['hx-target'] || '';
  return target.startsWith('#') ? target.slice(1) : target;
}

function renderBackofficeResultsRows() {
  return `
<tr>
  <td><input type="checkbox" class="form-check-input row-check" aria-label="Select Urban forests record"></td>
  <td><a href="#" class="fw-semibold text-decoration-none">Urban forests as essential infrastructure for climate resilience and biodiversity</a></td>
  <td>Journal article</td>
  <td>2026</td>
  <td><span class="badge bg-success">Published</span></td>
</tr>
<tr>
  <td><input type="checkbox" class="form-check-input row-check" aria-label="Select tree canopy dataset"></td>
  <td><a href="#" class="fw-semibold text-decoration-none">Urban tree canopy cover measurements Belgium 2020–2025</a></td>
  <td>Dataset</td>
  <td>2026</td>
  <td><span class="badge bg-info">Submitted</span></td>
</tr>`;
}

function renderSearchResultCards() {
  return `
<article class="card bt-work-card" aria-labelledby="search-result-1">
  <div class="card-header bt-work-card__head">
    <div class="bt-meta-list pt-1">
      <span class="badge bg-success">Open access</span>
      <span class="bt-meta-list__item-bordered">Journal article</span>
    </div>
    <div class="bt-btn-toolbar">
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Cite: Urban forests as essential infrastructure">
        <i class="if if-double-quotes" aria-hidden="true"></i> Cite
      </button>
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Save: Urban forests as essential infrastructure">
        <i class="if if-list-check" aria-hidden="true"></i> Save
      </button>
      <a href="/templates/biblio-public/public-research-detail.html" class="btn btn-primary btn-sm">
        <i class="if if-book" aria-hidden="true"></i> Read
      </a>
    </div>
  </div>
  <div class="card-body bt-work-card__body">
    <h3 id="search-result-1" class="bt-work-card__title">
      <a href="/templates/biblio-public/public-research-detail.html">Urban forests as essential infrastructure for climate resilience and biodiversity</a>
    </h3>
    <p class="bt-work-card__authors">Esperon-Rodriguez, M., Arndt, S., De Pauw, K. <span class="text-muted">et al.</span></p>
    <p class="bt-work-card__pub"><span>2026</span><span class="text-muted mx-1">·</span><a href="#">Plants People Planet</a></p>
  </div>
</article>
<article class="card bt-work-card" aria-labelledby="search-result-2">
  <div class="card-header bt-work-card__head">
    <div class="bt-meta-list pt-1">
      <span class="bt-meta-list__item-bordered">Dataset</span>
    </div>
    <div class="bt-btn-toolbar">
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Cite: Urban tree canopy cover measurements Belgium 2020–2025">
        <i class="if if-double-quotes" aria-hidden="true"></i> Cite
      </button>
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Save: Urban tree canopy cover measurements Belgium 2020–2025">
        <i class="if if-list-check" aria-hidden="true"></i> Save
      </button>
      <a href="/templates/biblio-public/public-research-detail.html" class="btn btn-primary btn-sm" aria-label="View: Urban tree canopy cover measurements Belgium 2020–2025">
        <i class="if if-download" aria-hidden="true"></i> Download
      </a>
    </div>
  </div>
  <div class="card-body bt-work-card__body">
    <h3 id="search-result-2" class="bt-work-card__title">
      <a href="/templates/biblio-public/public-research-detail.html">Urban tree canopy cover measurements Belgium 2020–2025</a>
    </h3>
    <p class="bt-work-card__authors">De Pauw, K., Maes, J.</p>
    <p class="bt-work-card__pub"><span>2026</span><span class="text-muted mx-1">·</span><a href="#">Zenodo</a></p>
  </div>
</article>`;
}

function renderTokenResults() {
  return `
<div class="d-flex flex-column gap-3">
  <article class="border rounded bg-white p-3">
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="badge bg-primary">Journal article</span>
      <span class="badge bg-success">Has file</span>
    </div>
    <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Urban forests as essential infrastructure for climate resilience and biodiversity</a>
    <p class="small text-muted mb-0">Matched tokens: <code>type:journal_article</code> <code>affiliation:sciences</code> <code>has_file:true</code></p>
  </article>
  <article class="border rounded bg-white p-3">
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="badge bg-primary">Journal article</span>
      <span class="badge bg-success">Open access</span>
    </div>
    <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Hybrid classical–quantum algorithms for combinatorial optimisation in logistics</a>
    <p class="small text-muted mb-0">Matched tokens: <code>type:journal_article</code> <code>affiliation:sciences</code></p>
  </article>
</div>`;
}

function renderQueryPreview() {
  return `
<div class="bg-light border rounded p-3 mb-3 font-monospace small" id="query-summary" aria-label="Current query conditions">
  <span class="text-muted">type</span>
  <span class="fw-semibold text-dark ms-1 me-1">is</span>
  <span class="badge bg-primary fw-normal">Journal article</span>
  <span class="text-muted ms-2 me-2">AND</span>
  <span class="text-muted">year</span>
  <span class="fw-semibold text-dark ms-1 me-1">is</span>
  <span class="badge bg-primary fw-normal">2024</span>
</div>
<div class="bg-white border rounded p-3">
  <p class="text-muted small mb-2">Search URL</p>
  <code class="small">https://biblio.ugent.be/search?type=journal_article&amp;year=2024</code>
</div>`;
}

function renderConditionRow(id) {
  return `
<div class="d-flex gap-2 align-items-center mb-2" id="cond-${id}">
  <select name="field[${id}]" class="form-select w-50">
    <option value="year" selected>Publication year</option>
    <option value="type">Type</option>
    <option value="author">Author</option>
  </select>
  <select name="operator[${id}]" class="form-select w-auto">
    <option value="is" selected>is</option>
    <option value="contains">contains</option>
  </select>
  <input type="text" name="value[${id}]" class="form-control" value="2024">
  <button type="button" class="btn btn-ghost btn-sm" hx-delete="/search/conditions/${id}" hx-target="#cond-${id}" hx-swap="outerHTML" aria-label="Remove condition">
    <i class="if if-delete if--sm" aria-hidden="true"></i>
  </button>
</div>`;
}

function renderSavedSearchCard(id, title, tags) {
  return `
<div class="d-flex align-items-start gap-3 border rounded p-3">
  <div class="flex-grow-1">
    <p class="fw-semibold mb-1 small">${title}</p>
    <p class="text-muted small mb-1">${tags.map(tag => `<span class="filter-tag--static${tag.startsWith('ms-') ? '' : ' ms-1'}">${tag}</span>`).join(' ')}</p>
  </div>
  <div class="d-flex gap-2 flex-shrink-0">
    <a href="backoffice-search.html" class="btn btn-ghost btn-sm" aria-label="Run saved search">
      <i class="if if-search if--sm" aria-hidden="true"></i> Run
    </a>
    <button type="button" class="btn btn-ghost btn-sm" hx-get="/search/saved/${id}/load" hx-target="#condition-list" hx-swap="innerHTML" aria-label="Load saved search into builder">
      <i class="if if-edit if--sm" aria-hidden="true"></i> Edit
    </button>
    <button type="button" class="btn btn-ghost btn-sm text-danger" hx-delete="/search/saved/${id}" hx-target="closest div.border" hx-swap="outerHTML" aria-label="Delete saved search">
      <i class="if if-delete if--sm" aria-hidden="true"></i>
    </button>
  </div>
</div>`;
}

function renderSuggestionState(label) {
  return `<div class="px-4 py-3 small text-muted fst-italic bg-light border rounded">${label}</div>`;
}

function renderScopeList(names) {
  return `
<div class="px-4 py-3 border-bottom" id="org-scope-list" aria-label="Selected organisations" aria-live="polite">
  <div class="d-flex flex-wrap gap-2">
    ${names.map(name => `
      <span class="d-inline-flex align-items-center gap-1 badge bg-light text-dark border fw-normal py-2 px-3">
        ${name}
        <button type="button" class="btn-close btn-close-sm ms-1" aria-label="Remove ${name} from scope" hx-delete="/settings/scope/org/${slugify(name)}" hx-target="#org-scope-list" hx-swap="outerHTML"></button>
      </span>`).join('')}
  </div>
</div>`;
}

function renderScopeForm({ scoped = true, names = ['Faculty of Sciences', 'Faculty of Engineering'] } = {}) {
  const summary = scoped
    ? `
  <div class="bg-white rounded-3 bt-border mb-4 p-4 d-flex align-items-start gap-3">
    <i class="if if-check-circle text-success mt-1 flex-shrink-0" aria-hidden="true"></i>
    <div class="min-w-0">
      <p class="fw-semibold mb-2 small">Your current scope</p>
      <div class="d-flex flex-wrap gap-1 align-items-center">
        ${names.map(name => `<span class="badge bg-light text-dark border fw-normal">${name}</span>`).join('')}
        <span class="text-muted small px-1" aria-hidden="true">·</span>
        <span class="badge bg-primary">Dataset</span>
        <span class="badge bg-primary">Dissertation</span>
      </div>
    </div>
    <button type="button" class="btn btn-ghost btn-sm ms-auto text-muted flex-shrink-0"
      aria-label="Clear all scope settings"
      hx-delete="/settings/scope"
      hx-target="#scope-form"
      hx-swap="outerHTML"
      hx-confirm="Remove your scope? You'll see all records your grants allow.">
      Clear scope
    </button>
  </div>`
    : `
  <div class="bg-white rounded-3 bt-border mb-4 p-4 d-flex align-items-start gap-3">
    <i class="if if-info-circle text-muted mt-1 flex-shrink-0" aria-hidden="true"></i>
    <div>
      <p class="fw-semibold mb-1 small">No scope set</p>
      <p class="text-muted small mb-0">
        You're currently seeing everything your access rights allow.
        Configure scope below to narrow your default view.
      </p>
    </div>
  </div>`;

  return `
<form method="post" action="/settings/scope" id="scope-form">
  ${summary}
  <section aria-labelledby="org-scope-heading" class="bg-white rounded-3 bt-border mb-4">
    <div class="px-4 py-3 border-bottom">
      <h2 id="org-scope-heading" class="h6 fw-semibold mb-0">Organisations</h2>
      <p class="text-muted small mb-0 mt-1">
        Add one or more faculties, departments, or research groups.
      </p>
    </div>
    ${renderScopeList(names)}
    <div class="px-4 py-3">
      <label for="org-search" class="form-label small">Add an organisation</label>
      <div class="position-relative">
        <input
          type="search"
          id="org-search"
          class="form-control"
          placeholder="Search by faculty, department, or research group…"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="org-suggest"
          aria-expanded="false"
          hx-get="/orgs/suggest"
          hx-trigger="keyup changed delay:200ms"
          hx-target="#org-suggest"
          hx-swap="innerHTML"
          hx-indicator="#org-suggest-indicator">
        <div id="org-suggest"
          class="position-absolute start-0 end-0 top-100 bg-white border rounded-3 shadow mt-1 overflow-hidden"
          role="listbox"
          aria-label="Organisation suggestions"
          hx-on::after-swap="this.hidden = this.textContent.trim().length === 0; document.getElementById('org-search')?.setAttribute('aria-expanded', this.hidden ? 'false' : 'true')"
          hidden></div>
      </div>
      <span id="org-suggest-indicator" class="htmx-indicator text-muted small mt-1 d-block" aria-live="polite">
        Searching organisations…
      </span>
    </div>
  </section>
  <div class="d-flex justify-content-end">
    <button type="submit" class="btn btn-primary">Save scope</button>
  </div>
</form>`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderOrgSuggest() {
  return `
<ul class="list-unstyled mb-0 py-1">
  <li>
    <a href="#" class="d-flex align-items-start gap-3 py-2 px-3 text-decoration-none text-body" role="option" hx-post="/settings/scope/org" hx-vals='{"org_id":"fw","org_name":"Faculty of Sciences"}' hx-target="#org-scope-list" hx-swap="outerHTML" hx-on:click="document.getElementById('org-suggest').hidden = true; document.getElementById('org-search').value = ''; document.getElementById('org-search').setAttribute('aria-expanded', 'false')">
      <i class="if if-building if--sm text-muted flex-shrink-0 mt-1" aria-hidden="true"></i>
      <div>
        <div class="fw-semibold">Faculty of Sciences</div>
        <div class="small text-muted">FW · 3,201 works</div>
      </div>
    </a>
  </li>
  <li>
    <a href="#" class="d-flex align-items-start gap-3 py-2 px-3 text-decoration-none text-body" role="option" hx-post="/settings/scope/org" hx-vals='{"org_id":"ing","org_name":"Faculty of Engineering"}' hx-target="#org-scope-list" hx-swap="outerHTML" hx-on:click="document.getElementById('org-suggest').hidden = true; document.getElementById('org-search').value = ''; document.getElementById('org-search').setAttribute('aria-expanded', 'false')">
      <i class="if if-building if--sm text-muted flex-shrink-0 mt-1" aria-hidden="true"></i>
      <div>
        <div class="fw-semibold">Faculty of Engineering</div>
        <div class="small text-muted">ING · 2,840 works</div>
      </div>
    </a>
  </li>
</ul>`;
}

function renderJournalSuggestions() {
  return `
<div class="list-group mt-2">
  <button type="button" class="list-group-item list-group-item-action">Plants People Planet</button>
  <button type="button" class="list-group-item list-group-item-action">Nature Methods</button>
  <button type="button" class="list-group-item list-group-item-action">npj Quantum Information</button>
</div>`;
}

function renderAuthorList(name = 'Baker, Josephine') {
  return `
<div class="d-flex align-items-center gap-3 p-3 bg-white border rounded">
  <span class="bt-avatar bt-avatar--small" aria-hidden="true">ER</span>
  <div class="flex-grow-1">
    <div class="small fw-semibold">Esperon-Rodriguez, Manuel</div>
    <div class="text-muted small">External</div>
  </div>
  <button type="button" class="btn btn-ghost btn-sm p-1" aria-label="Remove Esperon-Rodriguez, Manuel from authors">
    <i class="if if-delete if--sm" aria-hidden="true"></i>
  </button>
</div>
<div class="d-flex align-items-center gap-3 p-3 bg-white border rounded">
  <span class="bt-avatar bt-avatar--small" aria-hidden="true">KD</span>
  <div class="flex-grow-1">
    <div class="small fw-semibold">De Pauw, Karen</div>
    <div class="text-muted small">UGent — Department of Environment</div>
  </div>
  <button type="button" class="btn btn-ghost btn-sm p-1" aria-label="Remove De Pauw, Karen from authors">
    <i class="if if-delete if--sm" aria-hidden="true"></i>
  </button>
</div>
<div class="d-flex align-items-center gap-3 p-3 bg-white border rounded border-success-subtle">
  <span class="bt-avatar bt-avatar--small" aria-hidden="true">JB</span>
  <div class="flex-grow-1">
    <div class="small fw-semibold">${name}</div>
    <div class="text-muted small">Added just now</div>
  </div>
  <span class="badge bg-success-subtle text-success-emphasis">New</span>
</div>`;
}

function renderUploadList() {
  return `
<div class="bg-white border rounded p-3 d-flex align-items-center gap-3">
  <i class="if if-file-pdf text-muted" aria-hidden="true"></i>
  <div class="flex-grow-1">
    <div class="small fw-semibold">publisher-version.pdf</div>
    <div class="text-muted small">2.1 MB · uploaded just now</div>
  </div>
  <button type="button" class="btn btn-ghost btn-sm">Remove</button>
</div>`;
}

function renderWorksFeed(label) {
  return `
<div class="my-5">
  <h3 class="h6 text-uppercase text-muted pb-2 mb-3">${label}</h3>
  ${renderSearchResultCards()}
</div>`;
}

function renderPeopleList() {
  return `
<div class="mb-4">
  <h2 class="h6 text-uppercase text-muted border-bottom pb-2 mb-3">D</h2>
  <ul class="list-unstyled d-flex flex-column gap-2">
    <li class="d-flex align-items-center gap-3 py-2 border-bottom">
      <span class="bt-avatar bt-avatar--small" aria-hidden="true">KD</span>
      <div>
        <a href="/persons/01K9XTVXD41Z" class="fw-semibold">De Pauw, Karen</a>
        <div class="small text-muted">Associate Professor · Department of Environment</div>
      </div>
    </li>
    <li class="d-flex align-items-center gap-3 py-2 border-bottom">
      <span class="bt-avatar bt-avatar--small" aria-hidden="true">LD</span>
      <div>
        <a href="/persons/01K9XTVXD42A" class="fw-semibold">Desmet, Lore</a>
        <div class="small text-muted">PhD researcher · Department of Food Technology</div>
      </div>
    </li>
  </ul>
</div>`;
}

function renderProjectsList() {
  return `
<ul class="list-unstyled d-flex flex-column gap-3">
  <li class="p-3 border rounded">
    <div class="d-flex align-items-start gap-3">
      <div class="flex-grow-1">
        <a href="/projects/fwo-g001234n" class="fw-semibold text-decoration-none d-block mb-1">Urban green infrastructure and climate adaptation in Flemish cities</a>
        <div class="small text-muted">FWO · G001234N · 2023–2027</div>
      </div>
      <span class="badge bg-success flex-shrink-0">Active</span>
    </div>
  </li>
</ul>`;
}

function renderExpandedAuthors() {
  return `
<ul class="list-unstyled small text-muted mb-0">
  <li>Esperon-Rodriguez, Manuel — Western Sydney University</li>
  <li>Arndt, Stefan — University of Melbourne</li>
  <li>De Pauw, Karen — Ghent University</li>
  <li>Van den Berg, Judith — Wageningen University</li>
</ul>`;
}

function renderRelatedWorks() {
  return `
<div class="d-flex flex-column gap-3">
  <article class="border rounded p-3 bg-white">
    <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Cooling co-benefits of urban tree networks in compact European cities</a>
    <p class="small text-muted mb-0">Journal article · 2025</p>
  </article>
  <article class="border rounded p-3 bg-white">
    <a href="#" class="fw-semibold text-decoration-none d-block mb-1">Planning biodiversity corridors through urban green infrastructure</a>
    <p class="small text-muted mb-0">Journal article · 2024</p>
  </article>
</div>`;
}

async function handleTemplateHtmx(req, res, urlPath, params) {
  if (!req.headers['hx-request']) return false;

  const method = req.method || 'GET';
  const target = getHtmxTarget(req);
  let bodyParams = new URLSearchParams();

  if (method !== 'GET' && method !== 'HEAD') {
    const rawBody = await parseRequestBody(req);
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      bodyParams = new URLSearchParams(rawBody);
    }
  }

  const respond = async (html, delayMs = 0, statusCode = 200, contentType = 'text/html; charset=utf-8') => {
    if (delayMs > 0) await delay(delayMs);
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(html);
    return true;
  };

  if (urlPath === '/search/suggest') {
    return respond(loadFragment('templates/partials/search-suggest-panel.html'), 220);
  }

  if (urlPath === '/search/query-preview') {
    return respond(renderQueryPreview(), 260);
  }

  if (urlPath === '/search/conditions' && method === 'POST') {
    return respond(renderConditionRow(4), 220);
  }

  if (/^\/search\/conditions\/\d+$/.test(urlPath) && method === 'DELETE') {
    return respond('', 120);
  }

  if (urlPath === '/search/saved' && method === 'POST') {
    return respond(renderSavedSearchCard(3, 'Recently added filters', ['Type: Dataset', 'Open access: yes']), 260);
  }

  if (/^\/search\/saved\/\d+\/load$/.test(urlPath) && method === 'GET') {
    return respond([renderConditionRow(1), renderConditionRow(2)].join(''), 260);
  }

  if (/^\/search\/saved\/\d+$/.test(urlPath) && method === 'DELETE') {
    return respond('', 120);
  }

  if (urlPath === '/search' && method === 'GET') {
    if (target === 'token-results') return respond(renderTokenResults(), 280);
    if (target === 'results-body') return respond(renderBackofficeResultsRows(), 280);
    if (target === 'results-list') return respond(renderWorksFeed('Matching records'), 320);
    if (target === 'search-results') return respond(renderSearchResultCards(), 320);
    return respond('<div class="small text-muted">Results updated.</div>', 220);
  }

  if (/^\/suggestions\/.+\/(confirm|reject)$/.test(urlPath) && method === 'POST') {
    const label = urlPath.endsWith('/confirm') ? 'Suggestion confirmed.' : 'Suggestion dismissed.';
    return respond(renderSuggestionState(label), 260);
  }

  if (urlPath === '/orgs/suggest' && method === 'GET') {
    return respond(renderOrgSuggest(), 220);
  }

  if (urlPath === '/settings/scope' && method === 'DELETE') {
    return respond(renderScopeForm({ scoped: false, names: [] }), 260);
  }

  if (urlPath === '/settings/scope/org' && method === 'POST') {
    const orgName = bodyParams.get('org_name') || 'Department of Physics and Astronomy';
    const names = ['Faculty of Sciences', 'Faculty of Engineering', orgName];
    return respond(renderScopeList([...new Set(names)]), 260);
  }

  if (/^\/settings\/scope\/org\//.test(urlPath) && method === 'DELETE') {
    const slug = urlPath.split('/').pop();
    const names = ['Faculty of Sciences', 'Faculty of Engineering', 'Department of Physics and Astronomy']
      .filter(name => slugify(name) !== slug);
    return respond(renderScopeList(names), 240);
  }

  if (urlPath === '/deposit/import-doi' && method === 'GET') {
    return respond(renderImportResult('DOI match'), 700);
  }

  if (urlPath === '/deposit/import-id' && method === 'GET') {
    return respond(renderImportResult('Identifier match'), 700);
  }

  if (urlPath === '/deposit/import-file' && method === 'POST') {
    return respond(renderImportResult('Imported from file'), 800);
  }

  if ((urlPath === '/deposit/add-author-form' || urlPath === '/partials/add-author-form') && method === 'GET') {
    return respond(loadFragment('templates/partials/add-author-form.html'), 220);
  }

  if (urlPath === '/partials/add-author-form' && method === 'DELETE') {
    return respond('', 80);
  }

  if (urlPath === '/people/search' && method === 'GET') {
    return respond(loadFragment('templates/partials/people-search-results.html'), 260);
  }

  if (urlPath === '/deposit/authors' && method === 'POST') {
    const selected = bodyParams.get('author_display_name');
    const externalFirst = bodyParams.get('external_first_name');
    const externalLast = bodyParams.get('external_last_name');
    const name = selected || [externalLast, externalFirst].filter(Boolean).join(', ') || 'Baker, Josephine';
    return respond(renderAuthorList(name), 260);
  }

  if (urlPath === '/deposit/save-abstract' && method === 'POST') {
    return respond('<span class="text-success-emphasis small">Abstract saved.</span>', 320);
  }

  if (urlPath === '/deposit/save-draft' && method === 'POST') {
    return respond('<span class="text-success-emphasis small">Draft saved.</span>', 360);
  }

  if (urlPath === '/deposit/upload' && method === 'POST') {
    return respond(renderUploadList(), 650);
  }

  if (urlPath === '/suggest/journals' && method === 'GET') {
    return respond(renderJournalSuggestions(), 260);
  }

  if (/^\/organisations\/.+\/works$/.test(urlPath) && method === 'GET') {
    return respond(renderWorksFeed('2026'), 450);
  }

  if (/^\/organisations\/.+\/persons$/.test(urlPath) && method === 'GET') {
    return respond(renderPeopleList(), 420);
  }

  if (/^\/organisations\/.+\/projects$/.test(urlPath) && method === 'GET') {
    return respond(renderProjectsList(), 420);
  }

  if (/^\/projects\/.+\/works$/.test(urlPath) && method === 'GET') {
    return respond(renderWorksFeed('2026'), 450);
  }

  if (/^\/persons\/.+\/works$/.test(urlPath) && method === 'GET') {
    return respond(renderWorksFeed('2026'), 450);
  }

  if (urlPath === '/partials/authors-full' && method === 'GET') {
    return respond(renderExpandedAuthors(), 380);
  }

  if (urlPath === '/partials/related' && method === 'GET') {
    return respond(renderRelatedWorks(), 420);
  }

  if ((urlPath === '/lists/add' || urlPath === '/lists/add-person') && method === 'POST') {
    return respond('', 180, 204, 'text/plain; charset=utf-8');
  }

  return false;
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

  if (await handleTemplateHtmx(req, res, urlPath, params)) {
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
      broadcast();
    }, 80);
  });
}
