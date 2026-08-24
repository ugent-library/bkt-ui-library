# Design decisions

This directory records why an accepted design choice exists. Use it when a choice may
need defending later, its trade-off is not visible in the interface, or future evidence
could justify revisiting it.

The current rule still belongs in its owning guide, prototype or code. A decision record
explains the choice; it does not become a second contract. Drafts and unanswered questions
stay in `docs/wip/`.

## Find a decision

Files use `DD-###-short-name.md`. Search by subject:

```bash
rg -n -i "search terms" docs/decisions
```

Find every current decision:

```bash
rg -l "^Status: Accepted$" docs/decisions/DD-*.md
```

## Record a decision

Copy [`TEMPLATE.md`](TEMPLATE.md), choose the next number and keep the record below the
500-word design-note ceiling in [`SPEC-WRITING.md`](../SPEC-WRITING.md).

Record:

- the decision in terms of what people see or can do;
- the evidence or constraint that made it preferable;
- the cost accepted with it;
- the concrete signal that would justify reopening it;
- links to the current guide, prototype, research or demand.

Do not record routine applications of an existing principle. Link to the principle instead.

## Replace a decision

Do not rewrite the old rationale. Add a new record, then connect both files:

```text
Status: Superseded by DD-019
```

```text
Status: Accepted
Supersedes: DD-012
```

The accepted record states the current decision. The superseded record remains evidence of
what was previously decided and why.
