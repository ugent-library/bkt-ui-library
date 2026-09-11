# Email notifications — analysis

Home: `booktower-ui-library/docs/wip/EMAIL-NOTIFICATIONS-ANALYSIS.md`. Owns
email notification design for the next Biblio. The review-flow baseline
(`REVIEW-FLOW-ANALYSIS.md`, §5 *Email notifications*) decided: email is
opt-in per user, for researchers and proxies, sent when another actor
touches a work in the recipient's scope, and each mail deep-links. This
analysis takes cadence, digest shape and the setting from there. Marks
follow the review-flow legend (`✚` decided here, `○` open).

## Two event classes

Cadence is a per-class question:

| Class | Events (review-flow §5 list) | Someone waits? |
|---|---|---|
| Asks | work returned, changes requested | Yes: the flow blocks until the recipient acts |
| Awareness | approved, request settled against you, deleted/merged, found for you, added for you | No; nothing waits on the recipient |

## What each cadence looks like

A curator returns a work on Tuesday:

| Cadence | The recipient's inbox | Effect on a review round |
|---|---|---|
| Instant | One mail per event; a curator clearing a queue can burst several mails within minutes | Return read the same day; a round closes in days |
| Weekly digest | One mail on a fixed day: the week's events, grouped per work, one line each | A Return waits up to seven days unread; a two-round review takes about three weeks |
| Monthly digest | A newsletter: the month across all works | Rounds effectively stop; only awareness events survive this cadence |

`✚` A digest groups by work, newest first, one deep-linking line per event.
`✚` An empty period stays silent.
`○` Coalescing for instant bursts (one mail per curator + work within a
short window) stays open.

## The setting

**Decision `✚`: the recipient decides.** A researcher or proxy who picks a
digest gets everything at that cadence, blocking asks included. The
setting states the consequence next to the choice: returns and change
requests also wait for the digest.

`○` Open — how many knobs:

1. One cadence for everything; the consequence line carries the warning.
2. Two choices: a cadence for asks, a cadence for awareness.
3. Per-event choices. Maximal control; a settings screen few will read.

## Open

- Which digest cadences to offer (weekly only, or daily / weekly /
  monthly), and the send day and hour.
- Sender address, reply-to (helpdesk?), mail language per user.
- Proxy digests: one digest merging own and proxied works, or split per
  role.
