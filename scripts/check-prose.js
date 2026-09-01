const fs = require('fs');

const instructionLimits = {
  'AGENTS.md': { lines: 180, words: 1800 },
  'CLAUDE.md': { lines: 20, words: 100 },
  'docs/SPEC-WRITING.md': { lines: 150, words: 1300 },
  'docs/CODE-COMMENTS.md': { lines: 90, words: 650 },
  'docs/JAVASCRIPT.md': { lines: 230, words: 1600 },
  'docs/KIT-PAGES.md': { lines: 90, words: 650 },
  'docs/FEATURE-WORKFLOW.md': { lines: 120, words: 900 },
  'docs/FLOW-TEMPLATE.md': { lines: 80, words: 500 },
  'docs/WIREFRAME-BRIEF-TEMPLATE.md': { lines: 100, words: 550 },
  'docs/ISSUE-TEMPLATE.md': { lines: 80, words: 450 },
  'docs/PRODUCT-BET-TEMPLATE.md': { lines: 70, words: 350 },
  '.claude/skills/biblio-feature-workflow/SKILL.md': { lines: 60, words: 400 },
  '.claude/skills/biblio-issue-writer/SKILL.md': { lines: 40, words: 250 },
  '.claude/skills/product-bet-writer/SKILL.md': { lines: 40, words: 250 },
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

if (failures.length) {
  console.error('Prose instruction budget exceeded:\n  ' + failures.join('\n  '));
  console.error('Replace or delete an existing rule; do not append another exception.');
  process.exit(1);
}

console.log(
  `check-prose: ${Object.keys(instructionLimits).length} instruction files and ` +
  `${Object.keys(draftLimits).length} active drafts within budget.`,
);
