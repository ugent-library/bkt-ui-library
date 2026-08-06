# Vercel output directory

This note is the only file that belongs here. Anything else is served as a
static file and shadows the catch-all rewrite in `vercel.json`, bypassing the
server. Without this directory Vercel serves the repository root statically and
pages render without the shell.
