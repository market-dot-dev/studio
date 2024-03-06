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
  const [html, setHtml] = useState<string>('');
  
  useEffect(() => {

    githubEmbeds[index]({site, rootUrl}).then(({html, markdown} : {html: string, markdown: string}) => {
      setHtml(html);
      setMarkdown(markdown);
    });

  }, [githubEmbeds[index]])

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
            </TabGroup>
          </Col>
      </Grid>
    </Flex>
  )
}