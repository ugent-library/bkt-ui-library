// Fails when an old UI class block has no entry in the old→new migration guide.
// A modifier or element migrates with its root, so only roots need an entry.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const rootOf = cls => cls.split('__')[0].split('--')[0].split('_')[0];

const blocks = new Set();
for (const m of read('docs/analysis/old-ui-kit-css/main.css').matchAll(/\.((?:bc|c|u)-[a-zA-Z0-9_-]+)/g))
  blocks.add(rootOf(m[1]));

// Only the OLD column of a table row names a class this guide has to cover.
const mapped = new Set();
for (const line of read('docs/MIGRATING-FROM-OLD-KIT.md').split('\n')) {
  if (!line.startsWith('|')) continue;
  for (const m of line.split('|')[1].matchAll(/`\.?((?:bc|c|u)-[a-zA-Z0-9_-]+)`/g))
    mapped.add(rootOf(m[1]));
}

const covered = block => {
  const parts = block.split('-');
  for (let i = parts.length; i >= 2; i--) if (mapped.has(parts.slice(0, i).join('-'))) return true;
  return false;
};

const unmapped = [...blocks].filter(b => !covered(b)).sort();

console.log(`Old custom class blocks: ${blocks.size}`);
console.log(`Without an entry in docs/MIGRATING-FROM-OLD-KIT.md: ${unmapped.length}`);
for (const b of unmapped) console.log(`  ${b}`);
process.exit(unmapped.length ? 1 : 0);
