---
name: prose-audit
description: Audit changed prose against the writing rules with per-sentence keep/delete verdicts, then delete-only apply. Use when M asks to audit, recheck or cut prose, asks whether the writing rules were applied, or after any pass that edited docs, kit prose or template copy.
---

# Prose audit

Two phases. Never combine them.

## Audit (default)

Scope: sentences added or changed in the named files, else in `git diff HEAD`.
Rules: `docs/SPEC-WRITING.md`; add `docs/KIT-PAGES.md` for kit pages and
`docs/CODE-COMMENTS.md` for comments.

When this session wrote the prose, run the audit in an Explore subagent given only
the diff and the rule files, and relay its verdicts.

Output one verdict per sentence: the sentence, **keep** or **delete**, and the rule
that decides it. No edits, no rewording, no rephrasing proposals. "All keep" is a
valid result. End with the prose word count per file.

## Apply (only on M's explicit go)

Delete the delete verdicts. Change nothing else: no replacement framing, no
pointers, no relocation into comments. Report word counts before and after — the
count only moves down — and run `npm run check:prose`.
