# Query builder field contract — draft

Fields, labels, operators and inputs offered by each surface. Raven owns backend mappings. Evidence:
[`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md); cases:
[`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md).

## Contract rules

The public builder ships first; backoffice reuses it with more fields.

- A row contains field, optional qualifier, operator and value. All top-level rows must match.
- `is any of` joins values of one field. An OR group joins separate conditions. Two Person rows
  therefore mean both people.
- A qualifier changes how the same kind of value is read, such as a person's role. Otherwise the
  question gets a separate field entry.
- List inputs accept pasted batches, report unread values and direct oversized links to Save this
  search.
- Public URLs expose only public records. Committed examples use fixtures.
- An id is Raven's filter name, so a shared URL and a Raven query read alike. Where Raven names
  no filter, the id follows Raven's naming grammar. A row that deviates from either says so
  explicitly. Labels stay free to differ: the UI says *Funding programme*, the id says
  `funding_program`.

`templates/partials/search-field-list.html` follows the public table. Fix this contract first when
they disagree.

| Operator | What it means to the user |
|---|---|
| `contains` / `does not contain` | the text holds, or lacks, the words entered |
| `is` / `is not` | matches, or excludes, the whole value, exactly as written |
| `is any of` | matches any value in the list pasted or picked |
| `is at least` / `is at most` | the year named counts as inside the bound |
| `is between` | both years named count as inside |
| `is more than` / `is less than` | a quantity, not a point in time — impact factor, not year |

## Public

The public builder offers this list and nothing else. `docs/SEARCH-AND-FILTERING.md`
rule 5 owns public field placement. `docs/SURFACES.md` defines the product layers; it
does not decide which fields the public builder exposes.

| id | label | covers (legacy) | operators | value input |
|---|---|---|---|---|
| `q` | Words or topic | `basic`, bare text on a power form | contains, does not contain | text |
| `title` | Title | `title` | contains, does not contain, is, is not | text |
| `abstract` | Abstract | `abstract` | contains, does not contain, is, is not | text |
| `keyword` | Keywords | `keyword`; alias `subject` | contains, does not contain, is, is not | text |
| `contributor` `TBD` | Person | `author`, `editor`, `promoter`, `soleauthor`, `firstauthor`, `lastauthor` | is, is not, is any of · role: in any role / as author / as first author / as last author / as sole author / as editor / as supervisor | person picker, one token per person |
| `organization` | Organization | `affiliation`, `external` | is, is not, is any of | organization picker |
| `project` | Project | `project`, `project.id` | is, is not, is any of | project picker |
| `funding_program` | Funding programme | `project.euframeworkprogramme` | contains, is, is not, is any of | text |
| `work_type` | Publication type | `type`; subtype aliases | is, is not, is any of | select |
| `year` | Publication year | `year`, ranges | is, is not, is any of, is between, is at least, is at most | year input; a pair for between; a comma-separated list for any of |
| `publication_status` | Publication status | `publication_status`, `publicationstatus` | is, is not, is any of | select: Unpublished, In press, Published |
| `container` | Published in | `parent`, `publication` | contains, does not contain, is, is not · where: in any container / journal / book / proceedings / magazine / newspaper / series / show or lecture series | text |
| `conference` | Conference | `conference` | contains, does not contain, is, is not | text |
| `publisher` | Publisher | `publisher` | contains, does not contain, is, is not | text |
| `language` | Language | `language` | is, is not, is any of | select |
| `access` | Access level | `file.access`, `accesslevel`, `embargo`, has-full-text | is, is not, is any of | select: Open access, Restricted, Under embargo, No full text |
| `files` | Files | `file` | is, is not, is any of | select: A file here, Somewhere else, Nothing deposited |
| `license` | Licence | — | is, is not, is any of | select: CC0 1.0, CC BY 4.0, CC BY-SA 4.0, CC BY-NC 4.0, CC BY-ND 4.0, CC BY-NC-SA 4.0, CC BY-NC-ND 4.0, In copyright, Rights unknown, Other licence |
| `file_type` | Attached content | `file.kind` | is, is not, is any of | select: Full text or dataset, Supplementary material, Table of contents, Peer review report, Colophon, Data fact sheet, Agreement |
| `publication_version` | Full-text version | `file.publicationversion` | is, is not, is any of | select: Author version, Accepted version, Published version, Updated version |
| `identifier` | Identifier | `doi`, `issn`, `identifier`, `id`, `vabbid` | is any of, is, is not | paste box |

### Public decisions

- Publication status describes the work, not its deposit. It has no sidebar facet.
- Person includes role and author position. Organization means the credit recorded on the work,
  based on affiliation at the time rather than a person's current post. It therefore stays stable
  when a person moves or holds several posts. Matching a unit includes its descendants. The legacy
  `external` field becomes Ghent University *is* or *is not*.
