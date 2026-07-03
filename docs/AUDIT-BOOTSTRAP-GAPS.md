# Bootstrap gap audit

**Date:** 2026-07-03
**Bootstrap:** 5.3.3 (jsDelivr CDN, pinned in `server.js`)
**Method:** every SCSS partial read; every claim about Bootstrap defaults and variable names verified against the `bootstrap@5.3.3` dist CSS (same version the server injects); class usage cross-checked by scanning all HTML in `templates/`, `elements/`, `patterns/`, `foundations/`, `getting-started/` and all JS in `assets/js/`.

---

## TL;DR

Three things are broken right now. The `.form-select` dropdown arrow is erased on every page that uses a select, because a `background:` shorthand in `_bootstrap-components.scss` wipes Bootstrap's caret image. The entire `bt-blank-slate` component is missing from the compiled CSS — its partial exists but was never added to `booktower.scss`, and nothing in the build catches that. And `--bs-info-rgb` is set to a colour (`#003fa3`) that doesn't match what `--bt-blue` actually is (`#1e64c8`), so `.text-info` and `.bg-info` utilities render a different blue than `.btn-info`.

Beyond the bugs, there is a pattern: the override layer *fights* Bootstrap instead of *feeding* it. Bootstrap 5.3 exposes runtime CSS variables for alerts, buttons, progress bars and more — the codebase sometimes uses them (the second half of `_buttons.scss` does it correctly) and sometimes re-styles with selectors and `!important` (badges, alerts, the first half of `_buttons.scss`). Several overrides target variables that don't exist at all (`--bs-nav-padding-x`, `--bs-font-weight-bold`, `--bs-mark-bg`) and silently do nothing.

