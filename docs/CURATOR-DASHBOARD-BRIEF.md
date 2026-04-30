# Curator dashboard — design brief

Working document · Booktower · Ghent University Library · April 2026

For product context, see `PRODUCT.md` (Dashboards section).
For role and field responsibilities, see `RESPONSIBILITY.md`.
For strategic context, see `STRATEGY.md`.

---

## The problem

Curators currently use the filter-first search list as their working surface. That
works. The problem is that every session starts with rebuilding context: apply scope,
select saved view, scan for what matters. There is no surface that front-loads the
most important signals before a curator has to go looking.

The current list-as-dashboard is also built around metadata — records that don't have
a classification. That is the wrong starting point. It depends on bibliography state,
not on what a curator actually needs to do today.

The curator dashboard is not a replacement for the search list. It is a triage layer
that sits in front of it.

---

## Who this is for

A **curator** in the Biblio responsibility model:

- Expert validator on high-stakes fields (OA compliance, VABB, author links, project links)
- Policy enforcer: ensures records meet funder and institutional requirements before they
  create reporting or legal problems
- Identity resolver: confirms UGent affiliation links, disambiguates authors
- Final authority: can override any field; every change is recorded in field history

Curators are not homogeneous. A single dashboard template must serve:

- A faculty-level bibliographer curating ~500 records/year for one department
- A central Biblio librarian processing 17,100 records/year across the institution
- A specialist handling VABB compliance or FWO attribution review

**What makes the design hold across these:** scope. The dashboard reflects the
curator's configured scope (one or more faculties/departments, optional type filter).
It does not try to show the institution in aggregate unless the curator's scope is
institution-wide. The scope selector is the personalisation mechanism — not
show/hide sections.

---

## Primary question this dashboard answers

> "What is in my queue, and what is at risk — within my scope?"

Secondary: "What has changed since I was last here?"

The dashboard does not answer: "How is the repository doing overall?" That is a
reporting surface (Power BI / equivalent), not a curation surface.

---

## What curators do — tasks this dashboard must support

From RESPONSIBILITY.md and curator input (April 2026):

**Regular tasks (daily/weekly)**
- Review submitted works: validate high-stakes fields, mark as reviewed, or return
  with a reason
- Fix incomplete records: missing author links, project links, OA status,
  embargo dates, file version
- Resolve flagged duplicates before they propagate to reporting

**Deadline-driven tasks**
- FWO attribution: project-linked works must be complete before grant reporting
- VABB classification: classification cycle has fixed deadlines
- OA mandates: embargo lifts, funder OA compliance windows

**Editorial tasks**
- Accept or reject harvested candidates (WoS, ORCID) within scope
- Respond to researcher questions / review returned works
- Coordinate with other curators on shared output (multi-department works)

---

## What belongs on the dashboard

Everything here is **derived automatically from record state and scope**. The dashboard
must not require manual curation to stay useful. If a section requires a curator to
update it, it will be ignored.

### 1. Review queue
**Primary job.** Works with `status=submitted` within the curator's scope, not yet reviewed.

- Default sort: nearest deadline first; fall back to oldest submitted (FIFO)
- Show: title, work type, submitter name/type (researcher / proxy / automated import),
  submission date, risk tier (from RESPONSIBILITY.md: Fast Pass / Standard / Deep)
- Show source of record: who or what created it (researcher, proxy, WoS harvest, ORCID)
  — proxy-submitted OA/version/access decisions are flagged per RESPONSIBILITY.md
- Action: open record for review; mark as reviewed (without editing); return with reason
- Count in sidebar badge must match this queue count exactly

**Sort logic:** if any record in the queue has a deadline flag within 30 days, sort
those first. Otherwise oldest submitted first. Curators can override sort.

### 2. At risk / flagged
Works already public or in the queue that have a problem requiring attention.

Sources of flags:
- System-generated: approaching deadline (VABB, FWO, OA mandate), missing required
  field for compliance, duplicate detected, embargo lifting soon, file version mismatch
- Curator-set: manual flag with free-text reason (for escalation, coordination,
  follow-up after researcher contact)

Show: grouped by flag type. Each item: title, flag reason, deadline if applicable,
quick link to record.

Do not conflate with the review queue. "At risk" records may already be public.

### 3. Candidate inbox
Count and preview of unreviewed harvested candidates within scope.

This is a triage entry point, not a full review surface. Show count + the three
most recent candidates. Link to the full candidate review queue.

Note: trusted imports (source definition still open — see RESPONSIBILITY.md) may
create records without curator initiation. The candidate inbox covers probabilistic
matches requiring a human decision.

### 4. Answers / resubmissions
Works returned to a researcher that have since been resubmitted. The curator
returned them; the researcher responded. These deserve a dedicated section because
they are time-sensitive: a researcher acted on curator feedback and is now waiting.

Show: title, original return reason, date resubmitted. Action: open for review.

### 5. Scope activity
Recent changes within the curator's scope — published, returned, imported, edited —
as an audit feed. Not a to-do list. Informational.

Show: last 5–10 events, each with actor, action, and record link.
This is the "what happened since I was last here" answer.

### 6. Stats (deferred — not in v1)
OA percentage within scope, records reviewed this week, pipeline health.
These belong in a separate reporting view, not the dashboard. Include only if
they can be shown without any additional backend cost and without cluttering
the action-oriented sections above.

---

## What does not belong on the dashboard

