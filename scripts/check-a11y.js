// Booktower-specific accessibility checks from the AGENT.md pre-flight list —
// the mechanically checkable subset. Generic HTML/ARIA validity is
// html-validate's job (npm run check:html); this covers the house rules:
//   A1  exactly one <h1> per page template
//   A2  <main id="main-content"> on every page template
//   A5  every <nav> has an aria-label, distinct within the file
//   B2  icon-only buttons/links carry aria-label
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

if (problems.length) {
  console.error(`check-a11y: ${problems.length} problem(s)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log('check-a11y: house rules hold.');
