# Upstream maintenance

Design Harness is a downstream product built on [T3 Code](https://github.com/pingdotgg/t3code). T3 Code remains the runtime and client foundation. Design Harness adds a focused design workspace and adapts selected ideas from Open Design.

## Remotes

- `origin` is the Design Harness GitHub repository.
- `upstream` is `https://github.com/pingdotgg/t3code.git` and is fetch-only.

Do not push Design Harness branches to `upstream`.

## Update policy

Fetch and merge `upstream/main` regularly. Keep product changes in clear commits and product-owned modules so upstream conflicts remain reviewable. Preserve upstream package names when they are internal implementation details; a broad namespace rename provides little user value and makes every merge harder.

For each upstream update:

1. Read upstream release notes and the incoming diff.
2. Merge upstream into a temporary branch.
3. Resolve conflicts in favor of T3 Code's current foundation unless that removes an intentional Design Harness product rule.
4. Run focused tests for every conflict, then the public CI contract.
5. Confirm desktop identity, state paths, design workflows, checkpoints, and provider setup.
6. Merge the update as one reviewable pull request.

## Open Design imports

Open Design is an idea and reference source, not a second application foundation. Import one capability at a time, adapt it to T3 Code's architecture, and record source and license details in `THIRD_PARTY_NOTICES.md`. Do not copy its runtime or application structure into Design Harness.
