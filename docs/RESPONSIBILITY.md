# Biblio — Responsibility Model

Working document · Booktower · Ghent University Library

---

## Design principle

Put the right control on the right field at the right moment. Researchers are asked only for what only they can know, needed now, and not reasonably inferable later. Everything else is imported, suggested, or reviewed later.

**Publication model:** A record submitted by a researcher or arriving via a trusted automatic import is published immediately. Curator review happens after publication, not as a gate before it.

---

## Actors

Six distinct actors. Do not conflate them.

| Actor | Role | Examples | Trust level |
|---|---|---|---|
| **Researcher / Proxy** | First-person knowledge of ownership, files, funding context, and openness intent | Author, PhD student, secretary | High — authoritative for context only they know; not infallible |
| **Automation** | Deterministic import + probabilistic enrichment (distinct trust levels — see below) | DOI lookup, WoS/ORCID harvester, AI enrichment | Varies by source type |
| **Curator / Reviewer** | Expert validation on high-stakes fields; policy enforcement; identity resolution; bibliometrics | Library staff, bibliographer | Highest — authoritative for compliance; can override any field |
| **Policy / Governance** | Owns the rules curators enforce. Updates rules when mandate or law changes. Named owner: Head of Open Science and team. | Head of Open Science | Authoritative — rules owner |
| **Research Office** | External stakeholder whose reporting requirements shape what Biblio must capture. Compliance is mandatory when funding is at stake (FWO, BOF, VABB). We push back where possible but do not always win. | Directie Onderzoeksaangelegenheden; Flemish government | Defines requirements; does not operate Biblio |
| **Development** | Owns export mappings, interoperability pipelines, and probabilistic enrichment thresholds. Starts from a baseline and ramps up as curator confidence in source quality grows. Enrichment thresholds set in collaboration with design, informed by reviewer experience. | Booktower dev team | Technical authority |

---

## Automation sub-types

"Automation" covers two distinct trust levels. Do not treat them equally in the system.

| Type | Examples | Trust level | Failure mode |
|---|---|---|---|
| **Deterministic import** | DOI → title/journal/pages/date, ORCID identifier, WoS harvest | High — accepted by default | Source record is wrong (rare); escalate to curator |
| **Probabilistic enrichment** | AI-suggested VABB classification, funder match, duplicate signal, OA policy hints, file version detection | Medium — shown as suggestion requiring confirmation | Confident but incorrect; threshold for display set by development + design based on reviewer experience |

> Rules-based validation (blocking checks on required fields, embargo logic, etc.) is not currently implemented. When it is, the policy owner maintains the rules.

---

## Trusted imports

Which sources qualify for trusted automatic import (creating and publishing a record without researcher initiation) is not yet defined. This must be decided before any automated pipeline is built.

Questions to resolve:
- Which sources qualify as trusted (WoS, ORCID, arXiv, others)?
- Is trust binary (publish immediately) or tiered (import but hold for review)?
- Who has authority to add a new source to the trusted list?
- What is the deduplication behaviour when a trusted import matches an existing record?

**Until this is defined, no source should be assumed trusted for automatic publication.**

---

## Proxy authority

A proxy (secretary, PhD student) can submit on behalf of a researcher, including openness decisions and file version. In practice this is risky: proxies sometimes make incorrect choices and researchers do not check what was submitted on their behalf.

Curators are the current backstop — for example, they catch proxy errors during FWO record review. This is a legacy pattern. As Biblio improves and the deposit process becomes simpler, the goal is for researchers to take more ownership directly, reducing reliance on proxies and curator correction.

The system should not add a confirmation prompt that researchers will ignore. Instead, flag proxy-submitted openness/version/access decisions visibly in the curator queue so they can be caught during routine review.

---

## Openness and license

Openness and license span all three primary actors with distinct roles. Mistakes here create legal and reputational risk.

| Actor | Role |
|---|---|
| **Researcher / Proxy** | Primary source for intent and rights context: Do you want this open? Did you sign publisher terms? Is this the accepted manuscript or published version? Is there a sponsor mandate? They know circumstances the system cannot infer. |
| **Automation** | Primary source for suggestions and policy signals: known publisher OA policies, embargo rules, licenses from imported sources, funder OA mandate hints, file/version detection signals. Useful but not authoritative alone. |
| **Curator / Reviewer** | Final trust decision: legal repository compliance, correct embargo date, allowed version for deposit, final license shown publicly, exceptions and risk handling. |

**In short:** Researcher knows context. Automation knows signals. Curator owns the compliance outcome.

---

## Bibliometrics

