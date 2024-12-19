"use client";
import { Flex, TabPanel, TabPanels, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import githubEmbeds from "../site/github-embeds";
import CodeSnippet from "../embedables/code-snippet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tremor-tabs";

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
      <Title className="text-xl font-semibold">Badge</Title>
      <Flex flexDirection="col" className="w-full gap-12">
        <Tabs defaultValue="preview" className="w-full border-none">
          <div className="flex items-center justify-between">
            <TabsList variant="solid">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>

          <div className="lg:py-8">
            <TabsContent value="preview">
              <div className="relative w-full overflow-hidden">
                <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-center gap-6 rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code">
              <div className="flex w-full flex-col gap-4">
                <CodeSnippet code={markdown} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Flex>
    </div>
  );
}
