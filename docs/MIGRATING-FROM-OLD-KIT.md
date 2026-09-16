# Migrating from the old UI kit

Old class → v2 class, component by component. Use this when porting a page from the
old backoffice: look up the old class, read the v2 replacement, then check the class in
[`CLASSES.md`](CLASSES.md) and its composition rules in [`CLASS-USAGE.md`](CLASS-USAGE.md).

The map covers the custom classes in `analysis/old-ui-kit-css/main.css`. Classes new to
v2 live in `CLASSES.md`. A modifier or element migrates with its root, so only roots
are listed: `bc-avatar-and-text` follows `bc-avatar`, `c-thumbnail-small` follows
`c-thumbnail`. `npm run check:migration` fails when an old root has no entry here.

## Status key

| Symbol | Meaning |
|--------|---------|
| ✅ Carried over | Same class name, same job, rewritten on new token stack |
| 🔄 Renamed | Same concept, new name — old name retired |
| 🔧 Revised | Same name, meaningfully changed behaviour or scope |
| ⏳ Planned | Exists in OLD, not yet written in v2 — do not use |
| ❌ Retired | Removed intentionally — see note |
| 🆕 New | Did not exist in OLD system |

---

## Foundation tokens

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| Sass variables (`$blue`, `$gray-100`, etc.) | CSS custom properties (`--bt-blue-600`, `--bt-gray-100`, etc.) | 🔄 Renamed | Moved from Sass compile-time to runtime CSS variables. Theming and surface switching now possible without recompile. |
| `$border-color` | `--bt-border-color` | 🔄 Renamed | |
| `$text`, `$text-muted` | `--bt-text`, `--bt-text-muted` | 🔄 Renamed | |
| `$header` (heading colour) | `--bt-gray-1000` | 🔄 Renamed | No longer a separate semantic token — headings use body text colour. |
| `$primary` | `--bt-blue-900` | 🔄 Renamed | Dark navy, not UGent blue. UGent blue is `--bt-blue-600`. |
| `font-size: 62.5%` on `html` (base 10 rem) | `font-size: 16px` on `html` (standard rem) | ❌ Retired | The base-10 trick is gone. All values in v2 use standard rem (16px base). OLD pixel values ÷ 10 × 0.625 to convert: e.g. `1.8rem` OLD = `1.125rem` v2. |
| `$box-shadow`, `$box-shadow-lg` | `--bt-shadow`, `--bt-shadow-md`, etc. | 🔄 Renamed | Full scale: `xs`, `sm`, (base), `md`, `modal`. |

---

