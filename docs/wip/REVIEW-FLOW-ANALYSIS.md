# Review & curation flow — analysis

Home: `booktower-ui-library/docs/wip/REVIEW-FLOW-ANALYSIS.md`. The flow is
prototyped in booktower and implemented in raven after; raven gets a pointer
when the design is ready to cross over. Not a breadboard in the house sense
(`docs/BREADBOARD-TEMPLATE.md`); this analysis feeds a review-flow bet and
per-screen breadboards.

**Sources** (git dates this file):

- raven `main`: `deposit_status.go`, `revisions.go`, `grant.go`,
  `app/backoffice.go`, `docs/architecture-overview.md`,
  `docs/metadata-work-fields.md`.
- Design documents: the merged deletion plan
  (`raven/docs/plans/2026-08-26-record-deletion-design.md`; only `Delete` is
  implemented), booktower's `DOMAIN-VOCABULARY.md` and the candidates bet.

**Legend** — marks say where a claim's authority lives; "today" means the
checkouts as surveyed:

| Mark | Source of the claim |
|------|---------------------|
| `●` | Observed in raven `main` |
| `◐` | Written in a design document (deletion plan, domain vocabulary, candidates bet) |
| `○` | No source — the design must close it |
| `✚` | Decision of this analysis |

The design is built from this analysis; the design — not the analysis — goes
to raven. Marks freeze here as the baseline the design is checked against.

---

## 1. Mental model: one rail, one axis, one layer — and the side quests

The **deposit rail** (the only state machine) crossed with **record
visibility** (private or public, §6), the **communication layer** riding both,
and the **side quests** around them. All are independent facts about one work
— none implies another; a combination is legal unless a named gate refuses it
(the draft-is-private CHECK; the duplicate-cluster gates on Review and on
going public).

```
                            RECORD VISIBILITY
                  private                     public
 ┌───────────┬───────────────────────────┬─────────────────────────────┐
 │ draft     │ always — DB CHECK ●       │ impossible ●                │
 ├───────────┼───────────────────────────┼─────────────────────────────┤
 │ submitted │ the opt-out:              │ THE DEFAULT — submit        │
 │           │ "Submit privately" ◐      │ publishes unless opted      │
 │           │                           │ out (UGent policy) ◐        │
 ├───────────┼───────────────────────────┼─────────────────────────────┤
 │ returned  │ always — Return           │ does not exist: Return      │
 │           │ unpublishes ◐✚            │ composes                    │
 │           │                           │ SetVisibility(private) ✚    │
 ├───────────┼───────────────────────────┼─────────────────────────────┤
 │ reviewed  │ valid end state —         │ valid end state;            │
 │           │ confidential, on file ●   │ made_public_at stamps       │
 │           │                           │ once, ever ●                │
 └───────────┴───────────────────────────┴─────────────────────────────┘
  Review never moves visibility ●; where policy wants both, the UI
  composes two commands in one gesture (see Compound actions).
```

The engine keeps rail and visibility independent; UGent deposit policy (the
`◐` cells) composes them, and the backoffice badge collapses non-public to
"Private".

The communication layer (definitions in §5):

```
 blocking ask       ● Return + comment (required): yanks the record back
                      to the owner and makes it private again ◐✚
 non-blocking ask   ✚ Request changes: curator names fields + message;
                      the owner gets a scoped view; state and visibility
                      stay put — works on submitted AND reviewed records
 the owner's ask    ✚ the owner edits directly — no gates before review,
                      re-review after (no-locking decision, §5); ◐ change
                      request remains for works the owner cannot edit
 messages           every message rides an action ◐; migrated old-biblio
                      messages arrive action-less, so standing storage is
                      needed ✚; whether NEW action-free messages may be
                      written is open ○
```

The side quests — not review states; each holds one fact the biblio-team
discussion cannot lose (details in §6):

