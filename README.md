# Booktower UI Library

Design system and prototype environment for **biblio.ugent.be** and family — Ghent University's research output repository.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3111](http://localhost:3111). Done.

`npm run dev` builds icons and CSS once, starts the server, and watches for CSS changes. Editing any `.scss` file recompiles and the browser reloads automatically.

---

## All commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Build everything, start server, watch CSS |
| `npm start` | Start server only (assumes already built) |
| `npm run build` | Full one-time build: icons + CSS (fails if an SCSS partial isn't imported) |
| `npm run build:icons` | Rebuild icon font from SVG sources only |
| `npm run build:css` | Recompile SCSS to CSS only |
| `npm test` | Run all static checks (see below) |

You only need `build:icons` when you've added or changed an SVG in `assets/icon-font-source/`. Otherwise `npm run dev` is all you ever run.

---

## Tests

```bash
npm test
```

Runs four static checks; run it after any template or SCSS editing session:

| Check | Catches |
|-------|---------|
| `check:partials` | SCSS partials that exist but aren't `@use`d in `booktower.scss` (component would silently vanish from the compiled CSS) |
| `check:classes` | Classes used in HTML that no stylesheet defines, and booktower classes used nowhere — both directions must be zero |
| `check:html` | Invalid HTML and generic accessibility errors, via html-validate (config in `.htmlvalidate.json`, with documented exceptions) |
| `check:a11y` | The house rules from AGENT.md: one `<h1>` per template, `main#main-content`, distinct `aria-label` on every `<nav>`, accessible names on icon-only buttons |

Each check also runs on its own: `npm run check:classes`, etc.

For a browser-grade WCAG scan (contrast, ARIA validity — things static checks can't see):

```bash
npm i -D pa11y-ci        # once, on your machine
npm run dev              # terminal 1
npm run check:a11y-browser   # terminal 2 — page list lives in .pa11yci
```

---

## Dependencies

`node_modules/` is not committed — `package-lock.json` is the source of truth; `npm install` reproduces it. Install dev tools with `npm install -D <pkg>`: undeclared packages are deleted by the next install.

---

## Deployment

The kit is deployed on Vercel at **[bkt-ui.vercel.app](https://bkt-ui.vercel.app)**
so the team can share links to kit pages and prototype templates. It runs the
same `server.js` as `npm run dev` — pages are still auto-discovered, the shell
is still injected, `?state=` and `?view=html` and the HTMX mock endpoints all
behave the same. Only live reload is absent, because there is nothing to reload.

### How it works

`server.js` exports its request handler; the listening socket, live reload and
the file watcher run only when `VERCEL` is unset. `api/index.js` imports that
handler, Vercel runs it as a function, and `vercel.json` sends every request
to it.

| File | Role |
|------|------|
| `api/index.js` | Function entry — imports the handler, restores the requested path |
| `vercel.json` | Build command, output directory, file bundling, catch-all rewrite |
| `public/` | Vercel's output directory, deliberately empty ([why](public/README.md)) |

The Node version is pinned to 22.x in `package.json`, matching CI. Vercel would
otherwise default to 24.x.

Three details worth knowing before you change any of them:

- **`includeFiles` lists the served directories.** Vercel bundles `server.js`
  and whatever it sees being `require`d, but it cannot see pages read at runtime
  with `fs.readFileSync`. Every directory in the `SECTIONS` array in `server.js`
  is listed in `vercel.json`. Add a section without adding it there and the
  pages work locally but 404 on the deployment.
- **`public/` must stay empty.** Static files win over the rewrite, so anything
  in there would be served raw, without the shell.
- **The rewrite carries the requested path in `__path`.** A rewritten request
  can reach the function as `/api/index`, and the kit routes on `req.url`, so
  `api/index.js` puts the path back before handing over. Belt and braces: if a
  deployment shows `req.url` arriving intact, both halves can go.

### Triggering a deploy

Push to `main` — the production deployment rebuilds. Every pull request gets its
own preview URL, which is the better thing to share while work is in progress.
Nothing else changes: GitHub Actions keeps running `npm test` on its own, and
Vercel builds separately with `npm run build`.

### Keeping it off the public web

The prototype is not public yet. Access is controlled in the Vercel dashboard,
not in this repository — there is no auth code here and there should not be.

1. Open the project in the Vercel dashboard → **Settings** → **Deployment Protection**
2. Under **Vercel Authentication**, toggle it on
3. Set the environment to **All Deployments**, so production is covered and not
   just previews
4. **Save**

Everyone in the Ghent University Library team can then open the site once logged
into Vercel. Viewer seats are free, so teammates who only need to look do not
cost anything — add them under **Settings** → **Members** with the Viewer role.
For someone outside the team, use **Share** on a deployment to generate a
shareable link instead of turning protection off.

---

## Documentation

- [Server API](docs/SERVER.md) — Development server documentation
- [Domain](docs/DOMAIN-VOCABULARY.md) — Research repository domain knowledge
- [UI Layer](docs/UI-LAYER.md) — UI architecture and patterns
- [Consuming Booktower](docs/CONSUMING-BOOKTOWER.md) — Integration contract for using this library in another app
- [JavaScript architecture](docs/JAVASCRIPT.md) — JS file registry and event contract
- [Integration](base/integration.html) — Using the design system in apps
- [Bootstrap gap audit](docs/AUDIT-BOOTSTRAP-GAPS.md) — 2026-07 audit findings, open design notes, next-audit scope
- [Coding conventions & AI guidelines](AGENT.md) — **Read before your first change.** HTML/CSS/JS rules, naming ([`bt-`/`u-` prefixes](AGENT.md#naming-conventions)), [Bootstrap-first](AGENT.md#bootstrap-first-check-before-creating-any-new-class), [CSS architecture](AGENT.md#css-architecture--where-styles-live), and the [accessibility checklist](AGENT.md#accessibility-rules). Written AI-first, but the rules apply to everyone.

## Browser Support

The design system supports modern browsers that Bootstrap 5 supports:

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

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
| `templates/partials/` | Reusable HTML templates for common layouts |
| `shell/` | UI kit navigation chrome (not part of the design system) |

---

## Reusable templates

For common page layouts, copy from `templates/partials/` and customize. These use only existing CSS classes from the design system:

- `backoffice-overview.html` — Backoffice list view with sidebar, toolbar, filters, facets, and table results (uses `u-layout--app`, `u-main__sidebar`, etc.)
- `templates/biblio-public/public-works.html` — Public search page with hero, filters, facets, and card results

These include placeholder content and comments showing where to customize. The full HTML output remains copy-paste friendly for developers.

---

## Adding a page to the UI kit

Drop an `.html` file into the right folder — the sidebar picks it up automatically.

```
foundations/   ← tokens, colours, typography, icons
elements/      ← individual UI elements
patterns/      ← multi-element components
templates/     ← full-page prototypes
```

Minimal page template:

```html
<!-- @title: My Component -->

<div class="ds-page">
  <header class="ds-page-header col-6" data-surface="public">
    <p class="ds-eyebrow">Patterns</p>
    <h1 class="display-1">My Component</h1>
    <p class="lead">Short description.</p>
  </header>

  <section class="ds-section">
    <h2 class="h4 mb-3">Section heading</h2>
    <div class="ds-demo">
      <div class="ds-demo-label">Default</div>
      <div class="ds-demo-body">
        <!-- your HTML here -->
      </div>
    </div>
  </section>
</div>
```

The server injects Bootstrap, `booktower.css`, and the shell nav automatically.

Pages without a surface declaration default to `backoffice`. To set a page to public:

```html
<!-- @surface: public -->
```

---

## Adding an icon

1. Drop an SVG into `assets/icon-font-source/`
2. Run `npm run build:icons`

The font and CSS update automatically. SVGs must use filled paths only — no strokes, single colour, square viewBox.

See [/foundations/icons.html](http://localhost:3111/foundations/icons.html) for all icons. Click any icon to copy its class name.

---

## Using the design system in another app

See [`docs/CONSUMING-BOOKTOWER.md`](docs/CONSUMING-BOOKTOWER.md) for the full integration contract: which files to copy, where to place fonts, Bootstrap as a peer dependency, and the surface attribute.

### No `dist` build step

Booktower has no `npm run dist` or `make export` command that bundles the consumer artifacts. The update path is manual:

```bash
cp assets/booktower.css                  <consumer>/path/to/css/
cp assets/fonts/icon-font.woff{,2}       <consumer>/path/to/css/fonts/
```

This is deliberate. Updates happen on a low cadence, by a small group, and a missing font file fails loudly — broken icons render as empty squares within seconds of loading the page. A build step would add machinery for a problem that doesn't exist yet. Revisit when the update cadence increases, more people start doing updates, or a real second consumer deployment exists.

---

## Troubleshooting

**Icons not showing** — run `npm run build:icons` then `npm run build:css`. Check `assets/fonts/icon-font.woff2` exists.

**Icons showing the wrong glyph** — the codepoints in `assets/scss/icons/_icon-font.scss` are out of sync with the font files. Run `npm run build:icons` to regenerate both from the SVG sources, then `npm run build:css`. Never edit `_icon-font.scss` by hand — it is generated output.

**CSS not updating** — make sure you're running `npm run dev`, not just `npm start`.

**Port 3111 in use** — change `PORT` at the top of `server.js`.
