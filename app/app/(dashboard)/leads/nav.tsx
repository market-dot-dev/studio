"use client";

import { LinkTabs } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeadsNav() {
  const segment = useSelectedLayoutSegment();
  // Initialize with a null state to avoid hydration mismatch
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Update active segment after component mounts to match client-side routing
  useEffect(() => {
    setActiveSegment(segment);
  }, [segment]);

  const navItems = [
    {
      name: "Search",
      href: `/leads`,
      isActive: activeSegment === null
    },
    {
      name: "Shortlisted",
      href: `/leads/shortlisted`,
      isActive: activeSegment === "shortlisted"
    }
  ];

  return <LinkTabs items={navItems} />;
}
