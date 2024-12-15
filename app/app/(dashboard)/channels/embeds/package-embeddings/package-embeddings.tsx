"use client";

import PageHeading from "@/components/common/page-heading";
import CodeSnippet from "@/components/embedables/code-snippet";
import { Flex, Text, Card, Divider } from "@tremor/react";
import EmbeddingsSettingsDropdown from "./embeddings-settings-dropdown";
import { useState } from "react";

export default function PackageEmbeddings() {
  const [darkMode, setDarkMode] = useState(false);
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col gap-6">
      <Text>Published packages that you can embed into your site.</Text>
      <Flex flexDirection="col" className="w-full gap-12">
        <Card>
          <div className="flex w-full flex-col">
            <div className="flex w-full justify-between">
              <div>
                <PageHeading title="Preview" />
                <Text>A preview of your embedding</Text>
              </div>
              <div>
                <EmbeddingsSettingsDropdown
                  darkMode={darkMode}
                  darkModeCallback={handleDarkMode}
                />
              </div>
            </div>
          </div>
          <Divider />
          <div className="flex w-full flex-col gap-4">
            <div className="w-full">
              <PageHeading title="Code" />
              <Text>The code you need to add to your site</Text>
            </div>
            <CodeSnippet
              code={`<script src="https://embed.site.com/embed.js"></script>`}
            />
          </div>
        </Card>
      </Flex>
    </div>
  );
}
