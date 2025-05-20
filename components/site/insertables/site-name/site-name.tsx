"use client";
import type { InsertableComponentProps } from "..";

export default function SiteName({ site, page }: InsertableComponentProps) {
  return <>{site.organization.projectName ?? "Lorem ipsum"}</>;
}
