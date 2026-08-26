import { useSyncExternalStore } from "react";

export const DESIGN_INFLUENCES_STORAGE_KEY = "design-harness:design-influences:v1";

const DESIGN_INFLUENCES_EVENT = "design-harness:design-influences-change";

export const DESIGN_INFLUENCES = [
  {
    id: "emil-kowalski",
    name: "Emil Kowalski",
    shortName: "Emil",
    source: "animations.dev",
    description: "Purposeful motion, tactile feedback, and invisible details that compound.",
    prompt:
      "Use Emil Kowalski's design-engineering approach. When available, use `emil-design-eng`, and use `emilkowalski-motion` only when motion helps. Prefer purposeful feedback, strong easing, short timing, interruptible transitions, and reduced-motion support. Do not add motion only as decoration.",
  },
  {
    id: "jakub-krehel",
    name: "Jakub Krehel",
    shortName: "Jakub",
    source: "Better UI",
    description: "Interface craft across layout, type, color, writing, and accessibility.",
    prompt:
      "Use Jakub Krehel's Better UI approach. When available, use `jakub-better-ui` and only the specialist skills the task needs. Check grouping, optical alignment, concentric radii, typography, color, UX writing, focus, keyboard support, hit areas, responsive layout, and reduced motion.",
  },
  {
    id: "ibelick",
    name: "Ibelick",
    shortName: "Ibelick",
    source: "ui-skills",
    description: "Opinionated UI constraints that keep small decisions coherent.",
    prompt:
      "Use Ibelick's opinionated `ui-skills` approach when available. Keep the interface coherent through strong defaults, native semantics, restrained surfaces, clear hierarchy, and consistent interaction patterns. Avoid generic component-library output and decorative UI that has no product purpose.",
  },
  {
    id: "impeccable",
    name: "Paul Bakaus",
    shortName: "Impeccable",
    source: "Impeccable",
    description: "A decisive post-build pass that removes AI tells and hardens the result.",
    prompt:
      "Use Paul Bakaus's Impeccable approach. When available, use `impeccable-design-polish` after the main implementation. Preserve intent, fix the highest-impact hierarchy and responsive issues, remove generic AI tells, harden states and accessibility, and leave the interface runnable rather than returning only a critique.",
  },
] as const;

export type DesignInfluence = (typeof DESIGN_INFLUENCES)[number];
export type DesignInfluenceId = DesignInfluence["id"];

interface ReadableStorage {
  readonly getItem: (key: string) => string | null;
}

interface WritableStorage extends ReadableStorage {
  readonly setItem: (key: string, value: string) => void;
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isDesignInfluenceId(value: unknown): value is DesignInfluenceId {
  return DESIGN_INFLUENCES.some((influence) => influence.id === value);
}

export function readDesignInfluenceIds(
  storage: ReadableStorage | null = browserStorage(),
): DesignInfluenceId[] {
  if (!storage) return [];
  try {
    const storedValue = storage.getItem(DESIGN_INFLUENCES_STORAGE_KEY);
    if (storedValue === null) return ["emil-kowalski"];
    const value: unknown = JSON.parse(storedValue);
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(isDesignInfluenceId))];
  } catch {
    return [];
  }
}

export function writeDesignInfluenceIds(
  ids: readonly DesignInfluenceId[],
  storage: WritableStorage | null = browserStorage(),
): void {
  if (!storage) return;
  const uniqueIds = [...new Set(ids.filter(isDesignInfluenceId))];
  try {
    storage.setItem(DESIGN_INFLUENCES_STORAGE_KEY, JSON.stringify(uniqueIds));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(DESIGN_INFLUENCES_EVENT));
    }
  } catch {
    // The workflow still works without a stored influence list.
  }
}

function subscribeToDesignInfluences(onChange: () => void): () => void {
  window.addEventListener(DESIGN_INFLUENCES_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DESIGN_INFLUENCES_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDesignInfluenceIds(): DesignInfluenceId[] {
  const value = useSyncExternalStore(
    subscribeToDesignInfluences,
    () => JSON.stringify(readDesignInfluenceIds()),
    () => "[]",
  );
  return JSON.parse(value) as DesignInfluenceId[];
}

export function renderDesignInfluenceContext(ids: readonly DesignInfluenceId[]): string {
  return DESIGN_INFLUENCES.filter((influence) => ids.includes(influence.id))
    .map((influence) => `- ${influence.name}: ${influence.prompt}`)
    .join("\n");
}
