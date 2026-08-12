# RESPONSIBILITIES.md — who is accountable for what

This document names who is accountable for information in Biblio. It is a
principle-level routing document, not a field-by-field assignment map.

Use it whenever a feature asks who should fill, confirm, see, review or request a
value. `docs/SURFACES.md` decides whether a feature belongs to the public or
backoffice surface. This document decides whose work the feature carries.

## The reframe

The entities below are not one kind of thing:

- **Contributors of information** — researchers, machines and the Biblio team put
  values into records.
- **Owners of rules** — Open Science Policy and Administration determine which
  information must exist and what values are legal. They mostly do not type.
  They follow Ghent University and the University Library policy and strategy.
- **Owner of guidance** — Training provides help at the moment of a question.
- **Assistance without accountability** — AI proposes. It never answers.

Conflating contributors and rule owners is the mechanism behind the field pile-up:
a policy or reporting requirement becomes another question on the researcher's form
because there is no other place for it to land.

## Principles

### P1 — every field has exactly one accountable entity

A field everyone owns is owned by nobody. User testing found responsibility owned
nowhere already, with convention varying per faculty (`docs/RESEARCH-PERSONAS.md`,
cross-cutting).

### P2 — entering a value and being accountable for it are different acts

Delegation moves the work and never the accountability. A researcher whose proxy
deposits for them stays responsible for their own record. Paula Proksy (expert
registrar), Stan Standish (guided proxy) and Guy Guest (confident guesser) all enter
values a researcher owns.

The accountable researcher sees everything entered under their name, work in progress
included. A proxy has a low-friction way to answer "I don't know", so an unverified
value reaches the responsible entity as a question instead of entering the record as
a guess.

To be refined: Some faculties or divisions in the university prohibit the researcher to deposit and edit. In this case, other rules apply, depending on the group – they decide responsibility. We do not judge nor decide how these groups should operate.

Accountability also differs from edit permission. A researcher may own the answer
while the Biblio team owns the act of accepting a policy-risk change into the public
record.

### P3 — asking a person is the last resort, and cost decides who is asked

Ask in this order: an authoritative source, then an entity that already holds the
answer, then the person once, near the moment of entry. Testing supports each step:
auto and suggested departments (Paula Proksy), timeliness of requests, and the
repeated finding that people would rather self-correct than message and wait.

### P4 — a machine carries its source's accountability; AI carries none

An imported value arrives already verified by whoever produced it. That is why it can
go public unread, as long as the record names the source and does not imply Biblio
checked it.

TBD with Raven: We trust the source depending on its reputation, and apply a trustworthiness score.

AI may reduce effort, but it never carries trust. A generated value is interface help
until an accountable entity accepts it. Generated-and-unaccepted values are not part
of the accepted record, are not exported as record data, and never reach the public
surface.

### P5 — a rule owner receives a rule, not a field

Open Science Policy and Administration state the outcome they need. The product
workflow decides where the question lands, or whether it can be derived and asked of
no one. A new institutional requirement is not automatically a new question on a
form.

### P6 — an entity's need becomes its own tooling, never a task for another entity

An entity with no route to its own answers converts its need into requirements on
other people's screens and other people's time. Every entity holding a stake in the
data gets a way to answer its own questions, so a requirement arrives as a need
rather than as an instruction about someone else's work.

The test: when a request arrives as work for another entity or as a new field, name
the question the requester is trying to answer, and ask what would let them answer it
themselves.

### P7 — review follows responsibility, not the whole record

The accepted record stays stable while proposed changes wait in the backoffice. A
record can carry multiple pending requests at once; each request belongs to a field
or section, names the actor and accountable entity, and waits for the Biblio team to
accept, decline or ask for clarification.

Locking the whole record is no longer possible. The unit of review is the
responsibility-bounded change request.

## Entities

### Researchers

Claire Searcher (oversees) and Otto Thor (self-depositing author) represent
researcher accountability.

Researchers are accountable for what only they know: that the work is theirs, that
the deposited file is the right version, the affiliation held at the time, and the
project and funding attribution. They are not accountable for bibliographic
correctness, classification, or licence rules.

Researchers are accountable for access-risk answers that only they can give,
including whether a doctoral thesis contains patent-sensitive, privacy-sensitive,
publication-planning or published-material risks. They should be able to propose
corrections to researcher-owned values at any time. If a proposed change affects
public access, licence, embargo, file version or another policy-risk value on an
accepted public record, the change becomes a review request. Until the Biblio team
accepts it, the public surface keeps showing the last accepted value.

### Machines

Machines harvest and import from WoS, ORCID, Crossref, PubMed, Zenodo and other
sources. They hold no accountability of their own; they transfer their source's
accountability. Anything a source can supply is never asked of a person, and the
record names the source.

