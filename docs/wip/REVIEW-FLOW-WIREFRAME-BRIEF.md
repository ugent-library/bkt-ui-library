# Review flow — HTML wireframe brief

<!-- Follow docs/SPEC-WRITING.md. Maximum 500 words. -->

Build a low-fidelity, clickable review prototype under `flows/review/`. It has two
connected parts:

1. The overview shows screens as simple cards in researcher, proxy and curator
   lanes. Arrows show navigation and effects on another actor or the public record.
2. The app flow is a toned-down version of the real backoffice. Someone can use it
   as one actor, moving through realistic pages and controls without finalising the
   screen design.

## Read first

`AGENTS.md` · [analysis](REVIEW-FLOW-ANALYSIS.md) · `docs/SURFACES.md` ·
`docs/CLASSES.md`.

## Overview

Create `flows/review/index.html`. Each card represents one app-flow page or state and
shows its heading, essential context and actions. Every card links to that exact page
and state. Give system and public-record effects their own quiet lane; they are not
actor walkthroughs.

Show Candidates and duplicate consolidation only as links to their existing flows.
Do not expand them here.

## App flow

Create connected pages for:

- Researcher: New Work, Inbox/My works, Work, edit and submit, returned Work,
  requested changes, suggestion to a reviewed Work, and outcome.
- Proxy: Proxy Inbox and New Work, then reuse the researcher pages with **Acting for**
  visible throughout.
- Curator: review queue, Work review, Return or Request changes, Requests queue,
  request settlement, and outcome.

Use the existing Booktower backoffice shell and patterns. These should feel like
usable application pages, not diagrams: form controls accept input, choices work,
and buttons lead to the next page or state. There is no backend.

Show enough realistic content to establish the eventual page's feel: Work title and
type, contributors, identifier or provenance, project or funding, files and access,
deposit status, record visibility, the relevant message, proposed values and short
history. Show only what matters on that page and every action available there.

An actor's action stays in that actor's application and shows their resulting state.
The overview shows the effect on other actors. A separate prototype-only actor
switcher may open the receiving actor's state; it sits outside the app shell and is
clearly not product UI.

## Boundaries

- Use real content and controls with deliberately plain layout. Do not use empty
  boxes, settle production layout or polish every field.
- Give every state its own URL; back and refresh restore it.
- Add no actor, state, queue or action absent from the accepted analysis.
- Keep source, TBC and policy notes small, neutral and available only on deliberate
  inspection.
- Preserve complete labels and avoid horizontal scrolling at 375 px.

## Ready for review when

Every overview card opens its exact app state. Each actor can complete their path,
all visible actions work, and the other actors' resulting states can be inspected.
Use documented classes and icons, run `npm test`, inspect wide and narrow layouts,
and complete the accessibility pre-flight. Wait for prototype acceptance before
drafting Raven issues.
