---
name: biblio-feature-workflow
description: Start, inspect, resume or advance Booktower product work from evidence through prototype, kit coverage, Raven issue handoff and WIP cleanup.
---

# Biblio feature workflow

1. Read `docs/FEATURE-WORKFLOW.md` in full.
2. For an existing feature, read its entry in `docs/wip/README.md`, its linked
   artifacts in order and the current git diff. For a new feature, read the evidence,
   persona, surface and domain sources routed by `AGENTS.md`.
3. Before editing, report the current stage, accepted decisions, blockers and next
   deliverable. Do not ask the user to repeat decisions already recorded.
4. Work only on the current stage. Use the relevant template and the specialized bet
   or issue skill named in `AGENTS.md` when that stage applies.
5. Stop at each gate in `docs/FEATURE-WORKFLOW.md`. Advance only after explicit user
   acceptance. A backend unknown may remain a labelled stub only when it does not
   change the visible product promise.
6. During prototype work, build canonical kit coverage alongside full-page states.
   Preserve unrelated regions and existing user changes.
7. Update the feature's WIP status when a gate, blocker or next deliverable changes.
   Do not mark a draft accepted merely because it exists.
8. Draft Raven issues only after prototype and kit acceptance. Never file them or
   mutate Raven unless the user asks.
9. Once filed issue links exist, run the handoff cleanup in `docs/FEATURE-WORKFLOW.md`.
   Move live facts to their owners, delete temporary feature drafts and remove its WIP
   entry. Do not wait for implementation to land.

Return the completed artifact for the current stage. After it, list only questions
that block the next action.
