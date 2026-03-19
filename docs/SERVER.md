# Development Server API

The `server.js` file provides a development server for the Booktower UI Library. It's a pure Node.js server with no external dependencies.

## Starting the Server

```bash
npm start  # Start server only
npm run dev  # Build + start server + watch CSS
```

Server runs on `http://localhost:3111`.

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

## Configuration

- **Port**: 3111 (HTTP), 3001 (WebSocket)
- **Root Directory**: Project root
- **Default CSS**: Bootstrap 5.3.3 + `/assets/booktower.css`
- **Default Scripts**: HTMX 1.9.12, Bootstrap JS bundle

## Navigation Structure

The server automatically generates navigation from the folder structure:

- `foundations/`, `elements/`, `patterns/` → UI kit documentation
- `templates/` → Prototypes, grouped by subdirectory (e.g., `biblio-backoffice/`, `biblio-public/`)
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