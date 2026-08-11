// Turns the working tree into a review list: the kit pages a change is visible on, as URLs.
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3111;
const PAGE = /^(templates|patterns|elements|foundations|getting-started)\/(?!partials\/).+\.html$/;
const PARTIAL = /^templates\/partials\/.+\.html$/;
const ROOTS = 'templates patterns elements foundations getting-started';

const changed = execSync('git status --porcelain', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter(l => l.slice(0, 2).trim() !== 'D')
  .map(l => l.slice(3).replace(/^"|"$/g, '').split(' -> ').pop());

const pages = new Set(changed.filter(p => PAGE.test(p)));

for (const partial of changed.filter(p => PARTIAL.test(p))) {
  execSync(`grep -rl "${partial}" ${ROOTS} || true`, { encoding: 'utf8' })
    .split('\n')
    .filter(p => PAGE.test(p))
    .forEach(p => pages.add(p));
}

if (pages.size) {
  console.log('\nPages to check:');
  for (const p of [...pages].sort()) console.log(`  http://localhost:${PORT}/${p}`);
} else {
  console.log('\nNo page change in the working tree.');
}

if (changed.some(p => p.startsWith('assets/scss/'))) {
  console.log('\nSCSS changed — npm run build before checking a page.');
}

console.log('');
