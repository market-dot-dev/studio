"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { LinkTabs } from "@/components/ui/tabs";
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
      name: "General",
      href: `/settings`,
      isActive: activeSegment === null,
    },
    {
      name: "Business Info",
      href: `/settings/project`,
      isActive: activeSegment === "project",
    },
    {
      name: "Storefront Settings",
      href: `/settings/site`,
      isActive: activeSegment === "site",
    },
    {
      name: "Payout Info",
      href: `/settings/payment`,
      isActive: activeSegment === "payment",
    },
    {
      name: "Connected Repositories",
      href: `/settings/repos`,
      isActive: activeSegment === "repos",
    }
  ];

  return (
    <LinkTabs items={navItems} />
  );
}
