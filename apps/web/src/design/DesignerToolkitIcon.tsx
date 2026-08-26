import { SparklesIcon } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siAstro,
  siCssmodules,
  siFigma,
  siFramer,
  siGreensock,
  siLighthouse,
  siLottiefiles,
  siMui,
  siNextdotjs,
  siNuxt,
  siPexels,
  siRadixui,
  siReact,
  siRive,
  siShadcnui,
  siSimpleicons,
  siStorybook,
  siSvelte,
  siTailwindcss,
  siThreedotjs,
  siUnsplash,
  siVanillaextract,
} from "simple-icons";

import { cn } from "~/lib/utils";

import type { DesignerToolkitItem } from "./designerToolkit";

const SIMPLE_ICONS: Readonly<Record<string, SimpleIcon>> = {
  astro: siAstro,
  cssmodules: siCssmodules,
  figma: siFigma,
  framer: siFramer,
  gsap: siGreensock,
  lighthouse: siLighthouse,
  lottie: siLottiefiles,
  mui: siMui,
  nextjs: siNextdotjs,
  nuxt: siNuxt,
  pexels: siPexels,
  radix: siRadixui,
  react: siReact,
  rive: siRive,
  shadcn: siShadcnui,
  simpleicons: siSimpleicons,
  storybook: siStorybook,
  svelte: siSvelte,
  tailwind: siTailwindcss,
  threejs: siThreedotjs,
  unsplash: siUnsplash,
  vanillaextract: siVanillaextract,
};

export function DesignerToolkitIcon({
  item,
  className,
}: {
  readonly item: DesignerToolkitItem;
  readonly className?: string;
}) {
  if (item.icon.type === "image") {
    return (
      <img src={item.icon.src} alt="" className={cn("size-5 shrink-0 object-contain", className)} />
    );
  }

  if (item.icon.type === "simple") {
    const icon = SIMPLE_ICONS[item.icon.name];
    if (icon) {
      return (
        <svg
          aria-hidden="true"
          className={cn("size-5 shrink-0 fill-current", className)}
          role="img"
          viewBox="0 0 24 24"
        >
          <path d={icon.path} />
        </svg>
      );
    }
  }

  return <SparklesIcon aria-hidden="true" className={cn("size-5 shrink-0", className)} />;
}
