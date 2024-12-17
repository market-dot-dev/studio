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
import Tiers from "@/components/site/embedables/tiers/tiers";

export default function PackageEmbeddings() {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const handleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="flex flex-col gap-6">
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
              </TabPanel>

              <TabPanel>
                <div className="flex w-full flex-col gap-4">
                  {/* <CodeSnippet
                    code={
                      `<script 
                        data-domain='${domain}' 
                        data-widget='${index}'
                        ` +
                      (Object.keys(settings)?.length
                        ? `data-settings='${JSON.stringify(settings, null, 6)}'`
                        : "") +
                      ` src='//${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/embed.js'></script>`
                    }
                  /> */}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </Flex>
    </div>
  );
}
