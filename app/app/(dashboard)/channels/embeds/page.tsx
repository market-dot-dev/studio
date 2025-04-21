import PageHeader from "@/components/common/page-header";
import { PackageEmbeddings } from "@/components/embedables/package-embeddings/package-embeddings";
import { getRootUrl } from "@/lib/domain";
import { getSiteMeta } from "@/lib/site/fetchers";

export default async function EmbedChannel() {
  const site = await getSiteMeta();
  const rootUrl = getRootUrl(site?.subdomain ?? "app");

  return (
    <div className="flex w-full flex-col items-start gap-8">
      <PageHeader title="Embeds" />
      <div className="flex w-full flex-col gap-10">
        <PackageEmbeddings site={site} rootUrl={rootUrl} />
      </div>
    </div>
  );
}
