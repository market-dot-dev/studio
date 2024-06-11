'use client'

import { Text, Flex, Bold, Card } from "@tremor/react";
import { useEffect, useState } from "react";
import { getTiersForUser } from "@/app/services/TierService";
import LinkButton from "@/components/common/link-button";
import { AlertCircle } from "lucide-react";

export type GithubTiersEmbedSettingsProps = {
  darkmode: boolean | undefined;
  tiers: string[]
}

export type TierItem = {
  name: string;
  id: string;
}

type SettingsContext = {
    tiers: TierItem[];
};

export default function GithubTiersEmbedSettings({site, settings, setSettings} : { site: any, settings: GithubTiersEmbedSettingsProps, setSettings: any}) {
  
  const [settingsContext, setSettingsContext ] = useState<SettingsContext>({tiers: []});

  useEffect(() => {
    const action = async () => {
      const tiers = await getTiersForUser(site.userId);
      setSettingsContext({tiers: tiers.map((tier: any) => {
        return {
          name: tier.name,
          id: tier.id
        }
      })})
      
      // by default all tiers are selected
      setSettings({tiers: tiers.map((tier: any) => tier.id)})
    }
    action();
  }, [])

  return (
    
    <Flex flexDirection="col" alignItems="start" className="gap-4 grow">
      <label>
            <Flex className="gap-2">
              <input
                type="checkbox"
                className="border-gray-600 rounded-md p-3 accent-green-400"
                checked={settings.darkmode}
                onChange={(e) => {
                  setSettings((prev: any) => {
                    if(e.target.checked) {
                      return {...prev, darkmode: e.target.checked}
                    } else {
                      const { darkmode, ...rest } = prev;
                      return rest;
                    }
                  })
                }} />
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
                  className="border-gray-600 rounded-md p-3 accent-green-400"
                  checked={settings.tiers?.includes(tier.id)}
                  onChange={(e) => {
                    setSettings((prev: any) => {
                      if(e.target.checked) {
                        let tiers = prev.tiers || [];
                        return {...prev, tiers: [...tiers, tier.id]}
                      } else {
                        
                        let newTiers = prev.tiers.filter((id: string) => id !== tier.id);
                        if(newTiers.length === 0) {
                          const { tiers, ...rest } = prev;  
                          return rest;
                        }
                        return {...prev, tiers: newTiers }
                      }
                    })
                  }} />
                <Text>{tier.name}</Text>
              </Flex>

          )
        })}
        </Flex>
      <div className="grow flex items-end">
        <Card
            className="mb-4 flex flex-row justify-between items-start bg-gray-100 border border-gray-400 px-4 py-3 text-gray-700"
          >
            <AlertCircle size={24} className="mr-2 h-full w-1/4" />
            <Text>For up-to-date GitHub embeds, refresh the cache by recommitting the README with the same embed code.</Text>
          </Card>
      </div>
    </Flex>
    
  )
}