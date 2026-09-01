# <Feature> — HTML wireframe brief

<!-- Follow docs/SPEC-WRITING.md. Maximum 500 words. -->

Build <phase and surface>. Label unresolved backend behavior as prototype stubs.

## Read first

`AGENTS.md` · [bet](<FEATURE>-BET.md) · [flow](<FEATURE>-FLOW.md) · <domain owners> ·
<accepted decisions>.

## Prototype artifacts

1. <full-page template or existing region to change>
2. <new page and purpose>
3. <existing flow to reuse rather than duplicate>

Name every existing page region that may change. Preserve all other work.

## State inventory

| Surface | State | Must make visible |
|---|---|---|
| <surface> | <state> | <content, status and actions> |

Include empty, success, failure, stale/concurrent and resumed states when they apply.

## Reusable kit coverage

| Part used by the prototype | Canonical kit page | Work needed |
|---|---|---|
| <element, partial or pattern> | <existing page or New> | Link, extend or create/register |

Every reusable part present on the changed pages needs canonical live coverage.
Extend an existing page before creating another owner. Related new patterns may share
one page.

## Interaction, responsive and accessibility rules

- Name the primary action and visual order of secondary actions.
- Define URLs, back/refresh behavior, focus after replacement and live announcements.
- Preserve complete labels; define stacking or reflow at narrow widths.
- Name candidate-specific semantic and accessible-name requirements.
- Verify desktop, narrow split-screen and 375 px without horizontal scrolling.

## Boundaries

<!-- State exclusions and preserved behavior. Do not hide unresolved scope here. -->

## Ready for review when

Every state is selectable, every reusable part has canonical kit coverage, documented
classes and icons are used, and `npm test` passes. Inspect wide and narrow pages in the
browser, run the accessibility pre-flight and record when screen-reader testing was
not performed. Wait for prototype acceptance before drafting Raven issues.
