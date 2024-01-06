'use client'

import { Text, Flex, TextInput, Select, SelectItem } from "@tremor/react";
import { useState, useEffect } from "react";

export type TierEmbedSettingsProps = {
  id: string | undefined,
  path: string | undefined
}

export default function TierEmbedSettings({settings, setSettings} : { settings: TierEmbedSettingsProps, setSettings: any}) {

    // getting the tiers by means of API routes
    const [tiers, setTiers] = useState([]);

    useEffect(() => {
        const getTiers = async () => {
            const response = await fetch('/api/preview/tiers');
            const tiers = await response.json();
            setTiers(tiers);
        }
        getTiers();
    }, []);

  return (
    <Flex flexDirection="col" alignItems="start" className="gap-6">

    <Flex flexDirection="col" alignItems="start" className="gap-1">
        <Text>Tier to display</Text>
        <Select value={settings.id ?? ''} onValueChange={(val) => {
            setSettings((prev: any) => ({...prev, id: val}))
        }}>
            {tiers.map((tier: any, index: number) => (
                <SelectItem key={index} value={tier.id}>{tier.name}</SelectItem>
            ))}
        </Select>
      </Flex>

      <Flex flexDirection="col" alignItems="start" className="gap-1">
        <Text>Link back path</Text>
        <TextInput placeholder="/" value={settings.path ?? ''} onChange={(e) => {
          setSettings((prev: any) => ({...prev, path: e.target.value}))
        }}/>
      </Flex>

    </Flex>
  )
}