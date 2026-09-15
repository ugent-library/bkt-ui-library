# Review and curation flow — analysis

This is the baseline for the high-level flow wireframes, the review-flow bet and
the per-screen breadboards. Booktower owns the design; Raven owns the domain model
and implementation.

## Sources and marks

- Raven `main`: `deposit_status.go`, `revisions.go`, `grant.go`,
  `app/backoffice.go`, `docs/architecture-overview.md` and
  `docs/metadata-work-fields.md`.
- Old Biblio `main`: `views/*/edit_message.templ`,
  `views/dataset/message_body.templ` and
  `cypress/e2e/*/edit/biblio-messages.cy.ts`.
- Design sources: Raven's merged deletion plan
  (`docs/plans/2026-08-26-record-deletion-design.md`; only `Delete` is
  implemented), Booktower's `DOMAIN-VOCABULARY.md` and the Candidates bet.

| Mark | Meaning |
|---|---|
| `●` | Observed in Raven `main`, or in old Biblio where stated |
| `◐` | Stated in an earlier design document, but not confirmed in Raven `main` |
| `○` | Unresolved |
| `✚` | Decided in this analysis |

These marks are editorial annotations. Wireframes present the proposed flow as the
primary content and keep source, TBC and policy notes subtle and available on demand.

## 1. Flow model

A Work has one **deposit status** and one **record visibility**. Communication,
file access, deletion, withdrawal and retraction are separate. One does not imply
another unless an action explicitly changes both.

| Deposit status | Private | Public |
|---|---|---|
| Draft | Always; enforced by a database check `●` | Impossible `●` |
| Submitted | Easy opt-out with Submit privately `✚` | Default after Submit `✚` |
| Returned | Always; Return also sets visibility to private `✚` | Impossible `✚` |
| Reviewed | Valid for confidential, on-file Works `●` | Valid; first publication stamps `made_public_at` `●` |

Review does not change visibility `●`. The interface may combine Review and Set
visibility in one action.

### Compound actions

One interface action may change two independent facts in one transaction.

| Person's intent | Commands |
|---|---|
| Approve and make public `●` | Review + Set visibility to public |
| Submit publicly or privately `✚` | Submit + Set visibility; Raven cannot change visibility while the Work is a draft |
| Return `✚` | Return + Set visibility to private |
| Retract `◐✚` | Set the retraction field. The Work stays active and public, and its metadata and public page show the retraction notice. Files do not change. |
| Withdraw `✚` | Mark the Work as withdrawn, set visibility to private and require a message. Preserve the record and its history; do not use Delete. |

The interface must distinguish **record visibility**, a file's **access level**
and its derived **access state**. Raven currently uses the same `Visibility` enum
for all three and calls record visibility “Access”. This naming bug has been filed
in Raven.

Submit defaults to public. **Submit privately** is available at the same decision
point, without a separate settings flow. Return always sets record visibility to
private `✚`.

## 2. Entry points

```
ENTRY: harvester finds a Work --> {System-owned draft}

{System-owned draft}
  "Source and provenance" ●✚
  "Source re-imports update the visible metadata until the first human edit" ●
  [Human edits] --> {Forked draft}

{Forked draft}
  "Re-imports refresh the stored source evidence, but do not change the visible
   metadata or create suggested changes" ●
  [Continue editing] --> OUT: Work form

ENTRY: researcher or proxy starts a Work --> {New Work form}

{New Work form}
  [Create] --> {Actor-owned draft}

ENTRY: curator imports a Work --> {Manual import}

{Manual import}
  <DOI or file>
  [Create] --> {Actor-owned draft}

{Actor-owned draft}
  "Owned by the actor, or by the researcher in proxy mode" ●
  "Human-created Works are forked from birth" ●
```

A **Candidate** is a private, system-owned Work matched to a researcher's linked
person identity `◐`. “Found for you” presents candidates in review rounds with
Review, Submit publicly, Submit privately, Save draft, Skip and Reject my match.
“Added for you” covers direct additions from Plato or a curator. Phase 1A can show
direct additions; phase 1B needs a candidate feed.

Every Work keeps its provenance visible: harvested, including the source `●`, or
deposited, including the actor `✚`.

