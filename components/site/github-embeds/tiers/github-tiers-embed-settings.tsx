'use client'

import { Text, Flex } from "@tremor/react";
import { useEffect, useState } from "react";
import { getTiersForUser } from "@/app/services/TierService";

export type GithubTiersEmbedSettingsProps = {
  tiers: string[]
}

type TierItem = {
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
    }
    action();
  }, [])

  return (
    
    <Flex flexDirection="col" alignItems="start" className="gap-4">
      <Text>Only display selective tiers</Text>
        {settingsContext.tiers.map((tier: TierItem) => {
          return (
            
              <Flex key={tier.id} className="gap-2" justifyContent="start">
                <input
                  type="checkbox"
                  checked={settings.tiers?.includes(tier.id)}
                  onChange={(e) => {
                    setSettings((prev: any) => {
                      if(e.target.checked) {
                        let tiers = prev.tiers || [];
                        return {...prev, tiers: [...tiers, tier.id]}
                      } else {
                        return {...prev, tiers: prev.tiers.filter((id: string) => id !== tier.id)}
                      }
                    })
                  }} />
                <Text>{tier.name}</Text>
              </Flex>

          )
        })}

    </Flex>
    
  )
}