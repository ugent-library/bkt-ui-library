const fs = require('fs');

const instructionLimits = {
  'AGENTS.md': { lines: 180, words: 1800 },
  'CLAUDE.md': { lines: 20, words: 100 },
  'docs/SPEC-WRITING.md': { lines: 150, words: 1300 },
  'docs/CODE-COMMENTS.md': { lines: 90, words: 650 },
  'docs/JAVASCRIPT.md': { lines: 230, words: 1600 },
  'docs/KIT-PAGES.md': { lines: 90, words: 650 },
  'docs/FEATURE-WORKFLOW.md': { lines: 120, words: 900 },
  'docs/BREADBOARD-TEMPLATE.md': { lines: 80, words: 500 },
  'docs/WIREFRAME-BRIEF-TEMPLATE.md': { lines: 100, words: 550 },
  'docs/ISSUE-TEMPLATE.md': { lines: 80, words: 450 },
  'docs/PRODUCT-BET-TEMPLATE.md': { lines: 70, words: 350 },
  '.claude/skills/biblio-feature-workflow/SKILL.md': { lines: 60, words: 400 },
  '.claude/skills/biblio-issue-writer/SKILL.md': { lines: 40, words: 250 },
  '.claude/skills/product-bet-writer/SKILL.md': { lines: 40, words: 250 },
  '.claude/skills/prose-audit/SKILL.md': { lines: 40, words: 250 },
  '.claude/rules/prose.md': { lines: 30, words: 180 },
};

const failures = [];

function countWords(text) {
  return (text.match(/\S+/g) || []).length;
}

for (const [file, limit] of Object.entries(instructionLimits)) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n').length - 1;
  const words = countWords(text);
  if (lines > limit.lines || words > limit.words) {
    failures.push(`${file}: ${lines}/${limit.lines} lines, ${words}/${limit.words} words`);
  }
}

const draftLimits = {
  'docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md': 1800,
  'docs/wip/QUERY-BUILDER-MEASUREMENT.md': 500,
  'docs/wip/QUERY-BUILDER-OR-GROUPS.md': 650,
};

for (const name of fs.readdirSync('docs/wip')) {
  if (name.includes('-ISSUE-') && name.endsWith('.md')) {
    draftLimits[`docs/wip/${name}`] = 350;
  }
  if (name.endsWith('-BET.md')) {
    draftLimits[`docs/wip/${name}`] = 800;
  }
}

for (const [file, wordsLimit] of Object.entries(draftLimits)) {
  const words = countWords(fs.readFileSync(file, 'utf8'));
  if (words > wordsLimit) {
    failures.push(`${file}: ${words}/${wordsLimit} raw words`);
  }
}

// Kit-page ceilings from docs/KIT-PAGES.md: prose outside demo bodies, demo labels,
// code, tables and headings counts; foundations/ and getting-started/ are exempt.
const kitLimits = [['elements', 250], ['patterns', 500]];
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const EXCLUDED_TAGS = new Set(['pre', 'code', 'table', 'script', 'style', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const EXCLUDED_CLASSES = ['ds-demo-body', 'ds-demo-label', 'ds-demo-title', 'ds-code', 'ds-eyebrow'];

function countKitProse(html) {
  html = html.replace(/<!--[\s\S]*?-->/g, ' ');
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
  const stack = [];
  let words = 0;
  let last = 0;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    if (!stack.some((el) => el.excluded)) {
      const tokens = html.slice(last, m.index).replace(/&[a-z#0-9]+;/gi, ' ').match(/[\p{L}\p{N}][^\s<>]*/gu);
      if (tokens) words += tokens.length;
    }
    last = tagRe.lastIndex;
    const [, closing, rawTag, attrs] = m;
    const tag = rawTag.toLowerCase();
    if (VOID_TAGS.has(tag) || /\/\s*$/.test(attrs)) continue;
    if (closing) {
      const at = stack.map((el) => el.tag).lastIndexOf(tag);
      if (at !== -1) stack.length = at;
    } else {
      const cls = attrs.match(/class\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const classes = ((cls && (cls[1] || cls[2])) || '').split(/\s+/);
      stack.push({ tag, excluded: EXCLUDED_TAGS.has(tag) || EXCLUDED_CLASSES.some((c) => classes.includes(c)) });
    }
  }
  return words;
}

let kitPages = 0;
for (const [dir, limit] of kitLimits) {
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.html'))) {
    kitPages += 1;
    const words = countKitProse(fs.readFileSync(`${dir}/${name}`, 'utf8'));
    if (words > limit) {
      failures.push(`${dir}/${name}: ${words}/${limit} explanatory prose words (docs/KIT-PAGES.md)`);
    }
  }
}

if (failures.length) {
  console.error('Prose budget exceeded:\n  ' + failures.join('\n  '));
  console.error('Replace or delete existing prose; never append another exception or park prose in comments. Fix only files this session edited; report other breaches.');
  process.exit(1);
}

console.log(
  `check-prose: ${Object.keys(instructionLimits).length} instruction files, ` +
  `${Object.keys(draftLimits).length} active drafts and ${kitPages} kit pages within budget.`,
);
