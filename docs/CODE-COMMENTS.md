# Code comments

These rules apply to SCSS, JavaScript and HTML. The default is no comment.

## Keep

Keep a comment only when a later edit could break something silently or elsewhere:

- source order or specificity matters;
- another file reads the value;
- behavior changes only under an untested setting;
- a check outside visual review must pass;
- a temporary marker names its owner and removal trigger.

Write the shortest sentence that preserves the trap. Point to the owning doc for
detail.

```scss
/* `background` removes Bootstrap's select caret; set only the colour. */
background-color: var(--bt-white);
```

## Delete

Delete comments that contain:

- history, alternatives tried or old values;
- status, roadmap notes or an unnamed TODO;
- disabled code in `assets/` or `shell/`;
- a restatement of the selector or declaration;
- a copy of a table, contract or explanation maintained elsewhere;
- a walkthrough of code that clear names can replace.

History belongs in git. Product status belongs in a spec. Repeated contracts belong in
their owning doc.

## Navigation and machine syntax

Section banners may divide a long file. A label such as `/* Authors */` directly above
`.bt-work-card__authors` is not navigation and goes.

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

`npm run check:comments` rejects commented-out code. Review the rest against the code
beside it; semantic comment quality cannot be linted safely.