```
 RETRACTION ◐     is NOT invisibility. A retracted work stays active AND
                  public: a metadata field drives the banner and the link
                  to the retraction notice. Closing the file is a
                  separate, per-case call.
 DELETION ●◐      its own axis: Delete hides the record everywhere,
                  Restore brings it back exactly; deletion never touches
                  visibility or deposit status. Two curator intents hide
                  behind "delete this": unwanted-in-biblio is a Delete;
                  a DUPLICATE is a Merge — Merge moves sources, keys,
                  notes and links onto the survivor and writes the
                  redirect a once-public record owes; a bare Delete loses
                  all of that. The UI steers the duplicate case to
                  Consolidate.
 TOMBSTONES ●◐    a once-public record never 404s: a merge leaves a
                  replaced_by redirect ●, a purge leaves a scrubbed
                  stub ◐ — the id keeps resolving, forever.
 RESTRICTED ●     a record-level value with no reader: every surface asks
                  public-or-not. Decision: the record axis is
                  private/public; restricted stays a file value (§6).
 CLASSIFICATION ● fields, not a state — but curator territory: protected
                  schemes are curator-only (read-only for owners,
                  re-asserted server-side); the shared form carries
                  per-field permissions, and classifying is part of what
                  curation does during review.
 FILE ACCESS ●    out of the review model; enters only as the source of
                  the derived access state (§6) and through the
                  policy-risk rule (§5).
```

Naming: file access level, derived access state and record visibility all
spell values from one `Visibility` enum, and the metadata docs call record
visibility "Access". Every screen must say which level it shows — *visibility*
for the record, *access level* for the file, *access state* for the derived
answer. Filed as a raven issue.

### Compound actions: one gesture, several axes

The UI composes two engine commands in one transaction; the model never gains
a combined state.

```
  USER INTENT                        =  AXIS MOVES (one transaction)
  ─────────────────────────────────────────────────────────────────────
● "approve and make public"          =  Review + SetVisibility(public)
                                        (built — the precedent)
◐ "Submit publicly (default) /       =  Submit + SetVisibility
   Submit privately"                    (decided in the vocabulary and
                                         candidates bet; raven mechanism
                                         open — visibility can only move
                                         after leaving draft)
◐✚ "return"                          =  Return + SetVisibility(private)
                                        (a returned work is always
                                         private again)
○ "retract"                          =  set retraction field + (per case)
                                        close the FILE
○ "withdraw"                         =  Delete with reason `withdrawn`
```

---

## 2. Entry: how works come into existence

```
   HARVESTER                  RESEARCHER / PROXY              CURATOR
 (WoS, Crossref,                     │                           │
  DataCite, …)                       v                           v
      │                     ┌────────────────┐         ┌──────────────────┐
      │                     │  NEW WORK FORM │         │  MANUAL IMPORT   │
      │                     │  ● create      │         │  ● paste DOI /   │
      │                     └───────┬────────┘         │    upload file   │
      v                             │                  └────────┬─────────┘
 ● becomes a system-owned           │        drafts owned by actor, or by the
   DRAFT in the catalog             │        proxied user in proxy mode ●
   (curators edit it via            │                           │
   edit_draft:system)               v                           v
      │                   ┌─────────────────────────────────────────────┐
      │                   │                   DRAFT                     │
      └──────────────────>│  · born "forked" when human-created ●       │
                          │  · unforked when harvested ● — source feeds │
                          │    keep updating it until the first human   │
                          │    edit stamps forked_at (one-way)          │
                          └─────────────────────────────────────────────┘
```

A **Candidate** `◐` is a private, system-owned Work matched to a researcher
through their linked person identity — "Found for you" on the dashboard, with
review rounds and Submit / Skip / Reject-my-match (§5). "Added for you"
covers direct additions (Plato, curator-added). Phase 1A surfaces direct
additions; 1B needs a first candidate feed.

---

## 3. The deposit rail (the state machine)

Every transition into a non-draft state runs full completeness validation and
carries a revision match — a concurrent edit surfaces as a conflict, nothing
is silently overwritten.

```
                        Submit ●
             (validates; refused if incomplete)
   ┌─────────┐ ──────────────────────────────────> ┌───────────┐
   │  DRAFT  │                                     │ SUBMITTED │
   │ always  │                                     │           │
   │ private │                                     └──┬─────┬──┘
   │ (CHECK) │                                        │     │
   └────┬────┘                               Return ● │     │ Review ●
        │                                   (comment  │     │ (validates again;
        │ Delete draft ●                    REQUIRED) │     │  blocked by open
        x (owner; only from draft)                    │     │  duplicate cluster)
                                                      v     v
                                            ┌──────────┐  ┌──────────────────┐
                        Submit ●            │ RETURNED │  │     REVIEWED     │
              ┌─────────────────────────────│ owner    │  │ reviewed_at ●    │
              │  (re-validate, round 2…)    │ edits;   │  │ terminal in      │
              v                             │ comment  │  │ main ●;          │
          SUBMITTED                         │ in a     │  │ ✚ re-approval    │
                                            │ banner ● │  │   after owner    │
                                            └──────────┘  │   edits (§5)     │
                                                          └──────────────────┘
```

