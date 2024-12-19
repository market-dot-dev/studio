"use client";

import { Text, Flex, Card } from "@tremor/react";
import { useEffect, useState } from "react";
import { getTiersForUser } from "@/app/services/TierService";
import { AlertCircle } from "lucide-react";
import { TextInput } from "flowbite-react";

export type GithubTiersEmbedSettingsProps = {
  darkmode: boolean | undefined;
  tiers: string[];
  height?: number;
};

export type TierItem = {
  name: string;
  id: string;
};

type SettingsContext = {
  tiers: TierItem[];
};

export default function GithubTiersEmbedSettings({
  site,
  settings,
  setSettings,
}: {
  site: any;
  settings: GithubTiersEmbedSettingsProps;
  setSettings: any;
}) {
  const [settingsContext, setSettingsContext] = useState<SettingsContext>({
    tiers: [],
  });
  const [heightBuffer, setHeightBuffer] = useState(settings.height);

  useEffect(() => {
    const action = async () => {
      const tiers = await getTiersForUser(site.userId);
      setSettingsContext({
        tiers: tiers.map((tier: any) => {
          return {
            name: tier.name,
            id: tier.id,
          };
        }),
      });

      // by default all tiers are selected
      setSettings({ tiers: tiers.map((tier: any) => tier.id) });
    };
    action();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSettings((prev: any) => ({
        ...prev,
        height: heightBuffer,
      }));
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timeout);
  }, [heightBuffer]);

  return (
    <Flex flexDirection="col" alignItems="start" className="grow gap-4">
      <label>
        <Flex className="gap-2">
          <input
            type="checkbox"
            className="rounded-md border-gray-600 p-3 accent-green-400"
            checked={settings.darkmode}
            onChange={(e) => {
              setSettings((prev: any) => {
                if (e.target.checked) {
                  return { ...prev, darkmode: e.target.checked };
                } else {
                  const { darkmode, ...rest } = prev;
                  return rest;
                }
              });
            }}
          />
          <Text>Dark Mode</Text>
        </Flex>
      </label>
      <Text>Only display selected tiers</Text>
      <Flex flexDirection="col" alignItems="start" className="gap-2">
        {settingsContext.tiers.map((tier: TierItem) => {
          return (
            <Flex key={tier.id} className="gap-2" justifyContent="start">
              <input
                type="checkbox"
                className="rounded-md border-gray-600 p-3 accent-green-400"
                checked={settings.tiers?.includes(tier.id)}
                onChange={(e) => {
                  setSettings((prev: any) => {
                    if (e.target.checked) {
                      let tiers = prev.tiers || [];
                      return { ...prev, tiers: [...tiers, tier.id] };
                    } else {
                      let newTiers = prev.tiers.filter(
                        (id: string) => id !== tier.id,
                      );
                      if (newTiers.length === 0) {
                        const { tiers, ...rest } = prev;
                        return rest;
                      }
                      return { ...prev, tiers: newTiers };
                    }
                  });
                }}
              />
              <Text>{tier.name}</Text>
            </Flex>
          );
        })}
      </Flex>
      <Text>Height (optional)</Text>
      <TextInput
        type="number"
        value={heightBuffer}
        onChange={(e) => {
          setHeightBuffer(e.target.value as any);
        }}
      />
      <div className="flex grow items-end">
        <Card className="mb-4 flex flex-row items-start justify-between border border-gray-400 bg-gray-100 px-4 py-3 text-gray-700">
          <AlertCircle size={24} className="mr-2 h-full w-1/4" />
          <Text>
            For up-to-date GitHub embeds, refresh the cache by recommitting the
            README with the same embed code.
          </Text>
        </Card>
      </div>
    </Flex>
  );
}
