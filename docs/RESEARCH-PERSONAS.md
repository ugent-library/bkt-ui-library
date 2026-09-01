# Personas — Biblio deposit, curation & discovery

From user testing. Sources: Plato testing (2023 depth interviews + 2023–24 proxy/researcher tasks), Dashboard testing, Librarian interviews and testing (2022).

Evidence: proxies + curators well-grounded. Researchers = enthusiast profs + a few self-depositing researchers (over-represents skill). Untested: PhD candidate depositing own thesis. The **public / discovery** profiles below were *not* tested locally — they come from external discovery-UX literature + raven `public-site-semantics.md`, and are flagged as such.

## Depositor competence axis
Who enters records, and whether they *verify* — the strongest predictor of data quality.

| Profile | Verifies? | Design response |
|---|---|---|
| Marie Curator (curators) · Rhea View (reviewers) | yes — deposit is their profession; the gold standard | expert power tools; never slow them down |
| Claire Searcher · Otto Thor (researchers) | yes — even re-checks others' work | trust; autonomy + easy self-correct |
| Paula Proksy (expert registrar) | yes, thoroughly | speed/batch tools, stay out of the way |
| Stan Standish (needs guidance) | knows they can't → asks | defaults, examples, help line |
| Guy Guest (confident guesser) | thinks so; doesn't → silent errors | validation/friction that catches wrong guesses; flag unverified answers |

Reviewers and curators deposit and curate: they enter old records, PDF drops, corrections and archival material + they're the safety net that catches Guy Guest's guesses.

---

## Claire Searcher — "oversees, won't be bothered"
**Researcher profile**
*Based on: 2 full professors (Engineering).*

- **Does:** own output + master theses; checks doctorates. Biblio in bursts, ~3×/year.
- **Wants:** one master list (incl. draft/locked/withdrawn), per-category export, auto-inflow (WoS/ORCID/FWO), correct co-author funding.
- **Pain:** can't see everything under their name (drafts private); cross-uni co-authors don't notify → wrong funding; FWO export messy.
- **Needs:** proxies; search own records; don't pester them — route nudges to their registrar.
- *"Every year I check everything — hard to keep up, a lot of wasted time. I want a master list."*

**Variant — Otto Thor (self-depositing author).** *Based on: an FWO postdoc + an assistant prof.* Deposits own output for reporting/funding/grant applications; deadline-driven (fast when publishing, else batch). Wants: WoS import; one-page form (dislikes tabs); ability to self-correct after publish; contact close to the moment of entry (profs prefer batched, postdocs tolerate frequent).

## Paula Proksy — "dedicated group registrar" (high-volume, expert)
**Proxy profile**
*Based on: a VIB institute coordinator (~400–500 researchers) + faculty ATPs (imec, secretariat).*

- **Does:** registers A1/A2/P1/books for a whole group. PubMed/WoS → EndNote or internal SharePoint working doc → Biblio, 1–2 slots/week (some daily). Knows OA/funding/access cold. Some build their own tools to stop researchers sending bad data.
- **Pain:** departments don't autofill (keeps removing her own); co-authors don't tag UGent authors → she finds out late, has to email; people not findable (initials); no in-app messaging.
- **Needs:** auto/suggested departments; batch author add + keybindings; alert when a co-author adds a shared paper or budget code is missing; set embargo/access once for all files; **department-level** proxy scope + colleague search; dup detection.
- *"Dashboard super handy, colours intuitive. I miss auto-departments — and not having to throw my own out every time."*

## Stan Standish — "stand-in for a busy PI" (low-volume, needs guidance)
**Proxy profile**
*Based on: an administrative clerk + a newcomer proxy depositing for one prof. (PI = principal investigator, the lead researcher.)*

- **Does:** deposits for one busy prof / small set, a few ×/year. Low domain confidence.
- **Pain:** access levels + the 4 dissertation questions confuse them (so do experts — design gap, not skill); unsafe importing without the promoter's OK; doesn't know what an AAM is.
- **Needs:** recommended defaults + worked examples per question; clear "who entered / who approved"; a help line; a designatable "responsible person".
- *"A proposal is made, I can check and complete it — but OA is sensitive, I'd like the promoter's approval first."*

## Guy Guest — "confident guesser" (moderate volume, no verification)
**Proxy profile**
*Based on: a Faculty of Economics secretariat depositor. (Guessing behaviour per team knowledge, not a logged test task.)*

