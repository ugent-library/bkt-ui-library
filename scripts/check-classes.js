// Reports drift between CSS and HTML in both directions:
//  1. classes used in HTML that no stylesheet defines (renders as nothing)
//  2. booktower.css classes used in no HTML/JS (candidates for removal)
// Bootstrap's classes come from scripts/bootstrap-classes.txt, generated from
// the pinned bootstrap dist (see package.json).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

function cssClasses(css) {
  const s = new Set();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g))
    for (const c of m[1].matchAll(/\.([a-zA-Z][\w-]*)/g)) s.add(c[1]);
  return s;
}

function* htmlFiles(dirs) {
  for (const d of dirs) {
    const abs = path.join(root, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs, { recursive: true }))
      if (String(f).endsWith('.html')) yield path.join(d, String(f));
  }
}

const btClasses = cssClasses(read('assets/booktower.css'));
const defined = new Set([
  ...btClasses,
  ...cssClasses(read('shell/shell.css')),
  ...read('scripts/bootstrap-classes.txt').split('\n').filter(Boolean),
]);

// runtime-added classes, never in static HTML
const runtime = /^(htmx-|if$|if-)/;

const used = new Map(); // class -> first file seen
let rawCorpus = '';
for (const f of htmlFiles(['templates', 'elements', 'patterns', 'foundations', 'getting-started'])) {
  const raw = read(f);
  rawCorpus += raw;
  const html = raw.replace(/<!--[\s\S]*?-->/g, ''); // ignore commented-out markup
  for (const m of html.matchAll(/class=["']([^"']+)["']/g))
    for (const c of m[1].split(/\s+/)) if (c && !used.has(c)) used.set(c, f);
}
// HTMX partials are HTML strings inside server/content/*.js — scan those too
for (const f of fs.readdirSync(path.join(root, 'server/content'))) {
  if (!f.endsWith('.js')) continue;
  for (const m of read(`server/content/${f}`).matchAll(/class=["']([^"'$]+)["']/g))
    for (const c of m[1].split(/\s+/)) if (c && !used.has(c)) used.set(c, `server/content/${f}`);
}
let js = '';
for (const d of ['assets/js', 'shell']) {
  const abs = path.join(root, d);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs, { recursive: true }))
    if (String(f).endsWith('.js')) js += read(path.join(d, String(f)));
}

// classes referenced as JS hooks (querySelector etc. in any script, incl.
// inline <script> blocks) are behaviour hooks, not missing styles
const isJsHook = c => new RegExp(`['"\`(\\s]\\.${c}\\b`).test(rawCorpus + js);

const undef = [...used].filter(([c]) => !defined.has(c) && !runtime.test(c) && !isJsHook(c));
const unused = [...btClasses].filter(c =>
  !used.has(c) && !runtime.test(c) && !new RegExp(`['"\` .]${c}['"\` )]`).test(js));

console.log(`Undefined classes used in HTML: ${undef.length}`);
for (const [c, f] of undef.sort()) console.log(`  ${c}  (${f})`);
console.log(`\nbooktower.css classes used nowhere: ${unused.length}`);
for (const c of unused.sort()) console.log(`  ${c}`);
process.exit(undef.length ? 1 : 0);
