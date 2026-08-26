import { useSyncExternalStore } from "react";

export const DESIGNER_TOOLKIT_STORAGE_KEY = "design-harness:designer-toolkit:v1";

const DESIGNER_TOOLKIT_EVENT = "design-harness:designer-toolkit-change";

export const DESIGNER_TOOLKIT_CATEGORIES = [
  "Build stack",
  "Styling",
  "Components",
  "Motion",
  "Assets",
  "Quality",
  "Agent skills",
] as const;

export type DesignerToolkitCategory = (typeof DESIGNER_TOOLKIT_CATEGORIES)[number];
export type DesignerToolkitKind = "library" | "resource" | "skill";

export interface DesignerToolkitItem {
  readonly id: string;
  readonly name: string;
  readonly category: DesignerToolkitCategory;
  readonly kind: DesignerToolkitKind;
  readonly description: string;
  readonly url?: string;
  readonly packageName?: string;
  readonly skillName?: string;
  readonly icon:
    | { readonly type: "simple"; readonly name: string }
    | { readonly type: "image"; readonly src: string }
    | { readonly type: "skill" };
  readonly instruction: string;
  readonly keywords?: readonly string[];
}

export const DESIGNER_TOOLKIT = [
  {
    id: "react",
    name: "React",
    category: "Build stack",
    kind: "library",
    description: "Component model for interactive web interfaces.",
    url: "https://react.dev/",
    packageName: "react",
    icon: { type: "simple", name: "react" },
    instruction:
      "Use React only when it matches the existing project. Preserve its component and state conventions.",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Build stack",
    kind: "library",
    description: "React framework for product and marketing sites.",
    url: "https://nextjs.org/",
    packageName: "next",
    icon: { type: "simple", name: "nextjs" },
    instruction:
      "Use the existing Next.js router and rendering model. Keep client components narrow.",
  },
  {
    id: "astro",
    name: "Astro",
    category: "Build stack",
    kind: "library",
    description: "Content-first framework with isolated interactive islands.",
    url: "https://astro.build/",
    packageName: "astro",
    icon: { type: "simple", name: "astro" },
    instruction:
      "Prefer static Astro output and add interactive islands only where the design needs them.",
  },
  {
    id: "sveltekit",
    name: "SvelteKit",
    category: "Build stack",
    kind: "library",
    description: "Svelte framework for fast, compact interfaces.",
    url: "https://svelte.dev/docs/kit",
    packageName: "@sveltejs/kit",
    icon: { type: "simple", name: "svelte" },
    instruction:
      "Follow the existing SvelteKit routing and reactivity patterns. Do not add React conventions.",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    category: "Build stack",
    kind: "library",
    description: "Vue framework for server-rendered applications.",
    url: "https://nuxt.com/",
    packageName: "nuxt",
    icon: { type: "simple", name: "nuxt" },
    instruction:
      "Follow the existing Nuxt and Vue composition patterns. Keep hydration and client work scoped.",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Styling",
    kind: "library",
    description: "Utility-first styling with explicit responsive states.",
    url: "https://tailwindcss.com/",
    packageName: "tailwindcss",
    icon: { type: "simple", name: "tailwind" },
    instruction:
      "Use the installed Tailwind version and existing tokens. Normalize conflicting utilities before finishing.",
  },
  {
    id: "stylex",
    name: "StyleX",
    category: "Styling",
    kind: "library",
    description: "Meta's typed, compile-time CSS system.",
    url: "https://stylexjs.com/",
    packageName: "@stylexjs/stylex",
    icon: { type: "image", src: "/toolkit-icons/stylex.svg" },
    instruction:
      "Use StyleX when the project already uses it or the user requests it. Do not introduce a second styling system by accident.",
  },
  {
    id: "css-modules",
    name: "CSS Modules",
    category: "Styling",
    kind: "library",
    description: "Locally scoped CSS without a runtime.",
    url: "https://github.com/css-modules/css-modules",
    icon: { type: "simple", name: "cssmodules" },
    instruction:
      "Keep selectors local, use project tokens, and avoid duplicating styles that existing components own.",
  },
  {
    id: "vanilla-extract",
    name: "Vanilla Extract",
    category: "Styling",
    kind: "library",
    description: "Type-safe, zero-runtime CSS for design tokens and components.",
    url: "https://vanilla-extract.style/",
    packageName: "@vanilla-extract/css",
    icon: { type: "simple", name: "vanillaextract" },
    instruction:
      "Use Vanilla Extract only when it fits the current build tool and token architecture.",
  },
  {
    id: "ai-elements",
    name: "AI Elements",
    category: "Components",
    kind: "resource",
    description: "AI-native components built on shadcn/ui.",
    url: "https://elements.ai-sdk.dev/",
    icon: { type: "image", src: "/toolkit-icons/ai-elements.png" },
    instruction:
      "Use AI Elements for real chat, tool, reasoning, and agent states. Adapt it to the product system instead of copying the default theme.",
  },
  {
    id: "aceternity-ui",
    name: "Aceternity UI",
    category: "Components",
    kind: "resource",
    description: "React, Tailwind, and Motion blocks for expressive web surfaces.",
    url: "https://ui.aceternity.com/",
    icon: { type: "image", src: "/toolkit-icons/aceternity.png" },
    instruction:
      "Use Aceternity blocks selectively. Remove decorative motion and effects that do not support the brief.",
  },
  {
    id: "magic-ui",
    name: "Magic UI",
    category: "Components",
    kind: "resource",
    description: "Animated React and Tailwind components for marketing sites.",
    url: "https://magicui.design/",
    icon: { type: "image", src: "/toolkit-icons/magic-ui.png" },
    instruction:
      "Use Magic UI as source material, then align its type, motion, color, and shape with the active design system.",
  },
  {
    id: "shadcn-blocks",
    name: "Shadcnblocks",
    category: "Components",
    kind: "resource",
    description: "Large library of shadcn/ui blocks and page sections.",
    url: "https://www.shadcnblocks.com/",
    icon: { type: "image", src: "/toolkit-icons/shadcn-blocks.png" },
    instruction:
      "Use Shadcnblocks for structure, not final art direction. Check licensing and replace default visual choices.",
  },
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    category: "Components",
    kind: "library",
    description: "Open component code that becomes part of the project.",
    url: "https://ui.shadcn.com/",
    icon: { type: "simple", name: "shadcn" },
    instruction: "Use shadcn/ui as owned source code. Never ship its default theme unchanged.",
  },
  {
    id: "radix-ui",
    name: "Radix UI",
    category: "Components",
    kind: "library",
    description: "Accessible unstyled primitives for React.",
    url: "https://www.radix-ui.com/primitives",
    packageName: "@radix-ui/react-primitive",
    icon: { type: "simple", name: "radix" },
    instruction:
      "Use Radix primitives for behavior and accessibility, then style them through the project's design tokens.",
  },
  {
    id: "base-ui",
    name: "Base UI",
    category: "Components",
    kind: "library",
    description: "Unstyled React components from the MUI team.",
    url: "https://base-ui.com/",
    packageName: "@base-ui/react",
    icon: { type: "simple", name: "mui" },
    instruction:
      "Use Base UI for robust behavior without importing a visual theme. Follow its current API.",
  },
  {
    id: "rare-ui",
    name: "Rare UI",
    category: "Components",
    kind: "resource",
    description: "Open animated React components for uncommon interactions.",
    url: "https://www.rareui.com/",
    icon: { type: "image", src: "/toolkit-icons/rare-ui.png" },
    instruction:
      "Use Rare UI only when an uncommon interaction serves the product. Keep motion interruptible and accessible.",
  },
  {
    id: "beui",
    name: "beUI",
    category: "Components",
    kind: "resource",
    description: "Open animated React and Next.js components.",
    url: "https://beui.dev/",
    icon: { type: "image", src: "/toolkit-icons/beui.png" },
    instruction:
      "Use beUI components as editable source. Remove effects that compete with content or hurt performance.",
  },
  {
    id: "beautiful-ui",
    name: "Beautiful UI",
    category: "Components",
    kind: "resource",
    description: "Crafted primitives for agents and human approval flows.",
    url: "https://www.beautifului.dev/",
    icon: { type: "image", src: "/toolkit-icons/beautiful-ui.png" },
    instruction:
      "Use Beautiful UI for real agent states, approvals, and human-in-the-loop flows. Match the host product language.",
  },
  {
    id: "reui",
    name: "ReUI",
    category: "Components",
    kind: "resource",
    description: "Broad collection of open shadcn/ui components and examples.",
    url: "https://reui.io/components",
    icon: { type: "image", src: "/toolkit-icons/reui.png" },
    instruction:
      "Use ReUI to avoid rebuilding complex controls. Import only the parts the product needs and restyle them coherently.",
  },
  {
    id: "coss-ui",
    name: "coss ui",
    category: "Components",
    kind: "resource",
    description: "Modern component library built on Base UI.",
    url: "https://coss.com/ui",
    icon: { type: "image", src: "/toolkit-icons/coss-ui.png" },
    instruction:
      "Use coss ui when Base UI matches the project. Keep one component foundation and avoid mixed primitive stacks.",
  },
  {
    id: "motion",
    name: "Motion",
    category: "Motion",
    kind: "library",
    description: "Production animation library for React and the web.",
    url: "https://motion.dev/",
    packageName: "motion",
    icon: { type: "simple", name: "framer" },
    instruction:
      "Use Motion for state and layout transitions. Animate transform and opacity, and honor reduced motion.",
  },
  {
    id: "gsap",
    name: "GSAP",
    category: "Motion",
    kind: "library",
    description: "Timeline and scroll choreography for complex sequences.",
    url: "https://gsap.com/",
    packageName: "gsap",
    icon: { type: "simple", name: "gsap" },
    instruction:
      "Use GSAP only for choreography that simpler CSS or Motion cannot express. Scope timelines and clean them up.",
  },
  {
    id: "transitions-dev",
    name: "Transitions.dev",
    category: "Motion",
    kind: "resource",
    description: "Focused UI transition patterns for coding agents.",
    url: "https://transitions.dev/",
    icon: { type: "image", src: "/toolkit-icons/transitions-dev.png" },
    instruction:
      "Use Transitions.dev to name and implement a needed state transition. Do not add motion without a communication goal.",
  },
  {
    id: "rive",
    name: "Rive",
    category: "Motion",
    kind: "library",
    description: "Interactive vector animation with state machines.",
    url: "https://rive.app/",
    packageName: "@rive-app/react-canvas",
    icon: { type: "simple", name: "rive" },
    instruction:
      "Use Rive for authored interactive animation assets. Provide a static fallback and lazy-load the runtime.",
  },
  {
    id: "lottie",
    name: "Lottie",
    category: "Motion",
    kind: "library",
    description: "Portable vector animations exported as JSON.",
    url: "https://lottiefiles.com/",
    icon: { type: "simple", name: "lottie" },
    instruction:
      "Use Lottie for supplied animation assets, not for ordinary UI transitions. Respect reduced motion.",
  },
  {
    id: "hugeicons",
    name: "Hugeicons",
    category: "Assets",
    kind: "resource",
    description: "Large icon system for Figma, React, Flutter, and more.",
    url: "https://hugeicons.com/",
    icon: { type: "image", src: "/toolkit-icons/hugeicons.png" },
    instruction:
      "Use official Hugeicons packages or exports. Keep one icon family and one stroke system per interface.",
  },
  {
    id: "simple-icons",
    name: "Simple Icons",
    category: "Assets",
    kind: "library",
    description: "Official-style SVG marks for popular brands and products.",
    url: "https://simpleicons.org/",
    packageName: "simple-icons",
    icon: { type: "simple", name: "simpleicons" },
    instruction:
      "Use Simple Icons for real third-party brand marks. Keep brand names in alt text and follow trademark guidance.",
  },
  {
    id: "unsplash",
    name: "Unsplash",
    category: "Assets",
    kind: "resource",
    description: "Real photography for product and editorial work.",
    url: "https://unsplash.com/",
    icon: { type: "simple", name: "unsplash" },
    instruction:
      "Use relevant real photography with stable local copies, clear alt text, and source attribution when required.",
  },
  {
    id: "pexels",
    name: "Pexels",
    category: "Assets",
    kind: "resource",
    description: "Free stock photography and video.",
    url: "https://www.pexels.com/",
    icon: { type: "simple", name: "pexels" },
    instruction:
      "Use relevant Pexels media rather than fake screenshot blocks. Freeze final assets into the project.",
  },
  {
    id: "figma",
    name: "Figma",
    category: "Assets",
    kind: "resource",
    description: "Design source, prototype, and handoff workspace.",
    url: "https://www.figma.com/",
    icon: { type: "simple", name: "figma" },
    instruction:
      "Treat supplied Figma files and exports as source evidence. Preserve real assets, tokens, and component intent.",
  },
  {
    id: "design-system-checklist",
    name: "Design System Checklist",
    category: "Quality",
    kind: "resource",
    description: "Open checklist for planning and reviewing a design system.",
    url: "https://www.designsystemchecklist.com/",
    icon: { type: "image", src: "/toolkit-icons/design-system-checklist.png" },
    instruction:
      "Use the Design System Checklist to audit tokens, components, states, accessibility, governance, and documentation.",
  },
  {
    id: "ui-skills",
    name: "UI Skills",
    category: "Quality",
    kind: "resource",
    description: "Design-engineering guidance for accessibility, motion, and craft.",
    url: "https://www.ui-skills.com/",
    icon: { type: "image", src: "/toolkit-icons/ui-skills.png" },
    instruction:
      "Use UI Skills rules that match the task. Prefer semantic, responsive, accessible implementation over visual tricks.",
  },
  {
    id: "storybook",
    name: "Storybook",
    category: "Quality",
    kind: "library",
    description: "Isolated component development and visual state coverage.",
    url: "https://storybook.js.org/",
    packageName: "storybook",
    icon: { type: "simple", name: "storybook" },
    instruction:
      "Use Storybook when the project already has it or component state coverage is a real need. Include edge states, not only the ideal state.",
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "Quality",
    kind: "library",
    description: "Browser automation for flows, screenshots, and visual checks.",
    url: "https://playwright.dev/",
    packageName: "@playwright/test",
    icon: { type: "skill" },
    instruction:
      "Use Playwright for high-value interaction and visual checks when the project supports it. Keep tests deterministic.",
  },
  {
    id: "lighthouse",
    name: "Lighthouse",
    category: "Quality",
    kind: "resource",
    description: "Performance, accessibility, and web-quality audits.",
    url: "https://developer.chrome.com/docs/lighthouse/",
    icon: { type: "simple", name: "lighthouse" },
    instruction:
      "Use Lighthouse for measured web quality. Fix evidence-backed performance and accessibility issues first.",
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "Motion",
    kind: "library",
    description: "WebGL framework for deliberate interactive 3D.",
    url: "https://threejs.org/",
    packageName: "three",
    icon: { type: "simple", name: "threejs" },
    instruction:
      "Use Three.js only when 3D is part of the product idea. Lazy-load it and provide a static fallback.",
  },
  {
    id: "leonxlnx-design-taste",
    name: "Leonxlnx Anti-Slop",
    category: "Agent skills",
    kind: "skill",
    description: "Brief-led frontend direction with a strict anti-AI-slop review.",
    skillName: "leonxlnx-design-taste-frontend",
    icon: { type: "skill" },
    instruction:
      "Use `leonxlnx-design-taste-frontend` for landing pages, portfolios, and redesigns. Run its pre-flight check before finishing.",
    keywords: ["taste", "anti slop", "landing page"],
  },
  {
    id: "leonxlnx-high-end",
    name: "Leonxlnx High-End Visual Design",
    category: "Agent skills",
    kind: "skill",
    description: "Premium typography, spacing, surfaces, and art direction.",
    skillName: "leonxlnx-high-end-visual-design",
    icon: { type: "skill" },
    instruction:
      "Use `leonxlnx-high-end-visual-design` when the brief calls for premium visual art direction.",
  },
  {
    id: "leonxlnx-image-to-code",
    name: "Leonxlnx Image to Code",
    category: "Agent skills",
    kind: "skill",
    description: "Generate or inspect references, then implement them faithfully.",
    skillName: "leonxlnx-image-to-code",
    icon: { type: "skill" },
    instruction:
      "Use `leonxlnx-image-to-code` for visually important image-led implementation work.",
  },
  {
    id: "leonxlnx-redesign",
    name: "Leonxlnx Redesign",
    category: "Agent skills",
    kind: "skill",
    description: "Audit and upgrade an existing product without breaking behavior.",
    skillName: "leonxlnx-redesign-existing-projects",
    icon: { type: "skill" },
    instruction:
      "Use `leonxlnx-redesign-existing-projects` before major visual changes to an existing interface.",
  },
  {
    id: "leonxlnx-brandkit",
    name: "Leonxlnx Brand Kit",
    category: "Agent skills",
    kind: "skill",
    description: "Create brand systems, identity boards, and visual worlds.",
    skillName: "leonxlnx-brandkit",
    icon: { type: "skill" },
    instruction: "Use `leonxlnx-brandkit` for brand-system and identity-board work.",
  },
  {
    id: "uish-design",
    name: "ui.sh Design",
    category: "Agent skills",
    kind: "skill",
    description: "Complete ui.sh system for new, responsive interface work.",
    skillName: "uish-design",
    icon: { type: "skill" },
    instruction:
      "Use `uish-design` for new UI and load only the guideline files relevant to the task.",
  },
  {
    id: "uish-ideas",
    name: "ui.sh Ideas",
    category: "Agent skills",
    kind: "skill",
    description: "Compare distinct UI options in a visual picker.",
    skillName: "uish-ideas",
    icon: { type: "skill" },
    instruction: "Use `uish-ideas` when several genuinely different directions should be compared.",
  },
  {
    id: "uish-componentize",
    name: "ui.sh Componentize",
    category: "Agent skills",
    kind: "skill",
    description: "Extract coherent reusable components from existing UI.",
    skillName: "uish-componentize",
    icon: { type: "skill" },
    instruction:
      "Use `uish-componentize` when repeated UI should become reusable components with clear APIs.",
  },
  {
    id: "uish-responsive",
    name: "ui.sh Responsive",
    category: "Agent skills",
    kind: "skill",
    description: "Adapt interfaces across mobile, tablet, and desktop.",
    skillName: "uish-make-responsive",
    icon: { type: "skill" },
    instruction:
      "Use `uish-make-responsive` for a focused responsive pass across supported breakpoints.",
  },
  {
    id: "uish-dark-mode",
    name: "ui.sh Dark Mode",
    category: "Agent skills",
    kind: "skill",
    description: "Design dark surfaces, colors, shadows, and image variants.",
    skillName: "uish-add-dark-mode",
    icon: { type: "skill" },
    instruction:
      "Use `uish-add-dark-mode` when adding or repairing dark mode. Create real dark image variants when needed.",
  },
  {
    id: "uish-tailwind",
    name: "ui.sh Tailwind Cleanup",
    category: "Agent skills",
    kind: "skill",
    description: "Normalize and resolve conflicting Tailwind utilities.",
    skillName: "uish-canonicalize-tailwind",
    icon: { type: "skill" },
    instruction:
      "Use `uish-canonicalize-tailwind` after Tailwind-heavy edits to remove conflicts and duplicates.",
  },
  {
    id: "uish-markup",
    name: "ui.sh Markup from Image",
    category: "Agent skills",
    kind: "skill",
    description: "Turn screenshots and mockups into semantic markup.",
    skillName: "uish-markup-from-image",
    icon: { type: "skill" },
    instruction:
      "Use `uish-markup-from-image` when a screenshot or Figma export is the structural source.",
  },
  {
    id: "emil-design",
    name: "Emil Kowalski Design Engineering",
    category: "Agent skills",
    kind: "skill",
    description: "Purposeful motion, interaction, and interface craft.",
    url: "https://emilkowal.ski/",
    skillName: "emil-design-eng",
    icon: { type: "image", src: "/toolkit-icons/emil-kowalski.png" },
    instruction:
      "Use `emil-design-eng` for explicit interaction and motion craft. Add motion only when it communicates.",
  },
  {
    id: "jakub-better-ui",
    name: "Jakub Better UI",
    category: "Agent skills",
    kind: "skill",
    description: "Interface polish across layout, type, color, copy, and access.",
    skillName: "jakub-better-ui",
    icon: { type: "skill" },
    instruction:
      "Use `jakub-better-ui` as the default product-interface polish pass, then route to focused specialists.",
  },
  {
    id: "imagegen",
    name: "Image Generation",
    category: "Agent skills",
    kind: "skill",
    description: "Create or edit real raster assets for the interface.",
    skillName: "imagegen",
    icon: { type: "skill" },
    instruction:
      "Use `imagegen` when the design needs original photography, illustrations, textures, or image variants.",
  },
] as const satisfies readonly DesignerToolkitItem[];

