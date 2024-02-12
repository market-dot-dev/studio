import React from 'react';
import { notFound } from "next/navigation";
import { findPage } from '@/app/services/PageService';
import { JSDOM } from "jsdom";
import renderElement from '@/components/site/page-renderer';
import Head from 'next/head';

export default async function SitePage({
  params,
}: {
  params: { domain: string, slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await findPage(domain, params.slug);
  
  if (!data) {
    notFound();
  }
  
  const body = data.pages?.[0]?.content ?? '';

  if (!body) {
    notFound();
  }

  const dom = new JSDOM(body)
  const rootElement = dom.window.document.body;
  const {pages, ...site} = data;
  const elements: Element[] = Array.from(rootElement.children);
  const reactElement = renderElement(elements, 0, site, pages?.[0]);
  
  return (
    <>
      {reactElement}
    </>
  );
}
