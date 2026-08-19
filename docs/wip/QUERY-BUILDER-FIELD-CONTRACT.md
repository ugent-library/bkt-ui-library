# Query builder field contract — draft

*Which fields advanced search offers, on which surface, with the label, the operators and the input
behind each. This file says what the user is offered; what a field maps onto in the backend is
raven's to establish. Cases and numbers: [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md)
and [`QUERY-BUILDER-EVIDENCE.md`](QUERY-BUILDER-EVIDENCE.md).*

## Contract rules

The builder authors **research output** queries. The public page is the first surface, and the
backoffice reuses the same list with more fields exposed. Which fields a surface offers is a
setting the team can change without redrawing the page, since the decision is not set in stone.

- A row reads left to right: the field, a qualifier where the field has one, the operator, then the
  value. The operator decides how many values follow: one, a list, or a pair for a range. A work has
  to match every row, which is what *and* means here.
- Two shapes express *or*. `is any of` takes several values of one field, in one row. A group takes
  several **conditions** and matches any of them, which is how two different fields become
  alternatives. A second row on the same field adds a condition rather than an alternative: two
  Person rows mean both people, not either of them.
- One field can ask a question in more than one way, and the qualifier says which: on Person it is
  the role, on Published in the kind of container. A field earns a qualifier only where the value
  stays the same kind of thing however the qualifier is set, and where *any* is a real answer. Where
  either fails, the questions become separate entries. The field list offers one entry per question a
  reader asks, not one per legacy index name.
- Any field whose values are a list takes a pasted batch. Lines it cannot read are reported,
  and a list that outgrows a durable link points at Save this search.
- A public URL never reveals a record the public cannot see.
- Values in committed examples stay fixtures.

The drawn field list (`templates/partials/search-field-list.html`) follows the public table below.
When the two disagree, fix this file first.

| Operator | What it means to the user |
|---|---|
| `contains` / `does not contain` | the text holds, or lacks, the words entered |
| `is` / `is not` | matches, or excludes, the whole value, exactly as written |
| `is any of` | matches any value in the list pasted or picked |
| `is at least` / `is at most` | the year named counts as inside the bound |
| `is between` | both years named count as inside |
| `is more than` / `is less than` | a quantity, not a point in time — impact factor, not year |

## Public

The public builder offers this list and nothing else. The surface test
(`docs/SEARCH-AND-FILTERING.md` rule 5, `docs/SURFACES.md`) decides, and it beats "the field is
public anyway".

| id | label | covers (legacy) | operators | value input |
|---|---|---|---|---|
| `q` | Words or topic | `basic`, bare text on a power form | contains, does not contain | text |
| `title` | Title | `title` | contains, does not contain, is, is not | text |
| `abstract` | Abstract | `abstract` | contains, does not contain, is, is not | text |
| `keyword` | Keyword | `keyword`; alias `subject` | contains, does not contain, is, is not | text |
| `contributor` | Person | `author`, `editor`, `promoter`, `soleauthor`, `firstauthor`, `lastauthor` | is, is not, is any of · role: in any role / as author / as first author / as last author / as sole author / as editor / as supervisor | person picker, one token per person |
| `organization` | Affiliation | `affiliation`, `external` | is, is not, is any of | organization typeahead |
| `project` | Project | `project`, `project.id` | is, is not, is any of | project typeahead |
| `funding_programme` | Funding programme | `project.euframeworkprogramme` | contains, is, is not, is any of | text |
| `work_type` | Publication type | `type`; subtype aliases | is, is not, is any of | select |
| `year` | Publication year | `year`, ranges | is, is not, is any of, is between, is at least, is at most | year input; a pair for between |
| `publication_status` | Publication status | `publication_status`, `publicationstatus` | is, is not, is any of | select: Unpublished, In press, Published |
| `container` | Published in | `parent`, `publication` | contains, does not contain, is, is not · where: any container / journal / book / proceedings / magazine / newspaper / series / show or lecture series | text |
| `conference` | Conference | `conference` | contains, does not contain, is, is not | text |
| `publisher` | Publisher | `publisher` | contains, does not contain, is, is not | text |
| `language` | Language | `language` | is, is not, is any of | select |
| `access` | Access level | `file.access`, `accesslevel`, `embargo`, has-full-text | is, is not, is any of | select: Open access, Restricted, Under embargo, No full text |
| `files` | Files | `file` | is, is not, is any of | select: A file here, Somewhere else, Nothing deposited |
| `license` | Licence | — | is, is not, is any of | select: CC0 1.0, CC BY 4.0, CC BY-SA 4.0, CC BY-NC 4.0, CC BY-ND 4.0, CC BY-NC-SA 4.0, CC BY-NC-ND 4.0, In copyright, Rights unknown, Other licence |
| `file_type` | Attached content | `file.kind` | is, is not, is any of | select: Full text, Supplementary material, Table of contents, Peer review report, Colophon, Data fact sheet, Agreement |
| `publication_version` | Full-text version | `file.publicationversion` | is, is not, is any of | select: Author version, Accepted version, Published version, Updated version |
| `identifier` | Identifier | `doi`, `issn`, `identifier`, `id`, `vabbid` | is any of, is, is not | paste box |

