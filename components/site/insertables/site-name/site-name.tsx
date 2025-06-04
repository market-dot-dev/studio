"use client";
import type { InsertableComponentProps } from "..";

export default function SiteName({ site, page }: InsertableComponentProps) {
  return <>{site?.organization.name ?? "Lorem ipsum"}</>;
}
