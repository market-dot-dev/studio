"use client";

import type { SidebarGroup } from "@/components/navigation/app-sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import type { Site, User } from "@prisma/client";
import {
  AppWindowMac,
  ChartNoAxesColumnIncreasing as Chart,
  Code2,
  Home,
  Package,
  ScanSearch,
  Scroll,
  Settings,
  ShoppingBag,
  UserRoundSearch,
  UsersRound
} from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";

interface DashboardSidebarProps {
  user: User;
  isMarketExpert: boolean;
  site: Site | null;
}

export function DashboardSidebar({ user, isMarketExpert, site }: DashboardSidebarProps) {
  const segments = useSelectedLayoutSegments();

  const mainItems: SidebarGroup[] = [
    {
      items: [
        {
          title: "Home",
          url: "/",
          icon: <Home />,
          isActive: segments.length === 0
        },
        {
          title: "Settings",
          url: "/settings",
          icon: <Settings />,
          isActive: segments[0] === "settings"
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
          isActive: segments[0] === "tiers"
        },
        {
          title: "Contracts",
          url: "/contracts",
          icon: <Scroll />,
          isActive: segments[0] === "contracts"
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
          isActive: segments[0] === "customers"
        },
        {
          title: "Prospects",
          url: "/prospects",
          icon: <UserRoundSearch />,
          isActive: segments[0] === "prospects"
        },
        {
          title: "Research",
          url: "/research",
          icon: <ScanSearch />,
          isBeta: true,
          isActive: segments[0] === "research"
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
                isActive: segments[0] === "site" || segments[0] === "page"
              }
            ]
          : []),
        ...(isMarketExpert
          ? [
              {
                title: "Marketplace",
                url: "/channels/market",
                icon: <ShoppingBag />,
                isActive: segments[1] === "market"
              }
            ]
          : []),
        {
          title: "Embeds",
          url: "/channels/embeds",
          icon: <Code2 />,
          isActive: segments[1] === "embeds"
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
          isActive: segments[0] === "reports"
        }
      ]
    }
  ];

  const footerItems: SidebarGroup[] = [
    {
      items: [
        {
          title: "Github",
          url: "https://www.github.com/market-dot-dev/",
          icon: <SiGithub />
        },
        {
          title: "Join Discord",
          url: "https://discord.gg/ZdSpS4BuGd",
          icon: <SiDiscord />
        },
        ...(user.roleId === "admin"
          ? [
              {
                title: "Admin Debug",
                url: `/admin/debug`,
                icon: <Settings />,
                isActive: segments[0] === "admin"
              }
            ]
          : [])
      ]
    }
  ];

  return <AppSidebar mainItems={mainItems} footerItems={footerItems} />;
}
