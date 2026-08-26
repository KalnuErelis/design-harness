import { describe, expect, it } from "@effect/vitest";

import { applyDesignWorkflow, DESIGN_WORKFLOWS, selectedDesignWorkflowId } from "./workflows";

const workflow = (id: (typeof DESIGN_WORKFLOWS)[number]["id"]) =>
  DESIGN_WORKFLOWS.find((entry) => entry.id === id)!;

describe("design workflows", () => {
  it("fills an empty prompt", () => {
    expect(applyDesignWorkflow("", workflow("polish"))).toBe(workflow("polish").prompt);
  });

  it("keeps the user's request before the workflow", () => {
    expect(applyDesignWorkflow("Make the pricing page calmer.", workflow("restyle"))).toBe(
      `Make the pricing page calmer.\n\n${workflow("restyle").prompt}`,
    );
  });

  it("replaces the previous workflow without copying it", () => {
    const first = applyDesignWorkflow("Keep the blue logo.", workflow("create"));
    const second = applyDesignWorkflow(first, workflow("polish"));

    expect(second).toBe(`Keep the blue logo.\n\n${workflow("polish").prompt}`);
    expect(second).not.toContain(workflow("create").prompt);
  });

  it("finds the workflow at the end of a user request", () => {
    const prompt = applyDesignWorkflow("Use the attached reference.", workflow("replicate"));
    expect(selectedDesignWorkflowId(prompt)).toBe("replicate");
  });
});
