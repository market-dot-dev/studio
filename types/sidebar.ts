import type { ReactElement, ReactNode } from "react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: ReactElement;
  isBeta?: boolean;
  isActive?: boolean;
}

export type SidebarItemOrComponent = SidebarItem | ReactNode;

export type SidebarItemGroup = {
  label?: string;
  items: SidebarItemOrComponent[];
};
