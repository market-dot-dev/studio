"use client";

import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";
import { QualificationStatus } from "@/app/models/Prospect";

interface QualificationBadgeProps {
  status: QualificationStatus;
  size?: "default" | "sm";
  className?: string;
}

export function QualificationBadge({
  status,
  size = "sm",
  className = "",
}: QualificationBadgeProps) {
  if (status === "qualified") {
    return (
      <Badge variant="success" size={size} className={className}>
        Qualified
      </Badge>
    );
  }

  if (status === "disqualified") {
    return (
      <Badge variant="secondary" size={size} className={className}>
        Disqualified
      </Badge>
    );
  }

  // unqualified is treated as "qualifying" in the UI
  return (
    <Badge variant="secondary" size={size} className={`gap-1 ${className}`}>
      <Spinner className="h-2.5 w-2.5" strokeWidth={2.5} />
      Qualifying
    </Badge>
  );
} 