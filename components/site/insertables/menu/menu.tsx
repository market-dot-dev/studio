"use client";

import { Flex } from "@tremor/react";
import { getRootUrl } from "@/lib/domain";
export default function Menu({
  site,
  page,
  nav,
}: {
  site: any;
  page: any;
  nav: any[];
}) {
  const url = getRootUrl(
    site.subdomain ?? "app",
    page.id === site.homepageId ? "" : `/${page.slug}`,
  );

  return (
    <Flex justifyContent="start" className="gap-4">
      {nav.map((page: any, index: number) => (
        <span key={index}>
          <a href={url} className="p-4 text-blue-800">
            {page.title}
          </a>
        </span>
      ))}
    </Flex>
  );
}
