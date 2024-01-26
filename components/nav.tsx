"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  LayoutDashboard,
  KanbanSquare,
  Binary,
  Menu,
  Users,
  Newspaper,
  Building2,
  Settings,
  Github,
  BarChart4,
  Code2,
  Box,
  Receipt,
  ReceiptIcon,
  Package,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

// PAGE STATE SELECTOR: IMPORT THE RIGHT PAGE STATE, AND SELECTOR COMPONENT
import { NavigationPageStates } from "@/components/internal-use/PageStates";
import PageStateSelector from "@/components/internal-use/page-state-selector";
import { GearIcon } from "@radix-ui/react-icons";


export default function Nav({ children, siteId, roleId }: { children: ReactNode, siteId: string | null, roleId: string | null }) {
  const urlSegments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  // PAGE STATE SELECTOR: SET THE DEFAULT STATE HERE
  const [pageState, setPageState] = useState(NavigationPageStates.MaintainerNav);


  const tabs = useMemo(() => {
    // CUSTOMER NAV
    if (pageState === NavigationPageStates.CustomerNav) {
      return [
        {
          name: "Home",
          href: "/c/home",
          isActive: urlSegments.length === 0,
          icon: <LayoutDashboard width={18} />,
        },
        {
          name: "Your Packages",
          href: "/c/subscriptions",
          isActive: urlSegments.length === 0,
          icon: <Package width={18} />,
        },
        {
          name: "Settings",
          href: "/c/settings",
          isActive: urlSegments.length === 0,
          icon: <GearIcon width={18} />,
        },
      ];
    } else if (pageState === NavigationPageStates.MaintainerNav)
    // MAINTAINER NAV 
    {
      if (urlSegments[0] === "site" && id) {
        return [
          {
            name: "Back to Dashboard",
            href: "/",
            icon: <ArrowLeft width={18} />,
          },
          {
            name: "Site Content",
            href: `/site/${id}`,
            isActive: urlSegments.length === 2,
            icon: <Newspaper width={18} />,
          },
          {
            name: "Site Settings",
            href: `/site/${id}/settings`,
            isActive: urlSegments.includes("settings"),
            icon: <Settings width={18} />,
          },
        ];
      } 
      else if(urlSegments[0] === "page" && siteId) {
        return [
          {
            name: "Back to Site",
            href: `/site/${siteId}`,
            icon: <ArrowLeft width={18} />,
          },
          {
            name: "Settings",
            href: `/site/${siteId}/settings`,
            isActive: urlSegments.includes("settings"),
            icon: <Settings width={18} />,
          },
        ];
      }
      else if (urlSegments[0] === "post" && id) {
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
      } else 
      return [
        {
          name: "Home",
          href: "/",
          isActive: urlSegments.length === 0,
          icon: <LayoutDashboard width={18} />,
        },
        {
          name: "Offerings",
          href: "/offering",
          isActive: urlSegments[0] === "offering",
          icon: <Box width={18} />,
        },
        {
          name: "Packages",
          href: "/services/tiers",
          isActive: urlSegments[0] === "services",
          icon: <KanbanSquare width={18} />,
        },
        {
          name: "Customers",
          href: "/customers",
          isActive: urlSegments[0] === "customers",
          icon: <Users width={18} />,
        },
        {
          name: "Reports",
          href: "/reports",
          isActive: urlSegments[0] === "reports",
          icon: <BarChart4 width={18} />,
        },
        {
          name: "Settings",
          href: "/settings",
          isActive: urlSegments[0] === "settings",
          icon: <Settings width={18} />,
        },
        {
          name: "Channels",
          href: "",
          isDivider: true,
        },
        ...(siteId ? 
        [{
          name: "Your Site",
          href: `/site/${siteId}`,
          icon: <Globe width={18} />,
        },
        {
          name: "Embeds",
          href: "/channels/embeds",
          isActive: urlSegments[0] === "embeds",
          icon: <Code2 width={18} />,
        },
        {
          name: "Enterprise",
          href: "/channels/enterprise",
          isActive: urlSegments[0] === "enterprise",
          icon: <Building2 width={18} />,
        },
      ] : []),
        // {
        //   name: `Role: ${roleId}`,
        //   href: "",
        //   isDivider: true,
        // },
      ];
    }
    else if (urlSegments[0] === "post" && id) {
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
        name: "Services",
        href: "/services/tiers",
        isActive: urlSegments[0] === "services",
        icon: <KanbanSquare width={18} />,
      },
      {
        name: "Analytics",
        href: "/analytics",
        isActive: urlSegments[0] === "analytics",
        icon: <BarChart4 width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: urlSegments[0] === "settings",
        icon: <Settings width={18} />,
      },
      {
        name: "Channels",
        href: "",
        isDivider: true,
      },
      ...(siteId ? 
      [{
        name: "Your Site",
        href: `/site/${siteId}`,
        isActive: urlSegments[0] === "site",
        icon: <Globe width={18} />,
      }] : []),
      {
        name: "Embeds",
        href: "/channels/embeds",
        isActive: urlSegments[0] === "embeds",
        icon: <Code2 width={18} />,
      },
      {
        name: "Github",
        href: "/channels/github",
        isActive: urlSegments[0] === "github",
        icon: <Github width={18} />,
      },
      {
        name: `Role: ${roleId}`,
        href: "",
        isDivider: true,
      },
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
        className={`transform 
          ${ showSidebar ? "w-full translate-x-0" : "-translate-x-full" } 
          ${ pageState === NavigationPageStates.CustomerNav ? "bg-stone-800" : "bg-stone-100"}
          fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all xsm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg py-1.5">
              <div className="text-md font-medium">
              { pageState === NavigationPageStates.CustomerNav ?  
                <img src="/logo-white.png" className="h-8" /> : 
                <img src="/wordmark.png" className="h-8" />
              }
              </div>
          </div>
          <div className="grid gap-0.5">
            {tabs.map(({ name, href, isActive, icon }) => (
              href === "" ? (
                  <span key={name} className="text-xs font-small uppercase mt-4">{name}</span>
                ) : (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center space-x-3
                  ${ pageState === NavigationPageStates.CustomerNav ? "text-white hover:bg-stone-600 active:bg-stone-700" : "text-stone-800 hover:bg-stone-200 active:bg-stone-300"} 
                  ${ isActive ? "bg-stone-200 text-stone-800" : "" } 
                    rounded-lg px-1 py-0.5 transition-all duration-150 ease-in-out`}
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              )
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            
          </div>
          <div className="my-2 border-t border-stone-200" />
          {children}
        </div>
      </div>

            {/* PAGE STATE SELECTOR COMPONENT */}
      <PageStateSelector 
          pageName="Navigation"
         pageState={pageState}
         setPageState={setPageState}
         statesEnum={NavigationPageStates}
         position="right"
        />
    </>
  );
}
