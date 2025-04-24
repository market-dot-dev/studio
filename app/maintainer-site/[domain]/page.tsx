import PageService from "@/app/services/PageService";
import renderElement from "@/components/site/page-renderer";
import { JSDOM } from "jsdom";
import { notFound } from "next/navigation";

export default async function SiteHomePage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await PageService.getHomepage(domain);

  if (!data) {
    notFound();
  }

  // Ensure homepage content exists
  if (!data.homepage?.content) {
    notFound();
  }

  // Create DOM from HTML content
  const dom = new JSDOM(data.homepage.content);
  const rootElement = dom.window.document.body;

  const elements: Element[] = Array.from(rootElement.children);

  // Render the page using the strongly typed data
  const reactElement = renderElement(elements, 0, data, data.homepage, false);

  return <>{reactElement}</>;
}
