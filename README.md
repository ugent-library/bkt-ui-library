# Booktower UI Library

Design system and prototype environment for **biblio.ugent.be** and family — Ghent University's research output repository.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3111](http://localhost:3111). Done.

`npm run dev` builds icons and CSS once, starts the server, and watches for CSS changes. Edit any `.scss` file: the CSS recompiles and the browser reloads.

---

## All commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Build everything, start server, watch CSS |
| `npm start` | Start server only (assumes already built) |
| `npm run build` | Full one-time build: icons + CSS (fails if an SCSS partial isn't imported) |
| `npm run build:icons` | Rebuild icon font from SVG sources only |
| `npm run build:css` | Recompile SCSS to CSS and autoprefix it per [`.browserslistrc`](.browserslistrc) |
| `npm test` | Run all static checks (see below) |

You only need `build:icons` when you've added or changed an SVG in `assets/icon-font-source/`. Otherwise `npm run dev` is all you ever run.

---

## Tests

```bash
npm test
```

Run after any template or SCSS editing session. (`docs/CI.md` points here.)

| Check | Catches |
|-------|---------|
| `check:partials` | SCSS partials that exist but aren't `@use`d in `booktower.scss` (component would silently vanish from the compiled CSS) |
| `check:classes` | Classes used in HTML that no stylesheet defines, and booktower classes used nowhere — both directions must be zero |
| `check:html` | Invalid HTML and generic accessibility errors, via html-validate (config in `.htmlvalidate.json`, with documented exceptions) |
| `check:a11y` | The house rules from [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md); source: `scripts/check-a11y.js` |
| `check:stamp` | Committed compiled CSS that came from `watch:css` instead of `npm run build` (watch output carries no stamp and no vendor prefixes) |

A class kept without a demo goes in the `intentional` list in `scripts/check-classes.js`, with a reason. Each check also runs alone: `npm run check:classes`, etc.

For a browser-grade WCAG scan (contrast, ARIA validity — things static checks can't see):

```bash
npm i -D pa11y-ci        # once, on your machine
npm run dev              # terminal 1
npm run check:a11y-browser   # terminal 2 — page list lives in .pa11yci
```

---

## Dependencies

`package-lock.json` is the source of truth: `npm install` reproduces `node_modules/`, which stays uncommitted. Install dev tools with `npm install -D <pkg>` — the next install deletes undeclared packages.

---

## Project structure

| Path | What it contains |
|------|-----------------|
| `assets/booktower.css` | **The design system** — load this in your app |
| `assets/fonts/` | Icon font files (woff, woff2) |
| `assets/icon-font-source/` | SVG source files for the icon font |
| `assets/scss/` | SCSS source — edit this, not the compiled CSS |
| `assets/scss/patterns/` | Pattern partials such as `booktower-components`, `booktower-navbar`, `booktower-toolbar`, `booktower-work-card` |
| `foundations/` | UI kit docs: tokens, colours, typography, icons |
| `elements/` | UI kit docs: buttons, forms |
| `patterns/` | UI kit docs: components |
| `templates/` | Full-page prototype templates |
| `templates/partials/` | Reusable HTML fragments for common layouts |
| `docs/decisions/` | Accepted design decisions and their rationale |
| `shell/` | UI kit navigation chrome (not part of the design system) |

---

## Adding a page to the UI kit

Drop an `.html` file into a kit folder (table above). The sidebar picks it up. The server injects Bootstrap, `booktower.css`, and the shell nav. Page conventions: [docs/KIT-PAGES.md](docs/KIT-PAGES.md).

---

## Adding an icon

Drop an SVG into `assets/icon-font-source/` and run `npm run build:icons`. SVG requirements and the icon list: [/foundations/icons.html](http://localhost:3111/foundations/icons.html).

---

## Reusable templates

Full-page prototypes live in `templates/`, grouped by product area. Reusable fragments — headers, sidebars, search widgets — live in `templates/partials/`. Every file uses only existing design-system classes (`npm test` enforces it). Placeholder marking is a work in progress — read a file before copying it. A starting point for a public search page: `templates/biblio-public/public-works.html`.

---

## Using the design system in another app

The integration contract: [`docs/CONSUMING-BOOKTOWER.md`](docs/CONSUMING-BOOKTOWER.md).

### No `dist` build step

Booktower has no export command that bundles the consumer artifacts. Updating a consumer means copying the compiled files by hand, per the contract above. Every build stamps `booktower.css` and `shell.css` with their source commit (`/*! Booktower <commit>/<date> */`), so a consumer's copy always names the state it came from.

This is deliberate. Updates happen on a low cadence, by a small group, and a missing font file fails loudly — broken icons render as empty squares within seconds. A build step would add machinery for a problem that doesn't exist yet. Revisit when the cadence increases, more people do updates, or a real second consumer deployment exists.

---

## Deployment

The kit deploys on Vercel at **[bkt-ui.vercel.app](https://bkt-ui.vercel.app)**, so the team can share links to kit pages and prototypes. Everything else: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Documentation

- [Working guide](AGENTS.md) — **read before your first change**; for humans and AI agents, any tool.
- [Contributing](CONTRIBUTING.md) — how work flows, what gates a change, who decides what.
- [Design decisions](docs/decisions/README.md) — why lasting design choices were made and when to revisit them
- [Server](docs/SERVER.md) — kit server behaviour: template states, mock endpoints
- [Domain](docs/DOMAIN-VOCABULARY.md) — the research repository domain vocabulary
- [UI Layer](docs/UI-LAYER.md) — UI architecture and patterns
- [Consuming Booktower](docs/CONSUMING-BOOKTOWER.md) — Integration contract for using this library in another app
- [JavaScript architecture](docs/JAVASCRIPT.md) — JS file registry and event contract
- [CI](docs/CI.md) — what CI runs, what it costs, the human's share
- [Deployment](docs/DEPLOYMENT.md) — Vercel setup, the traps, access control

---

## Browser support

Browser support follows Bootstrap: [`.browserslistrc`](.browserslistrc) is a verbatim copy of the pinned version's list. Every build enforces it: autoprefixer adds the vendor prefixes those browsers need to the compiled CSS. Autoprefixer's browser data (`caniuse-lite`) ages, and the build warns when it has. Run `npx update-browserslist-db`, then rebuild. The refresh may change the compiled CSS.

---

## Troubleshooting

**Icons not showing** — run `npm run build:icons` then `npm run build:css`. Check `assets/fonts/icon-font.woff2` exists.

**Icons showing the wrong glyph** — the codepoints in `assets/scss/icons/_icon-font.scss` are out of sync with the font files. Run `npm run build:icons` to regenerate both from the SVG sources, then `npm run build:css`. Never edit `_icon-font.scss` by hand — it is generated output.

**CSS not updating** — make sure you're running `npm run dev`, not just `npm start`.

**Port 3111 in use** — change `PORT` at the top of `server.js`.
