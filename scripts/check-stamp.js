// Catches committed watch:css output — sass --watch writes neither the stamp nor the prefixes.
const fs = require('fs');
const path = require('path');

const missing = ['assets/booktower.css', 'shell/shell.css'].filter(
  (file) => !fs.readFileSync(path.join(__dirname, '..', file), 'utf8').includes('/*! Booktower ')
);

if (missing.length) {
  console.error(
    `Compiled CSS without a build stamp: ${missing.join(', ')}\n` +
    'This looks like watch:css output. Run npm run build before committing compiled CSS.'
  );
  process.exit(1);
}
console.log('check-stamp: compiled CSS carries the build stamp.');
