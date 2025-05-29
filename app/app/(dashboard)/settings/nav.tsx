"use client";

import { LinkTabs } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsNav() {
  const segment = useSelectedLayoutSegment();
  // Initialize with a null state to avoid hydration mismatch
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Update active segment after component mounts to match client-side routing
  useEffect(() => {
    setActiveSegment(segment);
  }, [segment]);

  const navItems = [
    {
      name: "Profile",
      href: `/settings`,
      isActive: activeSegment === null
    },
    {
      name: "Organization Info",
      href: `/settings/business`,
      isActive: activeSegment === "business"
    },
    {
      name: "Payout Info",
      href: `/settings/payment`,
      isActive: activeSegment === "payment"
    }
  ];

  return <LinkTabs items={navItems} />;
}
