// Vercel function entry. See README.md.
const handler = require('../server.js');

// The catch-all rewrite in vercel.json passes the requested path as __path,
// because a rewritten request can reach the function as /api/index and the kit
// routes on req.url. Drop this once a deployment shows req.url arrives intact.
module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const requested = url.searchParams.get('__path');

  if (requested !== null) {
    url.searchParams.delete('__path');
    req.url = `/${requested}${url.search}`;
  }

  return handler(req, res);
};
