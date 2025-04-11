import { getSite } from "@/lib/site/fetchers";
import PageHeader from "@/components/common/page-header";
import { getRootUrl } from "@/lib/domain";
import FeatureService from "@/app/services/feature-service";
import { PackageEmbeddings } from "@/components/embedables/package-embeddings/package-embeddings";

export default async function EmbedChannel() {
  const [site, activeFeatures] = (await Promise.all([
    getSite(),
    FeatureService.findActiveByCurrentUser(),
  ])) as any;

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
