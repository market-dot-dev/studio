"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function LeadsNav() {
//   const { id } = useParams() as { id?: string };
  const segment = useSelectedLayoutSegment();

  const navItems = [
    {
      name: "Search",
      href: `/leads`,
      segment: null,
    },
    {
      name: "Shortlisted",
      href: `/leads/shortlisted`,
      segment: "shortlisted",
    }
  ];

  return (
    <div className="flex space-x-4 border-b border-stone-200 pb-4 pt-2 dark:border-stone-700">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          // Change style depending on whether the link is active
          className={cn(
            "rounded px-2 py-1 text-sm font-medium transition-colors active:bg-stone-200 dark:active:bg-stone-600",
            segment === item.segment ? "bg-stone-200 text-stone-800" : "text-stone-600 hover:bg-stone-200",
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