Templates have drifted from the CSS: 63 class names appear in HTML that no stylesheet defines, including `bt-work-card__head/__body` in 8 files (which AGENT.md explicitly says don't exist), invented Bootstrap spacing steps (`mb-6`, `py-8` — the scale ends at 5), and Tailwind habits (`min-w-0`, `flex-inline`).

The root cause of most of this is architectural: layering overrides on a prebuilt `bootstrap.min.css` means Bootstrap's compiled colours can never be changed at the source, only fought after the fact. **Recommendation: compile Bootstrap from Sass source with Booktower's `$theme-colors`.** You already run dart-sass; the change is one dependency and ~20 lines of configuration, and it deletes the badge `!important` war, the button variant re-implementations, most alert overrides, and the hand-maintained RGB triplets (including the drifted one) in a single move. Details in §6.

Suggested order of work: fix the three bugs (§1, minutes each) → delete the no-ops (§2) → automate the two guards (§6.4, §6.5) → decide on Sass compilation (§6.1) → then the feed-don't-fight cleanup in §3 either falls away (if compiling) or becomes the manual to-do list (if not).

---

## 1. Live bugs

### 1.1 `.form-select` loses its dropdown caret — all 13 templates that use selects

`components/_bootstrap-components.scss:8` sets `background: var(--bt-white)` on `.form-control, .form-select`. The `background` shorthand resets `background-image`, and Bootstrap draws the select caret as a background image. `booktower.css` loads after Bootstrap at equal specificity, so the caret is gone. Nothing later restores it.

**Fix:** `background-color: var(--bt-white)`. One word.
**Risk:** none.

### 1.2 `bt-blank-slate` is not in the compiled CSS

`patterns/_booktower-blank-slate.scss` exists and is intact, but `booktower.scss` never `@use`s it — `grep blank-slate assets/booktower.css` returns zero matches. AGENT.md lists it in the verified class list; `patterns/blank-slate.html` demos it unstyled. Nobody noticed because nothing checks that every partial is imported (see §6.4).

**Fix:** add `@use 'patterns/booktower-blank-slate';` — or use this moment to resolve the open TODO ("is blank-slate just a card with text-center?") before re-adding it.
**Risk:** none.

### 1.3 `--bs-info-rgb` doesn't match `--bt-blue`

`foundation/_bootstrap-overrides.scss:53` sets `--bs-info-rgb: 0, 63, 163` (`#003fa3`). But `--bs-info` is `var(--bt-blue)` = `--bt-blue-600` = `#1e64c8` = `30, 100, 200`. Utilities built on the triplet (`.text-info`, `.bg-info`, `.border-info`) render a different blue than `.btn-info`. Probably an old UGent blue that survived a palette change.

**Fix:** `--bs-info-rgb: 30, 100, 200;` — and see §6.1, which generates triplets so this class of drift can't happen.
**Risk:** none; `#003fa3` was never a token.

### 1.4 `mark` highlight colour never applies

`_bootstrap-overrides.scss:61` sets `--bs-mark-bg: var(--bt-light-yellow)`, but Bootstrap 5.3 reads `--bs-highlight-bg` — `--bs-mark-bg` doesn't exist in the dist CSS. Marks render Bootstrap's stock `#fff3cd`, not the token. (The companion `--bs-mark-padding` also isn't a Bootstrap variable, but it happens to work because `_typography.scss:124` consumes it — a Booktower rule wearing a `--bs-` costume; rename it or inline the value.)

**Fix:** set `--bs-highlight-bg: var(--bt-light-yellow)` (and `--bs-highlight-color` if needed); drop the fake `--bs-mark-*` pair.
**Risk:** none.

---

## 2. Dead code and no-op overrides

Verified against the 5.3.3 dist: each "doesn't exist" below has zero occurrences in Bootstrap's CSS.

| # | Location | Finding | Fix |
|---|----------|---------|-----|
| 2.1 | `_bootstrap-overrides.scss:20` | `--bs-font-weight-bold` doesn't exist in Bootstrap. No-op. | Delete. `.fw-bold` is compiled to `700` anyway. |
| 2.2 | `_bootstrap-overrides.scss:106` | `--bs-nav-padding-x` doesn't exist — the real variable is `--bs-nav-link-padding-x`. The `!important` on it is doubly pointless (see 2.9). No-op. | Rename to `--bs-nav-link-padding-x`, drop `!important`. |
| 2.3 | `_bootstrap-overrides.scss:44–53` | `--bs-primary`, `--bs-danger`, `--bs-success`, `--bs-warning`, `--bs-info` at `:root` are consumed by `var()` **zero times** in Bootstrap's dist. Components are compiled from Sass; only the `-rgb` triplets feed utilities. Five no-op lines that *look* like they theme Bootstrap. | Delete the five non-rgb lines, or keep them documented as Booktower-internal aliases only. §6.1 makes them real. |
| 2.4 | `_surfaces.scss:26–29, 63–66, 86–91` | Six `--s-btn-*` tokens (`--s-btn-primary-bg`, `-hover`, `--s-btn-secondary-color`, `-border`, `--s-btn-dark-bg`, `-hover`) are defined on both surfaces and consumed **nowhere**. The header comment lists them under "Active surface tokens". | Delete the tokens; fix the comment. `_buttons.scss` uses `--bt-*` directly. |
| 2.5 | `_bootstrap-components.scss:11` | `var(--s-input-pad-y, .4375rem)` / `--s-input-pad-x` — the tokens are never defined (they're on the TODO list in `_surfaces.scss`), so the fallback always fires. Works, but reads as if surfaces control input padding. They don't. | Either define the tokens or inline the values. |
| 2.6 | `_buttons.scss:284–308` | `.btn-outline-info` block appears twice, identical. | Delete one. |
| 2.7 | Same-value overrides — restating what Bootstrap 5.3 already does: `.btn { line-height: 1.5; cursor: pointer }` (both are BS defaults), `.btn:disabled { pointer-events: none }` (BS default; also makes the accompanying `cursor: not-allowed` unreachable — with `pointer-events: none` the cursor never renders), `.form-control { width: 100%; line-height: 1.5 }`, `.alert { border: 1px solid transparent }`, `_reset.scss` `*{box-sizing}` and `body{margin:0}` (both in reboot). `alert--seamless-inbox` declares `border-radius: 0` twice. | Delete each. Pure noise that inflates the diff surface against Bootstrap. |
| 2.8 | `_surfaces.scss:93` | Public surface sets `--bs-secondary-color: var(--s-text-muted)`, but public never redefines `--s-text-muted`, so it resolves to the same `--bt-text-muted` that `:root` already set. No-op until a surface actually changes `--s-text-muted`. | Delete, or make public define a different muted colour if that was the intent. |
| 2.9 | `_buttons.scss:131` | `--bs-btn-color: white !important` — `!important` on a custom-property declaration only affects the cascade *of the custom property itself*, and both competing declarations are same-specificity with booktower loading later. It wins anyway. | Drop `!important`. Same for `_reset.scss` `scrollbar-width: thin !important`. |
| 2.10 | `base/_accessibility.scss:33` | `.sr-only` defined, used nowhere — Bootstrap 5 renamed it `visually-hidden`, which is what the codebase actually uses. | Delete unless it's a deliberate compat shim for pasted code; then say so in a comment. |
| 2.11 | `patterns/_svg-animations.scss` (265 lines) | The partial and the actual SVGs have desynced in both directions: CSS animates `pinDot`, `pinTall`, `gLat`, `gMer`, `shimmer`, `axis`, `travDot`… — **no SVG, template, or JS anywhere in the repo carries these classes**. Meanwhile `patterns/hero.html` uses `frontSoft`, which no CSS defines. | Rebuild the partial against the SVGs that actually exist, or delete it. Currently it's ~250 lines of dead weight shipping in every page load. |
| 2.12 | Defined in CSS, used in no HTML/JS: `bt-toolbar__middle`, `bt-meta-text`, `bt-btn-toolbar--vertical`, `bt-avatar__square`, `bg-danger-light`, `alert-primary`, `u-main__sidebar--border-left`, `.bt-toolbar.h-auto`, `u-notifications`. Several are in AGENT.md's verified list, so they may be intentional API surface. | Decide per class: documented API (keep, note it) or leftovers (delete). `u-notifications` is documented infrastructure — keep. `.bt-toolbar.h-auto` piggybacks a Bootstrap utility name as a state hook and is used nowhere — delete. |

---

## 3. Fighting instead of feeding — the variables exist

Bootstrap 5.3 scopes runtime variables to each component. Where a variable exists, setting it is strictly better than re-declaring properties: you inherit all of Bootstrap's state handling (hover, active, disabled, `btn-check`) instead of re-implementing the subset you remembered.

### 3.1 Buttons use two mechanisms in one file

`_buttons.scss` styles `.btn-primary`, `.btn-secondary`, `.btn-ghost` with **property overrides** plus hand-written `:hover:not(:disabled)` / `:active:not(:disabled)` rules — then from `.btn-success` onward switches to **feeding `--bs-btn-*` variables**, which is the correct 5.3 idiom.

The property-styled variants miss the states Bootstrap drives through variables. Concretely: Bootstrap applies active styling via `.btn:active, .btn.active, .btn-check:checked + .btn`, reading `--bs-btn-active-*`. Booktower's `.btn-primary` only covers the `:active` pseudo-class — so a toggled `.btn-primary.active` or a `btn-check`-checked `.btn-primary` falls through to **Bootstrap's stock compiled blue** (`#0a58ca`). Not visible today only because every `btn-check` in the templates happens to use `btn-outline-dark`/`btn-outline-light` (var-fed). It's a landmine, not a bug — until someone builds a toggle with `btn-primary`.

**Fix:** convert `.btn-primary`, `.btn-secondary`, `.btn-ghost` to the same `--bs-btn-*` block style as the other nine variants. Also: the base `.btn` rule can feed `--bs-btn-font-size`, `--bs-btn-font-weight`, `--bs-btn-padding-y/x`, `--bs-btn-border-radius`, `--bs-btn-disabled-opacity` instead of property overrides — then `.btn-sm`/`.btn-lg`/`.btn-xs` only swap variables, and the `.btn[type="submit"]` specificity crutches in the selectors can go.
**Risk:** low; visual output identical if tokens map 1:1. Test the disabled `filter: saturate(0.4)` (no BS variable for that one — it stays a property, which is fine).

### 3.2 Alerts re-style what `--bs-alert-*` already controls

`_bootstrap-components.scss:116–278`. Bootstrap 5.3 exposes `--bs-alert-color`, `--bs-alert-bg`, `--bs-alert-border-color`, `--bs-alert-link-color` (plus padding, margin, radius vars) scoped to `.alert`. The current code re-declares `background-color`/`border-color`/`color` per variant and then chases descendants: separate rules for `h2…h6, p`, `> .btn-close`, `> i`, `a:not(.btn)` in every variant — five near-identical ~25-line blocks.

Feeding the four variables per variant collapses each block to four lines, and `--bs-alert-link-color` replaces the `a:not(.btn)` rules (Bootstrap's own `.alert-link` reads it; if you want *all* links coloured, keep one shared `a:not(.btn) { color: var(--bs-alert-color) }` rule — once, not five times). The nested `.alert-dismissible .btn-close` rule inside `.alert-success` (line 175) is doubly dead: wrong nesting (it compiles to `.alert-success .alert-dismissible .btn-close`, matching nothing) and `btn-close` is a background-image icon — `color` doesn't tint it anyway.

**Fix:** per variant: `--bs-alert-color/-bg/-border-color/-link-color`. Keep the heading-colour rule once, shared, if headings must differ from body colour.
**Risk:** low. Check dismissible alerts visually — the `.btn-close` colour rules were never doing anything, so nothing changes.

### 3.3 Progress bar

`.progress { height: 8px }` → `.progress { --bs-progress-height: 8px }`. The variable also drives the striped `background-size`, so the current property override leaves stripes sized for 1rem.

### 3.4 Nav link colour set in two files by two mechanisms

`_bootstrap-overrides.scss:103` feeds `.nav { --bs-nav-link-color }` (correct); `_bootstrap-components.scss:310` also sets `.nav-tabs .nav-link { color: var(--s-link-color) }` (property). Two files, two mechanisms, one concern — this violates the repo's own "every rule lives in exactly one place" rule. The active-tab rule can feed `--bs-nav-tabs-link-active-bg` instead of the property.

**Fix:** consolidate in one file, variables only.

### 3.5 Badges — correctly diagnosed, wrongly located

`_badges.scss` documents the problem accurately: Bootstrap's `.text-bg-*` helpers are compiled with `!important`, so overriding them requires `!important` — 29 of them. This is not fixable cleanly at runtime; it *is* the canonical argument for §6.1. Compiling with Booktower's `$theme-colors` and `$min-contrast-ratio: 4.5` makes Bootstrap generate `text-bg-*` with the right colours and correct auto-contrast, and the whole file shrinks to the `-light` soft variants and `badge--outline`.

Related naming risk: `.text-bg-primary-light` etc. mimic Bootstrap's helper naming but are Booktower inventions. A reader (or a future Claude) will assume Bootstrap semantics. Consider `badge--soft-*`, or keep the names but flag them in AGENT.md as local extensions. Judgment call.

### 3.6 Body colour has two sources of truth

`:root` says `--bs-body-color: var(--bt-text)` (gray-700 `#4d4d4d`, triplet `77,77,77`). But actual body text is `color: var(--s-body-color)` = blue-900 `#09172a` via `_reset.scss`. So anything Bootstrap renders from `--bs-body-color` (form control text default, dropdown items, offcanvas, table colour inheritance) is told the page text is a gray it isn't, and `--bs-body-color-rgb` backs the wrong colour too. This also means the `:root` body-font variables are shadowed by the property overrides on `body` — two mechanisms again.

**Fix:** pick one truth. Cleanest: make `--bs-body-color` follow the surface (`body { --bs-body-color: var(--s-body-color) }`), drop the property override from `_reset.scss`, and let reboot's `body { color: var(--bs-body-color) }` do its job. Then Bootstrap internals and the page agree by construction.
**Risk:** medium — this shifts default text colour of some Bootstrap components from gray to blue-900; review form controls and dropdowns (both already hard-set their colour in `_bootstrap-components.scss`, so likely no visible change).

---

## 4. Rebuilt components and utility duplication

Judged against the repo's own Bootstrap-first rule ("does Bootstrap have a pattern that handles this use case?").

**4.1 `bt-btn-toolbar`** is `display:flex; align-items:center; gap` — that's `d-flex align-items-center gap-2`, or Bootstrap's own `.btn-toolbar` plus a gap utility. `--wide-spacing` is `gap-3`. The `--vertical` modifier is unused (§2.12). Delete the class family; it fails the repo's own test.

**4.2 `bt-title-toolbar`** is `d-flex justify-content-between align-items-center mb-2` — four utilities. Same verdict. (If the pairing "heading + right-aligned action" is a real recurring pattern, that's a *template* pattern, not a CSS class.)

**4.3 `bt-blank-slate`** — the open TODO in UI-LAYER.md already asks whether it's "just a card with text-center". Since it's currently not even compiled (§1.2) and demoed on one kit page only, this is the cheapest moment to decide. Note the kit page also uses `bt-blank-slate-primary` (single-dash, the explicitly-removed spelling).

**4.4 `bt-navbar`** doesn't wrap Bootstrap's `.navbar` — it's a from-scratch sticky flex bar. Defensible (BS navbar drags in collapse plumbing), but it's an undocumented rejection of a Bootstrap component, and the templates betray the gap: `templates/partials/public-header.html` uses `bt-navbar__collapse` and `bt-navbar__actions`, which exist in no CSS — someone reached for responsive behaviour the component doesn't have. Either document the decision and build the missing responsive story, or rebase on BS navbar.

**4.5 Legitimate customs** (checked, no Bootstrap equivalent): `bt-avatar`, `bt-toolbar` (region layout, not BS's `.btn-toolbar` use case), `bt-work-card` (wraps `.card` correctly), `bt-file-drop`, `token-bar`, `filter-tag`/`filter-editor`, `bt-hero`, `bt-sidebar`, layout shells. No action.

---

## 5. Template ↔ CSS drift — 63 undefined classes in HTML

Full machine-generated list at the end of this section's source scan; the ones that matter:

**Ghost components (AGENT.md explicitly says these don't exist, yet they're in real templates):** `bt-work-card__head`/`__body` in **8 files** each, `bt-work-card__foot`, `bt-navbar__mark`, `bt-facets`, `bt-facet-name`/`-count`/`-check`/`-separator`/`-sep` (across `search-my-research.html`, `search-filter-first.html`, `backoffice-overview.html`, `facets.html`, `htmx-patterns.html`), `card-research`, `card--work`, `card-meta`, `card-authors`, `card-publication` (mostly `research-card-backup.html` — consider deleting that backup file outright, it's a museum of removed classes).

**Undefined modifiers that look real:** `bt-avatar--primary` (5 files), `bt-avatar--md` (the system has `--small`/`--large`, no `--md`), `form-label-sm`, `alert--small` (real name: `alert--sm`).

**Invented Boots  trap utilities — silently render as nothing:** `mb-6`, `mb-8`, `my-6`, `py-8`, `pb-8`, `g-6` (Bootstrap's spacing scale ends at 5), `min-w-0`, `flex-inline`, `align-items-top` (Tailwind vocabulary; Bootstrap: nothing / `d-inline-flex` / `align-items-start`). These are exactly the "plausible-looking classes" AGENT.md warns about, but in the utility namespace where the verified-class-list discipline doesn't currently look.

**Icon system violation:** `ri-checkbox-circle-line`, `ri-delete-bin-line` (Remix Icons) in `patterns/htmx-patterns.html` — the one-icon-system rule says these can't exist.

**Known-broken component:** `people-result__icon`/`__name` used in 4 files, defined nowhere — consistent with the standing "fix people-search" TODO.

**Fix:** one cleanup pass through the listed files, plus the guard in §6.5 so the list can't silently regrow.

---

## 6. Architecture

### 6.1 The root cause: overriding compiled CSS instead of compiling

The current model — CDN `bootstrap.min.css` + `booktower.css` on top — makes four of this audit's problem classes structurally inevitable:

1. Bootstrap's component colours are *compiled in*, so theming means re-implementing (buttons §3.1) or `!important` wars (badges §3.5).
2. `:root` theme variables are decorative (§2.3) because nothing in the dist reads them.
3. Every `*-rgb` triplet must be maintained by hand next to its hex twin — which is how §1.3 happened.
4. All of Bootstrap ships, including carousel, accordion, nav-pills, spinner-grow, figure and ratio — none used in any template today.

**Recommendation:** add `bootstrap` as a dev dependency and compile it inside `booktower.scss`:

```scss
// booktower.scss (sketch)
@use "bootstrap/scss/bootstrap" with (
  $primary:   #132e53,   // = --bt-blue-800 (Sass needs literals here)
  $success:   #71a860,
  $danger:    #dc4e28,
  $warning:   #da840b,
  $info:      #1e64c8,
  $font-family-sans-serif: (system-ui, -apple-system, "Segoe UI", ...),
  $border-radius: ..., $border-color: ...,
  $min-contrast-ratio: 4.5,
  $enable-negative-margins: false,
);
// then the booktower layers as today
```

(Or granular `@use`s of `bootstrap/scss/...` per module to drop the six unused components.)

What it deletes: §2.3 entirely, most of `_bootstrap-overrides.scss`, all 29 badge `!important`s, the three property-styled button variants *and* most var-fed ones (compiled variants come out right), the five alert variant blocks, every hand-written `-rgb` triplet. What it costs: slightly slower builds; `server.js` stops injecting the CDN CSS link (one place — the JS bundle stays on CDN, it's version-pinned in the same block); one before/after visual sweep of the kit pages. The distribution story ("copy `booktower.css` to raven") actually *improves*: one file instead of file-plus-CDN-link, one version to pin instead of two.

One real trade-off to name: with `@use ... with()`, theme colours must be Sass literals — the single-source-of-truth for palette moves from `_colors.scss` CSS variables to Sass variables, and `_colors.scss` would be generated from or aligned with them. That's a change to how the team edits colours. If that's unacceptable, the fallback is the *hybrid*: keep the CDN file but adopt the feed-don't-fight fixes in §3 manually, and accept the badge `!important`s as permanent.

### 6.2 The z-index token scale isn't used where its own docs say it is

UI-LAYER.md documents `--bt-z-panel: 1000` as "suggest panel, token suggestions". The code: `bt-suggest-panel` has `z-index: 999`, `token-suggestions` has `z-index: 200` — bare numbers, both competing in page-level stacking (they float over content). Docs and code each claim a different reality. Fix: both use `var(--bt-z-panel)`.

### 6.3 One-rule-one-place violations

Nav link colour in two files (§3.4). `body[data-surface="backoffice"] { overflow: hidden }` lives in `_reset.scss` — that's layout geometry, which the AGENT.md table assigns to `_surfaces.scss`/`_layouts.scss`. Small, but these tables only work if they're never wrong.

### 6.4 The build can't notice a missing partial

§1.2 happened because nothing compares `assets/scss/**/_*.scss` against the `@use` list in `booktower.scss`. A ten-line node script in `npm run build` (glob the partials, parse the `@use`s, fail on difference) makes this class of bug impossible. Cheap insurance; recommended regardless of §6.1.

### 6.5 The verified class list is hand-maintained and already wrong

AGENT.md's class list is the project's ground truth, but it currently asserts classes that aren't in the compiled CSS (`bt-blank-slate*`) while 63 undefined classes sit in templates. Hand-maintained lists drift; this one already has. Generate the checkable part: a script that extracts class selectors from `assets/booktower.css`, extracts class usage from HTML, and reports both directions (the exact scan §5 came from). Run it in CI or `npm run check`. AGENT.md keeps the prose and usage notes; the raw existence claims come from the build.

---

## Verification notes

Every "variable doesn't exist" and "same as Bootstrap default" claim above was grep-verified against `bootstrap@5.3.3/dist/css/bootstrap.css` — the exact version pinned in `server.js`. The class-usage scan is static: classes composed at runtime in JS would be missed (only `htmx-*` state classes and Bootstrap's own JS-injected classes fall in that category here; they were excluded from the dead list). The `.form-select` caret bug (§1.1) was verified in the compiled `booktower.css` cascade, not just the source. Findings in §4 involving design intent (navbar, blank-slate) are judgment calls and marked as such; everything in §1–§2 is mechanical.

---

## Next audit — scope for a follow-up pass

Items deliberately out of this audit's scope, queued for the next one:

1. **Token usage** — find every place a raw value was written where an existing variable should have been used (`--bt-*`, `--s-*`): colours, spacing, radii, durations. Rule agreed 2026-07-03: raw colour values only in `_colors.scss`, `_tokens.scss`, and SVG data URIs.
2. **Inline code demos** — remove `ds-code` blocks that duplicate what the "Show HTML" toggle generates (the AGENT.md UI-kit rule already declares these deletable; nobody has swept for them).
3. **Stale context** — scan for comments, doc claims, and TODO markers that no longer match the code (the "Active surface tokens" header listing dead tokens was one; there will be more).
4. **Class drift** — run `npm run check:classes` and drive both directions to zero: undefined classes in HTML, unused classes in CSS.
5. **Kit completeness** — for each file in `foundations/`, `elements/`, `patterns/`: compare what the kit page documents against what actually exists in the compiled CSS and what templates actually use. Components, variants, and states present in CSS or templates but missing from their kit page are documentation gaps.
6. **JavaScript audit** — check `assets/js/` and inline scripts against the written rules (AGENT.md JS section, `docs/JAVASCRIPT.md`): no inline `<script>` outside kit demos, every file documented, no style mutation. Known violation to start from: the copy button.

## Open design notes (M, 2026-07-03)

- Should `text-muted` mix in a little blue, so muted text sits in the same temperature as the blue-900 body text?
- Filter tags appear too blue. Should a filter tag just be a clickable badge instead of its own component?
- `search-my-research.html` is broken — likely the removed `bt-facet-*` classes it still uses (batch 3 worklist); verify while fixing ghosts there.
- Revisit `btn-warning` hover: now orange-500 with white text (family convention, M 2026-07-03) — fails AA on the transient hover state. Options when revisiting: darker step, dark text, or accept.
- `patterns/htmx-patterns.html` removed (M, 2026-07-03) — the page was outdated end to end. Rebuild it as part of the JavaScript audit (next-audit item 6): the HTMX loading/error/confirm patterns it documented should come back verified against the real JS rules, not restored from the old page.
- `bt-btn-toolbar`: M uses it as a pattern — the §4.1 deletion recommendation is on hold, to be discussed later.
- `bt-btn-toolbar` removed after all (M, same day): 42 usages converted 1:1 to `d-flex align-items-center gap-2` (gap-3 for --wide-spacing). Preferred end state is one `bt-toolbar__item` per action (see the reference conversion in search-my-research.html) — remaining conversions can happen opportunistically.
