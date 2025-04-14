import embedables from "@/components/site/embedables";
import { getSiteData } from "@/lib/fetchers";
import { notFound } from "next/navigation";

export default async function EmbedServe({
  params,
  searchParams
}: {
  params: { domain: string; embed: string };
  searchParams: any;
}) {
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
