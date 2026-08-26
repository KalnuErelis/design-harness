import { LibraryIcon } from "lucide-react";
import { useState, type ComponentType } from "react";

import { Button } from "~/components/ui/button";

import { useDesignerToolkitIds } from "./designerToolkit";

type ToolkitDialogComponent = ComponentType<{
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}>;

export function DesignerToolkitControl() {
  const selectedIds = useDesignerToolkitIds();
  const [open, setOpen] = useState(false);
  const [DialogComponent, setDialogComponent] = useState<ToolkitDialogComponent | null>(null);

  const openToolkit = async () => {
    const component =
      DialogComponent ??
      (await import("./DesignerToolkitDialog").then((module) => module.DesignerToolkitDialog));
    setDialogComponent(() => component);
    setOpen(true);
  };

  return (
    <>
      <Button
        size="sm"
        variant={selectedIds.length > 0 ? "secondary" : "ghost-muted"}
        className="h-8 rounded-full px-3 active:scale-[0.98]"
        aria-label="Open the designer toolkit"
        onClick={() => void openToolkit()}
      >
        <LibraryIcon className="size-4" />
        Toolkit{selectedIds.length > 0 ? ` · ${selectedIds.length}` : ""}
      </Button>
      {DialogComponent ? <DialogComponent open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
