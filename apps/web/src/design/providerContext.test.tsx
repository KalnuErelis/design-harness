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
    });

    expect(input).toMatch(/^Polish the account page\./);
    expect(input).toContain("<!-- design-harness-context");
    expect(input).toContain(system.relativePath);
    expect(input).toContain("Emil Kowalski");
    expect(input).toContain("Jakub Krehel");

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
      }),
    ).toBe("/compact");
  });

  it("returns the prompt unchanged when no context is active", () => {
    expect(
      composeDesignProviderInput({
        prompt: "Explain this component.",
        designSystem: null,
        influenceIds: [],
      }),
    ).toBe("Explain this component.");
  });
});
