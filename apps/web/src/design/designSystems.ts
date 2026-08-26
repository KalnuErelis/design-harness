import { useSyncExternalStore } from "react";

export const ACTIVE_DESIGN_SYSTEM_STORAGE_KEY = "design-harness:active-design-system:v1";

const ACTIVE_DESIGN_SYSTEM_EVENT = "design-harness:active-design-system-change";
const DESIGN_SYSTEM_CONTEXT_ROOT = ".design-harness/design-systems";

export const BUNDLED_DESIGN_SYSTEMS = [
  {
    id: "apple",
    title: "Apple",
    category: "Product precision",
    description: "Editorial calm, cinematic product focus, and dense commerce when needed.",
  },
  {
    id: "linear-app",
    title: "Linear",
    category: "Dark product UI",
    description: "Near-black surfaces, exact type, low-noise borders, and restrained indigo.",
  },
  {
    id: "vercel",
    title: "Vercel",
    category: "Developer minimalism",
    description: "Monochrome structure, compressed type, and layered shadow-as-border depth.",
  },
  {
    id: "notion",
    title: "Notion",
    category: "Warm minimalism",
    description: "Paper-like neutrals, approachable type, whisper borders, and quiet depth.",
  },
  {
    id: "airbnb",
    title: "Airbnb",
    category: "Content-led consumer",
    description: "Full-bleed photography, disciplined grayscale, and a single coral accent.",
  },
  {
    id: "shadcn",
    title: "Shadcn",
    category: "Component system",
    description: "Clean monochrome primitives, utility-first structure, and accessible defaults.",
  },
] as const;

export type BundledDesignSystem = (typeof BUNDLED_DESIGN_SYSTEMS)[number];

const BUNDLED_DESIGN_SYSTEM_LOADERS: Record<BundledDesignSystem["id"], () => Promise<string>> = {
  apple: () => import("./systems/apple.md?raw").then((module) => module.default),
  "linear-app": () => import("./systems/linear-app.md?raw").then((module) => module.default),
  vercel: () => import("./systems/vercel.md?raw").then((module) => module.default),
  notion: () => import("./systems/notion.md?raw").then((module) => module.default),
  airbnb: () => import("./systems/airbnb.md?raw").then((module) => module.default),
  shadcn: () => import("./systems/shadcn.md?raw").then((module) => module.default),
};

export interface ActiveDesignSystem {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly body: string;
  readonly relativePath: string;
  readonly source: "open-design" | "imported";
}

interface StoredDesignSystem {
  readonly id: string;
  readonly title?: string;
  readonly body?: string;
}

interface ReadableStorage {
  readonly getItem: (key: string) => string | null;
}

interface WritableStorage extends ReadableStorage {
  readonly setItem: (key: string, value: string) => void;
  readonly removeItem: (key: string) => void;
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function designSystemPath(id: string): string {
  const filename = id
    .replace(/^custom:/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
  return `${DESIGN_SYSTEM_CONTEXT_ROOT}/${filename || "custom"}/DESIGN.md`;
}

export async function loadBundledDesignSystem(id: string): Promise<ActiveDesignSystem | null> {
  const system = BUNDLED_DESIGN_SYSTEMS.find((candidate) => candidate.id === id);
  if (!system) return null;
  const body = await BUNDLED_DESIGN_SYSTEM_LOADERS[system.id]();
  return {
    ...system,
    body,
    relativePath: designSystemPath(system.id),
    source: "open-design",
  };
}

export function createImportedDesignSystem(title: string, body: string): ActiveDesignSystem {
  const cleanTitle = title.trim() || "Imported design system";
  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const id = `custom:${slug || "design-system"}`;
  return {
    id,
    title: cleanTitle,
    category: "Imported DESIGN.md",
    description: "A local design system imported into this workspace.",
    body: body.trim(),
    relativePath: designSystemPath(id),
    source: "imported",
  };
}

export function readActiveDesignSystem(
  storage: ReadableStorage | null = browserStorage(),
): ActiveDesignSystem | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(ACTIVE_DESIGN_SYSTEM_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredDesignSystem;
    const bundled = BUNDLED_DESIGN_SYSTEMS.find((candidate) => candidate.id === value.id);
    if (bundled && typeof value.body === "string" && value.body.trim()) {
      return {
        ...bundled,
        body: value.body,
        relativePath: designSystemPath(bundled.id),
        source: "open-design",
      };
    }
    if (
      value.id.startsWith("custom:") &&
      typeof value.title === "string" &&
      typeof value.body === "string" &&
      value.body.trim()
    ) {
      return createImportedDesignSystem(value.title, value.body);
    }
    return null;
  } catch {
    return null;
  }
}

export function writeActiveDesignSystem(
  system: ActiveDesignSystem | null,
  storage: WritableStorage | null = browserStorage(),
): void {
  if (!storage) return;
  try {
    if (system === null) {
      storage.removeItem(ACTIVE_DESIGN_SYSTEM_STORAGE_KEY);
    } else {
      const stored: StoredDesignSystem =
        system.source === "imported"
          ? { id: system.id, title: system.title, body: system.body }
          : { id: system.id, body: system.body };
      storage.setItem(ACTIVE_DESIGN_SYSTEM_STORAGE_KEY, JSON.stringify(stored));
    }
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(ACTIVE_DESIGN_SYSTEM_EVENT));
    }
  } catch {
    // A blocked preference store must not stop the composer.
  }
}

function activeDesignSystemSnapshot(): string {
  try {
    return browserStorage()?.getItem(ACTIVE_DESIGN_SYSTEM_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribeToActiveDesignSystem(onChange: () => void): () => void {
  window.addEventListener(ACTIVE_DESIGN_SYSTEM_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ACTIVE_DESIGN_SYSTEM_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useActiveDesignSystem(): ActiveDesignSystem | null {
  useSyncExternalStore(subscribeToActiveDesignSystem, activeDesignSystemSnapshot, () => "");
  return readActiveDesignSystem();
}
