import embedables from "@/components/site/embedables";
import { getSiteData } from "@/lib/fetchers";
import { notFound } from "next/navigation";

export default async function EmbedServe(props: {
  params: Promise<{ domain: string; embed: string }>;
  searchParams: Promise<any>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!embedables[params.embed] || !params.domain) {
    notFound();
  }

  const site = await getSiteData(decodeURIComponent(params.domain));

  const Component = embedables[params.embed].element;

  return (
    <>
      <Component site={site} searchParams={searchParams} />
    </>
  );
}
