import { getHomepage } from "@/app/services/site/page-service";
import renderElement from "@/components/site/page-renderer";
import { parseHTML } from "@/utils/dom-adapter";
import { notFound } from "next/navigation";

export default async function SiteHomePage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const { site, page } = await getHomepage(domain);

  if (!site || !page || !page.content) {
    notFound();
  }

  // Parse HTML and get DOM-compatible elements
  const elements = parseHTML(page.content);

  // Render the page using the strongly typed data
  const reactElement = renderElement(elements, 0, site, page, false);

  return <>{reactElement}</>;
}
