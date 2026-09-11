# Review & curation flow — analysis

Home: `booktower-ui-library/docs/wip/REVIEW-FLOW-ANALYSIS.md`. Booktower
prototypes the flow; raven implements it after. Raven gets a pointer when the
design is ready to cross over. This analysis feeds high-level flow
wireframes (who does what — every assumption visualised for discussion), a
review-flow bet, and per-screen breadboards; it is not itself a breadboard
in the house sense (`docs/BREADBOARD-TEMPLATE.md`).

**Sources** (git dates this file):

- raven `main`: `deposit_status.go`, `revisions.go`, `grant.go`,
  `app/backoffice.go`, `docs/architecture-overview.md`,
  `docs/metadata-work-fields.md`.
- old biblio (`biblio-backoffice` main): `views/*/edit_message.templ`,
  `views/dataset/message_body.templ`,
  `cypress/e2e/*/edit/biblio-messages.cy.ts`.
- Design documents: the merged deletion plan
  (`raven/docs/plans/2026-08-26-record-deletion-design.md`; only `Delete` is
  implemented), booktower's `DOMAIN-VOCABULARY.md` and the candidates bet.

**Legend** — marks say where a claim's authority lives; "today" means the
checkouts as surveyed:

| Mark | Source of the claim |
|------|---------------------|
| `●` | Observed in a surveyed checkout: raven `main`, or old biblio where said |
| `◐` | Written in a design document (deletion plan, domain vocabulary, candidates bet) |
| `○` | No source — the design must close it |
| `✚` | Decision of this analysis |

We build the design from this analysis; the design — not the analysis — goes
to raven. The marks freeze here as the baseline for checking the design.

---

## 1. Mental model: one rail, one axis, one layer — and the side quests

The model crosses the **deposit rail** (the only state machine) with **record
visibility** (private or public, §6); the **communication layer** rides both,
and the **side quests** sit around them. All are independent facts about one
work — none implies another, and any combination is legal unless a named gate
refuses it (the draft-is-private CHECK; the duplicate-cluster gates on Review
and on going public).

```
                            RECORD VISIBILITY
                  private                     public
 ┌───────────┬───────────────────────────┬─────────────────────────────┐
 │ draft     │ always — DB CHECK ●       │ impossible ●                │
 ├───────────┼───────────────────────────┼─────────────────────────────┤
 │ submitted │ the opt-out:              │ THE DEFAULT — submit        │
 │           │ "Submit privately" ◐✚     │ publishes unless opted      │
 │           │                           │ out (UGent policy) ◐✚       │
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

| Channel | Who acts | What happens |
|---|---|---|
| Return | curator | Blocking. The comment is required `●`; the record goes back to the owner and turns private again `◐✚`. |
| Request changes | curator | Non-blocking `✚`. The curator names fields and adds one message; the owner gets a view scoped to those fields; deposit status and visibility stay put. Works on submitted and reviewed records. |
| Direct edit | the owner — the researcher the work belongs to, or a proxy acting for them | Never an ask `✚`. The owner edits in every state; an edit after approval enters the re-review queue (no-locking decision, §5). |
| Suggest a change | a researcher or proxy without edit rights on that work or field | Becomes a pending request `◐`; a curator accepts it, declines it or asks for clarification. Raven model open `○`. |
| Messages | any actor | Every message rides an action `◐`. Migrated old-biblio messages arrive action-less, so standing storage is needed `✚`; whether new action-free messages may be written is open `○`. |

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
                  schemes belong to curators; owners see them read-only
                  and the server re-asserts their current values on every
                  save. The shared form carries per-field permissions,
                  and curation classifies during review.
 FILE ACCESS ●    stays out of the review model; it enters only as the
                  source of the derived access state (§6) and through
                  the policy-risk rule (§5).
```

Naming: file access level, derived access state and record visibility all
spell values from one `Visibility` enum, and the metadata docs call record
visibility "Access". Every screen must say which level it shows — *visibility*
for the record, *access level* for the file, *access state* for the derived
answer. We filed the naming bug as a raven issue.

