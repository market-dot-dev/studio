"use client";

import Link from "next/link";
import {
  Package,
  Scroll,
  UsersRound,
  Settings,
  Menu,
  Code2,
  ScanSearch,
  Box,
  Home,
  UserRoundSearch,
  ChartNoAxesColumnIncreasing as Chart,
  X,
  Store,
  ShoppingBag,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FaDiscord, FaGithubAlt } from "react-icons/fa";
import { Badge } from "@tremor/react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import OnboardingChecklist from "@/components/onboarding/onboarding-checklist";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";

interface BaseNavItem {
  name: string;
}

interface TitleItem extends BaseNavItem {
  type: "title";
}

interface LinkItem extends BaseNavItem {
  type: "link";
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  isBeta?: boolean;
  target?: string;
  children?: Array<{
    name: string;
    href: string;
    icon: ReactNode;
    isActive?: boolean;
  }>;
}

type NavItem = TitleItem | LinkItem;

function Item({ item }: { item: NavItem }) {
  if (item.type === "title") {
    return (
      <span className="font-small mb-1 ml-1 mt-4 text-xxs/4 font-bold uppercase tracking-wide text-stone-500">
        {item.name}
      </span>
    );
  }

  return (
    <div>
      <Link
        href={item.href}
        target={item.target}
        className={clsx(
          "flex h-6 items-center space-x-3",
          "rounded px-1 transition-all duration-150 ease-in-out",
          "hover:bg-white hover:shadow-border",
          "focus:bg-white focus:shadow-border focus:outline-none",
          "dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800",
          item.isActive &&
            "bg-white text-black shadow-border dark:bg-stone-700",
        )}
      >
        {item.icon}
        <span className="text-sm font-medium">{item.name}</span>
        {item.isBeta && (
          <Badge
            size="xs"
            tooltip="This feature is still in Beta"
            className="p-1.5 py-1 text-xxs font-medium"
          >
            Beta
          </Badge>
        )}
      </Link>
      {item.children && item.isActive && (
        <div className="ml-6 space-y-1">
          {item.children.map((child) => (
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
  );
}

interface NavProps {
  siteId: string | null;
  roleId: string | null;
  hasFeatures: boolean | null;
  isMarketExpert: boolean | null;
  isMobile?: boolean;
  className?: string;
  onboarding: OnboardingState;
  showOnboardingModal: boolean;
}

export default function Nav({
  siteId,
  roleId,
  hasFeatures,
  isMarketExpert,
  isMobile = false,
  className,
  onboarding,
  showOnboardingModal,
}: NavProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const urlSegments = useSelectedLayoutSegments();
  const pathname = usePathname();
  const isHomepage = urlSegments.length === 0;

  const items = useMemo(() => {
    const featureItems: LinkItem[] = [
      {
        type: "link",
        name: "Services",
        href: "/features",
        isActive: urlSegments[0] === "features",
        icon: <Box width={18} />,
      },
    ];

    const siteItems: LinkItem[] = [
      {
        type: "link",
        name: "Storefront",
        href: `/site/${siteId}`,
        isActive: urlSegments[0] === "site" || urlSegments[0] === "page",
        icon: <Store width={18} />,
      },
    ];

    const marketItems: LinkItem[] = [
      {
        type: "link",
        name: "Marketplace",
        href: "/channels/market",
        icon: <ShoppingBag width={18} />,
        isActive: urlSegments[1] === "market",
      },
    ];

    const mainItems: NavItem[] = [
      {
        type: "link",
        name: "Home",
        href: "/",
        isActive: urlSegments.length === 0,
        icon: <Home width={18} />,
      },
      {
        type: "link",
        name: "Settings",
        href: "/settings",
        isActive: urlSegments[0] === "settings",
        icon: <Settings width={18} />,
      },
      {
        type: "title",
        name: "Your Services",
      },
      ...(hasFeatures ? featureItems : []),
      {
        type: "link",
        name: "Packages",
        href: "/tiers",
        isActive: urlSegments[0] === "tiers",
        icon: <Package width={18} />,
      },
      {
        type: "link",
        name: "Contracts",
        href: "/contracts",
        isActive: urlSegments[0] === "contracts",
        isBeta: true,
        icon: <Scroll width={18} />,
      },
      {
        type: "title",
        name: "Customers",
      },
      {
        type: "link",
        name: "Customers",
        href: "/customers",
        isActive: urlSegments[0] === "customers",
        icon: <UsersRound width={18} />,
      },
      {
        type: "link",
        name: "Prospects",
        href: "/prospects",
        isActive: urlSegments[0] === "prospects",
        icon: <UserRoundSearch width={18} />,
      },
      {
        type: "link",
        name: "Research",
        href: "/leads",
        isActive: urlSegments[0] === "leads",
        icon: <ScanSearch width={18} />,
      },
      {
        type: "title",
        name: "Channels",
      },
      ...(siteId ? siteItems : []),
      ...(isMarketExpert ? marketItems : []),
      {
        type: "link",
        name: "Embeds",
        href: "/channels/embeds",
        icon: <Code2 width={18} />,
        isActive: urlSegments[1] === "embeds",
      },
      {
        type: "title",
        name: "Analytics",
      },
      {
        type: "link",
        name: "Reports",
        href: "/reports",
        isActive: urlSegments[0] === "reports",
        icon: <Chart width={18} />,
      },
    ] as const;

    const debugItems: NavItem[] = ["admin"].includes(roleId || "")
      ? [
          {
            type: "title",
            name: "⚠️ DEBUG MENU ⚠️",
          },
          {
            type: "link",
            name: "Debug",
            href: `/admin/debug`,
            icon: <Settings width={18} />,
          },
        ]
      : [];

    return [...mainItems, ...debugItems] as NavItem[];
  }, [urlSegments, siteId, roleId, hasFeatures]);

  const serviceItems: NavItem[] = useMemo(() => {
    return [
      {
        type: "link",
        name: "Github",
        href: "https://www.github.com/market-dot-dev/",
        target: "_blank",
        icon: <FaGithubAlt width={18} className="text-stone-700" />,
      },
      {
        type: "link",
        name: "Join Discord",
        href: "https://discord.gg/ZdSpS4BuGd",
        target: "_blank",
        icon: <FaDiscord width={18} className="text-stone-700" />,
      },
    ];
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobile) {
      if (isSidebarOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen, isMobile]);

  return (
    <>
      {isMobile && (
        <button
          className="-m-0.5 rounded p-0.5 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <AnimatePresence initial={false} mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0.6, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.6, scale: 0.95 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <X width={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0.6, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.6, scale: 0.95 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <Menu width={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}
      <nav
        className={clsx(
          `fixed flex-col justify-between gap-12 overflow-y-scroll border-r border-stone-200 bg-stone-100 p-3 transition-all duration-300 dark:border-stone-700 dark:bg-stone-900`,
          isMobile
            ? [
                "inset-0 top-[var(--headerHeight)] z-50 flex h-[calc(100vh-var(--headerHeight))] w-full transform md:hidden",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              ]
            : "z-20 hidden h-[var(--navHeight)] w-60 md:flex",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            {items.map((item, index) => (
              <Item key={item.name + index} item={item} />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {(isMobile || !isHomepage) &&
              onboarding?.isDismissed !== undefined &&
              !onboarding.isDismissed &&
              !showOnboardingModal && (
                <motion.span
                  key="onboarding-checklist"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.8,
                  }}
                  className="mb-4"
                >
                  <OnboardingChecklist variant="mini" />
                </motion.span>
              )}
          </AnimatePresence>
          {serviceItems.map((item, index) => (
            <Item key={item.name + index} item={item} />
          ))}
        </div>
      </nav>
    </>
  );
} 