Bibliometrics (VABB classification, citation analysis, research reporting) is curator work in Biblio. Reporting and analysis happen outside Biblio.

**Architectural boundary:** Biblio is the source of truth for research output data. Power BI (or equivalent) is the reporting and analysis surface. Bibliometrics work does not belong inside Biblio's UI beyond what is needed to maintain data quality.

- **Curator:** owns VABB classification and data quality in Biblio; validates signals; corrects errors
- **Policy / Governance (Head of Open Science):** defines VABB rules and reporting criteria
- **Automation:** prefills classification signals; not authoritative
- **Research Office / Flemish government:** consumes output via reporting tools; defines mandatory requirements
- **Development:** maintains export pipelines to Power BI, OpenAlex, VABB submission systems

VABB and FWO attribution are the highest-risk fields in the system. Errors here affect institutional funding and rankings.

---

## Known failure modes

Input from curator review (April 2026). Two distinct categories — do not conflate them.

### Policy gap failures
Researcher submits with wrong version, wrong access level, missing project link, missing author link. The record is still usable; these are enrichment gaps, not broken records. Root cause: policy requirements are buried in a long form and not surfaced at the right moment. Researchers don't distinguish UGent requirements from funder requirements. Only perfectionists complete every field; others make their own judgment about what matters — and get it wrong because they lack policy knowledge.

**System response:** surface the right policy signal at the right field, at the moment of input. Make policy requirements visible, not hidden. A minimal deposit is always better than a stalled one.

Fields most affected: file version, access kind, author linking, project linking, dataset linking.

### Technical failures
These are workflow and UX failures, not knowledge gaps. The system allows them; it should not.

| Failure | Cause | System responsibility |
|---|---|---|
| Duplicate WoS profile import | No deduplication on batch import | Detect and block or warn before completing import |
| Records stuck in draft, never published or reported | No nudge or visibility; researcher forgets it exists | Surface abandoned drafts prominently; prompt submission after a threshold period |
| Duplicate records | No duplicate detection at entry | Flag probable duplicates before saving |
| Duplicate records across departments | No coordination mechanism | Flag when same output is being entered by multiple actors |
| Manual entry when import exists | Import path feels harder than typing | Make import the path of least resistance; manual entry is the fallback |
| Researcher filling fields the curator will overrule | No signal that certain fields are curator-owned | Mark curator-owned fields clearly; don't ask researchers to fill them |

**Known curator-owned fields (do not ask researchers to fill):** VABB classification, pagination details, short journal title. Full list pending input from curator team.

---

## Workflow step responsibility

Record creation can be initiated by a researcher, a proxy, or an automatic import (e.g. WoS harvest). There is no requirement for a researcher to start the record.

| Workflow step | Researcher / Proxy | Automation | Curator | Policy / Governance | Research Office | Development |
|---|---|---|---|---|---|---|
| Create record | Initiates (optional) | Can create via trusted import (definition pending) | — | — | — | — |
| DOI / identifier | Provides | Fetches; populates metadata | Validates exceptions | — | — | — |
| Bibliographic metadata (title, journal, pages, date) | No manual entry ideally | Imports | Validates when high-stakes | Defines thresholds | — | — |
| Author list | Confirms if needed | Imports; suggests identity links | Resolves ambiguity; overrides with reason | — | — | — |
| Ownership / affiliation claim | Asserts | Suggests from ORCID/LDAP | Validates anomalies; overrides with reason; field-level history kept | — | — | — |
| Project linking | Confirms | Suggests from ORCID/grant data | Validates; can add or correct | — | — | — |
| Dataset linking | Confirms if applicable | — | Validates; can add | — | — | — |
| Openness intent | Confirms intent; confirms file version; declares sponsor mandate | Suggests based on publisher OA policy, funder mandate, version signals | Owns final compliance decision; sets embargo; validates version | Sets repository version policy | — | — |
| License | Declares if known | Suggests from import source | Finalises; shown publicly | — | — | — |
| File upload | Uploads | — | Validates compliance | — | — | — |
| Funding (yes/no) | Confirms | Suggests from linked grants | Validates | — | — | — |
| Grant code / FWO link | Provides if known | Suggests from ORCID/project data | Validates / finalises | — | Audits | — |
| VABB classification | — | Prefills signals | Validates / owns | Defines VABB rules | Consumes via Power BI | Maintains export pipeline |
| Duplicate detection | — | Flags at entry | Decides | — | — | Owns detection logic |
| Interoperability / export quality | — | Exports / transforms | Monitors trustworthiness; escalates issues | — | — | Owns mappings; ramps up as confidence grows |
| Curator override | — | — | Can override any field; documented in field-level history | — | — | — |

