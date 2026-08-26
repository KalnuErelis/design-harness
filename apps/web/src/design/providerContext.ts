import type { ActiveDesignSystem } from "./designSystems";
import { renderDesignerToolkitContext, type DesignerToolkitId } from "./designerToolkit";
import { renderDesignInfluenceContext, type DesignInfluenceId } from "./influences";

const DESIGN_CONTEXT_START = "<!-- design-harness-context\n";
const DESIGN_CONTEXT_END = "\n-->";

export interface DesignProviderContextInput {
  readonly prompt: string;
  readonly designSystem: ActiveDesignSystem | null;
  readonly influenceIds: readonly DesignInfluenceId[];
  readonly toolkitIds: readonly DesignerToolkitId[];
}

export function composeDesignProviderInput(input: DesignProviderContextInput): string {
  const prompt = input.prompt.trim();
  if (prompt.startsWith("/")) return prompt;

  const sections: string[] = [
    [
      "Design Harness quality gate:",
      "- Inspect the existing interface, framework, dependencies, brand assets, and project rules before editing.",
      "- For visual work, use an available anti-slop frontend skill such as `leonxlnx-design-taste-frontend` when its scope fits. Use `jakub-better-ui` for product-interface polish and the applicable `uish-*` skill for focused checks.",
      "- Use real supplied or generated images, real product screenshots, and official icon or brand-mark libraries. Do not invent brand logos, draw fake interface screenshots with decorative divs, or use emoji as interface icons.",
      "- Keep one coherent visual language. Verify responsive behavior, keyboard and focus states, contrast, reduced motion, loading, empty, and error states before finishing.",
      "- Preserve performance. Do not add continuous decorative animation or a large dependency without a clear product need.",
    ].join("\n"),
  ];
  if (input.designSystem) {
    sections.push(
      [
        `Active design system: ${input.designSystem.title}`,
        `Read ${input.designSystem.relativePath} fully before you edit the interface.`,
        "Treat that DESIGN.md as authoritative for visual direction, color, typography, spacing, component shape, and theme rules. Do not invent conflicting tokens.",
      ].join("\n"),
    );
  }

  const toolkit = renderDesignerToolkitContext(input.toolkitIds);
  if (toolkit) {
    sections.push(
      [
        "Selected designer toolkit:",
        toolkit,
        "Use only the selected items that fit the task. Invoke selected agent skills when they are available. Check package.json and current official documentation before adding a dependency. Do not replace the existing framework or mix competing component and styling systems without an explicit request.",
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
