"use client";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import type { SidebarItemGroup } from "@/types/sidebar";
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
  const urlSegments = useSelectedLayoutSegments();

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
        ...(isMarketExpert
          ? [
              {
                title: "Marketplace",
                url: "/channels/market",
                icon: <ShoppingBag />,
                isActive: urlSegments[1] === "market"
              }
            ]
          : []),
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
        }
      ]
    }
  ];

  return <AppSidebar mainItems={mainItems} footerItems={footerItems} />;
}
