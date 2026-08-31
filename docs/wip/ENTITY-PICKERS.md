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

The picker still needs:

- the metadata that distinguishes projects with the same name: funder, programme,
  grant number, years or a tested combination;
- one action term, **Add project** or **Link project**, used here and in the deposit flow.

Raven owns the available project metadata. Design chooses the row and action wording
after that data is confirmed.

## References

- `patterns/filter-picker.html`
- `templates/partials/organization-picker-panel.html`
- `templates/partials/project-picker-panel.html`
- `docs/wip/QUERY-BUILDER-FIELD-CONTRACT.md`
