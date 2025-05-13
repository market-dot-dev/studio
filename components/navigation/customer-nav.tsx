"use client";

import type { NavGroup } from "@/components/navigation/app-nav";
import { AppNav } from "@/components/navigation/app-nav";
import { Banknote, Menu, Settings } from "lucide-react";
import { useParams, usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function CustomerNav() {
  const urlSegments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  const mainItems: NavGroup[] = useMemo(
    () => [
      {
        items: [
          {
            title: "Purchases",
            url: "/",
            icon: Banknote,
            isActive: urlSegments.length === 0
          },
          {
            title: "Settings",
            url: "/settings",
            icon: Settings,
            isActive: urlSegments[0] === "settings"
          }
        ]
      }
    ],
    [urlSegments]
  );

  return (
    <>
      <button
        className={`fixed z-20 ${
          urlSegments[0] === "post" && urlSegments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`${
          showSidebar ? "w-full translate-x-0" : "-translate-x-full"
        } fixed z-10 h-full transition-all sm:w-[var(--sidebar-width)] sm:translate-x-0`}
      >
        <AppNav mainItems={mainItems} />
      </div>
    </>
  );
}
