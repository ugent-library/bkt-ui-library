# What we measure — query builder

This is the product-owned measurement contract. Raven implementation issue:
[`QUERY-BUILDER-ISSUE-01-measurement.md`](QUERY-BUILDER-ISSUE-01-measurement.md).
Engineering owns identifiers, storage, sampling and retention.

Measure surfaces, artifacts and query structure, never people. Use no cookies, user
identifiers or third-party trackers. Compare monthly trends year over year because the
authoring population is about 19 queries a day and varies by academic period.

## Release measures

| Question | Success | Failure |
|---|---|---|
| Can every accepted legacy query still be expressed and served? | Every golden-set case passes before launch | A subset B case fails, or a subset A case disappears without an accepted exception |
| Do power-search authors stay after replacement? | Power search keeps about 2.1% of human searches year over year | A sustained drop |

The second measure depends on keeping human and machine requests separable under the
current form, link, direct and bot classification. Without that comparison, the measure
is void.

## Diagnostics

| Question | Useful signal | Warning signal |
|---|---|---|
| Does the builder produce artifacts? | A copied link, embed, API call, feed or saved search | Conditions built, no artifact |
| Which artifact matters most? | One form dominates | No signal; investment stays evenly spread |
| Do queries dead-end? | Zero-result queries are rare | Repeated empty queries |
| Do OR groups earn their complexity? | They appear in authored queries | Built, unused |
| Which fields and operators matter? | Use concentrates in the exposed set | Heavy use of a nearly cut field, or none for a priority field |

Distinguish the authoring surface from replay through simple search, embeds and APIs.
If scope must shrink, cut diagnostics before release measures.

Query diagnostics are available only if a request carries the query and whether it
found results. Do not replace missing server evidence with client-side tracking.

## Not scored

- Builder conversion: a person who only checks the count may have succeeded.
- Inbound share from builder-authored URLs: no decision depends on it.
- Embed volume: operational evidence, not proof that the bet worked.
- Post-zero-result behavior: the zero-result rate is enough for design feedback.
- Translator health and legacy-UI retirement: separate workstreams.

Session IDs and query text are personal data. Aggregation and retention require DPO
review.
