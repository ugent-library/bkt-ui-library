// Fails the build when a card block inlined in a template no longer matches the
// content module it was generated from — the drift found 2026-08-10, where months of
// sweeps lived in the HTML only and a regenerate would have reverted them.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const SOURCES = [
  {
    module: 'server/content/search-result-cards.js',
    files: [
      'templates/biblio-public/public-works.html',
      'templates/biblio-public/public-researcher-detail.html',
      'templates/biblio-public/public-organisation-detail.html'
    ]
  },
  {
    module: 'server/content/related-works.js',
    files: [
      'templates/biblio-public/public-work-detail.html',
      'templates/biblio-public/public-work-detail-dataset.html'
    ]
  }
];

const CARD = /<li><article class="bt-work-card" aria-labelledby="([^"]+)">[\s\S]*?<\/article><\/li>/g;

// Comments and indentation are the template's to choose; the markup is not.
const normalise = (html) => html.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim();

const problems = [];

for (const { module: modulePath, files } of SOURCES) {
  const rendered = require(path.join(ROOT, modulePath))();
  const generated = new Map();
  for (const match of rendered.matchAll(CARD)) generated.set(match[1], match[0]);

  for (const file of files) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    let inlined = 0;
    for (const [id, block] of generated) {
      const found = html.match(
        new RegExp(`<li><article class="bt-work-card" aria-labelledby="${id}">[\\s\\S]*?</article></li>`)
      );
      if (!found) continue;
      inlined++;
      if (normalise(found[0]) !== normalise(block)) problems.push(`${file} — ${id}`);
    }
    if (!inlined) problems.push(`${file} — no cards from ${modulePath}; is the block still inlined?`);
  }
}

if (problems.length) {
  console.error(
    'Inlined cards out of sync with their content module:\n  ' +
    problems.join('\n  ') +
    '\n\nEdit the module and the template together: the module is what a regenerate emits.'
  );
  process.exit(1);
}
console.log('check-generated: inlined cards match their content modules.');
