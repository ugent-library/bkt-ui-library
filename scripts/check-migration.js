// Reports old UI class blocks missing from CHANGELOG's migration map; not yet in npm test.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const oldCss = read('docs/analysis/old-ui-kit-css/main.css');
const changelog = read('CHANGELOG.md');

const blocks = new Set();
for (const m of oldCss.matchAll(/\.((?:bc|c|u)-[a-zA-Z0-9_-]+)/g))
  blocks.add(m[1].split('__')[0].split('--')[0]);

const unmapped = [...blocks].filter(b => !changelog.includes(b)).sort();

console.log(`Old custom class blocks: ${blocks.size}`);
console.log(`Without a CHANGELOG mention: ${unmapped.length}`);
for (const b of unmapped) console.log(`  ${b}`);
process.exit(unmapped.length ? 1 : 0);
