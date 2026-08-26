import { CheckIcon, ImageIcon, ShieldCheckIcon, WavesIcon, type LucideIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import { type DesignerToolkitId } from "../design/designerToolkit";
import { cn } from "../lib/utils";
import { DESIGN_ONBOARDING_PRIMARY_BUTTON_CLASS } from "./onboardingStyles";

const TOOLKIT_PRESETS: ReadonlyArray<{
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly itemIds: readonly DesignerToolkitId[];
}> = [
  {
    id: "quality",
    title: "Quality gate",
    description: "Anti-slop direction, ui.sh rules, UI Skills, and design-system review.",
    icon: ShieldCheckIcon,
    itemIds: ["leonxlnx-design-taste", "uish-design", "ui-skills", "design-system-checklist"],
  },
  {
    id: "assets",
    title: "Real assets",
    description: "Official brand marks, a full icon set, real imagery, and image generation.",
    icon: ImageIcon,
    itemIds: ["simple-icons", "hugeicons", "unsplash", "pexels", "imagegen"],
  },
  {
    id: "motion",
    title: "Motion craft",
    description: "Emil's design-engineering lens, Motion, and focused transition patterns.",
    icon: WavesIcon,
    itemIds: ["emil-design", "motion", "transitions-dev"],
  },
];

export function DesignerToolkitStep({
  selectedIds,
  onChange,
  onContinue,
}: {
  readonly selectedIds: DesignerToolkitId[];
  readonly onChange: (ids: DesignerToolkitId[]) => void;
  readonly onContinue: () => void;
}) {
  const togglePreset = (itemIds: readonly DesignerToolkitId[]) => {
    const active = itemIds.every((id) => selectedIds.includes(id));
    onChange(
      active
        ? selectedIds.filter((id) => !itemIds.includes(id))
        : [...new Set([...selectedIds, ...itemIds])],
    );
  };

  return (
    <div>
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Designer toolkit
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight">
        Start with tools that protect the work.
      </h1>
      <p className="mt-3 text-pretty text-sm/6 text-muted-foreground">
        Enable useful defaults. Search the full catalog above the composer at any time.
      </p>
      <div className="mt-5 grid gap-2" role="group" aria-label="Designer toolkit presets">
        {TOOLKIT_PRESETS.map((preset) => {
          const active = preset.itemIds.every((id) => selectedIds.includes(id));
          const PresetIcon = preset.icon;
          return (
            <label key={preset.id} className="cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={active}
                onChange={() => togglePreset(preset.itemIds)}
              />
              <span
                className={cn(
                  "grid min-h-18 grid-cols-[20px_minmax(0,1fr)_20px] items-center gap-3 rounded-xl bg-card/45 px-3 py-2 shadow-[0_0_0_1px_var(--contrast-border)] hover:bg-accent/45 active:scale-[0.99] peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                  active && "bg-card shadow-[0_0_0_1.5px_var(--contrast-foreground)]",
                )}
              >
                <PresetIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0">
                  <strong className="text-sm font-semibold">{preset.title}</strong>
                  <span className="mt-1 block text-sm/5 text-muted-foreground">
                    {preset.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-md border border-border text-transparent",
                    active && "border-foreground bg-foreground text-background",
                  )}
                  aria-hidden="true"
                >
                  <CheckIcon className="size-3.5" />
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <Button className={cn("mt-5", DESIGN_ONBOARDING_PRIMARY_BUTTON_CLASS)} onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
