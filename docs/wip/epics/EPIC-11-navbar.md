# [both][11] Navbar

## Why

The 2026-07-28 auth-state change (logged out: "Manage research output" next to Log in;
one collapse point at xxl, brand swaps to "Biblio", actions move to the offcanvas) was
never reviewed across breakpoints. Booktower first, then raven. No raven issue while
the Booktower shell is unfixed.

## What

- [ ] Review the in-between widths; fix the shell in Booktower
- [ ] `#bt-nav-body` group buttons fail contrast at 4.13:1 on every page — fix before pa11y widens (epic 12)
- [ ] Then the raven issue: "Manage research output" button (draft exists), language switch in the logged-in navbar, responsiveness. Open in the draft: logged-in landing (dashboard vs My research output), NL copy

**Prototype:** [public](http://localhost:3111/templates/biblio-public/public-index.html),
[backoffice](http://localhost:3111/templates/biblio-team/curate.html)
