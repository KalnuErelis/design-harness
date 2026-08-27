# CI quality gates

> For maintainers. Using Design Harness? See [docs/user](../user/).

[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs these quality gates on pull requests
and pushes to `main`:

- **Check and build**: format, lint, and workspace type checks. The same job
  builds the desktop pipeline (`vp run build:desktop`) and verifies the preload bundle exists and
  still exports its expected symbols.
- **Client and package tests**: tests the desktop and web clients plus shared workspace packages.
- **Server tests**: splits server tests into three stable shards.
- **Resource monitor tests**: checks process and resource monitoring behavior separately.

The public repository does not publish desktop binaries yet. Design Harness is a source-first alpha,
and release automation will be added only with the signing identities and platform credentials needed
to publish trusted artifacts. The repository must not copy T3 Code's private release infrastructure or
reuse its application identities.

See [Release Checklist](../operations/release.md) for the full release/signing setup checklist.
