"use client";

import CodeSnippet from "@/components/embedables/code-snippet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tremor-tabs";
import EmbeddingsSettingsDropdown from "./embeddings-settings-dropdown";
import { useState, useEffect } from "react";
import { TierWithFeatures } from "@/app/services/TierService";
import embeddables from "@/components/site/embedables/index";
import DashedCard from "@/components/common/dashed-card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function PackageEmbeddings({
  site,
  rootUrl,
}: {
  site: any;
  rootUrl: string;
}) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);
  const [useSVG, setUseSVG] = useState(false);
  const domain = `${process.env.VERCEL_ENV === "production" ? "https://" : ""}${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
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
      <h2 className="text-xl font-bold">Restore Onboarding State</h2>
      <div className="flex w-full flex-col gap-12">
        <Tabs defaultValue="preview" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList variant="solid">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              {selectedTiers.length > 0 ? (
                <TabsTrigger value="code">Code</TabsTrigger>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-default">
                      <TabsTrigger value="code" disabled>
                        Code
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Select packages in settings first
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </TabsList>
            <EmbeddingsSettingsDropdown
              darkMode={darkmode}
              darkModeCallback={handleDarkMode}
              selectedTiers={selectedTiers}
              setSelectedTiers={setSelectedTiers}
              useSVG={useSVG}
              setUseSVG={setUseSVG}
            />
          </div>

          <div className="w-full py-8">
            <TabsContent value="preview" className="w-full">
              <div className="relative w-full overflow-hidden">
                <DashedCard>
                  {useSVG ? (
                    <a href={rootUrl} target="_blank">
                      <img
                        src={`/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}`}
                      />
                    </a>
                  ) : embeddables?.tiers?.preview ? (
                    <embeddables.tiers.preview
                      site={site}
                      settings={{
                        darkmode: darkmode,
                        tiers: selectedTiers.map((tier) => tier.id),
                      }}
                      tiers={selectedTiers}
                      hasActiveFeatures={false}
                    />
                  ) : (
                    <div>Preview component not available</div>
                  )}
                </DashedCard>
              </div>
            </TabsContent>

            <TabsContent value="code">
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
                          darkMode: darkmode,
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
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
