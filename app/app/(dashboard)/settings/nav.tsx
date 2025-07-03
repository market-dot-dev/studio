"use client";

import { LinkTabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, CreditCard, Landmark } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsNav() {
  const segment = useSelectedLayoutSegment();
  // Initialize with a null state to avoid hydration mismatch
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Update active segment after component mounts to match client-side routing
  useEffect(() => {
    setActiveSegment(segment);
  }, [segment]);

  const navItems = [
    {
      icon: <BriefcaseBusiness className="h-4.5 w-4.5" />,
      name: "Organization Info",
      href: `/settings`,
      isActive: activeSegment === null
    },
    {
      icon: <Landmark className="h-4.5 w-4.5" />,
      name: "Stripe Account",
      href: `/settings/payment`,
      isActive: activeSegment === "payment"
    },
    {
      icon: <CreditCard className="h-4.5 w-4.5" />,
      name: "Billing & Plan",
      href: `/settings/billing`,
      isActive: activeSegment === "billing"
    }
    // {
    //   name: "Integrations",
    //   href: `/settings/integrations`,
    //   isActive: activeSegment === "integrations"
    // }
  ];

  return (
    <>
      <LinkTabs items={navItems} className="xl:hidden" />
      <div className="absolute inset-y-0 -left-2 hidden h-full w-fit flex-col gap-1 xl:flex">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm rounded pl-2 pr-2.5 h-8 font-medium whitespace-nowrap hover:text-foreground hover:bg-white hover:shadow-border-sm transition-[color,background-color,box-shadow]",
              item.isActive ? "text-foreground bg-white shadow-border-sm" : "text-stone-600"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
