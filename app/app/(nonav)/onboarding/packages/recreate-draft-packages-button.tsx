"use client";

import { deleteTiers } from "@/app/services/tier/tier-service";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useDraftPackages } from "@/hooks/use-draft-packages";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface RecreatePackagesButtonProps extends Omit<ButtonProps, "children" & "onClick"> {
  organizationId: string;
  existingPackageIds?: string[];
}

export function RecreateDraftPackagesButton({
  organizationId,
  className,
  existingPackageIds,
  ...props
}: RecreatePackagesButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const { clearDraftPackages } = useDraftPackages(organizationId);

  const handleClick = async () => {
    setIsLoading(true);
    if (existingPackageIds && existingPackageIds.length > 0) {
      try {
        await deleteTiers(existingPackageIds);
      } catch (error) {
        console.error("Failed to delete packages", error);
      }
    }

    clearDraftPackages();
    router.push("/onboarding/business-description");
  };

  return (
    <Button
      variant="ghost"
      className={cn("w-full", className)}
      onClick={handleClick}
      loading={isLoading}
      {...props}
    >
      <RotateCcw />
      Generate new packages
    </Button>
  );
}
