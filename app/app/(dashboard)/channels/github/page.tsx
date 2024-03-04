import GithubEmbedItem from "@/components/github/github-embed-item";
import { Divider, Flex, Text } from "@tremor/react";
import githubEmbeds from "@/components/site/github-embeds";
import { getSite } from "@/lib/site/fetchers";
import PageHeading from "@/components/common/page-heading";
import { getRootUrl } from "@/app/services/domain-service";
export default async function EmbedChannel({ params }: { params: { id: string } }) {
    const site = await getSite() as any;
    const rootUrl = getRootUrl(site?.subdomain ?? 'app');
    return (
      <Flex flexDirection="col" alignItems="start" className="gap-6">
        <PageHeading title="Github Embeds" />
        <Text>Embed services in your Github Readme.</Text>
          <Flex flexDirection="col" className="gap-12 w-full">
            {Object.keys(githubEmbeds).map((index) => (
              <div key={index} className='w-full' >
                <GithubEmbedItem index={index} site={site} rootUrl={rootUrl} />
                <Divider/>
              </div>
            ))}
          </Flex>
      </Flex>   
    );
}