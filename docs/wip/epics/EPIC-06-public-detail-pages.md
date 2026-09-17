# [public][06] Detail pages

## Why

Sue Kerr (public discovery visitor) arrives deep-linked on a record page. The
researcher, project and organisation pages were built, never given a mobile pass. The
projects overview prints an unlabelled mix and calls the award number "Project ID".

## What

- [ ] Researcher detail: five drafted raven issues (research topics, co-authors tab, export, affiliation filter, Active/Alumnus badges) — ready to hand over
- [ ] Projects overview and detail: label Acronym, Project ID, Funder, Programme as the picker does; stop printing one value as both Project ID and IWETO ID
- [ ] [#28](https://github.com/ugent-library/bkt-ui-library/issues/28) Design alternative title on detail pages — stored values render verbatim, no colon-join into the H1
- [ ] Mobile pass: "Link to this record" spacing; toolbars and tabs get the works-search treatment
- [ ] Related works on the record page — raven `related_works`; strongly asked, not parity, after the parity gaps. Public display first
- `question` Persistent grant IDs (FWO number, IWETO)? Is `/person/<id>` a persistent identifier? Both with POSI
- `after pilot` Heritage

**Prototype:** [researcher](http://localhost:3111/templates/biblio-public/public-researcher-detail.html),
[project](http://localhost:3111/templates/biblio-public/public-project-detail.html),
[work, alt titles](http://localhost:3111/templates/biblio-public/public-work-detail.html?state=alt-titles)
