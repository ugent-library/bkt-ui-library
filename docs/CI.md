# CI and its maintenance

What CI runs, what keeping it alive costs, and which parts are a human's job and
can't be automated. For what each individual check *does*, see the README
"Tests" section — not repeated here.

## What CI runs

On every pull request and push to `main`, GitHub Actions runs `npm test` on a
Linux runner: `check:partials`, `check:classes`, `check:html`, `check:a11y`. A
red result blocks the merge once the check is marked required.

`check:a11y-browser` (pa11y) is added later as a *separate, non-required* job. It
needs a running server and a headless browser, so it is more prone to flaky
failures and stays advisory until it has proven stable.

## Cost

Public repo: free, unlimited Linux minutes. Private repo: ~2,000 free minutes per
month; this job takes 1–3 minutes per run, so the cap is irrelevant, and a $0
spending limit is a hard stop. Cost only grows if someone opts into macOS/Windows
runners (10×/2× price) or a scheduled trigger — so don't.

## Maintenance — what it takes

CI itself is low-maintenance. The recurring work is keeping the *checks*
trustworthy:

- **Action versions go stale** (`actions/checkout`, `actions/setup-node`). A
  Dependabot config keeps them current as a one-line PR you approve. Roughly
  monthly, minutes.
- **Node version** in the workflow must match what the team runs locally. Bump it
  in the workflow when you bump it locally.
- **Dependency bumps change what "green" means.** A new `html-validate` major can
  add or retighten rules, turning passing code red. This is the one real
  surprise. Pin exact versions so bumps are deliberate; when you bump, expect to
  either fix flagged markup or adjust `.htmlvalidate.json`.
- **New legitimate patterns occasionally trip a rule.** Then you choose: fix the
  HTML, or loosen the rule in `.htmlvalidate.json` / `check-a11y.js` with a
  documented reason. That is owning the gate, not overhead.
- **pa11y flakiness** (once added): browser timeouts produce occasional false
  reds. Triage them; don't reflexively silence.

Realistic effort: ~1–2h one-time setup, then near-zero most months, with a short
spike whenever you bump a checker's major version.

## Your role — the parts no tool covers

The gate checks markup. It does not check whether the markup is *right for a
person*. These stay yours:

- **Policy calls when a rule and reality conflict.** Fix the code or change the
  rule — and record the decision (AGENT.md's open-question discipline). This is
  judgment, not automatable.
- **The manual-a11y layer:** screen-reader, keyboard, and contrast sign-off on
  real rendered pages. AGENT.md already names screen-reader testing a human
  responsibility; CI does not replace it.
- **Keep AGENT.md and the checks in sync.** When a house rule changes, update both
  the doc and `check-a11y.js`. A check that contradicts the doc erodes trust in
  both.
- **Approve dependency bumps** that change the gate.
- **Gatekeep merges** until branch protection is trusted, then let the required
  check do it.

## The one failure mode to avoid

A check that is wrong, flaky, or out of date gets ignored — people `--no-verify`,
force-merge, or stop reading the output, and the whole gate quietly dies. The
rule: **keep every check true, or delete it.** A smaller gate people trust beats
a big one they route around.
