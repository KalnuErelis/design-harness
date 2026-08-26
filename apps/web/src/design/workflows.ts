export const DESIGN_WORKFLOWS = [
  {
    id: "create",
    label: "Create",
    description: "Build a new interface from the brief and project context.",
    prompt:
      "Create the requested interface in this project. Read AGENTS.md, BRIEF.md, and DESIGN.md when they exist. Use the current stack and shared components. Preserve working project behavior. Run the app, inspect the result in the preview, and fix visible layout or responsive issues before you finish.",
  },
  {
    id: "restyle",
    label: "Restyle",
    description: "Change the visual direction without changing product behavior.",
    prompt:
      "Restyle the current interface. Read AGENTS.md and DESIGN.md when they exist. Keep the content, data flow, and product behavior. Improve the visual direction, hierarchy, type, color, spacing, and responsive layout. Verify the result in the preview before you finish.",
  },
  {
    id: "replicate",
    label: "Replicate",
    description: "Use the attached images or open preview as the visual reference.",
    prompt:
      "Recreate the visual direction from the attached references or the current preview. Read AGENTS.md and DESIGN.md when they exist. Match the layout, type, spacing, color, and responsive behavior while you use this project's components and conventions. Do not copy protected brand assets. Verify the result in the preview.",
  },
  {
    id: "critique",
    label: "Critique",
    description: "Review the current interface before you change it.",
    prompt:
      "Critique the current interface. Inspect it in the preview at desktop and mobile sizes. Report the most important problems with hierarchy, type, spacing, color, accessibility, interaction, and responsive behavior. Give exact fixes. Do not edit files until I ask you to apply the critique.",
  },
  {
    id: "polish",
    label: "Polish",
    description: "Improve quality while you preserve the current direction.",
    prompt:
      "Polish the current interface. Read AGENTS.md and DESIGN.md when they exist. Preserve the product direction and behavior. Improve hierarchy, type, spacing, color, states, accessibility, and responsive behavior. Reuse the current design system. Verify the result in the preview before you finish.",
  },
  {
    id: "fix-selection",
    label: "Fix selection",
    description: "Make a focused change from the selected preview context.",
    prompt:
      "Fix only the selected elements, marked regions, drawings, or style changes from the preview. Use the attached screenshot and element context to find the correct source files. Preserve unrelated layout and behavior. Verify the focused change in the preview before you finish.",
  },
] as const;

export type DesignWorkflow = (typeof DESIGN_WORKFLOWS)[number];
export type DesignWorkflowId = DesignWorkflow["id"];

function workflowAtEnd(prompt: string): DesignWorkflow | null {
  return DESIGN_WORKFLOWS.find((workflow) => prompt.trim().endsWith(workflow.prompt)) ?? null;
}

export function selectedDesignWorkflowId(prompt: string): DesignWorkflowId | null {
  return workflowAtEnd(prompt)?.id ?? null;
}

export function applyDesignWorkflow(prompt: string, workflow: DesignWorkflow): string {
  let request = prompt.trim();
  const currentWorkflow = workflowAtEnd(request);

  if (currentWorkflow) {
    request = request.slice(0, -currentWorkflow.prompt.length).trim();
  }

  return request.length > 0 ? `${request}\n\n${workflow.prompt}` : workflow.prompt;
}
