import { getSite } from "@/lib/site/fetchers";
import PageHeader from "@/components/common/page-header";
import githubEmbeds from "@/components/site/github-embeds";
import GithubEmbedItem from "@/components/github/github-embed-item";
import { getRootUrl } from "@/lib/domain";
import FeatureService from "@/app/services/feature-service";
import PackageEmbeddings from "@/components/embedables/package-embeddings/package-embeddings";

export default async function EmbedChannel() {
  const [site, activeFeatures] = (await Promise.all([
    getSite(),
    FeatureService.findActiveByCurrentUser(),
  ])) as any;

  const rootUrl = getRootUrl(site?.subdomain ?? "app");

  return (
    <div className="flex flex-col items-start w-full gap-8">
      <PageHeader title="Embeds" />
      <div className="flex flex-col gap-10 w-full">
        <PackageEmbeddings site={site} rootUrl={rootUrl} />
        {Object.keys(githubEmbeds).map((index, idx, arr) => (
          <div key={index} className="w-full">
            <GithubEmbedItem
              index={index}
              key={index}
              site={site}
              rootUrl={rootUrl}
              hasActiveFeatures={!!activeFeatures?.length}
            />
            {idx < arr.length - 1 && <hr className="h-px w-full bg-black/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}
