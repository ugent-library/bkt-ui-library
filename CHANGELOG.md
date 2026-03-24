# Booktower UI Kit — Changelog

A record of what changed between the OLD system and v2, and the migration
status of every class. Use this to answer: "Can I use this class from the old
system, or do I reach for something new?"

---

## Breaking change — unified `bt-` prefix (v2.1)

All component classes now use a single `bt-` prefix. The old `bc-` and `c-`
prefixes are retired. Find-and-replace the following across every template,
partial, and stylesheet:

| Old class | New class |
|-----------|-----------|
| `bc-navbar` | `bt-navbar` |
| `bc-navbar__brand` | `bt-navbar__brand` |
| `bc-navbar__sep` | `bt-navbar__sep` |
| `bc-navbar__nav` | `bt-navbar__nav` |
| `bc-navbar__link` | `bt-navbar__link` |
| `bc-toolbar` | `bt-toolbar` |
| `bc-toolbar__left` | `bt-toolbar__left` |
| `bc-toolbar__right` | `bt-toolbar__right` |
| `bc-toolbar__middle` | `bt-toolbar__middle` |
| `bc-toolbar__title` | `bt-toolbar__title` |
| `bc-toolbar__item` | `bt-toolbar__item` |
| `bc-toolbar--bordered` | `bt-toolbar--bordered` |
| `bc-avatar` | `bt-avatar` |
| `bc-avatar--small` | `bt-avatar--small` |
| `bc-avatar--large` | `bt-avatar--large` |
| `c-sub-sidebar` | `bt-sidebar` |
| `c-sub-sidebar--bordered` | `bt-sidebar--bordered` |
| `c-blank-slate` | `bt-blank-slate` |
| `c-blank-slate-default` | `bt-blank-slate--default` |
| `c-blank-slate-muted` | `bt-blank-slate--muted` |
| `c-blank-slate-primary` | `bt-blank-slate--primary` |
| `c-radio-card` | `bt-radio-card` |
| `c-radio-card__group` | `bt-radio-card__group` |
| `c-radio-card__body` | `bt-radio-card__body` |
| `c-file-drop` | `bt-file-drop` |
| `c-file-drop__icon` | `bt-file-drop__icon` |
| `c-file-drop__text` | `bt-file-drop__text` |
| `c-file-drop__hint` | `bt-file-drop__hint` |
| `c-hero` | `bt-hero` |
| `c-hero__bg` | `bt-hero__bg` |
| `c-hero__content` | `bt-hero__content` |
| `c-button-toolbar` | `bt-button-toolbar` |
| `c-button-toolbar--wide-spacing` | `bt-button-toolbar--wide-spacing` |
| `c-button-toolbar--vertical` | `bt-button-toolbar--vertical` |

**Rationale:** The split between `bc-` (Bootstrap Custom) and `c-` (Component)
was never meaningful in practice and caused constant confusion. Every Booktower
component class now uses `bt-`. The `u-` prefix for utilities and layout shells
is unchanged.

---

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
| `font-family: 'Source Sans Pro'` | `font-family: var(--bt-font-sans)` → IBM Plex Sans | 🔄 Renamed | Font family changed. |
| — | `var(--bt-font-serif)` → IBM Plex Serif | 🆕 New | Public surface uses serif headings. Backoffice does not. |
| — | `var(--bt-font-mono)` → IBM Plex Mono | 🆕 New | Used for identifiers (DOI, Biblio ID, ISBN). |
| `h1`–`h4` coloured via `$header` | `h1`–`h4` inherit body colour | 🔧 Revised | Heading colour is no longer special-cased in the reset. |
| `display-1` through `display-6` | Same | ✅ Carried over | Bootstrap display classes, unchanged. |

---

## Layout

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `d-flex` + `u-scroll-wrapper` + `u-scroll-wrapper__body` (flex-stacked, `overflow: hidden` on `main`) | `u-layout--app` / `u-layout--public` | 🔄 Renamed | Grid shells replace the fragile flex approach. Sticky sidebars and split panes now work correctly. |
| `u-scroll-wrapper` | — | ❌ Retired | Not carried into v2. Use the layout shells and explicit scroll regions instead. |
| `u-scroll-wrapper__body` | — | ❌ Retired | Same as above. |
| `u-maximize-height` | Bootstrap `h-100` | ❌ Retired | Bootstrap utility covers this. |
| `u-inner-content` (`height: calc(100% - 3.2rem)`) | Not needed | ❌ Retired | Grid layout makes this unnecessary. |

