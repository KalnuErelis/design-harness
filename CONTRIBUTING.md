# Contributing

Design Harness is an early desktop product built on T3 Code. Contributions are welcome when they keep the product focused, local, and maintainable.

## Before you start

- Search existing issues and pull requests.
- Open an issue before a large feature or architectural change.
- Keep one concern in each pull request.
- Do not include credentials, private project data, or generated PR evidence in the repository.
- Preserve the T3 Code and Open Design license notices.

The first release supports the desktop design workflow with Codex and Claude. Mobile, relay, hosted accounts, and team features are not current release targets.

## Development

Requirements and source setup are in the [README](README.md). Use the smallest relevant checks while developing:

```bash
vp test run path/to/changed.test.ts
vp run --filter @t3tools/web typecheck
vp run --filter @t3tools/desktop typecheck
vp run build:desktop
```

Do not run development servers against `~/.design-harness/userdata` or `~/.t3/userdata`. Use the checkout-local `.t3` directory.

## Pull requests

Explain the problem, the change, and the proof. UI changes need before and after images. Motion and timing changes need a short recording. Upload review evidence to GitHub; do not commit it.

Use a conventional commit title, such as `fix(design): restore the selected viewport`.

By submitting a contribution, you agree that it is licensed under this repository's MIT License and that you have the right to submit it.
