# Work card — current state in production biblio

What the result-list card shows today, per surface and per research output type, with the rule behind each parameter. Extracted from production code, not from screenshots. This is the step-1 inventory for the `bt-work-card` redesign; improvement analysis is a separate step.

Sources:

- **Public site** — `~/Sites/biblio` (Perl / Dancer / Template Toolkit / Catmandu). Card chain: `views/hits_list.tt` → `views/short.tt` → `short_contributors.tt` + `contributor_list.tt` + `short_reference.tt`. Helpers in `lib/Biblio/Helper.pm`.
- **Backoffice** — `~/Sites/biblio-backoffice` (Go / templ). Card: `views/publication/summary/summary.templ`, `views/dataset/summary/summary.templ`, slots filled by `views/publication/search_hit.templ` and `views/dataset/search_hit.templ`. Candidate cards: `views/candidaterecord/summary.templ`.

File:line references are to those repos at the time of writing (2026-07-30).

---

## Type inventory

The two systems name the same types differently.

| Public (`pub.type`) | Backoffice (`publication.type`) | Public card label | Backoffice label |
|---|---|---|---|
| `journalArticle` | `journal_article` | Journal Article | Journal article |
| `book` | `book` | Book | Book |
| `bookChapter` | `book_chapter` | Book Chapter | Book chapter |
| `bookEditor` | `book_editor` | Book Editor | Book editor |
| `issueEditor` | `issue_editor` | Issue Editor | Issue editor |
| `conference` | `conference` | Conference Paper | Conference |
| `dissertation` | `dissertation` | PhD Thesis | Dissertation |
| `misc` | `miscellaneous` | Miscellaneous | Miscellaneous |
| `researchData` | (separate `Dataset` model) | Research Data | — |

Public labels: `catmandu.list.yml:10-19`. Backoffice labels: `locales/en/default.po` (`publication_types.*`). Datasets are a separate model and card in the backoffice; on the public site they are one more `pub.type`.

Subtypes exist for journal articles (original, review, letterNote, proceedingsPaper), conference contributions (proceedingsPaper, abstract, poster, other) and miscellaneous (28 values, artReview … workingPaper). **No card on either surface shows a subtype.** Classifications: A1–A4, B1–B3, C1, C3, D1, P1, V, U (`locales/en/default.po`, `publication_classifications.*`).

---

## Public card (biblio.ugent.be)

Render order: actions (float right) → badge row → title → contributor line → reference line. All in `views/short.tt` unless noted.

| Element | Rule | Source |
|---|---|---|
| Type badge | Always. Label from `publication_types` list, links to `/type/<value>`. | `short.tt:8` |
| Classification badge | **Only for `journalArticle` and `conference`, and only when ≠ `U`.** Raw code (A1, A2…), links to `/classification/<code>`. Books never show B1, dissertations never show D1, misc never shows V. | `short.tt:9-11` |
| Download icon (green) | At least one file with `access = open`, **or** one `restricted` file while the request IP is inside a configured `ip_ranges` network (deployment config; assumed to be campus/VPN ranges — not verifiable from code). | `short.tt:12`, `Helper.pm:795-818` |
| "open access" text | Only when a file is literally `open` (on campus with only restricted files: arrow without text). | `short.tt:15-17`, `Helper.pm:820` |
| Lock icon (grey) | No accessible file, but at least one `restricted` file (i.e. off campus). | `short.tt:19-22` |
| `private` files | Render nothing — no icon at all. Embargo is not surfaced. | `Helper.pm:804-828` |
| Title | Always a link to `/publication/<id>`; fallback literal `[untitled]`. No subtitle, no truncation, no "in press" marker. | `short.tt:26-36` |
| Contributor line | `editor` array for `bookEditor`/`issueEditor` (fallback `author`); `author` for all other types. Promoters (dissertation) never appear. Max **10**, then `, et al.`; ` and ` before the last name only when not truncated. | `short_contributors.tt`, `contributor_list.tt` |
| UGent marking | `<strong>name (UGent)</strong>` when any affiliation path root is `UGent`, `UZGent` or `GUK` — literal text is always "(UGent)". | `Helper.pm:77-84` |
| Contributor link | Person page when the contributor has an `_id`; otherwise a name-based CQL search. | `contributor_list.tt` |
| Reference line | One template for all nine types — see below. | `short_reference.tt` |
| "Add to list" | On search hit lists; logged in → modal with the user's static lists; anonymous → login redirect. | `hits_short_actions.tt`, `button_add_to_list.tt` |
| "Send to ORCID" | Person-page hit list only, and only when the logged-in user has an `orcid_id`. | `person/hits_short_actions.tt:3-25` |

