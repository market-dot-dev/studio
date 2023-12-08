import React from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSitePage } from "@/lib/fetchers";
import { JSDOM } from "jsdom";
import renderElement from '@/components/site/page-renderer';


export default async function SiteHomePage({
  params,
}: {
  params: { domain: string, slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSitePage(domain, params.slug);
  
  if (!data) {
    notFound();
  }
  
  const dom = new JSDOM(data.page?.content ?? '' )
  const rootElement = dom.window.document.body.firstChild;
  const reactElement = renderElement(rootElement as Element, 0);
  
  return (
    <>
      {reactElement}
    </>
  );
}
