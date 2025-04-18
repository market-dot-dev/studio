import PageService from "@/app/services/PageService";
import FeatureService from "@/app/services/feature-service";
import renderElement from "@/components/site/page-renderer";
import { JSDOM } from "jsdom";
import { notFound } from "next/navigation";

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

export default async function SiteHomePage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await PageService.getHomepage(domain);

  if (!data) {
    notFound();
  }

  const userId = data.userId;
  const activeFeatures = userId ? await FeatureService.findActiveByUser(userId) : [];
  const hasActiveFeatures = Array.isArray(activeFeatures) && activeFeatures.length > 0;

  // Ensure homepage content exists
  if (!data.homepage?.content) {
    notFound();
  }

  // Create DOM from HTML content
  const dom = new JSDOM(data.homepage.content);
  const rootElement = dom.window.document.body;

  // Extract site data, removing homepage property
  const { homepage, ...siteData } = data;

  const elements: Element[] = Array.from(rootElement.children);

  // Render the page with properly typed data
  const reactElement = renderElement(
    elements,
    0,
    siteData as Site,
    homepage as Page,
    false,
    hasActiveFeatures
  );

  return <>{reactElement}</>;
}