export type DesignerToolkitId = (typeof DESIGNER_TOOLKIT)[number]["id"];

const DESIGNER_TOOLKIT_ITEMS: readonly DesignerToolkitItem[] = DESIGNER_TOOLKIT;

export const DEFAULT_DESIGNER_TOOLKIT_IDS: readonly DesignerToolkitId[] = [
  "leonxlnx-design-taste",
  "uish-design",
  "ui-skills",
  "design-system-checklist",
  "simple-icons",
  "hugeicons",
  "unsplash",
  "pexels",
  "imagegen",
];

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

export function isDesignerToolkitId(value: unknown): value is DesignerToolkitId {
  return DESIGNER_TOOLKIT.some((item) => item.id === value);
}

export function readDesignerToolkitIds(
  storage: ReadableStorage | null = browserStorage(),
): DesignerToolkitId[] {
  if (!storage) return [];
  try {
    const storedValue = storage.getItem(DESIGNER_TOOLKIT_STORAGE_KEY);
    if (storedValue === null) return [...DEFAULT_DESIGNER_TOOLKIT_IDS];
    const value: unknown = JSON.parse(storedValue);
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(isDesignerToolkitId))];
  } catch {
    return [];
  }
}

export function writeDesignerToolkitIds(
  ids: readonly DesignerToolkitId[],
  storage: WritableStorage | null = browserStorage(),
): void {
  if (!storage) return;
  const uniqueIds = [...new Set(ids.filter(isDesignerToolkitId))];
  try {
    storage.setItem(DESIGNER_TOOLKIT_STORAGE_KEY, JSON.stringify(uniqueIds));
    if (typeof window !== "undefined" && storage === window.localStorage) {
      window.dispatchEvent(new Event(DESIGNER_TOOLKIT_EVENT));
    }
  } catch {
    // Design work remains available when browser storage is unavailable.
  }
}

function subscribeToDesignerToolkit(onChange: () => void): () => void {
  window.addEventListener(DESIGNER_TOOLKIT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DESIGNER_TOOLKIT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDesignerToolkitIds(): DesignerToolkitId[] {
  const value = useSyncExternalStore(
    subscribeToDesignerToolkit,
    () => JSON.stringify(readDesignerToolkitIds()),
    () => "[]",
  );
  return JSON.parse(value) as DesignerToolkitId[];
}

export function renderDesignerToolkitContext(ids: readonly DesignerToolkitId[]): string {
  return DESIGNER_TOOLKIT.filter((item) => ids.includes(item.id))
    .map((item) => `- ${item.name}: ${item.instruction}`)
    .join("\n");
}

export function searchDesignerToolkit(query: string): readonly DesignerToolkitItem[] {
  const terms = query.trim().toLowerCase().split(/\s+/u).filter(Boolean);
  if (terms.length === 0) return DESIGNER_TOOLKIT_ITEMS;
  return DESIGNER_TOOLKIT_ITEMS.filter((item) => {
    const haystack = [
      item.name,
      item.category,
      item.kind,
      item.description,
      item.packageName ?? "",
      item.skillName ?? "",
      ...(item.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
