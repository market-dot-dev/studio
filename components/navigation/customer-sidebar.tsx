"use client";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import type { SidebarItemGroup } from "@/types/sidebar";
import { Banknote, Settings } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";

export function CustomerSidebar() {
  const urlSegments = useSelectedLayoutSegments();

  const mainItems: SidebarItemGroup[] = [
    {
      items: [
        {
          title: "Purchases",
          url: "/c",
          icon: <Banknote />,
          isActive: urlSegments.length === 0
        },
        // @DEPRECATED:
        {
          title: "Settings",
          url: "/c/settings",
          icon: <Settings />,
          isActive: urlSegments[0] === "settings"
        }
      ]
    }
  ];

  return <AppSidebar mainItems={mainItems} />;
}
