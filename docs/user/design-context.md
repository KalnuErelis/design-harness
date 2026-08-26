# Design context

Design Harness keeps four kinds of context separate:

- **Project context** comes from `AGENTS.md`, `BRIEF.md`, and `DESIGN.md` in the repository.
- **Design system** sets the active visual contract.
- **Designer toolkit** selects useful frameworks, libraries, references, assets, quality checks, and agent skills.
- **Design influences** add opinionated craft and review approaches.

## Change context while you work

Use the **Context** controls above the composer:

- **Design system** selects one active system. Design Harness includes Apple, Linear, Vercel, Notion, Airbnb, and Shadcn systems from the Open Design library.
- **Import DESIGN.md…** adds a local design-system document.
- **Toolkit** opens a searchable catalog. It includes common web stacks, StyleX and other styling systems, component sources, motion tools, real image and icon sources, tests, and installed design skills.
- **Influences** enables one or more craft approaches, including Emil Kowalski, Jakub Krehel, Ibelick, and Paul Bakaus's Impeccable approach.

The active system, toolkit, and influences apply to every normal provider turn. Provider slash commands, such as `/compact`, remain unchanged.

## Quality gate

Design Harness adds a small quality gate to each normal turn. It tells the agent to:

- inspect the existing stack and brand before editing;
- use an anti-slop design skill when its scope fits;
- use real images, product screenshots, and official icon libraries;
- verify responsive behavior, access, states, contrast, and reduced motion;
- avoid decorative motion and large dependencies without a clear need.

Selected toolkit items are options, not permission to replace the project's stack. The agent must inspect `package.json` and current official documentation before it adds a package. It must not mix competing component or styling systems without an explicit request.

## How design systems work

When you select a system, Design Harness writes its full definition to:

```text
.design-harness/design-systems/<id>/DESIGN.md
```

The provider receives hidden context that tells it to read that file before design work. This keeps the full design system in the real project instead of placing a large document in the visible composer.

Project rules and the user's request have the highest priority. The active design system controls visual tokens and component language. Influences act as craft lenses and must not copy a person's visual identity.
