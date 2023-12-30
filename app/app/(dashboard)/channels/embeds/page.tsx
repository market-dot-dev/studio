import EmbedItem from "@/components/embedables/embed-item";
import { Flex } from "@tremor/react";
import embedables from "@/components/site/embedables/";
import { getSite } from "@/lib/site/fetchers";

export default async function EmbedChannel({ params }: { params: { id: string } }) {
    const site = await getSite();
    return (
      <Flex flexDirection="col" alignItems="start" className="gap-6">
          <h1 className="font-cal text-3xl font-bold dark:text-white">Embeds</h1>
          <h2>Embed services onto another webpage.</h2>
          <Flex flexDirection="col" className="gap-12">
            {Object.keys(embedables).map((index) => (
              <EmbedItem key={index} index={index} site={site} />
            ))}
          </Flex>
      </Flex>   
    );
}