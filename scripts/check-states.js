// Fails the build on @state and @surface-only blocks the server would silently mis-render.
// The rules, and what each one breaks: docs/SERVER.md → Template states and Surface blocks.
const fs = require('fs');
const path = require('path');
const { renderBodyTemplate } = require('../server.js');

const root = path.join(__dirname, '..');
const dirs = ['templates', 'elements', 'patterns', 'foundations', 'getting-started'];

const META = /^\s*<!--\s*@(title|surface|states)\s*:/i;
const STATES = /^\s*<!--\s*@states\s*:\s*(.*?)\s*-->\s*$/i;
const OPEN = /<!--\s*@state:\s*([\w][\w\s-]*?)\s*-->/;
const CLOSE = /<!--\s*@\/?state\s*-->/;
const SURFACE_OPEN = /<!--\s*@surface-only:\s*(.*?)\s*-->/;
const SURFACE_CLOSE = /<!--\s*@\/?surface-only\s*-->/;
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
  let openSurface = null;

  // mirror of server.js parseMetaAndBody — change both together
  let metaEnd = 0;
  for (const line of lines) {
    if (!/^\s*<!--.*-->\s*$/.test(line)) break;
    if (/<!--\s*@(include\b|\/?state\b|\/?surface-only\b)/.test(line)) break;
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
    const surfaceOpener = line.match(SURFACE_OPEN);
    if (surfaceOpener) {
      if (surfaceOpener[1] !== 'public' && surfaceOpener[1] !== 'backoffice') {
        errors.push(`${rel(file)}:${i + 1}  @surface-only surface "${surfaceOpener[1]}" — the ` +
          'server matches only public and backoffice');
      }
      openSurface = { line: i + 1 };
      return;
    }
    if (SURFACE_CLOSE.test(line)) {
      if (open && openSurface && open.line > openSurface.line) {
        errors.push(`${rel(file)}:${open.line}  @state block still open where the @surface-only ` +
          `block from line ${openSurface.line} closes — nest whole blocks, never interleave`);
      }
      openSurface = null;
      return;
    }
    if (!open) return;
    if (CLOSE.test(line)) {
      if (openSurface && openSurface.line > open.line) {
        errors.push(`${rel(file)}:${openSurface.line}  @surface-only block still open where the ` +
          `@state block from line ${open.line} closes — nest whole blocks, never interleave`);
      }
      found.push(open);
      open = null;
      return;
    }
    const include = line.match(INCLUDE);
    if (include) open.includes.push(include[1].trim());
  });

  if (open) errors.push(`${rel(file)}:${open.line}  @state block never closed`);
  if (openSurface) errors.push(`${rel(file)}:${openSurface.line}  @surface-only block never closed`);
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

// ── Every region accounts for every state ─────────────────────────────────────

const BLOCK = /<!--\s*@state:\s*([\w][\w\s-]*?)\s*-->[\s\S]*?<!--\s*@\/?state\s*-->/g;   // mirror of server.js filterStateContent
const NONE = /<!--\s*@state-none:\s*([^>]*?)\s*-->/g;

const lineOf = (src, index) => src.slice(0, index).split('\n').length;
const between = (src, from, to) => src.slice(from, to).replace(/<!--[\s\S]*?-->/g, '').trim();

for (const [file, names] of declared) {
  const src = fs.readFileSync(file, 'utf8');
  const declaredNames = new Set(names);

  const groups = [];
  for (const m of src.matchAll(BLOCK)) {
    const block = { names: m[1].trim().split(/\s+/), start: m.index, end: m.index + m[0].length };
    const last = groups[groups.length - 1];
    if (last && between(src, last.end, block.start) === '') {
      last.blocks.push(block);
      last.end = block.end;
    } else {
      groups.push({ blocks: [block], start: block.start, end: block.end, allowed: new Map() });
    }
  }

  for (const m of src.matchAll(NONE)) {
    const start = m.index;
    const end = m.index + m[0].length;
    const line = lineOf(src, start);
    const [listed, reason] = m[1].split(/\s+--\s+/);
    const group = groups.find(g =>
      (start > g.start && end < g.end) ||
      (end <= g.start && between(src, end, g.start) === '') ||
      (start >= g.end && between(src, g.end, start) === ''));

    if (!group) {
      errors.push(`${rel(file)}:${line}  @state-none sits outside any run of @state blocks — ` +
        'put it directly above, below or inside the run it excuses');
      continue;
    }
    if (!reason) {
      errors.push(`${rel(file)}:${line}  @state-none names no reason — write ` +
        `"<!-- @state-none: ${listed.trim()} -- why this region has nothing for them -->"`);
      continue;
    }
    const rendered = new Set(group.blocks.flatMap(b => b.names));
    for (const name of listed.trim().split(/\s+/)) {
      if (!declaredNames.has(name)) {
        errors.push(`${rel(file)}:${line}  @state-none names "${name}", which this template ` +
          'does not declare in @states');
      } else if (rendered.has(name)) {
        errors.push(`${rel(file)}:${line}  @state-none names "${name}", which this region ` +
          'already renders — delete the name');
      } else {
        group.allowed.set(name, reason);
      }
    }
  }

  for (const group of groups) {
    const rendered = new Set(group.blocks.flatMap(b => b.names));
    const missing = names.filter(n => !rendered.has(n) && !group.allowed.has(n));
    if (missing.length) {
      errors.push(`${rel(file)}:${lineOf(src, group.start)}  this region renders nothing for ` +
        `"${missing.join('", "')}" — add the state to a block, or record the omission above the ` +
        `region: <!-- @state-none: ${missing.join(' ')} -- why -->`);
    }
  }
}

// ── Every state still paints a page ───────────────────────────────────────────

const headingText = html => html
  .replace(/<[^>]*>/g, ' ')
  .replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

for (const [file, names] of declared) {
  const raw = fs.readFileSync(file, 'utf8');
  for (const name of names) {
    const { body } = renderBodyTemplate(raw, file, name);
    const painted = body.replace(/<(template|script)\b[\s\S]*?<\/\1>/gi, '');
    const found = [...painted.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => headingText(m[1]));

    if (!found.length) {
      errors.push(`${rel(file)}  state "${name}" renders no <h1> — add the state ` +
        'to the blocks inside the heading');
    } else if (found.length > 1) {
      errors.push(`${rel(file)}  state "${name}" renders ${found.length} <h1> elements — a page carries one ` +
        'first-level heading. Gate the extra ones by state');
    } else if (!found[0]) {
      errors.push(`${rel(file)}  state "${name}" renders an empty <h1> — the heading's blocks ` +
        'name every state but this one. Add it to the block carrying this state\'s title');
    }
  }
}

if (errors.length) {
  console.error('Template state problems (docs/SERVER.md → Template states):\n  ' +
    errors.join('\n  '));
  process.exit(1);
}
const stateCount = [...declared.values()].reduce((n, names) => n + names.length, 0);
console.log(`check-states: ${declared.size} stateful templates, ${stateCount} states rendered, ` +
  `${blocks.size} files clean.`);
