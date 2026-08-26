import type { EnvironmentId, ScopedThreadRef } from "@t3tools/contracts";
import {
  BrushIcon,
  MessageSquareTextIcon,
  MousePointer2Icon,
  ScanSearchIcon,
  SparklesIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react";
import type { RefObject } from "react";

import { type DraftId, useComposerDraftStore } from "~/composerDraftStore";
import type { ChatComposerHandle } from "~/components/chat/ChatComposer";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { DesignContextControls } from "./DesignContextControls";
import {
  applyDesignWorkflow,
  DESIGN_WORKFLOWS,
  selectedDesignWorkflowId,
  type DesignWorkflowId,
} from "./workflows";

const WORKFLOW_ICONS: Record<DesignWorkflowId, LucideIcon> = {
  create: SparklesIcon,
  restyle: BrushIcon,
  replicate: ScanSearchIcon,
  critique: MessageSquareTextIcon,
  polish: WandSparklesIcon,
  "fix-selection": MousePointer2Icon,
};

interface DesignWorkflowPickerProps {
  target: ScopedThreadRef | DraftId;
  environmentId: EnvironmentId;
  cwd: string | null;
  promptRef: RefObject<string>;
  composerRef: RefObject<ChatComposerHandle | null>;
  className?: string;
}

export function DesignWorkflowPicker({
  target,
  environmentId,
  cwd,
  promptRef,
  composerRef,
  className,
}: DesignWorkflowPickerProps) {
  const prompt = useComposerDraftStore((store) => store.getComposerDraft(target)?.prompt ?? "");
  const setPrompt = useComposerDraftStore((store) => store.setPrompt);
  const selectedId = selectedDesignWorkflowId(prompt);

  const commitPrompt = (nextPrompt: string) => {
    promptRef.current = nextPrompt;
    setPrompt(target, nextPrompt);
    window.requestAnimationFrame(() => {
      composerRef.current?.resetCursorState({
        cursor: nextPrompt.length,
        prompt: nextPrompt,
      });
      composerRef.current?.focusAtEnd();
    });
  };

  return (
    <section
      aria-label="Design workflow and context"
      className={cn("mx-auto flex w-full max-w-3xl flex-col gap-1 px-1 py-1", className)}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          Workflow
        </span>
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            {DESIGN_WORKFLOWS.map((workflow) => {
              const Icon = WORKFLOW_ICONS[workflow.id];
              const selected = selectedId === workflow.id;

              return (
                <Button
                  key={workflow.id}
                  size="sm"
                  variant={selected ? "secondary" : "ghost-muted"}
                  className="h-8 rounded-full px-3 transition-[background-color,color,box-shadow] active:scale-[0.98]"
                  aria-pressed={selected}
                  title={workflow.description}
                  onClick={() => commitPrompt(applyDesignWorkflow(promptRef.current, workflow))}
                >
                  <Icon className="size-3.5" />
                  {workflow.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          Context
        </span>
        <DesignContextControls environmentId={environmentId} cwd={cwd} />
      </div>
    </section>
  );
}