No owner-specific display exists on the public card: no status, no edit link. Altmetrics, citations, language, DOI, thumbnail are detail-page only.

### The reference line

`short_reference.tt` is type-agnostic. Fixed sequence, each part only when its field has data:

```
(YEAR) PARENT_TITLE. In SERIES_TITLE VOLUME(ISSUE). p.FIRST-LAST
```

1. `(year)` — linked year search.
2. `parent.title.` — linked parent search. What this *means* varies by type (see table below) but the rendering is identical.
3. `In series_title` — literal "In " prefix.
4. `volume(issue).` — issue only ever renders when volume exists.
5. `p.first-last` — **only when both** first and last page are present; a first page alone renders nothing. `page.count` never shows.

Never on the public card: publisher, place, conference name/location/dates, ISBN/ISSN, DOI, edition, subtype, language, `parent.short_title`, publication status.

Per type, the only three things that actually differ:

| Type | Contributors shown | Classification badge | `parent.title` semantics (per detail page, `full.tt:301-313`) |
|---|---|---|---|
| journalArticle | authors | yes (≠ U) | journal title |
| conference | authors | yes (≠ U) | proceedings / journal title |
| book | authors | no | series title |
| bookChapter | authors | no | book title |
| bookEditor | editors | no | series title |
| issueEditor | editors | no | journal title |
| dissertation | authors (promoter hidden) | no | — |
| misc | authors | no | — |
| researchData | authors (creators) | no | — |

The `parent.title` semantics column is **inferred** from the detail page's label switch (`full.tt:301-313`) — the card itself renders `parent.title` identically for every type and carries no such labels. Types marked "—" fall into the detail page's default case ("In").

So a dissertation card is typically badge + title + author + `(year)` and nothing else; a dataset card the same. All richness beyond that is data presence, not display logic.

### Citation-style override

With `?style=mla|apa|chicago-author-date|fwo|vancouver|ieee` the whole card is replaced by one pre-rendered CSL citation string (`hits_list.tt:5-11`). Cites are computed at index time via an external citeproc service; only `public` records get them, datasets never do (`lib/Catmandu/Fix/add_cite.pm:48-57`). The CSL type mapping (`lib/Catmandu/Fix/publication_to_csl_item.pm:11-17`) covers book, journalArticle, bookChapter, conference, dissertation; the other four types fall back to the citeproc default. The CSL styles themselves live in the external service — untraced.

---

## Backoffice card — publication

Layout: optional thumbnail | badge strip | title | meta line | contributors | departments | VABB strip | ID + timestamps | links row | actions column. All in `views/publication/summary/summary.templ` unless noted.

