import { describe, expect, it } from "vite-plus/test";

import {
  DEFAULT_DESIGNER_TOOLKIT_IDS,
  DESIGNER_TOOLKIT_STORAGE_KEY,
  readDesignerToolkitIds,
  renderDesignerToolkitContext,
  searchDesignerToolkit,
  writeDesignerToolkitIds,
  type DesignerToolkitId,
} from "./designerToolkit";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("designer toolkit", () => {
  it("starts with the quality and real-asset essentials", () => {
    expect(readDesignerToolkitIds(memoryStorage())).toEqual(DEFAULT_DESIGNER_TOOLKIT_IDS);
    expect(DEFAULT_DESIGNER_TOOLKIT_IDS).toContain("leonxlnx-design-taste");
    expect(DEFAULT_DESIGNER_TOOLKIT_IDS).toContain("uish-design");
    expect(DEFAULT_DESIGNER_TOOLKIT_IDS).toContain("simple-icons");
  });

  it("stores only known unique items", () => {
    const storage = memoryStorage();
    writeDesignerToolkitIds(
      ["stylex", "stylex", "hugeicons", "unknown" as DesignerToolkitId],
      storage,
    );

    expect(readDesignerToolkitIds(storage)).toEqual(["stylex", "hugeicons"]);
  });

  it("drops unknown stored items", () => {
    const storage = memoryStorage({
      [DESIGNER_TOOLKIT_STORAGE_KEY]: JSON.stringify(["react", "missing", "uish-design"]),
    });

    expect(readDesignerToolkitIds(storage)).toEqual(["react", "uish-design"]);
  });

  it("searches names, packages, categories, and skill names", () => {
    expect(searchDesignerToolkit("@stylexjs").map((item) => item.id)).toContain("stylex");
    expect(searchDesignerToolkit("agent anti slop").map((item) => item.id)).toContain(
      "leonxlnx-design-taste",
    );
    expect(searchDesignerToolkit("components ai").map((item) => item.id)).toContain("ai-elements");
  });

  it("renders concise provider guidance", () => {
    const context = renderDesignerToolkitContext(["stylex", "uish-design"]);
    expect(context).toContain("StyleX");
    expect(context).toContain("uish-design");
    expect(context).not.toContain("React:");
  });
});
