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
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { Badge } from "../ui/badge";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon | ReactElement;
  isBeta?: boolean;
  isActive?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface AppNavProps {
  mainItems: NavGroup[];
  headerItems?: NavGroup[];
  footerItems?: NavGroup[];
}

export function AppNav({ mainItems, headerItems, footerItems }: AppNavProps) {
  const renderNavSection = (groups: NavGroup[]) => {
    return groups.map((group, groupIndex) => (
      <SidebarGroup key={group.label || groupIndex}>
        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <Link href={item.url}>
                    {typeof item.icon === "function" ? <item.icon /> : item.icon}
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
        <SidebarHeader>{renderNavSection(headerItems)}</SidebarHeader>
      )}
      <SidebarContent>{renderNavSection(mainItems)}</SidebarContent>
      {footerItems && footerItems.length > 0 && (
        <SidebarFooter>{renderNavSection(footerItems)}</SidebarFooter>
      )}
    </Sidebar>
  );
}
