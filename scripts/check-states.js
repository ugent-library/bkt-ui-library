// Fails the build on @state declarations and blocks the server would silently mis-render.
// The five rules, and what each one breaks: docs/SERVER.md → Template states.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dirs = ['templates', 'elements', 'patterns', 'foundations', 'getting-started'];

const META = /^\s*<!--\s*@(title|surface|states)\s*:/i;
const STATES = /^\s*<!--\s*@states\s*:\s*(.*?)\s*-->\s*$/i;
const OPEN = /<!--\s*@state:\s*([\w][\w\s-]*?)\s*-->/;
const CLOSE = /<!--\s*@\/?state\s*-->/;
const INCLUDE = /<!--\s*@include:\s*([^\s]+)\s*-->/;

const files = [];
for (const d of dirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  (function walk(p) {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const f = path.join(p, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith('.html')) files.push(f);
    }
  })(dir);
}

const rel = f => path.relative(root, f);
const read = f => fs.readFileSync(f, 'utf8').split('\n');

// ── What each file holds ──────────────────────────────────────────────────────

const declared = new Map();   // file → [state names]
const blocks = new Map();     // file → [{ names, line, includes }]
const errors = [];

for (const file of files) {
  const lines = read(file);
  const found = [];
  let open = null;

  // mirror of server.js parseMetaAndBody — change both together
  let metaEnd = 0;
  for (const line of lines) {
    if (!/^\s*<!--.*-->\s*$/.test(line)) break;
    if (/<!--\s*@(include\b|\/?state\b)/.test(line)) break;
    metaEnd += 1;
  }

  lines.forEach((line, i) => {
    if (META.test(line) && !line.includes('-->')) {
      errors.push(`${rel(file)}:${i + 1}  meta declaration wrapped over two lines — put it on one, ` +
        'however long it runs');
    }
    const states = line.match(STATES);
    if (states) {
      if (i < metaEnd) {
        declared.set(file, states[1].split(',').map(s => s.trim()).filter(Boolean));
      } else {
        errors.push(`${rel(file)}:${i + 1}  @states sits below the meta head, which ends at ` +
          `line ${metaEnd + 1} — the server never sees it. Keep @states in the leading run of ` +
          'one-line comments, above any @include, @state block or markup');
      }
    }
    const opener = line.match(OPEN);
    if (opener) {
      open = { names: opener[1].trim().split(/\s+/), line: i + 1, includes: [] };
      return;
    }
    if (!open) return;
    if (CLOSE.test(line)) {
      found.push(open);
      open = null;
      return;
    }
    const include = line.match(INCLUDE);
    if (include) open.includes.push(include[1].trim());
  });

  if (open) errors.push(`${rel(file)}:${open.line}  @state block never closed`);
  blocks.set(file, found);
}

// ── Blocks that include a stateful partial ────────────────────────────────────

// Transitive: an include two partials deep still lands its states inside the block.
const statefulCache = new Map();
function hasStates(file) {
  if (statefulCache.has(file)) return statefulCache.get(file);
  statefulCache.set(file, false);   // breaks a cycle
  if (!fs.existsSync(file)) return false;
  const lines = read(file);
  let answer = lines.some(l => OPEN.test(l));
  if (!answer) {
    for (const line of lines) {
      const include = line.match(INCLUDE);
      if (include && hasStates(path.join(root, include[1].trim()))) {
        answer = true;
        break;
      }
    }
  }
  statefulCache.set(file, answer);
  return answer;
}

for (const [file, found] of blocks) {
  for (const block of found) {
    for (const include of block.includes) {
      if (hasStates(path.join(root, include))) {
        errors.push(`${rel(file)}:${block.line}  @state block includes ${include}, which has ` +
          '@state blocks of its own — the block ends at the first closer inside it. Render the ' +
          'include ungated and put a marker inside the block instead');
      }
    }
  }
}

// ── Names and declarations have to meet ───────────────────────────────────────

// A partial is shared, so its names answer to every host's declarations together, not to one host's.
const everyDeclared = new Set([...declared.values()].flat());

for (const [file, found] of blocks) {
  const unknown = new Set();
  for (const block of found) {
    for (const name of block.names) if (!everyDeclared.has(name)) unknown.add(name);
  }
  for (const name of unknown) {
    errors.push(`${rel(file)}  @state block named "${name}", which no template declares in @states`);
  }
}

const reachedCache = new Map();
function namesIn(file) {
  if (reachedCache.has(file)) return reachedCache.get(file);
  const names = new Set();
  reachedCache.set(file, names);
  if (!fs.existsSync(file)) return names;
  for (const block of blocks.get(file) || []) block.names.forEach(n => names.add(n));
  for (const line of read(file)) {
    const include = line.match(INCLUDE);
    if (include) namesIn(path.join(root, include[1].trim())).forEach(n => names.add(n));
  }
  return names;
}

for (const [file, names] of declared) {
  const reached = namesIn(file);
  for (const name of names) {
    if (!reached.has(name)) {
      errors.push(`${rel(file)}  declares state "${name}" but no @state block names it — the ` +
        'state button renders the default page. Delete the declaration or write the block');
    }
  }
}

if (errors.length) {
  console.error('Template state problems (docs/SERVER.md → Template states):\n  ' +
    errors.join('\n  '));
  process.exit(1);
}
console.log(`check-states: ${declared.size} stateful templates, ${blocks.size} files clean.`);
