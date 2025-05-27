"use client";

import { duplicateTier } from "@/app/services/tier/tier-service";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function TierDuplicateMenuItem({ tierId }: { tierId: string }) {
  const router = useRouter();
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async () => {
    if (isDuplicating) return;
    setIsDuplicating(true);

    try {
      const newTier = await duplicateTier(tierId);
      if (newTier) {
        toast.success(`Package duplicated`);
        router.push(`/tiers/${newTier.id}`);
      } else {
        toast.error("Failed to duplicate package.");
      }
    } catch (error) {
      toast.error(`Failed to duplicate package: ${(error as Error).message}`);
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleDuplicate}
      disabled={isDuplicating}
      data-cy={`duplicate-tier-menu-item-${tierId}`}
    >
      <Copy />
      {isDuplicating ? "Duplicating..." : "Duplicate"}
    </DropdownMenuItem>
  );
}
