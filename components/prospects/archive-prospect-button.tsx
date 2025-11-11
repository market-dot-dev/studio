"use client";

import { archiveProspectAction } from "@/app/app/(dashboard)/prospects/actions";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ArchiveProspectButtonProps = {
  prospectId: string;
  className?: string;
  redirectTo?: string;
  label?: string;
  onArchived?: () => void;
} & Pick<ButtonProps, "size" | "variant" | "tooltip" | "tooltipAlign" | "tooltipSide">;

export function ArchiveProspectButton({
  prospectId,
  className,
  redirectTo,
  label = "Archive",
  onArchived,
  size = "sm",
  variant = "ghost",
  tooltip,
  tooltipAlign,
  tooltipSide
}: ArchiveProspectButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("text-stone-500 hover:text-stone-800", className)}
      loading={isPending}
      loadingText="Archiving"
      tooltip={tooltip}
      tooltipAlign={tooltipAlign}
      tooltipSide={tooltipSide}
      onClick={() =>
        startTransition(async () => {
          try {
            await archiveProspectAction({ prospectId });
            router.refresh();
            if (redirectTo) {
              router.push(redirectTo);
            }
            onArchived?.();
          } catch (error) {
            console.error("Failed to archive prospect", error);
          }
        })
      }
    >
      <Archive className="size-3.5" />
      {label}
    </Button>
  );
}

