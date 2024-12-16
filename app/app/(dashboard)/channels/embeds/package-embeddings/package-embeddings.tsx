"use client";

import PageHeading from "@/components/common/page-heading";
import CodeSnippet from "@/components/embedables/code-snippet";
import { Flex, Text, Card, Divider } from "@tremor/react";
import EmbeddingsSettingsDropdown from "./embeddings-settings-dropdown";
import { useState } from "react";
import { TierWithFeatures } from "@/app/services/TierService";
import Tiers from "@/components/site/embedables/tiers/tiers";

export default function PackageEmbeddings() {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col gap-6">
      <Text>Published packages that you can embed into your site.</Text>
      <Flex flexDirection="col" className="w-full gap-12">
        <Card>
          <div className="flex w-full flex-col gap-6">
            <div className="relative z-0 flex w-full flex-col">
              <div className="flex w-full justify-between">
                <div>
                  <PageHeading title="Preview" />
                  <Text>A preview of your embedding</Text>
                </div>
                <div>
                  <EmbeddingsSettingsDropdown
                    darkMode={darkMode}
                    darkModeCallback={handleDarkMode}
                    selectedTiers={selectedTiers}
                    setSelectedTiers={setSelectedTiers}
                  />
                </div>
              </div>

              <div className="relative w-full overflow-hidden">
                <Tiers
                  tiers={selectedTiers}
                  subdomain={""}
                  settings={{
                    darkmode: darkMode,
                    tiers: selectedTiers.map((tier) => tier.id),
                  }}
                  hasActiveFeatures={false}
                />
              </div>
            </div>

            <Divider className="relative z-10" />

            <div className="relative z-10 flex w-full flex-col gap-4">
              <div className="w-full">
                <PageHeading title="Code" />
                <Text>The code you need to add to your site</Text>
              </div>
              <CodeSnippet
                code={`<script src="https://embed.site.com/embed.js"></script>`}
              />
            </div>
          </div>
        </Card>
      </Flex>
    </div>
  );
}
