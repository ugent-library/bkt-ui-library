// Blocks comments added to SCSS and JavaScript since HEAD (docs/CODE-COMMENTS.md). Runs as
// a PostToolUse hook on the edited file; with no argument it scans every source.
const fs = require('fs');
const { execSync } = require('child_process');

const root = `${__dirname}/..`;
const DIRS = ['assets/scss', 'shell/scss', 'assets/js'];
const SKIP = /_icon-font\.scss$/;
const LEADING = /^\s*(\/\/|\/\*|\*(?!\/)|\*\/)/;
const TRAILING = /(^|[^:])\/\/|\/\*/;
// The `[^:]` guard keeps an unquoted `url(https://...)` out of the trailing match.
const TODO = /(\/\/|\/\*)\s*to-?\s?do\b/i;
// A section banner or file header opens a span of the file; both carry a rule of box
// characters, which no explanatory comment does.
const BANNER = /^\s*\/[*/]\s*[\u2500\u2550\u2014\u2013=-]{2,}/;
// Provenance: Bootstrap's machinery and docs do not cover this class.
const PROVENANCE = /no Bootstrap\b|Bootstrap has no\b/i;
// Prototype fixtures and stubs name what production replaces.
const PROTOTYPE = /Prototype note:|Prototype-only|Production:/i;
const isComment = (t) =>
  !TODO.test(t) && !BANNER.test(t) && !PROVENANCE.test(t) && !PROTOTYPE.test(t) &&
  (LEADING.test(t) || TRAILING.test(t.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, '""')));

const git = (cmd) => execSync(`git ${cmd}`, { cwd: root, encoding: 'utf8' });

// Reading stdin without --hook hangs on an inherited pipe, so a bare run never tries.
const fromHook = () => {
  let raw = '';
  try { raw = fs.readFileSync(0, 'utf8'); } catch { return null; }
  try { return JSON.parse(raw).tool_input?.file_path ?? null; } catch { return null; }
};

// A file header opens with a block comment and links its contract; the doc caps it at
// three lines.
const headerEnd = (f) => {
  const lines = fs.readFileSync(`${root}/${f}`, 'utf8').split('\n');
  const first = lines[0] ?? '';
  if (/^\s*\/\//.test(first)) return lines.slice(0, 3).findIndex((l) => !/^\s*\/\//.test(l));
  if (!/^\s*\/\*/.test(first)) return 0;
  const close = lines.slice(0, 3).findIndex((l) => l.includes('*/'));
  return close === -1 ? 3 : close + 1;
};

const arg = process.argv[2];

// --list inventories every comment a sweep must rule on; the count is the contract.
if (arg === '--list') {
  const scope = process.argv[3] ? [process.argv[3]] : DIRS;
  let total = 0;
  for (const dir of scope) {
    (function walk(d) {
      for (const e of fs.readdirSync(`${root}/${d}`, { withFileTypes: true })) {
        const f = `${d}/${e.name}`;
        if (e.isDirectory()) { walk(f); continue; }
        if (!/\.(scss|js)$/.test(e.name) || SKIP.test(f)) continue;
        const end = headerEnd(f);
        fs.readFileSync(`${root}/${f}`, 'utf8').split('\n').forEach((t, i) => {
          if (isComment(t) && i + 1 > end) { total++; console.log(`${f}:${i + 1}  ${t.trim().slice(0, 96)}`); }
        });
      }
    })(dir);
  }
  console.log(`\n${total} comments to rule on.`);
  process.exit(0);
}

const target = arg === '--hook' ? fromHook() : arg;
if (arg === '--hook' && !target) process.exit(0);
let scope = DIRS;
if (target) {
  const rel = require('path').relative(root, require('path').resolve(root, target));
  if (SKIP.test(rel) || !DIRS.some((d) => rel.startsWith(`${d}/`))) process.exit(0);
  scope = [rel];
}

const hits = [];
let file = null;
let line = 0;
for (const l of git(`diff HEAD -U0 -- ${scope.join(' ')}`).split('\n')) {
  if (l.startsWith('+++ b/')) { file = l.slice(6); continue; }
  const hunk = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
  if (hunk) { line = Number(hunk[1]); continue; }
  if (!l.startsWith('+') || l.startsWith('+++')) continue;
  const text = l.slice(1);
  if (file && !SKIP.test(file) && isComment(text) && line > headerEnd(file)) {
    hits.push(`${file}:${line}  ${text.trim().slice(0, 80)}`);
  }
  line++;
}

for (const f of git(`ls-files --others --exclude-standard -- ${scope.join(' ')}`).split('\n').filter(Boolean)) {
  if (SKIP.test(f)) continue;
  const end = headerEnd(f);
  fs.readFileSync(`${root}/${f}`, 'utf8').split('\n').forEach((text, i) => {
    if (isComment(text) && i + 1 > end) hits.push(`${f}:${i + 1}  ${text.trim().slice(0, 80)}`);
  });
}

if (hits.length) {
  console.error(
    'New comments (docs/CODE-COMMENTS.md: the default is no comment):\n  ' +
    hits.join('\n  ') +
    '\nDelete each one. Keep it only when a later edit could break something silently or ' +
    'elsewhere, and say in your reply which Keep case it meets.'
  );
  process.exit(2);
}
