"use client";
import {
  Text,
  Flex,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import githubEmbeds from "../site/github-embeds";
import CodeSnippet from "../embedables/code-snippet";

export default function GithubEmbedItem({
  site,
  index,
  rootUrl,
  settings,
}: any) {
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    githubEmbeds[index]
      ?.callback?.({ site, rootUrl, settings })
      .then(({ html, markdown }: { html: string; markdown: string }) => {
        setHtml(html);
        setMarkdown(markdown);
      });
  }, [githubEmbeds[index], settings]);

  return (
    <div className="flex w-full flex-col gap-6">
      <Title className="text-xl font-semibold">GitHub Badge</Title>
      <Flex flexDirection="col" className="w-full gap-12">
        <TabGroup>
          <div className="flex items-center justify-between">
            <TabList variant="solid">
              <Tab>Preview</Tab>
              <Tab>Code</Tab>
            </TabList>
          </div>

          <TabPanels className="lg:py-6">
            <TabPanel>
              <div className="relative w-full overflow-hidden">
                <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-center gap-6 rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex w-full flex-col gap-4">
                <CodeSnippet code={markdown} />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Flex>
    </div>
  );
}
