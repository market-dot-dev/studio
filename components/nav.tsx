"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  LayoutDashboard,
  KanbanSquare,
  Menu,
  Users,
  Newspaper,
  Settings,
  Github,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getSiteFromPostId } from "@/lib/actions";
import Image from "next/image";

export default function Nav({ children }: { children: ReactNode }) {
  const urlSegments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();

  useEffect(() => {
    if (urlSegments[0] === "post" && id) {
      getSiteFromPostId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [urlSegments, id]);

  const tabs = useMemo(() => {
    if (urlSegments[0] === "site" && id) {
      return [
        {
          name: "Back to All Sites",
          href: "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Posts",
          href: `/site/${id}`,
          isActive: urlSegments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Analytics",
          href: `/site/${id}/analytics`,
          isActive: urlSegments.includes("analytics"),
          icon: <BarChart3 width={18} />,
        },
        {
          name: "Settings",
          href: `/site/${id}/settings`,
          isActive: urlSegments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (urlSegments[0] === "post" && id) {
      return [
        {
          name: "Back to All Posts",
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Editor",
          href: `/post/${id}`,
          isActive: urlSegments.length === 2,
          icon: <Edit3 width={18} />,
        },
        {
          name: "Settings",
          href: `/post/${id}/settings`,
          isActive: urlSegments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }
    return [
      {
        name: "Home",
        href: "/",
        isActive: urlSegments.length === 0,
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: "Customers",
        href: "/customers",
        isActive: urlSegments[0] === "customers",
        icon: <Users width={18} />,
      },
      {
        name: "Tiers and Services",
        href: "/tiers",
        isActive: urlSegments[0] === "tiers",
        icon: <KanbanSquare width={18} />,
      },
      {
        name: "Channels",
        href: "",
        isDivider: true,
      },
      {
        name: "Your Site",
        href: "/sites",
        isActive: urlSegments[0] === "sites",
        icon: <Globe width={18} />,
      },
      {
        name: "Github",
        href: "/github",
        isActive: urlSegments[0] === "github",
        icon: <Github width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: urlSegments[0] === "settings",
        icon: <Settings width={18} />,
      },
    ];
  }, [urlSegments, id, siteId]);

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
        className={`transform ${
          showSidebar ? "w-full translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
           
              <div className="text-md font-medium">
                Gitwallet
              </div>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
            
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                } rounded-lg px-2 py-1 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
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