---

## Navigation & topbar

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-navbar` | `bt-navbar` | ✅ Carried over | Active in `_booktower-components.scss`. |
| `bc-navbar--fixed` | `bt-navbar--fixed` | ⏳ Planned | Sticky variant. |
| `bc-navbar--white` | `bt-navbar--white` | ⏳ Planned | |
| `bc-navbar--large`, `--small` | ⏳ | ⏳ Planned | Size variants — review whether all are needed. |
| `nav.nav-main` | ⏳ | ⏳ Planned | Top-level navigation links inside navbar. |
| `bt-navbar__brand`, `__sep`, `__nav`, `__link` | Same | ✅ Carried over | BEM elements — all active. `__mark` does not exist; do not use. |
| `nav.nav-sidebar` | `bt-sidebar` | 🔄 Renamed | The old sidebar nav addon is replaced by the shell-level `bt-sidebar` component. |
| `nav.nav-tabs` | `nav.nav-tabs` | ✅ Carried over | Bootstrap nav-tabs with booktower overrides. Defined in `_bootstrap-components.scss` (currently commented). |
| `nav.nav-pills` | Bootstrap `nav-pills` | ✅ Carried over | Use Bootstrap directly. |

---

## Toolbar

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `bc-toolbar` | `bt-toolbar` | ✅ Carried over | Active in `_booktower-components.scss`. |
| `bc-toolbar-left` | `bt-toolbar__left` | 🔧 Revised | Corrected to BEM `__element` syntax. |
| `bc-toolbar-right` | `bt-toolbar__right` | 🔧 Revised | |
| `bc-toolbar-title` | `bt-toolbar__title` | 🔧 Revised | Surface-aware: serif weight in public, sans 500 in backoffice. |
| `bc-toolbar-item` | `bt-toolbar__item` | ⏳ Planned | Spacing unit within toolbar halves. Not yet written in v2. |
| `bc-toolbar-sm` | ⏳ | ⏳ Planned | Compact height variant. |
| `bc-toolbar--auto` | Bootstrap `h-auto` | 🔄 Renamed | Use Bootstrap utility. |
| `bc-toolbar--top` | Bootstrap `align-items-start` | 🔄 Renamed | Use Bootstrap utility. |
| `bc-toolbar-lg-responsive` etc. | ⏳ | ⏳ Planned | Responsive stack variants — may be handled differently in v2. |
| `c-button-toolbar` | `bt-button-toolbar` | ✅ Carried over | Active. |
| `c-button-toolbar--wide-spacing` | `bt-button-toolbar--wide-spacing` | ✅ Carried over | |
| `c-button-toolbar--vertical` | `bt-button-toolbar--vertical` | ✅ Carried over | |

---

## Sidebars

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-sidebar` (narrow icon rail, blue bg) | — | ❌ Retired | Not used in the old prototype pages we are carrying forward, and not implemented in v2. |
| `c-sidebar--bordered` | — | ❌ Retired | |
| `c-sidebar--dark-gray`, `--green` | — | ❌ Retired | |
| `c-sub-sidebar` (wide text nav) | `bt-sidebar` | 🔄 Renamed | This is the sidebar pattern retained in v2. |
| `c-sub-sidebar--bordered` | `bt-sidebar--bordered` | 🔄 Renamed | |
| `c-sub-sidebar--medium`, `--large`, `--xlarge`, `--xxlarge`, `--xxxlarge` | — | ❌ Retired | Width variants are not being carried into v2. |
| `c-sub-sidebar--small`, `--icons` | `bt-sidebar--slim` | 🔧 Revised | v2 keeps a single collapsed variant rather than multiple width/icon variants. |
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
| `.btn` | `.btn` | ✅ Carried over | Active in `_buttons.scss`. IBM Plex Sans, 500 weight. |
| `.btn-primary` | `.btn-primary` | ✅ Carried over | Dark navy (`--bt-blue-900`), not UGent blue. |
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
| `c-radio-card` | `bt-radio-card` | ✅ Carried over | Active. Child elements: `bt-radio-card__group`, `bt-radio-card__body`. |
| `c-file-upload` / `c-file-drop` | `bt-file-drop` | ✅ Carried over | Active. Child elements: `bt-file-drop__icon`, `__text`, `__hint`. |
| `tagify` | ⏳ | ⏳ Planned | Tag input (third-party lib integration). |
| `flatpickr` | ⏳ | ⏳ Planned | Date picker (third-party lib integration). |

