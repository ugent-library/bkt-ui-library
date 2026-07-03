// Fails the build if an SCSS partial exists that booktower.scss doesn't @use.
// Guards against silently missing components (see docs/AUDIT-BOOTSTRAP-GAPS.md §1.2).
const fs = require('fs');
const path = require('path');

const scssDir = path.join(__dirname, '..', 'assets', 'scss');
const entry = fs.readFileSync(path.join(scssDir, 'booktower.scss'), 'utf8');
const used = new Set([...entry.matchAll(/@use\s+'([^']+)'/g)].map(m => m[1]));

const missing = [];
for (const dir of fs.readdirSync(scssDir, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const f of fs.readdirSync(path.join(scssDir, dir.name))) {
    if (!f.startsWith('_') || !f.endsWith('.scss')) continue;
    const name = `${dir.name}/${f.slice(1, -5)}`;
    if (!used.has(name)) missing.push(name);
  }
}

if (missing.length) {
  console.error('Partials not @use\'d in booktower.scss:\n  ' + missing.join('\n  '));
  process.exit(1);
}
console.log('check-partials: all partials are imported.');
