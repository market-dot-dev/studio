'use client'
import { Title, Flex, Grid, Col } from "@tremor/react";
import { useEffect, useState } from "react";
import embedables from "../site/embedables";
import CodeSnippet from "./code-snippet";
import DashboardCard from "../common/dashboard-card";

export default function EmbedItem({site, index} : any) {
    
  const [settings, setSettings] = useState({} as any);
  const domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const Component = embedables[index].preview;
  const Settings = embedables[index].settings;

  const [ previewProps, setPreviewProps ] = useState<any>(null);

  useEffect(() => {
    if (embedables[index].previewProps) {
      embedables[index].previewProps(site).then((props: any) => {
        setPreviewProps(props);
      })
    }
  }, []);

  return (
    <Flex flexDirection='col' alignItems="stretch" className='gap-4'>
      <Title className="mt-6">{embedables[index].name}</Title>
      <Grid numItems={1} className="gap-8">
        
        <Col numColSpan={1}>

          <Flex className="w-full gap-6" alignItems="stretch" justifyContent="start">
              
            <DashboardCard className="w-3/4">
              <Flex flexDirection="col" className="grow gap-6">
                  
                { previewProps ? <Component site={site} settings={settings} {...previewProps} /> : null }
              
                <CodeSnippet code={`<script 
  data-domain='${domain}' 
  data-widget='${index}'
  `
    + (Object.keys(settings)?.length ? `data-settings='${JSON.stringify(settings, null, 6)}'` : '')
    + ` src='//${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/embed.js'></script>`} 
                  />
                </Flex>  
            </DashboardCard>
            <Flex flexDirection="col" alignItems="start" className="gap-4 w-1/4" justifyContent="start">
                <Title>Embed Configuration</Title>
                { previewProps ? <Settings settings={settings} setSettings={setSettings} {...previewProps} /> : null }
            </Flex>
          </Flex>
        </Col>
      </Grid>
    </Flex>
  )
}