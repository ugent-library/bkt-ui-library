// Applies .browserslistrc to the compiled CSS. autoprefixer as a library — the two
// literal paths don't justify postcss-cli's dependency tree.
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

(async () => {
  for (const file of ['assets/booktower.css', 'shell/shell.css']) {
    const css = path.join(__dirname, '..', file);
    const result = await postcss([autoprefixer]).process(fs.readFileSync(css, 'utf8'), {
      from: css,
      to: css,
      map: false,
    });
    for (const warning of result.warnings()) console.warn(String(warning));
    fs.writeFileSync(css, result.css);
    console.log(`${file} autoprefixed`);
  }
})();
