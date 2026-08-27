# Desktop release policy

Design Harness does not reuse T3 Code's release infrastructure, accounts, domains, npm package, relay, or signing credentials.

## Current channel

The repository is source-first while the desktop application is in alpha. `main` must build and pass CI. No workflow publishes an installer, hosted application, mobile build, relay, package, or release automatically.

The first binary release target is macOS desktop with local projects and the Codex and Claude providers. Windows and Linux follow after the macOS install and update path is reliable.

## Release requirements

Before enabling a release workflow, maintainers must provide and verify:

- a Design Harness GitHub repository used by `electron-updater`;
- the production bundle ID `com.jauniuskadunas.designharness`;
- a Design Harness URL scheme that does not claim T3 Code's scheme;
- Apple Developer signing and notarization credentials owned by the maintainer;
- a clean-machine install and launch smoke test;
- update metadata and an update test from the previous Design Harness version;
- a state migration and checkpoint restore test;
- release notes, checksums, and a GitHub prerelease for alpha versions;
- a documented rollback path.

Release automation must be introduced as a small Design Harness workflow. Do not restore the inherited T3 Code release workflow: it includes unrelated relay, Vercel, mobile, AUR, npm, Discord, and GitHub App operations.

## Versioning

Use semantic versions. Alpha releases use `v0.1.0-alpha.N`. A tag must identify the exact source used for every artifact. The packaged desktop version and update metadata must match that tag.

## Verification record

For each release, record the tested commit, operating system and architecture, focused test output, installer result, launch result, provider connection result, checkpoint restore result, and update result in the GitHub Release notes.