**Publication status is a fact about the work, not about the deposit.** "In press" says a publisher
has accepted the work and has not issued it yet. A reader needs that before citing. It reads on the
record as well. It earns no sidebar slot: 134 authored queries sit below Language, which holds its
own slot on parity alone.

**Person carries role and position in one select.** Sole, first and last author are positions of the
author role, so they read as roles in the list. A reader picking "as first author" gets the author
whose name leads the credit.

**Affiliation is the organization credited on the work.** The credit is recorded on the work, from
where each contributor belonged when the work was made. It stays put when a person moves, and it
stays readable when a person holds two posts at once. So one row is enough, and it answers "only
UGent" too: an organization filter returns the unit and everything under it, so Affiliation *is*
Ghent University covers every UGent-credited work. Legacy `external` needs no row; the blank state
promotes the shortcut. This is different from the current Biblio.

**A year takes inclusive bounds only.** *is after 2015* and *is at least 2016* are the same query on
a year. This is different from the current Biblio.

**Published in names the thing a work appeared in.** Each work type has at most one, and the row
carries which kind. The default matches all of them, as the legacy index did, so a reader who knows
the name types it and stops. A series is in the list because a reader looking for a book series asks
the same question. A journal's abbreviation matches alongside its title.

**Conference names the event, not the container.** A conference contribution sometimes appears in a
proceedings volume and sometimes in nothing at all. A talk never has one. The event always exists:
its name, its place, its dates, its organiser. Published in looks at the volume, so without this row
a poster or a talk has nothing to be found by. One value matches the name, the organiser and the
location together, as the legacy index did.

**Funding programme reaches a work through its projects.** A reader asking for Horizon 2020 output
means the programme that funded the project behind the work.

**Files asks where the content sits: here, somewhere else, or nowhere.** A dataset often lives in
another repository, and only its address is deposited here, so a reader looking for something to open
needs to know which of the three a record is. *Somewhere else* covers a link and an address alike, and
open question 3 holds whether the two ever need separating. Access answers a different question about
the same content.

**Attached content asks whether a file of some kind exists. Access asks whether the content opens.**
Both hold for one record: a work with no readable full text still shows a public table of contents.
The public list carries every type a publicly visible file can carry, because the public page speaks
only about files the public can see. That is a narrower list per surface. A reader may also combine
conditions that return nothing, and gets the zero-results state.

**Licence says what a reader may do with the content.** It comes from a closed list the record
already shows. Two of its values mislead
if read loosely. *Rights unknown* means the metadata editor could not establish the rights, and a
record with no licence set makes no claim at all, so the row does not offer that state.
*Other licence* means a licence outside the list: the record shows its URL, and the row matches
the value.

## Folded into another row

