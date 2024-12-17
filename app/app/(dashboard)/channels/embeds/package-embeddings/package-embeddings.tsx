"use client";

import CodeSnippet from "@/components/embedables/code-snippet";
import {
  Flex,
  Text,
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import EmbeddingsSettingsDropdown from "./embeddings-settings-dropdown";
import { useState } from "react";
import { TierWithFeatures } from "@/app/services/TierService";
import embeddables from "@/components/site/embedables";

export default function PackageEmbeddings({ site }: { site: any }) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);
  const domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const [darkMode, setDarkMode] = useState(false);
  const handleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="flex w-full flex-col gap-6">
      <Text>Published packages that you can embed into your site.</Text>
      <Flex flexDirection="col" className="w-full gap-12">
        <Card>
          <TabGroup>
            <div className="flex items-center justify-between">
              <TabList variant="solid">
                <Tab>Preview</Tab>
                <Tab>Code</Tab>
              </TabList>
              <EmbeddingsSettingsDropdown
                darkMode={darkMode}
                darkModeCallback={handleDarkMode}
                selectedTiers={selectedTiers}
                setSelectedTiers={setSelectedTiers}
              />
            </div>

            <TabPanels>
              <TabPanel>
                <div className="relative w-full overflow-hidden">
                  <embeddables.tiers.preview
                    site={""}
                    settings={{
                      darkmode: darkMode,
                      tiers: selectedTiers.map((tier) => tier.id),
                    }}
                    tiers={selectedTiers}
                    hasActiveFeatures={false}
                  />
                </div>
              </TabPanel>

              <TabPanel>
                <div className="flex w-full flex-col gap-4">
                  <CodeSnippet
                    code={`<script
                      data-domain="${domain}"
                      data-widget="tiers"
                      data-settings='${JSON.stringify(
                        {
                          darkmode: darkMode,
                          tiers: selectedTiers.map((tier) => tier.id),
                        },
                        null,
                        2,
                      )}'
                      src="//${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/embed.js"
                    ></script>`}
                  />
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </Flex>
    </div>
  );
}
