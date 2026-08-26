import {
  ArrowRightIcon,
  BotIcon,
  CheckIcon,
  ChevronLeftIcon,
  Code2Icon,
  FolderOpenIcon,
  FrameIcon,
  SparklesIcon,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { openCommandPalette } from "../commandPaletteBus";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useProjects } from "../state/entities";
import {
  completeDesignOnboarding,
  hasCompletedDesignOnboarding,
  readDesignAgentPreference,
  writeDesignAgentPreference,
  type DesignAgentPreference,
} from "./designOnboarding";

const LAST_STEP = 3;

const AGENT_OPTIONS: ReadonlyArray<{
  readonly id: DesignAgentPreference;
  readonly title: string;
  readonly body: string;
  readonly icon: typeof Code2Icon;
}> = [
  {
    id: "codex",
    title: "Codex",
    body: "Use your local Codex CLI, models, skills, and project rules.",
    icon: Code2Icon,
  },
  {
    id: "claudeAgent",
    title: "Claude",
    body: "Use Claude Code with the same canvas and review loop.",
    icon: BotIcon,
  },
];

export function DesignOnboardingGate({ children }: { readonly children: ReactNode }) {
  const projects = useProjects();
  const [visible, setVisible] = useState(() => !hasCompletedDesignOnboarding());
  const [openProjectPicker, setOpenProjectPicker] = useState(false);
  const [step, setStep] = useState(0);
  const [agent, setAgent] = useState<DesignAgentPreference>(
    () => readDesignAgentPreference() ?? "codex",
  );

  const finish = useCallback((shouldOpenProjectPicker: boolean) => {
    completeDesignOnboarding();
    setOpenProjectPicker(shouldOpenProjectPicker);
    setVisible(false);
  }, []);

  useEffect(() => {
    if (visible || !openProjectPicker) return;
    const timer = window.setTimeout(() => {
      openCommandPalette({ open: "add-project" });
      setOpenProjectPicker(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [openProjectPicker, visible]);

  if (!visible) return children;

  const hasProjects = projects.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] grid min-h-dvh grid-cols-1 overflow-hidden bg-background text-foreground lg:grid-cols-2"
      data-design-onboarding=""
      role="dialog"
      aria-modal="true"
      aria-label="Set up Design Harness"
    >
      <div className="drag-region pointer-events-none absolute inset-x-0 top-0 z-10 h-12" />
      <section className="relative flex min-h-0 flex-col px-6 pb-6 pt-14 sm:px-12 sm:pb-10 sm:pt-16 lg:px-16 lg:pb-12 lg:pt-20">
        <header className="no-drag flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-[10px] bg-foreground text-background shadow-sm">
              <FrameIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-[-0.02em]">Design Harness</span>
          </div>
          <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of 4`}>
            {Array.from({ length: LAST_STEP + 1 }, (_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none",
                  index === step ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/24",
                )}
              />
            ))}
          </div>
        </header>

        <div className="no-drag mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          {step > 0 ? (
            <button
              type="button"
              className="mb-8 inline-flex min-h-10 w-fit items-center gap-1 rounded-lg px-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
              Back
            </button>
          ) : null}

          {step === 0 ? (
            <OnboardingIntro onContinue={() => setStep(1)} />
          ) : step === 1 ? (
            <AgentStep
              selected={agent}
              onSelect={(next) => {
                setAgent(next);
                writeDesignAgentPreference(next);
              }}
              onContinue={() => {
                writeDesignAgentPreference(agent);
                setStep(2);
              }}
            />
          ) : step === 2 ? (
            <DesignContextStep onContinue={() => setStep(3)} />
          ) : (
            <ProjectStep
              hasProjects={hasProjects}
              onOpenWorkspace={() => finish(false)}
              onChooseFolder={() => finish(true)}
            />
          )}
        </div>

        <footer className="no-drag flex items-center justify-between gap-4 text-xs text-muted-foreground/70">
          <span>Local-first · Your repository stays the source of truth</span>
          <button
            type="button"
            className="min-h-10 shrink-0 rounded-lg px-2 font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => finish(false)}
          >
            Skip for now
          </button>
        </footer>
      </section>

      <aside className="relative hidden min-h-0 p-2 pl-0 lg:block" aria-hidden="true">
        <div className="relative h-full overflow-hidden rounded-xl outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
          <img
            src="/onboarding/design-harness-art.webp"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 via-black/20 to-transparent px-10 pb-10 pt-28 text-white">
            <div className="mb-4 flex items-center gap-2 text-white/75">
              <SparklesIcon className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Live design loop
              </span>
            </div>
            <p className="max-w-md text-[clamp(1.65rem,2.8vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-balance">
              Point at the design. Let the agent fix the code.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function OnboardingIntro({ onContinue }: { readonly onContinue: () => void }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Welcome to Design Harness
      </p>
      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-balance">
        Design with your coding agent.
      </h1>
      <p className="mt-6 max-w-[42ch] text-base leading-7 text-muted-foreground">
        Turn a real project into a live canvas. Preview, point, annotate, revise, compare, and
        restore without leaving the code.
      </p>
      <Button className="mt-9 h-12 w-full rounded-xl text-base" onClick={onContinue}>
        Get started
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}

function AgentStep({
  selected,
  onSelect,
  onContinue,
}: {
  readonly selected: DesignAgentPreference;
  readonly onSelect: (agent: DesignAgentPreference) => void;
  readonly onContinue: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Agent
      </p>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">Choose your design agent.</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Design Harness uses the CLI and account already available on this Mac.
      </p>
      <div className="mt-7 grid gap-2.5" role="radiogroup" aria-label="Design agent">
        {AGENT_OPTIONS.map((option) => {
          const OptionIcon = option.icon;
          const active = selected === option.id;
          return (
            <label key={option.id} className="block cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="design-agent"
                value={option.id}
                checked={active}
                onChange={() => onSelect(option.id)}
              />
              <span
                className={cn(
                  "grid min-h-[82px] grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-3 rounded-2xl bg-card/45 p-3.5 shadow-[0_0_0_1px_var(--contrast-border)] transition-[background-color,box-shadow,transform] duration-150 hover:bg-accent/45 active:scale-[0.99] peer-focus-visible:ring-2 peer-focus-visible:ring-ring motion-reduce:transition-none",
                  active &&
                    "bg-card shadow-[0_0_0_1.5px_var(--contrast-foreground),0_8px_24px_rgb(0_0_0/0.06)]",
                )}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-background text-muted-foreground shadow-[0_0_0_1px_var(--contrast-border)]">
                  <OptionIcon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <strong className="block text-sm font-semibold">{option.title}</strong>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {option.body}
                  </span>
                </span>
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full border border-border text-transparent",
                    active && "border-foreground bg-foreground text-background",
                  )}
                >
                  <CheckIcon className="size-3" aria-hidden="true" />
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <Button className="mt-7 h-12 w-full rounded-xl text-base" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}

function DesignContextStep({ onContinue }: { readonly onContinue: () => void }) {
  const contextFiles = [
    ["AGENTS.md", "Project rules and commands"],
    ["BRIEF.md", "The current product goal"],
    ["DESIGN.md", "Visual language and craft rules"],
  ] as const;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Design context
      </p>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">Your project stays in control.</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        The agent reads design context from the repository. The same rules work for people, Codex,
        and Claude.
      </p>
      <div className="mt-7 overflow-hidden rounded-2xl bg-card/45 shadow-[0_0_0_1px_var(--contrast-border)]">
        {contextFiles.map(([name, description], index) => (
          <div
            key={name}
            className={cn(
              "grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 px-4 py-3.5",
              index > 0 && "border-t border-border/70",
            )}
          >
            <span className="grid size-8 place-items-center rounded-lg bg-background text-muted-foreground shadow-[0_0_0_1px_var(--contrast-border)]">
              <CheckIcon className="size-4" aria-hidden="true" />
            </span>
            <span>
              <strong className="block font-mono text-xs font-semibold text-foreground">
                {name}
              </strong>
              <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Missing files are optional. You can add them when the project needs stronger direction.
      </p>
      <Button className="mt-7 h-12 w-full rounded-xl text-base" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}

function ProjectStep({
  hasProjects,
  onOpenWorkspace,
  onChooseFolder,
}: {
  readonly hasProjects: boolean;
  readonly onOpenWorkspace: () => void;
  readonly onChooseFolder: () => void;
}) {
  return (
    <div>
      <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-foreground text-background shadow-sm">
        <FolderOpenIcon className="size-5" aria-hidden="true" />
      </span>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Project
      </p>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        {hasProjects ? "Your canvas is ready." : "Choose your first project."}
      </h1>
      <p className="mt-3 max-w-[42ch] text-sm leading-6 text-muted-foreground">
        {hasProjects
          ? "Open the current workspace, or add another repository as a new design canvas."
          : "Select the repository that contains the interface you want to create or improve."}
      </p>
      {hasProjects ? (
        <div className="mt-8 grid gap-2.5">
          <Button className="h-12 w-full rounded-xl text-base" onClick={onOpenWorkspace}>
            Open workspace
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button
            className="h-12 w-full rounded-xl text-base"
            variant="outline"
            onClick={onChooseFolder}
          >
            <FolderOpenIcon className="size-4" />
            Choose another folder
          </Button>
        </div>
      ) : (
        <Button className="mt-8 h-12 w-full rounded-xl text-base" onClick={onChooseFolder}>
          <FolderOpenIcon className="size-4" />
          Choose project folder
        </Button>
      )}
    </div>
  );
}