Three paths beside the happy one:

```
CURATOR SHORTCUT ●          A curator may Review a work straight from DRAFT —
                            no Submit step. Built for harvested system-owned
draft ──── Review ──────>   drafts; the researcher is never involved.
                 reviewed

SAVE + TRANSITION ●         The edit form posts ONE action (save / submit /
                            return / review): field changes, file changes and
one form post =             the transition commit or roll back together. On
one transaction             validation failure the form re-renders with the
                            user's edits and staged uploads intact.

REQUEST LOOP ✚              A curator asks for changes WITHOUT moving the
                            record: request names fields + message → owner
submitted ──┐               gets a view focused on those fields (full form
reviewed  ──┤ no state      one click away) → reviewer settles the delta:
            │ change        accept / adapt / reject, and closes the request.
            └─> owner edits   The non-blocking sibling of Return (§5).
```

Audit: every transition writes an event with actor and optional comment —
`deposit_submitted`, `deposit_returned` (comment required, shown to the
depositor), `deposit_reviewed` (stamps `reviewed_at`) `●`. The design needs
the rounds readable per work as a history, and the fields as they stood at
each round (§7).

---

## 4. Places — curator side

```
PLACE: QUEUES
─────────────
● backoffice search, filterable on deposit_status
✚ dedicated queues, one command per button:
    Submitted        [Approve] [Return + comment] [Request changes]
    Re-review        works edited after approval — [Approve] (sees diff)
    Candidates ◐     [Adopt into researcher's works] — feed-dependent
    Duplicates       [Consolidate] (opens survivor prefilled)
    Requests         open requests and their deltas — accept/adapt/reject
✚ bulk: same command per selected row, one transaction each — one refusal
    leaves the others done (partial-success UI needed, §9)

PLACE: WORK SHOW / REVIEW PANEL
───────────────────────────────
● metadata display                        ● internal notes (curator-only)
● workflow buttons rendered exactly       ● files with access level + embargo
  when the handler would accept them      ● [Change subtype] (with preview)
● [Return + comment] [Review]             ● [Reject source]
● [Set visibility] (blocked → public      ● [Merge] — see tombstones, §6
  while a duplicate cluster is open)      ✚ [Request changes] — name fields
● [Delete]                                  + message; [Close request]
✚ rounds history: one comment per         ✚ delta view: what changed since
  transition, both directions               the return / the approval
```

## 5. Places — researcher / proxy side

```
PLACE: MY WORKS / DASHBOARD
───────────────────────────
● list of own works with status        ○ no "action needed" inbox — returns
● proxy sees the proxied user's works    and requests announce themselves
  (grants re-target "own"; role          only when the work is opened
  never elevates)                      ◐ "Found for you": candidate rounds —
◐ "Added for you": Plato imports and     Review / Submit publicly (default) /
  curator-added works; "Not yours?"      Submit privately / Save draft /
  opens a helpdesk mail                  Skip / Reject-my-match

PLACE: WORK FORM
────────────────
● edit fields; upload files with       ● protected classification schemes
  per-file access level + embargo        render read-only
● [Save] [Submit for review]           ● returned: curator's comment in a
● [Delete] (draft only)                  banner; [Submit] re-validates
◐ policy-risk rule: an unanswerable access/licence/embargo question records
  the uncertainty, applies the safest configured state, and CREATES A REVIEW
  REQUEST — a second deposit→review entrance beside Submit (fallback state:
  open Open Science Policy decision)

PLACE: SUBMITTED / REVIEWED WORK
────────────────────────────────
● read-only for the owner in main — the de facto lock the no-locking
  decision removes
✚ the owner edits freely: no gates before review; after review the edit
  enters the re-review queue
✚ incoming Request changes: a view focused on the requested fields, the
  full form one click away
◐ change request ("a requested change", vocabulary) for works the owner
  cannot edit — shape and outcome notification open ○
```

### The communication layer

**Decision: no locking.** The old backoffice let reviewers lock and unlock a
record; locking is removed — a researcher can always fix their work:

