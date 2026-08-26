import { cn } from "~/lib/utils";

export function DesignHarnessMark({ className }: { readonly className?: string }) {
  return (
    <img
      src="/design-harness-mark.svg"
      alt=""
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
