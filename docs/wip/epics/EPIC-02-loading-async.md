# [kit][02] Loading and async feedback

## Why

Booktower ships `.htmx-indicator`, `.htmx-swapping`, `.htmx-settling` and nothing
more. Raven dims the public-search body with its own rule. Pickers show nothing while
they load. One plan for both issues, not one after the other (M, 2026-09-16).

## What

- [ ] [#41](https://github.com/ugent-library/bkt-ui-library/issues/41) Define a loading-state contract for asynchronously replaced regions — delay before dimming, opacity and transition as tokens, an `aria-live="polite"` status rendered on first load, reduced motion, whether stale content stays clickable
- [ ] [#31](https://github.com/ugent-library/bkt-ui-library/issues/31) Design loading states inside pickers — the scope is the screenshot; read it off the image
- [ ] Kit page: one demo per case
- [ ] Raven drops its `raven.css` dim rule

**Prototype:** [region](http://localhost:3111/templates/biblio-public/public-works.html?state=results),
[pickers](http://localhost:3111/patterns/filter-picker.html)

Promote to a `PLAN-*.md` before either issue is worked.
