# Code comments

Applies to SCSS, JS and HTML in this repo. Prose in bets, issues and design docs
follows `WRITING-RULES.md` instead.

**The default is no comment.** Code that needs prose to be readable usually needs
better names or smaller rules. A comment is a claim that the code alone is not
enough — most of the time that claim is false, and the comment rots while the code
moves on.

## The test for keeping one

Add a comment only when a later change would break something **silently or
non-locally**: it breaks a different element, depends on source order, relies on a
value defined elsewhere, or must satisfy a check outside visual review (WCAG
contrast, a z-index tier, a query-param raven expects).

If breaking it fails **loudly and locally** — visible at once in review or the
browser — no comment. Keep the ones you write to a few words.

```scss
/* keep — fails only under a setting you do not have on */
animation-duration: .01ms !important;
// without this, infinite animations blur at .01ms/turn instead of stopping
animation-iteration-count: 1 !important;

/* delete — the selector already says this */
/* Title */
.bt-work-card__title { … }
```

Height changed by the wrong padding token, a colour that lost its contrast in the
browser, a layout that collapsed — all loud. No comment. A rule that only misbehaves
under `prefers-reduced-motion`, or a value another file reads, is the case.

## Never

**History.** A comment annotates the code that is there, not the change that
produced it. If a reader can only understand it by knowing the diff — what was
tried, what broke, what a value used to be — it belongs in the commit message.
`/* was 2.25rem — larger for public h1 */` tells the next reader nothing they can
act on.

**Disabled code.** Do not put `//` in front of rules you might want back. Nobody
after you can tell whether it is waiting for something or simply forgotten, so it
stays forever. Delete it; the commit you delete it in is the record.

**Restating the declaration.** `/* Pill search input with inset search icon */`
above the rule that sets a pill radius and an inset icon. If the comment can be
derived by reading the three lines under it, it is noise. This is the most common
failure and no linter catches it.

**A copy of something maintained elsewhere.** Every rotten comment found in the first
sweep was a copy: a px table beside the rem values, a token index above the tokens, a
target-height table repeated in four files, a usage note already in `CLASS-USAGE.md`.
None of them looked like noise — they looked maintained, and every one had drifted.
Prose explaining *why* had barely rotted at all. If a comment restates a value, a list,
or a doc section, it will go stale and nothing will tell you.

The exception is a one-line guardrail at the point of temptation: `/* Colour with
text-bg-*, never bg-* + text-* — see CLASS-USAGE.md */` sits where someone would
otherwise add the wrong thing. Keep the rule, not the reasoning; point at the doc for
the rest.

## Categories that are not explanations

**Section banners** (`/* ── Focus rings ── */`) are navigation in long files. Keep
them. A *label* that repeats the selector under it (`/* Authors */` above
`.bt-work-card__authors`) is not navigation — delete it.

**File headers.** A file may carry a header when it states something you must know
*while editing this file* that the code does not say: a constraint (`_header.scss`: no
web fonts), a trap (`_bootstrap-components.scss`: `background-color`, not the
shorthand), a host-page contract (`people-search.js`: the required `data-ps-*`
elements), or a prototype boundary (`people-search-stub.js`: delete this file when the
endpoint lands). A doc you have to already know about does not reach the person editing
the file.

It may not restate how the component is *used* — that is `CLASS-USAGE.md` /
`JAVASCRIPT.md`, and the copy inside the file is the one that goes stale.

**HTML directives** (`@state`, `@surface`, `@include`) are a machine-read
vocabulary, not comments. They are documented in `SERVER.md` and `SURFACES.md` and
nothing here applies to them.

## Per language

**SCSS** — `//` is stripped at compile; `/* */` ships to `booktower.css`, which
consuming apps read. Use `//` unless the comment is deliberately addressed to
someone reading the compiled file.

**HTML and JS** — every comment ships to the browser and is visible in view-source.

## What is checked

`npm run check:comments` (part of `npm test`) fails the build on history words and
on commented-out code in `assets/` and `shell/`. Restatement is not mechanically
detectable — it needs a pass over your own diff, reading each comment against the
code it sits above, deleting by default.