- **Does:** enters ~20–25 records/year for a faculty, mostly A1; fills the 4 dissertation questions "almost always himself" — from assumption, not checking; publishes and moves on.
- **Pain (his lens):** tabbed forms, clicking; chasing researchers for missing info.
- **Risk (design's lens):** confident wrong answers on access level / the 4 questions enter silently — nothing flags an unverified guess; errors surface only when a reviewer catches them.
- **Needs:** inline examples + validation at the point of the guess; a low-friction "not sure" path; a way for reviewers to see which answers were unverified.
- *Does the four questions himself, every time — without looking them up.*

## Marie Curator — "bibliographic reviewer" (daily, record-by-record)
**Curator / reviewer profile**
*Based on: Biblio review-team members D1, D3. Well-evidenced.*

- **Does:** makes records bibliographically correct + helpdesk. Splits by faculty, rotates to what's most behind. ~10 min/article: title/authors/dept/journal/ISSN/classification, WoS check, licence → Sherpa → UGent-only + message for AAM. Fridays = PDF drop.
- **Tools:** Biblio, WoS/Clarivate, Sherpa, ISSN portal, VABB/GPRC, doi.org, IEEE/CEUR, Zammad. "A lot of clicking."
- **Lives in filters:** status, publication status, classification (esp. *unclassified*), faculty, type, year, locked. Wants year ranges, filter-on-missing, **export to Excel**.
- **Pain/needs:** old app = too many click-to-open fields, not compact; **split-screen** is the real mode → narrow detail must stay usable; status names too long, workflow unclear; "withdrawn" is overloaded as a completion lever but breaks flows → wants an **"unlisted"** state; auto-lock on complete (+ unlock); list should show completeness ("complete ≠ correct"); search all fields + combined/CQL; drop reviewer clutter (ORCID/cite/PubMed); shares filters via **bookmarked URLs**; dup detection.
- **Also checks the public page** to verify how a record actually renders — curators cross into Sue Kerr's surface, so the public record page is a curation tool too.
- *"Not user-friendly — lots of little fields to click open, not compact, things far away."*

## Rhea View — "review coordinator / team lead"
**Curator / reviewer profile**
*Based on: the review coordinator (D4) + a work-dispatching lead + the goals map + the team coordinator's search cases (2026-09, `docs/wip/QUERY-BUILDER-EVIDENCE.md`).*

- **Does:** plans + divides work; owns money/compliance (WoS funding, A1 validation; VABB/GPRC for SSH); dispatches urgent projects.
- **Does the compliance reporting herself (2026-09 search cases):** VABB appeal to VLIR (three backoffice exports joined and narrowed in Excel, 227 records checked one by one); copublication overviews for diplomatic visits (InCites + VABB data; biblio only via a pasted id set on public advanced search); WOS-id gap checks via public xlsx exports because the backoffice takes no id set. Excel is her join tool; deliverables are .doc/.xlsx; tags select, exclude — and mislead, since their coverage is incomplete.
- **Goals:** overview per record-type per department to divide work; triage all records by key markers; motivate researchers to complete metadata (recognition: academic + financial + social); clean role-switch.
- **Pain/needs:** dashboard showing **who picks up what** (e.g. "no department" column); messaging with templates + assignment but **no notification firehose** — surface in workflow, one message at a time; responsibility expressible per project/user (corresponding author, delegates); internal comms need own history; dream: pull from WoS like Aleph.
- *"I motivate researchers to complete records, so research, researcher, dept and university get the recognition it deserves."*

## Sue Kerr — "public discovery visitor"
**Public / discovery profile** · *consumes the record, off the deposit axis*
*Not from Biblio testing — external discovery-UX literature (Ithaka S+R; CIBER/Nicholas, "Google Generation"; OCLC "Perceptions"; Connaway, JISC "Digital Information Seeker"; White & Le Cornu, "Visitors & Residents") + raven `public-site-semantics.md`.*

- **Is:** the academic reader reaching a record from the open web — researchers + students. (Practitioners and the curious public have their own profiles below: Pia Practice, Carrie Curious.)
- **Arrives:** via Google / Google Scholar on a **deep link to one record** — the record page is the entry point, often the only page seen (rarely the homepage).
- **Does:** scans, grabs the PDF, leaves. Power-browsing, short visits, "viewing not reading," downloads to read later; satisficing — "good enough" beats exhaustive.
- **Wants:** full text fast (ideally OA); confidence in version (VoR/AAM) and trust (peer-reviewed, who/where/when); easy cite/export.
- **Pain:** paywalls elsewhere → hunts the OA copy; "is this the final version?"; restricted records that look broken; login/redirect dead-ends.
- **Needs:** prominent OA + version + license signals; one-click cite (CSL/export); a self-contained record page (title, authors, affiliations, date, DOI); accessible, machine-readable markup — the same markup overlays and reference managers read.
- *Lands on one record from a search engine, judges it in seconds, downloads or bounces.*

**Variant — the author checking their own footprint.** Bridges public + backoffice: is my record correct, is it OA, how many downloads? (ties to Claire Searcher's "search own records").

> **Narrowed.** Sue Kerr was a composite of every open-web visitor; the practitioner and citizen sub-audiences are now their own profiles (below). Researcher vs student may still split after public-surface testing.

## Pia Practice — "applies it, doesn't publish"
**Public / discovery profile** · *outside the researcher community, professional stake*
*Not from Biblio testing — external discovery-UX literature (Ithaka S+R; OCLC "Perceptions"; JISC "Digital Information Seeker") + a local signal: researchers curate publication lists on their own sites because industry partners and practitioners consult them there (Wim, composites.ugent.be, 2026-01).*

- **Is:** clinician, teacher, policymaker, journalist, industry engineer. Domain-literate, repository-illiterate: reads the field's language, not ours — "AAM", "VoR", "A1" mean nothing.
- **Arrives:** Google / news / a researcher's own website, deep-linked to one record.
- **Does:** reads to *apply* — a guideline, lesson, brief, design decision. Judges relevance fast, reads the full text when it opens.
- **Pain:** paywalls elsewhere; version jargon; login or network dead-ends (works off-UGent by definition).
- **Needs:** plain access signals ("you can read this" / "available from May 2027"); trust signals that don't require knowing venues — peer-review status, institution, date, real author names; abstract up front.
- *Finds the record from outside academia, needs it to work without academic vocabulary.*

## Carrie Curious — "personal stake, zero jargon"
**Public / discovery profile** · *the curious public*
*Not from Biblio testing — same external literature; locally untested.*

- **Is:** patient or family member, local-heritage enthusiast, hobbyist — anyone with a personal reason to read research. No domain vocabulary, no repository vocabulary.
- **Arrives:** Google on a life question (a condition, a place, an event) → one record, the only Biblio page she'll see.
- **Does:** reads title + abstract; the record page *is* the product — she rarely downloads. Trust comes from the institution's brand and plain signals, not venue reputation.
- **Pain:** jargon at every level, title and abstract included; "restricted" reads as broken; paywall vs open is opaque.
- **Needs:** the strictest legibility bar on the public surface; Design Principle 02
  holds that language rule. The demand for a lay summary originates with her.
- *Judges the page in seconds with no vocabulary — if she can't tell what it says or whether she can read it, the page failed.*

> **Personas motivate demand, not schema.** Feature demands these profiles generate (e.g. a lay summary field) route via ProductBoard → raven modelling, per AGENTS.md "What lives where". The prototype shows such features only as flagged open questions until the concept has an owner — a lay summary in particular carries a policy question (who writes it?) that belongs to OSP, given Biblio's core problem is administrative overhead.

## Wim Webb — "his list, on his own site"
**Public / discovery profile** · *builds a set, publishes it somewhere else*
*Not from Biblio testing. Local signal: a UGent research group keeps a hand-curated publication list on its own site because industry partners consult it there (2026-01). Log signal: the only two embed parameters that exist in the wild, `;style=apa` and `;hide_info=1`, are this use.*

- **Is:** a researcher or group leader with a website of his own — a group site, a personal page, a project site. Domain-literate, repository-illiterate: reads a field list fine, will never learn a query language.
- **Does:** builds one query for his own output, copies an embed or an API address into his site, and does not come back. Judges the query by the count, not by reading the list.
- **Wants:** a list that updates itself when he publishes; the citation style his field uses; a link he can hand to a colleague who then edits one criterion.
- **Pain:** hand-kept lists rot and he knows it; he cannot tell whether the set is everything; the current embed's parameters are folklore, written down nowhere.
- **Needs:** public fields only; a query that requires non-public metadata belongs in
  the backoffice builder. See the product-layer boundary in `docs/SURFACES.md`. The
  embed must survive a redesign and use a readable link rather than an opaque one.
- *Builds a set once, publishes it elsewhere, and never sees Biblio again.*

## Ans Rapport — "the faculty page has to be right"
**Public / discovery profile** · *builds a set for an audience that is not her*
*Not from Biblio testing — inferred from the same embed signal as Wim Webb plus the departmental-page pattern; locally untested.*

- **Is:** a communications or support officer for a faculty, department or research group. Not a researcher, not a curator, no stake in any single record.
- **Does:** builds organization + year + type, embeds the result on a faculty or department page, checks it when someone complains.
- **Wants:** to pick the right organization out of several similar names; a set she can trust without reading it; no login for something published openly.
- **Pain:** two org names look equally plausible and nothing tells her which is the live one; a missing work reads as her mistake.
- **Needs:** organization as a resolvable record, not a text field; the count as the thing she checks; plain language throughout — she has no repository vocabulary at all.
- *Answers for a list she did not write, about work she did not do.*

## Quinn Query — "gets it into a spreadsheet"
**Public / discovery profile** · *takes the set out and computes on it*
*Not from Biblio testing — inferred from the power-tier query log (~19 authored queries a day, paste batches to 763 identifiers) and Marie Curator's documented export-to-Excel demand; locally untested as a public profile.*

- **Is:** an analyst outside the application: faculty support staff, a bibliometrician at another institution, a funder's reporting officer. Technical without being a developer — pastes a URL into Excel or Power BI, does not write code.
- **Does:** builds a defined set, checks the count, downloads a file or points a refreshing query at it, then counts and cross-tabs elsewhere.
- **Wants:** a spreadsheet with stable columns; a query address that still works next quarter; to paste a list of identifiers rather than type them.
- **Pain:** multi-valued fields (authors, keywords) arrive unusable in a single cell; cannot tell whether the set is complete; a long identifier batch breaks the link.
- **Needs:** a documented flat column contract; an address a refreshing tool can hold; a stated ceiling when a query outgrows a URL, rather than a silent truncation.
- *Judges Biblio by what the file looks like when it opens somewhere else.*

> **These three are the public Advanced search audience**, and their split decides the actions on it: Wim Webb and Ans Rapport want a **live** query (link, embed, API, feed), Quinn Query wants a **frozen** file (export). The reproducible-query need — a search someone else can re-run and get the same set — is **not** a fourth public profile: it is Marie Curator sharing filters as bookmarked URLs, which her profile above already records.

## Cody Crawley — "machine reader" (first-class user)
**Machine / discovery profile**
*Per COAR Next Generation Repositories + raven `public-site-semantics.md`.*

- **Is:** Google Scholar / Highwire indexing, web crawlers, OAI-PMH / Dublin Core harvesters, ORCID, citation managers (Zotero/CSL), discovery indexes.
- **Needs:** Schema.org / JSON-LD + `citation_*` meta; Signposting (`cite-as`, `license`, `rel="me"` → ORCID); canonical URLs + sitemaps; `?format=` alternates; clean stable deep links; `nofollow` on combinatorial/short-lived URLs.
- **Design implication:** semantic markup is a *user requirement*, not compliance polish — the record page is the hub for humans and machines alike.

---

## Cross-cutting (strongest design signals)
- **Responsibility owned nowhere** — varies per faculty; convention is "first author sorts it." Allow flexible, transparent responsibility (designatable person), don't impose one model.
- **Proxies are indispensable** ("onontbeerlijk") — confirmed repeatedly.
- **Access level + 4 questions confuse everyone** — patent question first; privacy note on "confidential"; example per question.
- **Defaults welcomed by lay users**; embargo blocks should look informative, edit path subtle.
- **People want to self-correct** rather than message + wait.
- **Notifications feel like overhead** — lean on dashboard; surface messages in the workflow. Signal real changes (new records, WoS status), not commas.
- **Auto/suggested departments** — main fills in, others get missed.
- **Duplicate detection** — proxies + reviewers, incl. simultaneous adds.
- **Timeliness** — requests land best near the moment of entry.
- **Split-screen** is a first-class reviewer mode.
- **Status/workflow legibility** — long names, overloaded "withdrawn"; reconcile with `draft/submitted/public/deleted` in `DOMAIN-VOCABULARY.md`.
- **Too much clicking** — batch, keybindings, compact + single-screen forms.
- **One page beats tabs** — repeatedly: tabbed deposit forms hide fields, force scrolling; users preferred the old everything-on-one-page layout.
- **The record is the front door** (public) — visitors arrive deep-linked to one record, not the homepage; each record page must stand alone with OA/version/cite signals + semantic markup for humans and machines.
