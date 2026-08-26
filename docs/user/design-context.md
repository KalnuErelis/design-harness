# Design context

Design Harness keeps three kinds of context separate:

- **Project context** comes from `AGENTS.md`, `BRIEF.md`, and `DESIGN.md` in the repository.
- **Design system** sets the active visual contract.
- **Design influences** add opinionated craft and review approaches.

## Change context while you work

Use the controls beside **Workflow** above the composer:

- **Design system** selects one active system. Design Harness includes Apple, Linear, Vercel, Notion, Airbnb, and Shadcn systems from the Open Design library.
- **Import DESIGN.md…** adds a local design-system document.
- **Influences** enables one or more craft approaches, including Emil Kowalski, Jakub Krehel, Ibelick, and Paul Bakaus's Impeccable approach.

The current design system and influences apply to every normal provider turn. Provider slash commands, such as `/compact`, remain unchanged.

## How design systems work

When you select a system, Design Harness writes its full definition to:

```text
.design-harness/design-systems/<id>/DESIGN.md
```

The provider receives hidden context that tells it to read that file before design work. This keeps the full design system in the real project instead of placing a large document in the visible composer.

Project rules and the user's request have the highest priority. The active design system controls visual tokens and component language. Influences act as craft lenses and must not copy a person's visual identity.
