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
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { ReactElement } from "react";
import { Badge } from "../ui/badge";

export interface SidebarItem {
  title: string;
  url: string;
  icon: ReactElement;
  isBeta?: boolean;
  isActive?: boolean;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

interface AppSidebarProps {
  mainItems: SidebarGroup[];
  headerItems?: SidebarGroup[];
  footerItems?: SidebarGroup[];
}

export function AppSidebar({ mainItems, headerItems, footerItems }: AppSidebarProps) {
  const renderSidebarSection = (groups: SidebarGroup[]) => {
    return groups.map((group, groupIndex) => (
      <SidebarGroup key={group.label || groupIndex}>
        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <Link href={item.url}>
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
