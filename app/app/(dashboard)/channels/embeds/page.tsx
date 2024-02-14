import EmbedItem from "@/components/embedables/embed-item";
import { Divider, Flex, Text } from "@tremor/react";
import embedables from "@/components/site/embedables/";
import { getSite } from "@/lib/site/fetchers";
import Page from "../../page/[id]/page";
import PageHeading from "@/components/common/page-heading";

export default async function EmbedChannel({ params }: { params: { id: string } }) {
    const site = await getSite();
    return (
      <Flex flexDirection="col" alignItems="start" className="gap-6">
        <PageHeading title="Embeds" />
        <Text>Embed services onto another webpage.</Text>
          <Flex flexDirection="col" className="gap-12 w-full">
            {Object.keys(embedables).map((index) => (
              <div key={index} className='w-full' >
                <EmbedItem index={index} site={site} />
                <Divider/>
              </div>
            ))}
          </Flex>
      </Flex>   
    );
}