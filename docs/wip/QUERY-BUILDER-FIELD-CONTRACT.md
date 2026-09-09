# Query builder field contract — draft

Fields, labels, operators and inputs offered by each surface. Raven owns backend mappings. Evidence:
[`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md); cases:
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md).

## Contract rules

- A row contains field, optional qualifier, operator and value. All top-level rows must match.
- Several values in one condition match any of them; `is any of` spells it where the operator
  is a choice. An OR group joins separate conditions (phase 2). Two Person rows therefore mean both
  people.
- A qualifier changes how the same kind of value is read, such as a person's role. Otherwise the
  question gets a separate field entry.
- List inputs accept pasted batches and report unread values, including what the cap drops.
  A condition takes at most five values on the public surface and twenty on the backoffice;
  raising the backoffice number is expected, not scheduled.
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

The public builder offers these fields. Rule 5 in `docs/SEARCH-AND-FILTERING.md`
decides which fields may be public.

| id | label | covers (legacy) | operators | value input |
|---|---|---|---|---|
| `title` | Title | `title` | matches | text; autocompletes against titles (`TBD` raven capability) |
| `abstract` | Abstract | `abstract` | contains, does not contain, is, is not | text |
| `keyword` | Keywords | `keyword`; alias `subject` | is | text; several values separated by commas or semicolons; autocompletes (`TBD` raven capability) |
| `contributor` `TBD` | Person | `author`, `editor`, `promoter`, `soleauthor`, `firstauthor`, `lastauthor` | is · role: in any role / as author / as first author / as last author / as sole author / as editor / as supervisor | person picker; several tokens match any of them |
| `organization` | Organization | `affiliation`, `external` | is | organization picker; several tokens match any of them |
| `project` | Project | `project`, `project.id` | is | project picker; several tokens match any of them |
| `work_type` | Publication type | `type`; subtype aliases | is | token picker over the v1 type list in `docs/work-types/WORK-TYPES.md`; several tokens match any of them |
| `year` | Publication year | `year`, ranges | is, is between | a year list for is, separated by commas or semicolons; a pair for between, either end may stay empty (from X / up to Y) |
| `container` | Appeared in | `parent`, `publication` | is · where: in any container / journal / book / proceedings / magazine / newspaper / series / show or lecture series / venue / publisher place `TBD` | text; an identifier also matches (`TBD` schemes — raven names them) |
| `conference` | Conference | `conference` | is | text |
| `publisher` | Publisher | `publisher` | contains, does not contain, is, is not | text |
| `language` | Language | `language` | is | token picker over raven's closed ISO 639-2/B vocabulary (`language.go`); names from the standard's English names; several tokens match any of them |
| `access` | Access level | `file.access`, `accesslevel`, `embargo`, has-full-text, `file` (has-file boolean) | is | select: Open access, Restricted, Under embargo, Metadata only |
| `file_type` | Attached content | `file.kind` | is, is not, is any of | select: Full text or dataset, Supplementary material, Table of contents, Peer review report, Colophon, Data fact sheet, Agreement |

### Public decisions

- Organization means the credit recorded on the work,
  based on affiliation at the time rather than a person's current post. It therefore stays stable
  when a person moves or holds several posts. Matching a unit includes its descendants. The legacy
  `external` field becomes Ghent University *is*; its negation lost its route when
  Organization narrowed to *is*.
- The Person id is `TBD`: Raven's live person filter is named `author` and carries no role, so
  Raven must name the role-aware filter this row needs.
- Year bounds are inclusive.
- Appeared in means the container and may be qualified by kind. Journal abbreviations also match.
  *Publisher place* is provisional: the fuzzy-search downside is unknown.
  Conference means the event and matches its name, organiser or location.
- Funding programme reaches a work through its projects and has no row: the project picker
  shows each project's programme and its search matches it. Renaming the Project label to say
  so is undecided.
- Access says whether it opens. Attached content says which visible file kind exists.

## Folded into another row

| field | where it went |
|---|---|
| `promoter` | contributor role "as supervisor" |
| `soleauthor`, `firstauthor`, `lastauthor` | contributor roles "as sole author", "as first author", "as last author" |
| `external` | organization *is* Ghent University |
| `embargo` | access value "Under embargo" |
| metadata-only | access value "Metadata only" |
| biblio or raven record id, `vabbid` | identifier, recognised by its scheme |
| `articletype`, `misctype`, `conferencetype`, `dissertationtype` | work-type aliases |
| `subject` | keyword alias |
| `project.euframeworkprogramme` | project — the picker shows and matches each project's programme |

## Backoffice only

| id | label | covers (legacy) | operators | qualifier |
|---|---|---|---|---|
| `visibility` | Record visibility | — | is, is not, is any of | — |
| `deposit_status` | Deposit status | — | is, is not, is any of | — |
| `publication_status` | Publication status | `publication_status`, `publicationstatus` | is, is not, is any of | — |
| `identifier` | Identifier | `doi`, `issn`, `identifier`, `id`, `vabbid` | is any of, is, is not | — |
| `license` | Licence | — | is | — |
| `publication_version` | Full-text version | `file.publicationversion` | is, is not, is any of | — |
| `ugent_classification` | Classification | `classification` | is, is not, is any of | — |
| `vabb_evaluation` | VABB evaluation | `vabb_approved` | is, is not | — |
| `vabb_type` | VABB type | `vabbtype` | is, is not, is any of | — |
| `vabb_submission_year` | VABB submission year | `vabbyear` | is, is at least, is at most, is between | — |
| `created_at` | Date created | `datecreated` | is at least, is at most, is between | — |
| `updated_at` | Date last changed | `dateupdated` | is at least, is at most, is between | — |
| `defense_date` | Date defended | `defence.date` | is at least, is at most, is between | — |
| `jcr_impact_factor` | JCR impact factor `TBD` | `jcr.impact_factor` | is more than, is less than, is between | — |
| `jcr_category` | JCR category `TBD` | `jcr.category` | is, is not, is any of | — |
| `jcr_quartile` | JCR category quartile `TBD` | `jcr.categoryquartile` | is, is not, is any of | — |
| `jcr_decile` | JCR category decile `TBD` | `jcr.categorydecile` | is, is not, is any of | — |
| `jcr_vigintile` | JCR category vigintile `TBD` | `jcr.categoryvigintile` | is, is not, is any of | — |

### Backoffice decisions

- Publication status describes the work, not its deposit. It has no sidebar facet.
- Licence uses the record's closed list. *Rights unknown* matches that explicit value; *No
  licence* matches an unset licence; *Other licence* matches a value outside the named list.
- Identifier lookup on the public surface stays in the search box (rule 3); the paste box is
  backoffice.
- Access level gains *is not* on the backoffice; legacy `file.access <> open` (103 logged)
  stays authorable there.
- Classification is UGent's publication typology. VABB evaluation, type and submission year
  remain separate external assertions. The prototype's Classification and VABB value lists are
  assumptions; raven's catalogs confirm them.
- Created, changed and defended remain separate dates. Open question 1 covers legacy workflow dates.
- Each JCR metric remains separate because its value and operators differ. Exposure depends on the
  Clarivate licence and Raven's journal-data ownership.

## Undecided

| id | label | state |
|---|---|---|
| `copyright_statement` | Copyright statement | The current system stores no such value and renders the sentence from the licence, so nothing is drawn while open question 2 stands |

## Dropped

No row offers `volume`, `issue`, `issuetitle`, `articlenumber`, `firstpage`, `lastpage`,
`alternativetitle`, `editor.affiliation` or `orcid`: none drew a human query or machine hit in
2026-H1. The translator must still resolve saved queries that contain them.

## Translator only

Context for raven's translator, not a specification — raven decides every translation.
Legacy names a translated query may carry, which no builder row offers:

| legacy name | context |
|---|---|
| `field`, `for`, `of` | parse artifacts from logged queries |
| `basic`, bare text | the search box carries it |
| `author.affiliation` | the work's credited organization answers it; see Organization above `TBD` this is different from the old Biblio |
| `publicationstatus` | alias spelling of `publication_status` |

## Open questions

1. Which legacy submission and approval dates survive? Raven must confirm whether `reviewed_at`
   replaces approval and what carries submission.
2. Does Copyright statement filter the rendered licence sentence, require a Raven rights field, or
   disappear in favour of Licence?
3. Does Raven keep `full_text` behind the public label *Full text or dataset*, rename the role, or add
   a data-specific role?
4. Does *in any container* reach legacy values that migration routed to `publisher`? Raven must
   answer from the mapping.

The count's behaviour, and how exact it may be, is asked where it is decided:
[`ISSUE-04`](QUERY-BUILDER-ISSUE-04-count.md).
