"use client";

import Link from "next/link";
import {
  Menu,
  Settings,
  Banknote
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CustomerNav() {
  const urlSegments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const tabs = useMemo(() => {
    return [
      {
        name: "Purchases",
        href: "/",
        isActive: urlSegments.length === 0,
        icon: <Banknote width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: urlSegments[0] === "settings",
        icon: <Settings width={18} />,
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
      {/* TODO: Remove and unify with header nav toggle button */}
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          // @TODO: This condition could probably be removed as Post no longer exists
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
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-3 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-[var(--navWidth)] sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="grid">
            {tabs.map(({ name, href, isActive, icon }) =>
              href === "" ? (
                <span
                  key={name}
                  className="mt-4 text-xs font-semibold uppercase tracking-wide"
                >
                  {name}
                </span>
              ) : (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center space-x-3 ${
                    isActive
                      ? "bg-white text-stone-800 shadow-border dark:bg-stone-700"
                      : ""
                  } rounded px-1 transition-all duration-150 ease-in-out hover:bg-white hover:shadow-border dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
