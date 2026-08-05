// Fails the build on JS hygiene gaps (AGENT.md → JavaScript): a file in assets/js
// not documented in docs/JAVASCRIPT.md, a documented file that no longer exists, or
// a file referenced nowhere (a template <script> or server.js global injection).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsDir = path.join(root, 'assets', 'js');
const doc = fs.readFileSync(path.join(root, 'docs', 'JAVASCRIPT.md'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');

const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
const documented = new Set([...doc.matchAll(/^###\s+`([\w.-]+\.js)`/gm)].map(m => m[1]));

const templates = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) templates.push(fs.readFileSync(p, 'utf8'));
  }
})(path.join(root, 'templates'));
const refs = templates.join('\n') + server;

const undocumented = files.filter(f => !documented.has(f));
const missing = [...documented].filter(f => !files.includes(f));
const unused = files.filter(f => !refs.includes(f));

const problems = [];
if (undocumented.length) problems.push('Undocumented in JAVASCRIPT.md:\n  ' + undocumented.join('\n  '));
if (missing.length) problems.push('Documented but missing from assets/js:\n  ' + missing.join('\n  '));
if (unused.length) problems.push('Referenced nowhere (template or server.js):\n  ' + unused.join('\n  '));

if (problems.length) {
  console.error('check-js:\n' + problems.join('\n'));
  process.exit(1);
}
console.log('check-js: all JS documented, present, and referenced.');