---

## Badges

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `.badge` | `.badge` | ✅ Carried over | Active in `elements/_badges.scss`. |
| `.badge.bg-primary`, `.bg-success`, etc. | Same | 🔧 Revised | Token colours are remapped in `elements/_badges.scss`. |
| `.badge-oa` | `.badge-oa` | ✅ Carried over | Domain-specific open access badge. |
| `.badge-restricted` | `.badge-restricted` | ✅ Carried over | |

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
| `.card`, `.card-body`, `.card-title`, `.card-footer` | Same | ✅ Carried over | Bootstrap cards remain available. Domain-specific research cards use the separate `card-research` pattern. |
| `c-publication-card` | ⏳ | ⏳ Planned | Domain-specific research output card. |

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
| `c-blank-slate-default`, `-muted`, `-primary` | `bt-blank-slate--default`, `--muted`, `--primary` | 🔧 Revised | OLD used no double-dash — inconsistent with BEM. v2 corrects this. |

---

## Miscellaneous components

| OLD | v2 | Status | Notes |
|-----|----|--------|-------|
| `c-side-panel` (fixed overlay panel) | ⏳ | ⏳ Planned | Fixed right panel for detail overlays. |
| `c-activity-list` | ⏳ | ⏳ Planned | Activity / history feed. |
| `c-author` | ⏳ | ⏳ Planned | Author chip / inline author display. |
| `c-bullet` | ⏳ | ⏳ Planned | Inline bullet separator. |
| `c-comment` | ⏳ | ⏳ Planned | Message / comment block. |
| `c-counter` | ⏳ | ⏳ Planned | Numeric counter badge. |
| `c-divider` | ⏳ | ⏳ Planned | Labelled horizontal rule. |
| `c-dl` | ⏳ | ⏳ Planned | Grid-based definition list. |
| `c-meta-list` | ⏳ | ⏳ Planned | Compact metadata key-value list. |
| `c-or` | ⏳ | ⏳ Planned | "— or —" divider between form options. |
| `c-progress-bar` | ⏳ | ⏳ Planned | Custom progress bar. |
| `spinner-card-backdrop` | ⏳ | ⏳ Planned | Loading overlay on a card. |
| `c-thumbnail` | ⏳ | ⏳ Planned | File/image thumbnail. |
| `c-content` | ⏳ | ⏳ Planned | Prose content container (long-form text). |
| `c-abbr` | ⏳ | ⏳ Planned | Styled abbreviation with tooltip. |

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
| `u-min-w-0` | Bootstrap `mw-0` or custom | ⏳ Planned | Critical for flex/grid text truncation. |
| `u-smooth-scroll` | ⏳ | ⏳ Planned | |
| `u-mix-blend-multiply` | ⏳ | ⏳ Planned | |
| Specific widths (`u-min-w-750`, `u-max-w-720`, etc.) | — | ❌ Retired | Too specific. Use layout tokens or Bootstrap grid instead. |
| `u-section` (margin-top) | Bootstrap spacing utilities | ❌ Retired | |
| `u-z-reset` | ⏳ | ⏳ Planned | Probably worth keeping. |
| Background/text colour utilities (`bt-bg-*`, `bt-text-*`) | Same | 🆕 New | Did not exist in OLD. Full token-scale utilities. |

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

- **Surface system** — `data-surface="public"` / `data-surface="backoffice"` switching behaviour and density via CSS variables
- **IBM Plex type family** — Serif for editorial, Sans for interface, Mono for identifiers
- **CSS custom property token stack** — runtime theming, no Sass recompile needed
- **`u-layout--app` / `u-layout--public`** — CSS grid layout shells (replace flex stacking)
- **Full colour scale utilities** — `bt-bg-*`, `bt-text-*` for every token
- **`bt-toolbar` surface awareness** — title font changes with surface context
- **HTMX patterns** — documented and built into the system, not bolted on
- **`ds-page`, `ds-demo`, `ds-code`** — design system documentation chrome (shell only)
