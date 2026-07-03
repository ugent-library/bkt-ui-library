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
*Based on: the review coordinator (D4) + a work-dispatching lead + the goals map. Moderately evidenced.*

- **Does:** plans + divides work; owns money/compliance (WoS funding, A1 validation; VABB/GPRC for SSH); dispatches urgent projects.
- **Goals:** overview per record-type per department to divide work; triage all records by key markers; motivate researchers to complete metadata (recognition: academic + financial + social); clean role-switch.
- **Pain/needs:** dashboard showing **who picks up what** (e.g. "no department" column); messaging with templates + assignment but **no notification firehose** — surface in workflow, one message at a time; responsibility expressible per project/user (corresponding author, delegates); internal comms need own history; dream: pull from WoS like Aleph.
- *"I motivate researchers to complete records, so research, researcher, dept and university get the recognition it deserves."*

## Sue Kerr — "public discovery visitor"
**Public / discovery profile** · *consumes the record, off the deposit axis*
*Not from Biblio testing — external discovery-UX literature (Ithaka S+R; CIBER/Nicholas, "Google Generation"; OCLC "Perceptions"; Connaway, JISC "Digital Information Seeker"; White & Le Cornu, "Visitors & Residents") + raven `public-site-semantics.md`.*

- **Is:** anyone reaching a record from the open web — mostly researchers + students; also practitioners (clinician, teacher, policy, journalist) and the curious public (heritage, local, patient/family).
- **Arrives:** via Google / Google Scholar on a **deep link to one record** — the record page is the entry point, often the only page seen (rarely the homepage).
- **Does:** scans, grabs the PDF, leaves. Power-browsing, short visits, "viewing not reading," downloads to read later; satisficing — "good enough" beats exhaustive.
- **Wants:** full text fast (ideally OA); confidence in version (VoR/AAM) and trust (peer-reviewed, who/where/when); easy cite/export.
- **Pain:** paywalls elsewhere → hunts the OA copy; "is this the final version?"; restricted records that look broken; login/redirect dead-ends.
- **Needs:** prominent OA + version + license signals; one-click cite (CSL/export); a self-contained record page (title, authors, affiliations, date, DOI); accessible, machine-readable markup — the same markup overlays and reference managers read.
- *Lands on one record from a search engine, judges it in seconds, downloads or bounces.*

**Variant — the author checking their own footprint.** Bridges public + backoffice: is my record correct, is it OA, how many downloads? (ties to Claire Searcher's "search own records").

> **Too broad — extend later.** Sue Kerr is a composite. Once we test the public surface, the sub-audiences (researcher, student, practitioner, citizen/heritage) likely each need their own profile — their goals and trust signals differ.

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