## 3. Deposit rail

```
DRAFT --[Submit]--> SUBMITTED --[Review]-----------------> REVIEWED
  |                    |
  |                    +--[Return; comment required]--> RETURNED
  |                                                        |
  |                    SUBMITTED <---------[Submit]---------+
  |
  +--[Review; curator]-----------------------------------> REVIEWED
  +--[Delete draft; owner only]--------------------------> deleted
```

Every transition to a non-draft status validates the complete Work and checks its
revision. A concurrent edit produces a conflict instead of overwriting work `●`.

- **Save and transition are atomic `●`.** One form post saves fields and files and
  performs Save, Submit, Return or Review. Raven re-renders validation failures with
  the submitted fields and staged uploads intact. A revision conflict currently
  returns an error instead of that form `●`.
- **Conflict recovery does not lose work `✚`.** Keep the submitted fields and uploads,
  and carry non-overlapping changes forward automatically. The exact treatment of an
  overlapping field remains open (§9).
- **Curators may complete a draft `●✚`.** Review can move a draft directly to
  reviewed. This is needed for harvested Works. Curators can reach drafts for checks,
  but drafts do not appear in a curator queue or create a review obligation.
- **Requests do not change status `✚`.** A curator can request changes to a submitted
  or reviewed Work. The owner sees only the named fields, with the full form one
  action away. The reviewer later accepts, adapts or rejects the changes.
- **Transitions are auditable `●`.** Submit, Return and Review record the actor and
  optional comment; Return currently requires a comment. The interface needs a
  readable round history and the field values from each round `✚`.

## 4. Curator flow breadboard

```
ENTRY: curator opens Review --> {Queues}

{Queues}
  "Submitted — Works waiting for review"
  "One shared queue; no assignment, claiming or reviewer lock" ✚
  "Candidates — feed-dependent" ◐
  "Duplicates — Works waiting to be consolidated"
  "Requests — replies and suggestions awaiting curator action"
  [Open Work] --> {Work review}
  [Adopt candidate for a researcher] --> OUT: researcher's My works
  [Open duplicate] --> {Consolidation review}

{Work review}
  "Metadata, internal notes and files with access level and embargo" ●
  "Workflow actions appear only when Raven would accept them" ●
  "Round history and changes since Return or approval" ✚
  "Migrated old-Biblio message, read-only" ✚
  [Approve]
  [Return with comment]
  [Request changes] --> {Request changes}
  [Set visibility]
    + accepted --> {Work review}
    + duplicate cluster open --> {Publication blocked}
  [Change subtype with preview]
  [Reject source]
  [Consolidate duplicate] --> {Consolidation review}
  [Delete]

{Consolidation review}
  "Survivor prefilled with the duplicate's sources, keys, notes and links"
  [Consolidate] --> OUT: survivor Work

{Publication blocked}
  "Resolve the duplicate cluster before making this Work public"
  [Back] --> {Work review}

{Request changes}
  <Fields that need work>
  <One message>
  [Send] --> OUT: researcher's scoped request view

{Open request}
  "Requested fields and proposed values"
  [Accept] --> OUT: Work updated; request closed
  [Adapt and accept] --> OUT: Work updated with curator values; request closed
  [Decline with comment] --> OUT: Work unchanged; request closed
  [Ask for clarification] --> OUT: request remains open

ENTRY: curator opens a pending request --> {Open request}
```

Curators can open any Work by a direct route, drafts included, but drafts stay out of
search results and queues `✚`. Queue buttons each run one command.

Review starts in the shared queue. This analysis adds no **Start reviewing**
assignment, **My Queue**, claiming or locking behavior `✚`. Those labels appear only
in Booktower pages marked WIP; Raven `main` has no reviewer-assignment concept.
Assignment may be added later if curator coordination needs it, but it is not
designed in this flow `○`.

## 5. Researcher and proxy flow breadboard

