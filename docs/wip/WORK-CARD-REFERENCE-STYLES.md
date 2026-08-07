# Work card reference styles

The line under the title on a work card. Two of them, one per surface: the public
line reads as a citation, the backoffice line as scannable metadata fields.

What the lines do today: `../analysis/WORK-CARD-CURRENT-STATE.md`.

---

## The public line

Composed per work type, keyed to raven's 23 types (`raven/docs/metadata-work-types.md`);
fields are raven's (`raven/docs/metadata-work-fields.md`).

The line opens with the year: authors, title and access are the card's other regions.
Dates render at the precision they carry — year-only stays the year.

The examples below are rendered output, not invented — see Sources. They show the
shape of each line; how raven produces it, and its exact punctuation, is the dev
team's call.

### Per-type lines

| Work type | Line composition | Example |
|---|---|---|
| `journal_article` | `(year) journal_title, volume(issue), pp. start–end.` — `article_number` in place of pages for e-only articles | `(2024) European Journal of Crime, Criminal Law and Criminal Justice, 32(1), pp. 58–79.` |
| `book` | `(year) edition edn. place_of_publication: publisher (series_title).` | `(2024) 2nd edn. Ghent: Academia Press.` |
| `edited_book` | as `book`; editors appear on the contributor line ("has editors, no authors") | `(2024) London: Routledge.` |
| `book_part` | `(year) in book_title. place_of_publication: publisher, pp. start–end.` — no host-book editors on the card | `(2024) in Handbook of Urban Ecology. London: Routledge, pp. 100–120.` |
| `book_review` | as `journal_article` — raven gives it the same venue and position fields | `(2025) Journal of Ecology Reviews, 12(2), pp. 301–303.` |
| `reference_entry` | `(year) container. place: publisher, pp. start–end.` — intended shape; **raven fields missing** ⚑ | `(2023) Encyclopedia of Plant Science. Amsterdam: Elsevier, pp. 455–460.` |
| `journal_issue` | `(year) journal_title, volume(issue).` — editors on the contributor line | `(2024) European Journal of Crime, Criminal Law and Criminal Justice, 32(1).` |
| `conference_paper` | `(year) proceedings_title. conference.name, conference.location, pp. start–end.` — no publisher field in raven | `(2024) Proceedings of the 12th IFToMM World Congress. IFToMM World Congress, Tokyo, pp. 1–8.` |
| `conference_abstract` | `(year) [proceedings_title.] conference.name, conference.location.` | `(2024) IFToMM World Congress, Tokyo.` |
| `conference_poster` | as `conference_abstract` | `(2024) IFToMM World Congress, Tokyo.` |
| `conference_presentation` | `(year) conference.name, conference.location.` | `(2024) IFToMM World Congress, Tokyo.` |
| `preprint` | `(year) publisher [Preprint].` — whether `publisher` holds the server name is raven's call ⚑ | `(2026) bioRxiv [Preprint].` |
| `working_paper` | `(year) place_of_publication: publisher (series_title).` | `(2025) Ghent: Ghent University Faculty of Economics.` |
| `report` | `(year) Report report_number. place_of_publication: publisher (series_title).` | `(2025) Report RPT-42. Brussels: Agentschap Natuur en Bos.` |
| `doctoral_thesis` | `(year) PhD thesis. awarding_institution.` — awarding institution, never the publisher field | `(2024) PhD thesis. Ghent University.` |
| `magazine_article` | `(year) magazine_title, day month, pp. start–end.` — pages as in old biblio; **raven field missing** ⚑ | `(2025) Eos Wetenschap, 14 June, pp. 22–27.` |
| `newspaper_article` | as `magazine_article` ⚑ | `(2025) De Standaard, 2 March, p. 7.` |
| `online_post` | `(year) publisher, day month.` — publisher holds the issuing publication (Substack, group blog) per raven's field note | `(2025) Open Access Belgium, 1 September.` |
| `media_appearance` | `(year) venue, day month.` | `(2025) Universiteit van Vlaanderen, 5 November.` |
| `lecture` | `(year) venue, day month.` — location sits inside `venue` per its field definition | `(2025) UGent Data Stewards seminar, Ghent, 20 October.` |
| `dataset` | `(year)` — bare, as on the old public site; publisher (Zenodo) shows in the backoffice scan only | `(2026)` |
| `software` | as `dataset`; version field is raven's question ⚑ | `(2026)` |
| `other` | generic fallback | `(2024)` |

