import React from 'react';
import { notFound } from "next/navigation";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import { JSDOM } from "jsdom";
import renderElement from '@/components/site/page-renderer';
import Head from 'next/head';


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

  const {homepage, ...site} = data;
  const reactElement = renderElement(rootElement as Element, 0, site, homepage);
  
  return (
    <>
      {reactElement}
    </>
  );
}
