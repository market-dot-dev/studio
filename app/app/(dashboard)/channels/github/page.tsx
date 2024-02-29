import GithubEmbedItem from "@/components/github/github-embed-item";
import { Divider, Flex, Text } from "@tremor/react";
import githubEmbeds from "@/components/site/github-embeds";
import { getSite } from "@/lib/site/fetchers";
import PageHeading from "@/components/common/page-heading";

export default async function EmbedChannel({ params }: { params: { id: string } }) {
    const site = await getSite();
    return (
      <Flex flexDirection="col" alignItems="start" className="gap-6">
        <PageHeading title="Github Embeds" />
        <Text>Embed services in your Github Readme.</Text>
          <Flex flexDirection="col" className="gap-12 w-full">
            {Object.keys(githubEmbeds).map((index) => (
              <div key={index} className='w-full' >
                <GithubEmbedItem index={index} site={site} />
                <Divider/>
              </div>
            ))}
          </Flex>
      </Flex>   
    );
}