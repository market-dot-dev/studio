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
    <Flex flexDirection="col" alignItems="start" className="gap-6">
      <PageHeading title="Embeds" />

      <Tabs
        tabs={[
          {
            title: (
              <div className="flex items-center gap-2">
                <Code2 size={18} /> <span>Packages</span>
              </div>
            ),
            content: <PackageEmbeddings />,
          },
          {
            title: (
              <div className="flex items-center gap-2">
                <Spline size={18} /> <span>Generic</span>
              </div>
            ),
            content: (
              <div>
                <Flex flexDirection="col" alignItems="start" className="gap-6">
                  <Text>Embed services in your Github Readme.</Text>
                  <Flex flexDirection="col" className="w-full gap-12">
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
                </Flex>
              </div>
            ),
          },
        ]}
      />

      {/* <Tabs tabs = {
          [
            {
              title: (<div className="flex gap-2 items-center"><Code2 size={18} /> <span>HTML</span></div>), 
              content: (<>
                <Text>Embed services onto another webpage.</Text>
                <Flex flexDirection="col" className="gap-12 w-full">
                  {Object.keys(embedables).map((index) => (
                    <div key={index} className='w-full' >
                      <EmbedItem index={index} site={site} hasActiveFeatures={!!activeFeatures?.length} />
                      <Divider/>
                    </div>
                  ))}
                </Flex>
                </>)

            },
            {
                title: (<div className="flex gap-2 items-center"><Spline size={18} /> <span>SVG</span></div>),
                content: (<div><Flex flexDirection="col" alignItems="start" className="gap-6">
                  <Text>Embed services in your Github Readme.</Text>
                    <Flex flexDirection="col" className="gap-12 w-full">
                      {Object.keys(githubEmbeds).map((index) => (
                        <div key={index} className='w-full' >
                          <GithubEmbedItem index={index} site={site} rootUrl={rootUrl} hasActiveFeatures={!!activeFeatures?.length} />
                          <Divider/>
                        </div>
                      ))}
                    </Flex>
                </Flex>   </div>)
            },
          ]
        } /> */}
    </Flex>
  );
}