### AI

AI is a suggestion layer. It holds no accountability, produces no accepted record
value on its own, and invents nothing. Every AI-provided value is accepted by an
accountable entity before it becomes record data. Generated-and-unread never reaches
the public surface (`foundations/design-principles.html`, principle 05).

### Biblio team

Marie Curator (reviewer), and the people doing repository review and curation form the Biblio team for this document.

The Biblio team is accountable for the record as part of a collection: correct,
complete, compliant, comparable with everything beside it, plus the calls that need
repository expertise. The Biblio team applies policy rules in the product workflow.
It is not accountable for what only a researcher knows, and it is not the execution
route for another department's data requests.

Use **Biblio team** unless a specific workflow needs the curator/reviewer distinction.
The split is an internal role split, not a researcher's mental model.

Treat coordination as a separate workflow question.

### Administration

Administration is accountable for its own definitions and reports: budget codes,
reporting categories, what counts for which report, and the reports it produces. It
needs a route to its own answers.

When those needs affect Biblio records, they arrive as requirements or rules to be
translated into workflow by the Biblio team. Administration is not an owner of any
input form, not an owner of the public surface, and not named here as a review role.

### Training

Training is accountable for guidance at the point of the question: defaults, worked
examples, and the help that catches a guess before it is stored. Its output lands
inside the interface. Stan Standish asks for exactly this, and Guy Guest is the
reason it has to sit at the moment of the guess rather than in a manual elsewhere.

### Open Science Policy

Open Science Policy is accountable for the rules: what is mandatory, what is legal,
access, licence and embargo policy, and what "complete" means. Rules arrive as
defaults, validation and derivations. The Biblio team applies those rules in the
workflow.

## Workflow consequences

The deposit target is a fast happy path: a record created and published with a full
text, dataset or software object added or linked, access rights and licence set, and
the most important metadata present: title, abstract, contributors, keywords and
projects. That target is possible only when the form is mostly recognition and
confirmation, not primary data entry.

The system asks for evidence before it asks for type. An identifier, source, file or
candidate record should let the system infer the output type and import or suggest
the metadata it can know. A wrong inferred type is usually cheaper for the Biblio
team to repair in review than to prevent by asking every depositor to classify their
output up front. Only when inference cannot decide enough should the interface ask
the depositor to choose.

The happy path is optimized for the common correct inference. Exceptions are review
work, not upfront depositor work. If changing the type during review creates a
question only the researcher can answer, the Biblio team sends a bounded request.

When a depositor cannot answer an access-risk question, the interface records that
uncertainty, applies the safest configured access state, and creates a review
request. The fallback must avoid legal exposure and preserve the fact that the
depositor did not know. It must not turn uncertainty into an apparently verified
answer.

Policy-risk changes on an accepted public record are pending backoffice state only.
The public record keeps showing the last accepted value until the Biblio team accepts
the change. Accepting the request updates the accepted record and, where relevant,
the public surface. Declining it keeps the accepted value and records the reason.

## Policy-risk values

Policy-risk values decide whether Biblio can expose a file or object without legal,
contractual or institutional risk. Access level, licence, embargo, file version and
the four doctoral-thesis questions are policy-risk values.

The four doctoral-thesis questions carry the same status as access rights and
licence. They decide public access and legal exposure, not ordinary description.
They currently ask whether the thesis has patent risk, privacy-sensitive information,
planned publications based on it, or published material inside it.

When an access-risk answer is uncertain, the Biblio team must decide the safest
fallback state, informed by Open Science Policy. Until that is settled, designs must
show explicit unresolved access instead of assuming closed, restricted or hidden.

## Open questions

**Safest unresolved access state.** When a depositor cannot answer an access-risk
question, should the system default the file to closed, restricted, private/hidden,
or another configured state? The fallback must avoid legal exposure and preserve the
fact that the depositor did not know. Owner: Biblio team, informed by Open Science
Policy.

**Classification (A1/A2, VABB/GPRC).** Classification is accountable to the Biblio
team today. Whether that is permanent, or whether classification derives from source
data with Biblio-team handling exceptions, decides whether it is Biblio-team work or
an Administration rule. Owner: Biblio team with Administration.

**Administration's own tooling.** P6 gives every stakeholder a route to its own
answers. Which questions that route has to answer is Administration's to state.
Owner: Administration.

**Source trusworthiness score** TBD with Raven: We trust the source depending on its reputation, and apply a trustworthiness score.

**Autonomy for divisions** Some faculties or divisions in the university prohibit the researcher to deposit and edit. In this case, other rules apply, depending on the group – they decide responsibility. We do not judge nor decide how these groups should operate.