```
 not yet reviewed     the owner edits freely — no gates. Review approves
 (draft, submitted,   whatever stands when the reviewer acts; a concurrent
 returned)            edit surfaces as a version conflict.

 reviewed             both paths stay open:
                      · the owner edits on their own — the work enters the
                        re-review queue; the approved version survives
                        untouched until re-approval
                      · a reviewer asks — the request names fields and
                        carries a message; the owner gets a view scoped to
                        those fields, full form one click away. The
                        reviewer settles the delta: accept (re-approve),
                        adapt (edit, then approve), or reject (restore the
                        changed fields to their approved values — a comment
                        is encouraged; require vs encourage is under
                        discussion, §8).
```

Consequences. The request is focus and tracking, not permission — the raven
ask is two grant rows, `edit_submitted:own` and `edit_reviewed:own`
(curator-only in `main` `●`). Return remains the blocking queue signal.
Reject needs field history from the engine (§7). The change request shrinks
to works the owner cannot edit. Mid-review edits make the conflict screen a
daily path, not an edge case. And — known and accepted — with the publish
default, an unreviewed public record can change live before a curator sees
it.

**Messages ride actions** `◐`: there is no standing message and no thread;
the internal note is the only standing text, and it is curator-only. A message
is never required of the researcher — an edit, a resubmit or a response to a
request may carry one, optionally `✚`. Reviewer comments on Return and
reject: `main` requires one on Return `●`; this design prefers encouraging
over blocking `✚` — a reviewer should never be stopped by an empty comment
box. Expected to draw push-back; logged as a discussion, not a decision (§8).
So a missing conversation is a missing *action*:

| Ask | Carrier |
|---|---|
| Curator → researcher, non-blocking | `✚` Request changes (above) |
| Curator → researcher, blocking | `●` Return + required comment |
| Researcher → curator, on own work | `✚` edit directly (no locking) |
| Researcher → curator, on works they cannot edit | `◐` change request — shape open `○` |
| Researcher → curator, free message | `○` none; today's escape is a helpdesk mail |
| "That harvested work is mine" | `○` no claim flow; nearest: person-link auto-match `●` |
| "Withdraw my work" | `○` in-app; withdrawal = curator Delete with reason `◐` |
| External takedown demand | `◐` Delete with reason `takedown` |
| Curator ↔ curator | `●` internal notes |