---

## Field-level responsibility

Risk level drives review intensity — not field type. A page number and an FWO code are not equal.

| Field | Researcher | Automation | Curator | Risk if wrong |
|---|---|---|---|---|
| Title | — | Import (DOI) | Validates if high-stakes | Low — display only |
| Journal / venue | — | Import | Validates for VABB | Medium — affects VABB |
| Pages / volume / issue | — | Import | — | Low |
| DOI / identifier | Provides | Validates / fetches | Checks exceptions | Medium — interoperability |
| Author list | Confirms | Import; identity links | Resolves ambiguity; highest authority | High — authorship claim |
| Affiliation / UGent link | Asserts | Suggests | Validates anomalies | High — reporting |
| Project link | Confirms | Suggests | Validates; can add | High — grant reporting |
| Dataset link | Confirms if applicable | — | Validates; can add | Medium — reproducibility |
| Openness intent | Confirms (flag in curator queue if set by proxy) | — | — | High — determines deposit path |
| File + version | Uploads; confirms version (flag in curator queue if set by proxy) | Suggests version from DOI metadata | Validates; owns compliance decision | High — legal / OA |
| Access kind | Declares intent (flag in curator queue if set by proxy) | Suggests based on policy signals | Finalises | High — legal / OA |
| Embargo date | Declares if applicable | Suggests based on publisher policy | Validates; sets final date | High — legal |
| License | Declares if known | Suggests from import source | Finalises publicly shown license | High — legal |
| Funding (yes/no) | Confirms | Suggests | Validates | High — grant audit |
| Grant code / FWO link | Provides if known | Suggests | Finalises | Critical — financial |
| VABB classification | — | Prefills signals | Owns | Critical — ranking |
| Publication date | — | Import | — | Low–medium |
| Work kind (type) | Selects | Suggests | Corrects if wrong | Medium — affects profile |

---

## Risk-based review tiers

Tier is assigned at submission time based on automation signals. Display thresholds for probabilistic suggestions are set by development and design, informed by reviewer experience.

| Tier | Conditions | Examples | Escalation trigger | Curator effort |
|---|---|---|---|---|
| **1 — Fast Pass** | Clean import, no funding ambiguity, no duplicate flag, no file issue | Standard journal article with consistent DOI metadata | Any automation flag | Seconds |
| **2 — Standard** | Grant needs confirmation, affiliation mismatch, duplicate warning, missing project/author link | Research output with unclear FWO link, author identity ambiguity | Unresolved after curator review | Moderate |
| **3 — Deep Curation** | VABB-sensitive, FWO attribution critical, books/chapters, legal/embargo complexity, authorship dispute | Dissertation, disputed authorship, dataset with policy complexity | N/A — expert handling | Expert |

---

## Curator override policy

- Curators have the highest authority on any field
- Any override of researcher-supplied or automation-supplied data is permitted
- All changes are recorded in field-level history
- No additional approval required; the act of overriding is itself the documented decision

---

## Interoperability and export quality

- Development owns schema mappings to external systems (OpenAlex, ORCID, FWO, VABB, Power BI)
- Curators monitor the trustworthiness of exported data and escalate issues to development
- Development starts from a baseline and increases automation confidence as curator review confirms output quality
- Enrichment display thresholds are set by development and design based on reviewer experience

---

## Open questions

- **Trusted import definition:** which sources qualify as trusted for immediate publication? Is trust binary or tiered? Who has authority to add a new source? — *To be defined before any automated pipeline is built.*
- **Curator-owned fields — complete list:** VABB classification (?), pagination, short journal title confirmed. Full list pending from curator team.
- **Dataset linking:** flagged by reviewer as a gap with no clear picture yet. Needs its own investigation.
- **Department coordination on shared output:** when the same output belongs to multiple departments, who enters it and whose record wins on duplicate? No current mechanism.

---

## Version history

| Version | Date | Notes |
|---|---|---|
| 0.1 | April 2026 | Initial draft |
| 0.2 | April 2026 | Added openness/license actor breakdown; bibliometrics section; Development as actor; corrected publication model; removed unimplemented rules-based validation; aligned to "research output" |
| 0.3 | April 2026 | Added known failure modes from curator input; project and dataset linking; technical vs policy failure distinction |
| 0.4 | April 2026 | Trusted imports marked as undefined; proxy authority clarified as legacy pattern with curator backstop; bibliometrics boundary set (Biblio = data, Power BI = reporting); abandoned drafts failure mode updated; known curator-owned fields listed |