```
ENTRY: researcher or proxy opens My works --> {My works}

{My works}
  "Own Works and their status" ●
  "In proxy mode, the researcher's Works" ●
  "Added for you — Plato and curator additions" ◐
  "Found for you — candidate rounds" ◐
  [Open Work] --> {Work}
  [Review candidate] --> {Candidate review}
  [Open Inbox] --> {Inbox}

ENTRY: researcher opens Inbox --> {Inbox}
ENTRY: proxy opens Proxy Inbox --> {Inbox}

{Inbox}
  "Needs your action — Returns and open requests"
  "Recent activity — outcomes"
  "Every Proxy Inbox item names the researcher"
  [Open item] --> {Returned Work, Scoped request or Work}

{Candidate review}
  [Submit publicly] --> OUT: submitted public Work
  [Submit privately] --> OUT: submitted private Work
  [Save draft] --> {Work form}
  [Skip] --> OUT: next candidate
  [Reject my match] --> OUT: next candidate

{Work}
  "Migrated old-Biblio message, read-only when present" ✚
  [Edit draft, submitted or returned Work] --> {Work form}
  [Suggest a change to reviewed Work] --> {Suggestion}
  [Not yours?] --> OUT: helpdesk email

{Work form}
  <Editable metadata>
  <Files, access level and embargo>
  "Protected classifications, read-only" ●
  [Save] --> {Work}
  [Submit for review] --> OUT: submitted Work
  [Delete] --> OUT: draft deleted

{Returned Work}
  "Curator's comment" ●
  [Edit] --> {Work form}
  [Submit again] --> OUT: submitted Work

{Scoped request}
  "Only the requested fields"
  [Open full form] --> {Work form}
  [Send changes] --> OUT: curator's open request

{Suggestion}
  <Proposed changes to the reviewed Work>
  <Proposed change and optional message>
  [Send] --> OUT: curator's Requests queue

ENTRY: researcher opens a returned Work --> {Returned Work}
ENTRY: researcher follows a request --> {Scoped request}
```

### Inbox and proxy routing

Inbox is the in-app notification surface; there is no separate notification centre.
Returns and open requests appear under **Needs your action** for the researcher and
every authorized proxy. Resolution removes the item from that section, not from the
system: the outcome remains under **Recent activity** and in Work history. Suggestion
outcomes also appear for their original sender `✚`.

Proxy permissions are managed outside this review flow. Proxy Inbox combines all
permitted researchers and names the researcher on every item `✚`. When a proxy who
can act for several researchers starts a new Work, the interface must establish who
they are acting for before the first edit `✚`. The chooser itself is not designed:
it must be explicit without becoming a repeated or obtrusive interruption (§9).

### Direct edits and suggested changes

The owner is the researcher the Work belongs to, or a proxy acting for them. What
happens when they change something depends on the Work's status `✚`.

| Situation | Result |
|---|---|
| Draft, submitted or returned, with no open request | The owner edits the Work directly. Review applies to the current revision; concurrent changes produce a conflict. |
| Reviewed, with no open request | **Suggest a change** stores the proposed fields in a pending request. It does not update the Work or public site. |
| Any Work with an open request | The response updates that request rather than the Work. It does not create a second request. |

There is no whole-record reviewer lock. A submitted public Work still changes when
its owner edits it directly. Raven needs an owner grant for that edit and a separate
way to propose changes to reviewed Works.

### Pending requests

A field- or section-scoped **pending request** can start in two ways:

| Origin | Curator response |
|---|---|
| Curator requests changes `✚` | Accept, adapt, decline or ask for clarification `✚` |
| Owner suggests changes to a reviewed Work `✚` | Accept, adapt, decline or ask for clarification `✚` |

A Work may have several requests. A request tracks focus and resolution; it does not
grant permission or change deposit status or record visibility. Its proposed values
stay separate from the Work. The public page keeps showing the accepted values until
a curator accepts or adapts the request `◐✚`. Declining it leaves the Work unchanged.

This is the behavior Booktower will design. Raven `main` has no pending-request model;
a normal update replaces the projection read by the public site. Development must
confirm how Raven will store, compare and apply proposed values `○`.

### Accepted and proposed values

For a reviewed Work, public pages, public APIs, OAI, ORCID and funder exports use the
accepted values while a suggestion is pending `✚`. Proposed values exist only in the
backoffice editing and review flow. A backoffice export may include them only when
the person explicitly selects that option and the export labels them as proposed
`✚`. Raven must still confirm the implementation (§7).

