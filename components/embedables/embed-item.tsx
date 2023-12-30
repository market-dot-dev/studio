'use client'
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels, Title, Flex } from "@tremor/react";
import { EyeOpenIcon, CodeIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import embedables from "../site/embedables";
import CodeSnippet from "./code-snippet";

export default function EmbedItem({site, index} : any) {
    
  const [active, setActive] = useState(0)
  const domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const Component = embedables[index].preview;

  return (
    <Flex flexDirection='col' alignItems="start" className='gap-4'>
      <Title>{embedables[index].name}</Title>
      <TabGroup defaultIndex={active} onIndexChange={(index) => setActive(index)}>
        <TabList variant="solid" className="font-bold">
          <Tab icon={EyeOpenIcon} className={ active === 0 ? 'bg-white' : ''}>Preview</Tab>
          <Tab icon={CodeIcon} className={ active === 1 ? 'bg-white' : ''}>Code</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card>
              <Component site={site} />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CodeSnippet code={`<script data-domain="${domain}" data-widget="${index}" src="http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/embed.js"></script>`} />
            </Card>
            </TabPanel>
        </TabPanels>
      </TabGroup>
    </Flex>
  )
}