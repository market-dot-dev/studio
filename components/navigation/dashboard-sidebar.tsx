"use client";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { OrganizationSwitcherContext } from "@/types/organization";
import type { SidebarItemGroup } from "@/types/sidebar";
import type { SiteDetails } from "@/types/site";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import {
  AppWindowMac,
  Building,
  ChartNoAxesColumnIncreasing as Chart,
  Code2,
  Home,
  MessageCircle,
  Package,
  ScanSearch,
  Scroll,
  Settings,
  UserRoundSearch,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

interface DashboardSidebarProps {
  orgContext: OrganizationSwitcherContext;
  site: SiteDetails | null;
}

function SupportDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-6 w-full items-center gap-2 rounded px-1 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-white hover:text-sidebar-accent-foreground hover:shadow-border-sm focus-visible:bg-white focus-visible:text-sidebar-accent-foreground focus-visible:shadow-border-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp [&>svg]:size-[18px] [&>svg]:shrink-0">
        <MessageCircle />
        Feedback
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full min-w-[200px]">
        <DropdownMenuItem asChild>
          <Link href="https://www.github.com/market-dot-dev/" className="flex items-center gap-2">
            <SiGithub className="size-4" />
            Github
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="https://discord.gg/ZdSpS4BuGd" className="flex items-center gap-2">
            <SiDiscord className="size-4" />
            Join Discord
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardSidebar({ orgContext, site }: DashboardSidebarProps) {
  const urlSegments = useSelectedLayoutSegments();

  const headerItems: SidebarItemGroup[] = [
    {
      items: [<OrganizationSwitcher context={orgContext} key="org-switcher" />]
    }
  ];

  const mainItems: SidebarItemGroup[] = [
    {
      items: [
        {
          title: "Home",
          url: "/",
          icon: <Home />,
          isActive: urlSegments.length === 0
        },
        {
          title: "Team",
          url: "/team",
          icon: <Building />,
          isActive: urlSegments[0] === "team"
        },
        {
          title: "Settings",
          url: "/settings",
          icon: <Settings />,
          isActive: urlSegments[0] === "settings"
        }
      ]
    },
    {
      label: "Services",
      items: [
        {
          title: "Packages",
          url: "/tiers",
          icon: <Package />,
          isActive: urlSegments[0] === "tiers"
        },
        {
          title: "Contracts",
          url: "/contracts",
          icon: <Scroll />,
          isActive: urlSegments[0] === "contracts"
        }
      ]
    },
    {
      label: "Customers",
      items: [
        {
          title: "Customers",
          url: "/customers",
          icon: <UsersRound />,
          isActive: urlSegments[0] === "customers"
        },
        {
          title: "Prospects",
          url: "/prospects",
          icon: <UserRoundSearch />,
          isActive: urlSegments[0] === "prospects"
        },
        {
          title: "Research",
          url: "/research",
          icon: <ScanSearch />,
          isBeta: true,
          isActive: urlSegments[0] === "research"
        }
      ]
    },
    {
      label: "Channels",
      items: [
        ...(site
          ? [
              {
                title: "Landing Page",
                url: `/site/${site.id}`,
                icon: <AppWindowMac />,
                isActive: urlSegments[0] === "site" || urlSegments[0] === "page"
              }
            ]
          : []),
        // {
        //   title: "Marketplace",
        //   url: "/channels/market",
        //   icon: <ShoppingBag />,
        //   isActive: urlSegments[1] === "market"
        // },
        {
          title: "Embeds",
          url: "/channels/embeds",
          icon: <Code2 />,
          isActive: urlSegments[1] === "embeds"
        }
      ]
    },
    {
      label: "Analytics",
      items: [
        {
          title: "Reports",
          url: "/reports",
          icon: <Chart />,
          isActive: urlSegments[0] === "reports"
        }
      ]
    }
  ];

  const footerItems: SidebarItemGroup[] = [
    {
      items: [<SupportDropdown key="support-dropdown" />]
    }
  ];

  return <AppSidebar mainItems={mainItems} headerItems={headerItems} footerItems={footerItems} />;
}
