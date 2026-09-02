# <Feature> — breadboard

*Draft companion to [product bet](<FEATURE>-BET.md). Maximum 500 words.*

A breadboard adapts [Shape Up's technique](https://basecamp.com/shapeup/1.3-chapter-04#breadboarding)
to fix interface topology before layout. It contains only places, affordances and
connections. It does not draw screens or decide control types, spacing or placement.

## Scope

<!-- Name the phase, surface, persona and entry point. Keep backend mechanics out. -->

## ASCII language

```text
ENTRY: <trigger> --> {Place}
{Place or materially different visible state}
  "Information or feedback the person can read"
  <Value the person can enter or choose>
  [Action] --> {Next place}
  [Action with more than one visible outcome]
    + <outcome or condition> --> {Next place}
    + failure --> {Failure state}
OUT: Named place outside this breadboard
```

- `{Place}` is a **place**: something navigable, such as a page, dialog or menu,
  or a state that materially changes the available affordances. Names are unique.
- `"Information"`, `<Input or choice>` and `[Action]` are **affordances**. Copy is
  an affordance when reading it informs an action. Brackets describe purpose, not a
  committed HTML control.
- `-->` is a **connection**. It wires an action to another place. Indented `+`
  lines label alternative visible outcomes from the same action.
- `ENTRY` starts the use case. `OUT` names an existing destination beyond its scope.

Use plain ASCII. Put every affordance under the place where it is available and
define every referenced `{Place}`. Use exact interface copy only when the wording is
an accepted decision; otherwise name the intent. A self-connection is valid when an
action changes what is visible without leaving the place. Prefix a tentative element
with `?` while exploring, then resolve it or move it to Open questions before the gate.

Show the primary path first, then recovery and edge paths. Wire leaving, returning,
resuming, failure and retry, and stale or concurrent outcomes whenever they are part
of the product promise. Do not encode layout or choose a page, modal, button, link,
field type or endpoint unless that choice itself is essential behavior.

## Breadboard

```text
ENTRY: <persona and trigger> --> {Starting place}

{Starting place}
  "Information"
  [Action] --> {Next place}

{Next place}
  <Input or choice>
  [Action]
    + success --> OUT: Existing destination
    + failure --> {Next place / failure}

{Next place / failure}
  "Failure and preserved information"
  [Retry] --> {Next place}
```

## Behavior constraints

<!-- Keep only visible rules that the topology cannot express, such as preservation,
ordering or focus. Do not describe backend implementation. -->

## Decisions

<!-- Link accepted design decisions only when durable rationale is needed. -->

## Open questions

<!-- Keep only choices that change visible behavior or scope. Give concrete options,
the external decision-maker and whether the question blocks wireframing. Delete when
empty. -->
