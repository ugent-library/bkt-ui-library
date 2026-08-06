// Rule references like H1, E5, §A in AGENTS.md and docs/CLASS-USAGE.md point into
// docs/ACCESSIBILITY.md. Renumbering a section there would silently break them — this fails instead.
// Also fails on references to the pre-rename working-guide filename, so it can't creep back.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const acc = read('docs/ACCESSIBILITY.md');
const definedRules = new Set([...acc.matchAll(/^\*\*([A-J]\d)\./gm)].map(m => m[1]));
const definedSections = new Set([...acc.matchAll(/^## ([A-J])\./gm)].map(m => m[1]));

const missing = new Set();
for (const f of ['AGENTS.md', 'docs/CLASS-USAGE.md']) {
  const text = read(f);
  for (const m of text.matchAll(/\b([A-J]\d)\b/g))
    if (!definedRules.has(m[1])) missing.add(m[1]);
  for (const m of text.matchAll(/§([A-J])\b/g))
    if (!definedSections.has(m[1])) missing.add(`§${m[1]}`);
}

const SKIP = new Set(['node_modules', '.git', 'notes', 'assets']);
const stale = [];
const walk = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(md|js|html|json)$/.test(e.name) && /AGENT\.md/.test(fs.readFileSync(p, 'utf8')))
      stale.push(path.relative(root, p));
  }
};
walk(root);

console.log(`Rule refs in AGENTS.md/CLASS-USAGE.md missing from docs/ACCESSIBILITY.md: ${missing.size}`);
for (const r of [...missing].sort()) console.log(`  ${r}`);
console.log(`Files referencing the pre-rename working-guide filename: ${stale.length}`);
for (const f of stale.sort()) console.log(`  ${f}`);
process.exit(missing.size || stale.length ? 1 : 0);