- The Person id is `TBD`: Raven's live person filter is named `author` and carries no role, so
  Raven must name the role-aware filter this row needs. `contributor` matches its field name.
- Year bounds are inclusive.
- Published in means the container and may be qualified by kind. Journal abbreviations also match.
  Conference means the event and matches its name, organiser or location.
- Funding programme reaches a work through its projects.
- Files says whether content is here, elsewhere or absent. Access says whether it opens. Attached
  content says which visible file kind exists. The main-content option reads *Full text or dataset*.
- Licence uses the record's closed list. *Rights unknown* matches that explicit value, not an unset
  licence; *Other licence* matches a value outside the named list.

## Folded into another row

| field | where it went |
|---|---|
| `promoter` | contributor role "as supervisor" |
| `soleauthor`, `firstauthor`, `lastauthor` | contributor roles "as sole author", "as first author", "as last author" |
| `external` | organization *is* / *is not* Ghent University |
| `embargo` | access value "Under embargo" |
| has-full-text | access value "No full text" |
| metadata-only | files value "Nothing deposited" |
| biblio or raven record id, `vabbid` | identifier, recognised by its scheme |
| `articletype`, `misctype`, `conferencetype`, `dissertationtype` | work-type aliases |
| `subject` | keyword alias |

## Backoffice only

| id | label | covers (legacy) | operators | qualifier |
|---|---|---|---|---|
| `visibility` | Record visibility | — | is, is not, is any of | — |
| `deposit_status` | Deposit status | — | is, is not, is any of | — |
| `ugent_classification` | Classification | `classification` | is, is not, is any of | — |
| `vabb_evaluation` | VABB evaluation `TBD` | `vabb_approved` | is, is not | — |
| `vabb_type` | VABB type `TBD` | `vabbtype` | is, is not, is any of | — |
| `vabb_submission_year` | VABB submission year `TBD` | `vabbyear` | is, is at least, is at most, is between | — |
| `created_at` | Date created | `datecreated` | is at least, is at most, is between | — |
| `updated_at` | Date last changed | `dateupdated` | is at least, is at most, is between | — |
| `defense_date` | Date defended | `defence.date` | is at least, is at most, is between | — |
| `jcr_impact_factor` | JCR impact factor `TBD` | `jcr.impact_factor` | is more than, is less than, is between | — |
| `jcr_category` | JCR category `TBD` | `jcr.category` | is, is not, is any of | — |
| `jcr_quartile` | JCR category quartile `TBD` | `jcr.categoryquartile` | is, is not, is any of | — |
| `jcr_decile` | JCR category decile `TBD` | `jcr.categorydecile` | is, is not, is any of | — |
| `jcr_vigintile` | JCR category vigintile `TBD` | `jcr.categoryvigintile` | is, is not, is any of | — |

### Backoffice decisions

- Classification is UGent's publication typology. VABB evaluation, type and submission year remain
  separate external assertions; their exposure is undecided.
- Created, changed and defended remain separate dates. Open question 1 covers legacy workflow dates.
- Each JCR metric remains separate because its value and operators differ. Exposure depends on the
  Clarivate licence and Raven's journal-data ownership.

## Undecided

On the table, with no surface yet. Each entry names the open question that settles it.

| id | label | state |
|---|---|---|
| `copyright_statement` | Copyright statement | The current system stores no such value and renders the sentence from the licence, so nothing is drawn while open question 2 stands |

## Dropped

No row offers `volume`, `issue`, `issuetitle`, `articlenumber`, `firstpage`, `lastpage`,
`alternativetitle`, `editor.affiliation` or `orcid`: none drew a human query or machine hit in
2026-H1. The translator must still resolve saved queries that contain them.

## Translator only

Legacy names a translated query may carry, which no builder row offers:

| legacy name | treatment |
|---|---|
| `field`, `for`, `of` | parse artifacts from logged queries — fail closed |
| `author.affiliation` | the work's credited organization answers it; see Organization above `TBD` this is different from the old Biblio |
| `publicationstatus` | alias spelling of `publication_status` |

## Open questions

1. Which legacy submission and approval dates survive? Raven must confirm whether `reviewed_at`
   replaces approval and what carries submission.
2. Does Copyright statement filter the rendered licence sentence, require a Raven rights field, or
   disappear in favour of Licence?
3. Do curators act differently on an external link and a resolving identifier? If not, keep both
   under *Somewhere else*.
4. Does Raven keep `full_text` behind the public label *Full text or dataset*, rename the role, or add
   a data-specific role?
5. Does *in any container* reach legacy values that migration routed to `publisher`? Raven must
   answer from the mapping.

The count's behaviour, and how exact it may be, is asked where it is decided:
[`ISSUE-04`](QUERY-BUILDER-ISSUE-04-count.md).
