'use client'
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Title, Flex, Grid, Col } from "@tremor/react";
import { EyeOpenIcon, CodeIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import embedables from "../site/embedables";
import CodeSnippet from "./code-snippet";
import DashboardCard from "../common/dashboard-card";

export default function EmbedItem({site, index} : any) {
    
  const [active, setActive] = useState(0)
  const [settings, setSettings] = useState({} as any);
  const domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const Component = embedables[index].preview;
  const Settings = embedables[index].settings;

  return (
    <Flex flexDirection='col' alignItems="stretch" className='gap-4'>
      <Title>{embedables[index].name}</Title>
      <Grid numItems={1} className="gap-8">
        
        <Col numColSpan={1}>

          <TabGroup defaultIndex={active} onIndexChange={(index) => setActive(index)}>
            <TabList variant="solid" className="font-bold">
              <Tab icon={EyeOpenIcon} className={ active === 0 ? 'bg-white' : ''}>Preview</Tab>
              <Tab icon={CodeIcon} className={ active === 1 ? 'bg-white' : ''}>Code</Tab>
              
            </TabList>
            <Settings settings={settings} setSettings={setSettings} />
            <TabPanels>
              <TabPanel>
                <DashboardCard>
                  <Component site={site} settings={settings} />
                </DashboardCard>
              </TabPanel>
              <TabPanel>
                <DashboardCard>
                  <CodeSnippet code={`<script data-domain='${domain}' data-widget='${index}' data-settings='${JSON.stringify(settings)}' src='//${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/embed.js'></script>`} />
                </DashboardCard>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Col>
      </Grid>
    </Flex>
  )
}