Access to previous accepted versions is deferred. It is not designed in this flow.

During deposit, “I don't know” is an unresolved answer within the Work's existing
review flow; it does not create a pending request `✚`. Submission continues along the
chosen public or private path. On a reviewed Work, the same answer is a proposed
change and therefore becomes a pending request `✚`.

If the unknown concerns access level, licence, embargo, file version or
doctoral-thesis policy, the file stays closed until a curator settles the answer
`✚`. Open Science Policy must confirm this fallback (§8).

### Messages

Messages belong to actions; there is no conversation thread `◐`. Researchers may
add an optional message to an edit, resubmission or request response `✚`. Raven
currently requires a comment on Return `●`; this analysis prefers encouraging a
comment without blocking the reviewer `✚`, pending team agreement (§8).

| Need | Route |
|---|---|
| Curator asks without blocking | Request changes `✚` |
| Curator blocks progress | Return with comment `●` |
| Owner changes their Work | Edit directly `✚` |
| Researcher sends a free message | No new route `○`; helpdesk email is the fallback |
| Researcher asks to withdraw a Work | No route yet `○`; an in-product **Request withdrawal** would open a request, not add a Work state or use **Suggest a change** |
| External party requests takedown | Curator deletes it as `takedown` `◐` |
| Curator writes to another curator | Internal notes `●` |

Old Biblio stores one shared, overwritable Message per Work, readable and writable by
researchers and the Biblio team; it has no thread or history `●`. The migration
catalog currently drops it and calls it a depositor submission message, although the
code allowed both sides to write it. The migrated text must instead remain readable
by the owner and curator `✚`. Whether anyone may write a new action-free message
remains open `○`. `ReviewerNote` already maps to curator-only notes and
`AdditionalInfo` to Work metadata `●`.

### Email notifications

Email is opt-in for researchers and proxies `✚`. It is sent when another person acts
on a Work in the recipient's My works scope; the recipient's own actions stay silent.
Active proxies and the owner each receive it if they opted in. A settled suggestion
also notifies its suggester `✚`.

| Event | Mail includes |
|---|---|
| Return | Comment and Work link |
| Changes requested | Named fields, message and scoped-view link |
| Suggestion settled | Outcome and comment |
| Request settled by adaptation or rejection | Changed or restored fields and comment |
| Approval | Public or private outcome and Work link |
| Deletion or consolidation | Reason and redirect or tombstone target |
| Found for you | Candidate digest |
| Added for you | Work link and Not yours? route |

Cadence, digest shape and settings are owned by
[`EMAIL-NOTIFICATIONS-ANALYSIS.md`](EMAIL-NOTIFICATIONS-ANALYSIS.md).

## 6. Independent axes and related workflows

### Record visibility

Record visibility has two values: private and public `✚`. Every reader checks for
public; Raven writes `restricted` at record level but never reads it `●`. Restricted
remains a file access level. Dropping record-level `restricted` and finding a new
carrier for embargoed external deposits are Raven work.

```
 private <────────────────────────────> public

 ● first publication stamps made_public_at; this changes deletion behavior forever
 ● draft and an open duplicate cluster block publication
 ◐✚ an open pending request does not block publication
 ✚ a policy-risk request keeps the affected file closed
 ✚ Submit publishes by default; Review is not a publication gate
```

### Deletion and consolidation

```
ACTIVE --[Delete]--> DELETED --[Purge]--> PURGED
  ^                    |                    scrubbed tombstone;
  +------[Restore]-----+                    id resolves with 410

[Consolidate X into Y]
  + X never public --> hard-delete X
  + X once public  --> X redirects to Y; redirects stay one hop
```

Delete hides a Work without changing its stored visibility or deposit status;
Restore returns it unchanged `●◐`. A `takedown` reason affects tombstone wording and
audit. A housekeeping job purges never-public trash after retention `◐`.

A duplicate must be consolidated, not deleted. Consolidation moves sources, keys,
notes and links to the survivor. A once-public identifier keeps resolving: a
consolidated Work redirects to its survivor `●`; a purged Work leaves a scrubbed
tombstone `◐`.

