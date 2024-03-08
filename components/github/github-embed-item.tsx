'use client'
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Title, Flex, Grid, Col } from "@tremor/react";
import { EyeOpenIcon, CodeIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import githubEmbeds from "../site/github-embeds";
import CodeSnippet from "../embedables/code-snippet";
import DashboardCard from "../common/dashboard-card";


export default function GithubEmbedItem({site, index, rootUrl} : any) {
    
  const [active, setActive] = useState(0)
  const [markdown, setMarkdown] = useState<string>('');
  const [settings, setSettings] = useState({} as any);
  const [html, setHtml] = useState<string>('');
  
  const Settings = githubEmbeds[index].settings;
  
  useEffect(() => {

    githubEmbeds[index]?.callback?.({site, rootUrl, settings}).then(({html, markdown} : {html: string, markdown: string}) => {
      setHtml(html);
      setMarkdown(markdown);
    });

  }, [githubEmbeds[index], settings])

  return (
    <Flex flexDirection='col' alignItems="stretch" className='gap-4'>
      <Title>{githubEmbeds[index].name}</Title>
      <Grid numItems={1} className="gap-8">
        <Col numColSpan={1}>
          <TabGroup defaultIndex={active} onIndexChange={(index) => setActive(index)}>
            <TabList variant="solid" className="font-bold">
              <Tab icon={EyeOpenIcon} className={ active === 0 ? 'bg-white' : ''}>Preview</Tab>
              <Tab icon={CodeIcon} className={ active === 1 ? 'bg-white' : ''}>Code</Tab>
            </TabList>
            <Flex className="w-full gap-4" alignItems="stretch">
              <div className="grow">
                <TabPanels>
                  <TabPanel>
                    <DashboardCard>
                      <div dangerouslySetInnerHTML={{__html: html}} />                    
                    </DashboardCard>
                  </TabPanel>
                  <TabPanel>
                    <DashboardCard>
                      <CodeSnippet code={markdown} />
                    </DashboardCard>
                  </TabPanel>
                </TabPanels>
              </div>
              <div style={{width: '200px'}} >
                <Flex flexDirection="col" alignItems="start" className="gap-4">
                  <Title>Settings</Title>
                  <Settings site={site} settings={settings} setSettings={setSettings} />
                </Flex>
              </div>
            </Flex>
          </TabGroup>
        </Col>
      </Grid>
    </Flex>
  )
}