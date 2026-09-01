# Development Server API

The `server.js` file provides a development server for the Booktower UI Library. It's a pure Node.js server with no external dependencies.

## File layout

| File | Responsibility |
|------|----------------|
| `server.js` | Engine: config, nav scan, template/state rendering, shell injection, HTTP + live-reload WS, file watcher |
| `api/index.js` | Vercel function entry — imports the exported handler. See [Deployment](../README.md#deployment) |
| `server/htmx-routes.js` | The HTMX endpoint → fragment map (`handleTemplateHtmx`). Add or change a prototype endpoint here |
| `server/content/` | The injected mock content — one file per block (research output, researchers, projects, deposit fragments). Edit a block file to change what an endpoint returns |
| `server/content/index.js` | Barrel that re-exports every block; `htmx-routes.js` reaches them via `require('./content')` |

`server.js` exports its request handler with `module.exports`. Listening, live
reload and the file watcher run only under `if (IS_DEV)`, which is false when
the `VERCEL` environment variable is set — that is how the same engine serves
both `npm run dev` and the Vercel deployment.

`server.js` injects `loadFragment` into `handleTemplateHtmx` so the route module stays free of the template engine. To add a content block: drop a file in `server/content/` that exports its `render*` function and add one line to `index.js`.

**Blocks that are also inlined in a template are two copies of one thing.** Public lists render statically, so the cards from `search-result-cards.js` and `related-works.js` sit in the template files as well. Edit the module and the template in the same change: `npm run check:generated` renders each module and fails the build when an inlined card no longer matches it. Add a template to that script's `SOURCES` list when it starts carrying generated cards.

## Starting the Server

```bash
npm start  # Start server only
npm run dev  # Build + start server + watch CSS
```

Server runs on `http://localhost:3111`.

### Choosing a different port

Both ports read from environment variables, falling back to the defaults when unset — so `npm start` behaves exactly as before:

```bash
PORT=3500 npm start               # HTTP on 3500, live-reload socket on 3501
PORT=3500 WS_PORT=4001 npm start  # override both explicitly
```

- `PORT` — HTTP port (default `3111`).
- `WS_PORT` — live-reload WebSocket port. Defaults to `3001`; when `PORT` is set but `WS_PORT` is not, it defaults to `PORT + 1`.

This makes it possible to run a **second instance alongside a server you already have running** (e.g. a preview/automation tool launching its own copy) without colliding on the HTTP or the WebSocket port. The repo's `.claude/launch.json` sets `"autoPort": true` for exactly this reason: tooling may pick a free port and pass it through `PORT`.

## Features

- **Static File Serving**: Serves all files from the project root.
- **Automatic Navigation**: Scans folder structure and builds navigation grouped by subdirectories.
- **Shell Injection**: Injects UI kit shell chrome into every HTML page.
- **Live Reload**: WebSocket-based live reload on file changes (port 3001).
- **HTMX Support**: `?partial=true` strips shell for HTMX partial responses.
- **HTML Source View**: `?view=html` shows page source with copy button.

## Add-to-list prototype routes

The list routes model the interaction shown in `patterns/panel.html`; Raven owns the production
endpoints.

- `GET /lists/panel?work=<id>` returns the lazy-loaded panel body. The work id becomes the prefix
  for every panel id, so several result cards can open panels without collisions.
- `GET /lists?q=<text>` replaces the checklist. The search input triggers on `input` and `search`,
  not `keyup`, so the native clear control also refreshes the list.
- `POST /lists` creates a list and returns it selected. `PUT /lists/<slug>` and
  `DELETE /lists/<slug>` update membership without replacing the checklist, so the typed query and
  open panel stay in place.

The fixture does not persist membership after a later checklist render.

## URL Parameters

- `?partial=true`: Returns HTML without shell chrome (for HTMX swaps).
- `?view=html`: Displays the page's HTML source code with syntax highlighting and a copy button.
- `?state=<name>`: Renders one named state of a template (see Template states).

## Template states

A template represents its data-dependent variants as **states in one file** — never as separate template files.

```html
<!-- @states: files, no-files -->        ← declared once at the top of the file

<!-- @state: files -->
&hellip;markup shown only in the files state&hellip;
<!-- @state -->

<!-- @state: files message -->           ← a block can belong to several states
```

- `?state=<name>` keeps matching `@state` blocks (wrapper comments stripped) and removes the rest.
- Without `?state=`, the **first declared state** renders — declare the default state first.
- The `@states` declaration must sit in the leading meta-comment block (with `@title`,
  `@surface`): the run of one-line comments at the top of the file, in any order, plain
  comments allowed. The first `@include`, `@state` marker, multi-line comment or markup
  line ends it.
- **Every meta declaration sits on one line, however long it runs.** A wrapped `@states` is read as
  no states at all, and every block renders at once.
- A block cannot span another `@state` block; the closing marker is `<!-- @state -->`. Includes
  resolve first, so a block cannot contain an `@include` of a partial that has `@state` blocks
  either. Render the include ungated and mark the block instead: `public-works.html` renders one
  Advanced search dialog, shut, and its `builder-*` states carry `<div hidden data-qb-open></div>`.
- Every declared state needs a block of its own, and every block name needs a host that declares it.
- `npm run check:states` fails the build on all five.
- The sidebar automatically shows a state button per declared state under the active template.
- Existing examples: `biblio-researcher/dashboard.html`, `biblio-public/public-work-detail.html`.
- **Checks read the raw file, not one rendered state.** `npm run check:html` sees all
  states at once, so ids must be unique across states (suffix per state:
  `files-heading-v1`, `files-heading-embargo`). When state variants of one landmark
  unavoidably share a visible name, put
  `<!-- [html-validate-disable-next unique-landmark -- @state variants of one section; only one renders per page] -->`
  directly above each variant — see `public-work-detail.html`.

## Configuration

- **Port**: 3111 (HTTP), 3001 (WebSocket) — both overridable via `PORT` / `WS_PORT` env vars (see [Choosing a different port](#choosing-a-different-port)).
- **Root Directory**: Project root
- **Default CSS**: Bootstrap 5.3.3 + `/assets/booktower.css`
- **Default Scripts**: HTMX 1.9.12, Bootstrap JS bundle

## Navigation Structure

The server automatically generates navigation from the folder structure:

- `foundations/`, `elements/`, `patterns/` → UI kit documentation
- `partials` → virtual sidebar section that groups `elements/partials/*.html` and `templates/partials/*.html`
- `templates/` → Prototypes, grouped by subdirectory (e.g., `biblio-public/`, `biblio-researcher/`, `biblio-team/`)
- Other folders as needed

### Partials that paint nothing

Some partials only feed another page: a set of `<template>` nodes to clone, or a block of JSON to
read. Opening one on its own would show an empty screen, so the server draws a blank slate there
instead. It carries three things:

- what the file is
- a link to `?view=html`
- a link to the kit page that shows the thing rendered

That last link comes from `@example`, one address in the leading meta-comment block (with
`@title`, `@surface`, `@states`). A file that declares none gets the note without the link.

```html
<!-- @example: /patterns/people-search.html#checkable-rich-rows -->
```

The note appears only where the page would otherwise be blank.

## File Serving

Supports common MIME types: HTML, CSS, JS, JSON, images (SVG, PNG, JPG), fonts (WOFF, WOFF2, TTF).

## Live Reload

- Connects via WebSocket to `ws://localhost:3001`
- Triggers on changes to served files
- Integrated with `npm run watch:css` for CSS rebuilds

## Notes

- No production use intended; for development only.
- Zero dependencies: pure Node.js `http`, `fs`, `path`, `crypto`.
- WebSocket implementation is minimal and custom.
