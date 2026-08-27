# Design Harness

Design Harness is a local design workspace for coding agents. It connects Codex or Claude to a real web project and makes the live interface the main control surface.

> **Alpha:** source development is open. There is not yet a signed or supported binary release. Run the app from source and keep backups of important projects.

The core loop is:

> Brief → generate → preview → annotate → revise → compare → restore

## Current product slice

- Start with a guided Codex or Claude setup.
- Open a local project.
- Choose a design workflow.
- Pull an Open Design system or import a local `DESIGN.md` as live thread context.
- Add opinionated craft approaches from Emil Kowalski and similar creators.
- Search a designer toolkit with frameworks, StyleX and other styling systems, component libraries, motion tools, real asset sources, quality checks, and agent skills.
- Apply an anti-slop quality gate to normal design turns.
- Run Codex or Claude in the real project folder.
- Open the live interface in the design canvas.
- Test desktop, tablet, mobile, and custom viewports.
- Select elements, mark regions, draw, and request style changes.
- Review changed files.
- Restore a Git-backed checkpoint.
- Use native macOS window material with a solid reduced-transparency fallback.

The first workflows are Create, Restyle, Replicate, Critique, Polish, and Fix selection.

## Product boundary

T3 Code remains the application foundation. Design Harness adds the design canvas, design context, annotation loop, and product identity. Open Design is a licensed source of selected ideas and design-system material, not a second runtime foundation.

The first release targets local desktop use with Codex and Claude. Hosted accounts, relay infrastructure, mobile distribution, and team features are outside that release.

## Run from source

Requirements:

- Node.js 24.13 or newer
- pnpm 11.10.0 through Corepack
- Codex CLI or Claude Code
- Rust 1.95 or newer only when you make a desktop package

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm exec vp run dev:desktop \
  --home-dir "$PWD/.t3" \
  --auto-bootstrap-project-from-cwd
```

The explicit data folder keeps development state inside this checkout.

See [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a change. Security reports use the private route in [SECURITY.md](./SECURITY.md).

## Checks

```bash
corepack pnpm --filter @t3tools/web typecheck
corepack pnpm --filter @t3tools/web test
corepack pnpm --filter @t3tools/web build
corepack pnpm --filter @t3tools/desktop typecheck
corepack pnpm run build:desktop
```

## Source and license

Design Harness starts from [T3 Code](https://github.com/pingdotgg/t3code). T3 Code is Copyright © 2026 T3 Tools Inc. and is available under the MIT License in [`LICENSE`](./LICENSE).

The first-run flow adapts the onboarding layout and artwork from [Open Design](https://github.com/nexu-io/open-design) under Apache License 2.0. The designer toolkit uses [Simple Icons](https://simpleicons.org/) under CC0 1.0. See [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md), [`third-party/open-design/LICENSE`](./third-party/open-design/LICENSE), and [`third-party/simple-icons/LICENSE.md`](./third-party/simple-icons/LICENSE.md).

The repository keeps T3 Code as an `upstream` remote. See [upstream maintenance](./docs/internals/upstream.md) for the merge policy and the rules for importing Open Design ideas.
