# DD-007 — One project code per project

Status: Accepted
Date: 2026-09-30
Scope: Public

## Decision

A project card or project page shows one identifier, labelled *Project code*, for
example `01DI3915`. A project Research Explorer lists also shows the outbound link
"View on Research Explorer", `https://research.ugent.be/web/result/project/<uuid>/details`,
built from GISMO's internal UUID. A project Research Explorer does not list shows no
link.

## Because

GISMO gives each project a UUID and a project code. GISMO, funders and researchers use
the code. The IWETO number and the project code are the same number, so an "IWETO ID"
row repeats the code. Research Explorer labels the same number "Code". The Research
Explorer team asked for the link, and a link that opens a not-found page is worse than
no link.

## Trade-off

A project Research Explorer adds later may show its link with a delay.

## References

- `templates/biblio-public/public-projects.html`, `templates/biblio-public/public-project-detail.html`
- Raven `docs/metadata-project-fields.md`
- Raven issues [#359](https://github.com/ugent-library/raven/issues/359) and [#357](https://github.com/ugent-library/raven/issues/357)
