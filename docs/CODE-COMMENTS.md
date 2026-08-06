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

**History.** A comment annotates the code that is there, not the change that produced
it. If a reader can only understand it by knowing the diff — what was tried, what
broke, what a value used to be — it belongs in the commit message.

**Disabled code — in `assets/` and `shell/`.** Do not put `//` in front of rules you
might want back. Nobody after you can tell whether it is waiting for something or simply
forgotten, so it stays forever. Delete it; the commit you delete it in is the record.

This does not apply to `templates/` and the kit pages. Those are a prototype: blocking
markup out to finish in a later phase is how the work gets done, and a rule that made
you delete it would cost more than the clutter. `npm run check:comments` only looks at
`assets/` and `shell/` for this reason.

**Restating the declaration.** If the comment can be derived by reading the three
lines under it, it is noise. This is the most common failure and no linter catches it.

**A copy of something maintained elsewhere.** Every rotten comment found in the first
sweep was a copy: a px table beside the rem values, a token index above the tokens, a
target-height table repeated in four files, a purpose paragraph already in
`JAVASCRIPT.md`. None looked like noise — they looked maintained, and every one had
drifted. Prose explaining *why* had barely rotted at all.

Two things are not copies in this sense:

- **A one-line guardrail at the point of temptation.** `/* Colour with text-bg-*,
  never bg-* + text-* — see CLASS-USAGE.md */` sits where someone would otherwise add
  the wrong thing. Keep the rule, drop the reasoning, point at the doc.
- **A marker with a named owner and a removal trigger**, like the `⚠️ WIP` banners
  that go when the issues for that work are written. State the trigger in the comment
  so the next reader knows what retires it.

## Length

Drift risk scales with detail, so what stays in the file is decided by how detailed the
statement is, not by what it covers. One line saying what a file *is* costs nothing and
changes only when the module's job changes — keep it, so opening the file orients you.
A paragraph mirroring a doc's description is what rots. Shortest true statement in the
file, detail in the doc.

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
the file. It may not restate how the component is *used* — that is `CLASS-USAGE.md` /
`JAVASCRIPT.md`.

**HTML block markers.** A closing marker names the block it ends, on the closing tag:

```html
</div><!-- /c-results-list -->
```

Use the element's id, or the class that distinguishes it. Put one where the opening tag
is far enough away that finding it means scrolling.

An opening label is a different thing and answers a different question. At the element,
the class already tells you what it is; while scrolling, the comment is the only line at
that indent that reads as a word. So label a block you would otherwise hunt for — around
forty lines and up in practice — and nothing shorter. `<!-- Title -->` over a three-line
`<h2 class="bt-work-card__title">` is noise; `<!-- Header -->` over ninety-seven lines is
a landmark. A missing label reads as "not a landmark", never as "forgotten", so this one
does not need to be exhaustive.

**HTML directives** (`@state`, `@surface`, `@include`) are a machine-read vocabulary,
not comments. They are documented in `SERVER.md` and `SURFACES.md` and nothing here
applies to them.

## Per language

**SCSS** — `//` is stripped at compile; `/* */` ships to `booktower.css`, which
consuming apps read. Use `//` unless the comment is deliberately addressed to someone
reading the compiled file.

**HTML and JS** — every comment ships to the browser and is visible in view-source.

## What is checked

`npm run check:comments` (part of `npm test`) fails the build on code that has been
commented out rather than deleted, in `assets/` and `shell/`. That is the only rule here
a machine can decide. History and restatement are not mechanically detectable — an
earlier attempt matched on words like *was* and *removed*, which catch real cases once
and then only misfire. They need a pass over your own diff, reading each comment against
the code it sits above, deleting by default.
