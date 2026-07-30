// Rule references like H1, E5, §A in AGENT.md point into docs/ACCESSIBILITY.md.
// Renumbering a section there would silently break them — this fails instead.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const acc = read('docs/ACCESSIBILITY.md');
const definedRules = new Set([...acc.matchAll(/^\*\*([A-J]\d)\./gm)].map(m => m[1]));
const definedSections = new Set([...acc.matchAll(/^## ([A-J])\./gm)].map(m => m[1]));

const agent = read('AGENT.md');
const missing = new Set();
for (const m of agent.matchAll(/\b([A-J]\d)\b/g))
  if (!definedRules.has(m[1])) missing.add(m[1]);
for (const m of agent.matchAll(/§([A-J])\b/g))
  if (!definedSections.has(m[1])) missing.add(`§${m[1]}`);

console.log(`Rule refs in AGENT.md missing from docs/ACCESSIBILITY.md: ${missing.size}`);
for (const r of [...missing].sort()) console.log(`  ${r}`);
process.exit(missing.size ? 1 : 0);
