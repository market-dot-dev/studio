import { cn } from "@/lib/utils";

export function StepNumber({
  number,
  disabled = false,
  className
}: {
  number: number;
  disabled?: boolean;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded bg-stone-300/60 text-sm font-bold text-stone-700",
        disabled && "opacity-50",
        className
      )}
    >
      {number}
    </div>
  );
}
