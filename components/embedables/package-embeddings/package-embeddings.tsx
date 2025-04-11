"use client";

import CodeSnippet from "@/components/embedables/code-snippet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function PackageEmbeddings({
  site,
  rootUrl,
  searchParams,
}: {
  site: any;
  rootUrl?: string;
  searchParams?: any;
}) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);
  const [useSVG, setUseSVG] = useState(false);
  const domain = `${process.env.VERCEL_ENV === "production" ? "https://" : ""}${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const initialDarkmode = searchParams?.darkmode === "true" || false;
  const [darkmode, setDarkmode] = useState(initialDarkmode);
  const handleDarkMode = () => setDarkmode(!darkmode);

  const finalRootUrl =
    rootUrl ||
    `https://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const tiers = selectedTiers.length
    ? "tiers=" + selectedTiers.map((tier) => tier.id).join(",")
    : null;

  const queryParams = [tiers, `darkmode=${darkmode}`].filter(Boolean).join("&");

  useEffect(() => {
    // image prefetching ... although this does not explicitly set the image src, it does prefetch the image so subsequent requests are cached and network calls arent made
    const img = new Image();
    img.src = `/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}`;
  }, [queryParams]);

  const svgCode = `<a href="${finalRootUrl}" target="_blank">
                      <img
                        src="/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}"
                      />
                    </a>`;

  return (
    <div className="flex w-full flex-col gap-3">
      <Tabs defaultValue="preview">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Packages</h2>
          <div className="flex items-center gap-4">
            <EmbeddingsSettingsDropdown
              darkMode={darkmode}
              darkModeCallback={handleDarkMode}
              selectedTiers={selectedTiers}
              setSelectedTiers={setSelectedTiers}
              useSVG={useSVG}
              setUseSVG={setUseSVG}
            />
            <TabsList variant="background">
              <TabsTrigger variant="background" value="preview">
                Preview
              </TabsTrigger>
              {selectedTiers.length > 0 ? (
                <TabsTrigger variant="background" value="code">
                  Code
                </TabsTrigger>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger variant="background" value="code" disabled>
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
          </div>
        </div>

        <TabsContent value="preview" className="mt-4">
          <div className="relative w-full overflow-hidden">
            <DashedCard>
              {useSVG ? (
                <a href={finalRootUrl} target="_blank">
                  <img
                    src={`/api/tiers/${site?.userId}${queryParams ? "?" + queryParams : ""}`}
                    alt={site}
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

        <TabsContent value="code" className="mt-4">
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
      </Tabs>
    </div>
  );
}
