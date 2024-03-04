import React from 'react';
import { notFound } from "next/navigation";
import { JSDOM } from "jsdom";
import renderElement from '@/components/site/page-renderer';
import PageService from '@/app/services/PageService';

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {  
  const domain = decodeURIComponent(params.domain);
  const data = await PageService.getHomepage(domain);

  if (!data || !data.homepage?.content) {
    notFound();
  }
  
  const dom = new JSDOM(data.homepage?.content ?? '' )
  const rootElement = dom.window.document.body;

  const {homepage, ...site} = data;
  const elements: Element[] = Array.from(rootElement.children);
  const reactElement = renderElement(elements, 0, site, homepage);
  
  return (
    <>
      {reactElement}
    </>
  );
}
