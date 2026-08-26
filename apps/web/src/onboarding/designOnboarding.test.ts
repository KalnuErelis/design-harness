import { describe, expect, it } from "vite-plus/test";

import {
  completeDesignOnboarding,
  DESIGN_AGENT_PREFERENCE_STORAGE_KEY,
  DESIGN_ONBOARDING_COMPLETED_STORAGE_KEY,
  hasCompletedDesignOnboarding,
  readDesignAgentPreference,
  resetDesignOnboarding,
  writeDesignAgentPreference,
} from "./designOnboarding";

function memoryStorage(initial: Readonly<Record<string, string>> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("design onboarding persistence", () => {
  it("shows onboarding until the user completes or skips it", () => {
    const storage = memoryStorage();

    expect(hasCompletedDesignOnboarding(storage)).toBe(false);
    completeDesignOnboarding(storage);
    expect(hasCompletedDesignOnboarding(storage)).toBe(true);
    expect(storage.getItem(DESIGN_ONBOARDING_COMPLETED_STORAGE_KEY)).toBe("complete");

    resetDesignOnboarding(storage);
    expect(hasCompletedDesignOnboarding(storage)).toBe(false);
  });

  it("stores Codex and Claude preferences", () => {
    const storage = memoryStorage();

    writeDesignAgentPreference("claudeAgent", storage);
    expect(readDesignAgentPreference(storage)).toBe("claudeAgent");
    expect(storage.getItem(DESIGN_AGENT_PREFERENCE_STORAGE_KEY)).toBe("claudeAgent");

    writeDesignAgentPreference("codex", storage);
    expect(readDesignAgentPreference(storage)).toBe("codex");
  });

  it("ignores unknown stored agent values", () => {
    const storage = memoryStorage({
      [DESIGN_AGENT_PREFERENCE_STORAGE_KEY]: "other-agent",
    });

    expect(readDesignAgentPreference(storage)).toBeNull();
  });

  it("fails open when browser storage is blocked", () => {
    const blockedStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };

    expect(hasCompletedDesignOnboarding(blockedStorage)).toBe(true);
    expect(readDesignAgentPreference(blockedStorage)).toBeNull();
    expect(() => completeDesignOnboarding(blockedStorage)).not.toThrow();
    expect(() =>
      resetDesignOnboarding({ ...blockedStorage, removeItem: blockedStorage.setItem }),
    ).not.toThrow();
    expect(() => writeDesignAgentPreference("codex", blockedStorage)).not.toThrow();
  });
});
