'use client'
import { Text, Flex, TextInput, NumberInput, Switch, Title } from "@tremor/react";
import { useEffect } from "react";

import type { TierItem } from "@/components/site/github-embeds/tiers/github-tiers-embed-settings";

export type TiersEmbedSettingsProps = {
  darkmode: boolean | undefined;
  tiers: string[] | undefined;
}

export default function TiersEmbedSettings({settings, setSettings, tiers } : { settings: TiersEmbedSettingsProps, setSettings: any, tiers: any[]}) {

  useEffect(() => {
    setSettings({tiers: tiers.map((tier: any) => tier.id)})
  }, [])

  return (
    <Flex flexDirection="col" alignItems="start" className="gap-6">
      
        {/* <Text>Columns</Text>
        <NumberInput
          placeholder="3" 
          value={settings.cols ?? '3'} 
          onChange={(e) => {
            setSettings((prev: any) => ({...prev, cols: e.target.value}))
          }}
          min={1}
          max={6}
          /> */}
          <label>
            <Flex className="gap-2">
              <input
                type="checkbox"
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
          <Flex flexDirection="col" alignItems="start" className="gap-4">
          <Text>Only display selected tiers</Text>
            <Flex flexDirection="col" alignItems="start" className="gap-2">
              {tiers.map((tier: TierItem) => {
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
          </Flex>
      
    </Flex>
  )
}