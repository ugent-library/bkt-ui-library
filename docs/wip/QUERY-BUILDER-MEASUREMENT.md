# What we measure — query builder

*Product-owned why and what, per `notes/PLAN-measurement.md` (not in the repository — ask).
How — identifiers, event shape, log fields, sampling, storage, retention — is engineering's
and is deliberately absent. The raven instance of this plan is
[`QUERY-BUILDER-ISSUE-01-measurement.md`](QUERY-BUILDER-ISSUE-01-measurement.md).*

Product-side principles for this surface: measure surfaces, artifacts, and query structure — never people. No cookies, no user identifiers, no third-party trackers. What a request already reveals should not be re-collected client-side.

**Interpretation caveats, stated up front:** the authoring population is tiny (~19 queries/day), so every rate is a monthly trend, never a weekly number; baseline comparisons run year-over-year on matching academic periods (the log shows seasonal swings). A session that only checks the live count can be a fully successful session with zero copies — which is why builder conversion is measured but is **not** one of the bet's success measures.

## Non-negotiable — without these the bet cannot be evaluated

| Question | Success looks like | Failure looks like (the signal) |
|---|---|---|
| Can every real legacy query still be expressed and served? | every golden-set case passes before launch | any subset B case untranslatable, or a subset A case silently dropped |
| Do the power-tier authors stay with us after the replacement? | power-tier share of human searches holds at ~2.1%, year over year | a sustained drop — the replacement lost the audience it was built for |

The second one has a precondition, and it is equally non-negotiable: **humans must stay separable from machines** — the analysis's method distinction (form / link / direct / bot) has to remain reproducible after migration, or the baseline becomes incomparable and the measure is void.

## Diagnostic — informs the next iteration, nothing collapses without it

| Question | Success looks like | Failure looks like (the signal) |
|---|---|---|
| Does the builder produce artifacts at all? | sessions end in a copied URL, embed, API call, or a saved search | people build conditions and leave with nothing |
| Which output is the actual product? | one of link / embed / API / feed dominates copying, and we resource it | no signal, so investment stays evenly spread on guesswork |
| Do built queries dead-end? | zero-result queries are rare and recoverable | zero-result queries are common — too-narrow ANDs, wrong field, unexposed field |
| Do OR groups earn their complexity? | OR groups appear in real authored queries after launch | built, unused |
| Which fields and operators do people actually author? | usage concentrates in what we exposed | heavy use of a field we nearly cut, or zero use of one we prioritised |

One need cuts across the diagnostic set: **distinguish the authoring surface from the replay surfaces** (builder vs simple box vs embed vs API), since the same query means something different per surface.

If effort has to be cut, it comes out of the diagnostic table, never the non-negotiable one.

Where a question cannot be answered from what the server already sees, the acceptable tool class is cookieless and aggregate-only (Plausible: daily-rotating visitor salt, EU, open source, self-hostable). Hosting and DPO sign-off are team decisions.

**One conditional, stated explicitly:** the query-shaped diagnostics (fields, operators, paste sizes, OR-group usage, zero-result rate) are answerable from the request data if it carries the query and whether it found nothing. If that does not happen, we do **not** substitute client-side tracking — we accept that the OR-group question rests on the 2026-H1 log alone. This conditional applies only to the diagnostic table; the non-negotiable pair has no fallback.

## Deliberately dropped

- **Builder conversion as a bet success measure** — still measured (it answers "does the builder produce artifacts"), but not scored: it cannot distinguish a satisfied count-checker from a frustrated leaver, and it undercounts copies structurally.
- **Which share of inbound traffic is builder-authored** — a curiosity; no decision depends on the answer.
- **Embed render volume as a bet metric** — useful operationally, not evidence for or against this bet.
- **What the user did next after a zero result** — the recovery journey needs machinery disproportionate to the answer here; the zero-result rate alone is enough for design feedback.
- **Legacy-translator health** — belongs to the translator workstream, not this bet.
- **Retirement of the legacy UIs** — an output of the project, not a measure of it.

DPO note: session ids and query text are personal data; aggregation and retention rules per the main report's privacy section.
