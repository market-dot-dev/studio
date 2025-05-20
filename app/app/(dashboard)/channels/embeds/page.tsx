import { getCurrentSite } from "@/app/services/site-crud-service";
import PageHeader from "@/components/common/page-header";
import { PackageEmbeddings } from "@/components/embedables/package-embeddings/package-embeddings";
import { getRootUrl } from "@/lib/domain";

export default async function EmbedChannel() {
  const site = await getCurrentSite();
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
