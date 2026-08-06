// Fails the build on code that has been commented out to park it (docs/CODE-COMMENTS.md).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dirs = [['assets', 'scss'], ['assets', 'js'], ['shell', 'scss']];
const skip = /_icon-font\.scss$/;

const files = [];
for (const d of dirs) {
  const dir = path.join(root, ...d);
  if (!fs.existsSync(dir)) continue;
  (function walk(p) {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const f = path.join(p, e.name);
      if (e.isDirectory()) walk(f);
      else if (/\.(scss|js)$/.test(e.name) && !skip.test(f)) files.push(f);
    }
  })(dir);
}

const DEAD = /^\s*(\/\/|\/\*)\s*-{0,2}[a-z][-a-z]*\s*:\s*[^;]+;/i;

const hits = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  src.split('\n').forEach((l, i) => {
    if (DEAD.test(l)) hits.push(`${path.relative(root, file)}:${i + 1}  ${l.trim().slice(0, 80)}  (commented-out code)`);
  });
}

if (hits.length) {
  console.error(
    'Code commented out rather than deleted (docs/CODE-COMMENTS.md):\n  ' +
    hits.join('\n  ') +
    '\nDelete it — the commit you delete it in is the record.'
  );
  process.exit(1);
}
console.log(`check-comments: ${files.length} files clean.`);
