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
import type { SidebarItem, SidebarItemGroup } from "@/types/sidebar";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface AppSidebarProps {
  mainItems: SidebarItemGroup[];
  headerItems?: SidebarItemGroup[];
  footerItems?: SidebarItemGroup[];
}

export function AppSidebar({ mainItems, headerItems, footerItems }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();

  const renderSidebarSection = (groups: SidebarItemGroup[]) => {
    return groups.map((group, groupIndex) => (
      <SidebarGroup key={group.label || groupIndex}>
        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item: SidebarItem) => (
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
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ));
  };

  return (
    <Sidebar>
      {headerItems && headerItems.length > 0 && (
        <SidebarHeader>{renderSidebarSection(headerItems)}</SidebarHeader>
      )}
      <SidebarContent>{renderSidebarSection(mainItems)}</SidebarContent>
      {footerItems && footerItems.length > 0 && (
        <SidebarFooter>{renderSidebarSection(footerItems)}</SidebarFooter>
      )}
    </Sidebar>
  );
}
