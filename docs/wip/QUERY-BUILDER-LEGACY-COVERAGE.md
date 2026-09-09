# Query builder legacy coverage — context for raven's translator

Context, not specification: raven decides every translation. The builder's fields,
operators and values live in
[`QUERY-BUILDER-FIELD-CONTRACT.md`](QUERY-BUILDER-FIELD-CONTRACT.md); the acceptance
cases in [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md), whose subset B
is the translator's gate.

## Field overview

Labels, operators and qualifiers are copied from the contract for overview; the contract
decides.

| id | label | covers (legacy) | operators | qualifier |
|---|---|---|---|---|
| `title` | Title | `title` | matches | — |
| `abstract` | Abstract | `abstract` | contains, does not contain, is, is not | — |
| `keyword` | Keywords | `keyword`; alias `subject` | is | — |
| `contributor` `TBD` | Person | `author`, `editor`, `promoter`, `soleauthor`, `firstauthor`, `lastauthor` | is | role: in any role / as author / as first author / as last author / as sole author / as editor / as supervisor |
| `organization` | Organization | `affiliation`, `external` | is; the backoffice adds is not | — |
| `project` | Project | `project`, `project.id` | is | — |
| `work_type` | Publication type | `type`; subtype aliases | is | — |
| `year` | Publication year | `year`, ranges | is, is between | — |
| `container` | Appeared in | `parent`, `publication` | is | where: anywhere / journal / book / proceedings / magazine / newspaper / series / show or lecture series / venue / publisher place `TBD` |
| `conference` | Conference | `conference` | is | — |
| `publisher` | Publisher | `publisher` | contains, does not contain, is, is not | — |
| `language` | Language | `language` | is | — |
| `access` | Access level | `file.access`, `accesslevel`, `embargo`, has-full-text, `file` (has-file boolean) | is; the backoffice adds is not | — |
| `file_type` | Attached content | `file.kind` | is, is not, is any of | — |
| `visibility` | Record visibility | — | is, is not, is any of | — |
| `deposit_status` | Deposit status | — | is, is not, is any of | — |
| `publication_status` | Publication status | `publication_status`; alias spelling `publicationstatus` | is, is not, is any of | — |
| `identifier` | Identifier | `doi`, `issn`, `identifier`, `id`, `vabbid` | is any of, is, is not | — |
| `license` | Licence | — | is | — |
| `publication_version` | Full-text version | `file.publicationversion` | is, is not, is any of | — |
| `ugent_classification` | Classification | `classification` | is, is not, is any of | — |
| `vabb_evaluation` | VABB evaluation | `vabb_approved` | is, is not | — |
| `vabb_type` | VABB type | `vabbtype` | is, is not, is any of | — |
| `vabb_submission_year` | VABB submission year | `vabbyear` | is, is at least, is at most, is between | — |
| `record_history` `TBD` | Record history | `datecreated`, `dateupdated`; the reviewed date carries the legacy approval (raven names it) | a from–to date pair | which event: created / last changed / reviewed |
| `defense_date` | Date defended | `defence.date` | is at least, is at most, is between | — |
| `jcr_impact_factor` | JCR impact factor | `jcr.impact_factor` | is more than, is less than, is between | — |
| `jcr_category` `TBD` | JCR category | `jcr.category` | is | — |
| `jcr_quartile` | JCR category quartile | `jcr.categoryquartile` | is | — |
| `jcr_decile` | JCR category decile | `jcr.categorydecile` | is | — |
| `jcr_vigintile` | JCR category vigintile | `jcr.categoryvigintile` | is | — |

## Folded into another row

| field | where it went |
|---|---|
| `promoter` | contributor role "as supervisor" |
| `soleauthor`, `firstauthor`, `lastauthor` | contributor roles "as sole author", "as first author", "as last author" |
| `external` | organization *is* / *is not* Ghent University |
| `embargo` | access value "Under embargo" |
| metadata-only | access value "Metadata only" |
| biblio or raven record id, `vabbid` | identifier, recognised by its scheme |
| `articletype`, `misctype`, `conferencetype`, `dissertationtype` | work-type aliases |
| `subject` | keyword alias |
| `project.euframeworkprogramme` | project — the picker shows and matches each project's programme |

## Dropped

No row offers `volume`, `issue`, `issuetitle`, `articlenumber`, `firstpage`, `lastpage`,
`alternativetitle`, `editor.affiliation` or `orcid`: none drew a human query or machine hit in
2026-H1. The translator must still resolve saved queries that contain them. They come back
if curators or reviewers turn out to still use them.

## Translator only

Legacy names a translated query may carry, which no builder row offers:

| legacy name | context |
|---|---|
| `field`, `for`, `of` | parse artifacts from logged queries |
| `basic`, bare text | the search box carries it |
| `author.affiliation` | the work's credited organization answers it; see the contract's Organization decision `TBD` this is different from the old Biblio |
