"use client";

import CodeSnippet from "@/components/embedables/code-snippet";
import {
  Flex,
  Text,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Title,
} from "@tremor/react";
import EmbeddingsSettingsDropdown from "./embeddings-settings-dropdown";
import { useState, useEffect } from "react";
import { TierWithFeatures } from "@/app/services/TierService";
import embeddables from "@/components/site/embedables";
import GithubEmbedItem from "@/components/github/github-embed-item";
import githubEmbeds from "@/components/site/github-embeds";

export default function PackageEmbeddings({
  site,
  rootUrl,
}: {
  site: any;
  rootUrl: string;
}) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);
  const [useSVG, setUseSVG] = useState(false);
  const domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const [darkmode, setDarkmode] = useState(false);
  const handleDarkMode = () => setDarkmode(!darkmode);

  const tiers = selectedTiers.length
    ? "tiers=" + selectedTiers.map((tier) => tier.id).join(",")
    : null;

  const queryParams = [tiers, `darkmode=${darkmode}`].filter(Boolean).join("&");

  useEffect(() => {
    // image prefetching ... although this does not explicitly set the image src, it does prefetch the image so subsequent requests are cached and network calls arent made
    const img = new Image();
    img.src = `/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}`;
  }, [queryParams]);

  const svgCode = `<a href="${rootUrl}" target="_blank">
                      <img
                        src="/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}"
                      />
                    </a>`;

  return (
    <div className="flex w-full flex-col gap-3">
      <Title className="text-xl font-semibold">Packages</Title>
      <Flex flexDirection="col" className="w-full gap-12">
        <TabGroup>
          <div className="flex items-center justify-between">
            <TabList variant="solid">
              <Tab>Preview</Tab>
              <Tab>Code</Tab>
            </TabList>
            <EmbeddingsSettingsDropdown
              darkMode={darkmode}
              darkModeCallback={handleDarkMode}
              selectedTiers={selectedTiers}
              setSelectedTiers={setSelectedTiers}
              useSVG={useSVG}
              setUseSVG={setUseSVG}
            />
          </div>

          <TabPanels className="lg:py-6">
            <TabPanel>
              <div className="relative w-full overflow-hidden">
                {useSVG ? (
                  <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-center gap-6 rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8">
                    <a href={rootUrl} target="_blank">
                      <img
                        src={`/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}`}
                      />
                    </a>
                  </div>
                ) : (
                  <embeddables.tiers.preview
                    site={""}
                    settings={{
                      darkmode: darkmode,
                      tiers: selectedTiers.map((tier) => tier.id),
                    }}
                    tiers={selectedTiers}
                    hasActiveFeatures={false}
                  />
                )}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex w-full flex-col gap-4">
                {useSVG ? (
                  <CodeSnippet code={svgCode} />
                ) : (
                  <CodeSnippet
                    code={`<script
                      data-domain="${domain}"
                      data-widget="tiers"
                      data-settings='${JSON.stringify(
                        {
                          darkmode: darkmode,
                          tiers: selectedTiers.map((tier) => tier.id),
                        },
                        null,
                        2,
                      )}'
                      src="//${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/embed.js"
                    ></script>`}
                  />
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Flex>
    </div>
  );
}
