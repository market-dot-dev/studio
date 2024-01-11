import { Text, Flex, TextInput, NumberInput } from "@tremor/react";

export type TiersEmbedSettingsProps = {
  cols: number | undefined
}

export default function TiersEmbedSettings({settings, setSettings} : { settings: TiersEmbedSettingsProps, setSettings: any}) {
  return (
    <Flex flexDirection="col" alignItems="start" className="gap-6">
      <Flex flexDirection="col" alignItems="start" className="gap-1">
        <Text>Columns</Text>
        <NumberInput
          placeholder="3" 
          value={settings.cols ?? '3'} 
          onChange={(e) => {
            setSettings((prev: any) => ({...prev, cols: e.target.value}))
          }}
          min={1}
          max={6}
          />
      </Flex>
    </Flex>
  )
}