/**
 * Barrel for the mock content blocks. One file per block in this folder;
 * this index re-exports them so server/htmx-routes.js can require('./content')
 * and reach every block by name. To add a block: create a file here that
 * exports its render function, then add a line below.
 */

module.exports = {
  slugify: require('./slugify'),
  renderBackofficeResultsRows: require('./backoffice-results-rows'),
  renderSearchResultCards: require('./search-result-cards'),
  renderTokenResults: require('./token-results'),
  renderQueryPreview: require('./query-preview'),
  renderConditionRow: require('./condition-row'),
  renderSavedSearchCard: require('./saved-search-card'),
  renderSuggestionState: require('./suggestion-state'),
  renderImportResult: require('./import-result'),
  renderScopeList: require('./scope-list'),
  renderScopeForm: require('./scope-form'),
  renderOrgSuggest: require('./org-suggest'),
  renderListPicker: require('./list-picker'),
  renderListPanel: require('./list-panel'),
  renderJournalSuggestions: require('./journal-suggestions'),
  renderAuthorList: require('./author-list'),
  renderUploadList: require('./upload-list'),
  renderWorksFeed: require('./works-feed'),
  renderExpandedAuthors: require('./expanded-authors'),
  renderRelatedWorks: require('./related-works'),
};