### Generic fallback

`other`, and any future type before it is styled, render `(year)` plus whatever
styled fields they carry, in the order of the table. Today's uniform rule survives
here as the floor; the per-type rules are the upgrade.

### Decisions (M, 2026-07-30 unless noted)

- **E-only articles**: `article_number` renders where pages are absent.
- **Book reviews render like journal articles** — raven gives them the same venue
  and position fields.
- **Conference lines carry name and location.**
- **Host-book editors stay off chapter cards** — matches old biblio on both
  surfaces; editors are a detail-page concern.
- **Where old biblio showed a field raven lacks, the card keeps showing it**, with a
  note per case (⚑ below). Where old biblio showed nothing — the public dataset
  line — the card stays bare.
- **Preprint server-in-`publisher`** is raven's concern; the line renders whatever
  the field means.
- **Genre words stay** — "PhD thesis.", "Report RPT-42.", "[Preprint]" render even
  though the type badge names the type: each explains the field that follows it, and
  the line stays readable out of context. Year-only lines were considered and
  rejected.
- **Line parts stay linked** — year and container title remain clickable, as on the
  old public site.
- **Container and work titles render italic.** Review in the prototype.
- **No classification badge on the public card** — A1/A2 are evaluation vocabulary,
  and stay off the public surface.
- **Contributor line follows the old public rule** — up to 10 names then `et al.`,
  every name linked, UGent contributors with the `if-ghent-university` icon plus
  visually-hidden "(UGent)", identifier icons keeping the hover popover
  (`popover--sm popover--dark`, `elements/popovers.html`) with a visually-hidden
  fallback. As built in `patterns/work-card.html`.
- **`<cite>` on container titles** (M, 2026-08-06) — kept, with the caveat on
  record: WHATWG reserves the element for a work's own title, and a container is
  arguably not that, so this is accepted practice rather than spec-endorsed.

### ⚑ Remaining — raven gaps to raise

The prototype shows the intended shape with placeholder data and a note; the fields
are not in raven's registry:

- `reference_entry`: no container title (the encyclopedia), no publisher, no pages.
  Old biblio showed all three (as `misc`); the card keeps them.
- `magazine_article` / `newspaper_article`: no pages field. Old biblio showed pages;
  the card keeps them.
- `software`: no version field.
- Docs inconsistency: the migration map carries biblio dataset `Publisher` → raven
  `publisher`, but the imprint applies-to list omits `dataset`. The backoffice scan
  needs it.

---

## The backoffice line — metadata scan

Named "metadata scan" (M, 2026-08-06). Deliberately **not** a citation: curators
scan fields, readers cite. It is the current production format (`SummaryParts()`,
see `../analysis/WORK-CARD-CURRENT-STATE.md`), rekeyed to raven fields.

Separated meta items, each part only when present:

```
year · container · publisher · volume · (issue) · start–end
```

- **year** — the year part of `date`.
- **container** — per type: `journal_abbreviations[0]` falling back to
  `journal_title` (journal_article, book_review, journal_issue); `book_title`
  (book_part); `proceedings_title` (conference types); `magazine_title` /
  `newspaper_title` / `venue` for the public-engagement types. Abbreviation-first is
  the scan's signature.
- **publisher, volume, (issue), pages** — where the type carries them.

Type-agnostic by construction: any of the 23 types renders whatever it has, so a new
type needs no new rule.

**Quirks, decided** (M, 2026-08-06): a lone first page renders as `p. 58`, never
bare `58`; the abbreviation-to-full-title fallback stays, because a full name beats
nothing; dates are formatted like every other date on the card (dd/mm/yyyy), never
raw storage strings.

---

## Sources

- `harvard-cite-them-right.csl`, CSL styles repository, rendered 2026-07-30 via
  citeproc-js (en-US locale; the examples use en-GB's `edn`, not `ed.`). The
  examples are that output, trimmed to the card.
- `raven/docs/metadata-work-types.md` — the 23-type catalog and migration map.
- `raven/docs/metadata-work-fields.md` — field names, shapes, per-type applicability.
- `../analysis/WORK-CARD-CURRENT-STATE.md` — the production behaviour these lines
  replace or preserve.
