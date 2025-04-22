import { duplicateTier } from "@/app/services/tier-service";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface DuplicateTierButtonProps {
  tierId: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

/**
 * Button component that duplicates a tier and redirects to the new tier's edit page
 */
const DuplicateTierButton: React.FC<DuplicateTierButtonProps> = ({
  tierId,
  variant = "outline",
  className
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const newTier = await duplicateTier(tierId);
      if (newTier) {
        toast.success("Package duplicated successfully");
        router.push(`/tiers/${newTier.id}`);
      } else {
        toast.error("Failed to duplicate package");
      }
    } catch (error) {
      toast.error(`Error duplicating package: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={variant} onClick={handleDuplicate} loading={isLoading} className={className}>
      <Copy className="mr-2 size-4" />
      Duplicate
    </Button>
  );
};

export default DuplicateTierButton;
