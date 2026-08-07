# Design detail — query builder (Advanced search)

*Companion to [`QUERY-BUILDER-BET.md`](QUERY-BUILDER-BET.md). The bet states the goal; this file carries the design detail, the evidence-to-decision mapping, what raven already defines, and the instrumentation list. Consumed by the wireframe/prototype work and by raven when integrating.*

## Evidence → design decisions

From the full-log verification (`QUERY-BUILDER-EVIDENCE.md`):

| finding | design decision |
|---|---|
| 64% of human power queries have one condition, 90% at most two, AND-joined | flat AND-joined condition rows are the core; the builder must excel at the 1–3 condition case |
| free text (`basic`) is the #2 field (676 uses) | free text is an ordinary condition row ("any field — contains — …", maps to raven's `q`), not a separate box |
| 75% of human ORs are a value list within one field; people paste 50+ DOIs/ids | "is any of" with paste support is the primary OR affordance |
| the author/editor idiom is 54% of expert/direct (18.4M hits) | person conditions filter raven's unified `contributors` list, any role by default, optional role narrowing — the idiom disappears into the data model |
| year ranges in 5.4% of human power queries; legacy supports them | year range condition in phase 1 |
| remaining cross-field ORs are rare but real | OR groups in phase 2, AND-first shape (below) |
| *(new, from the full form extract)* `<>` "is not" in 178 queries (5.0%) — on `file.access`, `classification`, `affiliation`, `type`, `subject` | "is not" is a phase 1 operator, not an afterthought; it was invisible in the earlier pass because `<>` was counted as a range |
| *(new)* real batch sizes: `id` lists up to **763 values**, longest query **9,336 chars**; 34 queries > 2,000 chars | paste-a-list is confirmed, and the URL grammar needs a length answer (design item 7) |

## Design items beyond the bet's summary

