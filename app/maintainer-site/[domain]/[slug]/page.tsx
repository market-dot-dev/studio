import PageService from "@/app/services/PageService";
import renderElement from "@/components/site/page-renderer";
import { JSDOM } from "jsdom";
import { notFound } from "next/navigation";

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

  // Create DOM from HTML content
  const dom = new JSDOM(body);
  const rootElement = dom.window.document.body;
  const elements: Element[] = Array.from(rootElement.children);

  // Render the page using the strongly typed data
  const reactElement = renderElement(elements, 0, data, page, false);

  return <>{reactElement}</>;
}
