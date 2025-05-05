"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("inline-flex items-center text-muted-foreground", {
  variants: {
    variant: {
      default:
        "scrollbar-hide w-full gap-6 overflow-x-auto overflow-y-visible border-b border-stone-200",
      background: "w-fit rounded-lg bg-stone-900/5 p-1",
      pills: "w-fit gap-1"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant, className }))}
      {...props}
    />
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "py-2 hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-[2px] data-[state=active]:after:rounded-t-[2px] data-[state=active]:after:bg-foreground data-[state=active]:after:content-['']",
        background:
          "px-3 py-1.5 hover:text-foreground focus:text-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-border-sm",
        pills:
          "rounded-full px-3 py-1.5 hover:text-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-border"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export interface LinkTabsProps {
  items: {
    name: string;
    href: string;
    isActive: boolean;
  }[];
  variant?: "default" | "background" | "pills";
  className?: string;
}

// LinkTab component for individual tabs - helps with hydration
function LinkTab({
  item,
  variant
}: {
  item: { name: string; href: string; isActive: boolean };
  variant: "default" | "background" | "pills";
}) {
  const [mounted, setMounted] = React.useState(false);

  // Only set the data-state attribute after component has mounted on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        tabsTriggerVariants({ variant }),
        // Apply basic styling for initial render to avoid hydration mismatch
        !mounted && item.isActive ? "text-stone-800" : "",
        !mounted && !item.isActive ? "text-stone-600" : ""
      )}
      // Only set data-state after client-side hydration
      {...(mounted ? { "data-state": item.isActive ? "active" : "inactive" } : {})}
    >
      {item.name}
    </Link>
  );
}

function LinkTabs({ items, variant = "default", className }: LinkTabsProps) {
  return (
    <div
      className={cn(
        tabsListVariants({ variant }),
        "scrollbar-hide relative overflow-x-auto overflow-y-visible",
        className
      )}
    >
      {items.map((item) => (
        <LinkTab key={item.name} item={item} variant={variant} />
      ))}
    </div>
  );
}

export { LinkTabs, Tabs, TabsContent, TabsList, TabsTrigger };
