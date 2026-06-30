/**
 * HTMX endpoint map for the prototype. Each URL returns a mock fragment from
 * server/content.js. To add a route, add a branch here; to change what it
 * returns, edit the matching render* in content.js.
 *
 * handleTemplateHtmx returns true when it handled the request, false to let
 * the static file server take over. loadFragment is injected by server.js
 * (it belongs to the template engine).
 */

const c = require('./content');

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

function getHtmxTarget(req) {
  const target = req.headers['hx-target'] || '';
  return target.startsWith('#') ? target.slice(1) : target;
}

async function handleTemplateHtmx(req, res, urlPath, params, { loadFragment }) {
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
    return respond(c.renderQueryPreview(), 260);
  }

  if (urlPath === '/search/conditions' && method === 'POST') {
    return respond(c.renderConditionRow(4), 220);
  }

  if (/^\/search\/conditions\/\d+$/.test(urlPath) && method === 'DELETE') {
    return respond('', 120);
  }

  if (urlPath === '/search/saved' && method === 'POST') {
    return respond(c.renderSavedSearchCard(3, 'Recently added filters', ['Type: Dataset', 'Open access: yes']), 260);
  }

  if (/^\/search\/saved\/\d+\/load$/.test(urlPath) && method === 'GET') {
    return respond([c.renderConditionRow(1), c.renderConditionRow(2)].join(''), 260);
  }

  if (/^\/search\/saved\/\d+$/.test(urlPath) && method === 'DELETE') {
    return respond('', 120);
  }

  if (urlPath === '/search' && method === 'GET') {
    if (target === 'token-results') return respond(c.renderTokenResults(), 280);
    if (target === 'results-body') return respond(c.renderBackofficeResultsRows(), 280);
    if (target === 'results-list') return respond(c.renderWorksFeed(), 320);
    if (target === 'search-results') return respond(c.renderSearchResultCards(), 320);
    return respond('<div class="small text-muted">Results updated.</div>', 220);
  }

  if (/^\/suggestions\/.+\/(confirm|reject)$/.test(urlPath) && method === 'POST') {
    const label = urlPath.endsWith('/confirm') ? 'Suggestion confirmed.' : 'Suggestion dismissed.';
    return respond(c.renderSuggestionState(label), 260);
  }

  if (urlPath === '/orgs/suggest' && method === 'GET') {
    return respond(c.renderOrgSuggest(), 220);
  }

  if (urlPath === '/settings/scope' && method === 'DELETE') {
    return respond(c.renderScopeForm({ scoped: false, names: [] }), 260);
  }

  if (urlPath === '/settings/scope/org' && method === 'POST') {
    const orgName = bodyParams.get('org_name') || 'Department of Physics and Astronomy';
    const names = ['Faculty of Sciences', 'Faculty of Engineering', orgName];
    return respond(c.renderScopeList([...new Set(names)]), 260);
  }

  if (/^\/settings\/scope\/org\//.test(urlPath) && method === 'DELETE') {
    const slug = urlPath.split('/').pop();
    const names = ['Faculty of Sciences', 'Faculty of Engineering', 'Department of Physics and Astronomy']
      .filter(name => c.slugify(name) !== slug);
    return respond(c.renderScopeList(names), 240);
  }

  if (urlPath === '/deposit/import-doi' && method === 'GET') {
    return respond(c.renderImportResult('DOI match'), 700);
  }

  if (urlPath === '/deposit/import-id' && method === 'GET') {
    return respond(c.renderImportResult('Identifier match'), 700);
  }

  if (urlPath === '/deposit/import-file' && method === 'POST') {
    return respond(c.renderImportResult('Imported from file'), 800);
  }

  if ((urlPath === '/deposit/add-author-form' || urlPath === '/partials/add-author-form') && method === 'GET') {
    return respond(loadFragment('templates/partials/add-author-form.html'), 220);
  }

  if (urlPath === '/partials/add-author-form' && method === 'DELETE') {
    return respond('', 80);
  }

  if (urlPath === '/deposit/authors' && method === 'POST') {
    const selected = bodyParams.get('author_display_name');
    const externalFirst = bodyParams.get('external_first_name');
    const externalLast = bodyParams.get('external_last_name');
    const name = selected || [externalLast, externalFirst].filter(Boolean).join(', ') || 'Baker, Josephine';
    return respond(c.renderAuthorList(name), 260);
  }

  if (urlPath === '/deposit/save-abstract' && method === 'POST') {
    return respond('<span class="text-success-emphasis small">Abstract saved.</span>', 320);
  }

  if (urlPath === '/deposit/save-draft' && method === 'POST') {
    return respond('<span class="text-success-emphasis small">Draft saved.</span>', 360);
  }

  if (urlPath === '/deposit/upload' && method === 'POST') {
    return respond(c.renderUploadList(), 650);
  }

  if (urlPath === '/suggest/journals' && method === 'GET') {
    return respond(c.renderJournalSuggestions(), 260);
  }

  if (/^\/organisations\/.+\/works$/.test(urlPath) && method === 'GET') {
    return respond(c.renderWorksFeed(), 450);
  }

  if (/^\/organisations\/.+\/persons$/.test(urlPath) && method === 'GET') {
    return respond(c.renderPeopleList(), 420);
  }

  if (/^\/organisations\/.+\/projects$/.test(urlPath) && method === 'GET') {
    return respond(c.renderProjectsList(), 420);
  }

  if (/^\/projects\/.+\/works$/.test(urlPath) && method === 'GET') {
    return respond(c.renderWorksFeed(), 450);
  }

  if (/^\/persons\/.+\/works$/.test(urlPath) && method === 'GET') {
    return respond(c.renderWorksFeed(), 450);
  }

  if (urlPath === '/partials/authors-full' && method === 'GET') {
    return respond(c.renderExpandedAuthors(), 380);
  }

  if (urlPath === '/partials/related' && method === 'GET') {
    return respond(c.renderRelatedWorks(), 420);
  }

  if ((urlPath === '/lists/add' || urlPath === '/lists/add-person') && method === 'POST') {
    return respond('', 180, 204, 'text/plain; charset=utf-8');
  }

  return false;
}

module.exports = { handleTemplateHtmx };
