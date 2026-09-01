# Feature workflow

Use this workflow for product work that moves from demand to a Booktower prototype
and then to Raven issues. The artifacts own different facts; do not merge them into
one specification.

## Start or resume

Start a Claude Code session with: `Use the biblio-feature-workflow skill to continue
<feature>.` Use `start <feature>` instead when no shared draft exists.

For a new feature, establish the demand, relevant persona, surface and domain
constraints before drafting. Add the feature to `docs/wip/README.md` when the first
shared draft exists.

For an existing feature, read its WIP entry and linked artifacts in order, then
inspect the current git changes. Report only:

- current stage;
- accepted decisions;
- questions that block this stage;
- next deliverable.

Continue without repeating finished work. Ask only when an answer changes the product
promise, visible behavior or scope. Record a backend unknown as an owned stub when the
visible design can proceed safely.

## Stages and gates

| Stage | Artifact and purpose | Gate |
|---|---|---|
| Evidence | Demand notes, personas, current code and domain sources establish the problem. | Claims are sourced or labelled assumptions. |
| Bet | `PRODUCT-BET-TEMPLATE.md` fixes the first useful release, no-gos, measures and ask. | Product accepts the direction and boundaries. |
| Flow | `FLOW-TEMPLATE.md` fixes entry, actions, outcomes, resumption, failure and concurrency behavior. | Product accepts every visible path; blocking choices are answered. |
| Wireframe brief | `WIREFRAME-BRIEF-TEMPLATE.md` fixes artifacts, states, preservation, responsive and accessibility requirements, and kit coverage. | Product accepts the build brief. |
| Prototype and kit | Full-page states show the experience. Canonical kit examples cover every reusable part used. | `npm test`, wide and narrow browser review, accessibility pre-flight and human design acceptance. |
| Issue handoff | `ISSUE-TEMPLATE.md` slices accepted work for Raven and links prototypes and kit patterns. Filed issues take ownership of implementation scope. | Live facts have owners; temporary drafts and the feature's WIP entry are removed. The design workflow is done. |

Create a design decision only when an accepted choice needs durable rationale or
supersedes an earlier design. Routine visible behavior stays in the prototype and its
owning guide.

## Prototype and kit rules

Build full-page prototypes and reusable coverage together. Inventory every reusable
part present on the changed pages. Link an existing canonical kit example, extend it
with missing states, or create and register a kit page when no owner exists. Related
parts may share one pattern page. Do not create a second example that competes with an
existing canonical page.

Preserve unrelated page regions and user changes. A wireframe brief must name the
existing regions that may change. Run the checks routed by `AGENTS.md`; static checks
do not replace browser or human screen-reader review.

## Issue handoff and cleanup

Do not draft issues until the user accepts the prototype and kit coverage. Issues
link visible design instead of narrating it, and describe only behavior the prototype
cannot show. Drafting files locally does not authorize filing issues or changing
Raven; do either only when the user asks.

Once the Raven issues exist, finish the design workflow immediately. Inventory each
requirement, decision, rationale, warning and open question, then move it to its live
owner:

- visible structure and interaction → prototype or canonical kit page;
- durable design rationale → accepted design decision;
- stable domain meaning → domain guide or Raven documentation;
- implementation scope, dependencies and invisible behavior → filed Raven issues;
- demand and priority → ProductBoard and its evidence.

Delete the feature's bet, flow, wireframe brief, local issue drafts and WIP entry after
their live facts have owners. Keep no local completion archive; git and the filed
issues retain history. Do not wait for Raven implementation to land.

Development feedback starts a new, bounded design review. Update the owning prototype,
kit page, decision or issue directly. Create a WIP note only when the feedback opens an
unresolved cross-owner question, then remove it when the answer reaches its owner. Do
not restore the old draft set.

## WIP status

While design work is active, each feature entry in `docs/wip/README.md` records:

```text
**Stage:** <current stage>
**Accepted:** <explicitly accepted artifacts or decisions>
**Blocking:** <questions that stop this stage, or None>
**Next:** <one concrete deliverable>
```

Update this block whenever the user accepts a gate, a blocker changes or the next
deliverable changes. Never infer acceptance from the existence of a draft. Remove the
entry during issue handoff cleanup.