| field | where it went |
|---|---|
| `promoter` | contributor role "as supervisor" |
| `soleauthor`, `firstauthor`, `lastauthor` | contributor roles "as sole author", "as first author", "as last author" |
| `external` | affiliation *is* / *is not* Ghent University |
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
| `classification` | Classification | `classification` | is, is not, is any of | — |
| `vabb_evaluation` | VABB evaluation `TBD` | `vabb_approved` | is, is not | — |
| `vabb_type` | VABB type `TBD` | `vabbtype` | is, is not, is any of | — |
| `vabb_year` | VABB submission year `TBD` | `vabbyear` | is, is at least, is at most, is between | — |
| `date_created` | Date created | `datecreated` | is at least, is at most, is between | — |
| `date_changed` | Date last changed | `dateupdated` | is at least, is at most, is between | — |
| `date_defended` | Date defended | `defence.date` | is at least, is at most, is between | — |
| `jcr_impact_factor` | JCR impact factor `TBD` | `jcr.impact_factor` | is more than, is less than, is between | — |
| `jcr_category` | JCR category `TBD` | `jcr.category` | is, is not, is any of | — |
| `jcr_quartile` | JCR category quartile `TBD` | `jcr.categoryquartile` | is, is not, is any of | — |
| `jcr_decile` | JCR category decile `TBD` | `jcr.categorydecile` | is, is not, is any of | — |
| `jcr_vigintile` | JCR category vigintile `TBD` | `jcr.categoryvigintile` | is, is not, is any of | — |

**Classification is UGent's own publication typology** — A1 an article in the Web of Science, A2 an
article in an international peer reviewed journal, B1 a book, D1 a doctoral thesis, and so on to V and
U. It says what kind of publication this is and how strong the venue, which is a second reading of the
work rather than a verdict anyone passes on it. It sits in the backoffice because a code is curator
and evaluation vocabulary, and the surface setting can move it later.

**VABB is a different assertion, made outside UGent** — whether a work counts for the Flemish list,
and in which VABB type. Three facts, so three entries: the evaluation is a yes or no, the type is a
code, the submission year is a year. `TBD` whether any of them is exposed at all.

**Each date is its own entry** — created, last changed, defended — because *any date* is not a
question anyone asks. Biblio also recorded when a depositor submitted a record and when a librarian
approved it, and open question 1 settles what carries those.

**Each JCR metric is its own entry** — impact factor, category, quartile, decile, vigintile —
because both the value and the operators change with the metric: a category is a value, an impact
factor is a number, and a quartile is a rank out of four where a vigintile is one out of twenty. Every
metric describes the journal rather than the work, and it changes with each yearly JCR edition, so it
belongs to the journal and is read through it. Two answers come before the rows are built: who holds
the Clarivate licence and what it permits, and where a journal's own data lives. `TBD` whether these
live on the public or backoffice side.

## Undecided

On the table, with no surface yet. Each entry names the open question that settles it.

| id | label | state |
|---|---|---|
| `copyright_statement` | Copyright statement | The current system stores no such value and renders the sentence from the licence, so nothing is drawn while open question 2 stands |

## Dropped

No row offers these legacy indexes, and none is planned: `volume`, `issue`, `issuetitle`,
`articlenumber`, `firstpage`, `lastpage`, `alternativetitle`, `editor.affiliation`, `orcid`. Each
one pins down a single work the reader already holds a citation for, and none drew a human query or
a machine hit across 2026-H1.

A translated query carrying a dropped name still resolves — the translator keeps that contract, and
the golden set holds it.

## Translator only

Legacy names a translated query may carry, which no builder row offers:

| legacy name | treatment |
|---|---|
| `field`, `for`, `of` | parse artifacts from logged queries — fail closed |
| `author.affiliation` | the work's credited organization answers it; see Affiliation above `TBD` this is different from the old Biblio |
| `publicationstatus` | alias spelling of `publication_status` |

## Open questions

1. **Which of biblio's workflow dates survive?** Biblio recorded a submission date and an approval
   date. raven runs its own record lifecycle and keeps a `reviewed_at` timestamp, which looks like
   the approval date's successor. Two things need settling: whether `reviewed_at` means what the
   approval date meant, and what carries the submission date. (raven answers.)
2. **Does the builder offer a Copyright statement row? (TBD)** The current system stores no such
   value. It renders a sentence from the licence for the public record, for OAI's `dc:rights` and for
   MODS `accessCondition`, and raven keeps the licence alone. Three options: a row that filters the
   rendered sentence, a row on a rights field raven would add, or the Licence row answering for it.
   (Team, with a developer's view.)
3. **Do a link and an address need separating in Files? (TBD)** raven carries content that lives
   elsewhere either as a link or as an identifier that resolves to it. *Somewhere else* covers both,
   on both surfaces. Split the value if curators turn out to act on the difference, or flag if this
   an ambigue interpretation.

The count's behaviour, and how exact it may be, is asked where it is decided:
[`ISSUE-04`](QUERY-BUILDER-ISSUE-04-count.md).