## Typography

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `font-family: 'Source Sans Pro'` | `font-family: var(--bt-font-sans)` → system-UI stack | 🔄 Renamed | Font family changed. No web fonts loaded for sans-serif — uses OS native stack. |
| — | `var(--bt-font-mono)` → OS monospace stack | 🆕 New | Used for identifiers (DOI, Biblio ID, ISBN). No web font loaded — uses `SFMono-Regular`, `Consolas`, `Liberation Mono`, `Menlo`. |
| `h1`–`h4` coloured via `$header` | `h1`–`h6` coloured via `--s-heading-color` | 🔧 Revised | Heading colour is now `--bt-blue-800` (#132e53) on both surfaces via CSS variable. |
| `display-1` through `display-6` | Same | ✅ Carried over | Bootstrap display classes, now wired to surface tokens (`--s-heading-color`, `--s-display-weight`). |
| `c-body` (14px) | — | ❌ Retired | Body text is the surface default. Use Bootstrap `.small` where a step down is wanted. |
| `c-body-small` (12px) | `bt-text-xsmall` | 🔄 Renamed | Sets `--bt-text-xs`. Defined in `base/_typography.scss`. |
| `c-intro` (16px) | `.lead` | 🔄 Renamed | Surface-aware: italic on the public surface, upright in backoffice. |
| `c-label` | — | ❌ Retired | No single successor. A form control's label is `form-label`; a section label is `h6`, which v2 styles as a label element; a facet group label is `bt-sidebar__group-label`. |
| `c-subline` | Bootstrap `small text-muted` | 🔄 Renamed | There is no Booktower class for a muted caption. |
| `c-code` | `<code>` | 🔄 Renamed | The element is styled in `base/_typography.scss` — mono font, alt background, no class. |
| `c-link` | `<a>` | ❌ Retired | Prose links take the surface link colour with no class. |
| `c-link-muted` | Bootstrap `text-muted` on the link | 🔄 Renamed | |
| `c-link-small` | Bootstrap `.small` or `bt-text-xsmall` | 🔄 Renamed | |

---

## Layout

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `d-flex` + `u-scroll-wrapper` + `u-scroll-wrapper__body` (flex-stacked, `overflow: hidden` on `main`) | `u-layout--app` / `u-layout--public` | 🔄 Renamed | Grid shells replace the fragile flex approach. Sticky sidebars and split panes now work correctly. |
| `u-scroll-wrapper` | — | ❌ Retired | Not carried into v2. Use the layout shells and explicit scroll regions instead. |
| `u-scroll-wrapper__body` | — | ❌ Retired | Same as above. |
| `u-maximize-height` | Bootstrap `h-100` | ❌ Retired | Bootstrap utility covers this. |
| `u-inner-content` (`height: calc(100% - 3.2rem)`) | Not needed | ❌ Retired | Grid layout makes this unnecessary. |
| `c-main-content` (`height: calc(100% - 3.5rem)`) | `u-main__content` | 🔄 Renamed | The shell sizes the region; the height calculation is gone. |

---

## Navigation & topbar

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-navbar` | `bt-navbar` | ✅ Carried over | Active in `_booktower-navbar.scss`. |
| `bc-navbar--fixed` | `bt-navbar--fixed` | ⏳ Planned | Sticky variant. |
| `bc-navbar--white` | `bt-navbar--white` | ⏳ Planned | |
| `bc-navbar--large`, `--small` | ⏳ | ⏳ Planned | Size variants — review whether all are needed. |
| `nav.nav-main` | ⏳ | ⏳ Planned | Top-level navigation links inside navbar. |
| `bt-navbar__brand`, `__sep`, `__nav`, `__link` | Same | ✅ Carried over | BEM elements — all active. `__mark` does not exist; do not use. |
| `nav.nav-sidebar` | `bt-sidebar` | 🔄 Renamed | The old sidebar nav addon is replaced by the shell-level `bt-sidebar` component. |
| `nav.nav-tabs` | `nav.nav-tabs` | ✅ Carried over | Bootstrap nav-tabs with booktower overrides. Defined in `_bootstrap-components.scss` (currently commented). |
| `nav.nav-pills` | Bootstrap `nav-pills` | ✅ Carried over | Use Bootstrap directly. |
| `c-logo` | `bt-navbar__logo` | 🔄 Renamed | The mark in the navbar brand; sized in `_booktower-navbar.scss`. |

---

## Toolbar

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-toolbar` | `bt-toolbar` | ✅ Carried over | Active in `_booktower-toolbar.scss`. |
| `bc-toolbar-left` | `bt-toolbar__left` | 🔧 Revised | Corrected to BEM `__element` syntax. |
| `bc-toolbar-right` | `bt-toolbar__right` | 🔧 Revised | |
| `bc-toolbar-title` | `bt-toolbar__title` | 🔧 Revised | Surface-aware: light weight in public, sans 500 in backoffice. |
| `bc-toolbar-item` | `bt-toolbar__item` | ✅ Carried over | Spacing unit within toolbar halves. Active in `_booktower-toolbar.scss`. |
| `bc-toolbar-sm` | ⏳ | ⏳ Planned | Compact height variant. |
| `bc-toolbar--auto` | `align-items-start` | 🔄 Renamed | Use Bootstrap utility (the interim `.bt-toolbar.h-auto` hook was removed in v2.2). |
| `bc-toolbar--top` | Bootstrap `align-items-start` | 🔄 Renamed | Use Bootstrap utility. |
| `bc-toolbar-lg-responsive` etc. | ⏳ | ⏳ Planned | Responsive stack variants — may be handled differently in v2. |
| `c-button-toolbar` family | — | ❌ Retired (v2.2) | Briefly lived on as `bt-btn-toolbar`, removed 2026-07-03. One `bt-toolbar__item` per action inside toolbars; `d-flex gap-2` elsewhere. |

---

## Sidebars

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-sidebar` (narrow icon rail, blue bg) | `bt-sidebar` | 🔄 Renamed | The app navigation rail, never a filter rail. |
| `c-sidebar--bordered` | `bt-sidebar--bordered` | 🔄 Renamed | |
| `c-sidebar--dark-gray`, `--green` | — | ❌ Retired | |
| `c-sub-sidebar` (wide text nav) | `u-main__sidebar` | 🔄 Renamed | The facet `<aside>` in a results layout. |
| `c-sub-sidebar--bordered` | `u-main__sidebar--bordered` | 🔄 Renamed | |
| `c-sub-sidebar--medium`, `--large`, `--xlarge`, `--xxlarge`, `--xxxlarge`, `--small`, `--icons` | — | ❌ Retired | Width variants are not being carried into v2. |
| `c-sub-sidebar-responsive-wrapper` | — | ❌ Retired | Responsive behavior is handled by the layout shell, not a wrapper class. |

---

## Stepper (deposit flow)

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-stepper`, `c-stepper__*` | — | ❌ Retired | The stepper is intentionally not part of this UI library. Deposit flows now use the shared app shell and page-local structure only. |

---

## Facets

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-facets`, `c-facet-title`, `c-facet-check`, `c-facet-name`, `c-facet-count`, `c-facet-separator`, `c-facets-col`, `c-results-col`, `c-content-area` | — | ❌ Retired | The old facet grid and results column classes are not carried into v2. Use Bootstrap `fieldset`, `legend`, `form-check`, spacing utilities, and the `u-main__*` layout contract instead. |

---

## Buttons

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.btn` | `.btn` | ✅ Carried over | Active in `_buttons.scss`. System-UI, 500 weight. |
| `.btn-primary` | `.btn-primary` | ✅ Carried over | `--bt-blue-800` background, not UGent blue. |
| `.btn-secondary` | `.btn-secondary` | ✅ Carried over | Outlined, blue-navy border. |
| `.btn-danger` | `.btn-danger` | ✅ Carried over | Outlined danger. |
| `.btn-link` | `.btn-link` | ✅ Carried over | |
| `.btn-sm`, `.btn-lg` | `.btn-sm`, `.btn-lg` | ✅ Carried over | |
| `.btn-ghost` | `.btn-ghost` | ✅ Carried over | Active in `_buttons.scss`. |
| `.btn-outline-primary` | Bootstrap `btn-outline-primary` | 🔧 Revised | Use Bootstrap directly — v2 overrides to match token colours. Currently commented. |

---

## Forms & inputs

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.form-control` | `.form-control` | ✅ Carried over | Active. Standard rem sizing (not base-10). |
| `.form-select` | `.form-select` | ✅ Carried over | Active. |
| `.form-label` | `.form-label` | ✅ Carried over | Active. |
| `.form-text` | `.form-text` | ✅ Carried over | Active. |
| `.valid-feedback`, `.invalid-feedback` | Same | ✅ Carried over | Active. |
| `.is-valid`, `.is-invalid` | Same | ✅ Carried over | Active. |
| `.form-check-input` | `.form-check-input` | ✅ Carried over | Active. `accent-color` on v2. |
| `.form-control-search` | `.form-control-search` | ✅ Carried over | Active. Pill shape with embedded search icon. |
| `c-radio-card` | `bt-btn-check` | ✅ Carried over, adapted syntax | Active. Parent element: `bt-btn-check__group`. |
| `c-file-upload` / `c-file-drop` | `bt-file-drop` | ✅ Carried over | Active. Child elements: `bt-file-drop__icon`, `__text`, `__hint`. |
| `tagify` | ⏳ | ⏳ Planned | Tag input (third-party lib integration). |
| `flatpickr` | ⏳ | ⏳ Planned | Date picker (third-party lib integration). |

---

## Badges

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.badge` | `.badge` | ✅ Carried over | Active in `elements/_badges.scss`. Fixed size via `--bs-badge-font-size: var(--bt-text-xs)` (12px) — predictable regardless of parent font-size. |
| `.badge.bg-primary` + `text-*` | `.badge.text-bg-primary` (etc.) | 🔧 Revised | Colour a badge with Bootstrap's `text-bg-*` helper, not `bg-*` + `text-*`. Token colours (incl. new `text-bg-info` and the `text-bg-*-light` soft set) are remapped in `elements/_badges.scss` with `!important` to beat Bootstrap's helper. All variants clear WCAG AA. |

---

## Alerts

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.alert`, `.alert-primary`, `.alert-success`, `.alert-warning`, `.alert-danger`, `.alert-secondary` | Same | ✅ Carried over | Active in `components/_bootstrap-components.scss`. |
| `.alert-dismissible` + `.btn-close` | Same | ✅ Carried over | Bootstrap pattern, unchanged. |

---

## Cards

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.card`, `.card-body`, `.card-title`, `.card-footer` | Same | ✅ Carried over | Bootstrap cards remain available for boxed containers. The work card is not one of them — see the row below. |
| `card--work`, `card-research`, `card-meta`, `card-actions`, `card-title`, `card-authors`, `card-publication` | `bt-work-card` and `bt-work-card__*` | 🔄 Renamed | Domain research-output card lives in `_booktower-work-card.scss`. A border-separated list item, with its own `__header`/`__body`/`__footer` — it carries no `card-*` class (v2.13). |
| `c-publication-card` and `c-publication-card__*` | `bt-work-card` and `bt-work-card__*` | 🔄 Renamed | Same job: one research output in a list. `__title`, `__authors` and `__author` keep their names; `__meta` is now `bt-work-card__meta` holding `bt-work-card__meta-item`; `__subline`, `__thumbnail` and `__content` have no successor. |

---

## Tables

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.table`, `.table-hover` | Same | ✅ Carried over | Bootstrap tables remain available and get Booktower token overrides. |
| `.table-wrap` | ⏳ | ⏳ Planned | Bordered container with overflow handling. |

---

## Modals

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.modal`, `.modal-content`, `.modal-header`, `.modal-body`, `.modal-footer`, `.modal-title` | Same | ⏳ Planned | Not yet active in v2 (commented). Surface-aware title styling. |

---

## Avatars

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-avatar` | `bt-avatar` | ✅ Carried over | Active in `_booktower-components.scss`. |
| `bc-avatar--small`, `--large` | `bt-avatar--small`, `bt-avatar--large` | ✅ Carried over | |

---

## Empty states

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-blank-slate` | `bt-blank-slate` | ✅ Carried over | Active in `_booktower-components.scss`. |
| `c-blank-slate-muted`, `-primary` | `bt-blank-slate--muted`, `--primary` | 🔧 Revised | OLD used no double-dash — inconsistent with BEM. v2 corrects this. |

---

## Miscellaneous components

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-side-panel` (fixed overlay panel) | ⏳ | ⏳ Planned | Fixed right panel for detail overlays. |
| `c-activity-list`, `c-activity-item` | ⏳ | ⏳ Planned | Activity / history feed and its rows. |
| `c-author` | ⏳ | ⏳ Planned | Author chip / inline author display. |
| `c-bullet` | ⏳ | ⏳ Planned | Inline bullet separator. |
| `c-comment` | ⏳ | ⏳ Planned | Message / comment block. |
| `c-counter` | ⏳ | ⏳ Planned | Numeric counter badge. |
| `c-divider` | ⏳ | ⏳ Planned | Labelled horizontal rule. |
| `c-dl` | ⏳ | ⏳ Planned | Grid-based definition list. |
| `c-meta-list`, `c-meta-item` | `bt-meta-list`, `bt-meta-list__item` | 🔄 Renamed | Active. `bt-meta-list--xs` is the compact variant; the old spacing variants (`-horizontal`, `-inline`, `-vertical`, `-narrow-spacing`) are retired. |
| `c-or` | ⏳ | ⏳ Planned | "— or —" divider between form options. |
| `c-progress-bar` | ⏳ | ⏳ Planned | Custom progress bar. |
| `spinner-card-backdrop` | ⏳ | ⏳ Planned | Loading overlay on a card. |
| `c-thumbnail` | ⏳ | ⏳ Planned | File/image thumbnail. |
| `c-content` | ⏳ | ⏳ Planned | Prose content container (long-form text). |
| `c-abbr` | ⏳ | ⏳ Planned | Styled abbreviation with tooltip. |
| `bc-panel-header`, `bc-panel-footer` | `u-main__content-header`, `u-main__content-footer` | 🔄 Renamed | The shell regions host a `bt-toolbar` directly, so the padding reset the old classes carried is gone. `bt-panel` is a different thing — the dropdown editor panel. |
| `bc-toast` and `bc-toast__*` | `u-notifications` holding Bootstrap `.alert` | 🔄 Renamed | `u-notifications` is the fixed overlay stack and owns the z-tier; it brings no message styling. There is no v2 toast class. |
| `c-numbered-textarea-container`, `c-numbered-textarea-line-numbers` | ⏳ | ⏳ Planned | Line-numbered textarea. v2 has no equivalent. |

---

## Utilities

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `u-scroll-wrapper` | — | ❌ Retired | |
| `u-scroll-wrapper__body` | — | ❌ Retired | |
| `u-maximize-height` | Bootstrap `h-100` | ❌ Retired | |
| `u-inner-content` | — | ❌ Retired | Grid layout makes this unnecessary. |
| `u-hidden` | Bootstrap `d-none` | ❌ Retired | |
| `u-horizontal-scroll` | ⏳ | ⏳ Planned | May be retained. |
| `u-max-lines` | ⏳ | ⏳ Planned | Line clamp utility — useful, worth keeping. |
| `u-no-transition` | ⏳ | ⏳ Planned | |
| `u-divide-x` | ⏳ | ⏳ Planned | |
| `u-min-w-0` | `min-w-0` | 🔄 Renamed | Active. Critical for flex/grid text truncation. |
| `u-min-w-8`, `u-min-w-auto` | Bootstrap sizing utilities | ❌ Retired | Fixed minimum widths are not carried into v2. |
| `u-border-light` | `bt-border` | 🔄 Renamed | Sets the token border on all four sides. Bootstrap `border-*` utilities take the same token colour. |
| `u-smooth-scroll` | ⏳ | ⏳ Planned | |
| `u-mix-blend-multiply` | ⏳ | ⏳ Planned | |
| Specific widths (`u-min-w-750`, `u-max-w-720`, etc.) | — | ❌ Retired | Too specific. Use layout tokens or Bootstrap grid instead. |
| `u-section` (margin-top) | Bootstrap spacing utilities | ❌ Retired | |
| `u-z-reset` | ⏳ | ⏳ Planned | Probably worth keeping. |
| Background colour utilities (`bt-bg`, `bt-bg-alt`, `bt-bg-dark`, `bt-bg-white`, `bg-faculty-*`) | — | 🆕 New | Did not exist in OLD. There is no `bt-text-*` colour set — use Bootstrap's `text-*`. |

---

## HTMX

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| — | `htmx-indicator`, `htmx-request`, `htmx-swapping`, `htmx-settling` | 🆕 New | HTMX state classes. Defined in `_booktower-components.scss` (currently commented). |

---

## Bootstrap nav add-ons (OLD `bootstrap-additions/`)

These were Bootstrap overrides in the OLD system. In v2 they either use Bootstrap directly or are handled by the component layer.

| OLD class | v2 approach | Status |
|-----------|------------|--------|
| `nav.nav-main` | Part of `bt-navbar__nav` | ✅ Carried over |
| `nav.nav-sidebar` | Folded into `bt-sidebar` | 🔄 Renamed |
| `nav.nav-tabs` | Bootstrap + override in `_bootstrap-components.scss` | ⏳ Planned |
| `nav.nav-pills` | Bootstrap directly | ✅ Carried over |
| `nav-tabs-scrollable` | ⏳ | ⏳ Planned |

---

## What is genuinely new in v2

Things that did not exist at all in the OLD system:

- **Surface system** — `data-surface="public"` / `data-surface="backoffice"` switching typography, density, and colour via CSS variables
- **Two-surface type system** — public uses system-UI at weight 300 (refined, editorial); backoffice uses system-UI at weight 600 (dense, tool-like). Both share `--bt-blue-800` as the heading colour.
- **Selective heading weights** — `h4` and `h6` carry `font-weight: 300` regardless of surface; `h6` also gets uppercase + letter-spacing, making it a label element
- **Italic `.lead` on public surface** — scoped to `[data-surface="public"]`, not applied in backoffice
- **CSS custom property token stack** — runtime theming, no Sass recompile needed
- **`u-layout--app` / `u-layout--public`** — CSS grid layout shells (replace flex stacking)
- **Institutional blue as design signature** — `--bt-blue-800` on headings, displays, buttons, and ghost button hover across both surfaces
- **Faculty colour utilities** — `bg-faculty-*` and their `-light` pairs, plus the `text-bg-*-light` badge set
- **`bt-toolbar` surface awareness** — title font changes with surface context
- **HTMX patterns** — documented and built into the system, not bolted on
- **`ds-page`, `ds-demo`, `ds-code`** — design system documentation chrome (shell only)
