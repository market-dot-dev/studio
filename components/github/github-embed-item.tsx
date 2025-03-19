"use client";

import { useEffect, useState } from "react";
import githubEmbeds from "../site/github-embeds";
import CodeSnippet from "../embedables/code-snippet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DashedCard from "@/components/common/dashed-card";

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
    <div className="flex w-full flex-col gap-3">
      <Tabs defaultValue="preview">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-bold">Badge</h2>
          <TabsList variant="background">
            <TabsTrigger variant="background" value="preview">Preview</TabsTrigger>
            <TabsTrigger variant="background" value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="mt-4">
          <div className="relative w-full overflow-hidden">
            <DashedCard>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </DashedCard>
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <div className="flex w-full flex-col gap-4">
            <CodeSnippet code={markdown} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
