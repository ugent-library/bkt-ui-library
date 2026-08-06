// Stamps compiled booktower.css with its source commit, so consumers can trace their copy.
// Bang comment (/*!) survives consumer minifiers; commit date (not build time) keeps rebuilds byte-identical.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const css = path.join(__dirname, '..', 'assets', 'booktower.css');

let stamp = 'unknown';
try {
  stamp = execSync('git log -1 --format=%h/%cs', {
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
  }).toString().trim();
} catch {}

const line = `/*! Booktower ${stamp} */`;
let text = fs.readFileSync(css, 'utf8').replace(/\/\*! Booktower [^*]* \*\/\n/, '');
text = text.startsWith('@charset "UTF-8";')
  ? text.replace('@charset "UTF-8";', `@charset "UTF-8";\n${line}`)
  : `${line}\n${text}`;
fs.writeFileSync(css, text);
console.log(`assets/booktower.css stamped: ${stamp}`);
