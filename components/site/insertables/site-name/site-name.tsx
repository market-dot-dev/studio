"use client";
export default function SiteName({ site }: { site: any; page: any }) {
  return <>{site?.user?.projectName ?? "Lorem ipsum"}</>;
}
