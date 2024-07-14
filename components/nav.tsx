"use client";

import Link from "next/link";
import {
  Globe,
  LayoutDashboard,
  KanbanSquare,
  Scroll,
  Menu,
  Users,
  Settings,
  BarChart4,
  Code2,
  Radar,
  Box,
  Home,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { Badge } from "@tremor/react";

export default function Nav({ children, siteId, roleId }: { children: ReactNode, siteId: string | null, roleId: string | null }) {
  const urlSegments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const tabs = useMemo(() => {
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
      // SERVICES
      {
        name: "Services",
        href: "",
        isDivider: true,
      },
      {
        name: "Services",
        href: "/features",
        isActive: urlSegments[0] === "features",
        icon: <Box width={18} />,
      },
      {
        name: "Packages",
        href: "/tiers",
        isActive: urlSegments[0] === "tiers",
        icon: <KanbanSquare width={18} />,
      },
      {
        name: "Contracts",
        href: "/contracts",
        isActive: urlSegments[1] === "contracts",
        isBeta: true,
        icon: <Scroll width={18} />,
      },

      // CUSTOMERS 
      {
        name: "Customers",
        href: "",
        isDivider: true,
      },
      {
        name: "Research",
        href: "/leads",
        isActive: urlSegments[0] === "leads",
        icon: <Radar width={18} />,
      },
      {
        name: "Customers",
        href: "/customers",
        isActive: urlSegments[0] === "customers",
        icon: <Users width={18} />,
      },

      // REPORTS
      {
        name: "Reports",
        href: "/reports",
        isActive: urlSegments[0] === "reports",
        icon: <BarChart4 width={18} />,
      },

      // CHANNELS
      {
        name: "Channels",
        href: "",
        isDivider: true,
      },
      ...(siteId ?
        [{
          name: "Your Site",
          href: `/site/${siteId}`,
          isActive: urlSegments[0] === "site" || urlSegments[0] === "page",
          icon: <Globe width={18} />,
        }] : []),
      {
        name: "Embeds",
        href: "/channels/embeds",
        isActive: urlSegments[0] === "embeds",
        icon: <Code2 width={18} />,
      },

      // SUPPORT
      {
        name: "Support",
        href: "",
        isDivider: true,
      },
      {
        name: "Discord",
        href: "https://discord.gg/ZdSpS4BuGd",
        target: "_blank",
        icon: <FaDiscord width={18} />,
      },
      {
        name: "Contact Founder",
        href: "https://t.me/tarunsachdeva2",
        target: "_blank",
        icon: <FaTelegramPlane width={18} />,
      },
      ...(['admin'].includes(roleId || '') ?
        [{
          name: "⚠️ DEBUG MENU ⚠️",
          href: "",
          isDivider: true,
        },
        {
          name: "Debug",
          href: `/admin/debug`,
          icon: <GearIcon width={18} />,
        }
        ] : []),
    ];
  }, [urlSegments, id, siteId, roleId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
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
        className={`transform ${showSidebar ? "w-full translate-x-0" : "-translate-x-full"
          } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg py-1.5">
            <div className="text-md font-medium">
              <Link href="/" ><img src="/gw-logo-nav.png" className="h-8 hover:scale-110" /></Link>
            </div>
          </div>
          <div className="grid gap-0.5">
            {tabs.map(({ name, href, target, isActive, isBeta, icon }) => (
              href === "" ? (
                <span key={name} className="text-xs font-small uppercase mt-4">{name}</span>
              ) : (
                <Link
                  key={name}
                  href={href}
                  target={target}
                  className={`flex items-center space-x-3 ${isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                    } rounded-lg px-1 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                  {isBeta && <Badge size={'xs'} tooltip="We are all works in progress. This feature, a bit more so.">Beta</Badge>}
                </Link>
              )
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">

          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
