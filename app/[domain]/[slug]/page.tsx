import React from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSitePage } from "@/lib/fetchers";
import { JSDOM } from "jsdom";
import renderElement from '@/components/site/page-renderer';


export default async function SitePage({
  params,
}: {
  params: { domain: string, slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSitePage(domain, params.slug);
  
  if (!data) {
    notFound();
  }
  
  const dom = new JSDOM(data.pages?.[0]?.content ?? '' )
  const rootElement = dom.window.document.body.firstChild;
  const {pages, ...site} = data;
  const reactElement = renderElement(rootElement as Element, 0, site, pages?.[0]);
  
  return (
    <>
      {reactElement}
    </>
  );
}