### Compound actions: one gesture, several axes

The UI composes two engine commands in one transaction; the model keeps one
state per axis.

```
  USER INTENT                        =  AXIS MOVES (one transaction)
  ─────────────────────────────────────────────────────────────────────
● "approve and make public"          =  Review + SetVisibility(public)
                                        (built — the precedent)
◐✚ "Submit publicly (default) /      =  Submit + SetVisibility
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

Provenance stays visible wherever a work appears `✚`: harvested (and from
which source `●`) or deposited (and by whom).

---

## 3. The deposit rail (the state machine)

Every transition into a non-draft state runs full completeness validation and
carries a revision match — a concurrent edit surfaces as a conflict instead
of a silent overwrite.

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
CURATOR COMPLETION ●✚       Main lets a curator review a draft directly,
                            skipping Submit — harvest needs this because
                            harvested works land as system-owned drafts.
draft ──── Review ──────>   Kept, reframed ✚: when a curator completes a
                 reviewed   work, that completion IS the review — the work
                            lands as reviewed in one act. What this design
                            drops is the expectation: reviewers are not
                            responsible for drafts and there is no draft
                            queue; harvested work reaches people through
                            the candidate flow (§2). Curators still see
                            drafts for checks (main hides a researcher's
                            draft from curators ●, reversed here, §4).

SAVE + TRANSITION ●         The edit form posts ONE action (save / submit /
                            return / review): field changes, file changes and
one form post =             the transition commit or roll back together. On
one transaction             validation failure the form re-renders with the
                            user's edits and staged uploads intact.

REQUEST LOOP ✚              A curator asks for changes without changing the
                            record status. The curator picks the fields that
submitted ──┐               need work and adds one message. The owner opens
reviewed  ──┤ no state      a view showing exactly those fields (full form
            │ change        one click away) and edits. The reviewer then
            └─> owner edits   judges what changed in those fields — accept /
                              adapt / reject — and closes the request. The
                              non-blocking sibling of Return (§5).
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
✚ curators see every work, drafts included — checks without
    responsibility: no draft queue, no draft expectation. Drafts stay OUT
    of curator search and lists; a curator reaches one directly (link,
    id, the researcher's page) when doing a check
✚ dedicated queues, one command per button:
    Submitted        [Approve] [Return + comment] [Request changes]
    Re-review        works edited after approval — [Approve] (sees diff)
    Candidates ◐     [Adopt into researcher's works] — feed-dependent
    Duplicates       [Consolidate] (opens survivor prefilled)
    Requests         open pending requests, whatever their origin:
                     curator asks (settle the delta), researcher
                     suggestions, deposit-time don't-knows
✚ bulk: same command per selected row, one transaction each — one refusal
    leaves the others done (partial-success UI needed, §9)

PLACE: WORK SHOW / REVIEW PANEL
───────────────────────────────
● metadata display                        ● internal notes (curator-only)
● workflow buttons appear exactly         ● files with access level + embargo
  when the handler would accept them      ● [Change subtype] (with preview)
● [Return + comment] [Review]             ● [Reject source]
● [Set visibility] (blocked → public      ● [Merge] — see tombstones, §6
  while a duplicate cluster is open)      ✚ [Request changes] — name fields
● [Delete]                                  + message; [Close request]
✚ rounds history: one comment per         ✚ delta view: what changed since
  transition, both directions               the return / the approval
✚ migrated old-biblio message             ✚ the owner sees it too — old
  (one text per work): read-only            biblio showed it to both sides
  here                                      and let both write it (§5)
```

## 5. Places — researcher / proxy side

