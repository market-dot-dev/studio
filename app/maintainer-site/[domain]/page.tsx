import PageService from "@/app/services/PageService";
import renderElement from "@/components/site/page-renderer";
import { parseHTML } from "@/utils/dom-adapter";
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

  // Parse HTML and get DOM-compatible elements
  const elements = parseHTML(data.homepage.content);

  // Render the page using the strongly typed data
  const reactElement = renderElement(elements, 0, data, data.homepage, false);

  return <>{reactElement}</>;
}
