# Surfaces

Booktower serves two product layers. The surface follows the layer that renders the
page. Do not infer it from the user, subject matter, task, vocabulary, authentication,
visual density or component type.

| Surface | Product layer | Purpose |
|---|---|---|
| **Public** | The public Biblio site and its public representations | Present research-output metadata to the wider public |
| **Backoffice** | The Biblio metadata-management application | Enter, import, review, correct, publish and otherwise manage research-output metadata and its workflow |

The same person and record may appear in both layers. A researcher depositing their
own output is in the backoffice. A curator or staff member viewing a record on the
public site is on the public surface. The editable backoffice record and its public
representation do not share a surface.

## Choose from the product layer

Start with where the page exists and what that layer permits:

- Public search, results, record, person, organisation and project pages use
  `public` because they present public metadata.
- Deposit, edit, correction, review, curation and management pages use `backoffice`
  because they change metadata or expose its management workflow.
- Search, export, help and other patterns may exist in both layers. A component does
  not own a surface; the page or layout that uses it does.
- A public preview inside a backoffice editor may declare a nested `public` surface.
  The editor and its controls remain `backoffice`.

If a page's layer is unclear, settle that product boundary before choosing classes or
tokens. Do not choose a surface to obtain a preferred type scale, spacing or density.

## Design consequences

These qualities guide design after the layer is known; they do not decide the surface.

- Public pages make public metadata understandable, usable and machine-readable
  outside UGent. They do not expose private values or management workflow.
- Backoffice pages make metadata entry and management efficient and accountable.
  They may use denser layouts and domain vocabulary when the workflow requires it.

Public-field and filter decisions live in `docs/SEARCH-AND-FILTERING.md` and Raven's
public representations. A term being expert vocabulary does not by itself make a page
backoffice.

## Authentication does not switch the layer

Logging in while viewing the public site does not move the page to the backoffice. A
restricted file may require authentication while its public record page remains
`public`. Opening a deposit, correction or management view moves into the backoffice
because that view belongs to the metadata-management layer.

## Declaring the surface

Every product layout carries `data-surface="public"` or
`data-surface="backoffice"` on `<body>` or the outermost layout element. The
attribute activates the surface tokens; see `docs/UI-LAYER.md`. Every nested
`[data-surface]` boundary applies its own tokens.

Kit pages may declare a surface to demonstrate its styles. This does not classify the
kit as either Biblio product layer. Without a declaration, the kit server injects
`data-surface="backoffice"` on `<body>`. Add `<!-- @surface: public -->` to demonstrate
the public surface.
