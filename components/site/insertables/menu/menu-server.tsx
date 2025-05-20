import { getSiteNav } from "@/app/services/site-nav-service";
import type { InsertableComponentProps } from "..";
import Menu from "./menu";

export default async function MenuServer({ site, page }: InsertableComponentProps) {
  const nav = await getSiteNav(site?.id);
  return Array.isArray(nav) ? <Menu site={site} page={page} nav={nav} /> : <></>;
}
