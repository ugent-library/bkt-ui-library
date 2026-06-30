const renderSearchResultCards = require('./search-result-cards');

module.exports = function renderWorksFeed() {
  return `
<div>
  ${renderSearchResultCards()}
</div>`;
};
