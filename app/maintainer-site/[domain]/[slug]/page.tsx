import { notFound } from "next/navigation";

import renderElement from "@/components/site/page-renderer";
import { JSDOM } from "jsdom";

import PageService from "@/app/services/PageService";
import FeatureService from "@/app/services/feature-service";

export default async function SitePage(props: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await PageService.getPage(domain, params.slug);
  const activeFeatures = data?.userId ? await FeatureService.findActiveByUser(data.userId) : [];

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
    !!activeFeatures?.length
  );

  return <>{reactElement}</>;
}
