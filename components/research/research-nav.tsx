"use client";

import { LinkTabs } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResearchNav() {
  const pathname = usePathname();
  // Initialize with empty path to avoid hydration mismatch
  const [activePath, setActivePath] = useState<string>("");

  // Update active path after component mounts to match client-side routing
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const navItems = [
    {
      name: "All",
      href: "/research",
      isActive: activePath === "/research"
    },
    {
      name: "Shortlist",
      href: "/research/shortlisted",
      isActive: activePath === "/research/shortlisted"
    }
  ];

  return <LinkTabs items={navItems} />;
}
