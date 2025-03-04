"use client";

import { useEffect, useState } from "react";
import embedables from "../site/embedables";
import CodeSnippet from "./code-snippet";
import { Card } from "@/components/ui/card"

export default function EmbedItem({ site, index, hasActiveFeatures }: any) {
  const [settings, setSettings] = useState({} as any);
  const domain = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  const Component = embedables[index].preview;
  const Settings = embedables[index].settings;

  const [previewProps, setPreviewProps] = useState<any>(null);

  useEffect(() => {
    if (embedables[index].previewProps) {
      embedables[index].previewProps(site).then((props: any) => {
        setPreviewProps(props);
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-stretch gap-4">
      <h2 className="text-xl font-bold mt-6">Restore Onboarding State</h2>
      <div className="grid gap-8">
        <div className="col-span-1">
          <div className="flex w-full gap-6 items-stretch justify-start">
            <Card className="w-3/4">
              <div className="flex flex-col grow gap-6">
                {previewProps ? (
                  <Component
                    site={site}
                    settings={settings}
                    {...previewProps}
                    hasActiveFeatures={hasActiveFeatures}
                  />
                ) : null}

                <CodeSnippet
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
                />
              </div>
            </Card>
            <div className="flex flex-col items-start w-1/4 gap-4 justify-start">
              <h2 className="text-xl font-bold">Restore Onboarding State</h2>
              {previewProps ? (
                <Settings
                  settings={settings}
                  setSettings={setSettings}
                  {...previewProps}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

