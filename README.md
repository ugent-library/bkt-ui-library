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
| `npm run build` | Full one-time build: icons + CSS |
| `npm run build:icons` | Rebuild icon font from SVG sources only |
| `npm run build:css` | Recompile SCSS to CSS only |

You only need `build:icons` when you've added or changed an SVG in `assets/icon-font-source/`. Otherwise `npm run dev` is all you ever run.

---

## Documentation

- [Server API](docs/SERVER.md) — Development server documentation
- [Domain](docs/DOMAIN.md) — Research repository domain knowledge
- [UI Layer](docs/UI-LAYER.md) — UI architecture and patterns
- [Consuming Booktower](docs/CONSUMING-BOOKTOWER.md) — Integration contract for using this library in another app
- [JavaScript architecture](docs/JAVASCRIPT.md) — JS file registry and event contract
- [Integration](base/integration.html) — Using the design system in apps
- [AI-assistent guidelines](AGENT.md) — Working guidelines for AI-assisted development on this project

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
- `public-works.html` — Public search page with hero, filters, facets, and card results

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