- Individual researcher-level notifications (that is the researcher's dashboard)
- UI for editing records (link through to the detail page; edit inline only if a
  single field can be fixed without context)
- Bulk editing tools (that is the search list with filters applied)
- Stats that require a separate query or a reporting pipeline
- Anything that requires a curator to maintain it manually

---

## Relationship to other surfaces

| Surface | Role | Relationship |
|---------|------|-------------|
| Dashboard | Triage: what needs attention today | Entry point; links into search with filters pre-applied |
| Filter-first search | Work surface: act on individual records | Launched from dashboard with scope/filter pre-loaded |
| Candidate review queue | Full inbox for harvested records | Linked from dashboard candidate count |
| Work detail page | Edit, return, resolve a single record | Destination from dashboard and search |
| Settings > Scope | Configure which orgs and types the dashboard reflects | Persistent; affects both dashboard and search defaults |

The dashboard and the search list are **alongside each other**, not interchangeable.
A curator who prefers to work from the list should not be forced through the dashboard.
The dashboard should be the better starting point but not the only one.

---

## Scope and personalisation

The dashboard inherits the curator's configured scope (see PRODUCT.md — Scope section).

- Scope is set in Settings > Work scope: one or more faculties/departments + optional type filter
- The dashboard header shows the active scope — not buried
- Changing scope changes the entire dashboard view
- A curator with institution-wide scope sees institution-wide counts

Scope is not a filter (session-level). It is a persistent default.

Not all curators have the same scope. The dashboard must not assume a single org.

---

## Sort order logic

Default sort for the review queue:

1. Records with a deadline flag within **30 days** — sorted by deadline date, nearest first
2. All other records — sorted by submission date, oldest first (FIFO)

Curators can override to: newest first, risk tier descending.

This logic means a quiet day defaults to fairness (FIFO). A deadline period automatically
surfaces urgency without the curator having to filter.

---

## Risk tiers (from RESPONSIBILITY.md)

The review queue and at-risk section surface the risk tier assigned at submission time.

| Tier | Label | Conditions |
|------|-------|-----------|
| 1 | Fast Pass | Clean import, no funding ambiguity, no duplicate flag, no file issue |
| 2 | Standard | Grant confirmation needed, affiliation mismatch, duplicate warning, missing link |
| 3 | Deep curation | VABB-sensitive, FWO attribution critical, books/chapters, embargo complexity |

Tier 3 items should be visually distinct — not just a badge. They require expert
handling and should not be buried in a long queue.

---

## Register and tone

The researcher dashboard has personality: "Inbox", "All caught up", "Added on your behalf."
The curator dashboard is an operational tool used by professionals all day.

**Register:** direct, functional, no hand-holding. Labels describe the task, not the
experience. "Review queue" not "Things to do". "At risk" not "Needs attention". "Returned"
not "Waiting for you".

This does not mean ugly. The information hierarchy should be clear, the visual weight
should match urgency, and the layout should not make someone want to print a spreadsheet.

---

## Prototype scope

**Template to build:** `templates/biblio-backoffice/team-dashboard.html.html`

**States to cover:**
- Filled: queue has items, at-risk has items, candidates pending
- Deadline pressure: one or more Tier-3 / deadline-flagged items in queue
- Empty: queue is clear, nothing flagged (rare but real; must not look broken)

**Sidebar:** new `bt-sidebar` variant for curator navigation. Does not exist yet.
Curator sidebar links (proposed):

| Link | Badge | Notes |
|------|-------|-------|
| Dashboard | — | Active on this page |
| Review queue | Count of submitted | Same count as dashboard section |
| Candidates | Count of unreviewed | |
| At risk | Count of flagged | |
| All research output | — | Opens filter-first search with scope applied |
| Settings | — | Scope configuration |

**Components available to reuse from existing templates:**
- `bt-work-card` structure (stripped for density — curator list card is not identical
  to researcher card)
- `bt-toolbar` for section headers with count badges
- Alert variants (`alert-danger`, `alert--dashed`) for deadline and empty states
- Activity feed list pattern from `dashboard.html`
- `u-layout--app` shell

**Components that may need to be added to SCSS:**
- Risk tier badge (Tier 3 visual treatment beyond a badge)
- Scope indicator in dashboard header (currently Bootstrap utilities only)
- Section header with count + link pattern if different from `bt-toolbar`

---

## Open questions

- **Trusted import definition:** when a WoS harvest creates a record without researcher
  initiation, does it land in the review queue or the candidate inbox? Decision in
  RESPONSIBILITY.md is still open.
- **Curator-owned fields — complete list:** VABB, pagination, short journal title confirmed.
  Full list still pending from curator team. Affects what "at risk" flags fire.
- **Proxy-submitted flags:** RESPONSIBILITY.md says OA/version/access set by proxy
  should be flagged visibly in the curator queue. How prominent? Badge on the card
  vs. dedicated filter vs. separate section?
- **Multi-department coordination:** when the same output is being entered by two
  departments, does it surface here? No current mechanism.
- **"Done" definition:** a curator's day is done when — what exactly? Queue empty?
  No Tier-3 items unresolved? No deadline items within 14 days? Needs to be defined
  before we can design an "all clear" empty state that means something.

---

## Version history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | April 2026 | Initial brief, synthesised from session notes, RESPONSIBILITY.md, PRODUCT.md, STRATEGY.md |
