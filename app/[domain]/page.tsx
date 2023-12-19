import React from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import { JSDOM } from "jsdom";
import renderElement from '@/components/site/page-renderer';


// export async function generateStaticParams() {
//   const allSites = await prisma.site.findMany({
//     select: {
//       subdomain: true,
//       customDomain: true,
//     },
//     // feel free to remove this filter if you want to generate paths for all sites
//     where: {
//       subdomain: "demo",
//     },
//   });

//   const allPaths = allSites
//     .flatMap(({ subdomain, customDomain }) => [
//       subdomain && {
//         domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//       },
//       customDomain && {
//         domain: customDomain,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }



export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  // const [data, posts] = await Promise.all([
  //   getSiteData(domain),
  //   getPostsForSite(domain),
  // ]);

  

  if (!data) {
    notFound();
  }
  
  const dom = new JSDOM(data.homepage?.content ?? '' )
  const rootElement = dom.window.document.body.firstChild;
  const reactElement = renderElement(rootElement as Element, 0);
  
  return (
    <>
      {reactElement}
    </>
  );
}