0. **Two person rows are a co-author query, not a list.** `author exact X AND author exact Y` is 10.2M replayed hits (14% of machine traffic). So the builder must allow several person conditions on the same field, AND-joined, and the preview and the URL must keep them distinct from one "is any of" list — the two look similar and mean the opposite. Concretely: adding a second person row never collapses into the first row's value list, and the preview reads "contributor is X **and** contributor is Y".
1. **Field type drives everything.** The chosen field determines the operators offered; the operator determines the input widget: text, select (type, classification, affiliation, publication status), person/record typeahead (contributor, project, parent/publication), year range, paste-a-list (id, doi). Operators in plain language ("is", "is not", "contains", "is any of", "between").
2. **OR groups, AND-first shape.** The top level is always AND-joined rows; a row can be an OR group of conditions. No per-row AND/OR toggle, no free nesting. This maps 1:1 onto raven's `QueryFilter`: a conjunction of clauses, where a clause is a terms filter (natively "any of the given terms"), a NOT, or an OR group. Shared conditions are never duplicated and the query reads as one sentence. (The OR-first alternative — OR-joined groups of AND rows — duplicates shared conditions across groups and was rejected.)
3. **Live count cost model.** A count is a normal index query with page size 0 — OpenSearch computes the total without fetching records, so a single count is cheap. The cost driver is frequency: count-as-you-build fires on every edit from an anonymous page. Containment is standard: fire only on complete conditions, debounce, cancel superseded requests, rate-limit like any public search route. Under abuse it degrades to count-on-demand; the builder stays fully usable without it.
4. **Per-condition evaluation is a QA tool, not a page feature.** Checking a built query against a known record — per condition, pass/fail — is how *we* verify the builder against the golden set. It does not ship on the page: the audience debugging a query is us, not the user. If support ever needs it, it belongs in the backoffice, not in public Advanced search.
5. **Readable preview.** The query as a pill sentence (`type is [Journal article] AND affiliation is [Sciences]`), copyable, human labels everywhere (`has file`, not `has_file is yes`).
6. **Goal-first framing.** Above the rows: "Show research output where …" — anchors what AND means (Zapier's "Only continue if…" lesson).
8. **The embed tab has three controls, not one.** Sort (default newest-first), **citation style** (the legacy `style=apa`), and whether the surrounding info block shows (`hide_info=1`). Those are the only two legacy embed parameters that exist in the wild, so the tab covers the whole existing contract and adds nothing.
7. **Batch queries hit the URL ceiling.** The biggest real human queries are id batches: median 18 values, max 763, longest query 9,336 characters (34 queries above 2,000). A query-string-only URL grammar cannot carry those as a permalink — proxies and browsers truncate. So the contract needs an answer for long value lists: saved search as the shareable artifact, a server-side short id for the list, or an explicit documented ceiling with a clear failure message. This is a decision, not a detail: today those queries exist and work.

## What raven already defines

The builder invents no query model; it authors what raven has:

- **`QueryFilter`** (`search.go`) — the filter grammar (see design item 2).
- **Public search URLs** — `/works?q=…&facet=value`: free text plus terms filters. No OR-group, NOT, or range serialization yet; the URL grammar is raven's to design (bet, rabbit hole 1).
- **Range filters** — not in the model yet; noted as "future: range" in `Facet.Type`.
- **Saved searches** — `saved_searches` exists (user-scoped; running one redirects to the live search URL).
- **Representations** — JSON/JSONL/CSL codecs exist, marshaled on demand; a public query-API surface is raven's to define.
- **SRU 1.2** (`sru/`) — a library-standards protocol (Search/Retrieve via URL) for harvesters; deliberately minimal in raven. Not the builder's output target; the builder leaves it alone.

## Field selection — mapping, not wholesale exposure

The builder does not expose raven's whole field registry. Two decisions per field: the legacy CQL name maps onto which raven field, and is that field publicly queryable at all. Example of what the mapping exercise looks like (illustrative, not decided):

| legacy CQL field | raven concept (example) | public in builder? |
|---|---|---|
| `author` | `contributors` (person ref, role-distinguished) | yes |
| `parent` | host publication (related work / imprint) | yes |
| `classification` | `classifications` (value + scheme, e.g. scheme `ugent-bibliography`) | yes |
| `file.access` | `open_access` trait / file access level | yes |
| `basic` | free-text `q` | yes |
| `keyword` / `subject` | subject keywords (23.7M replayed hits, the biggest machine field) | yes |
| `issn` | host publication identifier — a journal-scoped list | yes |
| `promoter` | contributor role, not a field: person condition "as supervisor" | yes, as a role |
| `external` | external research output — already shown publicly on biblio, researchers record it themselves | yes, with a plain-language label |
| `jcr.category` | journal-metrics category (in active use) | yes, if raven carries the field |

The full untruncated field histogram (both form tiers, n=3,589) is in `_powerquery/`: **40 distinct field names are human-authored**, not ~16 — the report published top-15 lists. The tail is small but real (`language` 57, `articletype` 44, `publisher` 34, `keyword` 32, `embargo` 32, `subject` 30, `vabb_approved` 29, `misctype` 29, `editor` 27, `datecreated` 19, `accesslevel` 15, `conferencetype` 10, and a handful of one-offs). Two rules follow:

- **Absence from the authored log is not evidence of no need.** The old advanced UI only offered the fields it offered; anything it lacked shows up as zero, or as a defection to expert search. The clearest case: `doi` is authored 644× in expert/form and **1×** in advanced/form. People went to the query language to do DOI lookups. Same signature for `file.access` (63 vs 263), `subject` (0 vs 30), `embargo` (1 vs 31), `datecreated` (1 vs 18). That is the unmet-need evidence the bet says the log cannot show — it can, in the delta between the two tiers.
- **Machine-only is a measurement, not a verdict.** Only three fields have machine hits and zero authored uses: `issn` (1.27M hits), `promoter` (149K), `jcr.category` (34K). "Never authored" here means "never offered": a journal-scoped list (`issn`) is a bibliographer's core task, and `promoter` is not a field at all in the new model — it is a contributor role, so it disappears into the person condition ("as supervisor"). All three are exposed. `external` is a normal public attribute — external research output is already public on biblio and researchers record it themselves — and `jcr.category` is in active use, so it follows raven: if the field exists there and is publicly queryable, the builder offers it. The rule that remains is a single test per field: does raven expose it publicly? Full list: `QUERY-BUILDER-GOLDEN-SET-METHOD.md` § Per-field exposure list.

The mapping is done with the team against raven's registry. The golden set (below) forces this decision per field: any legacy field the builder does not expose still has to be translated, and that asymmetry has to be recorded, not discovered at launch.

## What we need to measure

Follows `PLAN-measurement.md`: **why and what are product decisions** — stated here as questions with their success and failure signals. **How** (identifiers, event shape, log fields, sampling, storage, retention) is engineering's call and is deliberately absent below.

Product-side principles for this surface: measure surfaces, artifacts, and query structure — never people. No cookies, no user identifiers, no third-party trackers. What a request already reveals should not be re-collected client-side.

**Interpretation caveats, stated up front:** the authoring population is tiny (~19 queries/day), so every rate is a monthly trend, never a weekly number; baseline comparisons run year-over-year on matching academic periods (the log shows seasonal swings). A session that only checks the live count can be a fully successful session with zero copies — which is why builder conversion is measured but is **not** one of the bet's success measures.

### Non-negotiable — without these the bet cannot be evaluated

| Question | Success looks like | Failure looks like (the signal) |
|---|---|---|
| Can every real legacy query still be expressed and served? | every golden-set case passes before launch | any subset B case untranslatable, or a subset A case silently dropped |
| Do the power-tier authors stay with us after the replacement? | power-tier share of human searches holds at ~2.1%, year over year | a sustained drop — the replacement lost the audience it was built for |

The second one has a precondition, and it is equally non-negotiable: **humans must stay separable from machines** — the analysis's method distinction (form / link / direct / bot) has to remain reproducible after migration, or the baseline becomes incomparable and the measure is void.

### Diagnostic — informs the next iteration, nothing collapses without it

| Question | Success looks like | Failure looks like (the signal) |
|---|---|---|
| Does the builder produce artifacts at all? | sessions end in a copied URL, embed, API call, or a saved search | people build conditions and leave with nothing |
| Which output is the actual product? | one of URL / embed / API dominates copying, and we resource it | no signal, so investment stays evenly spread on guesswork |
| Do built queries dead-end? | zero-result queries are rare and recoverable | zero-result queries are common — too-narrow ANDs, wrong field, unexposed field |
| Was phase 2 (OR groups) worth building? | OR groups appear in real authored queries after launch | built, unused |
| Which fields and operators do people actually author? | usage concentrates in what we exposed | heavy use of a field we nearly cut, or zero use of one we prioritised |

One need cuts across the diagnostic set: **distinguish the authoring surface from the replay surfaces** (builder vs simple box vs embed vs API), since the same query means something different per surface.

If effort has to be cut, it comes out of the diagnostic table, never the non-negotiable one.

Where a question cannot be answered from what the server already sees, the acceptable tool class is cookieless and aggregate-only (Plausible: daily-rotating visitor salt, EU, open source, self-hostable). Hosting and DPO sign-off are team decisions.

**One conditional, stated explicitly:** the query-shaped diagnostics (fields, operators, paste sizes, OR-group usage, zero-result rate) are answerable from the request data if it carries the query and its result count. If that does not happen, we do **not** substitute client-side tracking — we accept that phase 2's go/no-go rests on the 2026-H1 log alone. This conditional applies only to the diagnostic table; the non-negotiable pair has no fallback.

### Deliberately dropped

- **Builder conversion as a bet success measure** — still measured (it answers "does the builder produce artifacts"), but not scored: it cannot distinguish a satisfied count-checker from a frustrated leaver, and it undercounts copies structurally.
- **Which share of inbound traffic is builder-authored** — a curiosity; no decision depends on the answer.
- **Embed render volume as a bet metric** — useful operationally, not evidence for or against this bet.
- **What the user did next after a zero result** — the recovery journey needs machinery disproportionate to the answer here; the zero-result rate alone is enough for design feedback.
- **Legacy-translator health** — belongs to the translator workstream, not this bet.
- **Retirement of the legacy UIs** — an output of the project, not a measure of it.

DPO note: session ids and query text are personal data; aggregation and retention rules per the main report's privacy section.

## Golden query set

**The draft set exists: [`QUERY-BUILDER-GOLDEN-SET.md`](QUERY-BUILDER-GOLDEN-SET.md), 208 cases, all values fixtures.** Evidence and method: [`QUERY-BUILDER-GOLDEN-SET-METHOD.md`](QUERY-BUILDER-GOLDEN-SET-METHOD.md). What remains is human work, not extraction: the per-field exposure decisions, the phase labels, and sign-off on any subset A case labelled phase 2.

### Two subsets, two contracts

| subset | source | contract | owner | gate |
|---|---|---|---|---|
| **A — builder expressibility** | human `form` queries (advanced + expert, n=3,589) | the builder can author this query | **prototype** | every case is either expressible in phase 1, or labelled *phase 2* / *field not exposed* with sign-off |
| **B — translator fidelity** | all of A **plus** machine `direct`/`link` traffic and legacy embed parameters | the legacy query keeps resolving to the right new query | raven | 100%, no exceptions — this is the "100% keeps working" constraint |

B is strictly larger than A, and it is **not prototype scope**: it is the translator workstream's requirements list, recorded here because this is where the evidence lives. The prototype is judged on A only.

Automation: `_powerquery/golden-queries.json` carries the same cases machine-readably (case id, structure, fixture query, subset, phase, observed frequency) so a test runner can iterate them instead of a human reading a table.

### Case classes (measured)

1. **Field × operator matrix.** 40 human-authored field names; operators `=`, `exact`, `any`, `all`, `<>`, `>=`, `<=`, `<`, `>`. ~70 non-empty cells — one case each. Empty cells are out of scope by evidence, recorded as such.
2. **Value lists / paste batches.** `id`: n=235, median 18 values, **max 763**, 58 queries ≥50 values. `identifier` max 200, `project` max 189, `author` max 99, `affiliation` max 41, `year any` max 13. Cases: max + median per list-capable field.
3. **OR shapes.** 181 queries (5.0%). The dominant real shape is one field with many values — often written longhand as `author exact X OR author exact Y OR …` chains up to 85 terms, precisely because no list input exists. The genuinely composite shapes are few and enumerable: `(parent OR publisher) AND year`, the author/editor idiom (22×), `datecreated range OR type`, `title AND language any`. Every distinct composite signature is a case; the phase 1 / phase 2 line runs through this list.
4. **Ranges.** True ranges are `year` (132 `>=`, 25 `<=`, 25 `>`, 17 `<`) and `datecreated` (10 `>=`, 9 `<=`); 54 queries are two-sided. **Correction to the report:** its "195 range queries" counted `<>` (not-equal) as a range. They are two different operators and both need cases.
5. **Complexity stress.** Condition counts: 1 (2,046), 2 (838), 3 (215) — the 1–3 claim holds for 86% — but the tail runs to 85 terms. The six longest queries are all single-field `id` batches, up to 9,336 characters. Cases: the longest of each shape, because layout, preview and URL break here first.
6. **Machine contract.** Measured over all 72.9M machine lines (direct + link, both power tiers), hit-weighted: **the top 25 query structures are 98.9% of all hits**, the top 50 are 99.7%. The set carries 36 cases (to 99.5%). Biggest four: the author/editor idiom (26.2%), `keyword exact V` (15.1%), `author exact X AND author exact Y` (14.0%), and idiom + keyword (12.7%). The co-author one matters for the grammar: two same-field conditions AND-joined must stay distinguishable from one "any of" list, or the URL silently flips AND into OR.
7. **Degenerate and hostile input, observed.** 85 queries with zero parseable conditions (bare text submitted to a power form), empty right-hand sides (`file.access <>` 18×, `subject <>` 9×), duplicate conditions (`author=X AND author=Y`, 22×), stray tokens parsed as fields (`for`, `of`, `field`), and injected HTML/JS in the log. Expected behaviour has to be decided, not just observed; the parser fails closed.
8. **Legacy embed parameters.** Exactly two exist in the wild: `;hide_info=1` and `;style=apa`. `style=apa` is a **citation style**, not a sort order — so the embed tab carries sort, citation style and the info-block toggle in phase 1 (design item 8).

717 distinct human query structures exist after value normalization. The set is 208 cases — 85 matrix cells, 55 OR signatures, 36 machine structures, and the rest batches, ranges, stress and degenerate input. It covers the frequent structures plus the extremes, not everything. Stated, not hidden.

### Selection rule (so the set is reproducible)

Reduce every logged query to a **structural signature**: the multiset of (field, operator) pairs + the boolean shape + a value-count bucket (1 / 2–9 / 10–49 / 50+). Deduplicate on signature; per signature keep the highest-frequency example, and additionally the longest example where value count matters. Deterministic, re-runnable when the log grows, and reviewable — each case carries its signature and its observed frequency, so anyone can see why it is in the set.

### What "passes" means

Assert on the **produced query object / URL**, not on result counts: the translator's output must equal the expected `QueryFilter` (or public URL), and the builder must round-trip URL → builder state → URL unchanged. Counts depend on index state and would make the gate flaky. Semantic equivalence against a small fixture index is a useful extra, not the gate.

### Care

Cases contain personal data (names, person IDs, and in the direct head, real bookmarked URLs). Values get anonymized against fixture records per the DPO rules before the set is shared or committed; the structure is what is being tested, not the people.

## Prototype conventions

- One template; each phase is a template state (per repo convention: states inside the one file), so every phase is visible and testable.
- The prototype shows the full dream including OR groups — phase 1's layout leaves room, nothing needs redesigning later.
- All URLs in the prototype are placeholders; the prototype never invents URL grammar.
- Surface: public. AGENTS.md pre-flight checklist applies.
