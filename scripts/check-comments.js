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

const kitDirs = ['foundations', 'elements', 'patterns', 'getting-started'];
const kitFiles = [];
for (const name of kitDirs) {
  const dir = path.join(root, name);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) kitFiles.push(path.join(dir, entry.name));
  }
}

const DEAD = /^\s*(\/\/|\/\*)\s*-{0,2}[a-z][-a-z]*\s*:\s*[^;]+;/i;

const hits = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  src.split('\n').forEach((l, i) => {
    if (DEAD.test(l)) hits.push(`${path.relative(root, file)}:${i + 1}  ${l.trim().slice(0, 80)}  (commented-out code)`);
  });
}

const DIRECTIVE = /^\s*@(title|surface|state|states|include|active|example)\b/;
const WARNING = /^\s*warning:\s+[\s\S]*\bdocs\/\S+/i;
const PROTOTYPE_NOTE = /^\s*prototype note:\s+\S[\s\S]*$/i;

for (const file of kitFiles) {
  const src = fs.readFileSync(file, 'utf8');
  for (const match of src.matchAll(/<!--([\s\S]*?)-->/g)) {
    const body = match[1].trim();
    if (DIRECTIVE.test(body) || WARNING.test(body)) continue;
    if (PROTOTYPE_NOTE.test(body) && (body.match(/\S+/g) || []).length <= 40) continue;
    const line = src.slice(0, match.index).split('\n').length;
    hits.push(
      `${path.relative(root, file)}:${line}  hidden kit-page prose; use a <=40-word ` +
        '`Prototype note:` only for source-local design flux'
    );
  }
}

if (hits.length) {
  console.error(
    'Comment rules failed (docs/CODE-COMMENTS.md):\n  ' +
    hits.join('\n  ') +
    '\nDelete parked code. Keep kit comments to directives, linked warnings or concise prototype notes.'
  );
  process.exit(1);
}
console.log(`check-comments: ${files.length} code files and ${kitFiles.length} kit pages clean.`);
