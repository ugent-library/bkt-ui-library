# Deposit flow

The deposit flow is the researcher-facing path for adding research output to Biblio. Its design goal is minimum friction: a researcher should be able to deposit a journal article in under two minutes if they have the DOI and the PDF.

The flow is linear. Steps are not tabs — the researcher moves forward through a sequence. Back-navigation is possible but not the primary pattern. Each step is a separate URL.

---

## Steps

### Step 1 — Describe (`deposit-1-0-find.html`, `deposit-1-1-find.html`)

The researcher describes their work. There are three entry paths:

1. **Identifier lookup (primary path)** — paste a DOI, PubMed ID, arXiv ID, ISBN, or handle. The server fetches metadata from the relevant source (Crossref, PubMed, etc.) and pre-fills the form. The researcher reviews and corrects. A confirmation notice ("Metadata prefilled from Crossref via DOI …") appears at the top of the form.
2. **File import (bridge path)** — upload a BibTeX (`.bib`), RIS (`.ris`), or Web of Science export (`.txt`). Used when the source isn't directly connected yet. Not a batch importer — it pre-fills one record.
3. **Manual entry** — fill in the form from scratch.

All three paths converge on the same form. The form fields are:

- **Work type** (required) — `bt-btn-check__group` radio buttons: Journal article, Book, Book chapter, Conference contribution, Dataset, Dissertation, Report, Software, Other
- **Title** (required) — text input with optional language select. Multiple titles supported via "Add title".
- **Abstract** — textarea, optional
- **Authors** — editable list. Each author row shows name, affiliation (UGent department or "External"), and a remove button. "Add author" triggers an HTMX swap loading `add-author-form.html`.
- **Keywords** — tag-style input
- **Projects** — linked project list with "Add project"
- **Research metadata** (collapsible, optional) — journal, publisher, year, publication date, ISSN, volume, issue, pages

Minimum viable deposit: work type + title. Everything else is optional at this step.

The two template variants represent two states of the same step:
- `deposit-1-0-find.html` — blank form, no pre-fill
- `deposit-1-1-find.html` — form with prefilled data and the "Does everything look right?" confirmation notice

The step indicator at the top shows four steps: Describe · Upload · Access & Rights · Review. Step 1 is active (filled avatar). Steps 2–4 are inactive (outlined avatar).

---

### Step 2 — Upload (`deposit-2-upload.html`)

The researcher uploads the full text or other files.

A persistent **work identity card** at the top of the content area keeps the researcher oriented throughout the remaining steps. It shows: work type badge, source badge (e.g. "Web of Science", only when imported), title, abbreviated author list, and year. An "Edit" link returns to Step 1.

The file drop zone accepts PDF, DOCX, and EPUB. Upload fires via HTMX (`hx-post="/deposit/upload"`) and populates `#file-list`. A previously uploaded file is shown as a read-only summary row above the drop zone, with a "Change" link.

The step indicator shows steps 1 (completed, dark) and 2 (active).

---

### Step 3 — Access & Rights (`deposit-3-access-rights.html`)

The researcher sets how their work can be accessed and used.

**Open access question** — a plain-language radio group ("Who can see your full text / dataset?"):
- **Open Access** — anyone can read and download immediately. Pre-selected by default.
- **Embargoed** — files become public after a date the researcher chooses. Metadata is visible immediately. Selecting this reveals a date input ("Release date"). The transition is automatic — no manual action needed after the embargo date.
- **Restricted** — only approved users can access the files. Metadata remains discoverable.

Links below the group: "Which version can I share?" and "UGent scholarly publishing policy".

**License** — a grid of `bt-btn-check` radio cards: CC BY 4.0, CC BY-SA 4.0, CC BY-NC 4.0, CC BY-NC-SA 4.0, CC0 1.0, MIT, Apache 2.0, All Rights Reserved.

The work identity card appears at the top of this step as well.

The embargo date field is conditionally shown by `assets/js/deposit.js` (the `embargo-date-field` div has `d-none` by default; the script toggles it on radio change and moves focus to the date input when shown).

---

### Step 4 — Review (`deposit-4-review.html`)

A lightweight confirmation step before submission.

This step should be intentionally brief. It is not a second detail page. It shows:

- the same work identity card used in steps 2 and 3
- a short confirmation alert explaining that submission sends the draft to the library review queue
- one compact summary block with title, authors, uploaded file, OA status, and license
- three small edit actions back to Step 1, Step 2, and Step 3

The action button at this step is "Submit", not "Next". Submitting moves the work from `draft` to `submitted` status and triggers the librarian review queue.

---

### After submit

Preferred behaviour: after a successful submit, redirect back to the dashboard and show an inline success alert there. This avoids making the researcher pass through an extra dead-end page before returning to their work overview.

---

## Stepper indicator

Each step page renders the four-step indicator in `u-main__header` as a `<ul>` of items. Each item contains a `bt-avatar bt-avatar--xsmall` and a label.

Avatar states:
- **Active step** — `bt-avatar--primary` (blue background)
- **Completed step** — `bt-bg-dark text-white` (dark background)
- **Future step** — `bt-bg-white bt-border` (white with border)

The stepper is inline HTML in each template header, not a separate component. If a reusable stepper partial becomes necessary, extract it and document the template params here.

---

## JavaScript

The deposit flow requires one JS file: `assets/js/deposit.js`.

Currently, the embargo date toggle logic lives as an inline `<script>` at the bottom of `deposit-3-access-rights.html`. It must be moved to `deposit.js` before implementation. See `docs/JAVASCRIPT.md`.

---

## Go templ params

All five templates share the same param set (documented in each template's comment header):

```
work_id        string
title          string
kind_label     string
year           int
authors        []Contributor    — {name, affiliation, linked bool}
files          []File
oa_status      string           — "open" | "embargo" | "closed"
embargo_date   string           — ISO date, only when oa_status = "embargo"
has_abstract   bool
```

---

## Known gaps

- **Dashboard success alert** should become a reusable pattern rather than one inline example in the dashboard template.
- **Work identity card** (steps 2–4) is duplicated across three templates. Extract as a partial when implementing in Go templ.
- **`add-author-form.html`** is the HTMX target for inline author addition in Step 1. Its interaction with the people-search widget is documented in `docs/PARTIALS.md`.