```
PLACE: MY WORKS / DASHBOARD
───────────────────────────
● list of own works with status        ○ no "action needed" inbox — returns
● proxy sees the proxied user's works    and requests announce themselves
  (grants re-target "own"; role          only when the researcher opens
  never elevates)                        the work
◐ "Added for you": Plato imports and   ◐ "Found for you": candidate rounds —
  curator-added works; "Not yours?"      Review / Submit publicly (default) /
  opens a helpdesk mail                  Submit privately / Save draft /
                                         Skip / Reject-my-match

PLACE: WORK FORM
────────────────
● edit fields; upload files with       ● protected classification schemes
  per-file access level + embargo        render read-only
● [Save] [Submit for review]           ● returned: curator's comment in a
● [Delete] (draft only)                  banner; [Submit] re-validates
◐ don't-know path, on any value: the depositor records that they do not
  know it; the record keeps moving and the don't-know becomes a pending
  request. A policy-risk value — access level, licence, embargo, file
  version, the doctoral-thesis questions — adds one effect: the safest
  configured state applies while the request is open. Which state is
  safest is an undecided Open Science Policy question
✚ a don't-know submit follows the submit default: the record goes public
  unless the depositor chose "Submit privately". On a policy-risk value
  the file carries the risk in its safest state (e.g. closed) until a
  curator settles the pending request

PLACE: SUBMITTED / REVIEWED WORK
────────────────────────────────
● read-only for the owner in main — the de facto lock the no-locking
  decision removes
✚ the owner edits freely: no gates before review; an unprompted edit
  after review enters the re-review queue
✚ incoming Request changes: a view focused on the requested fields, the
  full form one click away
◐ Suggest a change, for fields and works the actor cannot edit —
  protected classifications included ✚; it becomes a pending request
✚ migrated old-biblio message, when one exists: read-only (Migration,
  below)
```

### The communication layer

**Decision: no locking.** The old backoffice let reviewers lock and unlock a
record. We removed locking: a researcher can always fix their work.

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
                        changed fields to their approved values — a
                        comment is encouraged; the team still discusses
                        require vs encourage, §8).
                      an edit while a request is open rides that request:
                      the reviewer settles it there, and the work stays
                      out of the re-review queue ✚
