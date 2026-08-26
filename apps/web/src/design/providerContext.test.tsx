import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vite-plus/test";

import { createImportedDesignSystem } from "./designSystems";
import { composeDesignProviderInput, stripDesignProviderContext } from "./providerContext";

const system = createImportedDesignSystem("Editorial", "# Editorial");

describe("design provider context", () => {
  it("keeps the visible request first and adds hidden persistent context", () => {
    const input = composeDesignProviderInput({
      prompt: "Polish the account page.",
      designSystem: system,
      influenceIds: ["emil-kowalski", "jakub-krehel"],
      toolkitIds: ["stylex", "leonxlnx-design-taste"],
    });

    expect(input).toMatch(/^Polish the account page\./);
    expect(input).toContain("<!-- design-harness-context");
    expect(input).toContain(system.relativePath);
    expect(input).toContain("Emil Kowalski");
    expect(input).toContain("Jakub Krehel");
    expect(input).toContain("StyleX");
    expect(input).toContain("leonxlnx-design-taste-frontend");
    expect(input).toContain("Design Harness quality gate");

    const renderedMessage = renderToStaticMarkup(
      <ReactMarkdown>{stripDesignProviderContext(input)}</ReactMarkdown>,
    );
    expect(renderedMessage).toContain("Polish the account page.");
    expect(renderedMessage).not.toContain("design-harness-context");
    expect(renderedMessage).not.toContain("Emil Kowalski");
  });

  it("does not alter provider slash commands", () => {
    expect(
      composeDesignProviderInput({
        prompt: "/compact",
        designSystem: system,
        influenceIds: ["emil-kowalski"],
        toolkitIds: ["uish-design"],
      }),
    ).toBe("/compact");
  });

  it("keeps the quality gate active when no optional context is selected", () => {
    const input = composeDesignProviderInput({
      prompt: "Explain this component.",
      designSystem: null,
      influenceIds: [],
      toolkitIds: [],
    });

    expect(input).toMatch(/^Explain this component\./);
    expect(input).toContain("Design Harness quality gate");
    expect(stripDesignProviderContext(input)).toBe("Explain this component.");
  });
});