| Element | Rule | Audience | Source |
|---|---|---|---|
| Status badge | `public` → "Biblio public" (green), `returned` → "Biblio withdrawn" (red), `private` → "Biblio draft" (yellow). Other statuses render nothing. Text is hardcoded in the templ, not localised. | all | `views/badge_status.templ:3-20` |
| Locked badge | `Locked` flag; lock icon + "Locked", tooltip "Locked for editing". Locking is a curator-only action; locked collapses all edit affordances for non-curators. | all | `views/badge_locked.templ`, `repositories/permissions.go:83-85` |
| Type + classification | `"{type label}: {classification}"`; classification raw, no subtype. Since classification defaults to `U` and is required, this nearly always reads `Type: Code` — including `Dissertation: U`. | all | `summary.templ:76-82`, `models/publication.go:1220` |
| Access line | From `MainFile()`: the **most open file with `relation = main_file`**, in order openAccess > restrictedAccess > embargoedAccess > closedAccess. Non-main files (colophon, agreement…) ignored. Labels: "Public access - Open access", "UGent access - Local access", "Embargoed access", "Private access - Closed access". | all | `models/publication.go:199-209`, `vocabularies/map.go:175-180`, `summary.templ:83-116` |
| Embargo spans | Embargoed main file adds two extra spans: access during embargo and "{after-label} from {EmbargoDate}" (date printed raw as stored). | all | `summary.templ:99-116` |
| No main file | Editable → link "Add document type: full text"; read-only → "No document type"; `Extern` records → nothing. | by edit right | `summary.templ:117-134` |
| Thumbnail | Curator sessions only; generic `if-article` icon for every type. | curator | `summary.templ:53-66` |
| Title | "Untitled record" fallback. Linked **only for non-curators** who can view; curator sessions get plain text. (Code states no rationale.) | varies | `summary.templ:136-149` |
| Meta line | `SummaryParts()`: year, journal abbreviation (fallback full journal/book title), publisher, volume, (issue), pages — **identical for every type**; conference name, defence date/place never show. | all | `models/publication.go:237-301` |
| Contributors | `author` list, max **3**, then "N more author(s)". Skipped entirely for `book_editor`/`issue_editor` (replaced by the role chip); editors and supervisors are never listed. | all | `summary.templ:155-164`, `views/contributor/summary.templ:22-52` |
| UGent icon (crest) | Contributor has an internal person record (`Person != nil`); tooltip "UGent author". | all | `contributor/summary.templ:28` |
| ORCID icon | `Person.ORCID` set; external persons can never show it. | all | `contributor/summary.templ:31`, `models/contributor.go:65-70` |
| "Your role:" chip | Current user's contributor roles (author/supervisor/editor, comma-joined) or "registrar" when they merely created the record. Hidden from curator sessions. Matches by exact person ID — an alias ID can leave the chip empty while edit rights still work. | non-curator | `summary.templ:24-48`, `contributor/summary.templ:73-75` |
| Department badges | Raw organisation IDs (RE23, GE30…) as light badges, max 3 + "N more department(s)". Empty: "Add department" (editable) / "No department(s)". | all | `views/relatedorganization/summary.templ`, `summary.templ:176-197` |
| VABB | Full string "VABB: {id}, {type}, (not) approved, {years}" for curators; everyone else sees the bare word "VABB" with the detail in a tooltip. Gated on the account role (`CanCurate`), not the session role. | varies | `summary.templ:201-213`, `models/publication.go:211-233` |
| Legacy | `Legacy` flag → forbid icon + "Legacy". Legacy blocks editing for non-curators. | all | `summary.templ:214-219`, `permissions.go:80-82` |
| Related datasets | Count + database icon, tooltip "N related datasets". | all | `summary.templ:220-225` |
| Biblio message | `Message` set → info alert "Biblio message" with linkified text. Shown to everyone who sees the card. | all | `search_hit.templ:83-95` |
| Biblio ID | Copy button + code. Always. | all | `summary.templ:241-249` |
| Created / Edited | "Created {ts} by {name}." / "Edited {ts} by {name}." or "System update {ts}. Last edit by {name}." Curator names are masked as "a Biblio team member" for non-curators. | all | `views/record_timestamp.go:11-57` |
| Links row | View publication · Full texts & files · DOI · WoS · PubMed (each if identifier present) · Public Biblio Location (if `public`). **Curator sessions only.** | curator | `summary.templ:251-253`, `search_hit.templ:97-126` |
| Actions dropdown | View publication; Public Biblio Location (if public); curator: files/DOI/WoS/PubMed; non-curator: **Altmetric** (if DOI) — the one element users get that curators don't; Delete (if permitted: curators always, otherwise creator/proxy on `private` unlocked records). Plus a separate "View" button, always. | all, contents vary | `search_hit.templ:13-81`, `permissions.go:108-131` |

