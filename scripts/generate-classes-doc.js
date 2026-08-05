// Generates docs/CLASSES.md from compiled assets/booktower.css.
// Runs in `npm run build`. Never edit docs/CLASSES.md by hand.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

function cssClasses(css) {
  const s = new Set();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g))
    for (const c of m[1].matchAll(/\.([a-zA-Z][\w-]*)/g)) s.add(c[1]);
  return s;
}

const bt = cssClasses(read('assets/booktower.css'));
const bootstrap = new Set(read('scripts/bootstrap-classes.txt').split('\n').filter(Boolean));
// SVG illustration plumbing, not part of the component API
const svgInternals = cssClasses(read('assets/scss/patterns/_svg-animations.scss'));

const custom = [...bt].filter(c => !bootstrap.has(c) && !svgInternals.has(c)).sort();
const restyled = [...bt].filter(c => bootstrap.has(c)).sort();

// group by BEM block
const block = c => c.split('__')[0].split('--')[0];
const groups = new Map();
for (const c of custom) {
  const b = block(c);
  if (!groups.has(b)) groups.set(b, []);
  groups.get(b).push(c);
}

let out = `# Booktower class reference (generated)

Generated from \`assets/booktower.css\` by \`scripts/generate-classes-doc.js\`,
which runs in \`npm run build\`. Do not edit by hand.

A class not listed here does not exist — do not use it. Usage notes and
gotchas live in \`AGENT.md\`; \`npm test\` (\`check:classes\`) enforces this
list mechanically. SVG illustration internals (\`_svg-animations.scss\`) are
excluded — they are not part of the component API.

## Custom classes

\`\`\`
`;
out += [...groups.entries()]
  .sort((a, z) => a[0].localeCompare(z[0]))
  .map(([, cs]) => cs.join('\n'))
  .join('\n\n');
out += `
\`\`\`

## Bootstrap class names restyled by Booktower

Defined by Bootstrap, overridden with Booktower tokens — getbootstrap.com is
the usage reference:

\`\`\`
${restyled.join('\n')}
\`\`\`
`;

fs.writeFileSync(path.join(root, 'docs/CLASSES.md'), out);
console.log(`docs/CLASSES.md: ${custom.length} custom, ${restyled.length} restyled Bootstrap classes`);
