import type { ReactElement } from "react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: ReactElement;
  isBeta?: boolean;
  isActive?: boolean;
}

export type SidebarItemGroup = {
  label?: string;
  items: SidebarItem[];
};
