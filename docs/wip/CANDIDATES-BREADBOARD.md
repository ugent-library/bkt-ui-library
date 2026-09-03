# Candidates — breadboard

*Draft companion to [CANDIDATES-BET.md](CANDIDATES-BET.md). Uses the
[ASCII breadboard language](../BREADBOARD-TEMPLATE.md). Names, counts and identifiers
are placeholder data.*

## Scope

Phase 1A surfaces direct-added Works. Phase 1B lets a researcher review harvested
Works matched through their linked identity. Both are backoffice routes.

## Breadboard

```text
ENTRY: Researcher opens dashboard --> {Dashboard / candidates available}
ENTRY: Researcher opens the Found for you navigation item --> {Found overview}

{Dashboard / candidates available}
  "Added activity: actor, Work state and completion need"
  "Found count: every pending match; up to three candidate Works"
  [Open added Work] --> OUT: Existing Work detail
  [Complete added Work] --> OUT: Existing Work edit
  [View all added Works] --> OUT: Direct-added research-output list
  [View all candidates] --> {Found overview}
  [Open candidate title] --> {Found overview} at that candidate; nothing changes
  [Review N research outputs] --> {Focused review / round}
  [Review candidate] --> {Focused review / single}

{Found overview}
  "Filtered, paginated list; status New, Skipped, Added, Rejected; source"
  "Default filter: New and Skipped, newest match first"
  <Search within the list> <Status filter> <Source filter> <Publication Year filter> <Faculty filter, multi select with search> <Page>
  [Review N research outputs] --> {Focused review / round}
  [Review] --> {Focused review / single}
  [Reject]
    + success; remove card, announce, offer Undo --> {Found overview}
    + claimed elsewhere; remove card, announce, no Undo --> {Found overview}
    + failure; preserve card and count --> {Found overview / action failed}
  [Undo rejection] --> {Found overview}
  [Resume added draft] --> OUT: Existing deposit
  [View added Work] --> OUT: Existing Work detail

{Focused review / round}
  "Position and remaining count of the round fixed when it started"
  "Identity: title, contributors, year, type, source, match evidence"
  "Only fields that are missing or researcher-owned; says so when nothing is missing"
  "Already added by a co-author or the Biblio team: no form; the Work is linked only
   when submitted"
  [Show all imported fields] --> {Focused review / round} read-only; nothing changes
  <Missing and researcher-owned values>
  [Submit publicly] or [Submit privately]
    + success; claim and submit --> {Focused review / round} next candidate
    + last candidate --> {Round summary}
    + claimed elsewhere; say so, link the Work only when submitted --> next candidate
    + failure; preserve values --> {Focused review / action failed}
  [Skip]
    + hold for next round --> {Focused review / round} next candidate
    + last candidate --> {Round summary}
  [Reject]
    + remove match, announce Undo --> {Focused review / round} next candidate
    + last candidate --> {Round summary}
  [Save draft] --> claim as Incomplete draft --> next candidate or {Round summary}
  [Edit the full record] --> claim as Incomplete draft --> OUT: Existing deposit;
    its return route is {Found overview}
  [Back] --> {Found overview} or {Dashboard / candidates available}

{Focused review / single}
  "Same identity, fields and actions; no position"
  [Every exit, Skip included] --> the place that opened it

{Focused review / action failed}
  "Failed action and preserved values"
  [Retry] --> {Focused review / round} or {Focused review / single}

{Found overview / action failed}
  "Failed action, preserved candidate and unchanged count"
  [Retry] --> {Found overview}

{Round summary}
  "Submitted, rejected, skipped and saved-as-draft totals"
  "Skipped candidates and new arrivals form the next round"
  [Dashboard] --> {Dashboard / candidates available}
  [Found for you] --> {Found overview}
```

## Behavior constraints

- Opening any place changes nothing. Back, refresh and return preserve the round and
  position. Values typed in focused review are remembered in the browser for that
  candidate and restored on return, without claiming; Skip and Reject discard them,
  Save draft and Edit the full record keep them in the draft. No unsaved-changes
  prompt.
- The Work is claimed on the first persisted action: Submit publicly, Submit privately,
  Save draft or Edit the full record. Skip, Reject and Back never claim. A claim removes the candidate for
  every matched co-author; they are told a co-author or the Biblio team added it and
  reach the Work only once it is submitted. Another owner's draft is never linked.
- A round is the New and Skipped set at its start. New arrivals raise the dashboard
  count only.
- Reject affects only this match. Skip holds the candidate until the next round.
- Progress reads as position and remaining count; the summary counts decisions, not
  completion.
- After a decision, move focus to the next candidate or the list heading; announce the
  action, Undo availability and remaining count.

## Decisions

- [DD-003](../decisions/DD-003-candidate-review-is-a-focused-round.md) — overview
  plus focused round; the Work is claimed on the first persisted action.

## Open questions

- Whether Reject records no reason, an optional reason or a required reason, and
  whether reason capture belongs in phase 1B. Owner: Product, Biblio team and Raven.
  Does not block wireframing; the prototype shows no reason control.
