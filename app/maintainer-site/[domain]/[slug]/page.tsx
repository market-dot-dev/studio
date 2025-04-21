import { notFound } from "next/navigation";

import renderElement from "@/components/site/page-renderer";
import { JSDOM } from "jsdom";

import PageService from "@/app/services/PageService";

// @TODO: These typings should be universal for all "maintainer-site" pages
// Define types matching the ones we created for renderElement
interface Site {
  userId?: string;
  user?: {
    projectDescription?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Page {
  content?: string;
  [key: string]: any;
}

export default async function SitePage(props: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await PageService.getPage(domain, params.slug);

  if (!data) {
    notFound();
  }

  const page = data.pages?.[0];
  const body = page?.content ?? "";

  if (!body) {
    notFound();
  }

  // Extract site data, removing pages property
  const { pages, ...siteData } = data;

  // Create DOM from HTML content
  const dom = new JSDOM(body);
  const rootElement = dom.window.document.body;
  const elements: Element[] = Array.from(rootElement.children);

  // Render the page with properly typed data
  const reactElement = renderElement(elements, 0, siteData as Site, page as Page, false);

  return <>{reactElement}</>;
}
