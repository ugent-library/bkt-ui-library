# Code comments

These rules apply to SCSS, JavaScript and HTML. The default is no comment.

## Keep

Keep a comment only when a later edit could break something silently or elsewhere:

- source order or specificity matters;
- another file reads the value;
- behavior changes only under an untested setting;
- a check outside visual review must pass;
- a `To do:` marker names work the code still needs;
- a class has no Bootstrap counterpart: write `no Bootstrap equivalent`;
- an opaque code carries its plain name, as the faculty tokens do;
- a prototype fixture or stub names what production replaces.

Write the shortest sentence that preserves the trap. Point to the owning doc for
detail.

Prototype HTML has one additional case. A concise `Prototype note:` may identify a
provisional nearby fixture, state, inert control or open design choice when the nearby
markup is its single source owner. Do not create a document that only repeats the
note. Move it to `docs/wip/`, an issue or a design decision when it must be repeated,
changes another contract, requires coordination or carries durable rationale.

```scss
/* `background` removes Bootstrap's select caret; set only the colour. */
background-color: var(--bt-white);
```

## Delete

Delete comments that contain:

- history, alternatives tried or old values;
- routine status or roadmaps;
- disabled code in `assets/` or `shell/`;
- a restatement of the selector or declaration;
- a copy of a table, contract or explanation maintained elsewhere;
- a walkthrough of code that clear names can replace.

History belongs in git. Product status belongs in a spec. Repeated contracts belong in
their owning doc.

## Navigation and machine syntax

A section banner may divide a long file. Write it as `/* ── Name ─── */` with the rule
extended to the right margin, and only when the section it opens holds more than one
rule. A label in any other shape, such as `/* Authors */` directly above
`.bt-work-card__authors`, is not navigation and goes.

A file header may name one editing constraint or link its contract. Keep it to three
lines. Do not duplicate the contract in the header.

An HTML block marker is useful only when its opening tag is far enough away to require
searching. Put the closing marker on the closing tag:

```html
</div><!-- /results-list -->
```

HTML directives such as `@state`, `@surface` and `@include` are machine syntax, not
explanatory comments.

## Language notes

SCSS `/* */` comments ship in `booktower.css`; write them for consumers. SCSS `//`
comments stay in source. HTML and JavaScript comments ship to the browser.

`npm run check:comments` rejects commented-out code. A hook runs
`scripts/check-new-comments.js` on each file an agent edits; it rejects any comment
added to `assets/scss/`, `shell/scss/` or `assets/js/` since `HEAD`. Banners, file
headers, `To do:` markers, prototype notes and the `no Bootstrap` phrase pass. `--list` inventories
every comment a sweep must rule on. Review the rest against the code
beside it; semantic comment quality cannot be linted safely.
