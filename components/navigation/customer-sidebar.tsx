"use client";

import type { SidebarGroup } from "@/components/navigation/app-sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Banknote, Settings } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";

export function CustomerSidebar() {
  const urlSegments = useSelectedLayoutSegments();

  const mainItems: SidebarGroup[] = [
    {
      items: [
        {
          title: "Purchases",
          url: "/",
          icon: <Banknote />,
          isActive: urlSegments.length === 0
        },
        {
          title: "Settings",
          url: "/settings",
          icon: <Settings />,
          isActive: urlSegments[0] === "settings"
        }
      ]
    }
  ];

  return <AppSidebar mainItems={mainItems} />;
}
