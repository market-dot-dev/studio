"use client";

import { LinkTabs } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeadsNav() {
  const pathname = usePathname();
  // Initialize with empty path to avoid hydration mismatch
  const [activePath, setActivePath] = useState<string>("");
  
  // Update active path after component mounts to match client-side routing
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);
  
  const navItems = [
    {
      name: "All Leads",
      href: "/leads",
      isActive: activePath === "/leads",
    },
    {
      name: "Shortlist",
      href: "/leads/shortlisted",
      isActive: activePath === "/leads/shortlisted",
    },
  ];

  return (
    <LinkTabs items={navItems} className="mb-6" />
  );
} 