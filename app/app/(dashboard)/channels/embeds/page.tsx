import { Divider, Flex } from "@tremor/react";
import { getSite } from "@/lib/site/fetchers";
import PageHeading from "@/components/common/page-heading";
import githubEmbeds from "@/components/site/github-embeds";
import GithubEmbedItem from "@/components/github/github-embed-item";
import { getRootUrl } from "@/app/services/domain-service";
import FeatureService from "@/app/services/feature-service";
import PackageEmbeddings from "./package-embeddings/package-embeddings";

export default async function EmbedChannel({
  params,
}: {
  params: { id: string };
}) {
  const [site, activeFeatures] = (await Promise.all([
    getSite(),
    FeatureService.findActiveByCurrentUser(),
  ])) as any;

  const rootUrl = getRootUrl(site?.subdomain ?? "app");
  return (
    <Flex flexDirection="col" alignItems="start" className="w-full gap-6">
      <PageHeading title="Embeds" />
      <div className="flex w-full flex-col gap-6 p-4">
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
            {idx < arr.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </Flex>
  );
}
