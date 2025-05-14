import PageService from "@/app/services/PageService";
import renderElement from "@/components/site/page-renderer";
import { parseHTML } from "@/utils/dom-adapter";
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

  // Parse HTML and get DOM-compatible elements
  const elements = parseHTML(body);

  // Render the page using the strongly typed data
  const reactElement = renderElement(elements, 0, data, page, false);

  return <>{reactElement}</>;
}
