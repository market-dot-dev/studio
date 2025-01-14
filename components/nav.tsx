"use client";

import Link from "next/link";
import {
  AppWindowMac,
  Package,
  Scroll,
  Menu,
  Users,
  Settings,
  BarChart4,
  Code2,
  Radar,
  Box,
  Home,
  UserSearch,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { FaDiscord, FaGithubAlt, FaTelegramPlane } from "react-icons/fa";
import { Badge } from "@tremor/react";

type Tab = {
  name: string;
  href: string;
  target?: string;
  isActive?: boolean;
  isBeta?: boolean;
  icon?: ReactNode;
  isDivider?: boolean;
  children?: Omit<Tab, "children">[];
};

export default function Nav({
  siteId,
  roleId,
  hasFeatures,
}: {
  siteId: string | null;
  roleId: string | null;
  hasFeatures: boolean | null;
}) {
  const urlSegments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const tabs: Tab[] = useMemo(() => {
    return [
      {
        name: "Home",
        href: "/",
        isActive: urlSegments.length === 0,
        icon: <Home width={18} />,
      },

      {
        name: "Settings",
        href: "/settings",
        isActive: urlSegments[0] === "settings",
        icon: <Settings width={18} />,
      },

      // Services
      {
        name: "Your Services",
        href: "",
        isDivider: true,
      },
      ...(hasFeatures
        ? [
            {
              name: "Services",
              href: "/features",
              isActive: urlSegments[0] === "features",
              icon: <Box width={18} />,
            },
          ]
        : []),
      {
        name: "Packages",
        href: "/tiers",
        isActive: urlSegments[0] === "tiers",
        icon: <Package width={18} />,
      },
      {
        name: "Contracts",
        href: "/contracts",
        isActive: urlSegments[0] === "contracts",
        isBeta: true,
        icon: <Scroll width={18} />,
      },

      // Customers
      {
        name: "Customers",
        href: "",
        isDivider: true,
      },
      {
        name: "Customers",
        href: "/customers",
        isActive: urlSegments[0] === "customers",
        icon: <Users width={18} />,
      },
      {
        name: "Prospects",
        href: "/prospects",
        isActive: urlSegments[0] === "prospects",
        icon: <UserSearch width={18} />,
      },
      {
        name: "Research",
        href: "/leads",
        isActive: urlSegments[0] === "leads",
        icon: <Radar width={18} />,
      },

      // Marketing
      {
        name: "Marketing",
        href: "",
        isDivider: true,
      },
      ...(siteId
        ? [
            {
              name: "Site",
              href: `/site/${siteId}`,
              isActive: urlSegments[0] === "site" || urlSegments[0] === "page",
              icon: <AppWindowMac width={18} />,
            },
          ]
        : []),
      {
        name: "Embeds",
        href: "/channels/embeds",
        icon: <Code2 width={18} />,
        isActive: urlSegments[1] === "embeds",
      },

      // Analytics
      {
        name: "Analytics",
        href: "",
        isDivider: true,
      },
      {
        name: "Reports",
        href: "/reports",
        isActive: urlSegments[0] === "reports",
        icon: <BarChart4 width={18} />,
      },
      ...(["admin"].includes(roleId || "")
        ? [
            {
              name: "⚠️ DEBUG MENU ⚠️",
              href: "",
              isDivider: true,
            },
            {
              name: "Debug",
              href: `/admin/debug`,
              icon: <GearIcon width={18} />,
            },
          ]
        : []),
    ];
  }, [urlSegments, id, siteId, roleId]);

  const serviceTabs: Tab[] = useMemo(() => {
    return [
      {
        name: "Join Discord",
        href: "https://discord.gg/ZdSpS4BuGd",
        target: "_blank",
        icon: <FaDiscord width={18} />,
      },
      {
        name: "DM Founder",
        href: "https://t.me/tarunsachdeva2",
        target: "_blank",
        icon: <FaTelegramPlane width={18} />,
      },
      {
        name: "Github",
        href: "https://www.github.com/git-wallet",
        target: "_blank",
        icon: <FaGithubAlt width={18} />,
      },
    ];
  }, [urlSegments, id]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-[21] ${
          // left align for Editor, right align for other pages
          urlSegments[0] === "post" && urlSegments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? "w-full translate-x-0" : "-translate-x-full"
        } fixed z-20 flex h-[calc(100vh-40px)] flex-col justify-between border-r border-stone-200 bg-stone-100 p-3 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            {tabs.map((tab, index) =>
              tab.href === "" ? (
                <span
                  key={tab.name}
                  className="font-small mb-1 ml-1 mt-4 text-xxs/4 font-bold uppercase tracking-wide text-stone-500"
                >
                  {tab.name}
                </span>
              ) : (
                <div key={tab.name + index}>
                  <Link
                    href={tab.href}
                    target={tab.target}
                    className={`flex items-center space-x-3 ${
                      tab.isActive
                        ? "bg-stone-200 text-black dark:bg-stone-700"
                        : ""
                    } rounded px-1 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                  >
                    {tab.icon}
                    <span className="text-sm font-medium">{tab.name}</span>
                    {tab.isBeta && (
                      <Badge size="xs" tooltip="This feature is still in Beta">
                        Beta
                      </Badge>
                    )}
                  </Link>
                  {tab.children && tab.isActive && (
                    <div className="ml-6 space-y-1">
                      {tab.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center space-x-3 ${
                            child.isActive
                              ? "bg-stone-200 text-black dark:bg-stone-700"
                              : ""
                          } rounded px-1 text-sm transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                        >
                          {child.icon}
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          {serviceTabs.map((tab, index) =>
            tab.href === "" ? (
              <span
                key={tab.name}
                className="font-small mb-1 ml-1 mt-4 text-xxs/4 font-semibold uppercase tracking-wide text-stone-500"
              >
                {tab.name}
              </span>
            ) : (
              <div key={tab.name + index}>
                <Link
                  href={tab.href}
                  target={tab.target}
                  className={`flex items-center space-x-3 ${
                    tab.isActive
                      ? "bg-stone-200 text-black dark:bg-stone-700"
                      : ""
                  } rounded px-1 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.name}</span>
                  {tab.isBeta && (
                    <Badge size="xs" tooltip="This feature is still in Beta">
                      Beta
                    </Badge>
                  )}
                </Link>
                {tab.children && tab.isActive && (
                  <div className="ml-6 space-y-1">
                    {tab.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center space-x-3 ${
                          child.isActive
                            ? "bg-stone-200 text-black dark:bg-stone-700"
                            : ""
                        } rounded px-1 text-sm transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                      >
                        {child.icon}
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}
