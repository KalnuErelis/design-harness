# First-run onboarding

Design Harness opens a five-step guide the first time it runs:

1. Review the design workflow.
2. Choose Codex or Claude as the default design agent.
3. Choose opinionated design influences.
4. Choose an initial design system or use the project default.
5. Open an existing workspace or choose a project folder.

The agent choice becomes the default when a thread does not already select a provider. A thread or project setting still takes priority.

`AGENTS.md`, `BRIEF.md`, and `DESIGN.md` are optional. Design Harness reads them from the project when they exist. An active library system is copied to `.design-harness/design-systems/<id>/DESIGN.md` in the project and added to each provider turn as hidden context.

To open the guide again, go to **Settings → General → About → First-run guide** and select **Replay onboarding**.