**Migration.** Old biblio carries standing messages attached to no action.
`Message` is currently *not imported* (`metadata-work-fields.md`, "What's out
of scope") — the text dies at migration; `ReviewerNote` survives into
curator-only notes; `AdditionalInfo` survives as work metadata. Decision `✚`:
standing storage for migrated messages must exist, so the catalog's silent
drop of `Message` needs reversing or an explicit re-decision. Whether *new*
action-free messages can be written on top of that storage is open `○`.

---

## 6. The axes in detail

### Record visibility

**Decision: two-valued — private / public.** No read surface ever
distinguished `restricted` (every check is `== public`), the badge already
collapsed it, and its one documented use — the embargoed external deposit —
is written but never read. Restricted stays a file value. Consequences: the
embargoed external deposit needs its own carrier (the vocabulary lists
external access + embargo as a mapping still to land), and dropping the value
is engine work, tracked with the naming issue. Reopening `restricted` needs
what it never had: a reader.

```
 private <────────────────────────────> public

 ● first arrival at public stamps made_public_at — the point of no return
   for deletion semantics (below)
 ● gates on the way to public: draft (CHECK) and an open duplicate cluster
 ◐ policy: submit publishes by default; review is not a precondition for
   public
```

### Deletion & tombstones

```
                Delete ●                Purge ◐
   ACTIVE ────────────────> DELETED ──────────────> PURGED
      ^                       │                   (content scrubbed, stub
      │      Restore ◐        │                    remains, id resolves:
      └───────────────────────┘                    410 + tombstone page)
   never-public trash: housekeeping job purges after retention ◐

   REDIRECT TOMBSTONE (via Merge ●):
   merge X into Y — X never public: hard-deleted, no tombstone owed ●
                    X once public: soft-deleted + replaced_by → Y,
                    permalink 302s ●; redirects stay one hop
```

Deletion is its own axis: restore brings back the exact prior state; reasons
(withdrawn / takedown) are labels driving tombstone wording and audit,
nothing else; raven deletes content, never identity `◐`. Duplicates are a
Merge, never a Delete — see the side quests panel.

### Retraction

Not a state anywhere. A retracted work stays active and public; a metadata
field drives the banner and the link to the retraction notice `◐`. Whether
the file stays open is a per-case call on the file axis.

### File access level (pointer only)

Out of the flow design. What the flow needs to know: review and return never
touch file access; lifting an embargo never signals "changed since approval"
`◐`; the files are the sole input to the derived access state.

### Derived access state (computed, not stored)

The record's outward "open access" answer. No field, no editor — it follows
from the files: public full-text file or external full-text link → open;
scheduled public lift → embargo; restricted full text → restricted; else
none (`Work.Access()` `●`). It feeds the `open_access` trait and the COAR
access right in the OpenAIRE format, where a second derivation with diverging
rules lives `●`. Cards' "Open access / Restricted" is this level, never
record visibility. One derivation should survive; filed with the naming
issue.

---

## 7. Asks from raven

What this design needs from the engine, stated as needs — how each is met is
raven's call.

| Need | raven `main` today |
|---|---|
| Owners edit their own work in every state (`edit_submitted:own`, `edit_reviewed:own`) | curator-only past draft and returned |
| An approved-version snapshot, and reading the fields as they stood at it | absent — the projection is current-only |
| Re-approval after edits | `reviewed` is terminal |
| A "changed since approval" read for the re-review queue | absent |
| A request entity: named fields, a message, open/closed, closed by the reviewer | absent |
| Reject: restore the changed fields to their approved values, with a comment | impossible — no field history |
| Standing storage for messages (migrated `Message` texts arrive attached to no action) | `Message` is dropped by the migration field catalog |
| Notifications to users on transitions and requests | job-outcome tray only |
| Submit-publishes compound and an owner-side publish grant | no visibility capability exists in the grant matrix |
| A carrier for the embargoed external deposit | record-level `restricted`: written, never read |
| Per-researcher candidate status (New / Skipped / Added / Rejected) | absent |
| Change request on works the owner cannot edit | absent |
| Curator queues as first-class reads | search filter on deposit_status only |

## 8. Shaky grounds

Claims this design builds on that no accepted document backs.

| Claim | Why shaky | Who firms it |
|---|---|---|
| The re-review stack (approved snapshot, re-approval, changed-since-approval) | no accepted design provides it; `main` cannot reconstruct approved fields | raven team — commit to a mechanism |
| Submit publishes by default; Return unpublishes | lives only in booktower's domain vocabulary | biblio team + Open Science Policy |
| Policy-risk fallback state | explicitly open in the vocabulary | Open Science Policy |
| Candidate feed | none exists (WoS is a manual upload; no Crossref/ORCID feed) — phase 1B is blocked on it | raven roadmap |
| Reject = per-field restore to approved values | this analysis's interpretation of "reject, adapt, accept" | the team |
| Reviewer comments: encourage, not require | `main` requires one on Return; this design would drop the hard requirement so a reviewer is never blocked by an empty comment box — expected to draw push-back | team discussion |
| Old biblio `Message` direction | the migration doc says depositor→curator; the vocabulary says curator→researcher — the sources disagree | team memory, or old biblio's data |
| Review is centrally organized | never asked out loud; the grant matrix has no org scoping, so faculty-scoped review is impossible today | biblio team |
| Volumes (queue sizes, rounds per work, curator count) | assumed, never measured | one query on old biblio's database |

## 9. Gaps — no design yet (`○`)

1. **Notifications.** Who hears what, on which channel — returns, requests,
   outcomes. Only a job-outcome tray exists.
2. **"Action needed" surface.** Returns and requests announce themselves only
   when the work is opened; the request loop is this surface's first tenant.
3. **Claim flow.** "That harvested work is mine" has no path.
4. **Self-service withdrawal.** Deleting past draft is a curator act; the
   researcher-side ask is undesigned.
5. **Conflict UX.** The refusal screen when two writers collide — a daily
   path under no-locking, not an edge case.
6. **Partial-success bulk UI.** "7 approved, 2 refused, here's why."
7. **Proxy management.** No researcher-facing "my proxies" or deposit-as
   picker.
8. **Downstream timing.** Which surfaces read current vs approved fields
   (public page, ORCID push, funder exports) — it defines what "approved"
   promises.
9. **Reviewer coordination.** No assignment, claiming, or "being reviewed by"
   signal anywhere; two curators on one submission meet only the late
   conflict.
10. **Proxy message routing.** Proxy deposited: who receives the return, the
    request, the outcome — researcher, proxy, or both.
