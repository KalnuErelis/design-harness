import { describe, expect, it } from "vite-plus/test";

import {
  DESIGN_INFLUENCES_STORAGE_KEY,
  readDesignInfluenceIds,
  renderDesignInfluenceContext,
  writeDesignInfluenceIds,
} from "./influences";

function memoryStorage(initial: Readonly<Record<string, string>> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("design influences", () => {
  it("starts with Emil Kowalski as the opinionated default", () => {
    expect(readDesignInfluenceIds(memoryStorage())).toEqual(["emil-kowalski"]);
  });

  it("stores only known unique influences", () => {
    const storage = memoryStorage();

    writeDesignInfluenceIds(["emil-kowalski", "emil-kowalski", "jakub-krehel"], storage);

    expect(readDesignInfluenceIds(storage)).toEqual(["emil-kowalski", "jakub-krehel"]);
  });

  it("drops unknown stored influences", () => {
    const storage = memoryStorage({
      [DESIGN_INFLUENCES_STORAGE_KEY]: JSON.stringify(["emil-kowalski", "unknown"]),
    });

    expect(readDesignInfluenceIds(storage)).toEqual(["emil-kowalski"]);
  });

  it("renders selected approaches as provider context", () => {
    const context = renderDesignInfluenceContext(["emil-kowalski", "jakub-krehel"]);

    expect(context).toContain("Emil Kowalski");
    expect(context).toContain("Jakub Krehel");
    expect(context).not.toContain("Paul Bakaus");
  });
});