### Retraction

Retraction is metadata, not a state. A retracted Work remains active and public and
shows a banner linking to the retraction notice. Retraction does not change its files
or their access `◐✚`.

### Withdrawal

Withdrawal is not deletion. It marks the Work as withdrawn, preserves the record and
its history, sets record visibility to private and requires a message `✚`. Who may
request or perform it remains open (§9). Raven has no withdrawal operation today.
A researcher-facing **Request withdrawal** would be a new action, not a Work state,
deposit status or suggested field change. If adopted, it would open a request with
the intent to withdraw while leaving the Work unchanged. A curator would settle it
with Withdraw, not Delete `○`.

### Classification

Classification fields are not states. Curators own protected schemes; owners see
them read-only, and Raven reasserts their stored values on save `●`. The shared form
must carry field-level permissions.

### File access and derived access state

Review and Return never change file access, and lifting an embargo does not mean the
Work changed since approval `◐`. The outward open-access state is computed from files:
a public full-text file or external full-text link means open; scheduled public
access means embargo; restricted full text means restricted; otherwise none `●`.
Cards show this derived state, never record visibility. Raven currently has a second,
diverging derivation for OpenAIRE; one derivation should remain.

## 7. Raven dependencies

This design needs the following capabilities. Raven decides how to provide them.

| Need | Raven `main` today |
|---|---|
| Owners edit submitted Works directly and propose changes to reviewed Works | Only curators can edit past draft and returned; proposed changes do not exist |
| Curators open any draft directly; drafts remain outside queues and search results | A researcher's draft is hidden from other curators |
| Approved snapshots and field values at approval | Only the current projection exists |
| Field- or section-scoped pending requests, several per Work, with origin, message, status and settlement actor | Workflow comments are record-level events |
| Proposed values stay outside the Work and public site until acceptance; accept or adapt applies them | A normal update replaces the public projection immediately |
| Migrated Message storage readable by owner and curator | The migration catalog drops Message |
| Per-user email opt-in for researchers and proxies | Only a job-outcome tray exists |
| Submit-and-publish and an owner-side publish grant | The grant matrix has no visibility capability |
| Carrier for an embargoed external deposit | Record-level `restricted` is written but never read |
| Candidate status per researcher: New, Skipped, Added or Rejected | Absent |
| First-class curator queues | Search only filters on deposit status |
| Withdrawal that preserves the Work and history, sets visibility to private and requires a message | No withdrawal action distinct from deletion |
| Conflict recovery that carries non-overlapping changes forward and presents overlaps without losing submitted data | A revision conflict returns an error; only validation failures re-render the form |

## 8. Unconfirmed assumptions

| Assumption | Why it needs confirmation | Confirmation |
|---|---|---|
| A policy-risk unknown keeps the file closed | This analysis chose it; no policy decision confirms it | Open Science Policy |
| A candidate feed will exist | No feed exists; WoS is a manual upload | Raven roadmap |
| Reviewer comments are encouraged, not required | Raven requires a Return comment today; this removes that gate | Biblio team |
| Review is centrally organized | The grant matrix cannot scope review by faculty | Biblio team |
| Queue sizes, rounds per Work and curator count fit this flow | They have not been measured | Old-Biblio database query |

## 9. Open design questions (`○`)

| Question | Proposed answer |
|---|---|
| Overlapping conflict values | Show **Latest value** and **Your value** inline and require a choice before saving again. |
| Reviewer assignment | Start with the shared queue and no assignment or lock. Revisit the concept for assignment only if curator coordination shows a need for it. |
| Proxy context chooser | Needs to be designed explicitly. Suggestion for now: carry the researcher from the page where the proxy started. Only when a global **New Work** action is ambiguous, show an inline **Acting for** field at the top of the form; do not interrupt with a separate prompt. |
| Withdrawal request | Add no Work state. If an in-product route is needed, **Request withdrawal** opens a request with a required message; only curator acceptance performs Withdraw. Otherwise, keep the helpdesk route. |
| Action-free message | Add no general message route. Keep messages attached to actions and use the helpdesk for anything else. |
