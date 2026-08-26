import { useSyncExternalStore } from "react";

export const DESIGN_ONBOARDING_COMPLETED_STORAGE_KEY = "design-harness:onboarding-completed:v1";
export const DESIGN_AGENT_PREFERENCE_STORAGE_KEY = "design-harness:preferred-agent:v1";

const DESIGN_AGENT_PREFERENCE_EVENT = "design-harness:preferred-agent-change";

export type DesignAgentPreference = "codex" | "claudeAgent";

interface ReadableStorage {
  readonly getItem: (key: string) => string | null;
}

interface WritableStorage extends ReadableStorage {
  readonly setItem: (key: string, value: string) => void;
}

interface RemovableStorage extends ReadableStorage {
  readonly removeItem: (key: string) => void;
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function hasCompletedDesignOnboarding(
  storage: ReadableStorage | null = browserStorage(),
): boolean {
  if (!storage) return true;
  try {
    return storage.getItem(DESIGN_ONBOARDING_COMPLETED_STORAGE_KEY) === "complete";
  } catch {
    return true;
  }
}

export function completeDesignOnboarding(storage: WritableStorage | null = browserStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(DESIGN_ONBOARDING_COMPLETED_STORAGE_KEY, "complete");
  } catch {
    // A blocked storage write must not trap the user in onboarding.
  }
}

export function resetDesignOnboarding(storage: RemovableStorage | null = browserStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(DESIGN_ONBOARDING_COMPLETED_STORAGE_KEY);
  } catch {
    // A blocked storage write must not break Settings.
  }
}

export function readDesignAgentPreference(
  storage: ReadableStorage | null = browserStorage(),
): DesignAgentPreference | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(DESIGN_AGENT_PREFERENCE_STORAGE_KEY);
    return value === "codex" || value === "claudeAgent" ? value : null;
  } catch {
    return null;
  }
}

export function writeDesignAgentPreference(
  preference: DesignAgentPreference,
  storage: WritableStorage | null = browserStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(DESIGN_AGENT_PREFERENCE_STORAGE_KEY, preference);
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(DESIGN_AGENT_PREFERENCE_EVENT));
    }
  } catch {
    // The composer will use its normal provider fallback when storage is blocked.
  }
}

function subscribeToDesignAgentPreference(onChange: () => void): () => void {
  window.addEventListener(DESIGN_AGENT_PREFERENCE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DESIGN_AGENT_PREFERENCE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDesignAgentPreference(): DesignAgentPreference | null {
  return useSyncExternalStore(
    subscribeToDesignAgentPreference,
    () => readDesignAgentPreference(),
    () => null,
  );
}
