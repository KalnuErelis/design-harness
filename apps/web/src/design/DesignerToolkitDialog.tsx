import { CheckIcon, ExternalLinkIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import {
  DEFAULT_DESIGNER_TOOLKIT_IDS,
  DESIGNER_TOOLKIT_CATEGORIES,
  isDesignerToolkitId,
  searchDesignerToolkit,
  useDesignerToolkitIds,
  writeDesignerToolkitIds,
} from "./designerToolkit";
import { DesignerToolkitIcon } from "./DesignerToolkitIcon";

export function DesignerToolkitDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const selectedIds = useDesignerToolkitIds();
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => searchDesignerToolkit(query), [query]);
  const selectedIdSet = useMemo(() => new Set<string>(selectedIds), [selectedIds]);

  const setSelected = (id: string, selected: boolean) => {
    if (!isDesignerToolkitId(id)) return;
    const nextIds = selected
      ? [...new Set([...selectedIds, id])]
      : selectedIds.filter((selectedId) => selectedId !== id);
    writeDesignerToolkitIds(nextIds);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-3xl" bottomStickOnMobile>
        <DialogHeader className="gap-4 pb-4">
          <div className="pr-10">
            <DialogTitle>Designer toolkit</DialogTitle>
            <DialogDescription className="mt-1 text-pretty">
              Choose the libraries, references, and agent skills that can guide this project. The
              agent still checks the existing stack before it adds a dependency.
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search React, StyleX, motion, icons, skills…"
                aria-label="Search the designer toolkit"
                className="pl-9"
              />
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => writeDesignerToolkitIds(DEFAULT_DESIGNER_TOOLKIT_IDS)}
              >
                Essentials
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost-muted"
                onClick={() => writeDesignerToolkitIds([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </DialogHeader>
        <DialogPanel className="pt-0">
          {visibleItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium">No toolkit items match this search.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a package, skill, or use case.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {DESIGNER_TOOLKIT_CATEGORIES.map((category) => {
                const categoryItems = visibleItems.filter((item) => item.category === category);
                if (categoryItems.length === 0) return null;
                const categoryId = `designer-toolkit-${category.toLowerCase().replaceAll(" ", "-")}`;
                return (
                  <section key={category} aria-labelledby={categoryId}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3 id={categoryId} className="text-sm font-semibold text-foreground">
                        {category}
                      </h3>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {categoryItems.filter((item) => selectedIdSet.has(item.id)).length} selected
                      </span>
                    </div>
                    <div className="divide-y divide-border/55 border-y border-border/55">
                      {categoryItems.map((item) => {
                        const selected = selectedIdSet.has(item.id);
                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "flex min-w-0 items-start gap-2 py-3",
                              selected && "bg-foreground/[0.025]",
                            )}
                          >
                            <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 px-2">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={selected}
                                onChange={(event) =>
                                  setSelected(item.id, event.currentTarget.checked)
                                }
                              />
                              <DesignerToolkitIcon
                                item={item}
                                className="mt-0.5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ring"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="flex min-w-0 items-baseline gap-2">
                                  <strong className="truncate text-sm font-medium">
                                    {item.name}
                                  </strong>
                                  <span className="shrink-0 text-xs text-muted-foreground">
                                    {item.kind === "skill"
                                      ? item.skillName
                                      : (item.packageName ?? item.kind)}
                                  </span>
                                </span>
                                <span className="mt-0.5 block text-sm/5 text-muted-foreground">
                                  {item.description}
                                </span>
                              </span>
                              <span
                                className={cn(
                                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-border text-transparent",
                                  selected && "border-foreground bg-foreground text-background",
                                )}
                                aria-hidden="true"
                              >
                                <CheckIcon className="size-3.5" />
                              </span>
                            </label>
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mr-1 grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label={`Open ${item.name} website`}
                              >
                                <ExternalLinkIcon className="size-4" />
                              </a>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}
