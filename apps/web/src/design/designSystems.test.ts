import { describe, expect, it } from "vite-plus/test";

import {
  BUNDLED_DESIGN_SYSTEMS,
  createImportedDesignSystem,
  loadBundledDesignSystem,
  readActiveDesignSystem,
  writeActiveDesignSystem,
} from "./designSystems";

function memoryStorage(initial: Readonly<Record<string, string>> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("active design system", () => {
  it("loads and restores a bundled Open Design system", async () => {
    const storage = memoryStorage();
    const loaded = await loadBundledDesignSystem("linear-app");
    writeActiveDesignSystem(loaded, storage);

    const system = readActiveDesignSystem(storage);
    expect(system?.title).toBe("Linear");
    expect(system?.body).toContain("Linear's website");
    expect(system?.relativePath).toBe(".design-harness/design-systems/linear-app/DESIGN.md");
  });

  it("persists imported DESIGN.md content", () => {
    const storage = memoryStorage();
    const imported = createImportedDesignSystem("Warm Product", "# Warm Product\n\nUse cream.");

    writeActiveDesignSystem(imported, storage);

    expect(readActiveDesignSystem(storage)).toMatchObject({
      id: "custom:warm-product",
      title: "Warm Product",
      body: "# Warm Product\n\nUse cream.",
    });
  });

  it("clears the active system without removing the bundled catalog", async () => {
    const storage = memoryStorage();
    writeActiveDesignSystem(await loadBundledDesignSystem("apple"), storage);

    writeActiveDesignSystem(null, storage);

    expect(readActiveDesignSystem(storage)).toBeNull();
    expect(BUNDLED_DESIGN_SYSTEMS).toHaveLength(6);
  });
});
