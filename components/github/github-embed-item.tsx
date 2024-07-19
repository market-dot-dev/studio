'use client'
import { Title, Flex, Grid, Col } from "@tremor/react";
import { useEffect, useState } from "react";
import githubEmbeds from "../site/github-embeds";
import CodeSnippet from "../embedables/code-snippet";
import DashboardCard from "../common/dashboard-card";


export default function GithubEmbedItem({site, index, rootUrl, hasActiveFeatures} : any) {
    
  const [active, setActive] = useState(0)
  const [markdown, setMarkdown] = useState<string>('');
  const [settings, setSettings] = useState({} as any);
  const [html, setHtml] = useState<string>('');
  
  const Settings = githubEmbeds[index].settings ?? null;
  
  useEffect(() => {

    githubEmbeds[index]?.callback?.({site, rootUrl, settings}).then(({html, markdown} : {html: string, markdown: string}) => {
      setHtml(html);
      setMarkdown(markdown);
    });

  }, [githubEmbeds[index], settings])

  return (
    <Flex flexDirection='col' alignItems="stretch" className='gap-4 grow'>
      <Title>{githubEmbeds[index].name}</Title>
      <Grid numItems={1} className="gap-8">
        <Col numColSpan={1}>
          
            <Flex className="w-full gap-6" alignItems="stretch" justifyContent="start">
              
              <DashboardCard className="w-3/4">
                <Flex flexDirection="col" className="grow gap-6">
                  <div dangerouslySetInnerHTML={{__html: html}} />   
                  <CodeSnippet code={markdown} /> 
                </Flex>                
              </DashboardCard>
                 
              
              { Settings ? 
                <Flex flexDirection="col" alignItems="start" className="gap-4 w-1/4" justifyContent="start">
                  <Title>Embed Configuration</Title>
                  <Settings site={site} settings={settings} setSettings={setSettings} />
                </Flex>
               : null }
            
            </Flex>
          
        </Col>
      </Grid>
    </Flex>
  )
}