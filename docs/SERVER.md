# Development Server API

The `server.js` file provides a development server for the Booktower UI Library. It's a pure Node.js server with no external dependencies.

## File layout

| File | Responsibility |
|------|----------------|
| `server.js` | Engine: config, nav scan, template/state rendering, shell injection, HTTP + live-reload WS, file watcher |
| `server/htmx-routes.js` | The HTMX endpoint → fragment map (`handleTemplateHtmx`). Add or change a prototype endpoint here |
| `server/content/` | The injected mock content — one file per block (research output, researchers, projects, deposit fragments). Edit a block file to change what an endpoint returns |
| `server/content/index.js` | Barrel that re-exports every block; `htmx-routes.js` reaches them via `require('./content')` |

`server.js` injects `loadFragment` into `handleTemplateHtmx` so the route module stays free of the template engine. To add a content block: drop a file in `server/content/` that exports its `render*` function and add one line to `index.js`.

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
- The `@states` declaration must sit in the leading meta-comment block (with `@title`, `@surface`).
- A block cannot span another `@state` block; the closing marker is `<!-- @state -->`.
- The sidebar automatically shows a state button per declared state under the active template.
- Existing examples: `biblio-researcher/dashboard.html`, `biblio-public/public-work-detail.html`.

## Configuration

- **Port**: 3111 (HTTP), 3001 (WebSocket) — both overridable via `PORT` / `WS_PORT` env vars (see [Choosing a different port](#choosing-a-different-port)).
- **Root Directory**: Project root
- **Default CSS**: Bootstrap 5.3.3 + `/assets/booktower.css`
- **Default Scripts**: HTMX 1.9.12, Bootstrap JS bundle

## Navigation Structure

The server automatically generates navigation from the folder structure:

- `foundations/`, `elements/`, `patterns/` → UI kit documentation
- `templates/` → Prototypes, grouped by subdirectory (e.g., `biblio-public/`, `biblio-researcher/`, `biblio-team/`)
- Other folders as needed

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