# Entity pickers — open design work

Person, organization and project filters identify records by id, not by the label on
screen. The filter bar and query builder clone the same picker partials. The Person
picker is canonical; the Organization and Project rows are fixtures until the questions
below are settled.

## Organization

The query matches the organization credited on the work and includes its descendants.
The picker still needs:

- a hierarchy model: flat searchable results, an expandable tree or drill-down by level;
- a parent-selection treatment: disable children, select them with the parent or leave
  them independently selectable;
- reporting scopes for FRIS and VABB. Their reporting owners decide which units each
  scope includes.

Raven owns the organization catalog and descendant semantics. Design owns how the
hierarchy and selection state are shown.

## Project

A row names the project, labels its acronym and project ID, then carries one line per
funding entry with that entry's funder and programme. *Project ID* is the project's own
identifier, the sense raven gives the term, not a grant's award number. Period and a
Research Explorer link stay on the project pages: in a 480px panel they cost more room
than they earn.

Funder is shown to recognise a project, never to filter on: raven holds it as free text
with no authority ([raven#55](https://github.com/ugent-library/raven/issues/55)).

Still open: one action term, **Add project** or **Link project**, used here and in the
deposit flow.

Raven's field set is
[`metadata-project-fields.md`](https://github.com/ugent-library/raven/blob/main/docs/metadata-project-fields.md).

## References

- `patterns/filter-picker.html`
- `templates/partials/organization-picker-panel.html`
- `templates/partials/project-picker-panel.html`
- `docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md`
