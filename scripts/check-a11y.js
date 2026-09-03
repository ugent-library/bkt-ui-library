// Checks the machine-testable rules in docs/ACCESSIBILITY.md; html-validate handles generic HTML and ARIA.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '');

function* htmlFiles(dirs) {
  for (const d of dirs) {
    for (const f of fs.readdirSync(path.join(root, d), { recursive: true }))
      if (String(f).endsWith('.html')) yield path.join(d, String(f));
  }
}

const problems = [];

// A1 + A2 — full page templates only (partials compose into them)
for (const f of htmlFiles(['templates'])) {
  if (f.includes('partials')) continue;
  const html = read(f);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${f}: ${h1s} <h1> elements (must be exactly 1)`);
  if (!/<main[^>]*id="main-content"/.test(html))
    problems.push(`${f}: no <main id="main-content">`);
}

// A5 + B2 — all authored HTML
for (const f of htmlFiles(['templates', 'elements', 'patterns', 'foundations', 'getting-started'])) {
  const html = read(f);

  const navLabels = [];
  for (const m of html.matchAll(/<nav\b([^>]*)>/g)) {
    const label = (m[1].match(/aria-label(?:ledby)?="([^"]*)"/) || [])[1];
    if (!label) problems.push(`${f}: <nav> without aria-label`);
    else if (navLabels.includes(label))
      problems.push(`${f}: duplicate <nav> aria-label "${label}"`);
    else navLabels.push(label);
  }

  for (const m of html.matchAll(/<(button|a)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const [tag, open] = [m[0], m[0].slice(0, m[0].indexOf('>') + 1)];
    const text = m[2].replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').trim();
    const hasIcon = /class="[^"]*\bif\b/.test(m[2]);
    const labelled = /aria-label(ledby)?=|title=/.test(open) ||
      /visually-hidden/.test(m[2]) || /aria-hidden="true"/.test(open);
    if (!text && hasIcon && !labelled) {
      const line = read(f).slice(0, m.index).split('\n').length;
      problems.push(`${f}:${line}: icon-only <${m[1]}> without accessible name`);
    }
  }
}

// ── P1-P5 — the pagination bar ───────────────────────────────────────────────
// Known old markup reports without failing. Aligned entries fail until removed from this set.
const PAGINATION_DRIFT = new Set([]);
const DISPLAY_UTIL = /\bd-(none|block|inline|inline-block|flex|(sm|md|lg|xl|xxl)-(none|block|inline|inline-block|flex))\b/;
const known = new Map();

for (const f of htmlFiles(['templates', 'elements', 'patterns', 'foundations', 'getting-started'])) {
  const html = read(f);
  const found = [];
  const at = i => html.slice(0, i).split('\n').length;

  // P1 — visually-hidden is not responsive: a display utility beside it hides
  // the text from assistive tech at some widths instead of revealing it.
  for (const m of html.matchAll(/class="([^"]*\bvisually-hidden\b[^"]*)"/g))
    if (DISPLAY_UTIL.test(m[1]))
      found.push(`${at(m.index)}: visually-hidden with a display utility ("${m[1]}")`);

  // P2 — an inert page item is a <span>; a disabled <a href> stays clickable.
  for (const m of html.matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)) {
    const cls = (m[1].match(/class="([^"]*)"/) || [])[1] || '';
    if (/\bpage-item\b/.test(cls) && /\bdisabled\b/.test(cls) && /<a\b/.test(m[2]))
      found.push(`${at(m.index)}: <a> inside li.page-item.disabled (use <span class="page-link">)`);
  }

  // P3 — arrows are icons, not text glyphs.
  for (const m of html.matchAll(/<(a|span)\b[^>]*\bpage-link\b[^>]*>([\s\S]*?)<\/\1>/g))
    if (/[‹›«»]|&[lr]saquo;|&[lr]aquo;/.test(m[2]))
      found.push(`${at(m.index)}: text glyph in a page-link (use if-chevron-left/-right)`);

  // P4 — the count is a status, not navigation: it belongs beside the <nav>.
  for (const m of html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)) {
    if (!/class="[^"]*\bpagination\b/.test(m[1])) continue;
    const outside = m[1].replace(/<ul\b[\s\S]*<\/ul>/, '').replace(/<[^>]*>/g, '')
      .replace(/&[a-z]+;/g, ' ').trim();
    if (outside) found.push(`${at(m.index)}: text inside a pagination <nav> ("${outside.slice(0, 40)}")`);
  }

  // P5 — the base reset already zeroes list margins.
  for (const m of html.matchAll(/<ul\b[^>]*class="([^"]*)"/g))
    if (/\bpagination\b/.test(m[1]) && /\bmb-0\b/.test(m[1]))
      found.push(`${at(m.index)}: redundant mb-0 on ul.pagination`);

  if (!found.length) continue;
  if (PAGINATION_DRIFT.has(f)) { known.set(f, found); continue; }
  problems.push(...found.map(p => `${f}:${p}`));
}

for (const f of PAGINATION_DRIFT)
  if (!known.has(f)) problems.push(`${f}: aligned — remove it from PAGINATION_DRIFT in this script`);

if (known.size) {
  const n = [...known.values()].reduce((a, v) => a + v.length, 0);
  console.log(`check-a11y: pre-v2.11 pagination markup — ${n} finding(s) in ${known.size} known file(s), npm run check:pagination for the list.`);
  if (process.argv.includes('--drift'))
    for (const [f, found] of known) console.log(`  ${f}\n    ` + found.join('\n    '));
}

if (problems.length) {
  console.error(`check-a11y: ${problems.length} problem(s)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log('check-a11y: house rules hold.');
