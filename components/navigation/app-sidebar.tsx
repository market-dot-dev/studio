"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import type { SidebarItem, SidebarItemGroup, SidebarItemOrComponent } from "@/types/sidebar";
import Link from "next/link";
import { ReactNode } from "react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface AppSidebarProps {
  mainItems: SidebarItemGroup[];
  headerItems?: SidebarItemGroup[];
  footerItems?: SidebarItemGroup[];
}

function isSidebarItem(item: SidebarItemOrComponent): item is SidebarItem {
  return (
    typeof item === "object" && item !== null && "title" in item && "url" in item && "icon" in item
  );
}

export function AppSidebar({ mainItems, headerItems, footerItems }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();

  const renderSidebarSection = (groups: SidebarItemGroup[]) => {
    return groups.map((group, groupIndex) => (
      <SidebarGroup key={group.label || groupIndex}>
        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item: SidebarItemOrComponent, itemIndex) => {
              if (!isSidebarItem(item)) {
                return <div key={itemIndex}>{item as ReactNode}</div>;
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      {item.icon}
                      {item.title}
                      {item.isBeta && (
                        <Badge size="sm" variant="secondary">
                          Beta
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ));
  };

  return (
    <Sidebar>
      {headerItems && headerItems.length > 0 && (
        <SidebarHeader className="bg-stone-150">{renderSidebarSection(headerItems)}</SidebarHeader>
      )}
      <ScrollArea className="h-full">
        <SidebarContent>{renderSidebarSection(mainItems)}</SidebarContent>
      </ScrollArea>
      {footerItems && footerItems.length > 0 && (
        <SidebarFooter className="bg-stone-150">{renderSidebarSection(footerItems)}</SidebarFooter>
      )}
    </Sidebar>
  );
}
