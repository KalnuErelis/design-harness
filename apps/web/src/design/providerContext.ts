import type { ActiveDesignSystem } from "./designSystems";
import { renderDesignInfluenceContext, type DesignInfluenceId } from "./influences";

const DESIGN_CONTEXT_START = "<!-- design-harness-context\n";
const DESIGN_CONTEXT_END = "\n-->";

export interface DesignProviderContextInput {
  readonly prompt: string;
  readonly designSystem: ActiveDesignSystem | null;
  readonly influenceIds: readonly DesignInfluenceId[];
}

export function composeDesignProviderInput(input: DesignProviderContextInput): string {
  const prompt = input.prompt.trim();
  if (prompt.startsWith("/")) return prompt;

  const sections: string[] = [];
  if (input.designSystem) {
    sections.push(
      [
        `Active design system: ${input.designSystem.title}`,
        `Read ${input.designSystem.relativePath} fully before you edit the interface.`,
        "Treat that DESIGN.md as authoritative for visual direction, color, typography, spacing, component shape, and theme rules. Do not invent conflicting tokens.",
      ].join("\n"),
    );
  }

  const influences = renderDesignInfluenceContext(input.influenceIds);
  if (influences) {
    sections.push(
      [
        "Selected design influences:",
        influences,
        "Use these as craft lenses, not requests to copy a person's visual identity. The active design system and project rules take priority.",
      ].join("\n"),
    );
  }

  if (sections.length === 0) return prompt;
  const hiddenContext = `${DESIGN_CONTEXT_START}${sections.join("\n\n")}${DESIGN_CONTEXT_END}`;
  return prompt ? `${prompt}\n\n${hiddenContext}` : hiddenContext;
}

export function stripDesignProviderContext(input: string): string {
  const start = input.lastIndexOf(DESIGN_CONTEXT_START);
  if (start < 0) return input;
  const end = input.indexOf(DESIGN_CONTEXT_END, start);
  if (end < 0 || input.slice(end + DESIGN_CONTEXT_END.length).trim()) return input;
  return input.slice(0, start).trimEnd();
}
