import type { EnvironmentId } from "@t3tools/contracts";
import { FileUpIcon, PaletteIcon, UsersRoundIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "~/components/ui/menu";
import { toastManager } from "~/components/ui/toast";
import { projectEnvironment } from "~/state/projects";
import { useAtomCommand } from "~/state/use-atom-command";

import {
  BUNDLED_DESIGN_SYSTEMS,
  createImportedDesignSystem,
  loadBundledDesignSystem,
  useActiveDesignSystem,
  writeActiveDesignSystem,
} from "./designSystems";
import { DesignerToolkitControl } from "./DesignerToolkitControl";
import {
  DESIGN_INFLUENCES,
  useDesignInfluenceIds,
  writeDesignInfluenceIds,
  type DesignInfluenceId,
} from "./influences";

export function DesignContextControls({
  environmentId,
  cwd,
}: {
  readonly environmentId: EnvironmentId;
  readonly cwd: string | null;
}) {
  const influenceIds = useDesignInfluenceIds();
  const activeDesignSystem = useActiveDesignSystem();
  const writeFile = useAtomCommand(projectEnvironment.writeFile);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const activeDesignSystemBody = activeDesignSystem?.body ?? null;
  const activeDesignSystemPath = activeDesignSystem?.relativePath ?? null;

  useEffect(() => {
    if (!activeDesignSystemBody || !activeDesignSystemPath || !cwd) return;
    let cancelled = false;
    void writeFile({
      environmentId,
      input: {
        cwd,
        relativePath: activeDesignSystemPath,
        contents: `${activeDesignSystemBody.trim()}\n`,
      },
    }).catch((error: unknown) => {
      if (cancelled) return;
      toastManager.add({
        type: "error",
        title: "Could not add the design system",
        description: error instanceof Error ? error.message : "The DESIGN.md write failed.",
      });
    });
    return () => {
      cancelled = true;
    };
  }, [activeDesignSystemBody, activeDesignSystemPath, cwd, environmentId, writeFile]);

  const setInfluence = (id: DesignInfluenceId, selected: boolean) => {
    const nextIds = selected
      ? [...new Set([...influenceIds, id])]
      : influenceIds.filter((influenceId) => influenceId !== id);
    writeDesignInfluenceIds(nextIds);
  };

  const selectBundledDesignSystem = async (id: string) => {
    const system = await loadBundledDesignSystem(id);
    if (system) writeActiveDesignSystem(system);
  };

  const importDesignSystem = async (file: File) => {
    const body = await file.text();
    if (!body.trim()) {
      toastManager.add({ type: "error", title: "This DESIGN.md is empty" });
      return;
    }
    if (body.length > 250_000) {
      toastManager.add({
        type: "error",
        title: "This DESIGN.md is too large",
        description: "Keep imported design-system context below 250 KB.",
      });
      return;
    }
    const heading = /^#\s+(.+)$/mu.exec(body)?.[1]?.trim();
    const filenameTitle = file.name.replace(/\.md$/iu, "").replace(/[-_]+/g, " ");
    writeActiveDesignSystem(createImportedDesignSystem(heading || filenameTitle, body));
  };

  return (
    <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Menu>
        <MenuTrigger
          render={
            <Button
              size="sm"
              variant={activeDesignSystem ? "secondary" : "ghost-muted"}
              className="h-8 max-w-52 rounded-full px-3 transition-[background-color,color,box-shadow] active:scale-[0.98]"
              aria-label="Choose an active design system"
            />
          }
        >
          <PaletteIcon className="size-3.5" />
          <span className="truncate">
            {activeDesignSystem ? `System · ${activeDesignSystem.title}` : "Design system"}
          </span>
        </MenuTrigger>
        <MenuPopup align="end" side="top" sideOffset={8} className="w-80">
          <MenuGroup>
            <MenuGroupLabel>Active design system</MenuGroupLabel>
            <MenuRadioGroup
              value={activeDesignSystem?.id ?? "none"}
              onValueChange={(value) => {
                if (value === "none") writeActiveDesignSystem(null);
                else if (!value.startsWith("custom:")) void selectBundledDesignSystem(value);
              }}
            >
              <MenuRadioItem value="none">
                <span className="text-sm">No design system</span>
              </MenuRadioItem>
              {activeDesignSystem?.source === "imported" ? (
                <MenuRadioItem value={activeDesignSystem.id}>
                  <DesignSystemOption
                    title={activeDesignSystem.title}
                    category="Imported DESIGN.md"
                    description={activeDesignSystem.description}
                  />
                </MenuRadioItem>
              ) : null}
              {BUNDLED_DESIGN_SYSTEMS.map((system) => (
                <MenuRadioItem key={system.id} value={system.id}>
                  <DesignSystemOption
                    title={system.title}
                    category={system.category}
                    description={system.description}
                  />
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem onClick={() => importInputRef.current?.click()}>
            <FileUpIcon />
            Import DESIGN.md…
          </MenuItem>
        </MenuPopup>
      </Menu>

      <DesignerToolkitControl />

      <Menu>
        <MenuTrigger
          render={
            <Button
              size="sm"
              variant={influenceIds.length > 0 ? "secondary" : "ghost-muted"}
              className="h-8 rounded-full px-3 transition-[background-color,color,box-shadow] active:scale-[0.98]"
              aria-label="Choose design influences"
            />
          }
        >
          <UsersRoundIcon className="size-3.5" />
          Influences{influenceIds.length > 0 ? ` · ${influenceIds.length}` : ""}
        </MenuTrigger>
        <MenuPopup align="end" side="top" sideOffset={8} className="w-80">
          <MenuGroup>
            <MenuGroupLabel>Design influences</MenuGroupLabel>
            {DESIGN_INFLUENCES.map((influence) => (
              <MenuCheckboxItem
                key={influence.id}
                checked={influenceIds.includes(influence.id)}
                onCheckedChange={(checked) => setInfluence(influence.id, checked)}
                className="items-start py-2"
              >
                <span className="block min-w-0">
                  <span className="flex items-baseline justify-between gap-3">
                    <strong className="text-sm font-medium">{influence.name}</strong>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {influence.source}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
                    {influence.description}
                  </span>
                </span>
              </MenuCheckboxItem>
            ))}
          </MenuGroup>
          {influenceIds.length > 0 ? (
            <>
              <MenuSeparator />
              <MenuItem onClick={() => writeDesignInfluenceIds([])}>Clear influences</MenuItem>
            </>
          ) : null}
        </MenuPopup>
      </Menu>

      <input
        ref={importInputRef}
        type="file"
        accept=".md,text/markdown,text/plain"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) void importDesignSystem(file);
        }}
      />
    </div>
  );
}

function DesignSystemOption({
  title,
  category,
  description,
}: {
  readonly title: string;
  readonly category: string;
  readonly description: string;
}) {
  return (
    <span className="block min-w-0 py-1">
      <span className="flex items-baseline justify-between gap-3">
        <strong className="text-sm font-medium">{title}</strong>
        <span className="shrink-0 text-[10px] text-muted-foreground">{category}</span>
      </span>
      <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">{description}</span>
    </span>
  );
}
