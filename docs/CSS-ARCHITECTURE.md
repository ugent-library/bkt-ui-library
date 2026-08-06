# CSS architecture and authoring rules

> Comment conventions for this area: `docs/CODE-COMMENTS.md`.


The full rulebook for writing CSS in this repo: what Bootstrap owns, where styles live, how classes are named, and how to override safely. `docs/CLASSES.md` (generated) says what exists; `docs/CLASS-USAGE.md` says how to compose it; this file says how to add to it. Patterns themselves are documented in the kit — not here.

---

## Scan before writing

New CSS starts with a search, not a selector. In order:

1. **The kit pages** (`foundations/`, `elements/`, `patterns/`) — does a pattern for this already exist? The kit page is the canonical example; compose with it instead of rebuilding it.
2. **`docs/CLASSES.md` + `docs/CLASS-USAGE.md`** — does the class already exist, and how is it composed?
3. **Bootstrap** — does it handle the use case? (The check below.)

Only when all three come up empty is a new class on the table.

---

## Bootstrap-first: check before creating any new class

Before writing a new CSS class, answer: does Bootstrap already have a component or pattern that handles this use case?

The check is not "does Bootstrap have a class with this exact visual output?" — it is "does Bootstrap have a pattern that handles this *use case*?" Check the full Bootstrap component list: buttons, dropdowns, button groups, list groups, cards, navs, tabs, pagination, modals, collapse, offcanvas, tooltips, popovers, progress, spinners, alerts, badges, breadcrumbs, tables, forms. Read what each component *does*, not just what it looks like.

If Bootstrap covers the use case, use it — even if you would need to override some styles with a Booktower token. Overriding is cheaper than duplicating.

A new Booktower class is only justified when:
1. Bootstrap has no equivalent concept, **or**
2. The pattern is domain-specific to Biblio and meaningfully reused across multiple templates

If you proceed with a new class, state in a comment: which Bootstrap component you checked, and the specific reason it did not fit.

---

## Overriding Bootstrap safely

Three rules, each earned by a real bug (see `docs/AUDIT-BOOTSTRAP-GAPS.md`):

**Feed variables, don't fight selectors.** Where a `--bs-*` component variable exists, set it — you inherit Bootstrap's state handling (`:hover`, `.active`, `btn-check:checked`, `:disabled`) instead of re-implementing part of it. Verify the variable exists in the dist first; several past overrides targeted variables that were never real.

**Longhands, never shorthands across grouped selectors.** A shorthand resets every sub-property you didn't mention: `background:` erased the select caret, `padding:` erased its gutter. Group selectors only when the declaration is identical in consequence for every member.

**Raw colours live in three places only:** `_colors.scss` (palette + `--bt-*-rgb` triplets), `_tokens.scss` (shadows, focus rings), and SVG data URIs. Everything else references variables.

---

## No inline styles — with one exception

Never use `style=` attributes in HTML. If a value isn't in SCSS, add it there first, then reference it via a class.

**The one exception:** genuinely dynamic values that cannot be known at build time — for example, a progress bar width (`style="width: 73%"`) driven by data. Static visual values like `font-size`, `color`, `padding`, `background` are never acceptable inline.

Before writing `style=`, ask: is this value static? If yes — check whether it's available in Bootstrap or an existing class covers it. If not, ask before writing the CSS class.

---

## Where styles live

All CSS belongs in `assets/scss/` and compiles to `assets/booktower.css`. This is not negotiable.

```
assets/scss/
  foundation/   ← tokens, colors, surfaces, bootstrap overrides
  base/         ← reset, typography, accessibility
  elements/     ← buttons, badges
  components/   ← bootstrap component overrides
  patterns/     ← booktower-specific components and layout shells
  icons/        ← icon system rules
  utilities/    ← utility classes
```

**CSS must never go in:**
- `<style>` blocks inside HTML files
- `style=` attributes on HTML elements
- JavaScript files (no style mutation via `.style.*` except unavoidable dynamic values like drag coordinates)
- Any file outside `assets/scss/`

**The one documented exception:** `shell/scss/` compiles to `shell/shell.css` for shell chrome only (`bt-shell`, `bt-nav`, `bt-content`, `ds-page`, `ds-demo`, `ds-code`). Kit-only — no template links it and `docs/CONSUMING-BOOKTOWER.md` doesn't ship it. Edit it when the kit itself is broken, and keep the repair minimal; new styling belongs in `assets/scss/`, so the file shrinks as the design system matures.

**When producing HTML:** if a style is missing from the system, flag it and add it to the correct SCSS partial. No inline patches.

**When producing JavaScript:** add or remove classes. Classes are defined in SCSS. No `.style.foo = 'bar'`.

---

## No redundancy between files

Every rule must live in exactly one place.

| What | Where |
|------|-------|
| Reset (`box-sizing`, `html`, `body`, list reset) | `base/_reset.scss` |
| Font `@import` | `_header.scss` (must precede all `@use`) |
| Colour tokens (palette + semantic aliases) | `foundation/_colors.scss` |
| Non-colour tokens (type, spacing, borders, shadows, motion) | `foundation/_tokens.scss` |
| Layout geometry (`--s-topbar-height`) | `foundation/_surfaces.scss` |
| Surface tokens (`--s-heading-font` etc.) | `foundation/_surfaces.scss` |
| SVG ink-alpha tokens (`--i02`–`--i40`) | `patterns/_svg-animations.scss` |
| Accessibility (focus ring, `.visually-hidden`, reduced motion) | `base/_accessibility.scss` |
| Layout shells (`u-layout--*`, `u-main__*`) | `patterns/_layouts.scss` |
| Bootstrap overrides | `foundation/_bootstrap-overrides.scss` |
| Shell chrome only | `shell/shell.css` |

Component code references only semantic aliases (`--bt-text`, `--bt-danger`, `--bt-bg` etc.), never raw palette steps or hex values.

---

## Naming conventions

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `bt-` | Bootstrap Custom — extends/wraps Bootstrap | `bt-navbar`, `bt-toolbar`, `bt-avatar`, `bt-btn-check__group`  |
| `bt-` | Component — a styled widget, no Bootstrap base | `bt-blank-slate`, `bt-work-card` |
| `u-` | Layout — structural regions and layout shells, not visual styling | `u-layout--app`, `u-main__panel`, `u-notifications` |

BEM separators: `__` for elements, `--` for modifiers. Single dash is never a BEM separator in this system.

`u-` is the layout prefix: a `u-` class positions or structures a region of the page (shell, grid cell, fixed overlay region) and carries no visual personality of its own — the contents bring that. `bt-` is for styled things (widgets that wrap Bootstrap, or standalone components). The split is structure vs. styling, not custom vs. Bootstrap.

Known inconsistency: the single-purpose utilities (`bt-bg`, `bt-bg-alt`, `bt-bg-dark`, `bt-bg-white`, `bt-border`) carry `bt-`, not `u-`. They predate this rule. Do not re-prefix them ad hoc — that is a separate, deliberate cleanup pass. Until then, treat the existing `bt-*` utility names as ground truth and do not invent new ones (reference the token directly in SCSS instead).

Bootstrap utilities (`d-flex`, `gap-3`, `text-muted`, `mb-4`) are used directly without wrapping.

**Do not invent new prefixes** without an explicit decision.
