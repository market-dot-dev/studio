"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AppWindowMac,
  Scroll,
  Menu,
  UsersRound,
  Settings,
  ChartNoAxesColumn,
  CodeSquare,
  ScanSearch,
  Home,
  Package,
  Box,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FaDiscord, FaGithubAlt, FaTelegramPlane } from "react-icons/fa";
import { Badge } from "@tremor/react";

type TabTitle = {
  type: 'title';
  name: string;
};

type TabLink = {
  type: 'link';
  name: string;
  href: string;
  icon: ReactNode;
  target?: "_blank" | "_self";
  isActive?: boolean;
  isBeta?: boolean;
};

type TabMenu = {
  type: 'menu'
  name: string;
  icon: ReactNode;
  links: TabLink[];
};

type TabItem = TabTitle | TabLink | TabMenu;

const Tab: React.FC<TabItem> = (props) => {
  if (props.type === 'title') {
    const { name } = props;

    return (
      <span
        key={name}
        className="font-small ml-1 mt-4 text-xs font-medium uppercase leading-6 tracking-wide text-stone-500"
      >
        {name}
      </span>
    )
  }

  if (props.type === 'link') {
    const { name, href, icon, target, isActive, isBeta } = props;

    return (
      <Link
        key={name}
        href={href}
        target={target || '_self'}
        className={`flex items-center gap-2 ${
          isActive ? "bg-stone-200" : ""
        } rounded px-1 py-0.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
      >
        <span className="mx-px">{icon}</span>
        <span className="text-sm font-medium">{name}</span>
        {isBeta && (
          <Badge className="rounded border-none border-stone-200 bg-stone-50 px-1 !text-xxs font-semibold uppercase tracking-wide text-stone-600">
            Beta
          </Badge>
        )}
      </Link>
    );
  }

  return null;
};

export default function Nav({ children, siteId, roleId, hasFeatures }: { children: ReactNode, siteId: string | null, roleId: string | null, hasFeatures: boolean | null}) {
  const urlSegments = useSelectedLayoutSegments();

  const tabs: TabItem[] = useMemo(() => {
    const tabItems: TabItem[] = [
      {
        type: "link",
        name: "Home",
        href: "/",
        isActive: urlSegments.length === 0,
        icon: <Home size={18} />,
      },
      {
        type: "link",
        name: "Settings",
        href: "/settings",
        isActive: urlSegments[0] === "settings",
        icon: <Settings size={18} />,
      },
      {
        type: "title",
        name: "Offerings",
      },
    ];

    if (hasFeatures) {
      tabItems.push({
        type: "link",
        name: "Services",
        href: "/features",
        isActive: urlSegments[0] === "features",
        icon: <Box size={18} />,
      });
    }

    tabItems.push(
      {
        type: "link",
        name: "Packages",
        href: "/tiers",
        isActive: urlSegments[0] === "tiers",
        icon: <Package size={18} />,
      },
      {
        type: "link",
        name: "Contracts",
        href: "/contracts",
        isActive: urlSegments[1] === "contracts",
        isBeta: true,
        icon: <Scroll size={18} />,
      },
      {
        type: "title",
        name: "Marketing",
      },
    );

    if (siteId) {
      tabItems.push({
        type: "link",
        name: "Website",
        href: `/site/${siteId}`,
        isActive: urlSegments[0] === "site" || urlSegments[0] === "page",
        icon: <AppWindowMac size={18} />,
      });
    }

    tabItems.push(
      {
        type: "link",
        name: "Embeds",
        href: "/channels/embeds",
        isActive: urlSegments[0] === "embeds",
        icon: <CodeSquare size={18} />,
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
        icon: <UsersRound size={18} />,
      },
      {
        type: "link",
        name: "Research",
        href: "/leads",
        isActive: urlSegments[0] === "leads",
        icon: <ScanSearch size={18} />,
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
        icon: <ChartNoAxesColumn size={18} />,
      },
    );

    if (roleId === "admin") {
      tabItems.push(
        {
          type: "title",
          name: "⚠️ DEBUG MENU ⚠️",
        },
        {
          type: "link",
          name: "Debug",
          href: `/admin/debug`,
          icon: <Settings size={18} />,
        },
      );
    }

    return tabItems;
  }, [urlSegments, siteId, roleId, hasFeatures]);

  const supportLinks: TabLink[] = [
    {
      type: "link",
      name: "Join Discord",
      href: "https://discord.gg/ZdSpS4BuGd",
      target: "_blank",
      icon: <FaDiscord size={18} />,
    },
    {
      type: "link",
      name: "DM Founder",
      href: "https://t.me/tarunsachdeva2",
      target: "_blank",
      icon: <FaTelegramPlane size={18} />,
    },
    {
      type: "link",
      name: "Github",
      href: "https://www.github.com/git-wallet",
      target: "_blank",
      icon: <FaGithubAlt size={18} />,
    },
  ];

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
        } fixed z-20 flex h-full flex-col justify-between bg-stone-100 p-4 pl-3 pt-3.5 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-4">
          <Link href="/" className="ml-0.5">
            <Image
              src="/gw-logo-nav.png"
              alt="Gitwallet logo"
              height={24}
              width={24}
              className="h-6 w-6"
            />
          </Link>
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <Tab key={tab.name} {...tab} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="flex flex-col">
            {supportLinks.map((link) => (
              <Tab key={link.name} {...link} />
            ))}
          </div>
          <div className="ml-0.5">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
