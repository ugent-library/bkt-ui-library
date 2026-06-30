// Shared helper, not a content block: used by scope-list and scope-form.
module.exports = function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};
