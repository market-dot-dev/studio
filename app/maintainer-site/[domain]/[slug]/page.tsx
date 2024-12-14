import React from "react";
import { notFound } from "next/navigation";

import { JSDOM } from "jsdom";
import renderElement from "@/components/site/page-renderer";

import PageService from "@/app/services/PageService";
import FeatureService from "@/app/services/feature-service";

export default async function SitePage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;
  const data = await PageService.getPage(domain, slug);
  const activeFeatures = data?.userId
    ? await FeatureService.findActiveByUser(data.userId)
    : [];

  if (!data) {
    notFound();
  }

  const body = data.pages?.[0]?.content ?? "";

  if (!body) {
    notFound();
  }

  const dom = new JSDOM(body);
  const rootElement = dom.window.document.body;
  const { pages, ...site } = data;
  const elements: Element[] = Array.from(rootElement.children);
  const reactElement = renderElement(
    elements,
    0,
    site,
    pages?.[0],
    false,
    !!activeFeatures?.length,
  );

  return <>{reactElement}</>;
}