```

**Naming `◐`.** The vocabulary already owns this language ("Accepted value
and pending request"): one entity, the **pending request** — field-scoped,
several per work, badge-mapped. Three origins create one: a curator
*requests* changes (Request changes), a researcher or proxy *suggests* a
change, a depositor records a *don't-know* at deposit. Two settlements:
the curator answers a proposed value (accept / decline / ask
clarification `◐`); the reviewer judges the owner's edits after a request
(accept / adapt / reject `✚`, §8).

Consequences. The request is focus and tracking, not permission — the raven
ask is two grant rows, `edit_submitted:own` and `edit_reviewed:own`
(curator-only in `main` `●`). Return remains the blocking queue signal.
Reject needs field history from the engine (§7). The suggestion covers
works and fields the owner cannot edit. Mid-review edits make the conflict
screen a
daily path, not an edge case. And — known and accepted — with the publish
default, an unreviewed public record can change live before a curator sees
it.

**Messages ride actions** `◐`: there is no standing message and no thread;
the internal note is the only standing text, and it is curator-only. The
researcher never owes a message — an edit, a resubmit or a response to a
request may carry one, optionally `✚`. Reviewer comments on Return and
reject: `main` requires one on Return `●`; this design prefers encouraging
over blocking `✚` — an empty comment box should never stop a reviewer. We
expect push-back and log it as a discussion, not a decision (§8). So a
missing conversation is a missing *action*:

| Ask | Carrier |
|---|---|
| Curator → researcher, non-blocking | `✚` Request changes (above) |
| Curator → researcher, blocking | `●` Return + required comment |
| Researcher → curator, on own work | `✚` edit directly (no locking) |
| Researcher → curator, on works or fields they cannot edit | `◐` Suggest a change → pending request (raven model open `○`) |
| Researcher → curator, free message | `○` none; old biblio's `Message` was this channel — dropping it is a removal; today's escape is a helpdesk mail |
| "That harvested work is mine" | `○` no claim flow; nearest: person-link auto-match `●` |
| "Withdraw my work" | `○` in-app; withdrawal = curator Delete with reason `◐` |
| External takedown demand | `◐` Delete with reason `takedown` |
| Curator ↔ curator | `●` internal notes |

**Migration.** Old biblio's `Message` is one overwritable free-text field
per work — the "Biblio Messages" tab, card "Messages from and for Biblio
team" — written and read by researchers and the biblio team alike, no
thread, no history: a save replaces the text `●`. The migration field
catalog drops it and glosses it "depositor's submission message"
(`metadata-work-fields.md`, "What's out of scope") — narrower than the
code — so the text dies at migration. `ReviewerNote` survives into
curator-only notes; `AdditionalInfo` survives as work metadata `●`.
Decision `✚`: storage for the migrated text must exist — the catalog must
reverse the drop, or the team must re-decide it explicitly. It surfaces
read-only on the work show / review panel (§4) and to the owner on their
work — owners may have authored it. Whether people may write *new*
action-free messages stays open `○`. Dropping the channel is a removal,
not a neutral gap — old biblio's Message WAS the researcher's free line
to the team.

### Email notifications

**Decision `✚`: email is opt-in.** A per-user setting turns email updates
on. The setting exists for researchers and proxies; curators and reviewers
work without email. Mail goes out when *someone else* acts on a work in
the recipient's "my works" scope; the recipient's own actions stay silent.
Each mail links to the work, or to the scoped view when a request carries
it.

| Event that mails (setting on) | Trigger | The mail carries |
|---|---|---|
| Work returned | curator Return | the curator's comment + link |
| Changes requested | curator opens a request | named fields, message, link to the scoped view |
| Suggestion settled `✚` | curator accepts or declines | the outcome + comment |
| Request settled against you | reviewer rejects or adapts | which fields changed or were restored, comment |
| Work approved | Review or re-approval | link; states the public/private outcome |
| Work deleted or merged | curator Delete/Merge past draft | reason label; redirect or tombstone target |
| Found for you `◐` | new candidates matched | a digest; cadence open `○` |
| Added for you `◐` | Plato or curator adds a work | link + the "Not yours?" path |

Scope answers §9 gap 10 for email `✚`: every opted-in person whose "my
works" covers the work (owner and active proxies) gets the mail; a settled
suggestion also mails its suggester, whose "my works" need not cover the
work `✚`. In-app routing stays open. Cadence, digest shape and the setting itself:
[`EMAIL-NOTIFICATIONS-ANALYSIS.md`](EMAIL-NOTIFICATIONS-ANALYSIS.md).

---

## 6. The axes in detail

### Record visibility

**Decision: two-valued — private / public.** Every read surface checks
`== public`; `restricted` never had a reader. The badge already collapsed
it, and its one documented use — the embargoed external deposit — raven
writes and nothing reads. Restricted stays a file value. Consequences:
the embargoed external deposit needs its own carrier (the vocabulary lists
external access + embargo as a mapping still to land), and dropping the value
is engine work, tracked with the naming issue. Reopening `restricted` needs
what it never had: a reader.

```
 private <────────────────────────────> public

 ● first arrival at public stamps made_public_at — the point of no return
   for deletion semantics (below)
 ● gates on the way to public: draft (CHECK) and an open duplicate cluster
 ◐✚ an open pending request leaves the way to public open ("pending
    requests do not alter the public surface"); on a policy-risk value
    the file's safest state carries the risk
 ◐✚ policy: submit publishes by default; review is not a precondition
    for public
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

Deletion is its own axis: Restore brings back the exact prior state; reasons
(withdrawn / takedown) are labels that drive tombstone wording and audit,
nothing else; raven deletes content, never identity `◐`. Duplicates are a
Merge, never a Delete — see the side quests panel.

### Retraction

A retracted work stays active and public: a metadata field, not a state,
drives the banner and the link to the retraction notice `◐`. Whether
the file stays open is a per-case call on the file axis.

### File access level (pointer only)

Out of the flow design. What the flow needs to know: review and return never
touch file access; lifting an embargo never signals "changed since approval"
`◐`; the files are the sole input to the derived access state.

### Derived access state (computed, not stored)

The record's outward "open access" answer. It follows from the files alone,
with no field and no editor: public full-text file or external full-text
link → open;
scheduled public lift → embargo; restricted full text → restricted; else
none (`Work.Access()` `●`). It feeds the `open_access` trait and the COAR
access right in the OpenAIRE format, where a second derivation with diverging
rules lives `●`. Cards' "Open access / Restricted" is this level, never
record visibility. One derivation should survive; the naming issue tracks it.

---

## 7. Asks from raven

What this design needs from the engine, stated as needs — raven decides how
to meet each one.

| Need | raven `main` today |
|---|---|
| Owners edit their own work in every state (`edit_submitted:own`, `edit_reviewed:own`) | curator-only past draft and returned |
| Curators open any draft directly (checks); drafts stay out of curator search and lists | a real user's draft is hidden from other curators entirely |
| An approved-version snapshot, and reading the fields as they stood at it | absent — the projection is current-only |
| Re-approval after edits | `reviewed` is terminal |
| A "changed since approval" read for the re-review queue | absent |
| The pending-request entity (vocabulary): field-scoped, several per work, an origin (curator ask, researcher suggestion, deposit don't-know), a message, open/closed, settled-by | absent — workflow comments are record-level events |
| Reject: restore the changed fields to their approved values, with a comment | impossible — no field history |
| Storage for the migrated `Message` text (one per work), readable by curator and owner | the migration field catalog drops `Message`, glossing it as one-directional |
| Per-user email opt-in; mail to researchers and proxies on the §5 email events; in-app notifications undesigned (§9) | job-outcome tray only |
| Submit-publishes compound and an owner-side publish grant | no visibility capability exists in the grant matrix |
| A carrier for the embargoed external deposit | record-level `restricted`: written, never read |
| Per-researcher candidate status (New / Skipped / Added / Rejected) | absent |
| Curator queues as first-class reads | search filter on deposit_status only |

## 8. Shaky grounds

Claims this design builds on that no accepted document backs.

| Claim | Why shaky | Who firms it |
|---|---|---|
| The re-review stack (approved snapshot, re-approval, changed-since-approval) | no accepted design provides it; `main` cannot reconstruct approved fields | raven team — commit to a mechanism |
| Submit publishes by default; Return unpublishes | lives only in booktower's domain vocabulary | biblio team + Open Science Policy |
| Policy-risk fallback state | explicitly undecided in the vocabulary | Open Science Policy |
| Candidate feed | none exists (WoS is a manual upload; no Crossref/ORCID feed) — phase 1B is blocked on it | raven roadmap |
| Reject = per-field restore to approved values | this analysis's interpretation of "reject, adapt, accept" | the team |
| Reviewer comments: encourage, not require | `main` requires one on Return; this design would drop the hard requirement so an empty comment box never blocks a reviewer — we expect push-back | team discussion |
| No locking: the owner edits a reviewed work directly; the suggestion stays for what they cannot edit | the vocabulary now carries this path (re-synced ahead of crossover), but only booktower documents back it — biblio-team acceptance is pending | biblio team |
| Review is centrally organized | never asked out loud; the grant matrix has no org scoping, so faculty-scoped review is impossible today | biblio team |
| Volumes (queue sizes, rounds per work, curator count) | assumed, never measured | one query on old biblio's database |

## 9. Gaps — no design yet (`○`)

1. **Notifications, in-app.** Email is decided (§5): opt-in, researchers
   and proxies only. Who hears what inside the app (returns, requests,
   outcomes) is still open; only a job-outcome tray exists.
2. **"Action needed" surface.** Returns and requests announce themselves only
   when the researcher opens the work; the request loop is this surface's
   first tenant.
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
10. **Proxy message routing, in-app.** Email is answered in §5 (everyone in
    scope who opted in). In-app: proxy deposited, who sees the return, the
    request, the outcome — researcher, proxy, or both.
