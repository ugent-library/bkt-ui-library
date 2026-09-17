# [kit][12] Kit hygiene

## Why

Audits and a11y modes queued since the Bootstrap programme closed (2026-08-13). None
blocks a surface. Each gap found is a design-system gap, not page CSS.

## What

Decisions on M:
- [ ] btn-secondary ≈ btn-outline-primary merge; text-bg-secondary vs text-bg-light; bt-toolbar min-height; blank-slate keep or fold
- [ ] `text-muted` with a little blue? Filter tag = clickable badge? Card action row: pattern or utilities?
- [ ] §6.1 compile Bootstrap from Sass — spike says badges win, buttons don't; settles the badge `!important` war

Audits, inventory first:
- [ ] Token usage: raw values where a `--bt-*` / `--s-*` exists
- [ ] Class drift to zero both directions; registry rot; stale comments and TODOs
- [ ] Inline `ds-code` demos duplicating "Show HTML"; one home per demo; kit completeness per page
- [ ] JS audit against `docs/JAVASCRIPT.md`, start at the copy button; rebuild the htmx patterns page; htmx review across templates
- [ ] Consistency audit — `PLAN-consistency-audit.md`, triaged

Small fixes:
- [ ] Option card: whole card is the click target; one canonical pattern with a description and nested-field variant
- [ ] `bt-textarea-auto` cancels itself in the query builder; keep one rule
- [ ] Bare z-index (6, 100) onto the token scale, or record why not
- [ ] Button padding derivation: beside the token rule in `CSS-ARCHITECTURE.md`, or drop
- [ ] [#43](https://github.com/ugent-library/bkt-ui-library/issues/43) Align shadows — popover panels inconsistent
- [ ] [#9](https://github.com/ugent-library/bkt-ui-library/issues/9) Test with forced-colors: active
- [ ] [#35](https://github.com/ugent-library/bkt-ui-library/issues/35) Persian, Hebrew, Urdu right-aligned; Mongolian maybe vertical

Testing:
- [ ] pa11y covers 12 of 75 pages; shell contrast first (epic 11), then widen. 95 template states unscanned
- [ ] One documented pre-flight per template, incl. "renders for every pilot type"; visual-regression gap
- `decision` Raise all touch targets to 44px? Density cost; not planned unless we decide

**Prototype:** [principles](http://localhost:3111/foundations/design-principles.html)
