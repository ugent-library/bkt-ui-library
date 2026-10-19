# Query builder field contract — earlier prototype

This is the field set of the earlier, larger prototype. The public V1 offers these rows:
`contributor` (with role), `organization`, `project`, `keyword`, `identifier`, `access`,
`work_type`, `year`, `language`, `title` and `container`. The others wait for live use
([DD-006](../decisions/DD-006-query-builder-v1-replaces-power-search.md)). The public
Identifier row takes up to five identifiers; longer batches and Classification belong to the
backoffice V1. The other public rows wait for a later version, not yet decided.
Raven owns backend mappings and safe input limits.

The legacy names each field covers are in
[`QUERY-BUILDER-LEGACY-COVERAGE.md`](QUERY-BUILDER-LEGACY-COVERAGE.md), the numbers in
[`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md) and the test cases in
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md).

## Contract rules

- A row contains field, optional qualifier, operator and value. All top-level rows must match.
- Several values in one condition match any of them. Where the operator is a choice,
  `is any of` says so. Two Person rows mean both people.
- A qualifier changes how the same kind of value is read, such as a person's role. Any other difference
  gets its own field.
- List inputs accept pasted batches and report unread values, including what the cap drops.
  Pickers disable further values at the cap.
  A public condition takes at most five values. The backoffice cap is 50 until the backoffice
  V1 (#295) decides; logged identifier batches reach 763 values.
- Public URLs expose only public records. Committed examples use fixtures.
- An id is Raven's filter name, so a shared URL and a Raven query read alike. Where Raven names
  no filter, the id follows Raven's naming grammar. A row that deviates from either says so
  explicitly. Labels stay free to differ: the UI says *Publication type*, the id says
  `work_type`.

`templates/partials/search-field-list.html` follows these tables. Fix this contract first when
they disagree.

| Operator | What it means to the user |
|---|---|
| `contains` / `does not contain` | the text holds, or lacks, the words entered |
| `is` / `is not` | matches, or excludes, the whole value, exactly as written |
| `matches` | the words match as the search box matches them; raven owns the matching rule |
| `is any of` | matches any value in the list pasted or picked |
| `is at least` / `is at most` | the year named counts as inside the bound |
| `is between` | the years named count as inside; an empty end leaves that side open |
| `is more than` / `is less than` | a quantity, not a point in time — impact factor, not year |

## Public

The earlier prototype offers these public fields. Rule 5 in
`docs/SEARCH-AND-FILTERING.md` decides which fields may be public.

| id | label | operators | value input |
|---|---|---|---|
| `title` | Title | matches | text; autocompletes against titles (`TBD` raven capability) |
| `abstract` | Abstract | contains, does not contain, is, is not | text |
| `keyword` | Keywords | is | text; several values separated by commas or semicolons; autocompletes (`TBD` raven capability) |
| `contributor` `TBD` | Person | is · role: in any role / as author / as first author / as last author / as sole author / as editor / as supervisor | person picker |
| `organization` | Organization | is | organization picker |
| `project` | Project | is | project picker |
| `work_type` | Publication type | is | type picker; raven's work-type catalog (`work_type.go`) |
| `year` | Publication year | is, is between | a year list for is, separated by commas or semicolons; a pair for between |
| `container` | Appeared in | is · where: anywhere / journal / book / proceedings / magazine / newspaper / series / show or lecture series / venue / publisher place | text; several values separated by semicolons; an identifier also matches (`TBD` schemes — raven names them) |
| `conference` | Conference | is | text |
| `publisher` | Publisher | contains, does not contain, is, is not | text |
| `language` | Language | is | language picker; raven's ISO 639-2/B vocabulary (`language.go`), shown by English name |
| `access` | Access | is | select: Open access, Restricted, Under embargo, Metadata only |
| `identifier` | Identifier | is any of, is, is not | list; up to five identifiers, scheme recognised per value |
| `file_type` | Attached content | is, is not, is any of | select: Full text or dataset, Supplementary material, Table of contents, Peer review report, Colophon, Data fact sheet, Agreement |

### Public decisions

- Organization means the credit recorded on the work,
  based on affiliation at the time rather than a person's current post. It therefore stays stable
  when a person moves or holds several posts. Matching a unit includes its descendants. The legacy
  `external` field becomes *Organization is Ghent University*; the negation is backoffice-only.
- The Person id is `TBD`: Raven's live person filter is named `author` and carries no role, so
  Raven must name the role-aware filter this row needs.
- Year bounds are inclusive.
- Appeared in matches the container, such as a journal, book or series; a qualifier can limit
  the kind. Journal abbreviations also match.
  *Anywhere* includes `publisher` where raven's crosswalk makes it the container (reports,
  online posts). Conference means the event and matches its name, organiser or location.
- Funding programme is project metadata, not a field of its own. The project picker shows it
  on each funding entry and whole-row search matches it; no condition filters on it. Nobody
  asked for one, and raven holds it as free text with no authority behind it, so it cannot be
  faceted. Build a condition only on an explicit ask.
- Access says whether a file can be opened. Attached content says which kind of visible file
  the record has. Its
  *Full text or dataset* value means the record's main file: raven's role stays `full_text`,
  and a dataset's data lives at its identifier.

## Backoffice only

| id | label | operators | qualifier |
|---|---|---|---|
| `visibility` | Record visibility | is, is not, is any of | — |
| `deposit_status` | Deposit status | is, is not, is any of | — |
| `publication_status` | Publication status | is, is not, is any of | — |
| `identifier` | Identifier | is any of, is, is not | — |
| `license` | Licence | is | — |
| `publication_version` | Full-text version | is, is not, is any of | — |
| `ugent_classification` | Classification | is, is not, is any of | — |
| `vabb_evaluation` | VABB evaluation | is, is not | — |
| `vabb_type` | VABB type | is, is not, is any of | — |
| `vabb_submission_year` | VABB submission year | is, is at least, is at most, is between | — |
| `record_history` `TBD` | Record history | a from–to date pair; empty = any time | which event: created / last changed / reviewed |
| `defense_date` | Date defended | is at least, is at most, is between | — |
| `jcr_impact_factor` | JCR impact factor | is more than, is less than, is between | — |
| `jcr_category` | JCR category `TBD` | is | — |
| `jcr_quartile` | JCR category quartile | is | — |
| `jcr_decile` | JCR category decile | is | — |
| `jcr_vigintile` | JCR category vigintile | is | — |

### Backoffice decisions

- Publication status describes the work, not its deposit. It has no sidebar facet.
- Licence uses the record's closed list. *Rights unknown* matches that explicit value; *No
  licence* matches an unset licence; *Other licence* matches a value outside the named list. A copyright
  statement is rendered from the licence, so there is no separate copyright condition; raven does not model one.
- The search box still finds a single identifier (rule 3). The public Identifier row takes up
  to five; the backoffice 50 for now.
- Access and Organization gain *is not* on the backoffice; legacy `file.access <> open`
  (103 logged) stays authorable there.
- Classification is UGent's publication typology. VABB evaluation, type and submission year
  remain separate external assertions. The prototype's Classification, VABB and JCR lists
  are mock values; raven's catalogs confirm them.
- One Record history condition covers created, last changed or reviewed, with who and
  when: a person, any Biblio team member, or the system (imports, Plato), and a
  from–to date pair. An empty date leaves that side open. Date defended stays separate work
  metadata. Reviewed carries the legacy approval; there is no submission date. Raven names
  the `record_history` filter and the reviewed timestamp.
- Each JCR metric remains separate because its value and operators differ. Band 1 is
  the top. The category catalog, and which JCR consumers survive, wait on raven's Journal
  authority ([raven#284](https://github.com/ugent-library/raven/issues/284)).
