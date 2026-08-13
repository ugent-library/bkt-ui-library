# Deployment

The kit is deployed on Vercel at **[bkt-ui.vercel.app](https://bkt-ui.vercel.app)**
so the team can share links to kit pages and prototype templates. It runs the
same `server.js` as `npm run dev` — pages are still auto-discovered, the shell
is still injected, `?state=` and `?view=html` and the HTMX mock endpoints all
behave the same. Only live reload is absent, because there is nothing to reload.

## How it works

`server.js` exports its request handler; the listening socket, live reload and
the file watcher run only when `VERCEL` is unset. `api/index.js` imports that
handler, Vercel runs it as a function, and `vercel.json` sends every request
to it.

| File | Role |
|------|------|
| `api/index.js` | Function entry — imports the handler, restores the requested path |
| `vercel.json` | Build command, output directory, file bundling, catch-all rewrite |
| `public/` | Vercel's output directory, deliberately empty ([why](../public/README.md)) |

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

## Triggering a deploy

Push to `main` — the production deployment rebuilds. Every pull request gets its
own preview URL, which is the better thing to share while work is in progress.
Nothing else changes: GitHub Actions keeps running `npm test` on its own, and
Vercel builds separately with `npm run build`.

## Keeping it out of search results

Anyone with the link can open `bkt-ui.vercel.app` and every preview — share a URL
and it opens, no account needed. `vercel.json` sends `X-Robots-Tag: noindex,
nofollow` on every response, so a prototype that looks like Biblio stays out of
search results. Remove that header the day this is meant to be found.

## Access control

Access is controlled in the Vercel dashboard, not in this repository — there is no
auth code here and there should not be. To put the deployments behind a login,
turn on **Vercel Authentication** at Standard Protection (Settings → Deployment
Protection): the free tier, covering `bkt-ui.vercel.app` and every preview, since
there is no production custom domain. Anyone in the Ghent University Library team
opens them once logged in, and Viewer seats are free. **Share** on a deployment
then generates a link for someone outside the team.

The **All Deployments** option in that same dropdown needs the Advanced
Deployment Protection add-on at $150 per month. It only adds coverage for
production custom domains. Don't.
