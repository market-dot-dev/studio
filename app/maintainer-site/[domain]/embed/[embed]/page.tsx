import embedables from "@/components/site/embedables";
import { getSiteData } from "@/lib/fetchers";
import { notFound } from "next/navigation";

export default async function EmbedServe({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string; embed: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const param = await params;
  const searchParam = await searchParams;

  if (!embedables[param.embed] || !param.domain) {
    notFound();
  }

  const site = await getSiteData(decodeURIComponent(param.domain));

  const Component = embedables[param.embed].element;

  return (
    <>
      <Component site={site} searchParams={searchParam} />
    </>
  );
}
