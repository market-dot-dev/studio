import { Divider, Flex, Text } from "@tremor/react";
import { getSite } from "@/lib/site/fetchers";
import { Code2, Spline } from "lucide-react";
import PageHeading from "@/components/common/page-heading";
import Tabs from "@/components/common/tabs";
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
      <PackageEmbeddings site={site} />
      {Object.keys(githubEmbeds).map((index) => (
        <div key={index} className="w-full">
          <GithubEmbedItem
            index={index}
            site={site}
            rootUrl={rootUrl}
            hasActiveFeatures={!!activeFeatures?.length}
          />
          <Divider />
        </div>
      ))}
    </Flex>
  );
}
