# Email notifications — analysis

## Recipients and events

Email is opt-in for researchers and proxies. A mail goes out when another person acts
on a Work in the recipient's My works scope; the recipient's own actions stay silent.
The owner and every active proxy each receive it if they opted in. A settled
suggestion also notifies its suggester.

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

## Settings

Each recipient confirms two independent settings; no per-event controls.

| Setting | Choices | Suggested on opt-in |
|---|---|---|
| Needs my action | Instant, daily, weekly, off | Instant |
| For information | Daily, weekly, monthly, off | Monthly |

A mail follows the Inbox section its event lands in: Needs your action or Recent
activity.

For a slower action cadence, explain: “Change requests also arrive at this frequency.”

## Delivery

Mail uses the recipient's interface language. Replies reach biblio@ugent.be.
Digests go out in the morning. Events on one Work for one recipient combine into one
instant mail within a short window. The mail shows the state at the moment it is sent.

## Digests

One digest per delivery groups Works by researcher, with own Works in a separate
group. Within each group, Works appear newest first; each event has one line and a
direct link. Empty periods stay silent.
