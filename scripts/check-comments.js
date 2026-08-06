// Fails the build on changelog in code (AGENTS.md § Comments): a comment that only
// makes sense to someone who saw the diff. History belongs in the commit message.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dirs = [['assets', 'scss'], ['assets', 'js'], ['shell', 'scss']];
const skip = /_icon-font\.scss$/;

const HISTORY = [
  /\bwas\b/i, /\bwere\b/i, /\bearlier\b/i, /\bpreviously\b/i,
  /\bused to\b/i, /\bno longer\b/i, /\bremoved\b/i,
];

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
  const comments = [
    ...src.matchAll(/\/\/[^\n]*/g),
    ...src.matchAll(/\/\*[\s\S]*?\*\//g),
  ];
  for (const m of comments) {
    if (!HISTORY.some(re => re.test(m[0]))) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const text = m[0].replace(/\s+/g, ' ').trim();
    hits.push(`${path.relative(root, file)}:${line}  ${text.slice(0, 100)}`);
  }
}

if (hits.length) {
  console.error(
    'Comments that carry history or dead code, not explanation (AGENTS.md § Comments):\n  ' +
    hits.join('\n  ') +
    '\nHistory goes in the commit message; dead code goes in git.'
  );
  process.exit(1);
}
console.log(`check-comments: ${files.length} files clean.`);