### Audiences the code distinguishes

Two orthogonal axes: the session role `c.UserRole` (`curator` / `user`, switchable — a curator can view as researcher, impersonation forces `user`) and repo permissions on the real account (`CanCurate`, `CanView*`, `CanEdit*`, `CanDelete*`, proxy checks). Distinct effective audiences: curator session; owner (view+edit); viewer without edit (locked / legacy / non-creator); proxy (renders as owner; proxy mode recolours page chrome but adds nothing to the card itself); curator-in-user-session (user layout but still sees full VABB and unmasked names); impersonated user.

### Dataset card differences

`views/dataset/summary/summary.templ`. No type/classification line, no VABB, no Legacy. Access from a single record-level `AccessLevel` field (labels "Open access" etc. — different strings from publications), no during-embargo span. Adds a **license** span (raw license string / "Licensed" / "Add license" / "No license"). Meta line inline: year, publisher, first identifier type + value (map iteration — non-deterministic which is "first"), first format. Contributor role label "creator"; role chip only "creator"/"registrar". Related-publications counter instead of datasets. Links: View dataset · external repository · Public Biblio Location. Thumbnail icon is also `if-article`, not a data icon.

### Candidate (suggestion) card

Separate component, `views/candidaterecord/summary.templ`. Status-driven: `new` → "Biblio suggestion via {source}" + Plato thumbnail + preview-modal title + details (SummaryParts, authors "supervised by" supervisors, "Suggested departments", untruncated); `imported` / `rejected` → dimmed, info line with countdown ("Reminder disappears in N day(s)", 365 days from status date), no details. Buttons for `new`: Reject duplicate + Preview + Import & complete — primary emphasis flips between Preview (curator) and Import & complete (researcher). No locked/VABB/ID/timestamps/links.

---

## Verified oddities (input for step 2)

Behaviour confirmed in code that a redesign should decide on rather than copy:

- Classification badge on the public card is limited to journal articles and conference papers; B/D/V codes are never shown anywhere public.
- Subtypes (review article, poster, preprint…) are invisible on every card, though the vocabulary exists.
- Public reference line drops pages when only a first page is known, and hides publisher/conference/ISBN entirely.
- Backoffice status wording conflates `returned` with "Biblio withdrawn".
- `Dissertation: U` — classification defaults to `U` ("undetermined") and is always rendered, so most non-article types display a meaningless code.
- Public "(UGent)" marker covers UZGent and GUK under the one label; backoffice uses a different signal (crest icon = internal person record) for a different concept.
- Truncation differs per surface: 10 authors public, 3 backoffice, 3 departments, none for candidate departments.
- Dataset "Public Biblio Location" links to `/publication/<id>` — consistent with the current public site, where datasets are `pub.type = researchData` served under `/publication/`; a redesign that gives datasets their own public URL breaks this link. Dataset thumbnail uses the article icon; `CanDeleteDataset` checks `Role == "admin"` directly instead of `CanCurate`; candidate `rejectedInfo` dereferences `StatusDate` without a nil check; department-badge link ignores `args.Target` (TODO in code).
- Backoffice `EmbargoDate` prints raw from storage, unformatted.
- Public `hide_badges`/`hide_links` template switches are dead — no caller sets them.
- Masking string inconsistency: "a Biblio team member" (timestamps) vs "a biblio team member" (candidate cards).

Untraced: the exact CSL citation styles (external citeproc service); any `text-transform` on the public card title/journal (uppercasing observed in screenshots sits in the stored data or minified CSS, not in the templates).
