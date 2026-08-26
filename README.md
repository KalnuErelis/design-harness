# Design Harness

Design Harness is a local design workspace for coding agents. It connects Codex or Claude to a real web project and makes the live interface the main control surface.

The core loop is:

> Brief → generate → preview → annotate → revise → compare → restore

## Current product slice

- Open a local project.
- Choose a design workflow.
- Run Codex or Claude in the real project folder.
- Open the live interface in the design canvas.
- Test desktop, tablet, mobile, and custom viewports.
- Select elements, mark regions, draw, and request style changes.
- Review changed files.
- Restore a Git-backed checkpoint.
- Use native macOS window material with a solid reduced-transparency fallback.

The first workflows are Create, Restyle, Replicate, Critique, Polish, and Fix selection.

## Run from source

Requirements:

- Node.js 24.13 or newer
- pnpm 11.10.0 through Corepack
- Codex CLI or Claude Code

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm exec vp run dev:desktop \
  --home-dir "$PWD/.t3" \
  --auto-bootstrap-project-from-cwd
```

The explicit data folder keeps development state inside this checkout.

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

Open Design is a product and design reference for later work. This first product slice does not copy Open Design source code.
